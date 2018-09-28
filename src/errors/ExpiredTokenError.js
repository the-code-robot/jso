'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Error2 = require('./Error');

var _Error3 = _interopRequireDefault(_Error2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ExpiredTokenError = function (_Error) {
  _inherits(ExpiredTokenError, _Error);

  function ExpiredTokenError() {
    _classCallCheck(this, ExpiredTokenError);

    return _possibleConstructorReturn(this, (ExpiredTokenError.__proto__ || Object.getPrototypeOf(ExpiredTokenError)).apply(this, arguments));
  }

  return ExpiredTokenError;
}(_Error3.default);

exports.default = ExpiredTokenError;