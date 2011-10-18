
/**
 * @class
 * @constructor
 */
function Gesture (owner, touches) {
  return new Gesture.fn.init(owner, touches);
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
  LONGTAP_LENGTH: 800,

  /**
   * フリックとして認識される時間(ms)
   * @constant
   * @type Number
   */
  FLICK_LENGTH: 100
};

Gesture.fn = Gesture.prototype = /** @lends Gesture.prototype */{
  constructor: Gesture,

  init: function(owner, touches) {
    this.element = owner;
    this.fingers = touches.length;

    this.baseTouch = Gesture.touches2data(touches);
    this.touchRecorder = [this.baseTouch];

    this.startTime = (new Date()).getTime();

    this.ended = false;

    this.isSwipe = true;
    this.isTap = false;
    this.isLongTap = false;
    this.isFlick = false;
    this.isPinch = false;
    if (this.fingers == 1) {
      this.isTap = true;
      this.isFlick = true;
      var _this = this;
      this.longTapTimer = setTimeout(function(){ if (_this.isTap) { _this.isLongTap = true; _this.end(); }; }, Gesture.Constants.LONGTAP_LENGTH);
      this.flickTimer = setTimeout(function(){ _this.isFlick = false; }, Gesture.Constants.FLICK_LENGTH);
    };
    if (this.fingers == 2) {
      this.isPinch = true;
    };
  },

  record: function(touches) {
    this.isTap = false;
    this.touchRecorder.push(Gesture.touches2data(touches));
  },

  end: function() {
    if (this.ended)
      return;

    this.ended = true;
    if (this.longTapTimer)
      clearTimeout(this.longTapTimer);
    if (this.flickTimer)
      clearTimeout(this.flickTimer);
    this.endTime = (new Date()).getTime();

    if (this.isTap) {
      var tap = new TapEvent();
      if (this.isLongTap) {
        tap = new LongTapEvent();
      };

      this.dispatch(tap);
      return;
    };

    var gesture = this.calculationDistance();

    if (this.isFlick) {
      this.dispatch(new FlickEvent(gesture.x, gesture.y));
      return;
    };

    this.element.gesture__ = null;
  },

  dispatch: function(event) {
    var _this = this;
    setTimeout(function() {
      _this.element.dispatchEvent(event);
    }, 0);
  },

  calculationDistance: function() {
    var lastTouch = this.touchRecorder[this.touchRecorder.length - 1];
    if (this.fingers == 1) {
      var x = this.baseTouch[0].x - lastTouch[0].x;
      var y = this.baseTouch[0].y - lastTouch[0].y;
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
Gesture.fn.init.prototype = Gesture.fn;

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
    var touches = event.touches;
    if (event instanceof MouseEvent) { touches = [event] };
    event.target.gesture__ = new Gesture(event.target, touches);
  },

  touchmove: function(event) {
    if (event.target.gesture__) {
      var touches = event.touches;
      if (event instanceof MouseEvent) { touches = [event] };
      event.target.gesture__.record(touches);
    };
  },

  touchend: function(event) {
    if (event.target.gesture__) {
      event.target.gesture__.end();
    };
  }
};
