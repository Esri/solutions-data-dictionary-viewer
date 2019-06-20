/** @jsx jsx */
import {React, defaultMessages as jimuCoreDefaultMessage} from 'jimu-core';
import {jsx} from 'jimu-core';
import {IMConfig} from '../config';

import { TabContent, TabPane, Icon, Collapse, Table} from 'jimu-ui';
import CardHeader from './_header';
import { arr } from '@interactjs/utils';
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
  expandActive: boolean,
  expandAT: any
}

export default class CategoryCard extends React.Component <IProps, IState> {
  constructor(props: IProps){
    super(props);

    this.state = {
      nodeData: this.props.data.data,
      activeTab: 'Properties',
      expandActive: false,
      expandAT: {}
    };

  }

  componentWillMount() {
    console.log(this.props.dataElements);
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
        showProperties={true}
        showStatistics={false}
        showResources={false}
      />
      <TabContent activeTab={this.state.activeTab}>
        <TabPane tabId="Properties">
        <div style={{width: "100%", paddingLeft:10, paddingRight:10, wordWrap: "break-word", whiteSpace: "normal" }}>
        <div><h5>{this.props.data.type} Properties</h5></div>
          <div style={{paddingTop:5, paddingBottom:5}}>Name: <span style={{fontWeight:"bold"}}>{this.state.nodeData.name}</span></div>
          <div style={{paddingTop:5, paddingBottom:5}} onClick={()=>{this.toggleActiveCat()}}>{(this.state.expandActive)?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />} Category used in:</div>
          <Collapse isOpen={this.state.expandActive}>
            <div style={{minHeight: 100, maxHeight:500, overflow:"auto", paddingRight:2, borderWidth:2, borderStyle:"solid", borderColor:"#ccc"}}>
              {(this._findUN() !== null)?this._createActiveTable():"No domains exist"}
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
      console.log(dn);
      dn.map((d: any, i: number) => {
        d.junctionSources.map((js:any) => {
          js.assetGroups.map((ag:any) => {
            let atTable = this._createAssetTypeTable(ag.assetTypes);
            if(atTable !== null) {
              arrList.push(
                <tr key={i}>
                  <td style={{fontSize:"small"}}><span  onClick={()=>{this.props.callbackLinkage(ag.assetGroupName, "Subtype", this.props.panel)}}><Icon icon={linkIcon} size='12' color='#333' /> </span>
                    <span onClick={()=>{this.toggleActiveATList(ag.assetGroupName)}}>{(this.state.expandAT[ag.assetGroupName])?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />} </span>
                   {ag.assetGroupName}
                   <Collapse isOpen={this.state.expandAT[ag.assetGroupName]}>
                    {atTable}
                  </Collapse>
                   </td>
                  <td style={{fontSize:"small"}}><span  onClick={()=>{this.props.callbackLinkage(this._layerLookup(js.layerId), "Layer", this.props.panel)}}><Icon icon={linkIcon} size='12' color='#333' /> {this._layerLookup(js.layerId)}</span></td>
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
      <th style={{fontSize:"small", fontWeight:"bold"}}>Asset Group</th>
      <th style={{fontSize:"small", fontWeight:"bold"}}>Layer</th>
    </tr>
    </thead>
    <tbody>
      {arrList}
    </tbody>
    </Table>
    return tableObj;
  }

  _createAssetTypeTable =(atList:any) => {
    let arrList = [];
    let tableObj = null;
    atList.map((at:any,i:number) => {
      if(at.categories.indexOf(this.state.nodeData.name) > -1) {
        arrList.push(
          <tr key={i}>
            <td style={{fontSize:"small"}}>{at.assetTypeName}</td>
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
