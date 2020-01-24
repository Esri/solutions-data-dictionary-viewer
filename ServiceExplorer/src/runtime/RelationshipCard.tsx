/** @jsx jsx */
import {React, defaultMessages as jimuCoreDefaultMessage} from 'jimu-core';
import {AllWidgetProps, css, jsx, styled} from 'jimu-core';
import {IMConfig} from '../config';

import { TabContent, TabPane, Icon, Table} from 'jimu-ui';
import CardHeader from './_header';
import './css/custom.css';
let linkIcon = require('jimu-ui/lib/icons/tool-layer.svg');

interface IProps {
  data: any,
  key: any,
  width: any,
  serviceElements: any,
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
  activeTab: string,
  nodeData: any,
}

export default class RelationshipCard extends React.Component <IProps, IState> {
  constructor(props: IProps){
    super(props);

    this.state = {
      activeTab: 'Properties',
      nodeData: this.props.data.data,
    };

  }

  componentWillMount() {
    //test
    console.log(this.state.nodeData);
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
            <div style={{paddingTop:5, paddingBottom:5, fontSize:"smaller"}}>{this.buildCrumb()}<span style={{fontWeight:"bold"}}>Properties</span></div>
            <div style={{paddingBottom: 15}}></div>
            <Table style={{width:"100%"}}>
              <tbody>
                <tr>
                  <td style={{fontWeight:"bold"}}>Cardinality: </td><td>{this._cardinalityLookup(this.state.nodeData.cardinality)}</td>
                  <td style={{fontWeight:"bold"}}>Type: </td><td>{(this.state.nodeData.composite)?"Composite":"Simple"}</td>
                </tr>
                <tr>
                  <td style={{fontWeight:"bold"}}>Origin Name: </td>
                  <td><div onClick={()=>{this.props.callbackLinkage(this._layerForLinkageLookup(this.state.nodeData.originLayerId),"Layer", this.props.panel)}} style={{display:"inline-block", verticalAlign: "top", paddingRight:5}}><Icon icon={linkIcon} size='12' color='#333' /></div> {this.state.nodeData.backwardPathLabel}</td>
                  <td style={{fontWeight:"bold"}}>Destination Name: </td>
                  <td><div onClick={()=>{this.props.callbackLinkage(this._layerForLinkageLookup(this.state.nodeData.destinationLayerId),"Table", this.props.panel)}} style={{display:"inline-block", verticalAlign: "top", paddingRight:5}}><Icon icon={linkIcon} size='12' color='#333' /></div> {this.state.nodeData.forwardPathLabel}</td>
                </tr>
                <tr>
                  <td style={{fontWeight:"bold"}}>Origin Primary Key: </td>
                  <td><div onClick={()=>{this.props.callbackLinkage(this.state.nodeData.originPrimaryKey,"Field", this.props.panel, this._layerForLinkageLookup(this.state.nodeData.originLayerId))}} style={{display:"inline-block", verticalAlign: "top", paddingRight:5}}><Icon icon={linkIcon} size='12' color='#333' /></div> {this.state.nodeData.originPrimaryKey}</td>
                  <td style={{fontWeight:"bold"}}>Origin Foreign Key: </td>
                  <td><div onClick={()=>{this.props.callbackLinkage(this.state.nodeData.originForeignKey,"Field", this.props.panel, this._layerForLinkageLookup(this.state.nodeData.destinationLayerId))}} style={{display:"inline-block", verticalAlign: "top", paddingRight:5}}><Icon icon={linkIcon} size='12' color='#333' /></div> {this.state.nodeData.originForeignKey}</td>
                </tr>
              </tbody>
            </Table>
            <div style={{paddingBottom: 15}}></div>
          </div>
        </TabPane>
      </TabContent>
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

  //****** helper functions and request functions
  //********************************************
  _cardinalityLookup =(code: string) => {
    let possible = {
      "esriRelCardinalityOneToMany": "One to many",
      "esriRelCardinalityOneToOne": "One to one",
      "esriRelCardinalityManyToMany": "Many to many",
    };
    if(possible.hasOwnProperty(code)) {
      return possible[code];
    } else {
      return code;
    }
  }

  _layerForLinkageLookup =(layerId:number) => {
    let foundLayer = "";
    let filterSETables = this.props.serviceElements.tables.filter((se:any) => {
      return(se.id === layerId);
    });
    if(filterSETables.length > 0) {
      foundLayer = filterSETables[0].name;
    } else {
      //if it's not a table, see if it's a lyer
      let filterSELayers = this.props.serviceElements.layers.filter((se:any) => {
        return(se.id === layerId);
      });
      if(filterSELayers.length > 0) {
        foundLayer = filterSELayers[0].name;
      }
    }
    return foundLayer;
  }

}
