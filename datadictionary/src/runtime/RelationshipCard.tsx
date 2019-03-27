/** @jsx jsx */
import {BaseWidget, React, classNames, FormattedMessage, defaultMessages as jimuCoreDefaultMessage, IMDataSourceInfo, DataSource, DataSourceComponent} from 'jimu-core';
import {AllWidgetProps, css, jsx, styled} from 'jimu-core';
import {IMConfig} from '../config';

import { TabContent, TabPane, Navbar, Nav, NavItem, NavLink, NavbarBrand, Button, Image, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText, Badge, Input, Collapse, Icon,
  Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle
} from 'jimu-ui';
import defaultMessages from './translations/default';
import { LayerDataSource } from 'dist/typing/jimu-arcgis/lib/data-sources/layer-data-source';
import { string } from 'prop-types';
let ArrowLeft = require('./assets/arrowx200L.png');
let ArrowRight = require('./assets/arrowx200R.png');
let closeIcon = require('jimu-ui/lib/icons/close.svg');
let heartIcon = require('jimu-ui/lib/icons/heart.svg');

interface IProps {
  data: any,
  width: number,
  callbackClose: any,
  callbackMinimize: any
}

interface IState {
  width: number,
  activeTab: string,
  nodeData: any,
  propertyBadge: string,
}

export default class RelationshipCard extends React.Component <IProps, IState> {
  constructor(props: IProps){
    super(props);

    this.state = {
      width: this.props.width,
      activeTab: 'Properties',
      nodeData: this.props.data.data,
      propertyBadge: "primary"
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
    <div style={{width: this.state.width}}>
      <Navbar color="dark" expand="md">
        <NavbarBrand><h4 style={{color:"#fff", wordWrap: "break-word"}}>{this.props.data.text}</h4></NavbarBrand>
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
          <div style={{ height: 150, width:this.state.width, position: "relative", backgroundColor:"#fff", paddingTop: 10,  borderWidth:2, borderStyle:"solid", borderColor:"#000"}}>
            <div style={{width: "33%", display:"inline-block"}}>
              <div style={{width: "100%", height: 50, textAlign:"center", wordWrap: "break-word", paddingTop:30}}>{this.state.nodeData.backwardPathLabel}</div>
              <div style={{width: "100%", height: 20, textAlign:"center"}}><img src={ArrowLeft} style={{width: 190, height: 20}}/></div>
              <div style={{width: "100%", height: 50, textAlign:"center"}}>{this.state.nodeData.originPrimaryKey}</div>
            </div>
            <div style={{width: "34%", height:120, borderWidth:2, borderStyle:"solid", borderColor:"#ccc",  textAlign:"center", display:"inline-block"}}>
              <div style={{width: "100%", height: 60, textAlign:"center", wordWrap: "break-word", paddingLeft:2, paddingRight:2, paddingTop: 20, display:"inline-block"}}>{this.state.nodeData.name.replace(/_/g, " ")}</div>
              <div style={{width: "100%", height: 60, textAlign:"center", paddingLeft:2, paddingRight:2, verticalAlign:"bottom"}}>{this._cardinalityLookup(this.state.nodeData.cardinality)}</div>
            </div>
            <div style={{width: "33%", display:"inline-block", float:"right"}}>
              <div style={{width: "100%", height: 50, textAlign:"center", wordWrap: "break-word", paddingTop:30}}>{this.state.nodeData.forwardPathLabel}</div>
              <div style={{width: "100%", height: 20, textAlign:"center"}}><img src={ArrowRight} style={{width: 190, height: 20}}/></div>
              <div style={{width: "100%", height: 50, textAlign:"center"}}>{this.state.nodeData.originForeignKey}</div>
            </div>
          </div>
        </TabPane>
      </TabContent>
    </div>);
  }

  toggleTabs(tab: any) {
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

  sendClose =() => {
    this.props.callbackClose(this.props.data);
  }

  sendMinimize =() => {
    this.props.callbackMinimize(this.props.data);
  }

}
