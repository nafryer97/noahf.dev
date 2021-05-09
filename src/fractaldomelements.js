import anime from 'animejs/lib/anime.es.js';

const svgns = 'http://www.w3.org/2000/svg';
const scrWidth = window.screen.width;
const scrHeight = window.screen.height;
const branchLen = scrHeight / 3.9;
let branchCount = 1;

function createAndAnimate(svgGroup, matrices, docFrag) {
  'use strict';

  function appendAndAnimate(tlGroups) {
    const tl = anime.timeline({
      easing: 'easeInOutSine',
      duration: 700
    });

    document.body.children.item(0).appendChild(docFrag);

    tlGroups.forEach((el) => {
      tl.add(el);
    });
  }

  function generateTLGroups() {
    const limit = Math.floor(Math.log2(branchCount));
    const result = [];

    for (let i = 0; i < limit; ++i) {
      result.push({
        targets: `.branch-level-${i}`,
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'easeInOutSine',
        direction: 'normal',
      });
    }

    setTimeout(appendAndAnimate, 0, result);
  }

  function appendLineChildren() {
    if (matrices.length > 0) {
      const line = document.createElementNS(svgns, 'line');
      let level = Math.floor(Math.log2(branchCount));
      line.setAttributeNS(null, 'x1', 0);
      line.setAttributeNS(null, 'y1', 0);
      line.setAttributeNS(null, 'x2', 0);
      line.setAttributeNS(null, 'y2', branchLen);
      line.setAttributeNS(null, 'transform', matrices.shift());
      line.setAttributeNS(null, 'class', `branch-level-${level}`);
      svgGroup.appendChild(line);
      ++branchCount;
      setTimeout(appendLineChildren, 0);
    } else {
      setTimeout(generateTLGroups, 0);
    }
  }

  appendLineChildren();
}

function initElementsFromWorkerData(matrices) {
  'use strict';
  const docFrag = new DocumentFragment();
  const svg = document.createElementNS(svgns, 'svg');
  const treeGroup = document.createElementNS(svgns, 'g');
  svg.setAttributeNS(null, 'id', 'svg-bg-container');
  svg.setAttributeNS(null, 'viewbox', `0 0 ${scrWidth} ${scrHeight}`);
  svg.setAttributeNS(null, 'preserveaspectratio', 'xMinYMin slice');
  treeGroup.setAttributeNS(null, 'id', 'treeGroup');
  treeGroup.setAttributeNS(
    null,
    'transform',
    `matrix(1 0 0 -1 ${scrWidth / 2} ${scrHeight})`
  );
  svg.appendChild(treeGroup);
  docFrag.appendChild(svg);
  setTimeout(createAndAnimate, 0, treeGroup, matrices, docFrag);
}

export {branchLen, initElementsFromWorkerData};
