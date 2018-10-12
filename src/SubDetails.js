import React, {Component} from 'react';
import ReactDOM from 'react-dom';
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

class SubDetailsTable extends Component {
  constructor(props) {
    super(props),
    this.state = {
        columns: props.columns,
        data: props.data,
        header: props.header
    }
  }

  render() {
      const numRows = this.state.data.length;
      const columns = this.createColumns();
      return (
        <div>
          <h3>{this.state.header}</h3>
          <Table
              bodyContextMenuRenderer={this.renderBodyContextMenu}
              numRows={numRows}
              selectionModes={SelectionModes.COLUMNS_AND_CELLS}
              >
              {columns}
          </Table>
        </div>
      );
  };

  createColumns = () => {
    let columns = [];
    for(let i=0; i< this.state.columns.length; i++) {
      columns.push(<Column key={this.state.columns[i].name} name={this.state.columns[i].name}  cellRenderer={this.cellRenderer} />);
    }
    return columns;
  };

  cellRenderer = (rowIndex, columnIndex) => {
    return <Cell>{this.state.data[rowIndex][columnIndex]}</Cell>
  };

  getCellData = (rowIndex, columnIndex) => {
      const sortedRowIndex = this.state.sortedIndexMap[rowIndex];
      if (sortedRowIndex != null) {
          rowIndex = sortedRowIndex;
      }
      return this.state.data[rowIndex][columnIndex];
  };

}

export default SubDetailsTable;