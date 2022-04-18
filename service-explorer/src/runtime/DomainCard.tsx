/** @jsx jsx */
import { React, defaultMessages as jimuCoreDefaultMessage} from 'jimu-core';
import {AllWidgetProps, css, jsx, styled} from 'jimu-core';
import {IMConfig} from '../config';

import {Collapse, Icon, Table} from 'jimu-ui';
import {TabContent, TabPane} from 'reactstrap';
import CardHeader from './_header';
import './css/custom.css';
import esriLookup from './_constants';
let rightArrowIcon = require('jimu-ui/lib/icons/arrow-right.svg');
let downArrowIcon = require('jimu-ui/lib/icons/arrow-down.svg');
let linkIcon = require('./assets/launch.svg');

interface IProps {
  data: any,
  dataElements: any,
  layerElements: any,
  requestURL: string,
  key: any,
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
  siteStats: any,
  statsOutput: any,
  activeTab: string,
  domainHolder: any,
  fieldNameHolder: any,
  fieldHolder: any,
  expandFields: boolean,
  expandSubtype: boolean,
  expandAR: boolean,
  minimizedDetails: boolean,
  esriValueList: any
}

export default class DomainCard extends React.Component <IProps, IState> {
  constructor(props: IProps){
    super(props);

    this.state = {
      nodeData: this.props.data.data,
      siteStats: {},
      statsOutput: [],
      activeTab: 'Properties',
      domainHolder: {},
      fieldNameHolder: {},
      fieldHolder: [],
      expandFields: true,
      expandSubtype: false,
      expandAR: false,
      minimizedDetails: false,
      esriValueList: new esriLookup()
    };

  }

  componentWillMount() {}

  componentDidMount() {
    console.log(this.props);
    //this._processData();
    //this._requestObject()
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
        onMinimize={this.headerCallMinimize}
        showProperties={true}
        showStatistics={false}
        showResources={false}
      />
      {
        (this.state.minimizedDetails)?""
      :
        <TabContent activeTab={this.state.activeTab}>
        <TabPane tabId="Properties">
        <div style={{width: "100%", paddingLeft:10, paddingRight:10, wordWrap: "break-word", whiteSpace: "normal" }}>
          <div style={{paddingTop:5, paddingBottom:5, fontSize:"smaller"}}>{this.buildCrumb()}<span style={{fontWeight:"bold"}}>Properties</span></div>
          <div style={{paddingTop:5, paddingBottom:5}}><span style={{fontWeight:"bold"}}>Name:</span> {this.props.data.data.name}</div>
          {(this.props.dataElements.length > 0)?<div style={{paddingTop:5, paddingBottom:5}}><span style={{fontWeight:"bold"}}>Description:</span> {this.props.data.data.description}</div>:""}
          {(this.props.dataElements.length > 0)?<div style={{paddingTop:5, paddingBottom:5}}><span style={{fontWeight:"bold"}}>Field Type:</span> {this.state.esriValueList.lookupValue(this.props.data.data.fieldType)}</div>:""}
          <div style={{paddingTop:5, paddingBottom:5, cursor:"pointer"}} onClick={()=>{this.toggleExpandFieldBlock();}}>{(this.state.expandFields)?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />} <span style={{fontWeight:"bold"}}>{this._typeLookup(this.props.data.data.type)}</span></div>
          {(this.props.data.data.type === "range")?
            <Collapse isOpen={this.state.expandFields}>
            <div style={{minHeight: 100, maxHeight:500, overflowY:"auto", borderWidth:2, borderStyle:"solid", borderColor:"#ccc"}}>
                <Table hover>
                  <thead>
                  <tr>
                    <th style={{fontSize:"small", fontWeight:"bold"}}>Acceptable Range</th>
                  </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{this._createRangeList(this.props.data.data.range)}</td>
                    </tr>
                  </tbody>
                </Table>
            </div>
            </Collapse>
          :
            <Collapse isOpen={this.state.expandFields}>
            <div style={{minHeight: 100, maxHeight:500, overflowY:"auto", borderWidth:2, borderStyle:"solid", borderColor:"#ccc"}}>
                <Table hover>
                  <thead>
                  <tr>
                    <th style={{fontSize:"small", fontWeight:"bold"}}>Name</th>
                    <th style={{fontSize:"small", fontWeight:"bold"}}>Value</th>
                  </tr>
                  </thead>
                  <tbody>
                    {this._createCVList(this.props.data.data.codedValues)}
                  </tbody>
                </Table>
            </div>
            </Collapse>
          }
          <div style={{paddingTop:5, paddingBottom:5, cursor:"pointer"}} onClick={()=>{this.toggleExpandSubtype();}}>{(this.state.expandSubtype)?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />}<span style={{fontWeight:"bold"}}> This domain is used in </span></div>
          <Collapse isOpen={this.state.expandSubtype}>
            <div style={{minHeight: 100, maxHeight:500, overflowY:"auto", borderWidth:2, borderStyle:"solid", borderColor:"#ccc"}}>
                <Table hover>
                  <thead>
                  <tr>
                    <th style={{fontSize:"small", fontWeight:"bold"}}>Layer</th>
                    {(this.props.dataElements.length > 0)?<th style={{fontSize:"small", fontWeight:"bold"}}>Subtype</th>:""}
                    <th style={{fontSize:"small", fontWeight:"bold"}}>Field</th>
                  </tr>
                  </thead>
                  <tbody>
                    {(this.props.dataElements.length > 0)?this.createMatchSubtype():this.createMatchLayer()}
                  </tbody>
                </Table>
            </div>
            </Collapse>

          <div style={{paddingBottom: 15}}></div>
        </div>
        </TabPane>
      </TabContent>
      }
    </div>);
  }

  //**** breadCrumb */
  buildCrumb =() => {
    let list = [];
    this.props.data.crumb.map((c:any, i:number) => {
      list.push(<span key={i} onClick={()=>{
        this.props.callbackLinkage(c.value, c.type, this.props.panel);
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
  headerCallMinimize =() => {
    let currState = this.state.minimizedDetails;
    if(currState) {
      currState = false;
      this.setState({minimizedDetails: currState});
    } else {
      currState = true;
      this.setState({minimizedDetails: currState});
    }
    return currState;
  }

  //****** UI components and UI Interaction
  //********************************************
  toggleExpandFieldBlock =() => {
    if(this.state.expandFields) {
      this.setState({expandFields: false});
    } else {
      this.setState({expandFields: true});
    }
  }

  toggleExpandSubtype =() => {
    if(this.state.expandSubtype) {
      this.setState({expandSubtype: false});
    } else {
      this.setState({expandSubtype: true});
    }
  }

  toggleFields =(field: string) => {
    if (this.state.fieldHolder.hasOwnProperty(field)) {
      let newFieldState = {...this.state.fieldHolder};
      if(newFieldState[field]) {
        newFieldState[field] = false;
      } else {
        newFieldState[field] = true;
      }
      this.setState({fieldHolder: newFieldState});
    }
  }
  _createRangeList =(range: any) => {
    let arrList = [];
    if(range.length > 0) {
      arrList.push(<span key={range[0]} style={{fontSize:"small"}}>From {range[0]}</span>);
      arrList.push(<span key={range[1]} style={{fontSize:"small"}}> To {range[1]}</span>);
    }
    return arrList;
  }

  _createCVList =(CVdata: any) => {
    let arrList = [];
    CVdata.map((fi: any, z: number)=>{
      arrList.push(<tr key={z}>
        <td style={{fontSize:"small", textAlign: "left", verticalAlign: "top"}}>{fi.name}</td>
        <td style={{fontSize:"small", textAlign: "left", verticalAlign: "top"}}>{fi.code}</td>
      </tr>);
    });
    return arrList;
  }

  createMatchSubtype =() => {
    let arrList = [];
    this.props.dataElements.map((de: any, z: number)=>{
      if(de.dataElement.hasOwnProperty("subtypes")) {
        de.dataElement.subtypes.map((st: any, i: number)=>{
          st.fieldInfos.map((fi: any, a: number)=>{
            if(fi.domainName === this.props.data.text) {
              arrList.push(
                <tr key={st.subtypeName + fi.fieldName}>
                <td><div onClick={()=>{this.props.callbackLinkage(de.dataElement.aliasName,"Layer", this.props.panel)}} style={{display:"inline-block", verticalAlign: "top", paddingRight:5, cursor:"pointer"}}><Icon icon={linkIcon} size='12' color='#333' /> {de.dataElement.aliasName}</div></td>
                  <td><div onClick={()=>{this.props.callbackLinkage(st.subtypeName,"Subtype", this.props.panel, de.dataElement.aliasName)}} style={{display:"inline-block", verticalAlign: "top", paddingRight:5, cursor:"pointer"}}><Icon icon={linkIcon} size='12' color='#333' /> {st.subtypeName}</div></td>
                  <td><div onClick={()=>{this.props.callbackLinkage(fi.fieldName,"Field", this.props.panel, de.dataElement.aliasName)}} style={{display:"inline-block", verticalAlign: "top", paddingRight:5, cursor:"pointer"}}><Icon icon={linkIcon} size='12' color='#333' /> {fi.fieldName}</div></td>
                </tr>
              );
            }
          });
        });
      }
    });
    return arrList;
  }

  createMatchLayer =() => {
    let arrList = [];
    this.props.layerElements.nodes.map((n: any, z: number)=>{
      let fields = n.data.fields;
      let matchFields = fields.filter((fld:any) => {
        return (fld.domain !== null) && (fld.domain.name === this.props.data.data.name);
      });

      if(matchFields.length > 0) {
        matchFields.map((match:any) => {
          arrList.push(
            <tr key={n.text + match.name + this.props.data.data.name}>
            <td><div onClick={()=>{this.props.callbackLinkage(n.text,"Layer", this.props.panel)}} style={{display:"inline-block", verticalAlign: "top", paddingRight:5, cursor:"pointer"}}><Icon icon={linkIcon} size='12' color='#333' /> {n.text}</div></td>
            <td><div onClick={()=>{this.props.callbackLinkage(match.name,"Field", this.props.panel, n.text)}} style={{display:"inline-block", verticalAlign: "top", paddingRight:5, cursor:"pointer"}}><Icon icon={linkIcon} size='12' color='#333' /> {match.name}</div></td>
            </tr>
          );
        });
      }
    });
    return arrList;

  }


  //****** helper functions and request functions
  //********************************************
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

  _typeLookup =(type:string) => {
    let returnType = type;
    switch(type) {
      case "codedValue": {
        returnType = "Coded Value";
        break;
      }
      case "range": {
        returnType = "Range";
        break;
      }
      default: {
        returnType = type
      }
    }
    return returnType;
  }


}
