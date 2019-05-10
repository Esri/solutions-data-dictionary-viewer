/** @jsx jsx */
import {BaseWidget, React, defaultMessages as jimuCoreDefaultMessage} from 'jimu-core';
import {AllWidgetProps, css, jsx, styled} from 'jimu-core';
import {IMConfig} from '../config';

import { TabContent, TabPane, Collapse, Icon, Table } from 'jimu-ui';

import CardHeader from './_header';

let rightArrowIcon = require('jimu-ui/lib/icons/arrow-right.svg');
let downArrowIcon = require('jimu-ui/lib/icons/arrow-down.svg');
let linkIcon = require('jimu-ui/lib/icons/tool-layer.svg');

interface IProps {
  data: any,
  domains: any,
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
  expandSubtypes: boolean,
  expandIndexes: boolean
}

export default class LayerCard extends React.Component <IProps, IState> {
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
      expandSubtypes: false,
      expandIndexes: false
    };

  }

  componentWillMount() {
    console.log(this.props.data);
    //test

    if(this.props.data.data.dataElement.hasOwnProperty("fields")) {
      let fieldList = {};
      this.props.data.data.dataElement.fields.fieldArray.map((fd: any) => {
        fieldList[fd.name] = false;
      });
      this.setState({fieldHolder:fieldList});
    }

  }

  componentDidMount() {

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
        <div style={{width: "100%", paddingLeft:10, paddingRight:10, wordWrap: "break-word", whiteSpace: "normal"}}>
          <div><h4>{this.props.data.type} Properties</h4></div>
          <div style={{paddingTop:5, paddingBottom:5}}>Name: <span style={{fontWeight:"bold"}}>{this.state.nodeData.dataElement.aliasName}</span></div>
          <div style={{paddingTop:5, paddingBottom:5}}>Layer Id: <span style={{fontWeight:"bold"}}>{this.state.nodeData.layerId}</span></div>
          <div style={{paddingTop:5, paddingBottom:5}}>Global Id: <span style={{fontWeight:"bold"}}>{(this.state.nodeData.dataElement.hasGlobalID)? this.state.nodeData.dataElement.globalIdFieldName: "None"}</span></div>
          <div style={{paddingTop:5, paddingBottom:5}}>Object Id: <span style={{fontWeight:"bold"}}>{(this.state.nodeData.dataElement.hasOID)? this.state.nodeData.dataElement.oidFieldName: "None"}</span></div>
          {
            (this.state.nodeData.dataElement.hasOwnProperty("subtypeFieldName")) &&
            <div style={{paddingTop:5, paddingBottom:5}}>Subtype Field: <span style={{fontWeight:"bold"}}>{this.state.nodeData.dataElement.subtypeFieldName}</span></div>
          }
          {(this.state.nodeData.dataElement.hasOwnProperty("subtypes")) &&
          <div style={{paddingTop:5, paddingBottom:5}} onClick={()=>{this.toggleExpandSubtypesBlock();}}>{(this.state.expandSubtypes)?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />} Subtypes:</div>
          }
          {(this.state.nodeData.dataElement.hasOwnProperty("subtypes")) &&
          <Collapse isOpen={this.state.expandSubtypes}>
          <div style={{minHeight: 100, maxHeight:500, overflowY:"auto", borderWidth:2, borderStyle:"solid", borderColor:"#ccc"}}>
              <Table hover>
                <thead>
                <tr>
                  <th style={{fontSize:"small", fontWeight:"bold"}}>Name</th>
                  <th style={{fontSize:"small", fontWeight:"bold"}}>Code</th>
                </tr>
                </thead>
                <tbody>
                  {this._createSubtypesList()}
                </tbody>
              </Table>
          </div>
          </Collapse>
          }
          {(this.state.nodeData.dataElement.hasOwnProperty("fields")) &&
          <div style={{paddingTop:5, paddingBottom:5}} onClick={()=>{this.toggleExpandFieldBlock();}}>{(this.state.expandFields)?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />} Fields:</div>
          }
          {(this.state.nodeData.dataElement.hasOwnProperty("fields")) &&
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
          }
          {(this.state.nodeData.dataElement.hasOwnProperty("indexes")) &&
          <div style={{paddingTop:5, paddingBottom:5}} onClick={()=>{this.toggleExpandIndexBlock();}}>{(this.state.expandIndexes)?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />} Indexes:</div>
          }
          {(this.state.nodeData.dataElement.hasOwnProperty("indexes")) &&
          <Collapse isOpen={this.state.expandIndexes}>
          <div style={{minHeight: 100, maxHeight:500, overflowY:"auto", borderWidth:2, borderStyle:"solid", borderColor:"#ccc"}}>
              <Table hover>
                <thead>
                <tr>
                  <th style={{fontSize:"small", fontWeight:"bold"}}>Name</th>
                  <th style={{fontSize:"small", fontWeight:"bold"}}>Field</th>
                </tr>
                </thead>
                <tbody>
                 {this._createIndexList()}
                </tbody>
              </Table>
          </div>
          </Collapse>
          }
          <div style={{paddingBottom: 15}}></div>
        </div>
        </TabPane>
        <TabPane tabId="Statistics">
          <div style={{width: this.state.width, paddingLeft:10, paddingRight:10}}>
            <div><h4>Site Statistics</h4></div>
            {this.state.statsOutput}
          </div>
          <div style={{paddingBottom: 15}}></div>
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

  toggleTabs(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });

      switch(tab) {
        case "Statistics": {
          let atList = this._validAssetTypes("assettype");
          this._requestObject("ASSETGROUP="+this.props.data.data.subtypeCode, "all");
          if(atList.length > 0) {
            atList[0].codedValues.map((cv: any) => {
              let req = this._requestObject("(ASSETGROUP="+this.props.data.data.subtypeCode+" and ASSETTYPE="+cv.code+")", cv.name);
            });
          }
          this._requestObject("ASSETGROUP="+this.props.data.data.subtypeCode + " AND isConnected<>1", "notConnected");
          break;
        }
        default: {
          break;
        }
      }
    }
  }

  toggleDomains =(domain: string) => {
    if (this.state.domainHolder.hasOwnProperty(domain)) {
      let newDomainState = {...this.state.domainHolder};
      if(newDomainState[domain]) {
        newDomainState[domain] = false;
      } else {
        newDomainState[domain] = true;
      }
      this.setState({domainHolder: newDomainState});
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

  toggleExpandFieldBlock =() => {
    if(this.state.expandFields) {
      this.setState({expandFields: false});
    } else {
      this.setState({expandFields: true});
    }
  }

  toggleExpandSubtypesBlock =() => {
    if(this.state.expandSubtypes) {
      this.setState({expandSubtypes: false});
    } else {
      this.setState({expandSubtypes: true});
    }
  }

  toggleExpandIndexBlock =() => {
    if(this.state.expandIndexes) {
      this.setState({expandIndexes: false});
    } else {
      this.setState({expandIndexes: true});
    }
  }

  _createStatsOutput =() => {
    let output = [];
    let atList = this._validAssetTypes("assettype");
    output.push(<div key={"all"}>Number of {this.props.data.text} in the System: {(this.state.siteStats.hasOwnProperty("all")? this.state.siteStats.all.count : 0 )}</div>);
    output.push(<div key={"spacer"} style={{paddingTop:15}}>Breakdown by type ({Object.keys(this.state.siteStats).length - 2} / {atList[0].codedValues.length})</div>);
    for(let keyNode in this.state.siteStats) {
      if(keyNode === "all" || keyNode === "notConnected") {
        //skip, will add at front
      } else {
        output.push(<div key={keyNode}>Number of type: {keyNode} in the System: {(this.state.siteStats.hasOwnProperty(keyNode)? this.state.siteStats[keyNode].count : 0 )}</div>);
      }
    }
    output.push(<div key={"spacerConnected"} style={{paddingTop:15}}>Validity</div>);
    output.push(<div key={"notConnected"}>Number of {this.props.data.text} NOT connected: {(this.state.siteStats.hasOwnProperty("notConnected")? this.state.siteStats.notConnected.count : 0 )}</div>);
    this.setState({statsOutput: output});
  }

  _createSubtypesList = () => {
    let arrList = [];
    this.state.nodeData.dataElement.subtypes.map((fi: any, i: number)=>{
      arrList.push(<tr key={i}>
        <td style={{fontSize:"small", textAlign: "left", verticalAlign: "top"}}>
          <div onClick={()=>{this.props.callbackLinkage(fi.subtypeName,"Subtype", this.props.panel)}} style={{display:"inline-block", verticalAlign: "top", paddingRight:5}}><Icon icon={linkIcon} size='12' color='#333' /> {fi.subtypeName}</div>
        </td>
        <td style={{fontSize:"small"}}>{fi.subtypeCode}</td>
      </tr>);
    });
    //this.setState({fieldHolder: arrList});
    return arrList;
  }

  _createFieldList = () => {
    let arrList = [];
    this.state.nodeData.dataElement.fields.fieldArray.map((fi: any, i: number)=>{
      arrList.push(<tr key={i}>
        <td style={{fontSize:"small", textAlign: "left", verticalAlign: "top"}}>
          <div onClick={()=>{this.props.callbackLinkage(fi.name,"Field", this.props.panel)}} style={{display:"inline-block", verticalAlign: "top", paddingRight:5}}><Icon icon={linkIcon} size='12' color='#333' /> {fi.name}</div>
        </td>
        <td style={{fontSize:"small"}}>{fi.aliasName}</td>
      </tr>);
    });
    //this.setState({fieldHolder: arrList});
    return arrList;
  }

  _createIndexList = () => {
    let arrList = [];
    let fieldList = [];
    this.state.nodeData.dataElement.indexes.indexArray.map((idx: any, i: number)=>{
      fieldList = [];
      idx.fields.fieldArray.map((fi: any, i: number)=>{
        fieldList.push(
          <div onClick={()=>{this.props.callbackLinkage(fi.name,"Field", this.props.panel)}} style={{display:"inline-block", verticalAlign: "top", paddingRight:5}}><Icon icon={linkIcon} size='12' color='#333' /> {fi.name}</div>
        );
      });
      arrList.push(<tr key={i}>
        <td style={{fontSize:"small", textAlign: "left", verticalAlign: "top"}}>
          <div onClick={()=>{this.props.callbackLinkage(idx.name,"Index", this.props.panel)}} style={{display:"inline-block", verticalAlign: "top", paddingRight:5}}><Icon icon={linkIcon} size='12' color='#333' /> {idx.name}</div>
        </td>
        <td style={{fontSize:"small"}}>{fieldList}</td>
      </tr>);
    });
    //this.setState({fieldHolder: arrList});
    return arrList;
  }

  _createDomainExpand =(dName: string) => {
    let domain = this._matchDomain(dName);
    let domainTable = null;
    let headerName = "Name";
    let headerValue = "Code";
    if(domain.length > 0) {
      let vals = [];
      if(domain[0].hasOwnProperty("codedValues")) {
        domain[0].codedValues.map((d: any, z: number) =>{
          vals.push(
            <tr key={z}>
              <td style={{fontSize:"small"}}>{d.name}</td>
              <td style={{fontSize:"small"}}>{d.code}</td>
            </tr>
          );
        });
      } else if (domain[0].hasOwnProperty("range")) {
        headerName = "Description";
        headerValue = "Range";
        domain.map((d: any, z: number) =>{
          vals.push(
          <tr key={z}>
            <td style={{fontSize:"small"}}>{d.description}</td>
            <td style={{fontSize:"small"}}>{d.range[0] + " to " + d.range[d.range.length -1]}</td>
          </tr>);
        });
      }
      domainTable = <Table>
      <thead>
      <tr>
        <th style={{fontSize:"small", fontWeight:"bold"}}>{headerName}</th>
        <th style={{fontSize:"small", fontWeight:"bold"}}>{headerValue}</th>
      </tr>
      </thead>
      <tbody>
        {vals}
      </tbody>
    </Table>;
    }
    return domainTable;
  }

  _createFieldsExpand =(f: any) => {
    let field = f;
    let fieldTable: any;
    let vals = [];
      for(let keyNode in field) {
        if(keyNode !== "shape") {
          let v = field[keyNode];
          if(v === true) {v = "True";}
          if(v === false) {v= "False";}
          if(keyNode === "domain") {
            v = field[keyNode]["domainName"];
          }
          vals.push(
            <tr key={keyNode}>
              <td style={{fontSize:"small"}}>{keyNode}</td>
              <td style={{fontSize:"small"}}>{v}</td>
            </tr>
          );
        } else {
          vals.push(
            <tr key={keyNode}>
              <td style={{fontSize:"small"}}>{keyNode}</td>
              <td style={{fontSize:"small"}}></td>
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

  _createARTable =() => {
    if(this.props.data.attributeRules.length > 0) {
      return(<Table hover>
        <thead>
        <tr>
          <th style={{fontSize:"small", fontWeight:"bold"}}>Name</th>
          <th style={{fontSize:"small", fontWeight:"bold"}}>Description</th>
          <th style={{fontSize:"small", fontWeight:"bold"}}>Priority</th>
        </tr>
        </thead>
        <tbody>
          {this._createARList()}
        </tbody>
      </Table>);
    } else {
      return(<Table hover>
        <tbody>
          <tr><td>Sorry, no Attribute Rules configured</td></tr>
        </tbody>
      </Table>);
    }
  }

  _createARList = () => {
    let arrList = [];
    let filterAR = this.props.data.attributeRules.filter((ar: any, i: number)=>{
      return(ar.subtypeCode === this.state.nodeData.subtypeCode);
    });
    if(filterAR.length > 0) {
      filterAR.map((ar: any, i: number) => {
        arrList.push(
          <tr key={i}>
            <td style={{fontSize:"small"}}><div onClick={()=>{this.launchLinkedCard(ar.name,"AttributeRule")}}><Icon icon={linkIcon} size='12' color='#333' /> {ar.name}</div></td>
            <td style={{fontSize:"small", wordWrap: "break-word"}}>{ar.description}</td>
            <td style={{fontSize:"small"}}>{ar.evaluationOrder}</td>
          </tr>
        );
      });
    }

    return arrList;
  }

  //****** helper functions and request functions
  //********************************************
  _requestObject = async(clause: string, category: string) => {
    let url = this.props.requestURL + "/" + this.props.data.parentId + "/query?where="+ clause +"&returnCountOnly=true&f=pjson";
    fetch(url, {
      method: 'GET'
    })
    .then((response) => {return response.json()})
    .then((data) => {
      if(data.hasOwnProperty("count")) {
        let updateStat = {...this.state.siteStats};
        updateStat[category] = {
          count: data.count
        }
        this.setState({siteStats: updateStat});
        this._createStatsOutput();
      }
    });
  }

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

  _validAssetTypes =(lookup: string) => {
    let domainVals = [];
    let currentAT = this.state.nodeData.fieldInfos.filter((fi:any)=> {
      return(fi.fieldName === lookup);
    });
    if(currentAT.length > 0) {
      domainVals = this.props.domains.filter((d:any)=> {
        return(d.name === currentAT[0].domainName);
      });
    }
    return domainVals;
  }

  _matchDomain =(lookup: string) => {
    let domainVals = [];
    domainVals = this.props.domains.filter((d:any)=> {
      return(d.name === lookup);
    });
    return domainVals;
  }

  _matchField =(lookup: string) => {
    let fieldVal = [];
    fieldVal = this.props.data.fields.filter((f:any)=> {
      return(f.name === lookup);
    });
    return fieldVal;
  }

  _handleAliasBrackets =(alias: string, name: string) => {
    let clean = alias;
    let code = this.state.nodeData.subtypeCode;
    clean = clean.replace(/],/g,"],<br>");
    let pieces = clean.split(",<br>");
    let validList = [", "+code+" ", code+",", code+" ", code+"]", ", "+code+",", ];
    let filter = pieces.filter((p: any) => {
      return validList.some((v:string) => {
        return (p.indexOf(v) > -1);
      });
    });
    if(filter.length > 0) {
      clean = filter[0];
    } else {
      clean = name;
    }
    return clean;
  }

}
