
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
  LONGTAP_LENGTH: 400,

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

  /**
   * ジェスチャ入力を記録する
   * @param {Object} touches TouchEvent.touchesオブジェクト
   */
  record: function(touches) {
    this.isTap = false;
    this.touchRecorder.push(Gesture.touches2data(touches));

    if (this.isSwipe) {
      var gesture = this.calculationDistance('swipe');
      this.dispatch(new SwipeEvent(gesture.x, gesture.y));
    };
  },

  /**
   * ジェスチャ入力を終了
   */
  end: function() {
    if (this.ended)
      return;

    this.ended = true;
    if (this.longTapTimer)
      clearTimeout(this.longTapTimer);
    if (this.flickTimer)
      clearTimeout(this.flickTimer);
    this.endTime = (new Date()).getTime();
    this.element.gesture__ = null;

    if (this.isTap) {
      var tap = new TapEvent();
      if (this.isLongTap) {
        tap = new LongTapEvent();
      };

      this.dispatch(tap);
      return;
    };


    if (this.isFlick) {
      var gesture = this.calculationDistance('flick');
      this.dispatch(new FlickEvent(gesture.x, gesture.y));
      return;
    };
  },

  /**
   * element.dispatchEventのラッパ
   * @param {Event} event 発生させるイベント
   */
  dispatch: function(event) {
    var _this = this;
    setTimeout(function() {
      _this.element.dispatchEvent(event);
    }, 0);
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
    event.preventDefault();
    var touches = event.touches;
    if (event instanceof MouseEvent) { touches = [event] };
    event.target.gesture__ = new Gesture(event.target, touches);
  },

  touchmove: function(event) {
    event.preventDefault();
    if (event.target.gesture__) {
      var touches = event.touches;
      if (event instanceof MouseEvent) { touches = [event] };
      event.target.gesture__.record(touches);
    };
  },

  touchend: function(event) {
    event.preventDefault();
    if (event.target.gesture__) {
      event.target.gesture__.end();
    };
  }
};
