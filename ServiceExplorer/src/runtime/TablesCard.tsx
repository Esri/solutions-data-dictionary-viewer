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
  relationships: any,
  requestURL: string,
  key: any,
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
}

export default class TablesCard extends React.Component <IProps, IState> {
  constructor(props: IProps){
    super(props);

    this.state = {
      nodeData: this.props.data.data,
      activeTab: 'Properties',
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
          <div><h4>{this.props.data.type}</h4></div>
          <div style={{paddingRight:2, minHeight: 100, maxHeight:500, overflow:"auto", borderWidth:2, borderStyle:"solid", borderColor:"#ccc"}}>
          <Table hover>
                <thead>
                <tr>
                  <th style={{fontSize:"small", fontWeight:"bold"}}>Name</th>
                  <th style={{fontSize:"small", fontWeight:"bold"}}>Relationship</th>
                </tr>
                </thead>
                <tbody>
                  {this._createRelationshipList()}
                </tbody>
          </Table>
          </div>
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
  _createRelationshipList = () => {
    let arrList = [];
    let lookup =(id: number) => {
      let relateList = [];
      let filtered = this.props.relationships.filter((r: any, i: number) => {
        return (r.destinationLayerId === id || r.originLayerId === id);
      });
      if(filtered.length > 0) {
        filtered.map((f: any, i: number) => {
          relateList.push(
            <div key={i} onClick={()=>{this.props.callbackLinkage(f.name,"Relationship", this.props.panel)}} style={{display:"inline-block", verticalAlign: "top", paddingRight:5}}><Icon icon={linkIcon} size='12' color='#333' /> {f.name} </div>
          );
        });
      }
      return relateList;
    }

    this.props.data.data.map((f: any, i: number) => {
      arrList.push(
        <tr key={i}>
          <td style={{fontSize:"small"}}>
          <div onClick={()=>{this.props.callbackLinkage(f.name,"Table", this.props.panel)}} style={{display:"inline-block", verticalAlign: "top", paddingRight:5}}><Icon icon={linkIcon} size='12' color='#333' /> {f.name} </div>
          </td>
          <td style={{fontSize:"small"}}>{lookup(f.id)}</td>
        </tr>
      );
    });
    return arrList;
  }

  //****** helper functions and request functions
  //********************************************


}
