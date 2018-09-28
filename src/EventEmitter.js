"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventEmitter = function () {
  function EventEmitter() {
    _classCallCheck(this, EventEmitter);
  }

  _createClass(EventEmitter, [{
    key: "on",
    value: function on(type, callback) {
      if (!this._callbacks) {
        this._callbacks = {};
      }
      if (!this._callbacks[type]) {
        this._callbacks[type] = [];
      }

      this._callbacks[type].push(callback);
    }
  }, {
    key: "emit",
    value: function emit(type) {
      if (!this._callbacks) {
        this._callbacks = {};
      }
      if (!this._callbacks[type]) {
        this._callbacks[type] = [];
      }

      var args = Array.prototype.slice.call(arguments, 1);
      for (var i = 0; i < this._callbacks[type].length; i++) {
        this._callbacks[type][i].apply(this, args);
      }
    }
  }]);

  return EventEmitter;
}();

exports.default = EventEmitter;