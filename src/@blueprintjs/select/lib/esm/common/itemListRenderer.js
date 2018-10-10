/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */
/**
 * `ItemListRenderer` helper method for rendering each item in `filteredItems`,
 * with optional support for `noResults` (when filtered items is empty)
 * and `initialContent` (when query is empty).
 */
export function renderFilteredItems(props, noResults, initialContent) {
    if (props.query.length === 0 && initialContent !== undefined) {
        return initialContent;
    }
    var items = props.filteredItems.map(props.renderItem).filter(function (item) { return item != null; });
    return items.length > 0 ? items : noResults;
}
//# sourceMappingURL=itemListRenderer.js.map