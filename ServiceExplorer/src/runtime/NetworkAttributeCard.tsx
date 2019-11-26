/** @jsx jsx */
import {React, defaultMessages as jimuCoreDefaultMessage} from 'jimu-core';
import {jsx} from 'jimu-core';
import {IMConfig} from '../config';

import { TabContent, TabPane, Icon, Collapse, Table} from 'jimu-ui';
import CardHeader from './_header';
import './css/custom.css';
let linkIcon = require('jimu-ui/lib/icons/tool-layer.svg');
let rightArrowIcon = require('jimu-ui/lib/icons/arrow-right.svg');
let downArrowIcon = require('jimu-ui/lib/icons/arrow-down.svg');

interface IProps {
  data: any,
  dataElements:any,
  domains: any,
  requestURL: string,
  panel:number,
  callbackClose: any,
  callbackSave: any,
  callbackLinkage:any,
  callbackGetPanels:any,
  callbackReorderCards:any,
  callbackActiveCards:any,
  callbackGetFavorites: any,
  callbackMove:any
}

interface IState {
  nodeData: any,
  activeTab: string,
  expandAssignment: boolean
}

export default class NetworkAttributeCard extends React.Component <IProps, IState> {
  constructor(props: IProps){
    super(props);

    this.state = {
      nodeData: this.props.data.data,
      activeTab: 'Properties',
      expandAssignment: false
    };

  }

  componentWillMount() {
    console.log(this.props.dataElements);
  }

  componentDidMount() {
    //this._processData();
  }

  render(){
    return (
    <div style={{width: "100%", backgroundColor: "#fff", borderWidth:2, borderStyle:"solid", borderColor:"#000", float:"left", display:"inline-block"}}>
      <CardHeader title={this.props.data.text} isFavorite={this.headerSearchFavorites} id={"tt_"+(this.props.data.id).toString()}
        panel={this.props.panel} panelCount={this.props.callbackGetPanels} slotInPanel={this.headerActiveCardLocation} totalSlotsInPanel={this.props.callbackActiveCards}
        onClose={this.headerCallClose}
        onSave={this.headerCallFavorite}
        onTabSwitch={this.headerToggleTabs}
        onMove={this.headerCallMove}
        onReorderCards={this.headerCallReorder}
        showProperties={true}
        showStatistics={false}
        showResources={false}
      />
      <TabContent activeTab={this.state.activeTab}>
        <TabPane tabId="Properties">
        <div style={{width: "100%", paddingLeft:10, paddingRight:10, wordWrap: "break-word", whiteSpace: "normal" }}>
          <div style={{paddingTop:5, paddingBottom:5, fontSize:"smaller"}}>{this.buildCrumb()}<span style={{fontWeight:"bold"}}>Properties</span></div>
          <div style={{paddingTop:5, paddingBottom:5}}>Name: <span style={{fontWeight:"bold"}}>{this.state.nodeData.name}</span></div>
          <div style={{paddingTop:5, paddingBottom:5}}>Inline Domain Name: {(this.state.nodeData.domainName !== "") ? <span  onClick={()=>{this.props.callbackLinkage(this.state.nodeData.domainName, "Domain", this.props.panel)}} style={{fontWeight:"bold"}}><Icon icon={linkIcon} size='12' color='#333' /> {this.state.nodeData.domainName}</span>:<span> </span>}</div>
          <div style={{paddingTop:5, paddingBottom:5}}>Data Type: <span style={{fontWeight:"bold"}}>{this.state.nodeData.dataType}</span></div>
          <div style={{paddingTop:5, paddingBottom:5}} onClick={()=>{this.toggleAssignment()}}>{(this.state.expandAssignment)?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />} Assignment:</div>
          <Collapse isOpen={this.state.expandAssignment}>
            <div style={{minHeight: 100, maxHeight:500, overflow:"auto", paddingRight:2, borderWidth:2, borderStyle:"solid", borderColor:"#ccc"}}>
              {(this.state.nodeData.assignments.length > 0)?this._createAssignmentTable():"No assignments exist"}
            </div>
          </Collapse>

          <div style={{paddingBottom: 15}}></div>
        </div>
        </TabPane>
      </TabContent>
    </div>);
  }

  //**** breadCrumb */
  buildCrumb =() => {
    let list = [];
    this.props.data.crumb.map((c:any, i:number) => {
      list.push(<span key={i} onClick={()=>{
        this.props.callbackLinkage(c.value, c.type, this.props.panel, this.props.data.parent);
        this.headerCallClose();
      }} style={{cursor:"pointer"}}>{c.value + " > "}</span>);
    });
    return(list);
  }

  //****** Header Support functions
  //********************************************
  headerToggleTabs =(tab:string) => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
    switch(tab) {
      case "Statistics": {
        break;
      }
      default: {
        break;
      }
    }
  }
  headerCallMove =(direction:string) => {
    this.props.callbackMove(this.props.data, this.props.data.type, this.props.panel, direction);
  }
  headerCallReorder =(direction:string) => {
    this.props.callbackReorderCards(this.props.data, this.props.panel, direction);
  }
  headerCallClose =() => {
    this.props.callbackClose(this.props.data, this.props.panel);
  }
  headerCallFavorite =() => {
    return new Promise((resolve, reject) => {
      this.props.callbackSave(this.props.data).then(resolve(true));
    });
  }
  headerSearchFavorites =() => {
    let isFavorite = false;
    let list = this.props.callbackGetFavorites();
    isFavorite = list.some((li:any) => {
      return li.props.data.id === this.props.data.id;
    });
    return isFavorite;
  }
  headerActiveCardLocation =() => {
    let currPos = -1;
    let list = this.props.callbackActiveCards();
    list[this.props.panel].map((mac:any, i:number) => {
      if(mac.props.data.id === this.props.data.id) {
        currPos = i;
      }
    });
    return currPos;
  }
  //****** UI components and UI Interaction
  //********************************************
  toggleAssignment =() => {
    if(this.state.expandAssignment) {
      this.setState({expandAssignment: false});
    } else {
      this.setState({expandAssignment: true});
    }
  }

  _createAssignmentTable =() => {
    let arrList = [];
    this.state.nodeData.assignments.map((as: any, i: number) => {
      arrList.push(
        <tr key={i}>
          <td style={{fontSize:"small"}}><span  onClick={()=>{this.props.callbackLinkage(this._layerLookup(as.layerId), "Layer", this.props.panel)}}><Icon icon={linkIcon} size='12' color='#333' /> {this._layerLookup(as.layerId)}</span></td>
          <td style={{fontSize:"small"}}><span  onClick={()=>{this.props.callbackLinkage(as.evaluator.fieldName, "Field", this.props.panel)}}><Icon icon={linkIcon} size='12' color='#333' /> {as.evaluator.fieldName}</span></td>
        </tr>
      );
    });
    let tableObj = <Table hover>
    <thead>
    <tr>
      <th style={{fontSize:"small", fontWeight:"bold"}}>Layer</th>
      <th style={{fontSize:"small", fontWeight:"bold"}}>Field</th>
    </tr>
    </thead>
    <tbody>
      {arrList}
    </tbody>
    </Table>
    return tableObj;
  }

  //*** SUPPORT FUNCTIONS *****/
  _layerLookup = (param: any) => {
    let layerName = param;
    let filtered = this.props.dataElements.filter((de: any) => {
      return de.layerId === param;
    });
    if(filtered.length > 0) {
      layerName = filtered[0].dataElement.aliasName
    }
    return layerName;
  }

}
