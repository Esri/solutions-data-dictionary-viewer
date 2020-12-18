/** @jsx jsx */
import {React, defaultMessages as jimuCoreDefaultMessage} from 'jimu-core';
import {jsx} from 'jimu-core';
import {IMConfig} from '../config';
import {Icon, Table} from 'jimu-ui';
import {TabContent, TabPane} from 'reactstrap';
import CardHeader from './_header';
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
  minimizedDetails: boolean
}

export default class TerminalConfigurationsCard extends React.Component <IProps, IState> {
  constructor(props: IProps){
    super(props);

    this.state = {
      nodeData: this.props.data.data,
      activeTab: 'Properties',
      minimizedDetails: false
    };

  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillReceiveProps(){
    this.setState({ state: this.state });
  }

  componentDidUpdate() {}

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
            <div style={{paddingTop:5, paddingBottom:5, fontSize:"smaller"}}>{this.buildCrumb()}<span style={{fontWeight:"bold"}}>{this.props.data.type}</span></div>
            <div style={{paddingRight:2, minHeight: 100, maxHeight:500, overflow:"auto", borderWidth:2, borderStyle:"solid", borderColor:"#ccc"}}>
            <Table hover>
                  <thead>
                  <tr>
                    <th style={{fontSize:"small", fontWeight:"bold"}}>Name</th>
                  </tr>
                  </thead>
                  <tbody>
                    {this._createList()}
                  </tbody>
            </Table>
            </div>
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
        this.props.callbackLinkage(c.value, c.type, this.props.panel);
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
  _createList = () => {
    let arrList = [];
      this.props.data.data.map((ar: any, i: number) => {
        arrList.push(
          <tr key={i}>
            <td style={{fontSize:"small"}}>
            <div onClick={()=>{this.props.callbackLinkage(ar.name,"Category",this.props.panel)}} style={{display:"inline-block", verticalAlign: "top", paddingRight:5, cursor:"pointer"}}><Icon icon={linkIcon} size='12' color='#333' /> {ar.name} </div>
            </td>
          </tr>
        );
      });
    return arrList;
  }

  //****** helper functions and request functions
  //********************************************

}
