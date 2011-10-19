
/**
 * @class
 * @constructor
 */
function Gesture (owner, touches) {
  return new Gesture.fn.init(owner, touches);
};

Gesture.timers = {
  longTap: null
};

Gesture.capturing = false;

/**
 * @namespace
 */
Gesture.Constants = {
  /**
   * ロングタップと認識するまでの時間(ms)
   * @constant
   * @type Number
   */
  LONGTAP_LENGTH: 500,

  /**
   * フリックとして認識される時間(ms)
   * @constant
   * @type Number
   */
  FLICK_LENGTH: 200
};

Gesture.fn = Gesture.prototype = /** @lends Gesture.prototype */{
  constructor: Gesture,

  /**
   * @private
   */
  init: function(event, touches) {
    if (Gesture.capturing) {
      setTimeout(function() { event.target.gesture__ = null; }, 50);
      return this;
    }

    Gesture.capturing = true;

    this.event = event;
    this.element = event.target;
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
      var _this = this;

      if (typeof Gesture.timers.longTap == 'number') {
        clearTimeout(Gesture.timers.longTap);
      };
      Gesture.timers.longTap = setTimeout(function() {
          if (_this.isTap && !_this.ended) {
            _this.isLongTap = true;
            _this.end();
          };
        }, Gesture.Constants.LONGTAP_LENGTH);
    };
    if (this.fingers == 2) {
      this.isPinch = true;
    };

    return this;
  },

  /**
   * ジェスチャ入力を記録する
   * @param {Event} event TouchEventオブジェクト
   */
  record: function(event) {
    this.isTap = false;
    this.touchRecorder.push(Gesture.touches2data(event.touches));
    
    if (this.isSwipe) {
      var gesture = this.calculationDistance('swipe');

      this.dispatch(new SwipeEvent(gesture.x, gesture.y, event));
    };
  },

  /**
   * ジェスチャ入力を終了
   */
  end: function() {
    if (this.ended)
      return;

    this.ended = true;
    this.endTime = (new Date()).getTime();
    this.element.gesture__ = null;

    if (typeof Gesture.timers.longTap == 'number') {
      clearTimeout(Gesture.timers.longTap);
    };

    var length = this.endTime - this.startTime;

    if (length < Gesture.Constants.LONGTAP_LENGTH) { this.isLongTap = false; };
    if (length < Gesture.Constants.FLICK_LENGTH) { this.isFlick = true };

    switch (true) {
    case this.isLongTap:
      this.dispatch(new LongTapEvent());
      break;
    case this.isTap:
      this.dispatch(new TapEvent());
      break;
    case this.isFlick:
      var gesture = this.calculationDistance('flick');
      this.dispatch(new FlickEvent(gesture.x, gesture.y));
      break;
    };

    Gesture.capturing = false;
  },

  /**
   * element.dispatchEventのラッパ
   * @param {Event} event 発生させるイベント
   */
  dispatch: function(event) {
    this.element.dispatchEvent(event);
  },

  /**
   * 移動距離計算
   * @param {String} type 計算パターン
   */
  calculationDistance: function(type) {
    var x,y,lastTouch = this.touchRecorder[this.touchRecorder.length - 1];

    switch (type) {
    case 'flick':
      x = this.baseTouch[0].x - lastTouch[0].x;
      y = this.baseTouch[0].y - lastTouch[0].y;
      break;
    case 'swipe':
      var index = this.touchRecorder.length - 2;
      if (index < 0) { index = 0 };
      var beforeTouch = this.touchRecorder[index];
      x = beforeTouch[0].x - lastTouch[0].x;
      y = beforeTouch[0].y - lastTouch[0].y;
      break;
    };

    return {x: x, y: y};
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
   * ジェスチャ入力している指の本数
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
    if (!event.target.gesture__) {
      var touches = event.touches;
      event.target.gesture__ = new Gesture(event, touches);
    };
  },

  touchmove: function(event) {
    if (event.target.gesture__) {
      event.target.gesture__.record(event);
    };
  },

  touchend: function(event) {
    if (event.target.gesture__) {
      event.target.gesture__.end();
    };
  },

  documentscroll: function(event) {
  },

  documenttouchstart: function(event) {
  },

  documenttouchmove: function(event) {
  },

  documenttouchend: function(event) {
  }
};
