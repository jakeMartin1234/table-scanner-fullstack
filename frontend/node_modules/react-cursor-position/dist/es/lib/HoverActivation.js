var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import * as constants from '../constants';
import MouseEnvironmentActivation from './MouseEnvironmentActivation';

var HoverActivation = function (_MouseEnvironmentActi) {
    _inherits(HoverActivation, _MouseEnvironmentActi);

    function HoverActivation(_ref) {
        var onIsActiveChanged = _ref.onIsActiveChanged,
            hoverDelayInMs = _ref.hoverDelayInMs,
            hoverOffDelayInMs = _ref.hoverOffDelayInMs;

        _classCallCheck(this, HoverActivation);

        var _this = _possibleConstructorReturn(this, (HoverActivation.__proto__ || Object.getPrototypeOf(HoverActivation)).call(this, { onIsActiveChanged: onIsActiveChanged }));

        _this.hoverDelayInMs = hoverDelayInMs;
        _this.hoverOffDelayInMs = hoverOffDelayInMs;
        return _this;
    }

    _createClass(HoverActivation, [{
        key: 'mouseEntered',
        value: function mouseEntered() {
            this.clearTimers();
            this.schedulActivation(this.hoverDelayInMs);
        }
    }, {
        key: 'mouseLeft',
        value: function mouseLeft() {
            this.clearTimers();
            this.scheduleDeactivation(this.hoverOffDelayInMs);
        }
    }, {
        key: 'schedulActivation',
        value: function schedulActivation(schedule) {
            var _this2 = this;

            var scheduleId = setTimeout(function () {
                _this2.activate();
            }, schedule);

            this.timers.push({
                id: scheduleId,
                name: constants.SET_ACTIVATION_TIMER_NAME
            });
        }
    }, {
        key: 'scheduleDeactivation',
        value: function scheduleDeactivation(schedule) {
            var _this3 = this;

            var scheduleId = setTimeout(function () {
                _this3.deactivate();
            }, schedule);

            this.timers.push({
                id: scheduleId,
                name: constants.UNSET_ACTIVATION_TIMER_NAME
            });
        }
    }]);

    return HoverActivation;
}(MouseEnvironmentActivation);

export default HoverActivation;