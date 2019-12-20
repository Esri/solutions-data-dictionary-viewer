/** @jsx jsx */
import {React, defaultMessages as jimuCoreDefaultMessage} from 'jimu-core';
import {jsx} from 'jimu-core';
import './css/custom.css';
import { Navbar, Nav, NavItem, NavLink, NavbarBrand, Badge, Icon, Tooltip, DropdownMenu } from 'jimu-ui';
let heartIcon = require('jimu-ui/lib/icons/heart.svg');
let closeIcon = require('jimu-ui/lib/icons/close.svg');
let rightArrowIcon = require('jimu-ui/lib/icons/arrow-right.svg');
let leftArrowIcon = require('jimu-ui/lib/icons/arrow-left.svg');
let downArrowIcon = require('jimu-ui/lib/icons/arrow-down.svg');
let upArrowIcon = require('jimu-ui/lib/icons/arrow-up-8.svg');
let moveIcon = require('jimu-ui/lib/icons/tool-drag.svg');
let linkIcon = require('jimu-ui/lib/icons/tool-layer.svg');
let pageIcon = require('jimu-ui/lib/icons/page.svg');
let chartIcon = require('jimu-ui/lib/icons/chart.svg');
let resourceIcon = require('jimu-ui/lib/icons/link.svg');

interface IProps {
  title: string,
  isFavorite:boolean,
  id: string,
  panel:number,
  panelCount:number,
  slotInPanel:number,
  totalSlotsInPanel:number,
  onClose: any,
  onSave: any,
  onTabSwitch: any,
  onMove: any,
  onReorderCards: any,
  showProperties:boolean,
  showStatistics:boolean,
  showResources:boolean,

}

interface IState {
  activeTab: string,
  propertyBadge: string,
  statsBadge: string,
  diagramsBadge: string,
  tooltipOpen: boolean
}

export default class CardHeader extends React.Component <IProps, IState> {
  constructor(props: IProps){
    super(props);

    this.state = {
      activeTab: 'Properties',
      propertyBadge: "primary",
      statsBadge: "dark",
      diagramsBadge: "dark",
      tooltipOpen: false
    };

    this.toggleToolTip = this.toggleToolTip.bind(this);

  }

  componentWillMount() {
  }

  componentDidMount() {
  }

  render(){

    let rightValid = this.props.panelCount() > this.props.panel;
    let leftValid = this.props.panel > 0;
    let downValid =() => {return ((this.props.totalSlotsInPanel())[this.props.panel].length -1 > this.props.slotInPanel())};
    let upValid =() =>{return this.props.slotInPanel() > 0};
    let isFavorite =() =>{return this.props.isFavorite()};

/*
              {(this.props.showProperties) && <Badge color={this.state.propertyBadge} onClick={() => { this.props.onTabSwitch(this.toggleTabs('Properties')); }}><Icon icon={pageIcon} size='16' color='#fff' /></Badge>}
              {(this.props.showStatistics) && <Badge color={this.state.statsBadge} onClick={() => { this.props.onTabSwitch(this.toggleTabs('Statistics')); }}><Icon icon={chartIcon} size='16' color='#fff' /></Badge>}
              {(this.props.showResources) && <Badge color={this.state.diagramsBadge} onClick={() => { this.props.onTabSwitch(this.toggleTabs('Diagrams')); }}><Icon icon={resourceIcon} size='16' color='#fff' /></Badge>}
              <Badge><span style={{color:"#000"}}>|</span></Badge>
*/

    return (
    <div style={{width:"100%", float:"left", display:"inline-block"}}>
      <Navbar color="dark" expand="md">
        <NavbarBrand><h4 style={{color:"#fff"}}>{this.props.title}</h4></NavbarBrand>
        <Nav className="ml-auto"  tabs>
          <NavItem>
            <NavLink>
                <div style={{display:"inline-block"}} id={this.props.id} onClick={this.toggleToolTip}><Icon icon={moveIcon} size='16' color='#000'/></div>
                <div style={{display:"inline-block"}} onClick={()=> {this.props.onSave().then(()=>{this.setState(this.state)})}}><Icon icon={heartIcon} size='16' color={(isFavorite())?'#fbaa33':"#000"} /></div>
                <div style={{display:"inline-block"}} onClick={()=>{this.props.onClose()}}><Icon icon={closeIcon} size='16' color='#e20053'/></div>
            </NavLink>
          </NavItem>
        </Nav>
      </Navbar>
      <DropdownMenu className="" showArrow={true} alightment="center">

      </DropdownMenu>
      <Tooltip placement="bottom" isOpen={this.state.tooltipOpen} autohide={false} target={this.props.id} toggle={this.toggleToolTip} tigger="hover" >
        <table cellSpacing={0} cellPadding={0}>
          <tr>
            <td></td>
            <td onClick={()=>{(upValid)?this.props.onReorderCards("up"):''}}>{<Icon icon={upArrowIcon} size='16' color={(upValid())?'#000':'#ccc'} />}</td>
            <td></td>
          </tr>
          <tr>
            <td>{<Icon icon={leftArrowIcon} size='14' color={(leftValid)?'#000':'#ccc'} onClick={()=>{(leftValid)?this.props.onMove("left"):''}} />}</td>
            <td></td>
            <td>{<Icon icon={rightArrowIcon} size='14' color={(rightValid)?'#000':'#ccc'} onClick={()=>{(rightValid)?this.props.onMove("right"):''}} />}</td>
          </tr>
          <tr>
            <td></td>
            <td>{<Icon icon={downArrowIcon} size='14' color={(downValid())?'#000':'#ccc'} onClick={()=>{(downValid)?this.props.onReorderCards("down"):''}} />}</td>
            <td></td>
          </tr>
        </table>
      </Tooltip>
    </div>);
  }

  //****** UI components and UI Interaction
  //********************************************
  toggleToolTip() {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen
    });
  }
  toggleTabs(tab: string) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
        propertyBadge: ((tab === "Properties")? "primary" : "dark"),
        statsBadge: ((tab === "Statistics")? "primary" : "dark"),
        diagramsBadge: ((tab === "Diagrams")? "primary" : "dark")
      });
    }
    return tab;
  }


}
