/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
import * as tslib_1 from "tslib";
import { EditableText, Utils as CoreUtils } from "@blueprintjs/core";
import classNames from "classnames";
import * as React from "react";
import * as Classes from "../common/classes";
var EditableName = /** @class */ (function (_super) {
    tslib_1.__extends(EditableName, _super);
    function EditableName(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.handleEdit = function () {
            _this.setState({ isEditing: true, dirtyName: _this.state.savedName });
        };
        _this.handleCancel = function (value) {
            // don't strictly need to clear the dirtyName, but it's better hygiene
            _this.setState({ isEditing: false, dirtyName: undefined });
            _this.invokeCallback(_this.props.onCancel, value);
        };
        _this.handleChange = function (value) {
            _this.setState({ dirtyName: value });
            _this.invokeCallback(_this.props.onChange, value);
        };
        _this.handleConfirm = function (value) {
            _this.setState({ isEditing: false, savedName: value, dirtyName: undefined });
            _this.invokeCallback(_this.props.onConfirm, value);
        };
        _this.state = {
            dirtyName: props.name,
            isEditing: false,
            savedName: props.name,
        };
        return _this;
    }
    EditableName.prototype.componentWillReceiveProps = function (nextProps) {
        var name = nextProps.name;
        if (name !== this.props.name) {
            this.setState({ savedName: name, dirtyName: name });
        }
    };
    EditableName.prototype.render = function () {
        var _a = this.props, className = _a.className, intent = _a.intent, name = _a.name;
        var _b = this.state, isEditing = _b.isEditing, dirtyName = _b.dirtyName, savedName = _b.savedName;
        return (React.createElement(EditableText, { className: classNames(className, Classes.TABLE_EDITABLE_NAME), defaultValue: name, intent: intent, minWidth: null, onCancel: this.handleCancel, onChange: this.handleChange, onConfirm: this.handleConfirm, onEdit: this.handleEdit, placeholder: "", selectAllOnFocus: true, value: isEditing ? dirtyName : savedName }));
    };
    EditableName.prototype.invokeCallback = function (callback, value) {
        var index = this.props.index;
        CoreUtils.safeInvoke(callback, value, index);
    };
    return EditableName;
}(React.PureComponent));
export { EditableName };
//# sourceMappingURL=editableName.js.map