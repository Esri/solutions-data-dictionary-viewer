/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
/* istanbul ignore next */
export var Clipboard = {
    /**
     * Overrides the inherited CSS of the element to make sure it is
     * selectable. This method also makes the element pseudo-invisible.
     */
    applySelectableStyles: function (elem) {
        elem.style.overflow = "hidden";
        elem.style.height = "0px";
        elem.style.setProperty("-webkit-user-select", "all");
        elem.style.setProperty("-moz-user-select", "all");
        elem.style.setProperty("-ms-user-select", "all");
        elem.style.setProperty("user-select", "all");
        return elem;
    },
    /**
     * Copies table cells to the clipboard. The parameter is a row-major
     * 2-dimensional `Array` of strings and can contain nulls. We assume all
     * rows are the same length. If not, the cells will still be copied, but
     * the columns may not align. Returns a boolean indicating whether the
     * copy succeeded.
     *
     * See `Clipboard.copy`
     */
    copyCells: function (cells) {
        var table = document.createElement("table");
        Clipboard.applySelectableStyles(table);
        for (var _i = 0, cells_1 = cells; _i < cells_1.length; _i++) {
            var row = cells_1[_i];
            var tr = table.appendChild(document.createElement("tr"));
            for (var _a = 0, row_1 = row; _a < row_1.length; _a++) {
                var cell = row_1[_a];
                var td = tr.appendChild(document.createElement("td"));
                td.textContent = cell;
            }
        }
        var tsv = cells.map(function (row) { return row.join("\t"); }).join("\n");
        return Clipboard.copyElement(table, tsv);
    },
    /**
     * Copies the text to the clipboard. Returns a boolean
     * indicating whether the copy succeeded.
     *
     * See `Clipboard.copy`
     */
    copyString: function (value) {
        var text = document.createElement("textarea");
        Clipboard.applySelectableStyles(text);
        text.value = value;
        return Clipboard.copyElement(text, value);
    },
    /**
     * Copies the element and its children to the clipboard. Returns a boolean
     * indicating whether the copy succeeded.
     *
     * If a plaintext argument is supplied, we add both the text/html and
     * text/plain mime types to the clipboard. This preserves the built in
     * semantics of copying elements to the clipboard while allowing custom
     * plaintext output for programs that can't cope with HTML data in the
     * clipboard.
     *
     * Verified on Firefox 47, Chrome 51.
     *
     * Note: Sometimes the copy does not succeed. Presumably, in order to
     * prevent memory issues, browsers will limit the total amount of data you
     * can copy to the clipboard. Based on ad hoc testing, we found an
     * inconsistent limit at about 300KB or 40,000 cells. Depending on the on
     * the content of cells, your limits may vary.
     */
    copyElement: function (elem, plaintext) {
        if (!Clipboard.isCopySupported()) {
            return false;
        }
        // must be document.body instead of document.documentElement for firefox
        document.body.appendChild(elem);
        try {
            window.getSelection().selectAllChildren(elem);
            if (plaintext != null) {
                // add plaintext fallback
                // http://stackoverflow.com/questions/23211018/copy-to-clipboard-with-jquery-js-in-chrome
                elem.addEventListener("copy", function (e) {
                    e.preventDefault();
                    var clipboardData = e.clipboardData || window.clipboardData;
                    if (clipboardData != null) {
                        clipboardData.setData("text/html", elem.outerHTML);
                        clipboardData.setData("text/plain", plaintext);
                    }
                });
            }
            return document.execCommand("copy");
        }
        catch (err) {
            return false;
        }
        finally {
            document.body.removeChild(elem);
        }
    },
    /**
     * Returns a boolean indicating whether the current browser nominally
     * supports the `copy` operation using the `execCommand` API.
     */
    isCopySupported: function () {
        return document.queryCommandSupported != null && document.queryCommandSupported("copy");
    },
};
//# sourceMappingURL=clipboard.js.map