/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
import * as tslib_1 from "tslib";
import { Classes, Icon, MenuItem, Utils } from "@blueprintjs/core";
import { Omnibar } from "@blueprintjs/select";
import { filter } from "fuzzaldrin-plus";
import * as React from "react";
import { eachLayoutNode } from "../common/utils";
var NavOmnibar = Omnibar.ofType();
var Navigator = /** @class */ (function (_super) {
    tslib_1.__extends(Navigator, _super);
    function Navigator() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.filterMatches = function (query, items) {
            return filter(items, query, { key: "filterKey", isPath: true });
        };
        _this.renderItem = function (section, props) {
            if (!props.modifiers.matchesPredicate) {
                return null;
            }
            // insert caret-right between each path element
            var pathElements = section.path.reduce(function (elems, el) {
                elems.push(el, React.createElement(Icon, { icon: "caret-right" }));
                return elems;
            }, []);
            pathElements.pop();
            var text = (React.createElement(React.Fragment, null,
                React.createElement("div", null, section.title),
                React.createElement("small", { className: Classes.TEXT_MUTED }, pathElements)));
            return (React.createElement(MenuItem, { active: props.modifiers.active, href: "#" + section.route, key: section.route, multiline: true, onClick: props.handleClick, text: text }));
        };
        // updating location.hash will trigger hashchange event, which Documentation will receive and use to navigate.
        _this.handleItemSelect = function (item) {
            location.hash = item.route;
            _this.props.onClose();
        };
        return _this;
    }
    Navigator.prototype.componentDidMount = function () {
        var _this = this;
        this.sections = [];
        eachLayoutNode(this.props.items, function (node, parents) {
            if (Utils.safeInvoke(_this.props.itemExclude, node) === true) {
                // ignore excluded item
                return;
            }
            var route = node.route, title = node.title;
            var path = parents.map(function (p) { return p.title; }).reverse();
            var filterKey = path.concat(["`" + title]).join("/");
            _this.sections.push({ filterKey: filterKey, path: path, route: route, title: title });
        });
    };
    Navigator.prototype.render = function () {
        if (!this.sections) {
            return null;
        }
        return (React.createElement(NavOmnibar, { className: "docs-navigator-menu", itemListPredicate: this.filterMatches, isOpen: this.props.isOpen, items: this.sections, itemRenderer: this.renderItem, onItemSelect: this.handleItemSelect, onClose: this.props.onClose, resetOnSelect: true }));
    };
    return Navigator;
}(React.PureComponent));
export { Navigator };
//# sourceMappingURL=navigator.js.map