
/**
 * @class
 * @constructor
 */
function Gesture (touches) {
  return new Gesture.fn.init(touches);
};

/**
 * @namespace
 */
Gesture.Constants = {
  /**
   * ロングタップと認識するまでの時間(ms)
   * @constant
   * @type Number
   */
  LONGTAP_LENGTH: 1000,

  /**
   * フリックとして認識される時間(ms)
   * @constant
   * @type Number
   */
  FLICK_LENGTH: 200
};

Gesture.fn = Gesture.prototype = /** @lends Gesture.prototype */{
  constructor: Gesture,

  init: function(owner, touches) {
    this.fingers = touches.length;

    this.baseTouch = Gesture.touches2data(touches);
    this.touchRecorder = [this.baseTouch];

    this.startTime = (new Date()).getTime();

    this.isSwipe = true;
    if (this.fingers == 1) {
      this.isTap = true;
      this.longTapTimer = setTimeout(function(){ this.isLongTap = true; this.end(); }, Gesture.Constants.LONGTAP_LENGTH);
      this.isFlick = true;
      this.flickTimer = setTimeout(function(){ this.isFlick = false; }, Gesture.Constants.FLICK_LENGTH);
    };
    if (this.fingers == 2) {
      this.isPinch = true;
    };
  },

  record: function(touches) {
    this.touchRecorder.push(Gesture.touches2data(touches));
  },

  end: function() {
    if (this.longTapTimer)
      clearTimeout(this.longTapTimer);
    if (this.flickTimer)
      clearTimeout(this.flickTimer);
    this.endTime = (new Date()).getTime();

    if (this.isLongTap)
      this.dispach(new LongTapEvent());

    var gesture = this.calculationDistance();
  },

  calculationDistance: function() {
    if (this.fingers == 1) {
      var lastTouch = this.touchRecorder[this.touchRecorder.length];
      var x = lastTouch.x - this.baseTouch.x;
      var y = lastTouch.y - this.baseTouch.y;
      return {x: x, y: y};
    } else if (this.fingers == 2) {
    } else {
    };
  },

  /** @type Boolean */ isSwipe: false,
  /** @type Boolean */ isTap: false,
  /** @type Boolean */ isLongTap: false,
  /** @type Boolean */ isFlick: false,
  /** @type Boolean */ isPinch: false,

  /**
   * touchesオブジェクトを格納した配列
   * @type Array
   */
  touchRecorder: [],

  /**
   * ジェスチャ入力開始時間(ms)
   * @type Number
   */
  startTime: 0,

  /**
   * ジェスチャ入力終了時間(ms)
   * @type Number
   */
  endTime: 0,

  /**
   * @type Number
   */
  fingers: 0
};

spTouch.ext(
  /**
   * @lends Gesture
   */
  {
  touches2data: function(touches) {
    var data = [];
    spTouch.each(touches, function(touch) {
        data.push({
            x: touch.clientX,
            y: touch.clientY
          });
      });
    return data;
  }
}, Gesture);

/**
 * @namespace
 */
Gesture.Listeners = {
  touchstart: function(event) {
    event.target.__gesture = new Gesture(event.target, event.touches);
  },

  touchmove: function(event) {
    event.target.__gesture.record(event.touches);
  },

  touchend: function(event) {
    event.target.__gesture.end();
  }
};
