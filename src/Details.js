import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
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
import { store } from './store/index';

class DetailsTable extends Component {
  constructor(props) {
    super(props),
    this.state = {
        columns: props.columns,
        data: props.data,
        sortedIndexMap: []
    }
    store.subscribe(()=> {
      this.rebuildTable();
    });
  }

  render() {
      const numRows = this.state.data.length;
      const columns = this.createColumns();
      return (
              <Table
                  bodyContextMenuRenderer={this.renderBodyContextMenu}
                  numRows={numRows}
                  selectionModes={SelectionModes.COLUMNS_AND_CELLS}
                  >
                  {columns}
              </Table>
      );
  };

  rebuildTable = () => {
    let details = store.getState().state.detailData[0].details;
    let newColumns = [];
    let newData = [];
    let tempList = [];
    if(Array.isArray(details)) {
      for(let key in details[0]) {
        newColumns.push({
          "name":key, "index":key
        });
      }
      for(let i=0; i<details.length; i++) {
        for(let key in details[i]) {
          if(Array.isArray(details[i][key])) {
            this.createSubTable({key:key, data:details[i][key]})
          } else {
            tempList.push(details[i][key].toString());
          }
        }
        newData.push(tempList);
        tempList = [];
      }
    } else {
      for(let key in details) {
        newColumns.push({
          "name":key, "index":key
        });
        tempList.push(details[key].toString());
      }
      newData.push(tempList);
    }

    this.setState({columns: newColumns, data: newData});
  };

  createColumns = () => {
    let columns = [];
    console.log(this.state.data);
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

  //handle subElements (basically x level of arrays)
  createSubTable = (args) => {
    console.log(args);
    let newSlot = document.createElement("div");
    newSlot.id = "test"
    document.getElementById("subDetails").appendChild(newSlot);

    ReactDOM.render(<Provider store={store}><DetailsTable columns={[args.key]} data={[]} /></Provider>, document.getElementById('test'));
  }

}

export default DetailsTable;