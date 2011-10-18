
module('flickEvent');

test('ちゃんと生成できるか', function() {
    var fe = new spTouch.FlickEvent(0, 0);

    ok(fe);
    ok(fe instanceof UIEvent);
    equal('flick', fe.type);
  });
