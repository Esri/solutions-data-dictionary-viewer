/** @jsx jsx */
import {React, defaultMessages as jimuCoreDefaultMessage} from 'jimu-core';
import {jsx} from 'jimu-core';
import {IMConfig} from '../config';

import { TabContent, TabPane, Icon, Collapse, Table} from 'jimu-ui';
import CardHeader from './_header';
let linkIcon = require('jimu-ui/lib/icons/tool-layer.svg');
let rightArrowIcon = require('jimu-ui/lib/icons/arrow-right.svg');
let downArrowIcon = require('jimu-ui/lib/icons/arrow-down.svg');

interface IProps {
  data: any,
  dataElements:any,
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
  activeTab: string,
  expandTierGroup: boolean,
  expandTiers: any,
  expandNetworkAttributes: boolean,
  expandTerminalConfigurations: boolean
}

export default class DomainNetworkCard extends React.Component <IProps, IState> {
  constructor(props: IProps){
    super(props);

    this.state = {
      nodeData: this.props.data.data,
      activeTab: 'Properties',
      expandTierGroup: false,
      expandTiers: {},
      expandNetworkAttributes: false,
      expandTerminalConfigurations: false
    };

  }

  componentWillMount() {
    console.log(this.props.data);
    console.log(this.props.dataElements);
    let tiersCopy = {...this.state.expandTiers};
    this.state.nodeData.tiers.map((t:any) => {
      tiersCopy[t] = false;
    });
    this.setState({expandTiers:tiersCopy});
  }

  componentDidMount() {
    //this._processData();
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
        <div><h5>{this.props.data.type} Properties</h5></div>
          <div style={{paddingTop:5, paddingBottom:5}}>Name: <span style={{fontWeight:"bold"}}>{this.state.nodeData.domainNetworkAliasName}</span></div>
          <div style={{paddingTop:5, paddingBottom:5}} onClick={()=>{this.toggleTierGroup()}}>{(this.state.expandTierGroup)?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />} Tiers:</div>
          <Collapse isOpen={this.state.expandTierGroup}>
            <div style={{minHeight: 100, maxHeight:500, overflow:"auto", paddingRight:2, borderWidth:2, borderStyle:"solid", borderColor:"#ccc"}}>
              {this._createTiersTable()}
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
  toggleTierGroup =() => {
    if(this.state.expandTierGroup) {
      this.setState({expandTierGroup: false});
    } else {
      this.setState({expandTierGroup: true});
    }
  }

  toggleTiers =(name:string) => {
    let tierGroupCopy = {...this.state.expandTiers}
    if(tierGroupCopy[name]) {
      tierGroupCopy[name] = false;
      this.setState({expandTiers: tierGroupCopy});
    } else {
      tierGroupCopy[name] = true;
      this.setState({expandTiers: tierGroupCopy});
    }
  }

  _createTiersTable =() => {
    let arrList = [];
    this.state.nodeData.tiers.map((ft: any, i: number) => {
      arrList.push(
        <tr key={i}>
          <td style={{fontSize:"small"}}>
          <div onClick={()=>{this.toggleTiers(ft.name)}}>{(this.state.expandTiers[ft.name])?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />} {ft.name}</div>
          </td>
          <td style={{fontSize:"small"}}>{ft.tierGroupName}</td>
          <td style={{fontSize:"small"}}>{ft.subnetworkFieldName}</td>
          <td style={{fontSize:"small"}}>{ft.tierTopology}</td>
        </tr>
      );
      arrList.push(
        <Collapse isOpen={this.state.expandTiers[ft.name]}>
        <tr>
          <td colSpan={4}>
          <div>{this._createTierDetailsTable(ft)}</div>
          </td>
        </tr>
        </Collapse>
      );
    });
    let tableObj = <Table hover>
    <thead>
    <tr>
      <th style={{fontSize:"small", fontWeight:"bold"}}>Name</th>
      <th style={{fontSize:"small", fontWeight:"bold"}}>Group</th>
      <th style={{fontSize:"small", fontWeight:"bold"}}>Subnetwork Field</th>
      <th style={{fontSize:"small", fontWeight:"bold"}}>Topology</th>
    </tr>
    </thead>
    <tbody>
      {arrList}
    </tbody>
    </Table>
    return tableObj;
  }

  _createTierDetailsTable =(tierInfo:any) => {
    let arrTables = [];
    if(tierInfo.validDevices.length > 0) {
        arrTables.push(this._createValidAssetsTable(tierInfo.validDevices, "Device", "junction"));
        arrTables.push(this._createValidAssetsTable(tierInfo.validLines, "Line", "edge"));
    }
    return arrTables;
  }

  _createValidAssetsTable =(asset:any, type:string, source:string) => {
    let arrList = [];
    let atList =(d:any, domainName:string) => {
      let list = [];
      d.assetTypes.map((at: any, z: number) => {
        let validAT = this._ATCodeLookup(at.assetTypeCode, domainName);
        list.push(<div key={at.assetTypeCode+"_"+z}>{validAT}</div>);
      });
      return list;
    };
    asset.map((d: any, i: number) => {
      let validAsset = this._AGCodeLookup(d.assetGroupCode, source, type);
      arrList.push(
        <tr key={i}>
          <td style={{fontSize:"small"}}>{validAsset.ag}</td>
          <td style={{fontSize:"small"}}>{atList(d, validAsset.ATDomain)}</td>
        </tr>
      );
    });

    let tableObj = <Table hover>
    <thead>
    <tr>
      <th style={{fontSize:"small", fontWeight:"bold"}}>Valid {type}</th>
      <th style={{fontSize:"small", fontWeight:"bold"}}>Type</th>
    </tr>
    </thead>
    <tbody>
      {arrList}
    </tbody>
    </Table>
    return tableObj;
  }


  //****** helper functions and request functions
  //********************************************
  _AGCodeLookup =(value:any, source:string, type:string) => {
    let alias = value;
    let layerMatch = -1;
    if(source === "junction") {
      let filteredJunc = this.state.nodeData.junctionSources.filter((js:any) => {
        return((js.utilityNetworkFeatureClassUsageType).indexOf(type) > -1);
      });
      if(filteredJunc.length > 0) {
        layerMatch = filteredJunc[0].layerId;
      }
    } else {
      //edge
      let filteredEdge = this.state.nodeData.edgeSources.filter((js:any) => {
        return((js.utilityNetworkFeatureClassUsageType).indexOf(type) > -1);
      });
      if(filteredEdge.length > 0) {
        layerMatch = filteredEdge[0].layerId;
      }
    }
    let filteredDE = this.props.dataElements.filter((de:any) => {
      return(de.layerId === layerMatch);
    });
    if(filteredDE.length > 0) {
      let match = filteredDE[0].dataElement.subtypes.filter((st:any) => {
        return st.subtypeCode === value;
      });
      if(match.length > 0) {
        let atField = match[0].fieldInfos.filter((fi:any) => {
          return(fi.fieldName === "assettype");
        });
        if(atField.length > 0) {
          alias = {ag: match[0].subtypeName, ATDomain:atField[0].domainName};
        } else {
          alias = {ag: match[0].subtypeName, ATDomain:""};
        }
      }
    }
    return alias;
  }

  _ATCodeLookup =(value:any, domainName:string) => {
    let alias = value;
    let domain = this._validAssetTypes(domainName);
    if(domain.length > 0) {
      let filteredDomain = domain[0].codedValues.filter((cv:any) => {
        return cv.code === value;
      });
      if(filteredDomain.length > 0) {
        alias = filteredDomain[0].name;
      }
    }
    return alias;
  }

  _validAssetTypes =(lookup: string) => {
    let domainVals = this.props.domains.filter((d:any)=> {
      return(d.name === lookup);
    });
    return domainVals;
  }

}
