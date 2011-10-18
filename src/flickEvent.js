
/**
 * @class
 * @constructor
 * @param {Number} speedX x軸の速度
 * @param {Number} speedY y軸の速度
 */
function FlickEvent (speedX, speedY) {
  this = document.createEvent('UIEvents');
  this.initUIEvent('flick', true, true, window, 1);

  return this;
};
