function SVGMatrixGenerator() {
  'use strict';

  function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
  }

  function recursiveMatrices(
    matArray,
    lvl,
    lim,
    len,
    theta,
    dtheta,
    cosTheta,
    sinTheta,
    alpha,
    scale,
    dscale,
    tx,
    ty
  ) {
    /*
     * | a=sxcos(theta) c=-sysin(theta) e=tx |
     * | b=sxsin(theta) d=sycos(theta)  f=ty |
     * | 0              0               1    |
     */
    if (lvl === 0) {
      matArray.push([lvl, [scale, 0, 0, scale, 0, 0]]);
      recursiveMatrices(
        matArray,
        lvl + 1,
        lim,
        len,
        theta,
        dtheta,
        cosTheta,
        sinTheta,
        alpha,
        scale,
        scale * dscale,
        0,
        0
      );
      recursiveMatrices(
        matArray,
        lvl + 1,
        lim,
        len,
        -theta,
        dtheta,
        cosTheta,
        -sinTheta,
        alpha,
        scale,
        scale * dscale,
        0,
        0
      );
    } else if (lvl < lim) {
      matArray.push([lvl, [
        dscale * cosTheta,
        dscale * sinTheta,
        dscale * -sinTheta,
        dscale * cosTheta,
        scale * -Math.sin(alpha) * len + tx,
        scale * Math.cos(alpha) * len + ty,
      ]]);
      recursiveMatrices(
        matArray,
        lvl + 1,
        lim,
        len,
        theta + dtheta,
        dtheta,
        Math.cos(theta + dtheta),
        Math.sin(theta + dtheta),
        theta,
        dscale,
        dscale * 0.8,
        scale * -Math.sin(alpha) * len + tx,
        scale * Math.cos(alpha) * len + ty
      );
      recursiveMatrices(
        matArray,
        lvl + 1,
        lim,
        len,
        theta - dtheta,
        dtheta,
        Math.cos(theta - dtheta),
        Math.sin(theta - dtheta),
        theta,
        dscale,
        dscale * 0.8,
        scale * -Math.sin(alpha) * len + tx,
        scale * Math.cos(alpha) * len + ty
      );
    }
  }

  function SVGTreeDisplay(branchLen, initialScale, branchLim, theta, dTheta) {
    const temp = [];
    const sorted = [];

    recursiveMatrices(
      temp,
      0,
      branchLim,
      branchLen,
      theta,
      dTheta,
      Math.cos(theta),
      Math.sin(theta),
      0,
      initialScale,
      0.67,
      0,
      0
    );

    temp.sort((a, b) => {
      return a[0] - b[0];
    });
    
    temp.forEach((el) => {
      sorted.push(el[1]);
    });

    return sorted;
  }

  self.onmessage = function (e) {
    const maxLevel = e.data[0];
    const branchLen = e.data[1];
    const initialScale = 2.5;
    const theta = Math.PI / randomNumber(4, 6);
    const dTheta = Math.PI / randomNumber(4, 6);
    const matrices = [];
    SVGTreeDisplay(branchLen, initialScale, maxLevel, theta, dTheta).forEach(
      (entry) => {
        matrices.push(`matrix(${entry.toString()})`);
      }
    );

    postMessage(matrices);
  };
}

export default SVGMatrixGenerator;
