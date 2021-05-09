function fn2workerURL(fn) {
  'use strict';
  const blob = new Blob([`(${fn.toString()})()`], {
    type: 'text/javascript',
  });
  return URL.createObjectURL(blob);
}

function createInlineWorker(workerFunc) {
  'use strict';
  const matrixWorker = new Worker(fn2workerURL(workerFunc), {
    type: 'classic',
    credentials: 'omit',
    name: 'matrixWorker',
  });

  return matrixWorker;
}

export default createInlineWorker;
