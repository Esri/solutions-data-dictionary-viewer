/** @jsx jsx */
import {BaseWidget, React, classNames, FormattedMessage, defaultMessages as jimuCoreDefaultMessage} from 'jimu-core';
import {AllWidgetProps, css, jsx, styled} from 'jimu-core';
import {IMConfig} from '../config';

import { TabContent, TabPane, Nav, NavItem, NavLink, Button, Image, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText, Badge, Input, Collapse, Icon} from 'jimu-ui';
import defaultMessages from './translations/default';
import { LayerDataSource } from 'dist/typing/jimu-arcgis/lib/data-sources/layer-data-source';
import { string, array } from 'prop-types';
let ArrowUpIcon = require('jimu-ui/lib/icons/arrow-up-8.svg');
let ArrowRightIcon = require('jimu-ui/lib/icons/arrow-right-8.svg');
let ArrowDownIcon = require('jimu-ui/lib/icons/arrow-down-8.svg');

interface IProps {
  theme: any
  height: any,
  width: any,
  callback: any,
  data: any
}

interface IState {
  compWidth: any,
  compHeight: any,
  collapse: boolean,
  arrowIcon: any,
  nodeTypeIcon: any,
  postIcon: any,
  masterServiceNodes: any,
  serviceNodes: any
  nodeList: any,
  iconState: any,
  featureLayerNodes: any,
  state: any,
  requestURL: string,
  hasDataElements: boolean,
  dataElements: any,
  serviceElements: any,
  layerElements: any,
  relationshipElements: any,
  domainElements: any
}

export default class ServiceExplorerTree extends React.Component <IProps, IState> {
  constructor(props: IProps){
    super(props);

    this.state = {
      compWidth: this.props.width,
      compHeight: this.props.height,
      collapse: false,
      arrowIcon: ArrowUpIcon,
      nodeTypeIcon: "",
      postIcon: "",
      masterServiceNodes: [],
      serviceNodes: [],
      nodeList: [],
      iconState: {},
      featureLayerNodes: [],
      state: null,
      requestURL: this.props.data.requestURL,
      serviceElements: this.props.data.serviceElements,
      hasDataElements: this.props.data.hasDataElements,
      dataElements: this.props.data.dataElements,
      layerElements: this.props.data.layerElements,
      relationshipElements: this.props.data.relationshipElements,
      domainElements: this.props.data.domainElements
    };

  }

  componentWillMount() {
   this._processData();
  }

  componentDidMount() {
    //this._processData();
  }

  render(){
    return (
      <div style={{height: this.state.compHeight + 25}}>
        <div style={{display:"inline-block", width:55}}></div>
        <div style={{display:"inline-block", width:345}}>
          <Input placeholder="Search Your Service" onChange={(e)=>{this.searchService(e.target.value)}}></Input>
        </div>
        <ListGroup>
            {this.mapper(this.state.serviceNodes, null, 0)}
        </ListGroup>
    </div>);
  }

  //Request Info
  requestItemDetails = async (item: any) => {
    let url = this.state.requestURL + "/" + item.id + "?f=pjson";
    let request = await fetch(url, {
      method: 'GET'
    });
    let data = await request.json();
    return data;
  }

  _processData =() => {
    console.log(this.state.serviceElements);
    console.log(this.state.dataElements);
    console.log(this.state.domainElements);
    console.log(this.state.relationshipElements);
    let data = {...this.state.serviceElements};
    let domains = [...this.state.domainElements];
    let relationship = [...this.state.relationshipElements];
    domains.sort(this._compare("name"));

    let nodeStructure = {
      id: data.documentInfo.Title,
      text: data.documentInfo.Title,
      icon: "",
      requestAdditional: false,
      root: true,
      nodes: [
        {
          id: "Layers",
          type: "Layers",
          text: "Layers" + " (" + this.state.serviceElements.layers.length + ")",
          nodes: data.layers.map((layer: any, i:number) => {
            let nodeStruct = {
              id: layer.id,
              type: "Layer",
              text: layer.name,
              icon: "",
              requestAdditional: true,
              nodes: [],
              clickable: false
            };
            if(this.state.hasDataElements) {
              nodeStruct.nodes = this._processDataElements(layer.id);
            }
            return(nodeStruct);
          })
        },
        {
          id: "Tables",
          type: "Tables",
          text: "Tables" + " (" + this.state.serviceElements.tables.length + ")",
          nodes: data.tables.map((table: any, i:number) => {
            return({
              id: table.id,
              type: "Table",
              text: table.name,
              icon: "",
              requestAdditional: false,
              nodes: [],
              clickable: true
            })
          })
        },
        {
          id: "Relationships",
          type: "Relationships",
          text: "Relationships" + " (" + this.state.serviceElements.relationships.length + ")",
          nodes: relationship.map((relship: any, i:number) => {
            return({
              id: relship.id,
              type: "Relationship",
              text: relship.name,
              icon: "",
              requestAdditional: false,
              data: relship,
              clickable: true
            })
          }),
          data: relationship,
          clickable: true
        },
        {
          id: "Domains",
          type: "Domains",
          text: "Domains" + " (" + this.state.domainElements.length + ")",
          nodes: domains.map((domain: any, i:number) => {
            return({
              id: domain.name,
              type: "Domain",
              text: domain.name,
              icon: "",
              requestAdditional: false,
              data: domain,
              clickable: true
            })
          })
        }
      ]
    }
    this.setState({serviceNodes: [nodeStructure], masterServiceNodes: [nodeStructure]});
    //this._serviceList(rest);
  }

  _processDataElements(id: any) {
    let filtered = this.state.dataElements.filter((de: any) => {
      if(de.layerId === id) {return de}
    });
    let nodeData = []
    if(filtered.length > 0) {
      filtered.map((de: any) => {
        if(de.dataElement.hasOwnProperty("subtypeFieldName")) {
          let stNode = {
            id: de.layerId + "_subtype",
            type: "Subtypes",
            text: "Subtypes (" + de.dataElement.subtypes.length + ")",
            icon: "",
            requestAdditional: false,
            nodes: this._processSubTypes(de.dataElement.subtypes, de.layerId + "_subtype", de.layerId, de.dataElement.fields.fieldArray, de.dataElement.fieldGroups, de.dataElement.attributeRules),
            clickable: false
          };
          nodeData.push(stNode);
        }
        if(de.dataElement.hasOwnProperty("attributeRules")) {
          let aaNode = {
            id: de.layerid + "_attrRules",
            type: "AttributeRules",
            text: "Attribute Rules (" + de.dataElement.attributeRules.length + ")",
            icon: "",
            data: de.dataElement.attributeRules,
            subtypes: de.dataElement.subtypes,
            requestAdditional: false,
            nodes: this._processAttrRules(de.dataElement.attributeRules, de.layerid + "_attrRules", de.dataElement.subtypes),
            clickable: true
          };
          nodeData.push(aaNode);
        }
        if(de.dataElement.hasOwnProperty("fields")) {
          let fieldsNode = {
            id: de.layerid + "_allfields",
            type: "Fields",
            text: "Fields (" + de.dataElement.fields.fieldArray.length + ")",
            icon: "",
            data: de.dataElement.fields.fieldArray,
            st: de.dataElement.subtypes,
            requestAdditional: false,
            nodes: this._processFields(de.dataElement.fields.fieldArray, de.layerid + "_allfields", de.dataElement.subtypes),
            clickable: false
          };
          nodeData.push(fieldsNode);
        }
        if(de.dataElement.hasOwnProperty("indexes")) {
          let indexesNode = {
            id: de.layerid + "_indexes",
            type: "Indexes",
            text: "Indexes (" + de.dataElement.indexes.indexArray.length + ")",
            icon: "",
            data: de.dataElement.indexes.indexArray,
            requestAdditional: false,
            nodes: this._processIndexes(de.dataElement.indexes.indexArray, de.layerid + "_indexes"),
            clickable: false
          };
          nodeData.push(indexesNode);
        }
      });
    }
    return nodeData;
  }

  _processSubTypes =(subTypes: any, id: string, parentId: string, fields:any, fieldGroups:any, attributeRules: any) => {
    subTypes.sort(this._compare("subtypeName"));
    let nodeData = [];
    if(subTypes.length > 0) {
      subTypes.map((st: any) => {
        nodeData.push({
          id: id + "_" + st.subtypeCode,
          type: "Subtype",
          text: st.subtypeName,
          icon: "",
          requestAdditional: false,
          data: st,
          fields: fields,
          fieldGroups: fieldGroups,
          attributeRules: attributeRules,
          clickable: true,
          parentId: parentId
        });
      });
    }
    return nodeData;
  }

  _processAttrRules =(ar: any, id: string, subtypes: any) => {
    ar.sort(this._compare("name"));
    let nodeData = [];
    if(ar.length > 0) {
      ar.map((fd: any, i: number) => {
        nodeData.push({
          id: id + "_" + fd.name,
          type: "AttributeRule",
          text: fd.name,
          icon: "",
          requestAdditional: false,
          data: ar[i],
          subtypes: subtypes,
          clickable: true
        });
      });
    }
    return nodeData;
  }

  _processFields =(fields: any, id: string, subtypes: any) => {
    fields.sort(this._compare("name"));
    let nodeData = [];
    if(fields.length > 0) {
      fields.map((fd: any) => {
        nodeData.push({
          id: id + "_" + fd.name,
          type: "Field",
          text: fd.name,
          icon: "",
          requestAdditional: false,
          data: fd,
          st: subtypes,
          nodes: [],
          clickable: true
        });
      });
    }
    return nodeData;
  }

  _processIndexes =(indexes: any, id: string) => {
    indexes.sort(this._compare("name"));
    let nodeData = [];
    if(indexes.length > 0) {
      indexes.map((idx: any) => {
        nodeData.push({
          id: id + "_" + idx.name,
          type: "Index",
          text: idx.name,
          icon: "",
          requestAdditional: false,
          data: idx,
          nodes: [],
          clickable: true
        });
      });
    }
    return nodeData;
  }

  mapper = (nodes: any, parentId: string, lvl: number) => {
    return nodes.map((node: any, index: number) => {
      const id = `${node.text}-${parentId ? parentId : 'top'}`.replace(/[^a-zA-Z0-9-_]/g, '');
      const item = <React.Fragment>
        <ListGroupItem style={{ zIndex: 0 }} className={`${parentId ? `rounded-0 ${lvl ? 'border-bottom-0' : ''}` : ''}`}>
          {<div style={{ paddingLeft: `${25 * lvl}px` }}>
            {node.nodes && <Button className="pl-0" color="link" id={id} onClick={(e: any)=>{this.toggle(node, e)}}>{(node.hasOwnProperty('root'))? '' : (this.state[id] ? '-' : '+')}</Button>}
            {<span onClick={(e: any)=>{node.clickable ? this.sendBackToParent(node, e): ""}}>{node.text}</span>}
          </div>}
        </ListGroupItem>
        {node.nodes &&
          <Collapse isOpen={(node.hasOwnProperty('root'))? true : this.state[id]}>
            {this.mapper(node.nodes, id, (lvl || 0) + 1)}
          </Collapse>}
      </React.Fragment>

      return item;
    });
  }

  toggle = (node: any, event: any) => {
    if(node.requestAdditional) {
      let data = this.requestItemDetails(node).then((data) => {
        console.log(data);
      });

    }
    const id = event.target.getAttribute('id');
    this.setState(state => ({ [id]: !state[id] }));
  }

  findSelectedInList =(list: any) => {
    let selected = null;
    list.some((currentItem: any) => selected = currentItem.selected === "selected" ? currentItem : this.findSelectedInList(currentItem.children));
    return selected;
  }

  sendBackToParent =(node: any, event: any) => {
    this.props.callback(node, node.type);
  }

  searchService =(value: string) => {
    let matchList = [];
    if(value !== "") {
      let serviceNodes = [...this.state.masterServiceNodes];
      let hasSubNodes =(node: any) => {
        if(node.text.indexOf(value) > -1) {
          matchList.push(node);
        }
        if(node.hasOwnProperty("nodes")) {
          node.nodes.map((n: any) => {
            hasSubNodes(n);
          });
        }
      }
      serviceNodes.map((sn: any) => {
        hasSubNodes(sn);
      });
    } else {
      matchList = [...this.state.masterServiceNodes];
    }

    this.setState({serviceNodes: matchList});
  }
  //helper functions
  _compare =(prop: any) => {
    return function(a: any, b: any) {
      let comparison = 0;
      if (a[prop] > b[prop]) {
        comparison = 1;
      } else if (a[prop] < b[prop]) {
        comparison = -1;
      }
      return comparison;
    }
  }


}
