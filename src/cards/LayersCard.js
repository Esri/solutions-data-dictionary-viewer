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
import { requestHelper, FSurl } from '../RemoteRequest';
//import SyntaxHighlighter from 'react-syntax-highlighter';
//import { docco } from 'react-syntax-highlighter/styles/hljs';

const matchTemplate = require("../support_files/match.json");
const lookupTemplate = require("../support_files/lookup.json");

class LayersInfoCard extends React.Component {
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
      description: "",
      disableDrag: false,
      dragIcon: "move"
    };
  };

  render() {
    //<div dangerouslySetInnerHTML={{__html: this.props.data}}></div>
    let localData = this.getData();
    let localId = this.getId();
    let localType = this.getDetailType();
    let cleanString = this._cleanStrings(this.state.description);
    let navGroup =() => {
      if(localId.toString().indexOf("-") > -1) {
        return(<Navbar.Group align={Alignment.RIGHT}>
          <Icon icon={this.state.collapseIcon} onClick={this.collapseCard} />
          <Navbar.Divider />
          <Icon icon={this.state.dragIcon} onClick={this.stopDrag} />
          <Navbar.Divider />
          <Icon icon="delete" onClick={this.closeCard} />
        </Navbar.Group>);
      } else {
        return(<Navbar.Group align={Alignment.RIGHT}>
          <Popover popoverClassName="bp3-popover-content-sizing" content={cleanString}>
            <Icon icon="info-sign" />
          </Popover>
          <Navbar.Divider />
          <Icon icon={this.state.collapseIcon} onClick={this.collapseCard} />
          <Navbar.Divider />
          <Icon icon={this.state.dragIcon} onClick={this.stopDrag} />
          <Navbar.Divider />
          <Icon icon="delete" onClick={this.closeCard} />
        </Navbar.Group>);
      }
    }
    return (
      <Rnd
        default={this.state.cardOptions}
        size={this.state.cardSize}
        onResize={this.cardResize}
        className="card-holder"
        enableUserSelectHack={false}
        disableDragging={this.state.disableDrag}
      >
      <div ref={this.myRef}>
        <Navbar className="card-nav-style">
          <Navbar.Group align={Alignment.Left}>
            <Navbar.Heading><span className="card-nav-header">{this.props.title}</span></Navbar.Heading>
          </Navbar.Group>
          {navGroup()}
        </Navbar>
        <Provider store={store}><LayersInfoCardDetails data={localData} id={localId} title={this.props.title} detailType={localType} parent={this.myRef} resizeAction={this.cardResize} /></Provider>
      </div>
      </Rnd>
    );
  }

  componentDidMount() {
    let { clientHeight, clientWidth } = this.myRef.current;
      //let loadSize = this.getBoundingClientRect();
    let sizeObj = {"width": clientWidth, "height": clientHeight + 5};
    this.setState({initialSize: sizeObj});
    this._requestMetadata();
  }

  closeCard =() => {
   // let subs = document.getElementById(this.props.title + "_subDetails").childNodes;
    //for (let i=0; i<subs.length; i++) {
    //  ReactDOM.unmountComponentAtNode(document.getElementById(subs[i].id));
    //}
    ReactDOM.unmountComponentAtNode(document.getElementById(this.props.id));
  }

  stopDrag =() => {
    if(this.state.disableDrag) {
      this.setState({disableDrag: false, dragIcon: "move"});
    } else {
      this.setState({disableDrag: true, dragIcon: "hand-up"});
    }
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
        this.setState({cardSize: options, collapseIcon:chevron});
      } else {
        if(node[0].style.display === "") {
          node[0].style.display = "none";
          chevron = "chevron-down";
          options.height = "50px";
          this.setState({cardSize: options, collapseIcon:chevron});
        } else {
          node[0].style.display = "block";
          chevron = "chevron-up";
          //this.setState({collapseIcon:chevron});
          this.state.collapseIcon = chevron;
          this.cardResize(null, null, this.myRef["current"], null, null);
        }
      }
    }
  }

  cardResize =(e, direction, ref, delta, position) => {
    if(this.state.collapseIcon !== "chevron-down") {
      let options = {
        width: ref.offsetWidth,
        height: ref.offsetHeight
      }
      //check to see if it's smaller than initial size height, if it is, set it to initial size height.
      //if(ref.offsetHeight < this.state.initialSize.height) {
        //let tableSize = titleNode.getBoundingClientRect();
     //   options.height = this.state.initialSize.height;
      //}
      this.setState({cardSize: options});
    }
  }

  getData =() => {
    let details = null;
    /*
    if(store.getState().state.detailData !== null) {
      if((store.getState().state.detailData[0].details).hasOwnProperty("dataElement")) {
        details = store.getState().state.detailData[0].details.dataElement;
      } else {
        details = store.getState().state.detailData[0].details;
      }
    }
    */
    if((this.props.data.details).hasOwnProperty("dataElement")) {
      details = this.props.data.details.dataElement;
    } else {
      details = this.props.data.details;
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

  _cleanStrings =(args) => {
    let stripedHtml = args.replace(/<[^>]+>/g, '');
    return stripedHtml;
  }

  _requestMetadata =() => {
    let metadataRequest = requestHelper;
    let newParams = {
      query: {
        f: 'xml'
      },
      responseType: 'text'
    };
    metadataRequest.param = newParams;
    metadataRequest.url = FSurl + "/" + this.getId() + "/metadata";
    metadataRequest.request().then((result) => {
      if (window.DOMParser)
      {
          let parser = new DOMParser();
          let xmlDoc = parser.parseFromString(result, "text/xml");
          let nodeDesc = xmlDoc.getElementsByTagName("idAbs")[0];
          if(typeof(nodeDesc) !== 'undefined') {
            this.setState({description: nodeDesc.childNodes[0].nodeValue});
          } else {
            this.setState({description: ""});
          }
      } else {
        alert("Sorry, cannot get metadata");
      }


    });
  }

}

class LayersInfoCardDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subDetails: [],
      uniqueIdDetails: this.props.title + "_details",
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
            let key = showList[i];
            let metadata = null;
            if(matchTemplate[this.props.detailType].hasMetadata) {
              metadata = this._getMetaData();
            }
            if((args.data).hasOwnProperty(key)) {
              this._dataHandler(args, key, list, metadata);
            }
          //}
        }
      } else {
        let metadata = null;
        if(matchTemplate[this.props.detailType].hasMetadata) {
          metadata = this._getMetaData();
        }
        if(Array.isArray(args.data)) {
          this._dataHandler(args, this.props.title, list, metadata);
        } else {
          for(let key in args.data) {
            this._dataHandler(args, key, list, metadata);
          }
        }
      }
    } else {
      let metadata = null;
      if(Array.isArray(args.data)) {
        this._dataHandler(args, this.props.title, list, metadata);
      } else {
        for(let key in args.data) {
          this._dataHandler(args, key, list, metadata);
        }
      }
    }
    return list;

  }

  _dataHandler =(args, key, list, metadata) => {
    let uniqueId = "card-" + this.props.id + "-" + key;

    switch(key) {
      case "fields": {
        if(args.data[key].hasOwnProperty("fieldArray")) {
          this._basicArrayOutput(list, key, args.data[key]["fieldArray"], uniqueId, metadata);
        } else {
          this._basicArrayOutput(list, key, args.data[key], uniqueId, metadata);
        }
        break;
      }
      case "indexes": {
        if(args.data[key].hasOwnProperty("indexArray")) {
          this._customArrayOutput(list, key, args.data[key]["indexArray"], uniqueId, metadata, false, true);
        } else {
          this._basicArrayOutput(list, key, args.data[key], uniqueId, metadata);
        }
        break;
      }
      case "subtypes":
      case "codedValues": {
        let data = args.data[key];
        if(metadata !== null) {
          data = this._searchMetaData(key, args.data[key], metadata, this.props.id);
        }
        this._customArrayOutput(list, key, data, uniqueId, metadata, false, true);
        break;
        }
      case "fieldInfos":
      case "controllerMemberships":
      case "attributeRules":
      case "layers":
      case "tables":
        this._basicArrayOutput(list, key, args.data[key], uniqueId, metadata);
        break;
      case "relationshipClassNames":
      case "extensionProperties":
      case "extent":
      case "initialExtent":
      case "fullExtent":
      case "documentInfo":
      case "extractChangesCapabilities":
      case "advancedEditingCapabilities":
      case "controllerDatasetLayers":
      case "heightModelInfo":
      case "spatialReference":
      case "domain":
        this._basicStructOutput(list, key, args.data[key], uniqueId, metadata);
        break;
      default: {
        if(Array.isArray(args.data)) {
          this._customArrayOutput(list, key, args.data, uniqueId, metadata, true, false);
        } else {
          this._basicOutput(list, key, args.data, uniqueId, metadata);
        }
        break;
      }
    }
  }

  _basicOutput =(list, key, node, uniqueId, metadata) => {
    let id = uniqueId + "-" + key;
    if(key === "scriptExpression") {
      list.push(<div key={id} className="padding"><div className="leftSideNode">{key}</div><div className="rightSideNode">
      <div key={id} dangerouslySetInnerHTML={{__html: Prism.highlight(node[key], Prism.languages.javascript, 'javascript')}}></div>
      </div></div>
      );
    } else {
      if((JSON.stringify(node[key])).length > 100) {
        list.push(<div key={id} className="padding"><div className="leftSideNode">{key}</div>
        <div className="rightSideNode">
        <Popover popoverClassName="bp3-popover-content-sizing" content={(JSON.stringify(node[key])).replace(/,/g, ", ")}>
          <div className="popup-link">{(JSON.stringify(node[key])).substring(0,100)  + "..."}</div>
        </Popover>
        </div>
        </div>);
      } else {
        if(key === "domainName") {
          list.push(<div key={id} className="padding"><div className="leftSideNode">{key}</div><div className="rightSideNode">
          <span className={"link"} onClick={() => {this._linkage(key, node[key])}}>{JSON.stringify(node[key]).substring(0,100)}</span>
          </div></div>);
        } else {
          list.push(<div key={id} className="padding"><div className="leftSideNode">{key}</div><div className="rightSideNode">{(JSON.stringify(node[key])).substring(0,100)}</div></div>);
        }
      }
    }
  }

  _basicStructOutput =(list, key, node, uniqueId, metadata) => {
    let id = uniqueId + "-" + key;
    let internal = [];
    for(let attr in node) {
      let id = uniqueId + "-" + key + "-" + attr;

      if(attr === "scriptExpression") {
        list.push(<div key={id} className="padding20"><div className="leftSideNode">{attr}</div><div className="rightSideNode">
        <div key={id} dangerouslySetInnerHTML={{__html: Prism.highlight(node[attr], Prism.languages.javascript, 'javascript')}}></div>
        </div></div>
        );
      } else {
        if((JSON.stringify(node[attr])).length > 100) {
          internal.push(<div key={id} className="padding20"><div className="leftSideNode">{attr}</div>
          <div className="rightSideNode">
          <Popover popoverClassName="bp3-popover-content-sizing" content={(JSON.stringify(node[attr])).replace(/,/g, ", ")}>
            <div className="popup-link">{(JSON.stringify(node[attr])).substring(0,100)  + "..."}</div>
          </Popover>
          </div>
          </div>);
        } else {
          if(attr === "domainName") {
            internal.push(<div key={id} className="padding20"><div className="leftSideNode">{attr}</div><div className="rightSideNode">
            <span className={"link"} onClick={() => {this._linkage(attr, node[attr])}}>{JSON.stringify(node[attr]).substring(0,100)}</span>
            </div></div>);
          } else {
            internal.push(<div key={id} className="padding20"><div className="leftSideNode">{attr}</div><div className="rightSideNode">{(JSON.stringify(node[attr])).substring(0,100)}</div></div>);
          }
        }
      }
    }
    list.push(<div key={uniqueId}><Collapsible trigger={key} triggerOpenedClassName="collapse-open" triggerClassName ="collapse-close" onOpen={this._resizeCard} onClose={this._resizeCard}>{internal}</Collapsible></div>);
  }

  _basicArrayOutput =(list, key, node, uniqueId, metadata) => {
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
                if(property === "domainName") {
                  dataElements.push(<td key={rowDataKey}><span className={"link"} onClick={() => {this._linkage(property, data[property])}}>{JSON.stringify(data[property]).substring(0,100)}</span></td>);
                } else {
                  dataElements.push(<td key={rowDataKey}>{JSON.stringify(data[property]).substring(0,100)}</td>);
                }
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
    list.push(<div key={uniqueId}><Collapsible trigger={key} triggerOpenedClassName="collapse-open" triggerClassName ="collapse-close" onOpen={this._resizeCard} onClose={this._resizeCard}>
      <table className="bp3-html-table bp3-html-table-condensed bp3-interactive bp3-html-table-striped">{createHeader()}{createDataRows()}</table>
      </Collapsible></div>);
  }

  _customArrayOutput =(list, key, args, uniqueId, metadata, openDefault, showCollapse) => {
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
                if(typeof(data[property][0]) === "object") {
                  elem.push(<td key={rowDataKey}>
                  <table className="bp3-html-table bp3-html-table-condensed bp3-interactive bp3-html-table-striped">
                    {createSubHeader(data[property])}{createSubRows(data[property], uniqueId, key)}
                  </table>
                  </td>);
                } else {
                  elem.push(<td key={rowDataKey}>{(data[property]).toString().substring(0,100)}</td>);
                }
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
                  if(property === "domainName") {
                    elem.push(<td key={rowDataKey}><span className={"link"} onClick={() => {this._linkage(property, data[property])}}>{JSON.stringify(data[property]).substring(0,100)}</span></td>);
                  } else {
                    elem.push(<td key={rowDataKey}>{JSON.stringify(data[property]).substring(0,100)}</td>);
                  }
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
                  if(property === "domainName" && data[property] !== "") {
                    cells.push(<td key={rowDataKey}><span className={"link"} onClick={() => {this._linkage(property, data[property])}}>{JSON.stringify(data[property]).substring(0,100)}</span></td>);
                  } else {
                    cells.push(<td key={rowDataKey}>{JSON.stringify(data[property]).substring(0,100)}</td>);
                  }
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
    if(showCollapse) {
      list.push(<div key={uniqueId}><Collapsible trigger={key} triggerOpenedClassName="collapse-open" triggerClassName ="collapse-close" onOpen={this._resizeCard} onClose={this._resizeCard} open={openDefault}>
      <table className="bp3-html-table bp3-html-table-condensed bp3-interactive bp3-html-table-striped">{createHeader(args)}{createDataRows(args, dataElements )}</table>
      </Collapsible></div>);
    } else {
      list.push(<div key={uniqueId}>
      <table className="bp3-html-table bp3-html-table-condensed bp3-interactive bp3-html-table-striped">{createHeader(args)}{createDataRows(args, dataElements )}</table>
      </div>);
    }

  }

  _getMetaData =() => {
    let md = null;
    if(store.getState().state.metaData !== null) {
      md = store.getState().state.metaData;
    }
    return md;
  }

  _searchMetaData =(key, data, metadata, id) => {
    switch(key) {
      case "codedValues": {
        let metaLevel = metadata[0].getElementsByTagName("metadata");
        let fieldLevel = metaLevel[0].getElementsByTagName("eainfo");
        let attrLevel = fieldLevel[0].getElementsByTagName("attr");
        for (let i=0; i < attrLevel.length; i++) {
          if(attrLevel[i].getElementsByTagName("attrdefs")[0].innerHTML === id) {
            let domainList = attrLevel[i].getElementsByTagName("edom");
            for (let z=0; z < domainList.length; z++) {
              for (let x=0; x < data.length; x++) {
                if(data[x].code === parseInt(domainList[z].getElementsByTagName("edomv")[0].innerHTML)) {
                  data[x].description = domainList[z].getElementsByTagName("edomvds")[0].innerHTML;
                }
              }
            }
          }
        }
        break;
      }
      default:
        break;
    }
    return data;
  }

  _linkage =(key, data) => {
    if(store.getState().state.nodes !== null) {
      let nodes = store.getState().state.nodes;

      this._forEachNode(nodes[0], n => {
        if(n.id === data) {
          let newSlot = document.createElement("div");
          newSlot.id = n.id;
          document.getElementById("details").appendChild(newSlot);
          store.dispatch({type:'DETAILS', payload:JSON.parse(JSON.stringify(n))});

          ReactDOM.render(<Provider store={store}><LayersInfoCard id={data} title={data} data={n} /></Provider>, document.getElementById(newSlot.id));
        }
      });

    } else {
      alert("Sorry, no link found");
    }
  }

  _resizeCard =() => {
    this.props.resizeAction(null,null,this.props.parent["current"],null,null);
  }

  _forEachNode(nodes, callback) {
    if (nodes == null) {
        return;
    }

    for (const node of nodes) {
        callback(node);
        this._forEachNode(node.childNodes, callback);
    }
};

};

export default LayersInfoCard;