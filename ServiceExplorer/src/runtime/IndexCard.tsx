/** @jsx jsx */
import {React, defaultMessages as jimuCoreDefaultMessage} from 'jimu-core';
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
  fields: any,
  fieldNameHolder: any,
  fieldHolder: any,
  expandFields: boolean,
  expandCAV: boolean,
  expandAR: boolean,
  minimizedDetails: boolean,
  esriValueList: any
}

export default class IndexCard extends React.Component <IProps, IState> {
  constructor(props: IProps){
    super(props);

    this.state = {
      nodeData: this.props.data.data,
      siteStats: {},
      statsOutput: [],
      activeTab: 'Properties',
      domainHolder: {},
      fields:[],
      fieldNameHolder: {},
      fieldHolder: [],
      expandFields: false,
      expandCAV: false,
      expandAR: false,
      minimizedDetails: false,
      esriValueList: new esriLookup()
    };

  }

  componentWillMount() {
    let fieldList = {};
    let fields = [];
    if(this.props.data.data.fields.hasOwnProperty("fieldArray")) {
      this.props.data.data.fields.fieldArray.map((fd: any) => {
        fieldList[fd.name] = false;
      });
      fields = this.props.data.data.fields.fieldArray;
    } else {
      fields = this.props.data.data.fields.split(",");
    }
    this.setState({fieldHolder:fieldList, fields: fields});
  }

  componentDidMount() {
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
          <div style={{paddingTop:5, paddingBottom:5}}><span style={{fontWeight:"bold"}}>Ascending:</span> {(this.props.data.data.hasOwnProperty("isAscending"))? (this.props.data.data.isAscending)? "True" : "False" : "False"}</div>
          <div style={{paddingTop:5, paddingBottom:5}}><span style={{fontWeight:"bold"}}>Unique:</span> {(this.props.data.data.hasOwnProperty("isUnique"))? (this.props.data.data.isUnique)? "True" : "False" : "False"}</div>
          <div style={{paddingTop:5, paddingBottom:5, cursor:"pointer"}} onClick={()=>{this.toggleExpandFieldBlock();}}>{(this.state.expandFields)?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />} <span style={{fontWeight:"bold"}}>Fields</span></div>
          <Collapse isOpen={this.state.expandFields}>
          <div style={{minHeight: 100, maxHeight:500, overflowY:"auto", borderWidth:2, borderStyle:"solid", borderColor:"#ccc"}}>
              <Table hover>
                <thead>
                <tr>
                  <th style={{fontSize:"small", fontWeight:"bold"}}>Field Name</th>
                  <th style={{fontSize:"small", fontWeight:"bold"}}>Alias</th>
                </tr>
                </thead>
                <tbody>
                  {this._createFieldList()}
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
  _createFieldList =() => {
    let arrList = [];
    let usedFields = [];
    this.state.fields.map((fi: any, z: number)=>{
      if(usedFields.indexOf(fi.name) === -1) {
        let fieldDetailsTable = null;
        if(fi.constructor === Object) {
          fieldDetailsTable = this._createFieldsExpand(fi);
        }
        let alias = (fi.hasOwnProperty("aliasName"))?fi.aliasName:fi;
        let fieldName = <span><div style={{textAlign: "left"}}>{(fieldDetailsTable !== null)? (this.state.fieldHolder[fi.name])?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />:''} {fi.hasOwnProperty("name")?fi.name:fi}</div></span>;
        arrList.push(<tr key={z}>
          <td style={{fontSize:"small", textAlign: "left", verticalAlign: "top"}}>
          <div onClick={()=>{this.props.callbackLinkage(fi.name,"Field", this.props.panel, this.props.data.parent)}} style={{display:"inline-block", verticalAlign: "top", paddingRight:5, cursor:"pointer"}}><Icon icon={linkIcon} size='12' color='#333' /></div>
          {
            (fieldDetailsTable !== null)?
              <div style={{fontSize:"small", display:"inline-block", verticalAlign: "top"}} onClick={()=>{
                this.toggleFields(fi.name);
              }}>{fieldName}</div>
            :
            <div style={{fontSize:"small", display:"inline-block", verticalAlign: "top"}}>{fieldName}</div>
          }
            <Collapse isOpen={this.state.fieldHolder[fi.name]}>
              {(fieldDetailsTable !== null)? fieldDetailsTable: <div></div>}
            </Collapse>
          </td>
          <td style={{fontSize:"small", textAlign: "left", verticalAlign: "top"}}><div style={{textAlign: "left"}}>{alias}</div></td>
        </tr>);
      }
    });
    return arrList;
  }

  _createFieldsExpand =(fName: any) => {
    let field = fName;
    let fieldTable: any;
      let vals = [];
      for(let keyNode in field) {
        if(keyNode !== "geometryDef") {
          let v = field[keyNode];
          if(v === true) {v = "True";}
          if(v === false) {v= "False";}
          vals.push(
            <tr key={keyNode}>
              <td style={{fontSize:"small"}}>{keyNode}</td>
              <td style={{fontSize:"small"}}>{v}</td>
            </tr>
          );
        }
      }
      fieldTable = <Table>
      <thead>
      <tr>
        <th style={{fontSize:"small", fontWeight:"bold"}}>Key</th>
        <th style={{fontSize:"small", fontWeight:"bold"}}>Value</th>
      </tr>
      </thead>
      <tbody>
        {vals}
      </tbody>
    </Table>;
    return fieldTable;
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


}
