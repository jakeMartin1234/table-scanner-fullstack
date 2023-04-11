var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import Activation from './Activation';

var TouchEnvironmentActivation = function (_Activation) {
    _inherits(TouchEnvironmentActivation, _Activation);

    function TouchEnvironmentActivation(_ref) {
        var onIsActiveChanged = _ref.onIsActiveChanged;

        _classCallCheck(this, TouchEnvironmentActivation);

        var _this = _possibleConstructorReturn(this, (TouchEnvironmentActivation.__proto__ || Object.getPrototypeOf(TouchEnvironmentActivation)).call(this, { onIsActiveChanged: onIsActiveChanged }));

        _this.initialElTop = 0;
        _this.currentElTop = 0;
        return _this;
    }

    _createClass(TouchEnvironmentActivation, [{
        key: 'touchStarted',
        value: function touchStarted() {}
    }, {
        key: 'touchMoved',
        value: function touchMoved() {}
    }, {
        key: 'touchEnded',
        value: function touchEnded() {
            this.deactivate();
        }
    }, {
        key: 'touchCanceled',
        value: function touchCanceled() {
            this.deactivate();
        }
    }]);

    return TouchEnvironmentActivation;
}(Activation);

export default TouchEnvironmentActivation;