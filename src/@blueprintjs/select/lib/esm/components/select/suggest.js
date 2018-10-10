/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
import * as tslib_1 from "tslib";
import classNames from "classnames";
import * as React from "react";
import { DISPLAYNAME_PREFIX, InputGroup, Keys, Popover, Position, Utils, } from "@blueprintjs/core";
import { Classes } from "../../common";
import { QueryList } from "../query-list/queryList";
var Suggest = /** @class */ (function (_super) {
    tslib_1.__extends(Suggest, _super);
    function Suggest(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.TypedQueryList = QueryList.ofType();
        _this.refHandlers = {
            input: function (ref) {
                _this.input = ref;
                var _a = _this.props.inputProps, inputProps = _a === void 0 ? {} : _a;
                Utils.safeInvoke(inputProps.inputRef, ref);
            },
            queryList: function (ref) { return (_this.queryList = ref); },
        };
        _this.renderQueryList = function (listProps) {
            var _a = _this.props, _b = _a.inputProps, inputProps = _b === void 0 ? {} : _b, _c = _a.popoverProps, popoverProps = _c === void 0 ? {} : _c;
            var _d = _this.state, isOpen = _d.isOpen, selectedItem = _d.selectedItem;
            var handleKeyDown = listProps.handleKeyDown, handleKeyUp = listProps.handleKeyUp;
            var _e = inputProps.placeholder, placeholder = _e === void 0 ? "Search..." : _e;
            var selectedItemText = selectedItem ? _this.props.inputValueRenderer(selectedItem) : "";
            return (React.createElement(Popover, tslib_1.__assign({ autoFocus: false, enforceFocus: false, isOpen: isOpen, position: Position.BOTTOM_LEFT }, popoverProps, { className: classNames(listProps.className, popoverProps.className), onInteraction: _this.handlePopoverInteraction, popoverClassName: classNames(Classes.SELECT_POPOVER, popoverProps.popoverClassName), onOpened: _this.handlePopoverOpened }),
                React.createElement(InputGroup, tslib_1.__assign({}, inputProps, { placeholder: isOpen && selectedItemText ? selectedItemText : placeholder, inputRef: _this.refHandlers.input, onChange: listProps.handleQueryChange, onFocus: _this.handleInputFocus, onKeyDown: _this.getTargetKeyDownHandler(handleKeyDown), onKeyUp: _this.getTargetKeyUpHandler(handleKeyUp), value: isOpen ? listProps.query : selectedItemText })),
                React.createElement("div", { onKeyDown: handleKeyDown, onKeyUp: handleKeyUp }, listProps.itemList)));
        };
        _this.selectText = function () {
            // wait until the input is properly focused to select the text inside of it
            requestAnimationFrame(function () {
                if (_this.input != null) {
                    _this.input.setSelectionRange(0, _this.input.value.length);
                }
            });
        };
        _this.handleInputFocus = function (event) {
            var _a = _this.props, openOnKeyDown = _a.openOnKeyDown, _b = _a.inputProps, inputProps = _b === void 0 ? {} : _b;
            _this.selectText();
            // TODO can we leverage Popover.openOnTargetFocus for this?
            if (!openOnKeyDown) {
                _this.setState({ isOpen: true });
            }
            Utils.safeInvoke(inputProps.onFocus, event);
        };
        _this.handleItemSelect = function (item, event) {
            var nextOpenState;
            if (!_this.props.closeOnSelect) {
                if (_this.input != null) {
                    _this.input.focus();
                }
                _this.selectText();
                nextOpenState = true;
            }
            else {
                if (_this.input != null) {
                    _this.input.blur();
                }
                nextOpenState = false;
            }
            // the internal state should only change when uncontrolled.
            if (_this.props.selectedItem === undefined) {
                _this.setState({
                    isOpen: nextOpenState,
                    selectedItem: item,
                });
            }
            else {
                // otherwise just set the next open state.
                _this.setState({ isOpen: nextOpenState });
            }
            Utils.safeInvoke(_this.props.onItemSelect, item, event);
        };
        _this.handlePopoverInteraction = function (nextOpenState) {
            return requestAnimationFrame(function () {
                var _a = _this.props.popoverProps, popoverProps = _a === void 0 ? {} : _a;
                if (_this.input != null && _this.input !== document.activeElement) {
                    // the input is no longer focused so we can close the popover
                    _this.setState({ isOpen: false });
                }
                Utils.safeInvoke(popoverProps.onInteraction, nextOpenState);
            });
        };
        _this.handlePopoverOpened = function (node) {
            var _a = _this.props.popoverProps, popoverProps = _a === void 0 ? {} : _a;
            // scroll active item into view after popover transition completes and all dimensions are stable.
            if (_this.queryList != null) {
                _this.queryList.scrollActiveItemIntoView();
            }
            Utils.safeInvoke(popoverProps.onOpened, node);
        };
        _this.getTargetKeyDownHandler = function (handleQueryListKeyDown) {
            return function (evt) {
                var which = evt.which;
                var _a = _this.props, _b = _a.inputProps, inputProps = _b === void 0 ? {} : _b, openOnKeyDown = _a.openOnKeyDown;
                if (which === Keys.ESCAPE || which === Keys.TAB) {
                    if (_this.input != null) {
                        _this.input.blur();
                    }
                    _this.setState({
                        isOpen: false,
                    });
                }
                else if (openOnKeyDown &&
                    which !== Keys.BACKSPACE &&
                    which !== Keys.ARROW_LEFT &&
                    which !== Keys.ARROW_RIGHT) {
                    _this.setState({ isOpen: true });
                }
                if (_this.state.isOpen) {
                    Utils.safeInvoke(handleQueryListKeyDown, evt);
                }
                Utils.safeInvoke(inputProps.onKeyDown, evt);
            };
        };
        _this.getTargetKeyUpHandler = function (handleQueryListKeyUp) {
            return function (evt) {
                var _a = _this.props.inputProps, inputProps = _a === void 0 ? {} : _a;
                if (_this.state.isOpen) {
                    Utils.safeInvoke(handleQueryListKeyUp, evt);
                }
                Utils.safeInvoke(inputProps.onKeyUp, evt);
            };
        };
        _this.state = {
            isOpen: (props.popoverProps && props.popoverProps.isOpen) || false,
            selectedItem: _this.getInitialSelectedItem(),
        };
        return _this;
    }
    Suggest.ofType = function () {
        return Suggest;
    };
    Suggest.prototype.render = function () {
        // omit props specific to this component, spread the rest.
        var _a = this.props, inputProps = _a.inputProps, popoverProps = _a.popoverProps, restProps = tslib_1.__rest(_a, ["inputProps", "popoverProps"]);
        return (React.createElement(this.TypedQueryList, tslib_1.__assign({}, restProps, { onItemSelect: this.handleItemSelect, ref: this.refHandlers.queryList, renderer: this.renderQueryList })));
    };
    Suggest.prototype.componentWillReceiveProps = function (nextProps) {
        // If the selected item prop changes, update the underlying state.
        if (nextProps.selectedItem !== undefined && nextProps.selectedItem !== this.state.selectedItem) {
            this.setState({ selectedItem: nextProps.selectedItem });
        }
    };
    Suggest.prototype.componentDidUpdate = function (_prevProps, prevState) {
        if (this.state.isOpen && !prevState.isOpen && this.queryList != null) {
            this.queryList.scrollActiveItemIntoView();
        }
    };
    Suggest.prototype.getInitialSelectedItem = function () {
        // controlled > uncontrolled > default
        if (this.props.selectedItem !== undefined) {
            return this.props.selectedItem;
        }
        else if (this.props.defaultSelectedItem !== undefined) {
            return this.props.defaultSelectedItem;
        }
        else {
            return null;
        }
    };
    Suggest.displayName = DISPLAYNAME_PREFIX + ".Suggest";
    // Note: can't use <T> in static members, so this remains dynamically typed.
    Suggest.defaultProps = {
        closeOnSelect: true,
        openOnKeyDown: false,
    };
    return Suggest;
}(React.PureComponent));
export { Suggest };
//# sourceMappingURL=suggest.js.map