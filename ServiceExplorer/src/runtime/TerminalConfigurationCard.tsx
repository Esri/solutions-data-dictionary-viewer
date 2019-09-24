/** @jsx jsx */
import {React, defaultMessages as jimuCoreDefaultMessage} from 'jimu-core';
import {jsx} from 'jimu-core';
import {IMConfig} from '../config';

import { TabContent, TabPane, Icon, Collapse, Table} from 'jimu-ui';
import CardHeader from './_header';
import './css/custom.css';
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
  expandTerminal: boolean
}

export default class TerminalConfigurationCard extends React.Component <IProps, IState> {
  constructor(props: IProps){
    super(props);

    this.state = {
      nodeData: this.props.data.data,
      activeTab: 'Properties',
      expandTerminal: false
    };

  }

  componentWillMount() {
    console.log(this.props.dataElements);
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
          <div style={{paddingTop:5, paddingBottom:5}}>Name: <span style={{fontWeight:"bold"}}>{this.state.nodeData.terminalConfigurationName}</span></div>
          <div style={{paddingTop:5, paddingBottom:5}}>Default Configuration: <span style={{fontWeight:"bold"}}>{this.state.nodeData.defaultConfiguration}</span></div>
          <div style={{paddingTop:5, paddingBottom:5}}>Traversability: <span style={{fontWeight:"bold"}}>{this.state.nodeData.traversabilityModel}</span></div>
          <div style={{paddingTop:5, paddingBottom:5}} onClick={()=>{this.toggleTerminals()}}>{(this.state.expandTerminal)?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />} Terminals:</div>
          <Collapse isOpen={this.state.expandTerminal}>
            <div style={{minHeight: 100, maxHeight:500, overflow:"auto", paddingRight:2, borderWidth:2, borderStyle:"solid", borderColor:"#ccc"}}>
              {(this.state.nodeData.terminals.length > 0)?this._createTerminalTable():"No terminals exist"}
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
  toggleTerminals =() => {
    if(this.state.expandTerminal) {
      this.setState({expandTerminal: false});
    } else {
      this.setState({expandTerminal: true});
    }
  }

  _createTerminalTable =() => {
    let arrList = [];
    this.state.nodeData.terminals.map((t: any, i: number) => {
      console.log(t);
      arrList.push(
        <tr key={i}>
          <td style={{fontSize:"small"}}>{t.terminalName}</td>
          {<td style={{fontSize:"small"}}>{(this.state.nodeData.traversabilityModel !== "esriUNTMBidirectional")?(t.isUpstreamTerminal)?"Upstream":"Downstream":""}</td>}
        </tr>
      );
    });
    let tableObj = <Table hover>
    <thead>
    <tr>
      <th style={{fontSize:"small", fontWeight:"bold"}}>Name</th>
      <th style={{fontSize:"small", fontWeight:"bold"}}>{(this.state.nodeData.traversabilityModel !== "esriUNTMBidirectional")?"Side":""}</th>
    </tr>
    </thead>
    <tbody>
      {arrList}
    </tbody>
    </Table>
    return tableObj;
  }

  //*** SUPPORT FUNCTIONS *****/


}
