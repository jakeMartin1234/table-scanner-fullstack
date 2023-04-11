var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Activation = function () {
    function Activation() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            onIsActiveChanged = _ref.onIsActiveChanged;

        _classCallCheck(this, Activation);

        if (typeof onIsActiveChanged !== 'function') {
            throw new Error('onIsActiveChanged should be a function');
        }

        this.onIsActiveChanged = onIsActiveChanged;
        this.isActive = false;
        this.timers = [];
    }

    _createClass(Activation, [{
        key: 'activate',
        value: function activate() {
            this.isActive = true;
            this.onIsActiveChanged({ isActive: true });
        }
    }, {
        key: 'deactivate',
        value: function deactivate() {
            this.isActive = false;
            this.onIsActiveChanged({ isActive: false });
            this.clearTimers();
        }
    }, {
        key: 'toggleActivation',
        value: function toggleActivation() {
            if (this.isActive) {
                this.deactivate();
            } else {
                this.activate();
            }
        }
    }, {
        key: 'clearTimers',
        value: function clearTimers() {
            var timers = this.timers;
            while (timers.length) {
                var timer = timers.pop();
                clearTimeout(timer.id);
            }
        }
    }, {
        key: 'clearTimer',
        value: function clearTimer(timerName) {
            this.timers.forEach(function (timer) {
                if (timer.name === timerName) {
                    clearTimeout(timer.id);
                }
            });
        }
    }]);

    return Activation;
}();

export default Activation;