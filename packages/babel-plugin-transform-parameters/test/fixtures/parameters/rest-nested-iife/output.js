function broken(x) {
  if (true) {
    var Foo = /*#__PURE__*/function (_Bar) {
      "use strict";

      babelHelpers.inherits(Foo, _Bar);
      function Foo() {
        babelHelpers.classCallCheck(this, Foo);
        return babelHelpers.callSuper(this, Foo, arguments);
      }
      return babelHelpers.createClass(Foo);
    }(Bar);
    for (var _len = arguments.length, foo = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      foo[_key - 1] = arguments[_key];
    }
    return hello.apply(void 0, foo);
  }
}
