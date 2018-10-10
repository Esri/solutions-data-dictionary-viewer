"use strict";
/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var core_1 = require("@blueprintjs/core");
var classnames_1 = tslib_1.__importDefault(require("classnames"));
var React = tslib_1.__importStar(require("react"));
exports.WARNING_BASE_EXAMPLE_DEPRECATED = "[Blueprint] BaseExample is deprecated and will be removed in the next beta. Compose new Example component instead of extending BaseExample.";
/**
 * Starter class for all React example components.
 * Examples and options are rendered into separate containers.
 * @deprecated
 */
var BaseExample = /** @class */ (function (_super) {
    tslib_1.__extends(BaseExample, _super);
    function BaseExample() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // Can't put this in state, because the state typing is generic.
        _this.hasDelayedBeforeInitialRender = false;
        _this.hasCompletedInitialRender = false;
        return _this;
    }
    BaseExample.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        return (
        // HACKHACK: Permit one redundant re-render after the inital delay. (This will be the first proper render of
        // the component.)
        (this.hasDelayedBeforeInitialRender && !this.hasCompletedInitialRender) ||
            // Now, mimic PureComponent shouldComponentUpdate behavior:
            !core_1.Utils.shallowCompareKeys(this.props, nextProps) ||
            !core_1.Utils.shallowCompareKeys(this.state, nextState));
    };
    BaseExample.prototype.componentWillMount = function () {
        var _this = this;
        // HACKHACK: The docs app suffers from a Flash of Unstyled Content that causes some 'width: 100%' examples to
        // render incorrectly, because they mis-measure the horizontal space available to them. Until that bug is squashed,
        // this is the workaround: delay initial render with a requestAnimationFrame.
        requestAnimationFrame(function () {
            _this.hasDelayedBeforeInitialRender = true;
            _this.forceUpdate();
        });
    };
    BaseExample.prototype.componentDidMount = function () {
        console.warn(exports.WARNING_BASE_EXAMPLE_DEPRECATED);
    };
    BaseExample.prototype.componentDidUpdate = function (_nextProps, _nextState) {
        // HACKHACK: Initial render happens as an *update* due to our requestAnimationFrame shenanigans, not as a mount.
        // Once we've rendered initially, set this flag so that shouldComponentUpdate logic will return to its normal
        // PureComponent-style logic, ignoring these flags henceforth.
        if (!this.hasCompletedInitialRender) {
            this.hasCompletedInitialRender = true;
        }
    };
    BaseExample.prototype.render = function () {
        // HACKHACK: This is the other required piece. Don't let any React nodes into the DOM until the
        // requestAnimationFrame delay has elapsed. This prevents shouldComponentUpdate snafus at lower levels.
        if (!this.hasDelayedBeforeInitialRender) {
            return null;
        }
        return (React.createElement("div", { className: classnames_1.default("docs-example-frame", this.className), "data-example-id": this.props.id },
            React.createElement("div", { className: "docs-example" }, this.renderExample()),
            React.createElement("div", { className: "docs-example-options" }, this.actuallyRenderOptions())));
    };
    /**
     * Render the example element. Return any valid React node.
     */
    BaseExample.prototype.renderExample = function () {
        return undefined;
    };
    /**
     * Render the options controls. Return a single element for simple mode, or an array of arrays
     * of elements to generate columns: each array will be its own column. When using array mode,
     * the inner elements will each need the `key` prop.
     */
    BaseExample.prototype.renderOptions = function () {
        return [];
    };
    BaseExample.prototype.actuallyRenderOptions = function () {
        var options = this.renderOptions();
        if (Array.isArray(options)) {
            return options.map(function (column, i) { return (React.createElement("div", { className: "docs-react-options-column", key: i }, column)); });
        }
        else {
            return options;
        }
    };
    return BaseExample;
}(React.Component));
exports.BaseExample = BaseExample;
/** Event handler that exposes the target element's value as a boolean. */
function handleBooleanChange(handler) {
    return function (event) { return handler(event.target.checked); };
}
exports.handleBooleanChange = handleBooleanChange;
/** Event handler that exposes the target element's value as a string. */
function handleStringChange(handler) {
    return function (event) { return handler(event.target.value); };
}
exports.handleStringChange = handleStringChange;
/** Event handler that exposes the target element's value as a number. */
function handleNumberChange(handler) {
    return handleStringChange(function (value) { return handler(+value); });
}
exports.handleNumberChange = handleNumberChange;
//# sourceMappingURL=baseExample.js.map