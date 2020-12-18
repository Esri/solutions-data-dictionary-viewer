/** @jsx jsx */
import {React, defaultMessages as jimuCoreDefaultMessage} from 'jimu-core';
import {jsx} from 'jimu-core';
import {IMConfig} from '../config';

import {Icon, Collapse, Table} from 'jimu-ui';
import {TabContent, TabPane} from 'reactstrap';
import CardHeader from './_header';
import './css/custom.css';
let linkIcon = require('./assets/launch.svg');
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
  expandTerminalConfigurations: boolean,
  minimizedDetails: boolean
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
      expandTerminalConfigurations: false,
      minimizedDetails: false
    };

  }

  componentWillMount() {}

  componentDidMount() {}

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
          <div style={{paddingTop:5, paddingBottom:5}}><span style={{fontWeight:"bold"}}>Name:</span> {this.state.nodeData.dataElement.name}</div>
          <div style={{paddingTop:5, paddingBottom:5}}><span style={{fontWeight:"bold"}}>Utility Network Release:</span> {this.state.nodeData.dataElement.schemaGeneration}</div>
          <div style={{paddingTop:5, paddingBottom:5}}><span style={{fontWeight:"bold"}}>ArcGIS Pro Version:</span> {(this.state.nodeData.dataElement.proVersion).replace("ArcGISPro","")}</div>
          <div style={{paddingTop:5, paddingBottom:5, cursor:"pointer"}} onClick={()=>{this.toggleCategories()}}>{(this.state.expandCategories)?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />} <span style={{fontWeight:"bold"}}>Categories</span></div>
          <Collapse isOpen={this.state.expandCategories}>
            <div style={{minHeight: 100, maxHeight:500, overflow:"auto", paddingRight:2, borderWidth:2, borderStyle:"solid", borderColor:"#ccc"}}>
              {this._createCatTable()}
            </div>
          </Collapse>
          <div style={{paddingTop:5, paddingBottom:5, cursor:"pointer"}} onClick={()=>{this.toggleDomainNetworks()}}>{(this.state.expandDomainNetworks)?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />} <span style={{fontWeight:"bold"}}>Domain Networks</span></div>
          <Collapse isOpen={this.state.expandDomainNetworks}>
            <div style={{minHeight: 100, maxHeight:500, overflow:"auto", paddingRight:2, borderWidth:2, borderStyle:"solid", borderColor:"#ccc"}}>
              {this._createDomainNetworkTable()}
            </div>
          </Collapse>
          <div style={{paddingTop:5, paddingBottom:5, cursor:"pointer"}} onClick={()=>{this.toggleNetworkAttributes()}}>{(this.state.expandNetworkAttributes)?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />} <span style={{fontWeight:"bold"}}>Network Attributes</span></div>
          <Collapse isOpen={this.state.expandNetworkAttributes}>
            <div style={{minHeight: 100, maxHeight:500, overflow:"auto", paddingRight:2, borderWidth:2, borderStyle:"solid", borderColor:"#ccc"}}>
              {this._createNetworkAttributeTable()}
            </div>
          </Collapse>
          <div style={{paddingTop:5, paddingBottom:5, cursor:"pointer"}} onClick={()=>{this.toggleTerminalConfigurations()}}>{(this.state.expandTerminalConfigurations)?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />} <span style={{fontWeight:"bold"}}>Terminal Configurations</span></div>
          <Collapse isOpen={this.state.expandTerminalConfigurations}>
            <div style={{minHeight: 100, maxHeight:500, overflow:"auto", paddingRight:2, borderWidth:2, borderStyle:"solid", borderColor:"#ccc"}}>
              {this._createTerminalsTable()}
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
  toggleCategories =() => {
    if(this.state.expandCategories) {
      this.setState({expandCategories: false});
    } else {
      this.setState({expandCategories: true});
    }
  }

  toggleDomainNetworks =() => {
    if(this.state.expandDomainNetworks) {
      this.setState({expandDomainNetworks: false});
    } else {
      this.setState({expandDomainNetworks: true});
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
          <div onClick={()=>{this.props.callbackLinkage(cat.name,"Category", this.props.panel)}} style={{display:"inline-block", verticalAlign: "top", paddingRight:5, cursor:"pointer"}}><Icon icon={linkIcon} size='12' color='#333' /> {cat.name} </div>
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
          <div onClick={()=>{this.props.callbackLinkage(dn.domainNetworkAliasName,"Domain Network", this.props.panel)}} style={{display:"inline-block", verticalAlign: "top", paddingRight:5, cursor:"pointer"}}><Icon icon={linkIcon} size='12' color='#333' /> {dn.domainNetworkAliasName} </div>
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
          <div onClick={()=>{this.props.callbackLinkage(na.name,"Network Attribute", this.props.panel)}} style={{display:"inline-block", verticalAlign: "top", paddingRight:5, cursor:"pointer"}}><Icon icon={linkIcon} size='12' color='#333' /> {na.name} </div>
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
          <div onClick={()=>{this.props.callbackLinkage(tc.terminalConfigurationName,"Terminal Configuration", this.props.panel)}} style={{display:"inline-block", verticalAlign: "top", paddingRight:5, cursor:"pointer"}}><Icon icon={linkIcon} size='12' color='#333' /> {tc.terminalConfigurationName} </div>
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
