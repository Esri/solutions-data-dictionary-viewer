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
  domains: any,
  requestURL: string,
  key: any,
  panel:number,
  config: any,
  dataElements: any,
  cacheData: any,
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
  expandDomain: boolean,
  minimizedDetails: boolean
  esriValueList: any,
  metadataElements: any,
  subtypeList: any,
  expandAlias: any,
  ARList: any;
  fieldDescriptions: any;
}

export default class FieldCard extends React.Component <IProps, IState> {
  constructor(props: IProps){
    super(props);

    this.state = {
      nodeData: JSON.parse(JSON.stringify(this.props.data.data)),
      siteStats: {},
      statsOutput: [],
      activeTab: 'Properties',
      domainHolder: [],
      fieldNameHolder: {},
      fieldHolder: [],
      expandFields: false,
      expandCAV: false,
      expandAR: false,
      expandDomain: false,
      minimizedDetails: false,
      esriValueList: new esriLookup(),
      metadataElements: null,
      subtypeList: [],
      expandAlias: [],
      ARList: [],
      fieldDescriptions: []
    };

  }

  componentWillMount() {
    let cleanAlais = {...this.state.nodeData};
      if(cleanAlais.hasOwnProperty("aliasName")) {
        cleanAlais.aliasName = (cleanAlais.aliasName.substring((cleanAlais.aliasName.indexOf(":") + 1),cleanAlais.aliasName.length)).split(",");
        for(let z=0; z < cleanAlais.aliasName.length; z++) {
          cleanAlais.aliasName[z] = cleanAlais.aliasName[z].trim();
        }
      } else {
        cleanAlais.alias = (cleanAlais.alias.substring((cleanAlais.alias.indexOf(":") + 1),cleanAlais.alias.length)).split(",");
        for(let z=0; z < cleanAlais.alias.length; z++) {
          cleanAlais.alias[z] = cleanAlais.alias[z].trim();
        }
      }
    this.setState({nodeData: cleanAlais}, () => {
      this._fillExpandState();
      let filtered = this.props.domains.map((d:any) => {
        return d.name === this.props.data.text;
      });
      if(filtered.length > 0) {
        this.setState({domainHolder:filtered});
      }
      this._requestMetadata().then(()=> {
        this.setState({nodeData: cleanAlais}, () => {
          this._processMetaData();

          this._checkARuse(this.props.data.parentId);
        });
      });
    });

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
        showStatistics={true}
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
           {
            (this.state.nodeData.hasOwnProperty("aliasName"))?
              (this.state.nodeData.aliasName.length > 1)?
                <div style={{paddingTop:5, paddingBottom:5}}>
                  <div><span style={{fontWeight:"bold"}}>Alias</span></div>
                  {this._listAlias(this.state.nodeData.aliasName)}
                </div>
              :
                <div style={{paddingTop:5, paddingBottom:5}}><span style={{fontWeight:"bold"}}>Alias:</span> {this.state.nodeData.aliasName}</div>
            :
              (this.state.nodeData.alias.length > 1)?
                <div style={{paddingTop:5, paddingBottom:5}}>
                  <div><span style={{fontWeight:"bold"}}>Alias</span></div>
                  {this._listAlias(this.state.nodeData.alias)}
                </div>
              :
                <div style={{paddingTop:5, paddingBottom:5}}><span style={{fontWeight:"bold"}}>Alias:</span> {this.state.nodeData.alias}</div>
          }
          {
            (this.state.fieldDescriptions.hasOwnProperty(this.props.data.data.name))?
              <div style={{paddingTop:5, paddingBottom:5}}><span style={{fontWeight:"bold"}}>Description:</span> {this.state.fieldDescriptions[this.props.data.data.name]}</div>
              :""
            }
          {(this.props.data.data.hasOwnProperty("precision"))?<div style={{paddingTop:5, paddingBottom:5}}><span style={{fontWeight:"bold"}}>Model Name:</span> {this.props.data.data.modelName}</div>:""}
          {
            (this.props.data.data.hasOwnProperty("isNullable"))?
            <div style={{paddingTop:5, paddingBottom:5}}><span style={{fontWeight:"bold"}}>Allow Null:</span> {(this.props.data.data.isNullable)? "True" : "False"}</div>
            :
            <div style={{paddingTop:5, paddingBottom:5}}><span style={{fontWeight:"bold"}}>Allow Null:</span> {(this.props.data.data.nullable)? "True" : "False"}</div>
          }
          <div style={{paddingTop:5, paddingBottom:5}}><span style={{fontWeight:"bold"}}>Required:</span> {(this.props.data.data.hasOwnProperty("required"))? (this.props.data.data.required)? "True" : "False" : "False"}</div>
          <div style={{paddingTop:5, paddingBottom:5}}><span style={{fontWeight:"bold"}}>Default Value:</span> {(this.props.data.data.hasOwnProperty("defaultValue"))? this.props.data.data.defaultValve : ""}</div>
          <div style={{paddingTop:5, paddingBottom:5}}><span style={{fontWeight:"bold"}}>Type:</span> {this.state.esriValueList.lookupValue(this.props.data.data.type)}</div>
          <div style={{paddingTop:5, paddingBottom:5}}><span style={{fontWeight:"bold"}}>Length:</span> {this.props.data.data.length}</div>
          {(this.props.data.data.hasOwnProperty("precision"))?<div style={{paddingTop:5, paddingBottom:5}}><span style={{fontWeight:"bold"}}>Precision:</span> {this.props.data.data.precision}</div>:""}
          {(this.props.data.data.hasOwnProperty("scale"))?<div style={{paddingTop:5, paddingBottom:5}}><span style={{fontWeight:"bold"}}>Scale:</span> {this.props.data.data.scale}</div>:""}
          {
            (this.props.data.data.hasOwnProperty("domain"))?
              (this.props.data.data.domain !== null) &&
              <div style={{paddingTop:5, paddingBottom:5, cursor:"pointer"}} onClick={()=>{this.toggleDomain()}}>{(this.state.expandDomain)?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />} <span style={{fontWeight:"bold"}}>Domain:</span> {(this.props.data.data.domain !== null)?this.props.data.data.domain.domainName: "None"}</div>
            :<div style={{paddingTop:5, paddingBottom:5}}><span style={{fontWeight:"bold"}}>Domain:</span> {"None"}</div>
          }
          {
            (this.props.data.data.hasOwnProperty("domain"))?
              (this.props.data.data.domain !== null) && <Collapse isOpen={this.state.expandDomain}>
              <div style={{minHeight: 100, maxHeight:500, overflow:"auto", paddingRight:2, borderWidth:2, borderStyle:"solid", borderColor:"#ccc"}}>
                {this._createDomainExpand(this.props.data.data.domain)}
              </div>
              </Collapse>
            :""
          }

          {
            (this.state.ARList.length > 0)?
              <div style={{paddingTop:5, paddingBottom:5, cursor:"pointer"}} onClick={()=>{this.toggleAR()}}>{(this.state.expandAR)?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />} <span style={{fontWeight:"bold"}}>Some Attribute Rules, such as below, are using this field</span></div>
            :
              ""
          }
          {
            (this.state.ARList.length > 0)?
              <Collapse isOpen={this.state.expandAR}>
              <div style={{minHeight: 100, maxHeight:500, overflow:"auto", paddingRight:2, borderWidth:2, borderStyle:"solid", borderColor:"#ccc"}}>
                {this._createARExpand()}
              </div>
              </Collapse>
            :
              ""
          }
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
  toggleDomain =() => {
    if(this.state.expandDomain) {
      this.setState({expandDomain:false});
    } else {
      this.setState({expandDomain:true});
    }
  }

  toggleAR =() => {
    if(this.state.expandAR) {
      this.setState({expandAR:false});
    } else {
      this.setState({expandAR:true});
    }
  }

  _substAlias =(alias: string) => {
    let substitute = alias;
    if(substitute.indexOf("[") > -1) {

    }

    return substitute;
  }

  _createDomainExpand =(domain: any) => {
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

  _createARExpand =() => {
    let arTable = null;
    let vals = [];
    this.state.ARList.map((ar: any, z: number) =>{
      vals.push(
        <tr key={z}>
          <td style={{fontSize:"small"}}><span onClick={()=>{this.props.callbackLinkage(ar.name,"Attribute Rule", this.props.panel, this.props.data.parent)}} style={{cursor:"pointer"}}><Icon icon={linkIcon} size='12' color='#333' /></span> {ar.name}</td>
        </tr>
      );
    });

    arTable = <Table>
      <thead>
      <tr>
        <th style={{fontSize:"small", fontWeight:"bold"}}>Attribute Rule</th>
      </tr>
      </thead>
      <tbody>
        {vals}
      </tbody>
    </Table>;
    return arTable;
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

  _listAlias =(aliasList: any) => {
    let list = [];
    if(aliasList.length > 1) {
      aliasList.map((v:any, i:number) => {
        list.push(
          <div key={i}>
          <div style={{cursor:"pointer"}} onClick={()=>{this.toggleExpandAlias(v)}}>{(this._getExpandStatus(v))?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />} {v}</div>
            {
              (this._getExpandStatus(v))?
              <div style={{paddingLeft: "15px", paddingRight: "15px", paddingTop:"2px", paddingBottom:"10px"}}>{this._matchAliasandSubtype(v)}</div>
              :
              ""
            }
          </div>
        );
      });
    }
    return list;
  }

  _matchAliasandSubtype =(alias: string) => {
    let returnVal = "";
    let stList = [];
    this.state.subtypeList.map((st:any) => {
      let matchField = st.fields.filter((f:any) => {
        return (f.alias).trim() === (alias).trim();
      });
      if(matchField.length > 0) {
        stList.push(st.subtype);
      }
    });
    if(stList.length > 0) {
      if(stList.length > 1) {
        returnVal = "This alias is used in the following subtypes: " + (stList.join()).replace(/,/g, ", ");
      } else {
        returnVal = "This alias is used in the following subtype: " + (stList.join()).replace(/,/g, ", ");
      }
    } else {
      returnVal = "Sorry, this alias is not used";
    }
    return returnVal;
  }

  toggleExpandAlias =(alias: string) => {
    let newExpand = JSON.parse(JSON.stringify(this.state.expandAlias));
    newExpand.map((e:any) => {
      if(e.alias === alias) {
        if(e.expand) {
          e.expand = false;
        } else {
          e.expand = true;
        }
      }
    });
    this.setState({expandAlias: newExpand});
  }

  _getExpandStatus = (alias: string) => {
    let expandStatus = false;
    this.state.expandAlias.map((e:any) => {
      if(e.alias === alias) {
        expandStatus = e.expand;
      }
    });
    return expandStatus;
  }

  _fillExpandState =() => {
    let expand = [...this.state.expandAlias];
    let alias = null;
    if(this.state.nodeData.hasOwnProperty("aliasName")) {
      alias = this.state.nodeData.aliasName;
    } else {
      alias = this.state.nodeData.alias;
    }
    if(alias.length > 1) {
      alias.map((a: any, i: number) => {
        expand.push({
          alias: a,
          expand: false
        });
      });
    }
    this.setState({expandAlias: expand});
  }

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

  _processMetaData =() => {
    let subtypeList = [];
    let desc = [];
    let metadata = this.state.metadataElements;
    let metaLevel = metadata.getElementsByTagName("metadata");
    if(metaLevel.length > 0) {
      let eaInfoLevel = metaLevel[0].getElementsByTagName("eainfo");
      if(eaInfoLevel.length > 0) {
        let detailedLevel = eaInfoLevel[0].getElementsByTagName("detailed");
        if(detailedLevel.length > 0) {
          for (let i=0; i < detailedLevel.length; i++) {
            let enttyplLevel = detailedLevel[i].getElementsByTagName("enttypl");
            if(enttyplLevel.length > 0) {
              let fieldList = [];
              let attrLevel = detailedLevel[i].getElementsByTagName("attr");
              if(attrLevel.length > 0) {
                for (let a=0; a < attrLevel.length; a++) {
                  let attrlablLevel = attrLevel[a].getElementsByTagName("attrlabl");
                  let attaliasLevel = attrLevel[a].getElementsByTagName("attalias");
                  if(attaliasLevel.length > 0) {
                    fieldList.push({
                      "name": attrlablLevel[0].innerHTML,
                      "alias": attaliasLevel[0].innerHTML
                    });
                  }
                }
              }
              subtypeList.push(
                {
                  "subtype": enttyplLevel[0].innerHTML,
                  "fields": fieldList
                }
              );
            }
          }
        }
      }
    }
    let attrNode = metadata.getElementsByTagName("attr");
    if(attrNode.length > 0) {
      for(let i=0; i< attrNode.length; i++) {
        let fieldlabel = attrNode[i].getElementsByTagName("attrlabl");
        let fieldDesc = attrNode[i].getElementsByTagName("attrdef");
        if(fieldlabel.length > 0) {
          if(fieldDesc.length > 0) {
            desc[fieldlabel[0].innerHTML] = fieldDesc[0].innerHTML;
          }
        }
      }
    }
    this.setState({subtypeList: subtypeList, fieldDescriptions: desc});
  }


  _checkARuse =(layerId: any) => {
    let ARList = [];
    let filteredDE = this.props.dataElements.filter((de: any) => {
      return parseInt(de.layerId) === parseInt(layerId);
    });
    if(filteredDE.length > 0) {
      let searchArray = [
        "$feature."+this.props.data.data.name,
        "$originalFeature."+this.props.data.data.name,
        "[\"" + this.props.data.data.name + "\"]",
        "[\'" + this.props.data.data.name + "\']",
      ];
      let ar = filteredDE[0].dataElement.attributeRules;
      let usedAR = ar.filter((a:any) => {

        return (this._MultiwordSearch(a.scriptExpression, searchArray));
        //return (a.scriptExpression.indexOf("$feature."+this.props.data.data.name) > -1)
      });
      if(usedAR.length > 0) {
        ARList = usedAR;
      }
    }
    this.setState({ARList:ARList});
  }

  _MultiwordSearch =(stack: any, pin: any) =>{
    let returnVal = false;
    var a = stack.toLowerCase();

    for(var i=0; i< pin.length; i++){
        if (a.indexOf(pin[i].toLowerCase()) != -1){
          returnVal = true;
        }
    }

    return returnVal;
  }



}
