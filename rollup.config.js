/* jshint node: true */
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import {terser} from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import path from 'path';
import livereload from 'rollup-plugin-livereload';
import {sizeSnapshot} from 'rollup-plugin-size-snapshot';
import progress from 'rollup-plugin-progress';
import cleanup from 'rollup-plugin-cleanup';
import * as fs from 'fs';

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

function serve() {
  'use strict';
  let server;

  function toExit() {
    if (server) { 
      server.kill(0);
    }
  }

  return {
    writeBundle() {
      if (server) {
        return;
      }

      server = require('child_process').spawn(
        'npm',
        ['run', 'start', '--', '--dev'],
        {
          stdio: ['ignore', 'inherit', 'inherit'],
          shell: true,
        }
      );

      process.on('SIGTERM', toExit);
      process.on('exit', toExit);
    },
  };
}

export default {
  input: 'src/main.js',
  output: [
    {
      dir: 'public/build',
      format: 'iife',
      sourcemap: !production,
      compact: production,
      validate: true,
      plugins: []
    },
  ],
  plugins: [
    resolve({
      browser: true,
    }),
    commonjs(),
    sizeSnapshot(),
    postcss({
      extract: path.resolve('public/build/bundle.css'),
      sourceMap: !production,
      minimize: production,
      plugins: [require('autoprefixer'), require('postcss-utilities')],
    }),
    progress(),
    terser(),
    serve(),
    !production && livereload({
      watch: 'public',
      verbose: 'true',
      debug: 'true',
      exclusions: [
        '.git',
        '.svn',
        '.hg',
        '.DS_Store'
      ],
      https: {
        key: fs.readFileSync('./localhost-key.pem'),
        cert: fs.readFileSync('./localhost-cert.pem'),
      }
    }),
    production &&
    cleanup({
        comments: 'none',
        lineEndings: 'mac',
        sourcemap: 'true',
      })
  ],
  watch: {
    clearScreen: false
  }
};
