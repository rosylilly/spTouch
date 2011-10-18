
/**
 * @class
 * @constructor
 * @param {Number} speedX x軸の速度
 * @param {Number} speedY y軸の速度
 */
function FlickEvent (speedX, speedY) {
  event = document.createEvent('UIEvents');
  event.initUIEvent('flick', true, true, window, 1);

  event.speedX = speedX;
  event.speedY = speedY;

  return event;
};

spTouch.FlickEvent = FlickEvent;
