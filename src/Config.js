'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Config = function () {
	function Config() {
		_classCallCheck(this, Config);

		this.config = {};
		for (var i = 0; i < arguments.length; i++) {
			Object.assign(this.config, arguments[i]);
		}
	}

	_createClass(Config, [{
		key: 'has',
		value: function has(key) {
			var pointer = this.config;
			var splittedKeys = key.split('.');
			var i = 0;
			for (i = 0; i < splittedKeys.length; i++) {
				if (pointer.hasOwnProperty(splittedKeys[i])) {
					pointer = pointer[splittedKeys[i]];
				} else {
					return false;
				}
			}
			return true;
		}
	}, {
		key: 'getValue',
		value: function getValue(key, defaultValue, isRequired) {
			var isRequired = isRequired || false;
			var pointer = this.config;
			var splittedKeys = key.split('.');
			var i = 0;
			for (i = 0; i < splittedKeys.length; i++) {

				if (pointer.hasOwnProperty(splittedKeys[i])) {
					// console.log("POINTING TO " + splittedKeys[i]);
					pointer = pointer[splittedKeys[i]];
				} else {
					pointer = undefined;
					break;
				}
			}

			if (typeof pointer === 'undefined') {
				if (isRequired) {
					throw new Error("Configuration option [" + splittedKeys[i] + "] required but not provided.");
				}
				return defaultValue;
			}
			return pointer;
		}
	}]);

	return Config;
}();

exports.default = Config;