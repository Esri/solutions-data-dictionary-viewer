/** @jsx jsx */
import {BaseWidget, React, classNames, FormattedMessage, defaultMessages as jimuCoreDefaultMessage, IMDataSourceInfo, DataSource, DataSourceComponent} from 'jimu-core';
import {AllWidgetProps, css, jsx, styled} from 'jimu-core';
import {IMConfig} from '../config';

import { TabContent, TabPane, Navbar, Nav, NavItem, NavLink, NavbarBrand, Button, Image, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText, Badge, Input, Collapse, Icon,
  Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle, Table
} from 'jimu-ui';
import defaultMessages from './translations/default';
import { LayerDataSource } from 'dist/typing/jimu-arcgis/lib/data-sources/layer-data-source';
import { string } from 'prop-types';
import { floatWidget } from 'dist/typing/jimu-layouts/lib/flexbox-layout/builder/layout-action';
import { timingSafeEqual } from 'crypto';
import CAVWorkSpace from './CAVWorkSpace';
let heartIcon = require('jimu-ui/lib/icons/heart.svg');
let closeIcon = require('jimu-ui/lib/icons/close.svg');

interface IProps {
  data: any,
  width: number,
  callbackClose: any,
  callbackMinimize: any,
  requestURL: string
}

interface IState {
  width: number,
  nodeData: any,
  activeTab: string,
  propertyBadge: string,
}

export default class AttributeRulesCard extends React.Component <IProps, IState> {
  constructor(props: IProps){
    super(props);

    this.state = {
      width: this.props.width,
      nodeData: this.props.data.data,
      activeTab: 'Properties',
      propertyBadge: "primary"
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
    <div style={{width: this.state.width, backgroundColor: "#fff", borderWidth:2, borderStyle:"solid", borderColor:"#000", float:"left", display:"inline-block"}}>
      <Navbar color="dark" expand="md">
        <NavbarBrand><h4 style={{color:"#fff"}}>{this.props.data.text}</h4></NavbarBrand>
        <Nav className="ml-auto"  tabs>
          <NavItem>
            <NavLink onClick={() => { this.toggleTabs('Properties'); }}><Badge color={this.state.propertyBadge}>Properties</Badge></NavLink>
          </NavItem>
          <NavItem>
            <NavLink>
              <Badge color="warning" onClick={this.sendMinimize}><Icon icon={heartIcon} size='14' color='#333' /></Badge>
              <Badge color="danger" onClick={this.sendClose}><Icon icon={closeIcon} size='14' color='#333' /></Badge>
            </NavLink>
          </NavItem>
        </Nav>
      </Navbar>
      <TabContent activeTab={this.state.activeTab}>
        <TabPane tabId="Properties">
        <div style={{width: this.state.width, paddingLeft:5, paddingRight:5 }}>
          <div><h4>{this.props.data.type}</h4></div>
          <div style={{paddingRight:2, minHeight: 100, maxHeight:500, overflow:"auto", borderWidth:2, borderStyle:"solid", borderColor:"#ccc"}}>
          <Table hover>
                <thead>
                <tr>
                  <th style={{fontSize:"small", fontWeight:"bold"}}>Name</th>
                  <th style={{fontSize:"small", fontWeight:"bold"}}>Description</th>
                  <th style={{fontSize:"small", fontWeight:"bold"}}>Applied On</th>
                  <th style={{fontSize:"small", fontWeight:"bold"}}>Priority</th>
                </tr>
                </thead>
                <tbody>
                  {this._createARList()}
                </tbody>
          </Table>
          </div>
          <div style={{paddingBottom: 15}}></div>
        </div>
        </TabPane>
      </TabContent>
    </div>);
  }

  //****** UI components and UI Interaction
  //********************************************
  toggleTabs(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
        propertyBadge: ((tab === "Properties")? "primary" : "dark")
      });

      switch(tab) {
        case "Statistics": {
          break;
        }
        default: {
          break;
        }
      }
    }
  }


  sendClose =() => {
    this.props.callbackClose(this.props.data);
  }

  sendMinimize =() => {
    this.props.callbackMinimize(this.props.data);
  }

  //****** helper functions and request functions
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

  _createARList = () => {
    let arrList = [];
      this.props.data.data.map((ar: any, i: number) => {
        arrList.push(
          <tr key={i}>
            <td style={{fontSize:"small"}}>{ar.name}</td>
            <td style={{fontSize:"small", wordWrap: "break-word"}}>{ar.description}</td>
            <td style={{fontSize:"small"}}>{this._matchCodeToDesc(ar.subtypeCode)}</td>
            <td style={{fontSize:"small"}}>{ar.evaluationOrder}</td>
          </tr>
        );
      });
    return arrList;
  }

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


  _requestObject = async(clause: string, category: string) => {
    let url = this.props.requestURL + "/" + this.props.data.parentId + "/query?where="+ clause +"&returnCountOnly=true&f=pjson";
    fetch(url, {
      method: 'GET'
    })
    .then((response) => {return response.json()})
    .then((data) => {
      //do something
    });
  }


}
