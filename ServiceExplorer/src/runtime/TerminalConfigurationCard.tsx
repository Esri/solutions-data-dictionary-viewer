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
  expandTerminal: boolean,
  expandTerminalPaths: boolean,
  minimizedDetails: boolean,
  esriValueList: any
}

export default class TerminalConfigurationCard extends React.Component <IProps, IState> {
  constructor(props: IProps){
    super(props);

    this.state = {
      nodeData: this.props.data.data,
      activeTab: 'Properties',
      expandTerminal: false,
      expandTerminalPaths: false,
      minimizedDetails: false,
      esriValueList: new esriLookup()
    };

  }

  componentWillMount() {
    console.log(this.state.nodeData);
  }

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
            <div style={{paddingTop:5, paddingBottom:5}}><span style={{fontWeight:"bold"}}>Name:</span> {this.state.nodeData.terminalConfigurationName}</div>
            <div style={{paddingTop:5, paddingBottom:5}}><span style={{fontWeight:"bold"}}>Default Configuration:</span> {this.state.nodeData.defaultConfiguration}</div>
            <div style={{paddingTop:5, paddingBottom:5}}><span style={{fontWeight:"bold"}}>Traversability:</span> {this.state.esriValueList.lookupValue(this.state.nodeData.traversabilityModel)}</div>
            <div style={{paddingTop:5, paddingBottom:5, cursor:"pointer"}} onClick={()=>{this.toggleTerminals()}}>{(this.state.expandTerminal)?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />} <span style={{fontWeight:"bold"}}>Terminals</span></div>
            <Collapse isOpen={this.state.expandTerminal}>
              <div style={{minHeight: 100, maxHeight:500, overflow:"auto", paddingRight:2, borderWidth:2, borderStyle:"solid", borderColor:"#ccc"}}>
                {(this.state.nodeData.terminals.length > 0)?this._createTerminalTable():"No terminals exist"}
              </div>
            </Collapse>
            <div style={{paddingTop:5, paddingBottom:5, cursor:"pointer"}} onClick={()=>{this.toggleTerminalsPaths()}}>{(this.state.expandTerminalPaths)?<Icon icon={downArrowIcon} size='12' color='#333' />:<Icon icon={rightArrowIcon} size='12' color='#333' />} <span style={{fontWeight:"bold"}}>Valid Paths</span></div>
            <Collapse isOpen={this.state.expandTerminalPaths}>
              <div style={{minHeight: 100, maxHeight:500, overflow:"auto", paddingRight:2, borderWidth:2, borderStyle:"solid", borderColor:"#ccc"}}>
                {(this.state.nodeData.terminals.length > 0)?this._createTerminalPathsTable():"No terminals paths"}
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
  toggleTerminals =() => {
    if(this.state.expandTerminal) {
      this.setState({expandTerminal: false});
    } else {
      this.setState({expandTerminal: true});
    }
  }

  toggleTerminalsPaths =() => {
    if(this.state.expandTerminalPaths) {
      this.setState({expandTerminalPaths: false});
    } else {
      this.setState({expandTerminalPaths: true});
    }
  }

  _createTerminalTable =() => {
    let arrList = [];
    this.state.nodeData.terminals.map((t: any, i: number) => {
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

  _createTerminalPathsTable =() => {
    let arrList = [];
    let arrPath = [];
    this.state.nodeData.validConfigurationPaths.sort(this._compare("name"));
    this.state.nodeData.validConfigurationPaths.map((vp: any, i: number) => {
      arrPath = [];
      vp.terminalPaths.map((tp: any, z: number) => {
        arrPath.push(
          <tr key={z}>
            <td style={{fontSize:"small"}}>From: </td><td style={{fontSize:"small"}}>{this._lookupTerminalNameById(tp.fromTerminalId)}</td>
            <td style={{fontSize:"small"}}>To: </td><td style={{fontSize:"small"}}>{this._lookupTerminalNameById(tp.toTerminalId)}</td>
          </tr>
        );
      });

      arrList.push(
        <tr key={i}>
          <td style={{fontSize:"small"}}>{vp.name}{(this._lookupDefaultPath(vp.name))?" (Default)":""}</td>
          <td style={{fontSize:"small"}}>{vp.description}</td>
          <td style={{fontSize:"small"}}>
            <table>{arrPath}</table>
          </td>
        </tr>
      );
    });
    let tableObj = <Table hover>
    <thead>
    <tr>
      <th style={{fontSize:"small", fontWeight:"bold"}}>Name</th>
      <th style={{fontSize:"small", fontWeight:"bold"}}>Description</th>
      <th style={{fontSize:"small", fontWeight:"bold"}}>Paths</th>
    </tr>
    </thead>
    <tbody>
      {arrList}
    </tbody>
    </Table>
    return tableObj;
  }
  //*** SUPPORT FUNCTIONS *****/
  _lookupTerminalNameById =(id: number) => {
    let name = [];
    name = this.state.nodeData.terminals.filter((t: any, i: number) => {
      return (t.terminalId === id);
    });
    if(name.length > 0) {
      return name[0].terminalName;
    } else {
      return id;
    }
  }

  _lookupDefaultPath =(name: string) => {
    let isDefault = false;
    if(this.state.nodeData.defaultConfiguration === name) {
      isDefault = true;
    }
    return isDefault;
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

}
