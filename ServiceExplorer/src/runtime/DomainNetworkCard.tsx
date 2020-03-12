/** @jsx jsx */
import {React, defaultMessages as jimuCoreDefaultMessage} from 'jimu-core';
import {jsx} from 'jimu-core';
import {IMConfig} from '../config';
import {Icon, Collapse, Table} from 'jimu-ui';
import {TabContent, TabPane} from 'reactstrap';
import CardHeader from './_header';
import './css/custom.css';
import esriLookup from './_constants';
let linkIcon = require('./assets/launch.svg');
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
  expandTiersValidDevice:any,
  expandTiersValidLine: any,
  expandTiersValidSubnetworkControllers: any,
  expandTiersAggregatedLines: any,
  expandJunctionSources: boolean,
  expandJunctionLayers: any,
  expandJunctionAG: any,
  expandJunctionAT: any,
  expandEdgeSources: boolean,
  expandEdgeLayers: any,
  expandEdgeAG: any,
  expandEdgeAT: any,
  minimizedDetails: boolean,
  esriValueList: any
}

export default class DomainNetworkCard extends React.Component <IProps, IState> {
  constructor(props: IProps){
    super(props);

    this.state = {
      nodeData: this.props.data.data,
      activeTab: 'Properties',
      expandTierGroup: false,
      expandTiers: {},
      expandTiersValidDevice: {},
      expandTiersValidLine: {},
      expandTiersValidSubnetworkControllers: {},
      expandTiersAggregatedLines: {},
      expandJunctionSources: false,
      expandJunctionLayers: {},
      expandJunctionAG: {},
      expandJunctionAT: {},
      expandEdgeSources: false,
      expandEdgeLayers: {},
      expandEdgeAG: {},
      expandEdgeAT: {},
      minimizedDetails: false,
      esriValueList: new esriLookup()
    };

  }

  componentWillMount() {
    let tiersCopy = {...this.state.expandTiers};
    let tiersVDCopy = {...this.state.expandTiersValidDevice};
    let tiersVLCopy = {...this.state.expandTiersValidLine};
    let tiersVSCCopy = {...this.state.expandTiersValidSubnetworkControllers};
    let tiersAGLCopy = {...this.state.expandTiersAggregatedLines};
    let junctionLayerCopy = {...this.state.expandJunctionLayers};
    let junctionAGCopy = {...this.state.expandJunctionAG};
    let junctionATCopy = {...this.state.expandJunctionAT};
    let edgeLayerCopy = {...this.state.expandEdgeLayers};
    let edgeAGCopy = {...this.state.expandEdgeAG};
    let edgeATCopy = {...this.state.expandEdgeAT};
    this.state.nodeData.tiers.map((t:any) => {
      tiersCopy[t.name] = "none";
      tiersVDCopy[t.name] = false;
      tiersVLCopy[t.name] = false;
      tiersVSCCopy[t.name] = false;
      tiersAGLCopy[t.name] = false;
    });
    this.state.nodeData.junctionSources.map((j:any) => {
      junctionLayerCopy[j.layerId] = "none";
      junctionAGCopy[j.layerId] = false;
      j.assetGroups.map((ag:any) => {
        junctionATCopy[ag.assetGroupName] = false;
      });
    });
    this.state.nodeData.edgeSources.map((j:any) => {
      edgeLayerCopy[j.layerId] = "none";
      edgeAGCopy[j.layerId] = false;
      j.assetGroups.map((ag:any) => {
        edgeATCopy[ag.assetGroupName] = false;
      });
    });
    this.setState({expandTiers:tiersCopy, expandTiersValidDevice: tiersVDCopy, expandTiersValidLine: tiersVLCopy, expandTiersValidSubnetworkControllers: tiersVSCCopy,
      expandTiersAggregatedLines: tiersAGLCopy, expandJunctionLayers: junctionLayerCopy, expandJunctionAG:junctionAGCopy, expandJunctionAT:junctionATCopy,
      expandEdgeLayers: edgeLayerCopy, expandEdgeAG: edgeAGCopy, expandEdgeAT: edgeATCopy
    });
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
          <div style={{paddingTop:5, paddingBottom:5}}><span style={{fontWeight:"bold"}}>Name:</span> {this.state.nodeData.domainNetworkAliasName}</div>
          <div style={{paddingTop:5, paddingBottom:5}}><span style={{fontWeight:"bold"}}>Field Name:</span> {this.state.nodeData.subnetworkLabelFieldName}</div>
          <div style={{paddingTop:5, paddingBottom:5}}><span style={{fontWeight:"bold"}}>Tier Definition:</span> {this.state.esriValueList.lookupValue(this.state.nodeData.tierDefinition)}</div>
          <div style={{paddingTop:5, paddingBottom:5, cursor:"pointer"}} onClick={()=>{this.toggleTierGroup()}}>{(this.state.expandTierGroup)?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />} <span style={{fontWeight:"bold"}}>Tiers</span></div>
          <Collapse isOpen={this.state.expandTierGroup}>
            <div style={{minHeight: 100, maxHeight:500, overflow:"auto", paddingRight:2, borderWidth:2, borderStyle:"solid", borderColor:"#ccc"}}>
              {(this.state.nodeData.tiers.length > 0)?this._createTiersTable():"No tiers exist"}
            </div>
          </Collapse>
          <div style={{paddingTop:5, paddingBottom:5, cursor:"pointer"}} onClick={()=>{this.toggleJunctionSources()}}>{(this.state.expandJunctionSources)?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />} <span style={{fontWeight:"bold"}}>Junction Sources</span></div>
          <Collapse isOpen={this.state.expandJunctionSources}>
            <div style={{minHeight: 100, maxHeight:500, overflow:"auto", paddingRight:2, borderWidth:2, borderStyle:"solid", borderColor:"#ccc"}}>
              {(this.state.nodeData.junctionSources.length > 0)?this._createJunctionSourceTable():"No junctions exist"}
            </div>
          </Collapse>
          <div style={{paddingTop:5, paddingBottom:5, cursor:"pointer"}} onClick={()=>{this.toggleEdgeSources()}}>{(this.state.expandEdgeSources)?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />} <span style={{fontWeight:"bold"}}>Edge Sources</span></div>
          <Collapse isOpen={this.state.expandEdgeSources}>
            <div style={{minHeight: 100, maxHeight:500, overflow:"auto", paddingRight:2, borderWidth:2, borderStyle:"solid", borderColor:"#ccc"}}>
              {(this.state.nodeData.edgeSources.length > 0)?this._createEdgeSourceTable():"No edges exist"}
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
        this.props.callbackLinkage(c.value, c.type, this.props.panel);
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
  toggleTierGroup =() => {
    if(this.state.expandTierGroup) {
      this.setState({expandTierGroup: false});
    } else {
      this.setState({expandTierGroup: true});
    }
  }
  toggleTiers =(name:string) => {
    let tierGroupCopy = {...this.state.expandTiers};
    if(tierGroupCopy[name] === "table-row") {
      tierGroupCopy[name] = "none";
      this.setState({expandTiers: tierGroupCopy}, () => {
        this.setState(this.state);
      });
    } else {
      tierGroupCopy[name] = "table-row";
      this.setState({expandTiers: tierGroupCopy}, () => {
        this.setState(this.state);
      });
    }
  }
  toggleTiersValidDevice =(name:string) => {
    let tierGroupCopy = {...this.state.expandTiersValidDevice};
    if(tierGroupCopy[name] === false) {
      tierGroupCopy[name] = true;
      this.setState({expandTiersValidDevice: tierGroupCopy});
    } else {
      tierGroupCopy[name] = false;
      this.setState({expandTiersValidDevice: tierGroupCopy});
    }
  }
  toggleTiersValidLine =(name:string) => {
    let tierGroupCopy = {...this.state.expandTiersValidLine};
    if(tierGroupCopy[name] === false) {
      tierGroupCopy[name] = true;
      this.setState({expandTiersValidLine: tierGroupCopy});
    } else {
      tierGroupCopy[name] = false;
      this.setState({expandTiersValidLine: tierGroupCopy});
    }
  }
  toggleTiersValidSubnetworkControllers =(name:string) => {
    let tierGroupCopy = {...this.state.expandTiersValidSubnetworkControllers};
    if(tierGroupCopy[name] === false) {
      tierGroupCopy[name] = true;
      this.setState({expandTiersValidSubnetworkControllers: tierGroupCopy});
    } else {
      tierGroupCopy[name] = false;
      this.setState({expandTiersValidSubnetworkControllers: tierGroupCopy});
    }
  }
  toggleTiersAggregatedLines =(name:string) => {
    let tierGroupCopy = {...this.state.expandTiersAggregatedLines};
    if(tierGroupCopy[name] === false) {
      tierGroupCopy[name] = true;
      this.setState({expandTiersAggregatedLines: tierGroupCopy});
    } else {
      tierGroupCopy[name] = false;
      this.setState({expandTiersAggregatedLines: tierGroupCopy});
    }
  }
  toggleJunctionSources =() => {
    if(this.state.expandJunctionSources) {
      this.setState({expandJunctionSources: false});
    } else {
      this.setState({expandJunctionSources: true});
    }
  }
  toggleValidJunctions =(name:string) => {
    let junctionLayerCopy = {...this.state.expandJunctionLayers};
    if(junctionLayerCopy[name] === "none") {
      junctionLayerCopy[name] = "table-row";
      this.setState({expandJunctionLayers: junctionLayerCopy});
    } else {
      junctionLayerCopy[name] = "none";
      this.setState({expandJunctionLayers: junctionLayerCopy});
    }
  }
  toggleValidEdges =(name:string) => {
    let edgeLayerCopy = {...this.state.expandEdgeLayers};
    if(edgeLayerCopy[name] === "none") {
      edgeLayerCopy[name] = "table-row";
      this.setState({expandEdgeLayers: edgeLayerCopy});
    } else {
      edgeLayerCopy[name] = "none";
      this.setState({expandEdgeLayers: edgeLayerCopy});
    }
  }
  toggleValidEdgesAT =(name:string) => {
    let edgeLayerCopy = {...this.state.expandEdgeAT};
    if(edgeLayerCopy[name] === false) {
      edgeLayerCopy[name] = true;
      this.setState({expandEdgeAT: edgeLayerCopy});
    } else {
      edgeLayerCopy[name] = false;
      this.setState({expandEdgeAT: edgeLayerCopy});
    }
  }
  toggleValidJunctionsAT =(name:string) => {
    let junctionLayerCopy = {...this.state.expandJunctionAT};
    if(junctionLayerCopy[name] === false) {
      junctionLayerCopy[name] = true;
      this.setState({expandJunctionAT: junctionLayerCopy});
    } else {
      junctionLayerCopy[name] = false;
      this.setState({expandJunctionAT: junctionLayerCopy});
    }
  }
  toggleEdgeSources =() => {
    if(this.state.expandEdgeSources) {
      this.setState({expandEdgeSources: false});
    } else {
      this.setState({expandEdgeSources: true});
    }
  }

  _createTiersTable =() => {
    let arrList = [];
    this.state.nodeData.tiers.map((ft: any, i: number) => {
      arrList.push(
        <tr key={i}>
          <td style={{fontSize:"small"}}>
          <div style={{cursor:"pointer"}} onClick={()=>{this.toggleTiers(ft.name)}}>{(this.state.expandTiers[ft.name]==="table-row")?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />} {ft.name}</div>
          </td>
          <td style={{fontSize:"small"}}>{ft.tierGroupName}</td>
          <td style={{fontSize:"small"}}>{ft.rank}</td>
          <td style={{fontSize:"small"}}>{ft.subnetworkFieldName}</td>
          <td style={{fontSize:"small"}}>{this.state.esriValueList.lookupValue(ft.tierTopology)}</td>
        </tr>
      );
      arrList.push(
        <tr key={i+"_hidden"} style={{display:this.state.expandTiers[ft.name]}}>
          <td colSpan={5} style={{fontSize:"small", paddingLeft:50}} >
            <div style={{cursor:"pointer"}} onClick={()=>{this.toggleTiersValidDevice(ft.name)}}>{(this.state.expandTiersValidDevice[ft.name])?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />} Valid Devices</div>
            <Collapse isOpen={this.state.expandTiersValidDevice[ft.name]}>
            <div>{this._createValidAssetsTable(ft.validDevices, "Device", "junction")}</div>
            </Collapse>
            <div style={{cursor:"pointer"}} onClick={()=>{this.toggleTiersValidLine(ft.name)}} style={{paddingTop:10}}>{(this.state.expandTiersValidLine[ft.name])?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />} Valid Lines</div>
            <Collapse isOpen={this.state.expandTiersValidLine[ft.name]}>
            <div>{this._createValidAssetsTable(ft.validLines, "Line", "edge")}</div>
            </Collapse>
            <div style={{cursor:"pointer"}} onClick={()=>{this.toggleTiersValidSubnetworkControllers(ft.name)}} style={{paddingTop:10}}>{(this.state.expandTiersValidSubnetworkControllers[ft.name])?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />} Valid Subnetwork Controllers</div>
            <Collapse isOpen={this.state.expandTiersValidSubnetworkControllers[ft.name]}>
            <div>{this._createValidAssetsTable(ft.validSubnetworkControllers, "Device", "junction")}</div>
            </Collapse>
            <div style={{cursor:"pointer"}} onClick={()=>{this.toggleTiersAggregatedLines(ft.name)}} style={{paddingTop:10}}>{(this.state.expandTiersAggregatedLines[ft.name])?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />} Aggregated Lines for Subnetwork</div>
            <Collapse isOpen={this.state.expandTiersAggregatedLines[ft.name]}>
            <div>{this._createValidAssetsTable(ft.aggregatedLinesForSubnetLine, "Line", "edge")}</div>
            </Collapse>
          </td>
        </tr>
      );
    });
    let tableObj = <Table hover>
    <thead>
    <tr>
      <th style={{fontSize:"small", fontWeight:"bold"}}>Name</th>
      <th style={{fontSize:"small", fontWeight:"bold"}}>Group</th>
      <th style={{fontSize:"small", fontWeight:"bold"}}>Rank</th>
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
    let atList =(d:any, domainName:string, subtype:string) => {
      let list = [];
      d.assetTypes.map((at: any, z: number) => {
        let validAT = this._ATCodeLookup(at.assetTypeCode, domainName);
        list.push(<div key={at.assetTypeCode+"_"+z}>
        <div style={{cursor:"pointer"}} onClick={()=>{this.props.callbackLinkage(validAT,"Assettype", this.props.panel, this.state.nodeData.domainNetworkAliasName+" "+type, subtype)}} style={{display:"inline-block", verticalAlign: "top", paddingRight:5, cursor:"pointer"}}><Icon icon={linkIcon} size='12' color='#333' />{validAT}</div>
        </div>);
      });
      return list;
    };
    asset.map((d: any, i: number) => {
      let validAsset = this._AGCodeLookup(d.assetGroupCode, source, type);
      arrList.push(
        <tr key={i}>
          <td style={{fontSize:"small"}}>
          <div style={{cursor:"pointer"}} onClick={()=>{this.props.callbackLinkage(validAsset.ag,"Subtype", this.props.panel, this.state.nodeData.domainNetworkAliasName+" "+type)}} style={{display:"inline-block", verticalAlign: "top", paddingRight:5, cursor:"pointer"}}><Icon icon={linkIcon} size='12' color='#333' /> {validAsset.ag}</div>
          </td>
          <td style={{fontSize:"small"}}>{atList(d, validAsset.ATDomain, validAsset.ag)}</td>
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

  _createJunctionSourceTable =() => {
    let arrList = [];
    let validAG =(j:any, layerName:string) => {
      let collection = [];
      j.assetGroups.map((ag:any, z: number) => {
        let ATList = [];
        ag.assetTypes.map((at:any, a: number) => {
          let catList = [];
          at.categories.map((c:any, b: number) => {
            catList.push(
              <div id={b+"_c"}><span style={{cursor:"pointer"}} onClick={()=>{this.props.callbackLinkage(c, "Category", this.props.panel)}}><Icon icon={linkIcon} size='12' color='#333' /> {c}</span></div>
            );
          });
          ATList.push(<tr id={a+"_at"}>
            <td><span style={{cursor:"pointer"}} onClick={()=>{this.props.callbackLinkage(at.assetTypeName, "Assettype", this.props.panel, layerName, ag.assetGroupName)}}><Icon icon={linkIcon} size='12' color='#333' />{at.assetTypeName}</span></td>
            <td>{catList}</td>
          </tr>);
        });

        collection.push(<tr id={z+"_junction"}>
          <td><span style={{cursor:"pointer"}} onClick={()=>{this.props.callbackLinkage(ag.assetGroupName, "Subtype", this.props.panel, layerName)}}><Icon icon={linkIcon} size='12' color='#333' /> {ag.assetGroupName}</span></td>
          <td>
          <div style={{cursor:"pointer"}} onClick={()=>{this.toggleValidJunctionsAT(ag.assetGroupName)}}>{(this.state.expandJunctionAT[ag.assetGroupName])?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />} Asset Types</div>
          <Collapse isOpen={this.state.expandJunctionAT[ag.assetGroupName]}>
            <table>
              <tr>
                <th>Name</th>
                <th>Category</th>
              </tr>
              {ATList}
            </table>
          </Collapse>
          </td>
        </tr>);
      });
      return collection;
    }
    this.state.nodeData.junctionSources.map((j: any, i: number) => {
      arrList.push(
        <tr key={i}>
          <td style={{fontSize:"small"}}>
          <span style={{cursor:"pointer"}} onClick={()=>{this.props.callbackLinkage(this._layerLookup(j.layerId), "Layer", this.props.panel)}}><Icon icon={linkIcon} size='12' color='#333' /> </span>
          <span style={{cursor:"pointer"}} onClick={()=>{this.toggleValidJunctions(j.layerId)}}>{(this.state.expandJunctionLayers[j.layerId]==="table-row")?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />} {this._layerLookup(j.layerId)}</span>
          </td>
        </tr>
      );
      arrList.push(
        <tr key={i+"_hidden"} style={{display:this.state.expandJunctionLayers[j.layerId]}}>
          <td colSpan={5} style={{fontSize:"small", paddingLeft:50}} >
            <table>
              <tr>
                <th>Asset Group</th>
                <th>Asset Type</th>
              </tr>
              {validAG(j, this._layerLookup(j.layerId))}
            </table>
          </td>
        </tr>
      );
    });
    let tableObj = <Table hover>
    <thead>
    <tr>
      <th style={{fontSize:"small", fontWeight:"bold"}}>Layer</th>
    </tr>
    </thead>
    <tbody>
      {arrList}
    </tbody>
    </Table>
    return tableObj;
  }

  _createEdgeSourceTable =() => {
    let arrList = [];
    let validAG =(j:any, layerName:string) => {
      let collection = [];
      j.assetGroups.map((ag:any, z: number) => {
        let ATList = [];
        ag.assetTypes.map((at:any, a: number) => {
          let catList = [];
          at.categories.map((c:any, b: number) => {
            catList.push(
              <div id={b+"_c"}><span style={{cursor:"pointer"}} onClick={()=>{this.props.callbackLinkage(c, "Category", this.props.panel)}}><Icon icon={linkIcon} size='12' color='#333' /> {c}</span></div>
            );
          });
          ATList.push(<tr id={a+"_at"}>
            <td><span style={{cursor:"pointer"}} onClick={()=>{this.props.callbackLinkage(at.assetTypeName, "Assettype", this.props.panel, layerName, ag.assetGroupName)}}><Icon icon={linkIcon} size='12' color='#333' />{at.assetTypeName}</span></td>
            <td>{catList}</td>
          </tr>);
        });

        collection.push(<tr id={z+"_junction"}>
          <td><span style={{cursor:"pointer"}} onClick={()=>{this.props.callbackLinkage(ag.assetGroupName, "Subtype", this.props.panel, layerName)}}><Icon icon={linkIcon} size='12' color='#333' /> {ag.assetGroupName}</span></td>
          <td>
          <div style={{cursor:"pointer"}} onClick={()=>{this.toggleValidEdgesAT(ag.assetGroupName)}}>{(this.state.expandEdgeAT[ag.assetGroupName])?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />} Asset Types</div>
          <Collapse isOpen={this.state.expandEdgeAT[ag.assetGroupName]}>
            <table>
              <tr>
                <th>Name</th>
                <th>Category</th>
              </tr>
              {ATList}
            </table>
          </Collapse>
          </td>
        </tr>);
      });
      return collection;
    }
    this.state.nodeData.edgeSources.map((j: any, i: number) => {
      arrList.push(
        <tr key={i}>
          <td style={{fontSize:"small"}}>
          <span style={{cursor:"pointer"}} onClick={()=>{this.props.callbackLinkage(this._layerLookup(j.layerId), "Layer", this.props.panel)}}><Icon icon={linkIcon} size='12' color='#333' /> </span>
          <span style={{cursor:"pointer"}} onClick={()=>{this.toggleValidEdges(j.layerId)}}>{(this.state.expandEdgeLayers[j.layerId]==="table-row")?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />} {this._layerLookup(j.layerId)}</span>
          </td>
        </tr>
      );
      arrList.push(
        <tr key={i+"_hidden"} style={{display:this.state.expandEdgeLayers[j.layerId]}}>
          <td colSpan={5} style={{fontSize:"small", paddingLeft:50}} >
            <table>
              <tr>
                <th>Asset Group</th>
                <th>Asset Type</th>
              </tr>
              {validAG(j, this._layerLookup(j.layerId))}
            </table>
          </td>
        </tr>
      );
    });
    let tableObj = <Table hover>
    <thead>
    <tr>
      <th style={{fontSize:"small", fontWeight:"bold"}}>Layer</th>
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
  _layerLookup = (param: any) => {
    let layerName = param;
    let filtered = this.props.dataElements.filter((de: any) => {
      return de.layerId === param;
    });
    if(filtered.length > 0) {
      layerName = filtered[0].dataElement.aliasName
    }
    return layerName;
  }


}
