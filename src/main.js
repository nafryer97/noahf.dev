import styles from './styles.css';
import SVGMatrixGenerator from './matrixworker.js';
import createInlineWorker from './createinlineworker.js';
import {branchLen, initElementsFromWorkerData} from './fractaldomelements.js';

(() => {
  'use strict';
  const limit = 11;

  if (window.Worker) {
    const matrixWorker = createInlineWorker(SVGMatrixGenerator);
    matrixWorker.postMessage([limit, branchLen]);

    matrixWorker.onmessage = function (e) {
      matrixWorker.terminate();
      setTimeout(initElementsFromWorkerData, 0, e.data);
    };
  } 
})();
