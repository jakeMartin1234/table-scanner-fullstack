'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Activation2 = require('./Activation');

var _Activation3 = _interopRequireDefault(_Activation2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MouseActivation = function (_Activation) {
    _inherits(MouseActivation, _Activation);

    function MouseActivation(_ref) {
        var onIsActiveChanged = _ref.onIsActiveChanged;

        _classCallCheck(this, MouseActivation);

        return _possibleConstructorReturn(this, (MouseActivation.__proto__ || Object.getPrototypeOf(MouseActivation)).call(this, { onIsActiveChanged: onIsActiveChanged }));
    }

    _createClass(MouseActivation, [{
        key: 'mouseEntered',
        value: function mouseEntered() {}
    }, {
        key: 'mouseMoved',
        value: function mouseMoved() {}
    }, {
        key: 'mouseLeft',
        value: function mouseLeft() {}
    }, {
        key: 'mouseClicked',
        value: function mouseClicked() {}
    }]);

    return MouseActivation;
}(_Activation3.default);

exports.default = MouseActivation;