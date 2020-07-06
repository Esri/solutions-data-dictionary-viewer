/** @jsx jsx */
import {BaseWidget, React, classNames, FormattedMessage, defaultMessages as jimuCoreDefaultMessage, IMDataSourceInfo, DataSource, DataSourceComponent} from 'jimu-core';
import {AllWidgetProps, css, jsx, styled} from 'jimu-core';
import {IMConfig} from '../config';
import {Collapse, Icon,Table} from 'jimu-ui';
import {TabContent, TabPane} from 'reactstrap';
import CAVWorkSpace from './_CAVWorkSpace';
import CardHeader from './_header';
import './css/custom.css';
import esriLookup from './_constants';
let rightArrowIcon = require('jimu-ui/lib/icons/arrow-right.svg');
let downArrowIcon = require('jimu-ui/lib/icons/arrow-down.svg');
let linkIcon = require('./assets/launch.svg');


interface IProps {
  key:any,
  data: any,
  domains: any,
  cacheData: any,
  requestURL: string,
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
  description: string,
  metadataElements: any,
  activeTab:string,
  siteStats: any,
  statsOutput: any,
  domainHolder: any,
  fieldNameHolder: any,
  fieldHolder: any,
  validFields: any,
  validFieldsChecker: any,
  assetTypeDesc: any,
  expandFields: boolean,
  expandCAV: boolean,
  expandAR: boolean,
  expandAT: boolean,
  minimizedDetails: boolean,
  esriValueList: any
}

export default class SubtypeCard extends React.Component <IProps, IState> {
  constructor(props: IProps){
    super(props);

    this.state = {
      nodeData: this.props.data.data,
      description: "",
      metadataElements: null,
      activeTab:"Properties",
      siteStats: {},
      statsOutput: [],
      domainHolder: {},
      fieldNameHolder: {},
      fieldHolder: [],
      validFields: [],
      validFieldsChecker: [],
      assetTypeDesc: [],
      expandFields: false,
      expandCAV: false,
      expandAR: false,
      expandAT: false,
      minimizedDetails: false,
      esriValueList: new esriLookup()
    };

  }

  componentWillMount() {
    this._requestMetadata().then(()=> {
      //console.log(this.state.metadataElements);
      this._processMetaData();

      let tempFieldList = [...this.state.nodeData.fieldInfos];
      this.props.data.fields.map((fd: any) => {
        let exist = tempFieldList.some((t:any)=> {
          return(t.fieldName.toLowerCase() === fd.name.toLowerCase());
        });
        if(!exist) {
          tempFieldList.push({
            "defaultValue":null,
            "domainName":"",
            "fieldName":fd.name
          });
        }
      });
      tempFieldList.sort(this._compare("fieldName"));
      let domainList = {};
      let fieldList = {};
      let matchFieldList = tempFieldList;
      if(this.state.validFieldsChecker.length > 0) {
        matchFieldList = tempFieldList.filter((tf:any) => {
          return this.state.validFieldsChecker.some((f: any) => {
            return(tf.fieldName === f.fieldName);
          });
        });
        matchFieldList.map((fi: any, i: number)=>{
          if(fi.domainName !== "") {
            domainList[fi.domainName] = false;
          }
          fieldList[fi.fieldName] = false;
        });
      } else {
        matchFieldList.map((fi: any, i: number)=>{
          if(fi.domainName !== "") {
            domainList[fi.domainName] = false;
          }
          fieldList[fi.fieldName] = false;
        });
      }
      this.setState({domainHolder: domainList, fieldHolder:fieldList, validFields:matchFieldList});
    });

  }

  componentDidMount() {
    //this._processData();
    //this._requestObject()
    this._createFieldList();
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
        showStatistics={true}
        showResources={false}
      />
      {
        (this.state.minimizedDetails)?""
        :
        <TabContent activeTab={this.state.activeTab}>
        <TabPane tabId="Properties">
        <div style={{width: "100%", paddingLeft:10, paddingRight:10, wordWrap: "break-word", whiteSpace: "normal"}}>
        <div style={{paddingTop:5, paddingBottom:5, fontSize:"smaller"}}>{this.buildCrumb()}<span style={{fontWeight:"bold"}}>Properties</span></div>
          <div style={{paddingTop:5, paddingBottom:5}}><span style={{fontWeight:"bold"}}>Name:</span> {this.state.nodeData.subtypeName}</div>
          <div style={{paddingTop:5, paddingBottom:5}}><span style={{fontWeight:"bold"}}>Code:</span> {this.state.nodeData.subtypeCode}</div>
          <div style={{paddingTop:5, paddingBottom:5, width:"100%", wordWrap: "break-word", whiteSpace: "normal"}}><span style={{fontWeight:"bold"}}>Description:</span> {this.state.description}</div>
          {
            (this.props.data.hasOwnProperty("nodes"))?
            <div style={{paddingTop:5, paddingBottom:5, cursor:"pointer"}} onClick={()=>{this.toggleExpandAT()}}>{(this.state.expandAT)?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />} <span style={{fontWeight:"bold"}}>Asset Types</span></div>
            :
            ""
          }
          <Collapse isOpen={this.state.expandAT}>
            <div style={{minHeight: 100, maxHeight:500, overflow:"auto", paddingRight:2, borderWidth:2, borderStyle:"solid", borderColor:"#ccc"}}>
              {this._createAssetTypeTable()}
            </div>
          </Collapse>
          <div style={{paddingTop:5, paddingBottom:5, cursor:"pointer"}} onClick={()=>{this.toggleExpandFieldBlock();}}>{(this.state.expandFields)?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />} <span style={{fontWeight:"bold"}}>Fields</span></div>
          <Collapse isOpen={this.state.expandFields}>
          <div style={{minHeight: 100, maxHeight:500, overflowY:"auto", borderWidth:2, borderStyle:"solid", borderColor:"#ccc"}}>
            {(this.state.validFields.length > 0)?
              <Table hover>
                <thead>
                <tr>
                  <th style={{fontSize:"small", fontWeight:"bold"}}>Field Name</th>
                  <th style={{fontSize:"small", fontWeight:"bold"}}>Alias</th>
                  <th style={{fontSize:"small", fontWeight:"bold"}}>Description</th>
                  <th style={{fontSize:"small", fontWeight:"bold"}}>Domain</th>
                  <th style={{fontSize:"small", fontWeight:"bold"}}>Default Value</th>
                </tr>
                </thead>
                <tbody>
                  {this._createFieldList()}
                </tbody>
              </Table>
              :
              "No fields available"
            }
          </div>
          </Collapse>
          {
            (this.props.data.attributeRules.length > 0)?
            <div style={{paddingTop:5, paddingBottom:5, cursor:"pointer"}} onClick={()=>{this.toggleExpandAR()}}>{(this.state.expandAR)?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />} <span style={{fontWeight:"bold"}}>Attributes Rules</span></div>
            :
            ""
          }
          <Collapse isOpen={this.state.expandAR}>
            <div style={{minHeight: 100, maxHeight:500, overflow:"auto", paddingRight:2, borderWidth:2, borderStyle:"solid", borderColor:"#ccc"}}>
              {this._createARTable()}
            </div>
          </Collapse>
          <div style={{paddingTop:5, paddingBottom:5, cursor:"pointer"}} onClick={()=>{this.toggleExpandCAV()}}>{(this.state.expandCAV)?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />} <span style={{fontWeight:"bold"}}>Contingent Attribute Values</span></div>
          <Collapse isOpen={this.state.expandCAV}>
            <div style={{minHeight: 100, maxHeight:500, overflow:"auto", paddingRight:2, borderWidth:2, borderStyle:"solid", borderColor:"#ccc"}}>
              <CAVWorkSpace data={this.props.data} domains={this.props.domains} requestURL={this.props.requestURL} fieldGroups={this.props.data.fieldGroups} config={this.props.config} cacheData={this.props.cacheData} assetType={""}></CAVWorkSpace>
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
        let atList = this._validAssetTypes("assettype");
        this._requestObject("ASSETGROUP="+this.props.data.data.subtypeCode, "all");
        if(atList.length > 0) {
          atList[0].codedValues.map((cv:any) => {
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

  toggleExpandCAV =() => {
    if(this.state.expandCAV) {
      this.setState({expandCAV: false});
    } else {
      this.setState({expandCAV: true});
    }
  }

  toggleExpandAR =() => {
    if(this.state.expandAR) {
      this.setState({expandAR: false});
    } else {
      this.setState({expandAR: true});
    }
  }

  toggleExpandAT =() => {
    if(this.state.expandAT) {
      this.setState({expandAT: false});
    } else {
      this.setState({expandAT: true});
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

  _createAssetTypeTable =() => {
    let _createATList =() => {
      let desc = this.state.assetTypeDesc;
      let arrList = [];
      let filterAT = this.state.nodeData.fieldInfos.filter((at: any, i: number)=>{
        return(at.fieldName.toLowerCase() === "assettype");
      });
      if(filterAT.length > 0) {
        filterAT.map((at: any, i: number) => {
          let domainList = this._matchDomain(at.domainName);
          if(domainList.length > 0) {
            if(domainList[0].hasOwnProperty("codedValues")) {
              domainList[0].codedValues.map((d:any, i:number) => {
                let filtered = desc.filter((f:any)=> {
                  return parseInt(f.code) === parseInt(d.code);
                });
                arrList.push(
                  <tr key={i}>
                    <td style={{fontSize:"small"}}><div style={{cursor:"pointer"}} onClick={()=>{this.props.callbackLinkage(d.name,"Assettype", this.props.panel, this.props.data.parent, this.state.nodeData.subtypeName)}}><Icon icon={linkIcon} size='12' color='#333' /> {d.name}</div></td>
                    <td style={{fontSize:"small"}}>{d.code}</td>
                    <td style={{fontSize:"small", wordWrap: "break-word"}}>{(filtered.length > 0)?filtered[0].description:""}</td>
                  </tr>
                );
              });
            }
          }
        });
      }
      return arrList;
    }
    let rows = _createATList();

      return((rows.length > 0)?<Table hover>
        <thead>
        <tr>
          <th style={{fontSize:"small", fontWeight:"bold"}}>Name</th>
          <th style={{fontSize:"small", fontWeight:"bold"}}>Code</th>
          <th style={{fontSize:"small", fontWeight:"bold"}}>Description</th>
        </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
        </Table>:
        "No Asset types"
      );
  }

  _createFieldList = () => {
    let arrList = [];
    let usedFields = [];
    this.state.validFields.map((fi: any, i: number)=>{
      if(fi.fieldName !== "shape") {
        let domainTable = this._createDomainExpand(fi.domainName);
        let fieldDetailsTable = this._createFieldsExpand(fi.fieldName);
        let domain = this._matchDomain(fi.domainName);
        let fieldObj = this._matchField(fi.fieldName);
        let defaultVal = fi.defaultValue;
        let fieldName = fi.fieldName;
        let alias = "";
        let fieldDesc = "";
        usedFields.push(fieldName);
        if(fieldObj.length > 0) {
          alias = fieldObj[0].aliasName;
          //check metadata for specific alias
          let aliasFromMetadata = this._matchFieldAliasAndDesc(fieldName, "alias");
          let DescFromMetadata = this._matchFieldAliasAndDesc(fieldName, "field");
          if(aliasFromMetadata !== "") {
            alias = aliasFromMetadata;
          }
          if(DescFromMetadata !== "") {
            fieldDesc = DescFromMetadata;
          }
          fieldName = <span><div style={{textAlign: "left", cursor:"pointer"}}>{(this.state.fieldHolder[fi.fieldName])?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />} {fi.fieldName}</div></span>;
        }
        if(domain.length > 0) {
          if(domain[0].hasOwnProperty("codedValues")) {
            domain[0].codedValues.map((cv: any)=>{
              if(cv.code === fi.defaultValue) {
                defaultVal = cv.name + " - " + fi.defaultValue;
              }
            });
          }
        }
        if(defaultVal === true) {
          defaultVal = "True";
        } else if (defaultVal === false) {
          defaultVal = "False";
        } else {
          //keep whatever value it is.
        }
        arrList.push(<tr key={i}><td style={{fontSize:"small", textAlign: "left", verticalAlign: "top", whiteSpace: "nowrap"}}>
        <div onClick={()=>{this.props.callbackLinkage(fi.fieldName,"Field", this.props.panel, this.props.data.parent)}} style={{display:"inline-block", verticalAlign: "top", paddingRight:5, cursor:"pointer"}}><Icon icon={linkIcon} size='12' color='#333' /></div>
        <div style={{fontSize:"small", display:"inline-block", verticalAlign: "top", cursor:"pointer"}} onClick={()=>{
          this.toggleFields(fi.fieldName);
        }}>{fieldName}
        </div>
        <Collapse isOpen={this.state.fieldHolder[fi.fieldName]}>
          {(fieldDetailsTable !== null)? fieldDetailsTable: ""}
        </Collapse>
        </td>
        <td style={{fontSize:"small"}}>{alias}</td>
        <td style={{fontSize:"small"}}>{fieldDesc}</td>
        <td style={{fontSize:"small"}}>
          <div style={{fontSize:"small", display:"inline-block", verticalAlign: "top", whiteSpace: "nowrap"}}>
            <div onClick={()=>{this.props.callbackLinkage(fi.domainName,"Domain", this.props.panel)}} style={{display:"inline-block", verticalAlign: "top", paddingRight:5, whiteSpace: "nowrap", cursor:"pointer"}}>{(fi.domainName !== "")?<Icon icon={linkIcon} size='12' color='#333' />:''}</div>
            <div style={{fontSize:"small", display:"inline-block", verticalAlign: "top", wordBreak:"break-word", cursor:"pointer"}} onClick={()=>{
              this.toggleDomains(fi.domainName);
            }}>{(fi.domainName !== "")?(this.state.domainHolder[fi.domainName])?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />:""}</div>
          </div>
          <div style={{fontSize:"small", display:"inline-block", verticalAlign: "top", whiteSpace: "nowrap"}}> {fi.domainName}</div>
          <Collapse isOpen={this.state.domainHolder[fi.domainName]}>
            {domainTable}
          </Collapse>
        </td>
        <td style={{fontSize:"small"}}>{defaultVal}</td>
        </tr>);
      }
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

  _createFieldsExpand =(fName: string) => {
    let field = this._matchField(fName);
    let fieldTable: any;
    if(field.length > 0) {
      let vals = [];
      for(let keyNode in field[0]) {
        let v = field[0][keyNode];
        if(v === true) {v = "True";}
        if(v === false) {v= "False";}
        if(keyNode === "domain") {
          v = field[0][keyNode]["domainName"];
        }
        vals.push(
          <tr key={keyNode}>
            <td style={{fontSize:"small"}}>{keyNode}</td>
            <td style={{fontSize:"small"}}>{(typeof(v) === "string")?(v.indexOf("esri") > -1)?this.state.esriValueList.lookupValue(v):v:v}</td>
          </tr>
        );
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
    } else {
      fieldTable = <Table>
      <thead>
      </thead>
      <tbody>
        <tr>
        <td>Sorry, no field information</td>
        </tr>
      </tbody>
    </Table>;
    }
    return fieldTable;
  }

  _createARTable =() => {
    if(this.props.data.attributeRules.length > 0) {
      let rows = this._createARList();
      return(
        (rows.length > 0)?
          <Table hover>
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
          </Table>
         :
          <Table hover>
          <tbody>
            <tr><td>No attribute rules configured</td></tr>
          </tbody>
          </Table>);
    } else {
      return(<Table hover>
        <tbody>
          <tr><td>No attribute rules configured</td></tr>
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
            <td style={{fontSize:"small"}}><div style={{cursor:"pointer"}} onClick={()=>{this.props.callbackLinkage(ar.name,"Attribute Rule", this.props.panel, this.props.data.parent)}}><Icon icon={linkIcon} size='12' color='#333' /> {ar.name}</div></td>
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
  _requestMetadata = async() => {
    if(this.props.config.useCache) {
      let data  = this.props.cacheData.metadata[this.props.data.parentId];
      let parser = new DOMParser();
      let xmlDoc = parser.parseFromString(data,"text/xml");
      this.setState({metadataElements: xmlDoc});
    } else {
      let url = this.props.requestURL + "/" + this.props.data.parentId + "/metadata";
      await fetch(url, {
        method: 'GET'
      })
      .then((response) => {return response.text()})
      .then((data) => {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(data,"text/xml");
        this.setState({metadataElements: xmlDoc});
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

  _processMetaData =() => {
    let description= "";
    let fieldFilter = [];
    let ATDesc = [];
    let metadata = this.state.metadataElements;
    let metaLevel = metadata.getElementsByTagName("metadata");
    if(metaLevel.length > 0) {
      let eaInfoLevel = metaLevel[0].getElementsByTagName("eainfo");
      if(eaInfoLevel.length > 0) {
        let detailedLevel = eaInfoLevel[0].getElementsByTagName("detailed");
        if(detailedLevel.length > 0) {
          for (let i=0; i < detailedLevel.length; i++) {
            let subTypeCodeLevel = detailedLevel[i].getElementsByTagName("enttypdv");
            if(subTypeCodeLevel.length > 0) {
              //loop thorugh details and get code node and see if it's the current code card is on.
              if(parseInt(subTypeCodeLevel[0].innerHTML) === parseInt(this.state.nodeData.subtypeCode)) {
                //this tag stores the descriptions
                let subTypeDescLevel = detailedLevel[i].getElementsByTagName("enttypd");
                if(subTypeDescLevel.length > 0) {
                  description = subTypeDescLevel[0].innerHTML;
                }
                //now add only fields that pertain to this subtype
                let attrLevel = detailedLevel[i].getElementsByTagName("attr");
                if(attrLevel.length > 0) {
                  for (let z=0; z < attrLevel.length; z++) {
                    let fieldName = attrLevel[z].getElementsByTagName("attrlabl");
                    let fieldAlias = attrLevel[z].getElementsByTagName("attalias");
                    let fieldDesc = attrLevel[z].getElementsByTagName("attrdef");
                    if(fieldName.length > 0) {
                      fieldFilter.push({fieldName: fieldName[0].innerHTML, fieldAlias: fieldAlias[0].innerHTML, fieldDesc:(fieldDesc.length > 0)?fieldDesc[0].innerHTML:""});
                      if(fieldName[0].innerHTML.toLowerCase() === "assettype") {
                        //get AT descriptions
                        let attrdomvLevel = attrLevel[z].getElementsByTagName("attrdomv");
                        if(attrdomvLevel.length > 0) {
                          let edomLevel = attrdomvLevel[0].getElementsByTagName("edom");
                          if(edomLevel.length > 0) {
                            for (let e=0; e < edomLevel.length; e++) {
                              let edomvLevel = edomLevel[e].getElementsByTagName("edomv");
                              let edomvddLevel = edomLevel[e].getElementsByTagName("edomvdd");
                              //where AT desc is stored
                              if(edomvddLevel.length > 0) {
                                ATDesc.push({code: edomvLevel[0].innerHTML, description: edomvddLevel[0].innerHTML})
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }

              }
            }
          }
        }

      }
    }
    this.setState({description:description, validFieldsChecker:fieldFilter, assetTypeDesc: ATDesc});
  }

  _compare =(prop: any) => {
    return function(a: any, b: any) {
      let comparison = 0;
      if (a[prop].toLowerCase() > b[prop].toLowerCase()) {
        comparison = 1;
      } else if (a[prop].toLowerCase() < b[prop].toLowerCase()) {
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

  _matchFieldAliasAndDesc =(lookup: string, type: string) => {
    let returnVal = "";
    let fieldFiltered = this.state.validFieldsChecker.filter((f:any)=> {
      return(f.fieldName === lookup);
    });
    if(fieldFiltered.length > 0) {
      if(type === "alias") {
        returnVal = fieldFiltered[0].fieldAlias;
      } else {
        returnVal = fieldFiltered[0].fieldDesc;
      }
    }
    return returnVal;
  }

}
