'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _constants = require('../constants');

var _TouchEnvironmentActivation = require('./TouchEnvironmentActivation');

var _TouchEnvironmentActivation2 = _interopRequireDefault(_TouchEnvironmentActivation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TapActivation = function (_TouchEnvironmentActi) {
    _inherits(TapActivation, _TouchEnvironmentActi);

    function TapActivation(_ref) {
        var onIsActiveChanged = _ref.onIsActiveChanged,
            tapDurationInMs = _ref.tapDurationInMs,
            tapMoveThreshold = _ref.tapMoveThreshold;

        _classCallCheck(this, TapActivation);

        var _this = _possibleConstructorReturn(this, (TapActivation.__proto__ || Object.getPrototypeOf(TapActivation)).call(this, { onIsActiveChanged: onIsActiveChanged }));

        _this.hasTapGestureEnded = false;
        _this.tapDurationInMs = tapDurationInMs;
        _this.tapMoveThreshold = tapMoveThreshold;
        return _this;
    }

    _createClass(TapActivation, [{
        key: 'touchStarted',
        value: function touchStarted(_ref2) {
            var position = _ref2.position;

            this.hasTapGestureEnded = false;
            this.initMoveThreshold(position);
            this.setTapEventTimer();
        }
    }, {
        key: 'touchMoved',
        value: function touchMoved(_ref3) {
            var position = _ref3.position;

            if (this.isActive) {
                return;
            }

            this.setMoveThresholdCriteria(position);
        }
    }, {
        key: 'touchEnded',
        value: function touchEnded() {
            this.hasTapGestureEnded = true;
        }
    }, {
        key: 'setTapEventTimer',
        value: function setTapEventTimer() {
            var _this2 = this;

            this.timers.push({
                name: _constants.TAP_GESTURE_TIMER_NAME,
                id: setTimeout(function () {
                    if (_this2.isTapGestureActive) {
                        _this2.toggleActivation();
                    }
                }, this.tapDurationInMs)
            });
        }
    }, {
        key: 'setMoveThresholdCriteria',
        value: function setMoveThresholdCriteria(position) {
            this.currentElTop = position.y;
        }
    }, {
        key: 'initMoveThreshold',
        value: function initMoveThreshold(position) {
            var top = position.y;
            this.initialElTop = top;
            this.currentElTop = top;
        }
    }, {
        key: 'hasPassedMoveThreshold',
        get: function get() {
            return Math.abs(this.currentElTop - this.initialElTop) > this.tapMoveThreshold;
        }
    }, {
        key: 'isTapGestureActive',
        get: function get() {
            return !this.hasPassedMoveThreshold && this.hasTapGestureEnded;
        }
    }]);

    return TapActivation;
}(_TouchEnvironmentActivation2.default);

exports.default = TapActivation;