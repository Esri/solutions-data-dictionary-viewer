/** @jsx jsx */
import {React, defaultMessages as jimuCoreDefaultMessage} from 'jimu-core';
import {AllWidgetProps, css, jsx, styled} from 'jimu-core';
import {IMConfig} from '../config';

import { TabContent, TabPane, Collapse, Icon, Table} from 'jimu-ui';
import CardHeader from './_header';
let rightArrowIcon = require('jimu-ui/lib/icons/arrow-right.svg');
let downArrowIcon = require('jimu-ui/lib/icons/arrow-down.svg');
let linkIcon = require('jimu-ui/lib/icons/tool-layer.svg');

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
  fieldNameHolder: any,
  fieldHolder: any,
  expandFields: boolean,
  expandCAV: boolean,
  expandAR: boolean
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
      fieldNameHolder: {},
      fieldHolder: [],
      expandFields: false,
      expandCAV: false,
      expandAR: false
    };

  }

  componentWillMount() {
    console.log(this.props.data);
    let fieldList = {};
    this.props.data.data.fields.fieldArray.map((fd: any) => {
      fieldList[fd.name] = false;
    });
    this.setState({fieldHolder:fieldList});
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
        showProperties={true}
        showStatistics={false}
        showResources={false}
      />
      <TabContent activeTab={this.state.activeTab}>
        <TabPane tabId="Properties">
        <div style={{width: "100%", paddingLeft:10, paddingRight:10, wordWrap: "break-word", whiteSpace: "normal" }}>
          <div><h4>{this.props.data.type} Properties</h4></div>
          <div style={{paddingTop:5, paddingBottom:5}}>Name: <span style={{fontWeight:"bold"}}>{this.props.data.data.name}</span></div>
          <div style={{paddingTop:5, paddingBottom:5}}>Ascending: <span style={{fontWeight:"bold"}}>{(this.props.data.data.hasOwnProperty("isAscending"))? (this.props.data.data.isAscending)? "True" : "False" : "False"}</span></div>
          <div style={{paddingTop:5, paddingBottom:5}}>Unique: <span style={{fontWeight:"bold"}}>{(this.props.data.data.hasOwnProperty("isUnique"))? (this.props.data.data.isUnique)? "True" : "False" : "False"}</span></div>
          <div style={{paddingTop:5, paddingBottom:5}} onClick={()=>{this.toggleExpandFieldBlock();}}>{(this.state.expandFields)?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />} Fields:</div>
          <Collapse isOpen={this.state.expandFields}>
          <div style={{minHeight: 100, maxHeight:500, overflowY:"auto", borderWidth:2, borderStyle:"solid", borderColor:"#ccc"}}>
              <Table hover>
                <thead>
                <tr>
                  <th style={{fontSize:"small", fontWeight:"bold"}}>Field Name</th>
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
    </div>);
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
    this.props.data.data.fields.fieldArray.map((fi: any, z: number)=>{
      if(usedFields.indexOf(fi.name) === -1) {
        let fieldDetailsTable = this._createFieldsExpand(fi);
        let alias = fi.aliasName;
        let fieldName = <span><div style={{textAlign: "left"}}>{(this.state.fieldHolder[fi.name])?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />} {alias}</div><div style={{textAlign: "left"}}>{"("+fi.name+")"}</div></span>;
        arrList.push(<tr key={z}>
          <td style={{fontSize:"small", textAlign: "left", verticalAlign: "top"}}>
          <div onClick={()=>{this.props.callbackLinkage(fi.name,"Field", this.props.panel)}} style={{display:"inline-block", verticalAlign: "top", paddingRight:5}}><Icon icon={linkIcon} size='12' color='#333' /></div>
          <div style={{fontSize:"small", display:"inline-block", verticalAlign: "top"}} onClick={()=>{
              this.toggleFields(fi.name);
            }}>{fieldName}</div>
            <Collapse isOpen={this.state.fieldHolder[fi.name]}>
              {(fieldDetailsTable !== null)? fieldDetailsTable: <div></div>}
            </Collapse>
          </td>
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
