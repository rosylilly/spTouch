
var example;
module('core', {
    setup: function() {
      example = document.getElementById('testObj');
      ok(true);
    },
    teardown: function() {
      ok(true);
    }
});

test('HTMLElementから生成する', function() {
    var sp = spTouch(example);

    equal(sp[0], example);
  });

test('CSSセレクタから生成する(ID)', function() {
    var sp = spTouch('#testObj');

    equal(sp[0], example);
  });

test('CSSセレクタから生成(Class)', function() {
    var sp = spTouch('.front');

    equal(sp.length, 3);
    equal(sp[0], example.children[0]);
  });

test('CSSセレクタから生成(tagName)', function() {
    var sp = spTouch('div#testObj > p');

    equal(sp.length, 6);
    equal(sp[0], example.children[0]);
  });

test('HTMLElementでもStringでもArrayでもなければException', function() {
    expect(3);
    try {
      spTouch({});
    } catch(e) {
      ok(true);
    };
  });

module('core.static');

test('each', function() {
    expect(3);
    spTouch.each([1, 1, 1], function(n) {
        ok(n === 1);
      });
  });

test('isString', function() {
    ok(spTouch.isString(''));
    ok(!spTouch.isString({}));
  });

test('isArray', function() {
    ok(spTouch.isArray([]));
    ok(!spTouch.isArray({}));
  });

test('isDOMObject', function() {
    ok(spTouch.isDOMObject(document.body));
    ok(!spTouch.isDOMObject({nodeType:null}));
  });
