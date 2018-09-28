'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BasicLoader2 = require('./BasicLoader');

var _BasicLoader3 = _interopRequireDefault(_BasicLoader2);

var _utils = require('../utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var IFramePassive = function (_BasicLoader) {
  _inherits(IFramePassive, _BasicLoader);

  function IFramePassive(url) {
    _classCallCheck(this, IFramePassive);

    var _this = _possibleConstructorReturn(this, (IFramePassive.__proto__ || Object.getPrototypeOf(IFramePassive)).call(this, url));

    _this.timeout = 5000;
    _this.callback = null;
    _this.isCompleted = false;
    _this.id = 'jso_passive_iframe_' + _utils2.default.uuid();

    // Create IE + others compatible event handler
    var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
    var eventer = window[eventMethod];
    var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

    _this.iframe = document.createElement('iframe');
    _this.iframe.setAttribute('id', _this.id);
    _this.iframe.setAttribute('src', url);

    _this.iframe.addEventListener('load', function (e) {

      var object = null;
      try {
        if (_this.iframe.contentWindow.location.hash) {
          var encodedHash = _this.iframe.contentWindow.location.hash.substring(1);
          object = _utils2.default.parseQueryString(encodedHash);
        } else if (_this.iframe.contentWindow.location.search) {
          var _encodedHash = _this.iframe.contentWindow.location.search.substring(1);
          object = _utils2.default.parseQueryString(_encodedHash);
        }

        if (object !== null) {
          _this._completed(object);
        } else {
          _this._failed(new Error("Failed to obtain response value from iframe"));
        }
      } catch (err) {
        // Most likely not able to access the content window because of same-origin policy.
        //
        // Ignore this error, as this is likely to happen during the SSO redirect loop, but the load
        // event may be triggered multiple times, so it is not neccessary a problem that the first is not
        // accessible.
      }
    });

    return _this;
  }

  _createClass(IFramePassive, [{
    key: 'execute',
    value: function execute() {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        _this2.callback = resolve;
        _this2.errorCallback = reject;
        document.getElementsByTagName('body')[0].appendChild(_this2.iframe);

        setTimeout(function () {
          _this2._failed(new Error("Loading iframe timed out"));
        }, _this2.timeout);
      });
    }
  }, {
    key: '_cleanup',
    value: function _cleanup() {
      var element = document.getElementById(this.id);
      element.parentNode.removeChild(element);
    }
  }, {
    key: '_failed',
    value: function _failed(err) {
      if (!this.isCompleted) {
        if (this.errorCallback && typeof this.errorCallback === 'function') {
          this.errorCallback(err);
        }
        this.isCompleted = true;
        this._cleanup();
      }
    }
  }, {
    key: '_completed',
    value: function _completed(response) {
      if (!this.isCompleted) {
        if (this.callback && typeof this.callback === 'function') {
          this.callback(response);
        }
        this.isCompleted = true;
        this._cleanup();
      }
    }
  }]);

  return IFramePassive;
}(_BasicLoader3.default);

exports.default = IFramePassive;