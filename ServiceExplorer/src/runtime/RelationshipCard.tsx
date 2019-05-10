/** @jsx jsx */
import {React, defaultMessages as jimuCoreDefaultMessage} from 'jimu-core';
import {AllWidgetProps, css, jsx, styled} from 'jimu-core';
import {IMConfig} from '../config';

import { TabContent, TabPane, Icon} from 'jimu-ui';
import CardHeader from './_header';
let ArrowLeft = require('./assets/arrowx200L.png');
let ArrowRight = require('./assets/arrowx200R.png');

interface IProps {
  data: any,
  key: any,
  width: any,
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
              <div style={{width: "33%", display:"inline-block"}}>
                <div style={{width: "100%", height: 50, textAlign:"center", wordWrap: "break-word", whiteSpace: "normal", paddingTop:30}}>{this.state.nodeData.backwardPathLabel}</div>
                <div style={{width: "100%", height: 20, textAlign:"center"}}><img src={ArrowLeft} style={{width: ((this.props.width/3)-50), height: 20}}/></div>
                <div style={{width: "100%", height: 50, textAlign:"center"}}>{this.state.nodeData.originPrimaryKey}</div>
              </div>
              <div style={{width: "34%", height:120, borderWidth:2, borderStyle:"solid", borderColor:"#ccc",  textAlign:"center", display:"inline-block"}}>
                <div style={{width: "100%", height: 60, textAlign:"center", wordWrap: "break-word", whiteSpace: "normal", paddingLeft:2, paddingRight:2, paddingTop: 20, display:"inline-block"}}>{this.state.nodeData.name.replace(/_/g, " ")}</div>
                <div style={{width: "100%", height: 60, textAlign:"center", paddingLeft:2, paddingRight:2, verticalAlign:"bottom"}}>{this._cardinalityLookup(this.state.nodeData.cardinality)}</div>
              </div>
              <div style={{width: "33%", display:"inline-block", float:"right"}}>
                <div style={{width: "100%", height: 50, textAlign:"center", wordWrap: "break-word", whiteSpace: "normal", paddingTop:30}}>{this.state.nodeData.forwardPathLabel}</div>
                <div style={{width: "100%", height: 20, textAlign:"center"}}><img src={ArrowRight} style={{width: ((this.props.width/3)-50), height: 20}}/></div>
                <div style={{width: "100%", height: 50, textAlign:"center"}}>{this.state.nodeData.originForeignKey}</div>
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

  //****** helper functions and request functions
  //********************************************
  _cardinalityLookup =(code: string) => {
    let possible = {
      "esriRelCardinalityOneToMany": "1:M",
      "esriRelCardinalityOneToOne": "1:1",
      "esriRelCardinalityManyToMany": "M:N",
    };
    if(possible.hasOwnProperty(code)) {
      return possible[code];
    } else {
      return code;
    }
  }

}
