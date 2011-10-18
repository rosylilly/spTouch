
/**
 * @class
 * @constructor
 * @param {Number} moveX x軸の移動
 * @param {Number} moveY y軸の移動
 */
function SwipeEvent (moveX, moveY) {
  event = document.createEvent('UIEvents');
  event.initUIEvent('swipe', true, true, window, 1);

  event.moveX = moveX;
  event.moveY = moveY;

  return event;
};

spTouch.SwipeEvent = SwipeEvent;

