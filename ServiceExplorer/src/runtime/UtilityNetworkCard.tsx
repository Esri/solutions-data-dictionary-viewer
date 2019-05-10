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
  expandCategories: boolean,
  expandDomainNetworks: boolean,
  expandNetworkAttributes: boolean,
  expandTerminalConfigurations: boolean
}

export default class UtilityNetworkCard extends React.Component <IProps, IState> {
  constructor(props: IProps){
    super(props);

    this.state = {
      nodeData: this.props.data.data,
      activeTab: 'Properties',
      expandCategories: false,
      expandDomainNetworks: false,
      expandNetworkAttributes: false,
      expandTerminalConfigurations: false
    };

  }

  componentWillMount() {
    console.log(this.props.data);
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
          <div style={{paddingTop:5, paddingBottom:5}}>Name: <span style={{fontWeight:"bold"}}>{this.state.nodeData.dataElement.name}</span></div>
          <div style={{paddingTop:5, paddingBottom:5}} onClick={()=>{this.toggleDomainNetworks()}}>{(this.state.expandDomainNetworks)?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />} Domain Networks:</div>
          <Collapse isOpen={this.state.expandDomainNetworks}>
            <div style={{minHeight: 100, maxHeight:500, overflow:"auto", paddingRight:2, borderWidth:2, borderStyle:"solid", borderColor:"#ccc"}}>
              {this._createDomainNetworkTable()}
            </div>
          </Collapse>
          <div style={{paddingTop:5, paddingBottom:5}} onClick={()=>{this.toggleCategories()}}>{(this.state.expandCategories)?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />} Categories:</div>
          <Collapse isOpen={this.state.expandCategories}>
            <div style={{minHeight: 100, maxHeight:500, overflow:"auto", paddingRight:2, borderWidth:2, borderStyle:"solid", borderColor:"#ccc"}}>
              {this._createCatTable()}
            </div>
          </Collapse>
          <div style={{paddingTop:5, paddingBottom:5}} onClick={()=>{this.toggleNetworkAttributes()}}>{(this.state.expandNetworkAttributes)?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />} Network Attributes:</div>
          <Collapse isOpen={this.state.expandNetworkAttributes}>
            <div style={{minHeight: 100, maxHeight:500, overflow:"auto", paddingRight:2, borderWidth:2, borderStyle:"solid", borderColor:"#ccc"}}>
              {this._createNetworkAttributeTable()}
            </div>
          </Collapse>
          <div style={{paddingTop:5, paddingBottom:5}} onClick={()=>{this.toggleTerminalConfigurations()}}>{(this.state.expandTerminalConfigurations)?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />} Terminal Configurations:</div>
          <Collapse isOpen={this.state.expandTerminalConfigurations}>
            <div style={{minHeight: 100, maxHeight:500, overflow:"auto", paddingRight:2, borderWidth:2, borderStyle:"solid", borderColor:"#ccc"}}>
              {this._createTerminalsTable()}
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
  toggleCategories =() => {
    if(this.state.expandCategories) {
      this.setState({expandCategories: false});
    } else {
      this.setState({expandCategories: true});
    }
  }

  toggleDomainNetworks =() => {
    if(this.state.expandCategories) {
      this.setState({expandCategories: false});
    } else {
      this.setState({expandCategories: true});
    }
  }

  toggleNetworkAttributes =() => {
    if(this.state.expandNetworkAttributes) {
      this.setState({expandNetworkAttributes: false});
    } else {
      this.setState({expandNetworkAttributes: true});
    }
  }

  toggleTerminalConfigurations =() => {
    if(this.state.expandTerminalConfigurations) {
      this.setState({expandTerminalConfigurations: false});
    } else {
      this.setState({expandTerminalConfigurations: true});
    }
  }

  _createCatTable = () => {
    let arrList = [];
    this.props.data.data.dataElement.categories.map((cat: any, i: number) => {
      arrList.push(
        <tr key={i}>
          <td style={{fontSize:"small"}}>
          <div onClick={()=>{this.props.callbackLinkage(cat.name,"Category", this.props.panel)}} style={{display:"inline-block", verticalAlign: "top", paddingRight:5}}><Icon icon={linkIcon} size='12' color='#333' /> {cat.name} </div>
          </td>
        </tr>
      );
    });
    let tableObj = <Table hover>
    <thead>
    <tr>
      <th style={{fontSize:"small", fontWeight:"bold"}}>Name</th>
    </tr>
    </thead>
    <tbody>
      {arrList}
    </tbody>
    </Table>
    return tableObj;
  }

  _createDomainNetworkTable = () => {
    let arrList = [];
    this.props.data.data.dataElement.domainNetworks.map((dn: any, i: number) => {
      arrList.push(
        <tr key={i}>
          <td style={{fontSize:"small"}}>
          <div onClick={()=>{this.props.callbackLinkage(dn.domainNetworkAliasName,"Category", this.props.panel)}} style={{display:"inline-block", verticalAlign: "top", paddingRight:5}}><Icon icon={linkIcon} size='12' color='#333' /> {dn.domainNetworkAliasName} </div>
          </td>
        </tr>
      );
    });
    let tableObj = <Table hover>
    <thead>
    <tr>
      <th style={{fontSize:"small", fontWeight:"bold"}}>Name</th>
    </tr>
    </thead>
    <tbody>
      {arrList}
    </tbody>
    </Table>
    return tableObj;
  }

  _createNetworkAttributeTable = () => {
    let arrList = [];
    this.props.data.data.dataElement.networkAttributes.map((na: any, i: number) => {
      arrList.push(
        <tr key={i}>
          <td style={{fontSize:"small"}}>
          <div onClick={()=>{this.props.callbackLinkage(na.name,"NetworkAttribute", this.props.panel)}} style={{display:"inline-block", verticalAlign: "top", paddingRight:5}}><Icon icon={linkIcon} size='12' color='#333' /> {na.name} </div>
          </td>
        </tr>
      );
    });
    let tableObj = <Table hover>
    <thead>
    <tr>
      <th style={{fontSize:"small", fontWeight:"bold"}}>Name</th>
    </tr>
    </thead>
    <tbody>
      {arrList}
    </tbody>
    </Table>
    return tableObj;
  }

  _createTerminalsTable = () => {
    let arrList = [];
    this.props.data.data.dataElement.terminalConfigurations.map((tc: any, i: number) => {
      arrList.push(
        <tr key={i}>
          <td style={{fontSize:"small"}}>
          <div onClick={()=>{this.props.callbackLinkage(tc.terminalConfigurationName,"TerminalConfiguration", this.props.panel)}} style={{display:"inline-block", verticalAlign: "top", paddingRight:5}}><Icon icon={linkIcon} size='12' color='#333' /> {tc.terminalConfigurationName} </div>
          </td>
          <td>{tc.terminals.length}</td>
        </tr>
      );
    });
    let tableObj = <Table hover>
    <thead>
    <tr>
      <th style={{fontSize:"small", fontWeight:"bold"}}>Name</th>
      <th style={{fontSize:"small", fontWeight:"bold"}}>No of Terminals</th>
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

}
