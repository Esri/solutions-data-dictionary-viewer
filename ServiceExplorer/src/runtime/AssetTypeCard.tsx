/** @jsx jsx */
import {React, defaultMessages as jimuCoreDefaultMessage} from 'jimu-core';
import {AllWidgetProps, css, jsx, styled} from 'jimu-core';
import {IMConfig} from '../config';

import { TabContent, TabPane,  Collapse, Icon, Table} from 'jimu-ui';
import CardHeader from './_header';
import './css/custom.css';
let rightArrowIcon = require('jimu-ui/lib/icons/arrow-right.svg');
let downArrowIcon = require('jimu-ui/lib/icons/arrow-down.svg');
let linkIcon = require('./assets/launch.svg');

interface IProps {
  data: any,
  controllerDS: any,
  dataElements: any,
  requestURL: string,
  key: any,
  relationships: any,
  panel:number,
  config: any,
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
  expandCategories: boolean,
  rulesElements: any,
  sourceId: number,
  rulesList: any,
  expandRuleType: any,
  minimizedDetails: boolean
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
      expandCategories: false,
      rulesElements: {},
      sourceId: -1,
      rulesList: [],
      expandRuleType : [],
      minimizedDetails: false
    };

  }

  componentWillMount() {
    //console.log(this.props.data);
    //console.log(this.props.controllerDS);
    //console.log(this.props.dataElements);
  }

  componentDidMount() {
    //this._processData();
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
          <div style={{paddingTop:5, paddingBottom:5}}><span style={{fontWeight:"bold"}}>Name:</span> <span>{this.state.nodeData.assetTypeName}</span></div>
          <div style={{paddingTop:5, paddingBottom:5}}><span style={{fontWeight:"bold"}}>Code:</span> <span>{this.state.nodeData.assetTypeCode}</span></div>
          <div style={{paddingTop:5, paddingBottom:5}}><span style={{fontWeight:"bold"}}>Terminal Configuration:</span> <span>{this._lookupTC(this.state.nodeData.terminalConfigurationId)}</span></div>
          <div style={{paddingTop:5, paddingBottom:5}} onClick={()=>{this.toggleExpandRules();}}>{(this.state.expandRules)?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />} <span style={{fontWeight:"bold"}}>Rules</span></div>
          <Collapse isOpen={this.state.expandRules}>
          <div style={{minHeight: 100, maxHeight:500, overflowY:"auto", borderWidth:2, borderStyle:"solid", borderColor:"#ccc"}}>
            {this._createRulesList()}
          </div>
          </Collapse>
          <div style={{paddingTop:5, paddingBottom:5}} onClick={()=>{this.toggleExpandCategories();}}>{(this.state.expandCategories)?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />} <span style={{fontWeight:"bold"}}>Categories</span></div>
          <Collapse isOpen={this.state.expandCategories}>
          <div style={{minHeight: 100, maxHeight:500, overflowY:"auto", borderWidth:2, borderStyle:"solid", borderColor:"#ccc"}}>
            {(this.props.data.data.categories.length > 0)?
              <Table hover width={"100%"}>
              <thead>
              <tr>
                <th style={{fontSize:"small", fontWeight:"bold"}}>Name</th>
              </tr>
              </thead>
              <tbody>
                {this._createCategoriesList()}
              </tbody>
            </Table>
            :
              <div style={{paddingLeft: "5px"}}>No network categories available</div>
            }
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
      }
    </div>);
  }

  //**** breadCrumb */
  buildCrumb =() => {
    let list = [];
    let passST = null;
    this.props.data.crumb.map((c:any, i:number) => {
      if(c.type === "Subtype") {
        passST = c.value;
      }
      list.push(<span key={i} onClick={()=>{
        if(passST !== null) {
          this.props.callbackLinkage(c.value, c.type, this.props.panel, this.props.data.parent, passST);
        } else {
          this.props.callbackLinkage(c.value, c.type, this.props.panel, this.props.data.parent);
        }
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
  toggleExpandRules =() => {
    if(this.state.expandRules) {
      this.setState({expandRules: false});
    } else {
      this.setState({expandRules: true});
    }
  }

  toggleExpandCategories =() => {
    if(this.state.expandCategories) {
      this.setState({expandCategories: false});
    } else {
      this.setState({expandCategories: true});
    }
  }

  toggleExpandRuleType =(val:string) => {
    let newRuleState = this.state.expandRuleType;
    if(newRuleState[val]) {
      newRuleState[val] = false;
      this.setState({expandRuleType: newRuleState});
    } else {
      newRuleState[val] = true;
      this.setState({expandRuleType: newRuleState});
    }
  }

  _createRulesList = () => {
    let arrList = [];

    let processRules =(rules:any) => {
      //console.log(rules);
      let rowList = [];
      rules.map((fv: any, i:number) => {
        rowList.push(<tr key={fv.attributes.ruletypename+i}>
          <td style={{fontSize:"small", textAlign: "left", verticalAlign: "top"}}>
            {(this.state.nodeData.assetTypeName === fv.attributes.toassettypename)?
              fv.attributes.toassettypename
            :
              <div onClick={()=>{this.props.callbackLinkage(fv.attributes.toassettypename,"Assettype", this.props.panel, fv.attributes.tolayername, fv.attributes.toassetgroupname)}} style={{display:"inline-block", verticalAlign: "top", paddingRight:5}}><Icon icon={linkIcon} size='12' color='#333' /> {fv.attributes.toassettypename}</div>
            }
          </td>
          <td style={{fontSize:"small", textAlign: "left", verticalAlign: "top"}}><div onClick={()=>{this.props.callbackLinkage(fv.attributes.toassetgroupname,"Subtype", this.props.panel, fv.attributes.tolayername)}} style={{display:"inline-block", verticalAlign: "top", paddingRight:5}}><Icon icon={linkIcon} size='12' color='#333' /> {fv.attributes.toassetgroupname}</div></td>
          <td style={{fontSize:"small"}}>{fv.attributes.toterminalconfig}</td>
          <td style={{fontSize:"small"}}>{fv.attributes.toterminalidname}</td>
          <td style={{fontSize:"small", textAlign: "left", verticalAlign: "top"}}>
          {(this.state.nodeData.assetTypeName === fv.attributes.fromassettypename)?
              fv.attributes.fromassettypename
            :
              <div onClick={()=>{this.props.callbackLinkage(fv.attributes.fromassettypename,"Assettype", this.props.panel, fv.attributes.fromlayername, fv.attributes.fromassetgroupname)}} style={{display:"inline-block", verticalAlign: "top", paddingRight:5}}><Icon icon={linkIcon} size='12' color='#333' /> {fv.attributes.fromassettypename}</div>
            }
          </td>
          <td style={{fontSize:"small", textAlign: "left", verticalAlign: "top"}}><div onClick={()=>{this.props.callbackLinkage(fv.attributes.fromassetgroupname,"Subtype", this.props.panel, fv.attributes.fromlayername)}} style={{display:"inline-block", verticalAlign: "top", paddingRight:5}}><Icon icon={linkIcon} size='12' color='#333' /> {fv.attributes.fromassetgroupname}</div></td>
          <td style={{fontSize:"small"}}>{fv.attributes.fromterminalconfig}</td>
          <td style={{fontSize:"small"}}>{fv.attributes.fromterminalidname}</td>
        </tr>);
      });
      return rowList;
    }

    if(Object.keys(this.state.rulesList).length > 0) {
      for(let key in this.state.rulesList){
        let codeBlock = <div key={key} style={{width:"100%"}}>
          <div style={{paddingTop:5, paddingBottom:5}} onClick={()=>{this.toggleExpandRuleType(key);}}>{(this.state.expandRuleType[key])?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />} {key}</div>
          <Collapse isOpen={this.state.expandRuleType[key]}>
          <Table key={key}>
            <thead>
            <tr>
              <th style={{fontSize:"small", fontWeight:"bold"}}>To Asset Type</th><th style={{fontSize:"small", fontWeight:"bold"}}>To Asset Group</th><th style={{fontSize:"small", fontWeight:"bold"}}>To Terminal Config</th><th style={{fontSize:"small", fontWeight:"bold"}}>To Terminal</th>
              <th style={{fontSize:"small", fontWeight:"bold"}}>From Asset Type</th><th style={{fontSize:"small", fontWeight:"bold"}}>From Asset Group</th><th style={{fontSize:"small", fontWeight:"bold"}}>From Terminal Config</th><th style={{fontSize:"small", fontWeight:"bold"}}>From Terminal</th>
            </tr>
            </thead>
            <tbody>
              {processRules(this.state.rulesList[key])}
            </tbody>
          </Table>
          </Collapse>
        </div>;
        arrList.push(codeBlock);
      }
    } else {
      arrList.push(
        <div key={0} style={{paddingLeft:15, paddingTop:10}}>No rules available</div>
      );
    }

    //this.setState({fieldHolder: arrList});
    return arrList;
  }

  _createCategoriesList = () => {
    let arrList = [];
    if(this.props.data.data.categories.length > 0){
      this.props.data.data.categories.map((c:string, i:number) => {
        arrList.push(
          <tr key={+i}>
            <td style={{fontSize:"small"}}>
              <div onClick={()=>{this.props.callbackLinkage(c,"Category", this.props.panel)}} style={{display:"inline-block", verticalAlign: "top", paddingRight:5}}><Icon icon={linkIcon} size='12' color='#333' /> {c}</div>
            </td>
          </tr>
        );
      });
    } else {
      arrList.push(<tr key={"no_categories"}><td colSpan={6}>Sorry, no categories</td></tr>);
    }
    //this.setState({fieldHolder: arrList});
    return arrList;
  }



  //****** helper functions and request functions
  //********************************************
  _requestRules = async () => {
    let sources = [];
    let correctId = this.props.data.parentId;
    let unde = null;
    let sourceId = null;
    let relFilter = [];
      //need to check if subtype is a table, if so, find it's target feature class that's it related to to get junction and edge sources
      let checkTables = this.props.data.crumb.some((c:any) => {
        return c.type === "Table";
      });
      if(checkTables) {
        relFilter = this.props.relationships.filter((re:any) => {
          return (re.destinationLayerId === parseInt(this.props.data.parentId) || re.originLayerId === parseInt(this.props.data.parentId));
        });
        if(relFilter.length > 0) {
          if(relFilter[0].destinationLayerId !== parseInt(this.props.data.parentId)) {
            correctId = relFilter[0].destinationLayerId;
          } else if(relFilter[0].originLayerId !== parseInt(this.props.data.parentId)) {
            correctId = relFilter[0].originLayerId;
          } else {
            //keep it the same
          }
        }
      }
      //end table check
    var rulesTable = this.props.dataElements.filter((de:any) =>{
      return de.dataElement.aliasName === "Rules";
    });
    this.props.dataElements.map((de:any) =>{
      if(de.dataElement.hasOwnProperty("domainNetworks")) {
        unde = de.dataElement;
        de.dataElement.domainNetworks.map((dn:any) =>{
          sources = [...sources, ...dn.edgeSources];
          sources = [...sources, ...dn.junctionSources];
          if(sourceId === null) {
            sourceId = sources.filter((es:any) =>{
              return es.layerId === correctId;
            });
          } else {
            if(sourceId.length <=0 ) {
              sourceId = sources.filter((es:any) =>{
                return es.layerId === correctId;
              });
            }
          }
          return sourceId.length > 0;
        });
      }
    });
    if(rulesTable.length > 0) {
      let whereClause = "";
      let url = this.props.requestURL + "/" + rulesTable[0].dataElement.layerId + "/query?where="+whereClause+"&f=pjson";
      //if(this.props.config.useCache) {
      //  url = this.props.config.cachePath + "/connectivityRules/" + rulesTable[0].dataElement.layerId + ".json";
      //} else {
        whereClause = "(fromassettype = " + this.state.nodeData.assetTypeCode + " AND fromassetgroup = " + this.props.data.subtypeCode;
        if((sourceId.length > 0)) {
          whereClause = whereClause + " AND fromnetworksourceid = " + sourceId[0].sourceId;
        }
        whereClause = whereClause + ") OR ";
        whereClause = whereClause + "(toassettype = " + this.state.nodeData.assetTypeCode + " AND toassetgroup = " + this.props.data.subtypeCode;
        if((sourceId.length > 0)) {
          whereClause = whereClause + " AND tonetworksourceid = " + sourceId[0].sourceId;
        }
        whereClause = whereClause + ")";
        url = this.props.requestURL + "/" + rulesTable[0].dataElement.layerId + "/query?where="+whereClause+"&f=pjson";
      //}

      await fetch(url, {
        method: 'GET'
      })
      .then((response) => {return response.json()})
      .then((data) => {
        if(!data.hasOwnProperty("error")){
          let rulesList = [];
          let distinctRuleType = [];
          data.features.map((feat: any) => {
            let ruleDesc = this._matchRuleType(feat.attributes.ruletype);
            if(typeof rulesList[ruleDesc] === "undefined") {
              rulesList[ruleDesc] = [];
              distinctRuleType.push(ruleDesc);
            }
            var toSource = sources.filter((s:any) =>{
              return s.sourceId === feat.attributes.tonetworksourceid;
            });
            var fromSource = sources.filter((s:any) =>{
              return s.sourceId === feat.attributes.fromnetworksourceid;
            });
            var descriptions = this._matchCodes(feat.attributes, toSource, fromSource, unde);
            feat.attributes["ruletypename"] = this._matchRuleType(feat.attributes.ruletype);
            feat.attributes["toassettypename"] = descriptions.toassettypename;
            feat.attributes["toassetgroupname"] = descriptions.toassetgroupname;
            if(toSource.length > 0) {
              feat.attributes["tolayername"] = (descriptions.toassettypename === this.state.nodeData.assetTypeName && feat.attributes.toassettype === this.state.nodeData.assetTypeCode)?this.props.data.parent:this._lookupLayerName(toSource[0]);
            } else {
              feat.attributes["tolayername"] = null;
            }
            feat.attributes["fromassettypename"] = descriptions.fromassettypename;
            feat.attributes["fromassetgroupname"] = descriptions.fromassetgroupname;
            if(fromSource.length > 0) {
              feat.attributes["fromlayername"] = (descriptions.fromassettypename === this.state.nodeData.assetTypeName && feat.attributes.fromassettype === this.state.nodeData.assetTypeCode)?this.props.data.parent:this._lookupLayerName(fromSource[0]);
            } else {
              feat.attributes["fromlayername"] = null;
            }
            feat.attributes["toterminalconfig"] = descriptions.toTerminalConfig;
            feat.attributes["fromterminalconfig"] = descriptions.fromTerminalConfig;
            feat.attributes["toterminalidname"] = descriptions.toTerminalId;
            feat.attributes["fromterminalidname"] = descriptions.fromTerminalId;
            rulesList[ruleDesc].push(feat);
          });
          this.setState({rulesElements: data, sourceId: sourceId[0].sourceId, rulesList:rulesList, expandRuleType:distinctRuleType});
        }
      });
    }
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

  _matchField =(lookup: string) => {
    let fieldVal = [];
    fieldVal = this.props.data.fields.filter((f:any)=> {
      return(f.name === lookup);
    });
    return fieldVal;
  }

  _lookupTC =(lookup: any) => {
    let returnValue = lookup;
    this.props.controllerDS.dataElement.terminalConfigurations.map((tc:any) => {
      if(tc.terminalConfigurationId === lookup) {
        returnValue = tc.terminalConfigurationName;
      }
    });
    return returnValue;
  }

  _matchRuleType =(rule: number) => {
    let description = rule.toString();
    switch(rule) {
      case 1: {description = "Junction Junction"; break;}
      case 2: {description = "Containment"; break;}
      case 3: {description = "Attachment"; break;}
      case 4: {description = "Junction Edge"; break;}
      case 5: {description = "Edge Junction Edge"; break;}
      default: {description = rule.toString(); break;}
    }
    return description;
  }

  _lookupLayerName =(source:any) => {
    let layerName = source.sourceId.toString();
    this.props.dataElements.map((de:any) => {
      if(de.layerId === source.layerId) {
        layerName = de.dataElement.aliasName;
      }
    });
    return layerName;
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
