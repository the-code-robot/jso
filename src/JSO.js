'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.FetcherJQuery = exports.Fetcher = exports.IFramePassive = exports.Popup = exports.HTTPRedirect = exports.BasicLoader = exports.JSO = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _assign = require('core-js/fn/object/assign');

var _assign2 = _interopRequireDefault(_assign);

require('core-js/fn/array/includes');

require('core-js/fn/promise');

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

var _BasicLoader = require('./Loaders/BasicLoader');

var _BasicLoader2 = _interopRequireDefault(_BasicLoader);

var _HTTPRedirect = require('./Loaders/HTTPRedirect');

var _HTTPRedirect2 = _interopRequireDefault(_HTTPRedirect);

var _IFramePassive = require('./Loaders/IFramePassive');

var _IFramePassive2 = _interopRequireDefault(_IFramePassive);

var _Popup = require('./Loaders/Popup');

var _Popup2 = _interopRequireDefault(_Popup);

var _Fetcher = require('./HTTP/Fetcher');

var _Fetcher2 = _interopRequireDefault(_Fetcher);

var _FetcherJQuery = require('./HTTP/FetcherJQuery');

var _FetcherJQuery2 = _interopRequireDefault(_FetcherJQuery);

var _OAuthResponseError = require('./errors/OAuthResponseError');

var _OAuthResponseError2 = _interopRequireDefault(_OAuthResponseError);

var _Config = require('./Config');

var _Config2 = _interopRequireDefault(_Config);

var _EventEmitter2 = require('./EventEmitter');

var _EventEmitter3 = _interopRequireDefault(_EventEmitter2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * JSO - Javascript OAuth Library
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 	Version 4.0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  UNINETT AS - http://uninett.no
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  Author: Andreas Åkre Solberg <andreas.solberg@uninett.no>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  Licence: Simplified BSD Licence
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *  Documentation available at: https://github.com/andreassolberg/jso
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

// Polyfills to support >= IE10

// ------

// Work in progress
// import Authentication from './Authentication/Authentication'

// import ExpiredTokenError from './errors/ExpiredTokenError'
// import HTTPError from './errors/HTTPError'


var package_json = require('../package.json');

var default_config = {
	'lifetime': 3600
};

var JSO = function (_EventEmitter) {
	_inherits(JSO, _EventEmitter);

	function JSO(config) {
		_classCallCheck(this, JSO);

		var _this = _possibleConstructorReturn(this, (JSO.__proto__ || Object.getPrototypeOf(JSO)).call(this));

		_this.configure(config);
		_this.providerID = _this.getProviderID();
		_this.Loader = _HTTPRedirect2.default;
		_this.store = _store2.default;
		_this.callbacks = {};

		if (_this.config.getValue('debug', false)) {
			_utils2.default.debug = true;
		}
		return _this;
	}

	_createClass(JSO, [{
		key: 'configure',
		value: function configure(config) {
			this.config = new _Config2.default(default_config, config);
		}

		// Experimental, nothing but default store exists yet. Not documented.

	}, {
		key: 'setStore',
		value: function setStore(newstore) {
			this.store = newstore;
		}
	}, {
		key: 'setLoader',
		value: function setLoader(loader) {
			if (typeof loader === "function") {
				this.Loader = loader;
			} else {
				throw new Error("loader MUST be an instance of the JSO BasicLoader");
			}
		}

		/**
   * We need to get an identifier to represent this OAuth provider.
   * The JSO construction option providerID is preferred, if not provided
   * we construct a concatentaion of authorization url and client_id.
   * @return {[type]} [description]
   */

	}, {
		key: 'getProviderID',
		value: function getProviderID() {

			var c = this.config.getValue('providerID', null);
			if (c !== null) {
				return c;
			}

			var client_id = this.config.getValue('client_id', null, true);
			var authorization = this.config.getValue('authorization', null, true);

			return authorization + '|' + client_id;
		}

		/**
   * If the callback has already successfully parsed a token response, call this.
   * @return {[type]} [description]
   */

	}, {
		key: 'processTokenResponse',
		value: function processTokenResponse(atoken) {
			var state = void 0;
			if (atoken.state) {
				state = this.store.getState(atoken.state);
			} else {
				throw new Error("Could not get state from storage.");
			}

			if (!state) {
				throw new Error("Could not retrieve state");
			}
			if (!state.providerID) {
				throw new Error("Could not get providerid from state");
			}
			_utils2.default.log("processTokenResponse ", atoken, "");
			return this.processReceivedToken(atoken, state);
		}
	}, {
		key: 'processReceivedToken',
		value: function processReceivedToken(atoken, state) {
			/*
   * Decide when this token should expire.
   * Priority fallback:
   * 1. Access token expires_in
   * 2. Life time in config (may be false = permanent...)
   * 3. Specific permanent scope.
   * 4. Default library lifetime:
   */
			var now = _utils2.default.epoch();
			atoken.received = now;
			if (atoken.expires_in) {
				atoken.expires = now + parseInt(atoken.expires_in, 10);
				atoken.expires_in = parseInt(atoken.expires_in, 10);
			} else if (this.config.getValue('default_lifetime', null) === false) {
				atoken.expires = null;
			} else if (this.config.has('permanent_scope')) {
				if (!this.store.hasScope(atoken, this.config.getValue('permanent_scope'))) {
					atoken.expires = null;
				}
			} else if (this.config.has('default_lifetime')) {
				atoken.expires = now + this.config.getValue('default_lifetime');
			} else {
				atoken.expires = now + 3600;
			}

			/*
    * Handle scopes for this token
    */
			if (atoken.scope) {
				atoken.scopes = atoken.scope.split(" ");
				delete atoken.scope;
			} else if (state.scopes) {
				atoken.scopes = state.scopes;
			} else {
				atoken.scopes = [];
			}

			_utils2.default.log("processTokenResponse completed ", atoken, "");

			this.store.saveToken(state.providerID, atoken);

			if (state.restoreHash) {
				window.location.hash = state.restoreHash;
			} else {
				window.location.hash = '';
			}
			return atoken;
		}

		// Experimental support for authorization code to be added

	}, {
		key: 'processAuthorizationCodeResponse',
		value: function processAuthorizationCodeResponse(object) {
			var _this2 = this;

			console.log(this);
			this.emit('authorizationCode', object);

			var state = void 0;
			if (object.state) {
				state = this.store.getState(object.state);
				if (state === null) {
					throw new Error("Could not find retrieve state object.");
				}
			} else {
				throw new Error("Could not find state paramter from callback.");
			}
			console.log("state", state);

			if (!this.config.has('token')) {
				_utils2.default.log("Received an authorization code. Will not process it as the config option [token] endpoint is not set. If you would like to process the code yourself, please subscribe to the [authorizationCode] event");
				return;
			}
			if (!this.config.has('client_secret')) {
				throw new Error("Configuration missing [client_secret]");
			}
			var headers = new Headers();
			headers.append('Authorization', 'Basic ' + btoa(this.config.getValue('client_id') + ":" + this.config.getValue('client_secret')));
			headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');

			var tokenRequest = {
				'grant_type': 'authorization_code',
				'code': object.code
			};

			if (state.hasOwnProperty('redirect_uri')) {
				tokenRequest.redirect_uri = state.redirect_uri;
			}

			var opts = {
				mode: 'cors',
				headers: headers,
				method: 'POST', // or 'PUT'
				body: _utils2.default.encodeQS(tokenRequest) // data can be `string` or {object}!
			};
			return fetch(this.config.getValue('token'), opts).then(function (httpResponse) {
				return httpResponse.json();
			}).then(function (tokenResponse) {
				// let tokenResponse = httpResponse.json()
				_utils2.default.log("Received response on token endpoint ", tokenResponse, "");
				return _this2.processReceivedToken(tokenResponse, state);
			});

			// throw new Exception("Implementation of authorization code flow is not yet implemented. Instead use the implicit grant flow")
		}
	}, {
		key: 'processErrorResponse',
		value: function processErrorResponse(err) {

			var state;
			if (err.state) {

				state = this.store.getState(err.state);
			} else {
				throw new Error("Could not get [state] and no default providerid is provided.");
			}

			if (!state) {
				throw new Error("Could not retrieve state");
			}
			if (!state.providerID) {
				throw new Error("Could not get providerid from state");
			}

			if (state.restoreHash) {
				window.location.hash = state.restoreHash;
			} else {
				window.location.hash = '';
			}
			return new _OAuthResponseError2.default(err);
		}

		/**
   * Check if the hash contains an access token.
   * And if it do, extract the state, compare with
   * config, and store the access token for later use.
   *
   * The url parameter is optional. Used with phonegap and
   * childbrowser when the jso context is not receiving the response,
   * instead the response is received on a child browser.
   */

	}, {
		key: 'callback',
		value: function callback(data) {

			var response = null;
			if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object') {
				response = data;
			} else if (typeof data === 'string') {
				response = _utils2.default.getResponseFromURL(data);
			} else if (typeof data === 'undefined') {
				response = _utils2.default.getResponseFromURL(window.location.href);
			} else {
				// no response provided.
				return;
			}

			_utils2.default.log('Receving response in callback', response);

			if (response.hasOwnProperty("access_token")) {
				return this.processTokenResponse(response);

				// Implementation of authorization code flow is in beta.
			} else if (response.hasOwnProperty("code")) {
				return this.processAuthorizationCodeResponse(response);
			} else if (response.hasOwnProperty("error")) {
				throw this.processErrorResponse(response);
			}
		}
	}, {
		key: 'dump',
		value: function dump() {
			var tokens = this.store.getTokens(this.providerID);
			var x = {
				"providerID": this.providerID,
				"tokens": tokens,
				"config": this.config
			};
			return x;
		}
	}, {
		key: '_getRequestScopes',
		value: function _getRequestScopes(opts) {
			var scopes = [],
			    i;
			/*
    * Calculate which scopes to request, based upon provider config and request config.
    */
			if (this.config.has('scopes.request')) {
				var s = this.config.getValue('scopes.request');
				for (i = 0; i < s.length; i++) {
					scopes.push(s[i]);
				}
			}
			if (opts && opts.scopes && opts.scopes.request) {
				for (i = 0; i < opts.scopes.request.length; i++) {
					scopes.push(opts.scopes.request[i]);
				}
			}
			return _utils2.default.uniqueList(scopes);
		}
	}, {
		key: '_getRequiredScopes',
		value: function _getRequiredScopes(opts) {
			var scopes = [],
			    i;
			/*
    * Calculate which scopes to request, based upon provider config and request config.
    */
			if (this.config.has('scopes.require')) {
				var s = this.config.getValue('scopes.require');
				for (i = 0; i < s.length; i++) {
					scopes.push(s[i]);
				}
			}
			if (opts && opts.scopes && opts.scopes.require) {
				for (i = 0; i < opts.scopes.require.length; i++) {
					scopes.push(opts.scopes.require[i]);
				}
			}
			return _utils2.default.uniqueList(scopes);
		}

		/**
   * If getToken is called with allowia = false, and a token is not cached, it will return null.
   * The scopes.required is used to pick from existing tokens.
   *
   * @param  {[type]} opts [description]
   * @return {[type]}      [description]
   */

	}, {
		key: 'getToken',
		value: function getToken(opts) {
			var _this3 = this;

			opts = opts || {};

			return new Promise(function (resolve, reject) {

				var scopesRequire = _this3._getRequiredScopes(opts);
				var token = _this3.store.getToken(_this3.providerID, scopesRequire);

				if (token) {
					return resolve(token);
				} else {

					if (opts.hasOwnProperty("allowredir") && !opts.allowredir) {
						throw new Error("Cannot obtain a token, when not allowed to redirect...");
					} else {
						resolve(_this3._authorize(opts));
					}
				}
			});
		}
	}, {
		key: 'checkToken',
		value: function checkToken(opts) {
			// var scopesRequest  = this._getRequestScopes(opts)

			var scopesRequire = this._getRequiredScopes(opts);
			return this.store.getToken(this.providerID, scopesRequire);
		}

		/**
   * Send authorization request.
   *
   * @param  {[type]} opts These options matches the ones sent in the "oauth" property of the ajax settings in the request.
   * @return {[type]}      [description]
   */

	}, {
		key: '_authorize',
		value: function _authorize(opts) {
			var _this4 = this;

			var request, authurl, scopes;

			return Promise.resolve().then(function () {

				var authorization = _this4.config.getValue('authorization', null, true);
				var client_id = _this4.config.getValue('client_id', null, true);
				var openid = false;

				if (opts.hasOwnProperty('allowia') || _this4.config.has('allowia')) {
					throw new Error('The allowia option was removed in JSO 4.1.0. Instead use {request: {prompt: "none"}}');
				}

				_utils2.default.log("About to send an authorization request to this endpoint", authorization);
				_utils2.default.log("Options", opts);

				request = {};

				if (_this4.config.has('request')) {
					var r = _this4.config.getValue('request');
					request = (0, _assign2.default)(request, r);
				}
				if (opts.hasOwnProperty('request')) {
					request = (0, _assign2.default)(request, opts.request);
				}

				request.response_type = opts.response_type || _this4.config.getValue('response_type', 'id_token token');
				request.state = _utils2.default.uuid();

				if (_this4.config.has('redirect_uri')) {
					request.redirect_uri = _this4.config.getValue('redirect_uri', '');
				}
				if (opts.redirect_uri) {
					request.redirect_uri = opts.redirect_uri;
				}

				request.client_id = client_id;

				/*
     * Calculate which scopes to request, based upon provider config and request config.
     */
				scopes = _this4._getRequestScopes(opts);
				openid = scopes.includes('openid');
				if (scopes.length > 0) {
					request.scope = _utils2.default.scopeList(scopes);
				}
				_utils2.default.log("Running in mode: " + (openid ? 'OpenID Connect mode' : 'OAuth mode'));

				if (openid && !request.hasOwnProperty('redirect_uri')) {
					throw new Error('An OpenID Request requires a redirect_uri to be set. Please add to configuration. A redirect_uri is not required for plain OAuth');
				}

				if (openid) {
					request.nonce = _utils2.default.uuid();
				}

				_utils2.default.log("Debug Authentication request object", JSON.stringify(request, undefined, 2));

				authurl = _utils2.default.encodeURL(authorization, request);

				// We'd like to cache the hash for not loosing Application state.
				// With the implciit grant flow, the hash will be replaced with the access
				// token when we return after authorization.
				if (window.location.hash) {
					request.restoreHash = window.location.hash;
				}
				request.providerID = _this4.providerID;
				if (scopes) {
					request.scopes = scopes;
				}

				_utils2.default.log("Saving state [" + request.state + "]");
				_utils2.default.log(JSON.parse(JSON.stringify(request)));

				var loader = _this4.Loader;
				if (opts.hasOwnProperty("loader")) {
					loader = opts.loader;
				}

				_utils2.default.log("Looking for loader", opts, loader);

				_this4.store.saveState(request.state, request);
				return _this4.gotoAuthorizeURL(authurl, loader).then(function (response) {
					if (response !== true) {
						return _this4.callback(response);
					}
				});
			});
		}
	}, {
		key: 'gotoAuthorizeURL',
		value: function gotoAuthorizeURL(url, Loader) {
			return new Promise(function (resolve, reject) {
				if (Loader !== null && typeof Loader === 'function') {
					var loader = new Loader(url);
					if (!(loader instanceof _BasicLoader2.default)) {
						throw new Error("JSO selected Loader is not an instance of BasicLoader.");
					}
					resolve(loader.execute());
				} else {
					reject(new Error('Cannot redirect to authorization endpoint because of missing redirect handler'));
				}
			});
		}
	}, {
		key: 'wipeTokens',
		value: function wipeTokens() {
			this.store.wipeTokens(this.providerID);
		}
	}]);

	return JSO;
}(_EventEmitter3.default);

// Object.assign(JSO.prototype, new EventEmitter({}))

exports.JSO = JSO;
exports.BasicLoader = _BasicLoader2.default;
exports.HTTPRedirect = _HTTPRedirect2.default;
exports.Popup = _Popup2.default;
exports.IFramePassive = _IFramePassive2.default;
exports.Fetcher = _Fetcher2.default;
exports.FetcherJQuery = _FetcherJQuery2.default;
// Work in progress
// Authentication