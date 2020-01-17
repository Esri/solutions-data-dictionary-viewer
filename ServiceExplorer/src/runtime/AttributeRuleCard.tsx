/** @jsx jsx */
import {React, defaultMessages as jimuCoreDefaultMessage} from 'jimu-core';
import {AllWidgetProps, css, jsx, styled} from 'jimu-core';
import {IMConfig} from '../config';

import { TabContent, TabPane, Icon} from 'jimu-ui';
import CardHeader from './_header';
import './css/custom.css';
let linkIcon = require('jimu-ui/lib/icons/tool-layer.svg');

interface IProps {
  data: any,
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

export default class AttributeRuleCard extends React.Component <IProps, IState> {
  constructor(props: IProps){
    super(props);

    this.state = {
      nodeData: this.props.data.data,
      activeTab: 'Properties'
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
    <div style={{width:"100%", backgroundColor: "#fff", borderWidth:2, borderStyle:"solid", borderColor:"#000", float:"left", display:"inline-block"}}>
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
          <div style={{paddingTop:5, paddingBottom:5}}>Name: <span style={{fontWeight:"bold"}}>{this.state.nodeData.name}</span></div>
          <div style={{paddingTop:5, paddingBottom:5}}>Description: <span style={{fontWeight:"bold"}}>{this.state.nodeData.description}</span></div>
          <div style={{paddingTop:5, paddingBottom:5}}>This rule works on: <span style={{fontWeight:"bold"}}>{this._matchCodeToDesc(this.state.nodeData.subtypeCode)}</span></div>
          <div style={{paddingTop:5, paddingBottom:5}}>This rule is set on: <span style={{fontWeight:"bold"}}>{this.state.nodeData.fieldName}</span></div>
          <div style={{paddingTop:5, paddingBottom:5}}>This rule is triggered on: <span style={{fontWeight:"bold"}}>{this.state.nodeData.triggeringEvents.join()}</span></div>
          <div style={{paddingTop:5, paddingBottom:5}}>This rule type is: <span style={{fontWeight:"bold"}}>{this.state.nodeData.type}</span></div>
          <div style={{paddingTop:5, paddingBottom:5}}>This rule is batched: <span style={{fontWeight:"bold"}}>{(this.state.nodeData.batch)? "True" : "False"}</span></div>
          <div style={{paddingTop:5, paddingBottom:5}}>Priority: <span style={{fontWeight:"bold"}}>{this.state.nodeData.evaluationOrder}</span></div>
          <div style={{paddingTop:5, paddingBottom:5}}>Script:</div>
          <div style={{overflowY:"auto", paddingBottom:5, paddingLeft:5, paddingRight:5, paddingTop:5, backgroundColor: "#e1e1e1", borderWidth:2, borderStyle:"solid", borderColor:"#000"}} dangerouslySetInnerHTML={this._processCodeBlock(this.state.nodeData.scriptExpression)}></div>
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

  //****** UI components and UI Interaction
  //********************************************
  _processCodeBlock =(code: string) => {
    let block="";
    block = code.replace(/;/g,";<br>");
    block = block.replace(/\{/g,"{<br>");
    block = block.replace(/return/g,"<span style='color:#f00'>return</span>");
    block = block.replace(/==/g,"<span style='color:#f00'>==</span>");
    block = block.replace(/!=/g,"<span style='color:#f00'>!=</span>");
    block = block.replace(/var */g,"<span style='color:#0f0'>var </span>");
    block = block.replace(/else */g,"<span style='color:#00f'>else </span>");
    block = block.replace(/if */g,"<span style='color:#00f'>if </span>");
    block = block.replace(/\|\| */g,"<span style='color:#00f'>|| </span>");
    block = block.replace(/&& */g,"<span style='color:#00f'>&& </span>");
    return {__html: block};
  }

  //****** helper functions and request functions
  //********************************************

  _matchCodeToDesc =(code: any) => {
    let message = "";
    let subtypes = this.props.data.subtypes;
    let result = subtypes.filter((st: any) => {
      return(code === st.subtypeCode);
    });
    if(result.length > 0) {
      message = result[0].subtypeName;
    } else {
      message = "Sorry, no matching type";
    }
    return message;
  }


}
