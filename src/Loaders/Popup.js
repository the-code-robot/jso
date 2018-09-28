'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BasicLoader2 = require('./BasicLoader');

var _BasicLoader3 = _interopRequireDefault(_BasicLoader2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Popup = function (_BasicLoader) {
	_inherits(Popup, _BasicLoader);

	function Popup() {
		_classCallCheck(this, Popup);

		return _possibleConstructorReturn(this, (Popup.__proto__ || Object.getPrototypeOf(Popup)).apply(this, arguments));
	}

	_createClass(Popup, [{
		key: 'execute',
		value: function execute() {
			var _this2 = this;

			/*
   * In the popup's scripts, running on <http://example.org>:
   */
			return new Promise(function (resolve, reject) {

				// window.addEventListener("jso_message", function(event) {
				// 	console.log("Sent a message to event.origin " + event.origin + " and got the following in response:")
				// 	console.log("<em>", event.data, "</em>")
				// 	var url = newwindow.location.href
				// 	// console.error("Popup location is ", url, newwindow.location)
				//   resolve(url)
				// })

				window.popupCompleted = function () {
					var url = newwindow.location.href;
					resolve(url);
				};

				var newwindow = window.open(_this2.url, 'jso-popup-auth', 'height=600,width=800');
				if (newwindow === null) {
					throw new Error("Error loading popup window");
				}
				if (window.focus) {
					newwindow.focus();
				}
			});
		}
	}]);

	return Popup;
}(_BasicLoader3.default);

exports.default = Popup;