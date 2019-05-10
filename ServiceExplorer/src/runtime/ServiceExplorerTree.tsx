/** @jsx jsx */
import {BaseWidget, React, defaultMessages as jimuCoreDefaultMessage} from 'jimu-core';
import {AllWidgetProps, css, jsx, styled} from 'jimu-core';
import {IMConfig} from '../config';

import { Button, Image, ListGroup, ListGroupItem, Input, Collapse, Icon} from 'jimu-ui';
let ArrowUpIcon = require('jimu-ui/lib/icons/arrow-up-8.svg');
let rightArrowIcon = require('jimu-ui/lib/icons/arrow-right.svg');
let downArrowIcon = require('jimu-ui/lib/icons/arrow-down.svg');

interface IProps {
  theme: any
  height: any,
  width: any,
  callback: any,
  data: any,
  callbackActiveCards: any
}

interface IState {
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
  domainElements: any,
  autoRefresh: boolean
}

export default class ServiceExplorerTree extends React.Component <IProps, IState> {
  constructor(props: IProps){
    super(props);

    this.state = {
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
      domainElements: this.props.data.domainElements,
      autoRefresh: false
    };

  }

  componentWillMount() {
   //this._processData();
   this.setState({serviceNodes: [...this.props.data], masterServiceNodes: [...this.props.data]});
  }

  componentDidMount() {
    //this._processData();
  }

  render(){
    let checkState =() => {
      let item = null;
      item = this.mapper(this.state.serviceNodes, null, 0);
      return item;
    }

    return (
      <div style={{paddingLeft:58}}>
        <div style={{display:"inline-block", width:"100%"}}>
          <Input placeholder="Search Your Service" onChange={(e:any)=>{this.searchService(e.target.value)}}></Input>
        </div>
        <ListGroup>
            {checkState()}
        </ListGroup>
    </div>);
  }

  mapper = (nodes: any, parentId: string, lvl: number) => {
    return nodes.map((node: any, index: number) => {
      const id = `${node.text}-${parentId ? parentId : 'top'}`.replace(/[^a-zA-Z0-9-_]/g, '');
      const item = <React.Fragment>
        <ListGroupItem style={{ zIndex: 0 }} className={`${parentId ? `rounded-0 ${lvl ? 'border-bottom-0' : ''}` : ''}`}>
          {<div style={{ paddingLeft: `${25 * lvl}px` }}>
            {node.nodes && <Button className="pl-0" color="link" id={id} onClick={(e: any)=>{this.toggle(node, e)}}>{(node.hasOwnProperty('root'))? '' : (this.state[id] ? '-' : '+')}</Button>}
            {<span onClick={(e: any)=>{node.clickable ? this.sendBackToParent(node, e): ""}} style={this.setNodeColor(node.text)}>{node.text}</span>}
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


  //Request Info
  requestItemDetails = async (item: any) => {
    let url = this.state.requestURL + "/" + item.id + "?f=pjson";
    let request = await fetch(url, {
      method: 'GET'
    });
    let data = await request.json();
    return data;
  }

  toggle = (node: any, event: any) => {
    if(node.requestAdditional) {
      //let data = this.requestItemDetails(node).then((data) => {
      //  console.log(data);
      //});

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
    event = event || window.event;
    var targ = event.target || event.srcElement;
    if (targ.nodeType == 3) targ = targ.parentNode;
    //targ.style.color = "#ff0000";
    this.props.callback(node, node.type);
  }

  checkActives =(text:string) => {
    let masterActive = this.props.callbackActiveCards();
    let active = false;
    active = masterActive.some((m:any) => {
        return m.some((a:any) => {
          return (a.props.data.text === text);
        });
    });
    return active;
  }

  setNodeColor =(text:string) => {
    let color = "#000000";
    let isActive = this.checkActives(text);
    if(isActive){
      color = "#007ac2";
      return {"color":color, "font-weight":"bold"};
    } else {
      return {"color":color};
    }

  }

  hookForParent =() => {
    let masterActive = this.props.callbackActiveCards();
    this.setState(this.state);
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
