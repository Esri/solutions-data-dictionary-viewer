/** @jsx jsx */
import {React, defaultMessages as jimuCoreDefaultMessage} from 'jimu-core';
import {AllWidgetProps, css, jsx, styled} from 'jimu-core';
import {IMConfig} from '../config';
import {TabContent, TabPane} from 'reactstrap';
import CardHeader from './_header';
import esriLookup from './_constants';
import './css/custom.css';
let linkIcon = require('./assets/launch.svg');

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
  minimizedDetails: boolean,
  esriValueList: any
}

export default class AttributeRuleCard extends React.Component <IProps, IState> {
  constructor(props: IProps){
    super(props);

    this.state = {
      nodeData: this.props.data.data,
      activeTab: 'Properties',
      minimizedDetails: false,
      esriValueList: new esriLookup()
    };

  }

  componentWillMount() {}

  componentDidMount() {}

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
          <div style={{paddingTop:5, paddingBottom:5}}><span style={{fontWeight:"bold"}}>Description:</span> {this.state.nodeData.description}</div>
          <div style={{paddingTop:5, paddingBottom:5}}><span style={{fontWeight:"bold"}}>This rule works on:</span> {this._matchCodeToDesc(this.state.nodeData.subtypeCode)}</div>
          <div style={{paddingTop:5, paddingBottom:5}}><span style={{fontWeight:"bold"}}>This rule is set on:</span> {this.state.nodeData.fieldName}</div>
          <div style={{paddingTop:5, paddingBottom:5}}><span style={{fontWeight:"bold"}}>This rule is triggered on:</span> {this._splitTiggerRules(this.state.nodeData.triggeringEvents)}</div>
          <div style={{paddingTop:5, paddingBottom:5}}><span style={{fontWeight:"bold"}}>This rule type is:</span> {this.state.esriValueList.lookupValue(this.state.nodeData.type)}</div>
          <div style={{paddingTop:5, paddingBottom:5}}><span style={{fontWeight:"bold"}}>This rule is batched:</span> {(this.state.nodeData.batch)? "True" : "False"}</div>
          <div style={{paddingTop:5, paddingBottom:5}}><span style={{fontWeight:"bold"}}>Priority:</span> {this.state.nodeData.evaluationOrder}</div>
          <div style={{paddingTop:5, paddingBottom:5}}><span style={{fontWeight:"bold"}}>References External Services:</span> {(this.state.nodeData.referencesExternalService)? "True" : "False"}</div>
          <div style={{paddingTop:5, paddingBottom:5}}><span style={{fontWeight:"bold"}}>Script</span></div>
          <div style={{overflowY:"auto", paddingBottom:5, paddingLeft:5, paddingRight:5, paddingTop:5, backgroundColor: "#e1e1e1", borderWidth:2, borderStyle:"solid", borderColor:"#000"}} dangerouslySetInnerHTML={this._processCodeBlock(this.state.nodeData.scriptExpression)}></div>
          {
            (this.state.nodeData.errorMessage !== "\"\"")?
            <div style={{paddingTop:5, paddingBottom:5}}><span style={{fontWeight:"bold"}}>Error Message:</span> {"Code "+ this.state.nodeData.errorNumber}</div>
            :
            <div style={{paddingTop:5, paddingBottom:5}}><span style={{fontWeight:"bold"}}>Error Message:</span> {"Code "+ this.state.nodeData.errorNumber + ": " + this.state.nodeData.errorMessage}</div>
          }
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

  _splitTiggerRules =(rules:any) => {
    let list = [];
    rules.map((r:any) => {
      list.push(this.state.esriValueList.lookupValue(r));
    });
    return list.join();
  }


}
