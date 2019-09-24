/** @jsx jsx */
import {BaseWidget, React, classNames, FormattedMessage, defaultMessages as jimuCoreDefaultMessage, IMDataSourceInfo, DataSource, DataSourceComponent} from 'jimu-core';
import {AllWidgetProps, css, jsx, styled} from 'jimu-core';
import {IMConfig} from '../config';
import { TabContent, TabPane, Collapse, Icon,Table} from 'jimu-ui';
import CAVWorkSpace from './CAVWorkSpace';
import CardHeader from './_header';
import './css/custom.css';

let rightArrowIcon = require('jimu-ui/lib/icons/arrow-right.svg');
let downArrowIcon = require('jimu-ui/lib/icons/arrow-down.svg');
let linkIcon = require('jimu-ui/lib/icons/tool-layer.svg');


interface IProps {
  key:any,
  data: any,
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
  expandFields: boolean,
  expandCAV: boolean,
  expandAR: boolean,
  expandAT: boolean
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
      expandFields: false,
      expandCAV: false,
      expandAR: false,
      expandAT: false
    };

  }

  componentWillMount() {
    console.log(this.props.data);
    //test
    this._requestMetadata().then(()=> {
      console.log(this.state.metadataElements);
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
          return(this.state.validFieldsChecker.indexOf(tf.fieldName) > -1)
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
        showProperties={true}
        showStatistics={true}
        showResources={false}
      />
      <TabContent activeTab={this.state.activeTab}>
        <TabPane tabId="Properties">
        <div style={{width: "100%", paddingLeft:10, paddingRight:10, wordWrap: "break-word", whiteSpace: "normal"}}>
          <div><h5>{this.props.data.type} Properties</h5></div>
          <div style={{paddingTop:5, paddingBottom:5}}>Name: <span style={{fontWeight:"bold"}}>{this.state.nodeData.subtypeName}</span></div>
          <div style={{paddingTop:5, paddingBottom:5}}>Code: <span style={{fontWeight:"bold"}}>{this.state.nodeData.subtypeCode}</span></div>
          <div style={{paddingTop:5, paddingBottom:5, width:"100%", wordWrap: "break-word", whiteSpace: "normal"}}>Description: <span style={{fontWeight:"bold"}}>{this.state.description}</span></div>
          <div style={{paddingTop:5, paddingBottom:5}} onClick={()=>{this.toggleExpandAT()}}>{(this.state.expandAT)?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />} Asset Types:</div>
          <Collapse isOpen={this.state.expandAT}>
            <div style={{minHeight: 100, maxHeight:500, overflow:"auto", paddingRight:2, borderWidth:2, borderStyle:"solid", borderColor:"#ccc"}}>
              {this._createAssetTypeTable()}
            </div>
          </Collapse>
          <div style={{paddingTop:5, paddingBottom:5}} onClick={()=>{this.toggleExpandFieldBlock();}}>{(this.state.expandFields)?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />} Fields:</div>
          <Collapse isOpen={this.state.expandFields}>
          <div style={{minHeight: 100, maxHeight:500, overflowY:"auto", borderWidth:2, borderStyle:"solid", borderColor:"#ccc"}}>
              <Table hover>
                <thead>
                <tr>
                  <th style={{fontSize:"small", fontWeight:"bold"}}>Field Name</th>
                  <th style={{fontSize:"small", fontWeight:"bold"}}>Domain</th>
                  <th style={{fontSize:"small", fontWeight:"bold"}}>Default Value</th>
                </tr>
                </thead>
                <tbody>
                  {this._createFieldList()}
                </tbody>
              </Table>
          </div>
          </Collapse>
          <div style={{paddingTop:5, paddingBottom:5}} onClick={()=>{this.toggleExpandAR()}}>{(this.state.expandAR)?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />} Attributes Rules:</div>
          <Collapse isOpen={this.state.expandAR}>
            <div style={{minHeight: 100, maxHeight:500, overflow:"auto", paddingRight:2, borderWidth:2, borderStyle:"solid", borderColor:"#ccc"}}>
              {this._createARTable()}
            </div>
          </Collapse>
          <div style={{paddingTop:5, paddingBottom:5}} onClick={()=>{this.toggleExpandCAV()}}>{(this.state.expandCAV)?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />} Contingent Attribute Values:</div>
          <Collapse isOpen={this.state.expandCAV}>
            <div style={{minHeight: 100, maxHeight:500, overflow:"auto", paddingRight:2, borderWidth:2, borderStyle:"solid", borderColor:"#ccc"}}>
              <CAVWorkSpace data={this.props.data} domains={this.props.domains} requestURL={this.props.requestURL} fieldGroups={this.props.data.fieldGroups}></CAVWorkSpace>
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
        <TabPane tabId="Diagrams">
          <div style={{width: "100%", paddingLeft:10, paddingRight:10}}>
            <div><h4>Others (WIP)</h4></div>
            <div style={{width: "100%", overflowX:"auto"}}>

            </div>
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
        let desc = this._retrieveATDesc();
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
                      <td style={{fontSize:"small"}}>{d.name}</td>
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

      return(<Table hover>
        <thead>
        <tr>
          <th style={{fontSize:"small", fontWeight:"bold"}}>Name</th>
          <th style={{fontSize:"small", fontWeight:"bold"}}>Code</th>
          <th style={{fontSize:"small", fontWeight:"bold"}}>Description</th>
        </tr>
        </thead>
        <tbody>
          {_createATList()}
        </tbody>
      </Table>);
  }

  _createFieldList = () => {
    let arrList = [];
    let usedFields = [];
    this.state.validFields.map((fi: any, i: number)=>{
      if(fi.fieldName !== "shape") {
        let domainTable = this._createDomainExpand(fi.domainName);
        let fieldDetailsTable = this._createFieldsExpand(fi.fieldName);
        let domain = this._matchDomain(fi.domainName);
        let fieldAlias = this._matchField(fi.fieldName);
        let defaultVal = fi.defaultValue;
        let fieldName = fi.fieldName;
        usedFields.push(fieldName);
        if(fieldAlias.length > 0) {
          let alias = fieldAlias[0].aliasName;
          if(alias.indexOf(":") > -1) {
            //alias = alias.substring(0,alias.indexOf(":"));
            alias = this._handleAliasBrackets(alias, fi.fieldName);
          }
          fieldName = <span><div style={{textAlign: "left"}}>{(this.state.fieldHolder[fi.fieldName])?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />} {alias}</div><div style={{textAlign: "left"}}>{"("+fi.fieldName+")"}</div></span>;
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
        arrList.push(<tr key={i}><td style={{fontSize:"small", textAlign: "left", verticalAlign: "top"}}>
        <div onClick={()=>{this.props.callbackLinkage(fi.fieldName,"Field", this.props.panel)}} style={{display:"inline-block", verticalAlign: "top", paddingRight:5}}><Icon icon={linkIcon} size='12' color='#333' /></div>
        <div style={{fontSize:"small", display:"inline-block", verticalAlign: "top"}} onClick={()=>{
          this.toggleFields(fi.fieldName);
        }}>{fieldName}
        </div>
        <Collapse isOpen={this.state.fieldHolder[fi.fieldName]}>
          {(fieldDetailsTable !== null)? fieldDetailsTable: ""}
        </Collapse>
        </td>
        <td style={{fontSize:"small"}}>
        <div onClick={()=>{this.props.callbackLinkage(fi.domainName,"Domain", this.props.panel)}} style={{display:"inline-block", verticalAlign: "top", paddingRight:5}}>{(fi.domainName !== "")?<Icon icon={linkIcon} size='12' color='#333' />:''}</div>
          <div style={{fontSize:"small", display:"inline-block", verticalAlign: "top"}} onClick={()=>{
            this.toggleDomains(fi.domainName);
          }}>{(fi.domainName !== "")?(this.state.domainHolder[fi.domainName])?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />:""} {fi.domainName}</div>
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
            <td style={{fontSize:"small"}}>{v}</td>
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
            <td style={{fontSize:"small"}}><div onClick={()=>{this.props.callbackLinkage(ar.name,"AttributeRule", this.props.panel)}}><Icon icon={linkIcon} size='12' color='#333' /> {ar.name}</div></td>
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
    let metadata = this.state.metadataElements;
    let metaLevel = metadata.getElementsByTagName("metadata");
    let fieldLevel = metaLevel[0].getElementsByTagName("eainfo");
    if(fieldLevel.length > 0) {
      let attrLevel = fieldLevel[0].getElementsByTagName("attr");
      if(attrLevel.length > 0) {
        for (let i=0; i < attrLevel.length; i++) {
          if(attrLevel[i].getElementsByTagName("attrlabl")[0].innerHTML === "assetgroup") {
            let attrDomv = attrLevel[i].getElementsByTagName("attrdomv");
            for (let a=0; a < attrDomv.length; a++) {
              let edom = attrDomv[a].getElementsByTagName("edom");
              let udom = attrDomv[a].getElementsByTagName("udom");
              if(edom.length > 0) {
                for (let b=0; b < edom.length; b++) {
                  if(parseInt(edom[b].getElementsByTagName("edomv")[0].innerHTML) === parseInt(this.state.nodeData.subtypeCode)) {
                    description = edom[b].getElementsByTagName("edomvds")[0].innerHTML;
                  }
                }
              }
              if(udom.length > 0) {
                let fieldText = udom[0].innerHTML;
                let textArray = fieldText.split(";");
                textArray.map((t:any)=> {
                  let stList = t.split(":");
                  if(parseInt(stList[0]) === parseInt(this.state.nodeData.subtypeCode)) {
                    fieldFilter = stList[1].split(",");
                  }
                })
              }
            }
          }
        }
      }
    }
    this.setState({description:description, validFieldsChecker:fieldFilter});
  }

  _retrieveATDesc =() => {
    let description = [];
    if(this.state.metadataElements !== null){
      let metadata = this.state.metadataElements;
      let metaLevel = metadata.getElementsByTagName("metadata");
      let fieldLevel = metaLevel[0].getElementsByTagName("eainfo");
      if(fieldLevel.length > 0) {
        let attrLevel = fieldLevel[0].getElementsByTagName("attr");
        if(attrLevel.length > 0) {
          for (let i=0; i < attrLevel.length; i++) {
            if(attrLevel[i].getElementsByTagName("attrlabl")[0].innerHTML === "assettype") {
              let attrDomv = attrLevel[i].getElementsByTagName("attrdomv");
              for (let a=0; a < attrDomv.length; a++) {
                let edom = attrDomv[a].getElementsByTagName("edom");
                if(edom.length > 0) {
                  for (let b=0; b < edom.length; b++) {
                    if(parseInt(edom[b].getElementsByTagName("edomvds")[0].innerHTML) === parseInt(this.state.nodeData.subtypeCode)) {
                      let desc = edom[b].getElementsByTagName("edomvd")[0].innerHTML;
                      let code = edom[b].getElementsByTagName("edomv")[0].innerHTML;
                      description.push({
                        description: desc,
                        code: code
                      });
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    return description;
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
