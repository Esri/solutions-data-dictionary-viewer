/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";
import ReactDOM from 'react-dom';
import { requestHelper, FSurl } from './RemoteRequest';
import { Classes, Tooltip, Tree, TagInput, Button, Icon } from "@blueprintjs/core";
import { Provider } from "react-redux";
import { store } from './store/index';
//import SyntaxHighlighter from 'react-syntax-highlighter';
//import { docco } from 'react-syntax-highlighter/styles/hljs';
import DetailCard from './Card';
import ServiceInfoCard from './cards/ServiceInfoCard';
import LayersInfoCard from './cards/LayersCard';
import SubTypesCard from './cards/SubTypesCard';
import { slide as Menu } from 'react-burger-menu';
import MapApp from './Map';

// use Component so it re-renders everytime: `nodes` are not a primitive type
// and therefore aren't included in shallow prop comparison
class TreeToc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nodes: [],
      nodeStatic: [],
      req: requestHelper,
      data: null,
      filter: []
    }
    store.subscribe(()=> {
      this.storeChange();
    });
  };

    componentWillMount =() => {
      this.state.req.parseURL();
      this.state.req.request().then((result) => {
        this.setState({nodes: this.loadServiceView(result)});
        if(result.supportsQueryDataElements) {
          this.requestDataElements();
        } else {
          this.setState({data : []});
          this.requestServiceDetails({layers:result.layers});
        }
        //query domains
        let layerList = ((result.layers).filter((layer) => {
          if(layer.parentLayerId === -1) {
            if(layer.subLayerIds === null) {
              return layer.id;
            }
          }
        })).map((layer) => {
          return layer.id;
        });
        this.requestDomains({"searchLayers": layerList});
        this.requestMetadata({"searchLayers": layerList});

      });
    }

    render() {

      return (
        <div>
          <span>
            <Menu noOverlay>
              <a onClick={ this.launchMap } className="menu-item--small">Launch Map</a>
            </Menu>
          </span>
          <span>
          <TagInput
          leftIcon={"search"}
          placeholder="Separate values with commas..."
          onChange={this.handleChange}
          rightElement={<Button
            disabled={false}
            icon={"cross"}
            minimal={true}
            onClick={this.handleClear}
          />}
          values={this.state.filter}
          className="search-bar"
          />
          </span>
          <Tree
              contents={this.state.nodes}
              onNodeClick={this.handleNodeClick}
              onNodeCollapse={this.handleNodeCollapse}
              onNodeExpand={this.handleNodeExpand}
              className={Classes.ELEVATION_0}
          />
        </div>
      );
    }

    handleNodeClick = (nodeData, _nodePath, e) => {
      //console.log(nodeData);
      const originallySelected = nodeData.isSelected;
      if(e !== null) {
        if (!e.shiftKey) {
            this.forEachNode(this.state.nodes, n => (n.isSelected = false));
        }
      }
      nodeData.isSelected = originallySelected == null ? true : !originallySelected;
      if(nodeData.hasOwnProperty("childNodes")) {
        //nodeData.isSelected = false;
        store.dispatch({type:'DETAILS', payload:JSON.parse(JSON.stringify(nodeData))});
      } else {
        store.dispatch({type:'DETAILS', payload:JSON.parse(JSON.stringify(nodeData))});
      }

      let newSlot = document.createElement("div");
      newSlot.id = nodeData.id;
      document.getElementById("details").appendChild(newSlot);
      switch(nodeData.nodeType) {
        case "attributeRules":
        case "subtypes":
        case "fields":
        case "domains":
        console.log(nodeData);
          ReactDOM.render(<Provider store={store}><LayersInfoCard id={newSlot.id} title={nodeData.title} data={nodeData} /></Provider>, document.getElementById(newSlot.id));
          //ReactDOM.render(<Provider store={store}><SubTypesCard id={newSlot.id} title={nodeData.title} /></Provider>, document.getElementById(newSlot.id));
          break;
        default:
          ReactDOM.render(<Provider store={store}><LayersInfoCard id={newSlot.id} title={nodeData.title} data={nodeData} /></Provider>, document.getElementById(newSlot.id));
          break;
      }
      this.setState(this.state);
    };

    handleNodeCollapse = (nodeData) => {
        nodeData.isExpanded = false;
        this.setState(this.state);
    };

    handleNodeExpand = (nodeData) => {
      nodeData.isExpanded = true;

      this.setState(this.state);
    };

    forEachNode(nodes, callback) {
        if (nodes == null) {
            return;
        }

        for (const node of nodes) {
            callback(node);
            this.forEachNode(node.childNodes, callback);
        }
    };

    loadServiceView = (result) => {
      let title = "";
      let label = "";
      if(result.hasOwnProperty("documentInfo")) {
        title = result.documentInfo.Title;
        label = result.documentInfo.Title;
      } else {
        title = result.serviceDescription;
        label = result.serviceDescription;
      }
      let nodeList = [];
      let item = {
        id: title,
        hasCaret: true,
        isExpanded: true,
        icon: "layers",
        label: label,
        title: title,
        childNodes: this.loadInitalLayerView(result),
        queryDataElements: ((result.supportsQueryDataElements) ? result.supportsQueryDataElements : false),
        queryDomains: ((result.supportsQueryDomains) ? result.supportsQueryDomains : false),
        nodeType: "serviceInfo",
        details: result
      }
      nodeList.push(item);
      return nodeList;
    };

    //START Request and process nodes functions
    loadInitalLayerView = (result) => {
      let nodeList = [];
      for(let i=0; i<result.layers.length; i++ ) {
        let item = {
          id: result.layers[i].id,
          hasCaret: true,
          isExpanded: false,
          icon: "layers",
          label: result.layers[i].name,
          title: result.layers[i].name,
          childNodes:[],
          queryDataElements: ((result.supportsQueryDataElements) ? result.supportsQueryDataElements : false),
          queryDomains: ((result.supportsQueryDomains) ? result.supportsQueryDomains : false),
          nodeType: "layer",
          details: result.layers[i]
        }
        nodeList.push(item);
      }
      for(let i=0; i<result.tables.length; i++ ) {
        let item = {
          id: result.tables[i].id,
          hasCaret: true,
          isExpanded: false,
          icon: "th-list",
          label: result.tables[i].name,
          title: result.tables[i].name,
          childNodes:[],
          queryDataElements: ((result.supportsQueryDataElements) ? result.supportsQueryDataElements : false),
          queryDomains: ((result.supportsQueryDomains) ? result.supportsQueryDomains : false),
          nodeType: "table",
          details: result.tables[i]
        }
        nodeList.push(item);
      }
      return nodeList;
    };

    //Remote Request To process REST enpoints
    requestServiceDetails = (args) => {
      let currRecord = 0;
      if(typeof(args.currRecord) !== "undefined") {
        currRecord = args.currRecord;
      }

      let url = FSurl + "/" + args.layers[currRecord].id;
      let params = {
        query: {
          f: "json"
      },
      responseType: 'json'};
      this.state.req.url = url;
      this.state.req.params = params;
      let details = this.state.req.request().then((result) => {
        this.setState({data : this.state.data.concat(result)});
        if((currRecord + 1) < args.layers.length) {
          currRecord++;
          this.requestServiceDetails({currRecord:currRecord, layers:args.layers});
        } else {
          this.loadRegularNodes();
        }
      });
    };

    requestDataElements = () => {
        let qDE_url = this.state.req.url + "/queryDataElements";
        let params = {
          query: {
            layers: "",
            f: "json"
        },
        responseType: 'json',
        method: 'POST'};
        this.state.req.url = qDE_url;
        this.state.req.params = params;
        this.state.req.request().then((result) => {
          this.setState({data : result});
          this.loadDESubNodes();
        });
    };

    requestDomains = (args) => {
      let qDE_url = FSurl + "/queryDomains?layers=[" + args.searchLayers +"]&f=pjson";
      fetch(qDE_url, {
        method: 'GET'
      })
      .then((response) => {return response.json()})
      .then((data) => {
        this.loadDomains(data);
      });
    };

    requestMetadata = (args) => {
      let metaDataList = [];
      args.searchLayers.forEach((layer) => {
        metaDataList.push(FSurl + "/"+ layer +"/metadata");
      });

      let requests = metaDataList.map(url => fetch(url));

      Promise.all(requests)
      .then((response) => {
        Promise.all(response.map(res => res.text()))
        .then(text => {
          let parser = new DOMParser();
          let xmlDoc = parser.parseFromString(text,"text/xml");
          store.dispatch({type:'METADATA', payload:xmlDoc});
        })
      })
      .catch((err) => {
          console.log(err);
      });

    };
    //Remote Request To process REST enpoints

    loadRegularNodes = (args) => {
      this.forEachNode(this.state.nodes, n => {
        this.forEachNode(this.state.data, d => {
          if(n.id === d.id) {
            n.childNodes = [];
            let fieldsNode = {
              id: n.id+"-1",
              icon: "document",
              label: "Fields",
              details: d.fields
            };
            n.childNodes.push(fieldsNode);
          }
        });
      });
      this.setState({nodeStatic: [...this.state.nodes]});
      this.handleNodeClick(this.state.nodes[0], null, null);
    };

    loadDESubNodes = () => {
      let dataList = this.state.data.layerDataElements;
      for(let i=0; i< dataList.length; i++) {
        this.forEachNode(this.state.nodes, n => {
          if(n.id === dataList[i].layerId) {
            n.details = dataList[i];
            n.childNodes = [];
            n.isSelected
            if(typeof(dataList[i].dataElement.subtypes) !== "undefined") {
              if(dataList[i].dataElement.subtypes.length > 0) {
                let subTypeNode = {
                  id: n.id+"-"+dataList[i].dataElement.subtypeFieldName,
                  hasCaret: true,
                  icon: "multi-select",
                  label: dataList[i].dataElement.subtypeFieldName,
                  title: n.title+"-"+dataList[i].dataElement.subtypeFieldName,
                  childNodes: this.loadDESubTypes({"nodeData":n, "title":n.title+"-"+dataList[i].dataElement.subtypeFieldName, "subTypeField":dataList[i].dataElement.subtypeFieldName}),
                  details: dataList[i].dataElement.subtypes,
                  nodeType: "subtypes"
                };
                n.childNodes.push(subTypeNode);
              }
            }
            if(typeof(dataList[i].dataElement.attributeRules) !== "undefined") {
              if(dataList[i].dataElement.attributeRules.length > 0) {
                let attrRulesNode = {
                  id: n.id+"-Attribute Rules",
                  icon: "multi-select",
                  hasCaret: true,
                  label: "Attribute Rules",
                  title: n.title+"-Attribute Rules",
                  childNodes: this.loadDEAttributeRules({"node":n.id+"-Attribute Rules-", "title":n.title+"-Attribute Rules", "data":dataList[i].dataElement.attributeRules}),
                  details: dataList[i].dataElement.attributeRules,
                  nodeType: "attributeRules"
                };
                n.childNodes.push(attrRulesNode);
              }
            }
            if(typeof(dataList[i].dataElement.fields) !== "undefined") {
              let fieldsNode = {
                id: n.id+"-Fields",
                icon: "multi-select",
                label: "Fields",
                title: n.title+"-Fields",
                details: dataList[i].dataElement.fields.fieldArray,
                nodeType: "fields"
              };
              if(dataList[i].dataElement.fields.fieldArray.length > 0) {
                fieldsNode["childNodes"] = this.loadDEFields({"node":n.id+"-Fields-", "title": n.title+"-Fields", "data":dataList[i].dataElement.fields.fieldArray});
              }
              n.childNodes.push(fieldsNode);
            }
          }
        });
      }
      this.setState({nodeStatic: [...this.state.nodes]});
      this.handleNodeClick(this.state.nodes[0], null, null);
    };

    loadDESubTypes = (args) => {
      let subTypeList = [];
      let dataList = this.state.data.layerDataElements;
      let found = dataList.find((item) => {
        return item.layerId === args.nodeData.id;
      });
      found.dataElement.subtypes.forEach((subtype) => {
        subTypeList.push({
          id: args.nodeData.id+"-"+args.subTypeField+"-"+subtype.subtypeName,
          icon: "layer",
          label: subtype.subtypeName,
          title: args.title+"-"+subtype.subtypeName,
          details: subtype,
          nodeType: "subtype"
        });
      });
      return subTypeList;
    };
    loadDEAttributeRules = (args) => {
      let attrRulesList = [];
      args.data.forEach((ar) => {
        attrRulesList.push({
          id: args.node+ar.name,
          icon: "document",
          label: ar.name,
          title: args.title+"-"+ar.name,
          details: ar,
          nodeType: "attributeRule"
        });
      });
      return attrRulesList;
    };
    loadDEFields = (args) => {
      let fieldsList = [];
      args.data.forEach((field) => {
        fieldsList.push({
          id: args.node+field.name,
          icon: "document",
          label: field.aliasName,
          title: args.title+"-"+field.aliasName,
          details: field,
          nodeType: "field"
        });
      });
      return fieldsList;
    };

    loadDomains =(args) => {
      //get top level node, add to that node.
      let item = {
        id: "domains",
        hasCaret: true,
        isExpanded: false,
        icon: "multi-select",
        label: "Domains",
        title: "Domains",
        childNodes:[],
        nodeType: "domains",
        details: args.domains
      }
      let subDomainList =[];
      for(let i=0; i< args.domains.length; i++) {
        let domainItem = {
          id: args.domains[i].name,
          hasCaret: false,
          icon: "document",
          label: args.domains[i].name,
          title: args.domains[i].name,
          nodeType: "domain",
          details: args.domains[i]
        }
        subDomainList.push(domainItem);
      }
      item.childNodes = subDomainList;
      this.state.nodes[0].childNodes.push(item);
      store.dispatch({type:'NODES', payload:JSON.parse(JSON.stringify(this.state.nodes))});
      this.setState({nodeStatic: [...this.state.nodes]});
    }

    //END Request and process nodes functions

    //START filtering functions
    filterNodes = (args) => {
      let mutable = [...this.state.nodeStatic];
      let filteredList = [];
      if(args.length > 0) {
        this.forEachNode(mutable, n => {
          if (new RegExp(args.join("|"), 'i').test(n.label)) {
            //if it's not root, find root
              if(n.id.toString().indexOf("-") > -1) {
                this.forEachNode(mutable, m => {
                  if((m.id).toString().indexOf("-") === -1) {
                    if(n.id.indexOf(m.id) > -1) {
                      n.secondaryLabel = (<Icon icon="tick" />);
                      if (filteredList.filter(e => e.id === m.id).length === 0) {
                        m.secondaryLabel = (<Icon icon="tick" />);
                        m.isSelected = false;
                        filteredList.push(m);
                      }
                    }
                  }
                });
              } else {
                n.secondaryLabel = (<Icon icon="tick" />);
                n.isSelected = false;
                filteredList.push(n);
              }
          }
        });
      }
      this.setState({nodes: filteredList, filter: args});
    };

    handleChange = (args) => {
      if(args.length > 0) {
        this.filterNodes(args);
      } else {
        this.handleClear();
      }
    };

    handleClear = () => {
      this.forEachNode(this.state.nodeStatic, n => {
        n.secondaryLabel = "";
        n.isSelected = false;
      });
      this.setState({ filter: [], nodes: [...this.state.nodeStatic] });
    };
    //END FIltering functions

    //START Store Changes
    storeChange = () => {
      let storeVal = store.getState().state.filterWords;
      if(storeVal.length > 0) {
        this.setState({filter:storeVal});
        this.handleChange(this.state.filter);
      }
    }
    //END Store Changes

    //open map to filter by map
    launchMap =() => {
      let newSlot = document.createElement("div");
      newSlot.id = "MapObject";
      document.getElementById("details").appendChild(newSlot);
      ReactDOM.render(<Provider store={store}><MapApp id={newSlot.id} /></Provider>, document.getElementById(newSlot.id));
    }
}


export default TreeToc;
/* tslint:enable:object-literal-sort-keys */
