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
import SubDetailsTable from './SubDetails';

class DetailsTable extends Component {
  constructor(props) {
    super(props),
    this.state = {
        columns: props.columns,
        data: props.data,
        header: props.header,
        sortedIndexMap: []
    }
    store.subscribe(()=> {
      if(store.getState().state.detailData !== null) {
        let tables = this.rebuildTable({
          details: store.getState().state.detailData[0].details,
          table:"main",
          header: "Details"
        });
        if(tables.length > 0) {
          let elem = document.getElementById("subDetails");
          while( elem.hasChildNodes() ){
            elem.removeChild(elem.lastChild);
          }
          for (let i=0; i<tables.length; i++) {
            if(tables[i].table === "main") {
              this.setState({columns: tables[i].columns, data: tables[i].data, header: "Details"});
            } else {
              this.createSubTable(tables[i]);
            }
          }
        }
      }
    });
  }

  render() {
    const numRows = this.state.data.length;
    const columns = this.createColumns();
    if(this.state.data.length > 0) {
      if(document.getElementById("detailsTable")) {
        document.getElementById("detailsTable").style.display = "block";
      }
    } else {
      if(document.getElementById("detailsTable")) {
        document.getElementById("detailsTable").style.display = "none";
      }
    }
    return (
      <div>
        <h1>{this.state.header}</h1>
        <div>
        <Table
            bodyContextMenuRenderer={this.renderBodyContextMenu}
            numRows={numRows}
            selectionModes={SelectionModes.CELLS}
            onSelection={this.showPopOver}
            >
            {columns}
        </Table>
        </div>
      </div>
    );
  };

  //#TODO: manually create column list cuz of differences in possible properties
  rebuildTable = (args) => {
    let totalTables = [];
    let subTables = [];
    let recurseLookup = (args) => {
      let details = args.details;
      let newColumns = [];
      let newData = [];
      let tempList = [];
      if(Array.isArray(details)) {
        for(let i=0; i<details.length; i++) {
          for(let key in details[i]) {
            if(i === 1) {
              //use the second row for column heading, skip first row OBJECTID
              newColumns.push({"name":key, "index":key});
            }
            if(typeof(details[i][key]) !== "object" ) {
              tempList.push(details[i][key].toString());
            } else {
              let uniqueID = "";
              if(details[i][key] !== null ) {
                //seeing if there is some name like 'name', domainName, subtypename, that can add uniqueness to subtables
                if(Object.keys(details[i][key]).join().indexOf("name") > -1) {
                  let availableName = Object.keys(details[i][key]).join();
                  let newSegment = availableName.substring(Object.keys(details[i][key]).join().indexOf("name"));
                  let foundSegment = newSegment.substring(0, newSegment.indexOf(","));
                  if(details[i][key].hasOwnProperty(foundSegment)) {
                    tempList.push(details[i][key][foundSegment]);
                  }
                  uniqueID = key + " : " + details[i][key][foundSegment];
                } else {
                  uniqueID = key
                }
                subTables.push({details: details[i][key], table:"subTable", header:uniqueID});
              }
            }
          }
          newData.push(tempList);
          tempList = [];
        }
      } else {
        for(let key in details) {
          if(typeof(details[key]) !== "object") {
            newColumns.push({
              "name":key, "index":key
            });
            tempList.push(details[key].toString());
          } else {
            //if there are sub levels of Objects or Array, send it to SubDetails
            let uniqueID = "";
            if(details[key] !== null ) {
              if(Object.keys(details).join().indexOf("name")) {
                let availableName = Object.keys(details).join();
                let newSegment = availableName.substring(Object.keys(details).join().indexOf("name"));
                let foundSegment = newSegment.substring(0, newSegment.indexOf(","));
                if(details.hasOwnProperty(foundSegment)) {
                  uniqueID = key + " : " + details[foundSegment];
                } else {
                  uniqueID = key
                }
              }
              subTables.push({details: details[key], table:"subTable", header:uniqueID});
            }
          }
        }
        newData.push(tempList);
      }
      totalTables.push({columns: newColumns, data: newData, table: args.table, header:args.header});
    }

    recurseLookup(args);
    while(subTables.length > 0) {
      recurseLookup(subTables[0]);
      subTables.shift();
    }

    return totalTables;
  };

  parsedata = (args) => {

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

  //handle subElements (basically x level of arrays)
  createSubTable = (args) => {
    let elem = document.getElementById(args.header);
    if(elem) {
      elem.remove();
    }
    let newSlot = document.createElement("div");
    newSlot.id = args.header
    document.getElementById("subDetails").appendChild(newSlot);

    ReactDOM.render(<Provider store={store}><SubDetailsTable columns={args.columns} data={args.data} header={args.header} /></Provider>, document.getElementById(newSlot.id));

  }


  //SHow detail cell data in a pop up
  showPopOver = (args) => {
    console.log(this.getCellData(args[0].rows[0], args[0].cols[0]));
  }

}

export default DetailsTable;