
/**
 * @class
 * @constructor
 */
function LongTapEvent () {
  event = document.createEvent('UIEvents');
  event.initUIEvent('longtap', true, true, window, 1);

  return event;
};

spTouch.LongTapEvent = LongTapEvent;


