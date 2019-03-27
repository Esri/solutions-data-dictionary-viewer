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
  domains: any,
  width: number,
  callbackClose: any,
  callbackMinimize: any,
  requestURL: string
}

interface IState {
  width: number,
  nodeData: any,
  siteStats: any,
  statsOutput: any,
  activeTab: string,
  propertyBadge: string,
  domainHolder: any,
  fieldNameHolder: any,
  fieldHolder: any,
  expandFields: boolean,
  expandCAV: boolean,
  expandAR: boolean
}

export default class FieldCard extends React.Component <IProps, IState> {
  constructor(props: IProps){
    super(props);

    this.state = {
      width: this.props.width,
      nodeData: this.props.data.data,
      siteStats: {},
      statsOutput: [],
      activeTab: 'Properties',
      propertyBadge: "primary",
      domainHolder: {},
      fieldNameHolder: {},
      fieldHolder: [],
      expandFields: false,
      expandCAV: false,
      expandAR: false
    };

  }

  componentWillMount() {
    console.log(this.props.data);
    //test
  }

  componentDidMount() {
    //this._processData();
    //this._requestObject()
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
        <div style={{width: this.state.width, paddingLeft:10, paddingRight:10}}>
          <div><h4>{this.props.data.type} Properties</h4></div>
          <div style={{paddingTop:5, paddingBottom:5}}>Name: <span style={{fontWeight:"bold"}}>{this.props.data.data.name}</span></div>
          <div style={{paddingTop:5, paddingBottom:5}}>Alias: <span style={{fontWeight:"bold"}}>{this.props.data.data.aliasName}</span></div>
          <div style={{paddingTop:5, paddingBottom:5}}>Model Name: <span style={{fontWeight:"bold"}}>{this.props.data.data.modelName}</span></div>
          <div style={{paddingTop:5, paddingBottom:5}}>Allow Null: <span style={{fontWeight:"bold"}}>{(this.props.data.data.isNullable)? "True" : "False"}</span></div>
          <div style={{paddingTop:5, paddingBottom:5}}>Required: <span style={{fontWeight:"bold"}}>{(this.props.data.data.hasOwnProperty("required"))? (this.props.data.data.required)? "True" : "False" : "False"}</span></div>
          <div style={{paddingTop:5, paddingBottom:5}}>Default Value: <span style={{fontWeight:"bold"}}>{(this.props.data.data.hasOwnProperty("defaultValue"))? this.props.data.data.defaultValve : ""}</span></div>
          <div style={{paddingTop:5, paddingBottom:5}}>Type: <span style={{fontWeight:"bold"}}>{this.props.data.data.type}</span></div>
          <div style={{paddingTop:5, paddingBottom:5}}>Length: <span style={{fontWeight:"bold"}}>{this.props.data.data.length}</span></div>
          <div style={{paddingTop:5, paddingBottom:5}}>Precision: <span style={{fontWeight:"bold"}}>{this.props.data.data.precision}</span></div>
          <div style={{paddingTop:5, paddingBottom:5}}>scale: <span style={{fontWeight:"bold"}}>{this.props.data.data.scale}</span></div>
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

  toggleDomains =(domain: string) => {
    if (this.state.domainHolder.hasOwnProperty(domain)) {
      let newDomainState = {...this.state.domainHolder};
      if(newDomainState[domain]) {
        newDomainState[domain] = false;
      } else {
        newDomainState[domain] = true;
      }
      this.setState({domainHolder: newDomainState});
    }
  }

  _substAlias =(alias: string) => {
    let substitute = alias;
    if(substitute.indexOf("[") > -1) {

    }

    return substitute;
  }

  sendClose =() => {
    this.props.callbackClose(this.props.data);
  }

  sendMinimize =() => {
    this.props.callbackMinimize(this.props.data);
  }

  _createDomainExpand =(dName: string) => {
    let domain = this._matchDomain(dName);
    let domainTable = null;
    let headerName = "Name";
    let headerValue = "Code";
    if(domain.length > 0) {
      let vals = [];
      if(domain[0].hasOwnProperty("codedValues")) {
        domain[0].codedValues.map((d: any, z: number) =>{
          vals.push(
            <tr key={z}>
              <td style={{fontSize:"small"}}>{d.name}</td>
              <td style={{fontSize:"small"}}>{d.code}</td>
            </tr>
          );
        });
      } else if (domain[0].hasOwnProperty("range")) {
        headerName = "Description";
        headerValue = "Range";
        domain.map((d: any, z: number) =>{
          vals.push(
          <tr key={z}>
            <td style={{fontSize:"small"}}>{d.description}</td>
            <td style={{fontSize:"small"}}>{d.range[0] + " to " + d.range[d.range.length -1]}</td>
          </tr>);
        });
      }
      domainTable = <Table>
      <thead>
      <tr>
        <th style={{fontSize:"small", fontWeight:"bold"}}>{headerName}</th>
        <th style={{fontSize:"small", fontWeight:"bold"}}>{headerValue}</th>
      </tr>
      </thead>
      <tbody>
        {vals}
      </tbody>
    </Table>;
    }
    return domainTable;
  }

  //****** helper functions and request functions
  //********************************************
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

  _validAssetTypes =(lookup: string) => {
    let domainVals = [];
    let currentAT = this.state.nodeData.fieldInfos.filter((fi:any)=> {
      return(fi.fieldName === lookup);
    });
    if(currentAT.length > 0) {
      domainVals = this.props.domains.filter((d:any)=> {
        return(d.name === currentAT[0].domainName);
      });
    }
    return domainVals;
  }

  _matchDomain =(lookup: string) => {
    let domainVals = [];
    domainVals = this.props.domains.filter((d:any)=> {
      return(d.name === lookup);
    });
    return domainVals;
  }

  _matchField =(lookup: string) => {
    let fieldVal = [];
    fieldVal = this.props.data.fields.filter((f:any)=> {
      return(f.name === lookup);
    });
    return fieldVal;
  }


}
