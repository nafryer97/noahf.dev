import * as mediasizescss from './styles/media-sizes.css';
import * as mediacolorschemes from './styles/media-colorschemes.css';
import * as commoncss from './styles/common.css';
import * as maincss from './main.css';
import SVGMatrixGenerator from './scripts/matrixworker.js';
import createInlineWorker from './scripts/createinlineworker.js';
import {branchLen, initElementsFromWorkerData} from './scripts/fractaldomelements.js';

(() => {
  'use strict';
  const limit = 10;

  if (window.Worker) {
    const matrixWorker = createInlineWorker(SVGMatrixGenerator);
    matrixWorker.postMessage([limit, branchLen]);

    matrixWorker.onmessage = function (e) {
      matrixWorker.terminate();
      setTimeout(initElementsFromWorkerData, 0, e.data);
    };
  } 
})();
