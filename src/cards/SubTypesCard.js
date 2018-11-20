/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";
import ReactDOM from 'react-dom';
import PopperJS from "popper.js";
import { Icon, Navbar, Alignment, Dialog, Popover } from "@blueprintjs/core";
import { store } from '../store/index';
import { Provider } from "react-redux";
import Prism from 'prismjs';
import { Rnd } from 'react-rnd';
import Collapsible from 'react-collapsible';
//import SyntaxHighlighter from 'react-syntax-highlighter';
//import { docco } from 'react-syntax-highlighter/styles/hljs';

const matchTemplate = require("../support_files/match.json");
const lookupTemplate = require("../support_files/lookup.json");

class SubTypesCard extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      cardOptions: {
        x: 0,
        y: 0,
        width: "auto",
        height: "auto"
      },
      cardSize: {
        width: "auto",
        height: "auto"
      },
      initialSize: {
        width: "auto",
        height: "auto"
      },
      collapseIcon: "chevron-up",
      data: null,
    };
  };

  render() {
    //<div dangerouslySetInnerHTML={{__html: this.props.data}}></div>
    let localData = this.getData();
    let localId = this.getId();
    let localType = this.getDetailType();
    return (
      <Rnd
        default={this.state.cardOptions}
        size={this.state.cardSize}
        onResize={this.cardResize}
        className="card-holder"
      >
      <div ref={this.myRef}>
        <Navbar className="card-nav-style">
          <Navbar.Group align={Alignment.Left}>
            <Navbar.Heading><span className="card-nav-header">{this.props.title}</span></Navbar.Heading>
          </Navbar.Group>
          <Navbar.Group align={Alignment.RIGHT}>
            <Icon icon={this.state.collapseIcon} onClick={this.collapseCard} />
            <Navbar.Divider />
            <Icon icon="delete" onClick={this.closeCard} />
          </Navbar.Group>
        </Navbar>
        <SubTypesCardDetails data={localData} id={localId} title={this.props.title} detailType={localType} />
      </div>
      </Rnd>
    );
  }

  componentDidMount() {
    let { clientHeight, clientWidth } = this.myRef.current;
      //let loadSize = this.getBoundingClientRect();
    let sizeObj = {"width": clientWidth, "height": clientHeight + 5};
    this.setState({initialSize: sizeObj});
  }

  closeCard =() => {
    let subs = document.getElementById(this.props.title + "_subDetails").childNodes;
    for (let i=0; i<subs.length; i++) {
      ReactDOM.unmountComponentAtNode(document.getElementById(subs[i].id));
    }
    ReactDOM.unmountComponentAtNode(document.getElementById(this.props.id));
  }

  collapseCard =(args) => {
    let options = {}
    let chevron = "chrevron-up";
    let node = document.getElementsByClassName(this.props.title);
    if(node.length > 0) {
      if(node[0].style.display === "block") {
        node[0].style.display = "none";
        chevron = "chevron-down";
        options.height = "50px";
      } else {
        if(node[0].style.display === "") {
          node[0].style.display = "none";
          chevron = "chevron-down";
          options.height = "50px";
        } else {
          node[0].style.display = "block";
          chevron = "chevron-up";
          options = this.state.initialSize;
        }
      }
    }
    this.setState({cardSize: options, collapseIcon:chevron});
  }

  cardResize =(e, direction, ref, delta, position) => {
    let options = {
      width: ref.offsetWidth,
      height: ref.offsetHeight
    }
    //check to see if it's smaller than initial size height, if it is, set it to initial size height.
    if(ref.offsetHeight < this.state.initialSize.height) {
      //let tableSize = titleNode.getBoundingClientRect();
      options.height = this.state.initialSize.height;
    }
    this.setState({cardSize: options});
  }

  getData =() => {
    let details = null;
    if(store.getState().state.detailData !== null) {
      if((store.getState().state.detailData[0].details).hasOwnProperty("dataElement")) {
        details = store.getState().state.detailData[0].details.dataElement;
      } else {
        details = store.getState().state.detailData[0].details;
      }
    }
    return details;
  }

  getDetailType =() => {
    let type = null;
    if(store.getState().state.detailData !== null) {
      type = store.getState().state.detailData[0].nodeType;
    }
    return type;
  }

  getId =() => {
    let id = null;
    if(store.getState().state.detailData !== null) {
      id = store.getState().state.detailData[0].id;
    }
    return id;
  }

}

class SubTypesCardDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subDetails: [],
      uniqueIdDetails: this.props.title + "_details",
      uniqueIdSubDetails: this.props.title + "_subDetails"
    }
  };

  componentDidMount() {
  }

  render() {
    return (
      <div className={this.props.title}>
        <div id={this.state.uniqueIdDetails}>
          {this.processData({data: this.props.data})}
        </div>
        <div id={this.state.uniqueIdSubDetails}></div>

      </div>
    );
  }

  processData =(args) => {

    let list = [];
    if(matchTemplate.hasOwnProperty(this.props.detailType)) {
      if(matchTemplate[this.props.detailType].show[0] !== "all") {
        let showList = matchTemplate[this.props.detailType].show;
        for(let i=0; i<showList.length; i++) {
          //for(let key in args.data) {
            let key = showList[i].attribute;
            if((args.data).hasOwnProperty(key)) {
              this._dataHandler(args, key, list);
            }
          //}
        }
      } else {
        if(Array.isArray(args.data)) {
          this._dataHandler(args, this.props.title, list);
        } else {
          for(let key in args.data) {
            this._dataHandler(args, key, list);
          }
        }
      }
    } else {
      if(Array.isArray(args.data)) {
        this._dataHandler(args, this.props.title, list);
      } else {
        for(let key in args.data) {
          this._dataHandler(args, key, list);
        }
      }
    }
    return list;

  }

  _dataHandler =(args, key, list) => {
    let uniqueId = "card-" + this.props.id + "-" + key;

    switch(key) {
      default:
        this._customArrayOutput(list, key, args.data, uniqueId);
        break;
    }
  }

  _basicOutput =(list, key, node, uniqueId) => {
    let id = uniqueId + "-" + key;
    if((JSON.stringify(node[key])).length > 100) {
      list.push(<div key={id} className="padding"><div className="leftSideNode">{key}</div>
      <div className="rightSideNode">
      <Popover popoverClassName="bp3-popover-content-sizing" content={(JSON.stringify(node[key])).replace(/,/g, ", ")}>
        <div className="popup-link">{(JSON.stringify(node[key])).substring(0,100)  + "..."}</div>
      </Popover>
      </div>
      </div>);
    } else {
      list.push(<div key={id} className="padding"><div className="leftSideNode">{key}</div><div className="rightSideNode">{(JSON.stringify(node[key])).substring(0,100)}</div></div>);
      //internal.push(<tr key={id}><td><div className="padding">{key}</div></td><td>{(JSON.stringify(node[key])).substring(0,100)}</td></tr>);
    }
  }

  _basicStructOutput =(list, key, node, uniqueId) => {
    let id = uniqueId + "-" + key;
    let internal = [];
    for(let attr in node) {
      let id = uniqueId + "-" + key + "-" + attr;
      if((JSON.stringify(node[attr])).length > 100) {
        internal.push(<div key={id} className="padding20"><div className="leftSideNode">{attr}</div>
        <div className="rightSideNode">
        <Popover popoverClassName="bp3-popover-content-sizing" content={(JSON.stringify(node[attr])).replace(/,/g, ", ")}>
          <div className="popup-link">{(JSON.stringify(node[attr])).substring(0,100)  + "..."}</div>
        </Popover>
        </div>
        </div>);
      } else {
        internal.push(<div key={id} className="padding20"><div className="leftSideNode">{attr}</div><div className="rightSideNode">{(JSON.stringify(node[attr])).substring(0,100)}</div></div>);
        //internal.push(<tr key={id}><td><div className="padding">{key}</div></td><td>{(JSON.stringify(node[key])).substring(0,100)}</td></tr>);
      }
    }
    list.push(<div key={uniqueId}><Collapsible trigger={key} triggerOpenedClassName="collapse-open" triggerClassName ="collapse-close">{internal}</Collapsible></div>);
  }

  _basicArrayOutput =(list, key, node, uniqueId) => {
    let keyList = [];
    let createHeader =() => {
      let rowHeaders = [];
      keyList = [];
      for(let attr in node[0]) {
        let colKey = uniqueId + "-column-" + attr;
        rowHeaders.push(<td key={colKey}>{attr}</td>)
        keyList.push(attr);
      }
      return(<thead><tr>{rowHeaders}</tr></thead>);
    }
    let createDataRows =() => {
      let dataRows = [];
      let dataElements = [];
      for(let i=0;i< node.length;i++) {
        let rowKey = uniqueId + "-row-" + i + "-" + key;
        for(let attr in keyList) {
          let rowDataKey = uniqueId + "-rowdata-" + i + "-" + attr;
          if(node[i].hasOwnProperty(keyList[attr])) {
            let data = node[i];
            let property = keyList[attr];
            if(property === "scriptExpression") {
              dataElements.push(<td key={rowDataKey} dangerouslySetInnerHTML={{__html: Prism.highlight(data[property], Prism.languages.javascript, 'javascript')}}></td>);
            } else {
              if((JSON.stringify(data[property])).length > 100) {
                dataElements.push(<td key={rowDataKey}>
                  <Popover popoverClassName="bp3-popover-content-sizing" content={(JSON.stringify(data[property])).replace(/,/g, ", ")}>
                    <div className="popup-link">{(JSON.stringify(data[property])).substring(0,100)  + "..."}</div>
                  </Popover></td>);
              } else {
                dataElements.push(<td key={rowDataKey}>{JSON.stringify(data[property]).substring(0,100)}</td>);
              }
            }
          } else {
            dataElements.push(<td key={rowDataKey}>empty</td>);
          }
        }
        dataRows.push(<tr key={rowKey}>{dataElements}</tr>);
        dataElements = [];
      }
      return(<tbody>{dataRows}</tbody>);
    }
    list.push(<div key={uniqueId}>
      <table className="bp3-html-table bp3-html-table-condensed bp3-interactive bp3-html-table-striped">{createHeader()}{createDataRows()}</table>
      </div>);
  }

  _customArrayOutput =(list, key, args, uniqueId) => {
    let keyList = [];
    let subKeyList = [];
    let dataElements = [];
    let createHeader =(args) => {
      let rowHeaders = [];
      keyList = [];
      for(let attr in args[0]) {
        let colKey = uniqueId + "-column-" + attr;
        rowHeaders.push(<td key={colKey}>{attr}</td>)
        keyList.push(attr);
      }
      return(<thead><tr>{rowHeaders}</tr></thead>);
    }
    let createDataRows =(args, elem, rows) => {
      rows = [];
      for(let i=0;i< args.length;i++) {
        let rowKey = uniqueId + "-row-" + i + "-" + key;
        for(let attr in keyList) {
          let rowDataKey = uniqueId + "-rowdata-" + i + "-" + attr;
          if(args[i].hasOwnProperty(keyList[attr])) {
            let data = args[i];
            let property = keyList[attr];

            if(typeof(data[property]) === "object") {
              if(Array.isArray(data[property])) {
                elem.push(<td key={rowDataKey}>
                  <table className="bp3-html-table bp3-html-table-condensed bp3-interactive bp3-html-table-striped">
                    {createSubHeader(data[property])}{createSubRows(data[property], uniqueId, key)}
                  </table>
                </td>);
              } else {
                if(data[property].hasOwnProperty("fieldArray")) {
                  elem.push(<td key={rowDataKey}>
                    <table className="bp3-html-table bp3-html-table-condensed bp3-interactive bp3-html-table-striped">
                      {createSubHeader(data[property]["fieldArray"])}{createSubRows(data[property]["fieldArray"], uniqueId, key)}
                    </table>
                  </td>);
                }
              }
            } else {
              if(property === "scriptExpression") {
                elem.push(<td key={rowDataKey} dangerouslySetInnerHTML={{__html: Prism.highlight(data[property], Prism.languages.javascript, 'javascript')}}></td>);
              } else {
                if((JSON.stringify(data[property])).length > 100) {
                  elem.push(<td key={rowDataKey}>
                    <Popover popoverClassName="bp3-popover-content-sizing" content={(JSON.stringify(data[property])).replace(/,/g, ", ")}>
                      <div className="popup-link">{(JSON.stringify(data[property])).substring(0,100)  + "..."}</div>
                    </Popover></td>);
                } else {
                  elem.push(<td key={rowDataKey}>{JSON.stringify(data[property]).substring(0,100)}</td>);
                }
              }
            }




          } else {
            elem.push(<td key={rowDataKey}>empty</td>);
          }
        }
        rows.push(<tr key={rowKey}>{elem}</tr>);
        elem = [];
      }
      return(<tbody>{rows}</tbody>);
    }
    let createSubHeader =(args) => {
      let rowHeaders = [];
      subKeyList = [];
      for(let attr in args[0]) {
        let colKey = uniqueId + "-subcolumn-" + attr;
        rowHeaders.push(<td key={colKey}>{attr}</td>)
        subKeyList.push(attr);
      }
      return(<thead><tr>{rowHeaders}</tr></thead>);
    }
    let createSubRows =(args, uniqueId, key) => {
      let rows = [];
      let cells = [];
      for(let i=0;i< args.length;i++) {
        let rowKey = uniqueId + "-subrow-" + i + "-" + key;
        for(let attr in subKeyList) {
          let rowDataKey = uniqueId + "-subrowdata-" + i + "-" + attr;
          if(args[i].hasOwnProperty(subKeyList[attr])) {
            let data = args[i];
            let property = subKeyList[attr];

              if(property === "scriptExpression") {
                cells.push(<td key={rowDataKey} dangerouslySetInnerHTML={{__html: Prism.highlight(data[property], Prism.languages.javascript, 'javascript')}}></td>);
              } else {
                if((JSON.stringify(data[property])).length > 100) {
                  cells.push(<td key={rowDataKey}>
                    <Popover popoverClassName="bp3-popover-content-sizing" content={(JSON.stringify(data[property])).replace(/,/g, ", ")}>
                      <div className="popup-link">{(JSON.stringify(data[property])).substring(0,100)  + "..."}</div>
                    </Popover></td>);
                } else {
                  cells.push(<td key={rowDataKey}>{JSON.stringify(data[property]).substring(0,100)}</td>);
                }
              }

          } else {
            cells.push(<td key={rowDataKey}>empty</td>);
          }
        }
        rows.push(<tr key={rowKey}>{cells}</tr>);
        cells = [];
      }
      return(<tbody>{rows}</tbody>);
    }
    list.push(<div key={uniqueId}>
      <table className="bp3-html-table bp3-html-table-condensed bp3-interactive bp3-html-table-striped">{createHeader(args)}{createDataRows(args, dataElements )}</table>
      </div>);

  }



};

export default SubTypesCard;