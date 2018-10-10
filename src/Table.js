/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

// tslint:disable max-classes-per-file

import * as React from "react";
import { Menu, MenuItem, Popover } from "@blueprintjs/core";
import {
    Cell,
    Column,
    ColumnHeaderCell,
    CopyCellsMenuItem,
    IMenuContext,
    SelectionModes,
    Table,
    Utils,
} from "@blueprintjs/table";

// tslint:disable-next-line:no-var-requires
const dataFile = require("./support_files/data.json");


class AbstractSortableColumn {
    constructor(props) {
      this.state = {
        name: props.name,
        index: props.index
      }
    }

    getColumn(getCellData, sortColumn) {
        const cellRenderer = (rowIndex, columnIndex) => (
            <Cell>{getCellData(rowIndex, columnIndex)}</Cell>
        );
        const menuRenderer = this.renderMenu.bind(this, sortColumn);
        const columnHeaderCellRenderer = () => <ColumnHeaderCell name={this.state.name} menuRenderer={menuRenderer} />;
        return (
            <Column
                cellRenderer={cellRenderer}
                columnHeaderCellRenderer={columnHeaderCellRenderer}
                key={this.state.index}
                name={this.state.name}
            />
        );
    }

    renderMenu(sortColumn) {}
}

class TextSortableColumn extends AbstractSortableColumn {
    renderMenu(sortColumn) {
        const sortAsc = () => sortColumn(this.state.index, (a, b) => this.compare(a, b));
        const sortDesc = () => sortColumn(this.state.index, (a, b) => this.compare(b, a));
        const exampleMenu = (
          <Menu>
              <MenuItem icon="sort-asc" onClick={sortAsc} text="Sort Asc" />
              <MenuItem icon="sort-desc" onClick={sortDesc} text="Sort Desc" />
          </Menu>
        );
        return (
          <Popover content={exampleMenu}></Popover>
        );
    }

    compare(a, b) {
        return a.toString().localeCompare(b);
    }
}

class RankSortableColumn extends AbstractSortableColumn {
    static RANK_PATTERN = /([YOSKMJ])([0-9]+)(e|w)/i;
    static TITLES = {
        J: 5, // Juryo
        K: 3, // Komusubi
        M: 4, // Maegashira
        O: 1, // Ozeki
        S: 2, // Sekiwake
        Y: 0, // Yokozuna
    };

    renderMenu(sortColumn) {
        const sortAsc = () => sortColumn(this.index, (a, b) => this.compare(a, b));
        const sortDesc = () => sortColumn(this.index, (a, b) => this.compare(b, a));
        const exampleMenu = (
          <Menu>
              <MenuItem icon="sort-asc" onClick={sortAsc} text="Sort Asc" />
              <MenuItem icon="sort-desc" onClick={sortDesc} text="Sort Desc" />
          </Menu>
        );
        return (
          <Popover content={exampleMenu}></Popover>
        );
    }

    toRank(str) {
        const match = RankSortableColumn.RANK_PATTERN.exec(str);
        if (match == null) {
            return 1000;
        }
        const [title, rank, side] = match.slice(1);
        return RankSortableColumn.TITLES[title] * 100 + (side === "e" ? 0 : 1) + parseInt(rank, 10) * 2;
    }

    compare(a, b) {
        return this.toRank(a) - this.toRank(b);
    }
}

class RecordSortableColumn extends AbstractSortableColumn {
    static WIN_LOSS_PATTERN = /^([0-9]+)(-([0-9]+))?(-([0-9]+)) ?.*/;

    renderMenu(sortColumn) {
        // tslint:disable:jsx-no-lambda
        return (
            <Menu>
                <MenuItem
                    icon="sort-asc"
                    onClick={() => sortColumn(this.index, this.transformCompare(this.toWins, false))}
                    text="Sort Wins Asc"
                />
                <MenuItem
                    icon="sort-desc"
                    onClick={() => sortColumn(this.index, this.transformCompare(this.toWins, true))}
                    text="Sort Wins Desc"
                />
                <MenuItem
                    icon="sort-asc"
                    onClick={() => sortColumn(this.index, this.transformCompare(this.toLosses, false))}
                    text="Sort Losses Asc"
                />
                <MenuItem
                    icon="sort-desc"
                    onClick={() => sortColumn(this.index, this.transformCompare(this.toLosses, true))}
                    text="Sort Losses Desc"
                />
                <MenuItem
                    icon="sort-asc"
                    onClick={() => sortColumn(this.index, this.transformCompare(this.toTies, false))}
                    text="Sort Ties Asc"
                />
                <MenuItem
                    icon="sort-desc"
                    onClick={() => sortColumn(this.index, this.transformCompare(this.toTies, true))}
                    text="Sort Ties Desc"
                />
            </Menu>
        );
        // tslint:enable:jsx-no-lambda
    }

    transformCompare(transform, reverse) {
        if (reverse) {
            return (a, b) => transform(b) - transform(a);
        } else {
            return (a, b) => transform(a) - transform(b);
        }
    }

    toWins(a) {
        const match = RecordSortableColumn.WIN_LOSS_PATTERN.exec(a);
        return match == null ? -1 : parseInt(match[1], 10);
    }

    toTies(a) {
        const match = RecordSortableColumn.WIN_LOSS_PATTERN.exec(a);
        return match == null || match[3] == null ? -1 : parseInt(match[3], 10);
    }

    toLosses(a) {
        const match = RecordSortableColumn.WIN_LOSS_PATTERN.exec(a);
        return match == null ? -1 : parseInt(match[5], 10);
    }
}

class TableSortableExample extends React.PureComponent {
    state = {
        columns: [
            new TextSortableColumn({"name":"Asset Type", "index":0}),
            new RankSortableColumn({"name":"Code", "index":1}),
            new RecordSortableColumn({"name":"Description", "index":2})
        ],
        data: dataFile,
        sortedIndexMap: []
    };

    render() {
        const numRows = this.state.data.length;
        const columns = this.state.columns.map(col => col.getColumn(this.getCellData, this.sortColumn));
        return (
                <Table
                    bodyContextMenuRenderer={this.renderBodyContextMenu}
                    numRows={numRows}
                    selectionModes={SelectionModes.COLUMNS_AND_CELLS}
                    columnWidths={[200,100,600]}
                    >
                    {columns}
                </Table>
        );
    };

    getCellData = (rowIndex, columnIndex) => {
        const sortedRowIndex = this.state.sortedIndexMap[rowIndex];
        if (sortedRowIndex != null) {
            rowIndex = sortedRowIndex;
        }
        return this.state.data[rowIndex][columnIndex];
    };

    renderBodyContextMenu = (context) => {
        return (
            <Menu>
                <CopyCellsMenuItem context={context} getCellData={this.getCellData} text="Copy" />
            </Menu>
        );
    };

    sortColumn = (columnIndex, comparator) => {
        const { data } = this.state;
        const sortedIndexMap = Utils.times(data.length, (i) => i);
        sortedIndexMap.sort((a, b) => {
            return comparator(data[a][columnIndex], data[b][columnIndex]);
        });
        this.setState({ sortedIndexMap });
    };
}

export default TableSortableExample;