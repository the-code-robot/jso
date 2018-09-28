'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ExpiredTokenError = require('../errors/ExpiredTokenError');

var _ExpiredTokenError2 = _interopRequireDefault(_ExpiredTokenError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Fetcher = function () {
  function Fetcher(jso) {
    _classCallCheck(this, Fetcher);

    this.jso = jso;
  }

  _createClass(Fetcher, [{
    key: '_fetch',
    value: function _fetch(url, opts) {
      return fetch(url, opts).then(function (response) {
        if (response.status === 401) {
          throw new _ExpiredTokenError2.default();
        }
        return response;
      });
    }
  }, {
    key: 'fetch',
    value: function fetch(url, opts, reccur) {
      var _this = this;

      reccur = reccur ? reccur : 0;
      if (reccur > 2) {
        throw new Error("Reccursion error. Expired tokens deleted and tried again multiple times.");
      }
      var getTokenOpts = {};
      var fetchOpts = {
        'mode': 'cors'
      };
      if (opts) {
        fetchOpts = opts;
        Object.assign(fetchOpts, opts);
      }
      if (opts && opts.jso) {
        Object.assign(getTokenOpts, opts.jso);
      }

      return this.jso.getToken(getTokenOpts).catch(function (err) {
        console.error("Error fetching token to use ", err);
      }).then(function (token) {
        // console.log("I got the token: ", token.access_token)

        if (!fetchOpts.headers) {
          fetchOpts.headers = {};
        }
        fetchOpts.headers.Authorization = 'Bearer ' + token.access_token;
        return _this._fetch(url, fetchOpts).catch(function (err) {
          if (err instanceof _ExpiredTokenError2.default) {
            console.error("Token was expired. Deleting all tokens for this provider and get a new one", err);
            _this.jso.wipeTokens();
            return _this.fetch(url, opts, reccur + 1);
          }
        });
      });
    }
  }]);

  return Fetcher;
}();

exports.default = Fetcher;