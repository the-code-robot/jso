'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _EventEmitter2 = require('../EventEmitter');

var _EventEmitter3 = _interopRequireDefault(_EventEmitter2);

var _JSO = require('../JSO');

var _JSO2 = _interopRequireDefault(_JSO);

var _utils = require('../utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
// import ExpiredTokenError from '../errors/ExpiredTokenError'

// Work in progress

var Authentication = function (_EventEmitter) {
  _inherits(Authentication, _EventEmitter);

  function Authentication(config) {
    _classCallCheck(this, Authentication);

    var _this = _possibleConstructorReturn(this, (Authentication.__proto__ || Object.getPrototypeOf(Authentication)).call(this));

    _this.jso = new _JSO2.default(config);
    _this.fetcher = new Fetcher(_this.jso);
    _this.state = 'unauthenticated';
    return _this;
  }

  _createClass(Authentication, [{
    key: 'authenticate',
    value: function authenticate() {
      return this.jso.getToken();
    }
  }, {
    key: 'logout',
    value: function logout() {}
  }]);

  return Authentication;
}(_EventEmitter3.default);

//
//
// define(function(require, exports, module) {
// 	"use strict";
//
// 	var Class  = require('../class');
// 	var EventEmitter = require('../EventEmitter');
// 	var
// 		JSO = require('bower/jso/src/jso'),
// 		$ = require('jquery');
//
// 	var Authentication = Class.extend({
//
//
// 		"init": function(config) {
//
// 			var that = this;
// 			var defaults = {
// 				"providerId"	: "feideconnect",
//
// 				"client_id"		: "c148bc3f-6b15-47d7-ad23-3c36677eb8b5",
// 				"redirect_uri"	: "https://min.dev.feideconnect.no/index.dev.html",
// 				"redirect_uri_passive"	: "https://min.dev.feideconnect.no/passiveCallback.html",
// 				"redirect_uri_popup"	: "https://min.dev.feideconnect.no/popupCallback.html",
//
// 				"authorization"	: "https://auth.dev.feideconnect.no/oauth/authorization",
// 				"token"			: "https://auth.dev.feideconnect.no/oauth/token",
// 				"userInfo"		: "https://auth.dev.feideconnect.no/userinfo",
//
// 				// Legal values: "none", "passiveIFrame", "passive", "active"
// 				"onLoad": "passiveIFrame"
// 			};
//
// 			this._authenticated = null;
// 			this.user = null;
//
// 			this.config = $.extend({}, defaults, config);
//
// 			this.jso = new JSO(this.config);
// 			// this.jso.setLoader(JSO.IFramePassive);
// 			this.jso.setLoader(JSO.HTTPRedirect);
//
// 			console.log("JSO Loaded", this.config);
//
// 			this.jso.callback()
// 				.catch(function(err) {
// 					console.error("---- OAuth error detected ----");
// 					console.error(err);
//
// 					that.emit("error", err);
// 				});
//
//
// 			this.checkAuthenticationCached()
// 				.then(function(auth) {
// 					if (!auth && that.config.onLoad && that.config.onLoad !== "none") {
//
// 						switch(that.config.onLoad) {
// 							case "passiveIFrame":
// 								return that.checkAuthenticationPassiveIFrame();
//
// 							case "passive":
// 								return that.checkAuthenticationPassive();
//
// 							case "active":
// 								return that.authenticate();
// 						}
//
// 					}
//
// 				})
// 				.then(function() {
// 					that.emit("loaded");
// 					// console.error("LOADED LOADED LOADED LOADED LOADED LOADED LOADED ");
//
// 					if (!that.isAuthenticated()) {
// 						that.emit("stateChange", that._authenticated, that.user);
// 					}
//
// 				});
//
//
// 		},
// 		"getConfig": function() {
// 			return this.config;
// 		},
// 		"isAuthenticated": function() {
// 			return this._authenticated;
// 		},
// 		"onAuthenticated": function() {
// 			var that = this;
// 			return Promise.resolve().then(function() {
// 				if (that.isAuthenticated()) {
// 					return true;
// 				}
// 				return new Promise(function(resolve, reject) {
// 					that.on("stateChange", function(auth, user) {
// 						if (auth) {resolve();}
// 					});
// 				});
// 			});
// 		},
//
// 		"checkAuthenticationCached": function() {
// 			var that = this;
// 			return Promise.resolve().then(function() {
//
//
// 				// Check if this object is already authenticated..
// 				if (that.isAuthenticated()) {
// 					return true;
// 				}
//
// 				// Check if we have a cached OAuth token in document storage, then we
// 				// will use that to reverify the userinfo endpoint.
//
//
// 				return that.checkUserInfo({
// 					"oauth": {
// 						"allowia": false,
// 						"allowredir": false
// 					}
// 				});
//
// 			});
// 		},
//
// 		"checkUserInfo": function(setOptions) {
//
// 			var that = this;
// 			var defaults = {
// 				"url": this.config.userInfo,
// 				"oauth": {
// 					"scopes": {
// 						"require": ["openid"]
// 					},
// 					"allowia": true,
// 					"allowredir": true
// 				}
// 			};
// 			var options = $.extend(true, {}, defaults, setOptions);
//
// 			this.authenticationInProgress = true;
//
// 			// console.error("Check userinfo with this config", options);
//
// 			return this.jso.request(options).then(function(res) {
//
// 				if  (res.audience !== that.config.client_id) {
// 					throw new Error('Wrong audience for this token.');
// 				}
// 				that.user = res.user;
// 				that._authenticated = true;
// 				that.emit("stateChange", that._authenticated, that.user);
//
// 				that.authenticationInProgress = false;
// 				return res;
// 			}).catch(function(err) {
// 				console.error("checkUserInfo failed", err);
// 				// return false;
// 			});
//
// 		},
//
// 		"getUser": function() {
// 			return this.user;
// 		},
// 		"authenticate": function() {
// 			return this.checkUserInfo();
// 		},
// 		"checkAuthenticationPassive": function() {
// 			return this.checkUserInfo({
// 				"oauth": {
// 					"allowia": false,
// 					"allowredir": true
// 				}
// 			});
// 		},
// 		"checkAuthenticationPassiveIFrame": function() {
// 			var that = this;
// 			return this.checkUserInfo({
// 				"oauth": {
// 					"allowia": false,
// 					"allowredir": true,
// 					"loader": JSO.IFramePassive,
// 					"redirect_uri": that.config.redirect_uri_passive
// 				}
// 			});
// 		},
// 		"authenticatePopup": function() {
// 			return this.checkUserInfo({
// 				"oauth": {
// 					"allowia": true,
// 					"allowredir": true,
// 					"loader": JSO.Popup,
// 					"redirect_uri": this.config.redirect_uri_popup
// 				}
// 			});
// 		},
// 		"dump": function() {
// 			return this.jso.dump();
// 		},
// 		"logout": function() {
//
// 			this.jso.wipeTokens();
// 			this.user = null;
// 			this._authenticated = false;
// 			this.emit("stateChange", this._authenticated, this.user);
//
// 		}
//
// 	}).extend(EventEmitter);
//
//
// 	return Authentication;
//
// });


exports.default = Authentication;