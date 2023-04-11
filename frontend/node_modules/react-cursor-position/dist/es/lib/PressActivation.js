var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { PRESS_EVENT_TIMER_NAME } from '../constants';
import TouchEnvironmentActivation from './TouchEnvironmentActivation';

var PressActivation = function (_TouchEnvironmentActi) {
    _inherits(PressActivation, _TouchEnvironmentActi);

    function PressActivation(_ref) {
        var onIsActiveChanged = _ref.onIsActiveChanged,
            pressDurationInMs = _ref.pressDurationInMs,
            pressMoveThreshold = _ref.pressMoveThreshold;

        _classCallCheck(this, PressActivation);

        var _this = _possibleConstructorReturn(this, (PressActivation.__proto__ || Object.getPrototypeOf(PressActivation)).call(this, { onIsActiveChanged: onIsActiveChanged }));

        _this.pressDurationInMs = pressDurationInMs;
        _this.pressMoveThreshold = pressMoveThreshold;
        return _this;
    }

    _createClass(PressActivation, [{
        key: 'touchStarted',
        value: function touchStarted(_ref2) {
            var position = _ref2.position;

            this.initPressEventCriteria(position);
            this.setPressEventTimer();
        }
    }, {
        key: 'touchMoved',
        value: function touchMoved(_ref3) {
            var position = _ref3.position;

            if (this.isActive) {
                return;
            }

            this.setPressEventCriteria(position);
        }
    }, {
        key: 'setPressEventTimer',
        value: function setPressEventTimer() {
            var _this2 = this;

            this.timers.push({
                name: PRESS_EVENT_TIMER_NAME,
                id: setTimeout(function () {
                    if (Math.abs(_this2.currentElTop - _this2.initialElTop) < _this2.pressMoveThreshold) {
                        _this2.activate();
                    }
                }, this.pressDurationInMs)
            });
        }
    }, {
        key: 'setPressEventCriteria',
        value: function setPressEventCriteria(position) {
            this.currentElTop = position.y;
        }
    }, {
        key: 'initPressEventCriteria',
        value: function initPressEventCriteria(position) {
            var top = position.y;
            this.initialElTop = top;
            this.currentElTop = top;
        }
    }]);

    return PressActivation;
}(TouchEnvironmentActivation);

export default PressActivation;