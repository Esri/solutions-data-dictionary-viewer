/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
import * as tslib_1 from "tslib";
import classNames from "classnames";
import * as React from "react";
import { DISPLAYNAME_PREFIX, Keys, Popover, Position, TagInput, Utils, } from "@blueprintjs/core";
import { Classes } from "../../common";
import { QueryList } from "../query-list/queryList";
var MultiSelect = /** @class */ (function (_super) {
    tslib_1.__extends(MultiSelect, _super);
    function MultiSelect() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            isOpen: (_this.props.popoverProps && _this.props.popoverProps.isOpen) || false,
        };
        _this.TypedQueryList = QueryList.ofType();
        _this.refHandlers = {
            input: function (ref) {
                _this.input = ref;
                var _a = _this.props.tagInputProps, tagInputProps = _a === void 0 ? {} : _a;
                Utils.safeInvoke(tagInputProps.inputRef, ref);
            },
            queryList: function (ref) { return (_this.queryList = ref); },
        };
        _this.renderQueryList = function (listProps) {
            var _a = _this.props, _b = _a.tagInputProps, tagInputProps = _b === void 0 ? {} : _b, _c = _a.popoverProps, popoverProps = _c === void 0 ? {} : _c, _d = _a.selectedItems, selectedItems = _d === void 0 ? [] : _d, placeholder = _a.placeholder;
            var handleKeyDown = listProps.handleKeyDown, handleKeyUp = listProps.handleKeyUp;
            return (React.createElement(Popover, tslib_1.__assign({ autoFocus: false, canEscapeKeyClose: true, enforceFocus: false, isOpen: _this.state.isOpen, position: Position.BOTTOM_LEFT }, popoverProps, { className: classNames(listProps.className, popoverProps.className), onInteraction: _this.handlePopoverInteraction, popoverClassName: classNames(Classes.MULTISELECT_POPOVER, popoverProps.popoverClassName), onOpened: _this.handlePopoverOpened }),
                React.createElement("div", { onKeyDown: _this.getTargetKeyDownHandler(handleKeyDown), onKeyUp: _this.state.isOpen ? handleKeyUp : undefined },
                    React.createElement(TagInput, tslib_1.__assign({ placeholder: placeholder }, tagInputProps, { className: classNames(Classes.MULTISELECT, tagInputProps.className), inputRef: _this.refHandlers.input, inputValue: listProps.query, onInputChange: listProps.handleQueryChange, values: selectedItems.map(_this.props.tagRenderer) }))),
                React.createElement("div", { onKeyDown: _this.getTargetKeyDownHandler(handleKeyDown), onKeyUp: handleKeyUp }, listProps.itemList)));
        };
        _this.handleItemSelect = function (item, evt) {
            if (_this.input != null) {
                _this.input.focus();
            }
            Utils.safeInvoke(_this.props.onItemSelect, item, evt);
        };
        _this.handleQueryChange = function (query, evt) {
            _this.setState({ isOpen: query.length > 0 || !_this.props.openOnKeyDown });
            Utils.safeInvoke(_this.props.onQueryChange, query, evt);
        };
        _this.handlePopoverInteraction = function (nextOpenState) {
            return requestAnimationFrame(function () {
                // deferring to rAF to get properly updated activeElement
                var _a = _this.props.popoverProps, popoverProps = _a === void 0 ? {} : _a;
                if (_this.input != null && _this.input !== document.activeElement) {
                    // the input is no longer focused so we can close the popover
                    _this.setState({ isOpen: false });
                }
                else if (!_this.props.openOnKeyDown) {
                    // open the popover when focusing the tag input
                    _this.setState({ isOpen: true });
                }
                Utils.safeInvoke(popoverProps.onInteraction, nextOpenState);
            });
        };
        _this.handlePopoverOpened = function (node) {
            var _a = _this.props.popoverProps, popoverProps = _a === void 0 ? {} : _a;
            if (_this.queryList != null) {
                // scroll active item into view after popover transition completes and all dimensions are stable.
                _this.queryList.scrollActiveItemIntoView();
            }
            Utils.safeInvoke(popoverProps.onOpened, node);
        };
        _this.getTargetKeyDownHandler = function (handleQueryListKeyDown) {
            return function (e) {
                var which = e.which;
                if (which === Keys.ESCAPE || which === Keys.TAB) {
                    // By default the escape key will not trigger a blur on the
                    // input element. It must be done explicitly.
                    if (_this.input != null) {
                        _this.input.blur();
                    }
                    _this.setState({ isOpen: false });
                }
                else if (!(which === Keys.BACKSPACE || which === Keys.ARROW_LEFT || which === Keys.ARROW_RIGHT)) {
                    _this.setState({ isOpen: true });
                }
                if (_this.state.isOpen) {
                    Utils.safeInvoke(handleQueryListKeyDown, e);
                }
            };
        };
        return _this;
    }
    MultiSelect.ofType = function () {
        return MultiSelect;
    };
    MultiSelect.prototype.render = function () {
        // omit props specific to this component, spread the rest.
        var _a = this.props, openOnKeyDown = _a.openOnKeyDown, popoverProps = _a.popoverProps, tagInputProps = _a.tagInputProps, restProps = tslib_1.__rest(_a, ["openOnKeyDown", "popoverProps", "tagInputProps"]);
        return (React.createElement(this.TypedQueryList, tslib_1.__assign({}, restProps, { onItemSelect: this.handleItemSelect, onQueryChange: this.handleQueryChange, ref: this.refHandlers.queryList, renderer: this.renderQueryList })));
    };
    MultiSelect.displayName = DISPLAYNAME_PREFIX + ".MultiSelect";
    MultiSelect.defaultProps = {
        placeholder: "Search...",
    };
    return MultiSelect;
}(React.PureComponent));
export { MultiSelect };
//# sourceMappingURL=multiSelect.js.map