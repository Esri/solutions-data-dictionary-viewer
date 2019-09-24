/** @jsx jsx */
import {React, defaultMessages as jimuCoreDefaultMessage} from 'jimu-core';
import {AllWidgetProps, css, jsx, styled} from 'jimu-core';
import {IMConfig} from '../config';

import { TabContent, TabPane, Collapse, Icon, Table} from 'jimu-ui';
import CardHeader from './_header';
import './css/custom.css';
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
  expandCAV: boolean,
  expandAR: boolean,
  expandDomain: boolean
}

export default class FieldCard extends React.Component <IProps, IState> {
  constructor(props: IProps){
    super(props);

    this.state = {
      nodeData: this.props.data.data,
      siteStats: {},
      statsOutput: [],
      activeTab: 'Properties',
      domainHolder: [],
      fieldNameHolder: {},
      fieldHolder: [],
      expandFields: false,
      expandCAV: false,
      expandAR: false,
      expandDomain: false
    };

  }

  componentWillMount() {
    let filtered = this.props.domains.map((d:any) => {
      return d.name === this.props.data.text;
    });
    if(filtered.length > 0) {
      this.setState({domainHolder:filtered});
    }
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
        showStatistics={true}
        showResources={false}
      />
      <TabContent activeTab={this.state.activeTab}>
        <TabPane tabId="Properties">
        <div style={{width: "100%", paddingLeft:10, paddingRight:10, wordWrap: "break-word", whiteSpace: "normal" }}>
          <div><h4>{this.props.data.type} Properties</h4></div>
          <div style={{paddingTop:5, paddingBottom:5}}>Name: <span style={{fontWeight:"bold"}}>{this.props.data.data.name}</span></div>
          <div style={{paddingTop:5, paddingBottom:5}}>Alias: <span style={{fontWeight:"bold"}}>{this.props.data.data.aliasName}</span></div>
          <div style={{paddingTop:5, paddingBottom:5}}>Model Name: <span style={{fontWeight:"bold"}}>{this.props.data.data.modelName}</span></div>
          <div style={{paddingTop:5, paddingBottom:5}}>Allow Null: <span style={{fontWeight:"bold"}}>{(this.props.data.data.isNullable)? "True" : "False"}</span></div>
          <div style={{paddingTop:5, paddingBottom:5}}>Required: <span style={{fontWeight:"bold"}}>{(this.props.data.data.hasOwnProperty("required"))? (this.props.data.data.required)? "True" : "False" : "False"}</span></div>
          <div style={{paddingTop:5, paddingBottom:5}}>Default Value: <span style={{fontWeight:"bold"}}>{(this.props.data.data.hasOwnProperty("defaultValue"))? this.props.data.data.defaultValve : ""}</span></div>
          <div style={{paddingTop:5, paddingBottom:5}}>Type: <span style={{fontWeight:"bold"}}>{this.props.data.data.type}</span></div>
          <div style={{paddingTop:5, paddingBottom:5}}>Length: <span style={{fontWeight:"bold"}}>{this.props.data.data.length}</span></div>
          <div style={{paddingTop:5, paddingBottom:5}}>Precision: <span style={{fontWeight:"bold"}}>{this.props.data.data.precision}</span></div>
          <div style={{paddingTop:5, paddingBottom:5}}>scale: <span style={{fontWeight:"bold"}}>{this.props.data.data.scale}</span></div>
          {
            (this.props.data.data.hasOwnProperty("domain")) && <div style={{paddingTop:5, paddingBottom:5}} onClick={()=>{this.toggleDomain()}}>{(this.state.expandDomain)?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />} Domain: <span style={{fontWeight:"bold"}}>{this.props.data.data.domain.domainName}</span></div>
          }
          {
            (this.props.data.data.hasOwnProperty("domain")) && <Collapse isOpen={this.state.expandDomain}>
            <div style={{minHeight: 100, maxHeight:500, overflow:"auto", paddingRight:2, borderWidth:2, borderStyle:"solid", borderColor:"#ccc"}}>
              {this._createDomainExpand(this.props.data.data.domain)}
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
        this._requestObject("1=1", "all");
        this._requestObject(this.props.data.text + " is null or " + this.props.data.text + " = null", "isNull");
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
  toggleDomain =() => {
    if(this.state.expandDomain) {
      this.setState({expandDomain:false});
    } else {
      this.setState({expandDomain:true});
    }
  }
  _substAlias =(alias: string) => {
    let substitute = alias;
    if(substitute.indexOf("[") > -1) {

    }

    return substitute;
  }

  _createDomainExpand =(domain: any) => {
    console.log(domain);
    let domainTable = null;
    let headerName = "Name";
    let headerValue = "Code";
    let vals = [];
    if(domain.hasOwnProperty("codedValues")) {
      domain.codedValues.map((d: any, z: number) =>{
        vals.push(
          <tr key={z}>
            <td style={{fontSize:"small"}}>{d.name}</td>
            <td style={{fontSize:"small"}}>{d.code}</td>
          </tr>
        );
      });
    } else {
      headerName = "Description";
      headerValue = "Range";
        vals.push(
        <tr key={domain.domainName}>
          <td style={{fontSize:"small"}}>{domain.description}</td>
          <td style={{fontSize:"small"}}>{domain.minValue + " to " + domain.maxValue}</td>
        </tr>);
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
    return domainTable;
  }

  _createStatsOutput =() => {
    let output = [];
    output.push(<div key={"all"}>Number of records in the System: {(this.state.siteStats.hasOwnProperty("all")? this.state.siteStats.all.count : 0 )}</div>);
    output.push(<div key={"blank"}>Number of records with {this.props.data.text} not populated: {(this.state.siteStats.hasOwnProperty("isNull")? this.state.siteStats.isNull.count : 0 )}</div>);
    this.setState({statsOutput: output});
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
      console.log(data);
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


}
