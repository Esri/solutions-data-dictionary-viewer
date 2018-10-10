"use strict";
/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var classnames_1 = tslib_1.__importDefault(require("classnames"));
var React = tslib_1.__importStar(require("react"));
var core_1 = require("@blueprintjs/core");
var common_1 = require("../../common");
var queryList_1 = require("../query-list/queryList");
var Select = /** @class */ (function (_super) {
    tslib_1.__extends(Select, _super);
    function Select(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.TypedQueryList = queryList_1.QueryList.ofType();
        _this.refHandlers = {
            input: function (ref) {
                _this.input = ref;
                var _a = _this.props.inputProps, inputProps = _a === void 0 ? {} : _a;
                core_1.Utils.safeInvoke(inputProps.inputRef, ref);
            },
            queryList: function (ref) { return (_this.list = ref); },
        };
        _this.renderQueryList = function (listProps) {
            // not using defaultProps cuz they're hard to type with generics (can't use <T> on static members)
            var _a = _this.props, _b = _a.filterable, filterable = _b === void 0 ? true : _b, _c = _a.disabled, disabled = _c === void 0 ? false : _c, _d = _a.inputProps, inputProps = _d === void 0 ? {} : _d, _e = _a.popoverProps, popoverProps = _e === void 0 ? {} : _e;
            var input = (React.createElement(core_1.InputGroup, tslib_1.__assign({ leftIcon: "search", placeholder: "Filter...", rightElement: _this.maybeRenderClearButton(listProps.query) }, inputProps, { inputRef: _this.refHandlers.input, onChange: listProps.handleQueryChange, value: listProps.query })));
            var handleKeyDown = listProps.handleKeyDown, handleKeyUp = listProps.handleKeyUp;
            return (React.createElement(core_1.Popover, tslib_1.__assign({ autoFocus: false, enforceFocus: false, isOpen: _this.state.isOpen, disabled: disabled, position: core_1.Position.BOTTOM_LEFT }, popoverProps, { className: classnames_1.default(listProps.className, popoverProps.className), onInteraction: _this.handlePopoverInteraction, popoverClassName: classnames_1.default(common_1.Classes.SELECT_POPOVER, popoverProps.popoverClassName), onOpening: _this.handlePopoverOpening, onOpened: _this.handlePopoverOpened, onClosing: _this.handlePopoverClosing }),
                React.createElement("div", { onKeyDown: _this.state.isOpen ? handleKeyDown : _this.handleTargetKeyDown, onKeyUp: _this.state.isOpen ? handleKeyUp : undefined }, _this.props.children),
                React.createElement("div", { onKeyDown: handleKeyDown, onKeyUp: handleKeyUp },
                    filterable ? input : undefined,
                    listProps.itemList)));
        };
        _this.handleTargetKeyDown = function (event) {
            // open popover when arrow key pressed on target while closed
            if (event.which === core_1.Keys.ARROW_UP || event.which === core_1.Keys.ARROW_DOWN) {
                event.preventDefault();
                _this.setState({ isOpen: true });
            }
        };
        _this.handleItemSelect = function (item, event) {
            _this.setState({ isOpen: false });
            core_1.Utils.safeInvoke(_this.props.onItemSelect, item, event);
        };
        _this.handlePopoverInteraction = function (isOpen) {
            _this.setState({ isOpen: isOpen });
            var _a = _this.props.popoverProps, popoverProps = _a === void 0 ? {} : _a;
            core_1.Utils.safeInvoke(popoverProps.onInteraction, isOpen);
        };
        _this.handlePopoverOpening = function (node) {
            var _a = _this.props, _b = _a.popoverProps, popoverProps = _b === void 0 ? {} : _b, resetOnClose = _a.resetOnClose;
            // save currently focused element before popover steals focus, so we can restore it when closing.
            _this.previousFocusedElement = document.activeElement;
            if (resetOnClose) {
                _this.resetQuery();
            }
            core_1.Utils.safeInvoke(popoverProps.onOpening, node);
        };
        _this.handlePopoverOpened = function (node) {
            // scroll active item into view after popover transition completes and all dimensions are stable.
            if (_this.list != null) {
                _this.list.scrollActiveItemIntoView();
            }
            requestAnimationFrame(function () {
                var _a = _this.props.inputProps, inputProps = _a === void 0 ? {} : _a;
                // autofocus is enabled by default
                if (inputProps.autoFocus !== false && _this.input != null) {
                    _this.input.focus();
                }
            });
            var _a = _this.props.popoverProps, popoverProps = _a === void 0 ? {} : _a;
            core_1.Utils.safeInvoke(popoverProps.onOpened, node);
        };
        _this.handlePopoverClosing = function (node) {
            // restore focus to saved element.
            // timeout allows popover to begin closing and remove focus handlers beforehand.
            requestAnimationFrame(function () {
                if (_this.previousFocusedElement !== undefined) {
                    _this.previousFocusedElement.focus();
                    _this.previousFocusedElement = undefined;
                }
            });
            var _a = _this.props.popoverProps, popoverProps = _a === void 0 ? {} : _a;
            core_1.Utils.safeInvoke(popoverProps.onClosing, node);
        };
        _this.resetQuery = function () { return _this.list && _this.list.setQuery("", true); };
        _this.state = { isOpen: false };
        return _this;
    }
    Select.ofType = function () {
        return Select;
    };
    Select.prototype.render = function () {
        // omit props specific to this component, spread the rest.
        var _a = this.props, filterable = _a.filterable, inputProps = _a.inputProps, popoverProps = _a.popoverProps, restProps = tslib_1.__rest(_a, ["filterable", "inputProps", "popoverProps"]);
        return (React.createElement(this.TypedQueryList, tslib_1.__assign({}, restProps, { onItemSelect: this.handleItemSelect, ref: this.refHandlers.queryList, renderer: this.renderQueryList })));
    };
    Select.prototype.componentDidUpdate = function (_prevProps, prevState) {
        if (this.state.isOpen && !prevState.isOpen && this.list != null) {
            this.list.scrollActiveItemIntoView();
        }
    };
    Select.prototype.maybeRenderClearButton = function (query) {
        return query.length > 0 ? React.createElement(core_1.Button, { icon: "cross", minimal: true, onClick: this.resetQuery }) : undefined;
    };
    Select.displayName = core_1.DISPLAYNAME_PREFIX + ".Select";
    return Select;
}(React.PureComponent));
exports.Select = Select;
//# sourceMappingURL=select.js.map