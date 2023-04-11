var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import objectAssign from 'object-assign';
import omit from 'object.omit';
import Core from './lib/ElementRelativeCursorPosition';
import addEventListener from './utils/addEventListener';
import { INTERACTIONS, MOUSE_EMULATION_GUARD_TIMER_NAME } from './constants';
import noop from './utils/noop';
import PressActivation from './lib/PressActivation';
import TouchActivation from './lib/TouchActivation';
import TapActivation from './lib/TapActivation';
import HoverActivation from './lib/HoverActivation';
import ClickActivation from './lib/ClickActivation';

export { INTERACTIONS };

var _class = function (_React$Component) {
    _inherits(_class, _React$Component);

    function _class(props) {
        _classCallCheck(this, _class);

        var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props));

        _initialiseProps.call(_this);

        _this.state = {
            detectedEnvironment: {
                isMouseDetected: false,
                isTouchDetected: false
            },
            elementDimensions: {
                width: 0,
                height: 0
            },
            isActive: false,
            isPositionOutside: true,
            position: {
                x: 0,
                y: 0
            }
        };

        _this.shouldGuardAgainstMouseEmulationByDevices = false;
        _this.eventListeners = [];
        _this.timers = [];
        _this.elementOffset = {
            x: 0,
            y: 0
        };

        _this.onTouchStart = _this.onTouchStart.bind(_this);
        _this.onTouchMove = _this.onTouchMove.bind(_this);
        _this.onTouchEnd = _this.onTouchEnd.bind(_this);
        _this.onTouchCancel = _this.onTouchCancel.bind(_this);
        _this.onMouseEnter = _this.onMouseEnter.bind(_this);
        _this.onMouseMove = _this.onMouseMove.bind(_this);
        _this.onMouseLeave = _this.onMouseLeave.bind(_this);
        _this.onClick = _this.onClick.bind(_this);
        _this.onIsActiveChanged = _this.onIsActiveChanged.bind(_this);

        _this.setTouchActivationStrategy(props.activationInteractionTouch);
        _this.setMouseActivationStrategy(props.activationInteractionMouse);
        return _this;
    }

    _createClass(_class, [{
        key: 'onIsActiveChanged',
        value: function onIsActiveChanged(_ref) {
            var isActive = _ref.isActive;

            if (isActive) {
                this.activate();
            } else {
                this.deactivate();
            }
        }
    }, {
        key: 'onTouchStart',
        value: function onTouchStart(e) {
            this.init();
            this.onTouchDetected();
            this.setShouldGuardAgainstMouseEmulationByDevices();

            var position = this.core.getCursorPosition(this.getTouchEvent(e));
            this.setPositionState(position);

            this.touchActivation.touchStarted({ e: e, position: position });
        }
    }, {
        key: 'onTouchMove',
        value: function onTouchMove(e) {
            if (!this.isCoreReady) {
                return;
            }

            var position = this.core.getCursorPosition(this.getTouchEvent(e));
            this.touchActivation.touchMoved({ e: e, position: position });

            if (!this.state.isActive) {
                return;
            }

            this.setPositionState(position);
            e.preventDefault();

            if (this.props.shouldStopTouchMovePropagation) {
                e.stopPropagation();
            }
        }
    }, {
        key: 'onTouchEnd',
        value: function onTouchEnd() {
            this.touchActivation.touchEnded();
            this.unsetShouldGuardAgainstMouseEmulationByDevices();
        }
    }, {
        key: 'onTouchCancel',
        value: function onTouchCancel() {
            this.touchActivation.touchCanceled();

            this.unsetShouldGuardAgainstMouseEmulationByDevices();
        }
    }, {
        key: 'onMouseEnter',
        value: function onMouseEnter(e) {
            if (this.shouldGuardAgainstMouseEmulationByDevices) {
                return;
            }

            this.init();
            this.onMouseDetected();
            this.setPositionState(this.core.getCursorPosition(e));
            this.mouseActivation.mouseEntered();
        }
    }, {
        key: 'onMouseMove',
        value: function onMouseMove(e) {
            if (!this.isCoreReady) {
                return;
            }

            var position = this.core.getCursorPosition(e);
            this.setPositionState(position);
            this.mouseActivation.mouseMoved(position);
        }
    }, {
        key: 'onMouseLeave',
        value: function onMouseLeave() {
            this.mouseActivation.mouseLeft();
            this.setState({ isPositionOutside: true });
        }
    }, {
        key: 'onClick',
        value: function onClick(e) {
            this.setPositionState(this.core.getCursorPosition(e));
            this.mouseActivation.mouseClicked();
            this.onMouseDetected();
        }
    }, {
        key: 'onTouchDetected',
        value: function onTouchDetected() {
            var environment = {
                isTouchDetected: true,
                isMouseDetected: false
            };

            this.setState({ detectedEnvironment: environment });
            this.props.onDetectedEnvironmentChanged(environment);
        }
    }, {
        key: 'onMouseDetected',
        value: function onMouseDetected() {
            var environment = {
                isTouchDetected: false,
                isMouseDetected: true
            };

            this.setState({ detectedEnvironment: environment });
            this.props.onDetectedEnvironmentChanged(environment);
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            if (this.props.isEnabled) {
                this.enable();
            }
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(_ref2) {
            var willBeEnabled = _ref2.isEnabled;
            var isEnabled = this.props.isEnabled;

            var isEnabledWillChange = isEnabled !== willBeEnabled;

            if (!isEnabledWillChange) {
                return;
            }

            if (willBeEnabled) {
                this.enable();
            } else {
                this.disable();
            }
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.disable();
        }
    }, {
        key: 'enable',
        value: function enable() {
            this.addEventListeners();
        }
    }, {
        key: 'disable',
        value: function disable() {
            this.removeEventListeners();
        }
    }, {
        key: 'init',
        value: function init() {
            this.core = new Core(this.el);

            this.setElementDimensionsState(this.getElementDimensions(this.el));
        }
    }, {
        key: 'setTouchActivationStrategy',
        value: function setTouchActivationStrategy(interaction) {
            var _props = this.props,
                pressDurationInMs = _props.pressDurationInMs,
                pressMoveThreshold = _props.pressMoveThreshold,
                tapDurationInMs = _props.tapDurationInMs,
                tapMoveThreshold = _props.tapMoveThreshold;
            var TOUCH = INTERACTIONS.TOUCH,
                TAP = INTERACTIONS.TAP,
                PRESS = INTERACTIONS.PRESS;


            switch (interaction) {
                case PRESS:
                    this.touchActivation = new PressActivation({
                        onIsActiveChanged: this.onIsActiveChanged,
                        pressDurationInMs: pressDurationInMs,
                        pressMoveThreshold: pressMoveThreshold
                    });
                    break;
                case TAP:
                    this.touchActivation = new TapActivation({
                        onIsActiveChanged: this.onIsActiveChanged,
                        tapDurationInMs: tapDurationInMs,
                        tapMoveThreshold: tapMoveThreshold
                    });
                    break;
                case TOUCH:
                    this.touchActivation = new TouchActivation({
                        onIsActiveChanged: this.onIsActiveChanged
                    });
                    break;
                default:
                    throw new Error('Must implement a touch activation strategy');
            }
        }
    }, {
        key: 'setMouseActivationStrategy',
        value: function setMouseActivationStrategy(interaction) {
            var _props2 = this.props,
                hoverDelayInMs = _props2.hoverDelayInMs,
                hoverOffDelayInMs = _props2.hoverOffDelayInMs;
            var HOVER = INTERACTIONS.HOVER,
                CLICK = INTERACTIONS.CLICK;


            switch (interaction) {
                case HOVER:
                    this.mouseActivation = new HoverActivation({
                        onIsActiveChanged: this.onIsActiveChanged,
                        hoverDelayInMs: hoverDelayInMs,
                        hoverOffDelayInMs: hoverOffDelayInMs
                    });
                    break;
                case CLICK:
                    this.mouseActivation = new ClickActivation({
                        onIsActiveChanged: this.onIsActiveChanged
                    });
                    break;
                default:
                    throw new Error('Must implement a mouse activation strategy');
            }
        }
    }, {
        key: 'reset',
        value: function reset() {
            var _core = this.core;
            _core = _core === undefined ? {} : _core;
            var lastMouseEvent = _core.lastEvent;


            this.init();

            if (!lastMouseEvent) {
                return;
            }

            this.setPositionState(this.core.getCursorPosition(lastMouseEvent));
        }
    }, {
        key: 'activate',
        value: function activate() {
            this.setState({ isActive: true });
            this.props.onActivationChanged({ isActive: true });
        }
    }, {
        key: 'deactivate',
        value: function deactivate() {
            var _this2 = this;

            this.setState({ isActive: false }, function () {
                var _state = _this2.state,
                    isPositionOutside = _state.isPositionOutside,
                    position = _state.position;


                _this2.props.onPositionChanged({
                    isPositionOutside: isPositionOutside,
                    position: position
                });

                _this2.props.onActivationChanged({ isActive: false });
            });
        }
    }, {
        key: 'setPositionState',
        value: function setPositionState(position) {
            var isPositionOutside = this.getIsPositionOutside(position);

            this.setState({
                isPositionOutside: isPositionOutside,
                position: position
            }, this.onPositionChanged);
        }
    }, {
        key: 'setElementDimensionsState',
        value: function setElementDimensionsState(dimensions) {
            this.setState({
                elementDimensions: dimensions
            });
        }
    }, {
        key: 'setShouldGuardAgainstMouseEmulationByDevices',
        value: function setShouldGuardAgainstMouseEmulationByDevices() {
            this.shouldGuardAgainstMouseEmulationByDevices = true;
        }
    }, {
        key: 'unsetShouldGuardAgainstMouseEmulationByDevices',
        value: function unsetShouldGuardAgainstMouseEmulationByDevices() {
            var _this3 = this;

            this.timers.push({
                name: MOUSE_EMULATION_GUARD_TIMER_NAME,
                id: setTimeout(function () {
                    _this3.shouldGuardAgainstMouseEmulationByDevices = false;
                }, 0)
            });
        }
    }, {
        key: 'getElementDimensions',
        value: function getElementDimensions(el) {
            var _el$getBoundingClient = el.getBoundingClientRect(),
                width = _el$getBoundingClient.width,
                height = _el$getBoundingClient.height;

            return {
                width: width,
                height: height
            };
        }
    }, {
        key: 'getIsPositionOutside',
        value: function getIsPositionOutside(position) {
            var x = position.x,
                y = position.y;
            var _state$elementDimensi = this.state.elementDimensions,
                width = _state$elementDimensi.width,
                height = _state$elementDimensi.height;


            var isPositionOutside = x < 0 || y < 0 || x > width || y > height;

            return isPositionOutside;
        }
    }, {
        key: 'getTouchEvent',
        value: function getTouchEvent(e) {
            return e.touches[0];
        }
    }, {
        key: 'getIsReactComponent',
        value: function getIsReactComponent(reactElement) {
            return typeof reactElement.type === 'function';
        }
    }, {
        key: 'shouldDecorateChild',
        value: function shouldDecorateChild(child) {
            return !!child && this.getIsReactComponent(child) && this.props.shouldDecorateChildren;
        }
    }, {
        key: 'decorateChild',
        value: function decorateChild(child, props) {
            return cloneElement(child, props);
        }
    }, {
        key: 'decorateChildren',
        value: function decorateChildren(children, props) {
            var _this4 = this;

            return Children.map(children, function (child) {
                return _this4.shouldDecorateChild(child) ? _this4.decorateChild(child, props) : child;
            });
        }
    }, {
        key: 'addEventListeners',
        value: function addEventListeners() {
            this.eventListeners.push(addEventListener(this.el, 'touchstart', this.onTouchStart, { passive: false }), addEventListener(this.el, 'touchmove', this.onTouchMove, { passive: false }), addEventListener(this.el, 'touchend', this.onTouchEnd), addEventListener(this.el, 'touchcancel', this.onTouchCancel), addEventListener(this.el, 'mouseenter', this.onMouseEnter), addEventListener(this.el, 'mousemove', this.onMouseMove), addEventListener(this.el, 'mouseleave', this.onMouseLeave), addEventListener(this.el, 'click', this.onClick));
        }
    }, {
        key: 'removeEventListeners',
        value: function removeEventListeners() {
            while (this.eventListeners.length) {
                this.eventListeners.pop().removeEventListener();
            }
        }
    }, {
        key: 'getPassThroughProps',
        value: function getPassThroughProps() {
            var ownPropNames = Object.keys(this.constructor.propTypes);
            return omit(this.props, ownPropNames);
        }
    }, {
        key: 'render',
        value: function render() {
            var _this5 = this;

            var _props3 = this.props,
                children = _props3.children,
                className = _props3.className,
                mapChildProps = _props3.mapChildProps,
                style = _props3.style;

            var props = objectAssign({}, mapChildProps(this.state), this.getPassThroughProps());

            return React.createElement(
                'div',
                {
                    className: className,
                    ref: function ref(el) {
                        return _this5.el = el;
                    },
                    style: objectAssign({}, style, {
                        WebkitUserSelect: 'none'
                    })
                },
                this.decorateChildren(children, props)
            );
        }
    }, {
        key: 'isCoreReady',
        get: function get() {
            return !!this.core;
        }
    }]);

    return _class;
}(React.Component);

_class.displayName = 'ReactCursorPosition';
_class.propTypes = {
    activationInteractionMouse: PropTypes.oneOf([INTERACTIONS.CLICK, INTERACTIONS.HOVER]),
    activationInteractionTouch: PropTypes.oneOf([INTERACTIONS.PRESS, INTERACTIONS.TAP, INTERACTIONS.TOUCH]),
    children: PropTypes.any,
    className: PropTypes.string,
    hoverDelayInMs: PropTypes.number,
    hoverOffDelayInMs: PropTypes.number,
    isEnabled: PropTypes.bool,
    mapChildProps: PropTypes.func,
    onActivationChanged: PropTypes.func,
    onDetectedEnvironmentChanged: PropTypes.func,
    onPositionChanged: PropTypes.func,
    pressDurationInMs: PropTypes.number,
    pressMoveThreshold: PropTypes.number,
    shouldDecorateChildren: PropTypes.bool,
    shouldStopTouchMovePropagation: PropTypes.bool,
    style: PropTypes.object,
    tapDurationInMs: PropTypes.number,
    tapMoveThreshold: PropTypes.number
};
_class.defaultProps = {
    activationInteractionMouse: INTERACTIONS.HOVER,
    activationInteractionTouch: INTERACTIONS.PRESS,
    hoverDelayInMs: 0,
    hoverOffDelayInMs: 0,
    isEnabled: true,
    mapChildProps: function mapChildProps(props) {
        return props;
    },
    onActivationChanged: noop,
    onDetectedEnvironmentChanged: noop,
    onPositionChanged: noop,
    pressDurationInMs: 500,
    pressMoveThreshold: 5,
    shouldDecorateChildren: true,
    shouldStopTouchMovePropagation: false,
    tapDurationInMs: 180,
    tapMoveThreshold: 5
};

var _initialiseProps = function _initialiseProps() {
    var _this6 = this;

    this.onPositionChanged = function () {
        var onPositionChanged = _this6.props.onPositionChanged;

        onPositionChanged(_this6.state);
    };
};

export default _class;