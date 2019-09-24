/** @jsx jsx */
import {React, defaultMessages as jimuCoreDefaultMessage} from 'jimu-core';
import {AllWidgetProps, css, jsx, styled} from 'jimu-core';
import {IMConfig} from '../config';

import { TabContent, TabPane,  Collapse, Icon, Table} from 'jimu-ui';
import CardHeader from './_header';
import './css/custom.css';
let rightArrowIcon = require('jimu-ui/lib/icons/arrow-right.svg');
let downArrowIcon = require('jimu-ui/lib/icons/arrow-down.svg');
let linkIcon = require('jimu-ui/lib/icons/tool-layer.svg');

interface IProps {
  data: any,
  controllerDS: any,
  dataElements: any,
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
  expandRules: boolean,
  rulesElements: any,
  sourceId: number
}

export default class TableCard extends React.Component <IProps, IState> {
  constructor(props: IProps){
    super(props);

    this.state = {
      nodeData: this.props.data.data,
      siteStats: {},
      statsOutput: [],
      activeTab: 'Properties',
      expandRules: false,
      rulesElements: {},
      sourceId: -1
    };

  }

  componentWillMount() {
    console.log(this.props.data);
    console.log(this.props.controllerDS);
    console.log(this.props.dataElements);
  }

  componentDidMount() {
    //this._processData();
    //this._requestObject()
    //this._createFieldList();
    this._requestRules();
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
          <div style={{paddingTop:5, paddingBottom:5}}>Name: <span style={{fontWeight:"bold"}}>{this.state.nodeData.assetTypeName}</span></div>
          <div style={{paddingTop:5, paddingBottom:5}}>Code: <span style={{fontWeight:"bold"}}>{this.state.nodeData.assetTypeCode}</span></div>
          <div style={{paddingTop:5, paddingBottom:5}} onClick={()=>{this.toggleExpandRules();}}>{(this.state.expandRules)?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />} Rules:</div>
          <Collapse isOpen={this.state.expandRules}>
          <div style={{minHeight: 100, maxHeight:500, overflowY:"auto", borderWidth:2, borderStyle:"solid", borderColor:"#ccc"}}>
              <Table hover width={"100%"}>
                <tbody>
                  {this._createRulesList()}
                </tbody>
              </Table>
          </div>
          </Collapse>
          <div style={{paddingBottom: 15}}></div>
        </div>
        </TabPane>
        <TabPane tabId="Statistics">
          <div style={{width: "100%", paddingLeft:10, paddingRight:10}}>
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
  toggleExpandRules =() => {
    if(this.state.expandRules) {
      this.setState({expandRules: false});
    } else {
      this.setState({expandRules: true});
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

  _createRulesList = () => {
    let arrList = [];
    let fromList = [];
    let toList = [];
    if(this.state.rulesElements.hasOwnProperty("features")){
      if(this.state.rulesElements.features.length > 0) {
        let fromValues = this.state.rulesElements.features.filter((re:any) => {
          return (re.attributes.fromassettype === this.state.nodeData.assetTypeCode && re.attributes.fromassetgroup === this.props.data.subtypeCode && re.attributes.fromnetworksourceid === this.state.sourceId)
        });

        if(fromValues.length > 0) {
          fromList.push(<tr><td colSpan={6}>Rules from this asset type</td></tr>);
          fromList.push(<tr><td>From Terminal Config</td><td>From Terminal</td><td>To Asset Group</td><td>To Asset Type</td><td>To Terminal Config</td><td>To Terminal</td></tr>);
          fromValues.map((fv: any, i: number)=>{
            fromList.push(<tr key={i}>
              <td style={{fontSize:"small"}}>{fv.attributes.fromterminalconfig}</td>
              <td style={{fontSize:"small"}}>{fv.attributes.fromterminalidname}</td>
              <td style={{fontSize:"small", textAlign: "left", verticalAlign: "top"}}>
                <div onClick={()=>{this.props.callbackLinkage(fv.attributes.toassetgroupname,"Subtype", this.props.panel)}} style={{display:"inline-block", verticalAlign: "top", paddingRight:5}}><Icon icon={linkIcon} size='12' color='#333' /> {fv.attributes.toassetgroupname}</div>
              </td>
              <td style={{fontSize:"small"}}>{fv.attributes.toassettypename}</td>
              <td style={{fontSize:"small"}}>{fv.attributes.toterminalconfig}</td>
              <td style={{fontSize:"small"}}>{fv.attributes.toterminalidname}</td>
            </tr>);
          });
        }

        let toValues = this.state.rulesElements.features.filter((re:any) => {
          return (re.attributes.toassettype === this.state.nodeData.assetTypeCode && re.attributes.toassetgroup === this.props.data.subtypeCode && re.attributes.tonetworksourceid === this.state.sourceId)
        });

        if(toValues.length > 0) {
          toList.push(<tr><td colSpan={6}></td></tr>);
          toList.push(<tr><td colSpan={6}>Rules to this asset type</td></tr>);
          toList.push(<tr><td>From Asset Group</td><td>From Asset Type</td><td>From Terminal Config</td><td>From Terminal</td><td>To Terminal Config</td><td>To Terminal</td></tr>);
          toValues.map((fv: any, i: number)=>{
            toList.push(<tr key={i}>
              <td style={{fontSize:"small", textAlign: "left", verticalAlign: "top"}}>
                <div onClick={()=>{this.props.callbackLinkage(fv.attributes.fromassetgroupname,"Subtype", this.props.panel)}} style={{display:"inline-block", verticalAlign: "top", paddingRight:5}}><Icon icon={linkIcon} size='12' color='#333' /> {fv.attributes.fromassetgroupname}</div>
              </td>
              <td style={{fontSize:"small"}}>{fv.attributes.fromassettypename}</td>
              <td style={{fontSize:"small"}}>{fv.attributes.fromterminalconfig}</td>
              <td style={{fontSize:"small"}}>{fv.attributes.fromterminalidname}</td>
              <td style={{fontSize:"small"}}>{fv.attributes.toterminalconfig}</td>
              <td style={{fontSize:"small"}}>{fv.attributes.toterminalidname}</td>
            </tr>);
          });
        }

        arrList = [...fromList, ...toList];

      }
    }
    //this.setState({fieldHolder: arrList});
    return arrList;
  }


  //****** helper functions and request functions
  //********************************************
  _requestRules = async () => {
    var sources = [];
    var sourceId = null;
    var unde = null;
    var rulesTable = this.props.dataElements.filter((de:any) =>{
      return de.dataElement.aliasName === "Rules";
    });
    var datElm = this.props.dataElements.map((de:any) =>{
      if(de.dataElement.hasOwnProperty("domainNetworks")) {
        unde = de.dataElement;
        var domNet = de.dataElement.domainNetworks.some((dn:any) =>{
          sources = [...sources, ...dn.edgeSources];
          sources = [...sources, ...dn.junctionSources];
          sourceId = dn.edgeSources.filter((es:any) =>{
            return es.layerId === this.props.data.parentId;
          });
          if(sourceId.length <= 0) {
            sourceId = dn.junctionSources.filter((js:any) =>{
              return js.layerId === this.props.data.parentId;
            });
          }
          return sourceId.length > 0;
        });
      }
    });
    if(rulesTable.length > 0) {
      let whereClause = "(fromassettype = " + this.state.nodeData.assetTypeCode + " AND fromassetgroup = " + this.props.data.subtypeCode;
      if((sourceId.length > 0)) {
        whereClause = whereClause + " AND fromnetworksourceid = " + sourceId[0].sourceId;
      }
      whereClause = whereClause + ") OR ";
      whereClause = whereClause + "(toassettype = " + this.state.nodeData.assetTypeCode + " AND toassetgroup = " + this.props.data.subtypeCode;
      if((sourceId.length > 0)) {
        whereClause = whereClause + " AND tonetworksourceid = " + sourceId[0].sourceId;
      }
      whereClause = whereClause + ")";
      console.log(whereClause);
      let URL = this.props.requestURL + "/" + rulesTable[0].dataElement.layerId + "/query?where="+whereClause+"&f=pjson";
      await fetch(URL, {
        method: 'GET'
      })
      .then((response) => {return response.json()})
      .then((data) => {
        if(!data.hasOwnProperty("error")){
          data.features.map((feat: any) => {
            var toSource = sources.filter((s:any) =>{
              return s.sourceId === feat.attributes.tonetworksourceid;
            });
            var fromSource = sources.filter((s:any) =>{
              return s.sourceId === feat.attributes.fromnetworksourceid;
            });
            var descriptions = this._matchCodes(feat.attributes, toSource, fromSource, unde);
            feat.attributes["toassettypename"] = descriptions.toassettypename;
            feat.attributes["toassetgroupname"] = descriptions.toassetgroupname;
            feat.attributes["fromassettypename"] = descriptions.fromassettypename;
            feat.attributes["fromassetgroupname"] = descriptions.fromassetgroupname;
            feat.attributes["toterminalconfig"] = descriptions.toTerminalConfig;
            feat.attributes["fromterminalconfig"] = descriptions.fromTerminalConfig;
            feat.attributes["toterminalidname"] = descriptions.toTerminalId;
            feat.attributes["fromterminalidname"] = descriptions.fromTerminalId;
          });
          console.log(data);
          this.setState({rulesElements: data, sourceId: sourceId[0].sourceId});
        }
      });
    }
  }

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

  _matchCodes =(data: any, toSource: any, fromSource: any, de: any) => {
    var returnData = {fromassettypename: null, fromassetgroupname: null, toassettypename: null, toassetgroupname: null};
    if(toSource.length > 0) {
      toSource[0].assetGroups.map((ag:any) => {
        if(ag.assetGroupCode === data.toassetgroup) {
          returnData["toassetgroupname"] = ag.assetGroupName;
          ag.assetTypes.map((at:any)=>{
            if(at.assetTypeCode === data.toassettype) {
              returnData["toassettypename"] = at.assetTypeName;
              var termConf = this._matchTerminalConfig(at, de, data, "to");
              returnData = {...returnData, ...termConf};
            }
          });
        }
      });
    }
    if(fromSource.length > 0) {
      fromSource[0].assetGroups.map((ag:any) => {
        if(ag.assetGroupCode === data.fromassetgroup) {
          returnData["fromassetgroupname"] = ag.assetGroupName;
          ag.assetTypes.map((at:any)=>{
            if(at.assetTypeCode === data.fromassettype) {
              returnData["fromassettypename"] = at.assetTypeName;
              var termConf = this._matchTerminalConfig(at, de, data, "from");
              returnData = {...returnData, ...termConf};
            }
          });
        }
      });
    }
    return returnData;
  }

  _matchTerminalConfig =(at:any, sourceLayer:any, data:any, direction:string) => {
    var terminalConfig = {};
    var terminal = sourceLayer.terminalConfigurations.filter((tc:any)=>{
      return tc.terminalConfigurationId === at.terminalConfigurationId;
    });
    if(terminal.length > 0) {
      terminal[0].terminals.map((t:any) => {
        if(direction === "to") {
          if(t.terminalId === data.toterminalid) {
            terminalConfig = {toTerminalConfig:null, toTerminalId:null};
            terminalConfig["toTerminalConfig"] = terminal[0].terminalConfigurationName;
            terminalConfig["toTerminalId"] = t.terminalName;
          }
        } else {
          if(t.terminalId === data.fromterminalid) {
            terminalConfig = {fromTerminalConfig:null, fromTerminalId:null};
            terminalConfig["fromTerminalConfig"] = terminal[0].terminalConfigurationName;
            terminalConfig["fromTerminalId"] = t.terminalName;
          }
        }
      });
    }
    return terminalConfig;
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
