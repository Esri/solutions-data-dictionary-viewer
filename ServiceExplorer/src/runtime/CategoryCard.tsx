/** @jsx jsx */
import {React, defaultMessages as jimuCoreDefaultMessage} from 'jimu-core';
import {jsx} from 'jimu-core';
import {IMConfig} from '../config';

import {Icon, Collapse, Table} from 'jimu-ui';
import {TabContent, TabPane} from 'reactstrap';
import CardHeader from './_header';
import './css/custom.css';
import { arr } from '@interactjs/utils';
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
  expandActive: boolean,
  expandAT: any,
  minimizedDetails: boolean
}

export default class CategoryCard extends React.Component <IProps, IState> {
  constructor(props: IProps){
    super(props);

    this.state = {
      nodeData: this.props.data.data,
      activeTab: 'Properties',
      expandActive: false,
      expandAT: {},
      minimizedDetails: false
    };

  }

  componentWillMount() {
    let atCopy = {...this.state.expandAT};
    let dn = this._findUN();
    if(dn !== null) {
      dn.map((d: any, i: number) => {
        d.junctionSources.map((js:any) => {
          js.assetGroups.map((ag:any) => {
            atCopy[ag.assetGroupName] = false;
          });
        });
      });
    }
    this.setState({expandAT: atCopy});
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
            <div style={{paddingTop:5, paddingBottom:5}}><span style={{fontWeight:"bold"}}>Name:</span> {this.state.nodeData.name}</div>
            <div style={{paddingTop:5, paddingBottom:5, cursor:"pointer"}} onClick={()=>{this.toggleActiveCat()}}>{(this.state.expandActive)?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />} <span style={{fontWeight:"bold"}}>Category used in</span></div>
            <Collapse isOpen={this.state.expandActive}>
              <div style={{minHeight: 100, maxHeight:500, overflow:"auto", paddingRight:2, borderWidth:2, borderStyle:"solid", borderColor:"#ccc"}}>
                {(this._findUN() !== null)?this._createActiveTable():"No domains exist"}
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
  toggleActiveCat =() => {
    if(this.state.expandActive) {
      this.setState({expandActive: false});
    } else {
      this.setState({expandActive: true});
    }
  }

  toggleActiveATList =(name:string) => {
    let atCopy = {...this.state.expandAT};
    if(atCopy[name] === false) {
      atCopy[name] = true;
      this.setState({expandAT: atCopy});
    } else {
      atCopy[name] = false;
      this.setState({expandAT: atCopy});
    }
  }

  _createActiveTable =() => {
    let arrList = [];
    let dn = this._findUN();
    if(dn !== null) {
      dn.map((d: any, i: number) => {
        d.junctionSources.map((js:any) => {
          js.assetGroups.map((ag:any) => {
            let atTable = this._createAssetTypeTable(ag.assetTypes, ag.assetGroupName, this._layerLookup(js.layerId));
            if(atTable !== null) {
              arrList.push(
                <tr key={i}>
                  <td style={{fontSize:"small", cursor:"pointer"}}><span  onClick={()=>{this.props.callbackLinkage(this._layerLookup(js.layerId), "Layer", this.props.panel)}}><Icon icon={linkIcon} size='12' color='#333' /> {this._layerLookup(js.layerId)}</span></td>
                  <td style={{fontSize:"small", cursor:"pointer"}}><span  onClick={()=>{this.props.callbackLinkage(ag.assetGroupName, "Subtype", this.props.panel, this._layerLookup(js.layerId))}}><Icon icon={linkIcon} size='12' color='#333' /> </span>
                    <span style={{cursor:"pointer"}} onClick={()=>{this.toggleActiveATList(ag.assetGroupName)}}>{(this.state.expandAT[ag.assetGroupName])?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />} </span>
                   {ag.assetGroupName}
                   <Collapse isOpen={this.state.expandAT[ag.assetGroupName]}>
                    {atTable}
                  </Collapse>
                   </td>
                </tr>
              );
            }
          });
        });
      });
    }
    let tableObj = <Table hover>
    <thead>
    <tr>
      <th style={{fontSize:"small", fontWeight:"bold"}}>Layer</th>
      <th style={{fontSize:"small", fontWeight:"bold"}}>Asset Group</th>
    </tr>
    </thead>
    <tbody>
      {arrList}
    </tbody>
    </Table>
    return tableObj;
  }

  _createAssetTypeTable =(atList:any, ag:string, layerName:string) => {
    let arrList = [];
    let tableObj = null;
    atList.map((at:any,i:number) => {
      if(at.categories.indexOf(this.state.nodeData.name) > -1) {
        arrList.push(
          <tr key={i}>
            <td style={{fontSize:"small"}}><span  onClick={()=>{this.props.callbackLinkage(at.assetTypeName, "Assettype", this.props.panel, layerName, ag)}}><Icon icon={linkIcon} size='12' color='#333' /> </span>{at.assetTypeName}</td>
          </tr>
        );
      }
    });
    if(arrList.length > 0) {
      tableObj = <Table hover>
      <thead>
      <tr>
        <th style={{fontSize:"small", fontWeight:"bold"}}>Asset Type</th>
      </tr>
      </thead>
      <tbody>
        {arrList}
      </tbody>
      </Table>
    }
    return tableObj;
  }


  //*** SUPPORT FUNCTIONS *****/
  _findUN =() => {
    let dn = null;
    this.props.dataElements.map((de:any) => {
      if(de.hasOwnProperty("dataElement")) {
        if(de.dataElement.hasOwnProperty("domainNetworks")) {
          dn = de.dataElement.domainNetworks;
        }
      }
    });
    return dn;
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
