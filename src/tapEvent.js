
/**
 * @class
 * @constructor
 */
function TapEvent () {
  event = document.createEvent('UIEvents');
  event.initUIEvent('tap', true, true, window, 1);

  return event;
};

spTouch.TapEvent = TapEvent;

