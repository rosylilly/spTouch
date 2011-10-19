
/**
 * @class
 * @constructor
 * @param {Number} moveX x軸の移動
 * @param {Number} moveY y軸の移動
 * @param {Event} parentEvent 親イベント
 */
function SwipeEvent (moveX, moveY, parentEvent) {
  event = document.createEvent('UIEvents');
  event.initUIEvent('swipe', true, true, window, 1);

  event.moveX = moveX;
  event.moveY = moveY;

  event.parentEvent = parentEvent;

  return event;
};

spTouch.SwipeEvent = SwipeEvent;

