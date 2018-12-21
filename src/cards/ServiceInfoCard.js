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

class LayersInfoCard extends React.Component {
  constructor(props) {
    super(props);
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
    console.log(localType);
    console.log(localData);
    return (
      <Rnd
        default={this.state.cardOptions}
        size={this.state.cardSize}
        onResize={this.cardResize}
        className="card-holder"
      >
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
        <LayersInfoCardDetails data={localData} id={localId} title={this.props.title} detailType={localType} />
      </Rnd>
    );
  }

  componentDidMount() {
    let detailsNode = document.getElementById(this.props.title + "_details");
    if(detailsNode) {
      let titleNode = detailsNode.childNodes[0];
      let loadSize = titleNode.getBoundingClientRect();
      let sizeObj = {"width": loadSize.width, "height": loadSize.height + 75};
      this.setState({initialSize: sizeObj});
    }
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
    //check to see if it's smaller than table, if it is, set it to table size.
    let detailsNode = document.getElementById(this.props.title + "_details");
    if(detailsNode) {
      let titleNode = detailsNode.childNodes[0];
      let tableSize = titleNode.getBoundingClientRect();
      if(tableSize.width > ref.offsetWidth) {
        options.width = tableSize.width;
      }
      if(tableSize.height > ref.offsetHeight) {
        options.height = tableSize.height + 75;
      }
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

class LayersInfoCardDetails extends React.Component {
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
        {this.createTable()}
        <div id={this.state.uniqueIdSubDetails}></div>
        </div>
      </div>
    );
  }

  createTable =(args) => {
    let rowHeader =(args) => {
      return (<thead><tr><td>Attribute</td><td>Value</td></tr></thead>);
    };
    return (
      <table className="bp3-html-table bp3-interactive card-table-style">
        {rowHeader()}
        <tbody>
        {this.processData({data: this.props.data})}
        </tbody>
      </table>
    );
  }

  processData =(args) => {
    let recursiveNode =(internal, node, uniqueId, parent) => {
      //list.push(<tr key={uniqueId}><td className="padding">{parent}</td><td></td></tr>);
      for(let key in node) {
        let id = uniqueId + "-" + key;
        if(typeof(node[key]) === "object" && node[key] !== null) {
          if(Array.isArray(node[key])) {
            internal.push(<tr key={id}><td colSpan="2"><div className="padding">{key}</div></td></tr>);
            recursiveArray(internal, node[key], id, key);
          } else {
            recursiveNode(internal, node[key], id, key);
          }
        } else {
          if((JSON.stringify(node[key])).length > 50) {
            internal.push(<tr key={id}><td><div className="padding">{key}</div></td>
            <td>
            <Popover popoverClassName="bp3-popover-content-sizing" content={(JSON.stringify(node[key])).replace(/,/g, ", ")}>
              <div className="popup-link">{(JSON.stringify(node[key])).substring(0,100)  + "..."}</div>
            </Popover>
            </td>
            </tr>);
          } else {
            internal.push(<tr key={id}><td><div className="padding">{key}</div></td><td>{(JSON.stringify(node[key])).substring(0,100)}</td></tr>);
          }
        }
      }
    }

    let recursiveArray =(internal, node, uniqueId, parent) => {
      //header
      let columnHeaders = [];
      let rows = [];
      let headerUnique = uniqueId;
      let keyList = [];
      for(let key in node[0]) {
        headerUnique = uniqueId + "column" + key;
        columnHeaders.push(<td key={headerUnique}>{key}</td>);
        keyList.push(key);
      }
      headerUnique = uniqueId + "_header";
      internal.push(<tr key={headerUnique}>{columnHeaders}</tr>);
      for(let i=0;i< node.length;i++) {
        let recordUnique = uniqueId + "_row_" + i;
        for(let key in keyList) {
          let recordUnique = uniqueId + "_" + i + "_" + key;
          if(node[i].hasOwnProperty(keyList[key])) {
            let data = node[i];
            let property = keyList[key];
            if(typeof(data[property]) === "object" && data[property] !== null) {
              if(Array.isArray(data[property])) {
                //if first value in arry is another object, then recurse, otherwise just a list of values, so output it.
                if(typeof(data[property][0]) === "object" && data[property][0] !== null) {
                  if(Array.isArray(data[property][0])) {
                    recursiveArray(internal, data[property], recordUnique, parent);
                  } else {
                    recursiveNode(internal, data[property], recordUnique, parent);
                  }
                } else {
                  if((JSON.stringify(data[property])).length > 100) {
                    rows.push(<td key={recordUnique}>
                    <Popover popoverClassName="bp3-popover-content-sizing" content={(JSON.stringify(data[property])).replace(/,/g, ", ")}>
                      <div className="popup-link">{(JSON.stringify(data[property])).substring(0,100)  + "..."}</div>
                    </Popover>
                    </td>);
                  } else {
                    rows.push(<td key={recordUnique}>{(JSON.stringify(data[property])).substring(0,100)}</td>);
                  }
                }
              } else {
                recursiveNode(internal, data[property], recordUnique, parent);
              }
            } else {
              if((JSON.stringify(data[property])).length > 100) {
                rows.push(<td key={recordUnique}>
                <Popover popoverClassName="bp3-popover-content-sizing" content={(JSON.stringify(data[property])).replace(/,/g, ", ")}>
                  <div className="popup-link">{(JSON.stringify(data[property])).substring(0,100)  + "..."}</div>
                </Popover>
                </td>);
              } else {
                rows.push(<td key={recordUnique}>{JSON.stringify(data[property])}</td>);
              }
            }
          } else {
            rows.push(<td key={recordUnique}>null</td>);
          }
        }
        internal.push(<tr key={recordUnique}>{rows}</tr>);
        rows = [];
      }
    }

    let dataHandler =(args, key, list) => {
      let internal = [];
      let uniqueId = "card-" + this.props.id + "-" + key;
      if(typeof(args.data[key]) === "object" && args.data[key] !== null) {
        if(Array.isArray(args.data[key])) {
          list.push(<tr key={uniqueId}><td colSpan="2"><Collapsible trigger={key} triggerOpenedClassName="collapse-open" triggerClassName ="collapse-close"><table className="card-table-style"><tbody>{internal}</tbody></table></Collapsible></td></tr>);
          recursiveArray(internal, args.data[key], uniqueId, key);
          internal = [];
        } else {
          recursiveNode(internal, args.data[key], uniqueId, key);
          list.push(<tr key={uniqueId}><td colSpan="2"><Collapsible trigger={key} triggerOpenedClassName="collapse-open" triggerClassName ="collapse-close"><table className="card-table-style"><tbody>{internal}</tbody></table></Collapsible></td></tr>);
          internal = [];
        }
      } else {
        if((JSON.stringify(args.data[key])).length > 50) {
          list.push(<tr key={uniqueId}><td>{key}</td><td>
          <Popover popoverClassName="bp3-popover-content-sizing" content={(JSON.stringify(args.data[key])).replace(/,/g, ", ")}>
            <div className="popup-link">{(JSON.stringify(args.data[key])).substring(0,50)  + "..."}</div>
          </Popover>
          </td>
          </tr>);
        } else {
          list.push(<tr key={uniqueId}><td>{key}</td><td>{JSON.stringify(args.data[key])}</td></tr>);
        }
      }
    }

    let list = [];
    if(matchTemplate.hasOwnProperty(this.props.detailType)) {
      if(matchTemplate[this.props.detailType].show[0] !== "all") {
        let showList = matchTemplate[this.props.detailType].show;
        for(let i=0; i<showList.length; i++) {
          //for(let key in args.data) {
            let key = showList[i].attribute;
            if((args.data).hasOwnProperty(key)) {
              dataHandler(args, key, list);
            }
          //}
        }
      } else {
        for(let key in args.data) {
          dataHandler(args, key, list);
        }
      }
    } else {
      for(let key in args.data) {
        dataHandler(args, key, list);
      }
    }
    return list;
  }
};

export default LayersInfoCard;