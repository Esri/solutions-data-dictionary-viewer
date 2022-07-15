/** @jsx jsx */
import { React, jsx } from 'jimu-core'
import './css/custom.css'
import { Tooltip, NavbarBrand } from 'reactstrap'
import { Navbar, Nav, NavItem, NavLink, Icon, DropdownMenu } from 'jimu-ui'
const heartIcon = require('jimu-ui/lib/icons/heart.svg')
const closeIcon = require('jimu-ui/lib/icons/close.svg')
const rightArrowIcon = require('jimu-ui/lib/icons/arrow-right.svg')
const leftArrowIcon = require('jimu-ui/lib/icons/arrow-left.svg')
const downArrowIcon = require('jimu-ui/lib/icons/arrow-down.svg')
const upArrowIcon = require('jimu-ui/lib/icons/arrow-up-8.svg')
const moveIcon = require('jimu-ui/lib/icons/tool-drag.svg')

interface IProps {
  title: string
  isFavorite: any
  id: string
  panel: number
  panelCount: any
  slotInPanel: any
  totalSlotsInPanel: any
  onClose: any
  onSave: any
  onTabSwitch: any
  onMove: any
  onMinimize: any
  onReorderCards: any
  showProperties: boolean
  showStatistics: boolean
  showResources: boolean

}

interface IState {
  activeTab: string
  propertyBadge: string
  statsBadge: string
  diagramsBadge: string
  tooltipOpen: boolean
  minimized: boolean
}

export default class CardHeader extends React.Component <IProps, IState> {
  constructor (props: IProps) {
    super(props)

    this.state = {
      activeTab: 'Properties',
      propertyBadge: 'primary',
      statsBadge: 'dark',
      diagramsBadge: 'dark',
      tooltipOpen: false,
      minimized: false
    }

    this.toggleToolTip = this.toggleToolTip.bind(this)
  }

  componentWillMount () {}

  componentDidMount () {}

  render () {
    const rightValid = this.props.panelCount() > this.props.panel
    const leftValid = this.props.panel > 0
    const downValid = () => { return ((this.props.totalSlotsInPanel())[this.props.panel].length - 1 > this.props.slotInPanel()) }
    const upValid = () => { return this.props.slotInPanel() > 0 }
    const isFavorite = () => { return this.props.isFavorite() }

    /*
              {(this.props.showProperties) && <Badge color={this.state.propertyBadge} onClick={() => { this.props.onTabSwitch(this.toggleTabs('Properties')); }}><Icon icon={pageIcon} size='16' color='#fff' /></Badge>}
              {(this.props.showStatistics) && <Badge color={this.state.statsBadge} onClick={() => { this.props.onTabSwitch(this.toggleTabs('Statistics')); }}><Icon icon={chartIcon} size='16' color='#fff' /></Badge>}
              {(this.props.showResources) && <Badge color={this.state.diagramsBadge} onClick={() => { this.props.onTabSwitch(this.toggleTabs('Diagrams')); }}><Icon icon={resourceIcon} size='16' color='#fff' /></Badge>}
              <Badge><span style={{color:"#000"}}>|</span></Badge>
*/

    return (
    <div id={this.props.title + '_header'} style={{ width: '100%', display: 'inline-block' }}>
      <Navbar color="dark" expand="md">
        <NavbarBrand>
          <div style={{ display: 'inline-block', cursor: 'pointer' }} onClick={() => { this.toggleMinimize() }} title={(this.state.minimized ? 'Maximize card' : 'Minimize card')}><Icon icon={rightArrowIcon} size='16' rotate={(this.state.minimized ? 0 : 90)} color={'#fff'} /></div>
          <div style={{ display: 'inline-block', width: '100%', color: '#fff', overflowWrap: 'break-word', paddingLeft: 5 }}>{this._dynamicHeaderSize(this.props.title)}</div>
        </NavbarBrand>
        <Nav className="ml-auto" tabs>
          <NavItem>
            <NavLink>
                <div style={{ display: 'inline-block' }} id={this.props.id} onClick={this.toggleToolTip} title="Move card"><Icon icon={moveIcon} size='16' color='#000'/></div>
                <div style={{ display: 'inline-block' }} onClick={() => { this.props.onSave().then(() => { this.setState(this.state) }) }} title="Save card"><Icon icon={heartIcon} size='16' color={(isFavorite()) ? '#fbaa33' : '#000'} /></div>
                <div style={{ display: 'inline-block' }} onClick={() => { this.props.onClose() }} title="Close card"><Icon icon={closeIcon} size='16' color='#e20053'/></div>
            </NavLink>
          </NavItem>
        </Nav>
      </Navbar>
      <DropdownMenu className="" showArrow={true} alignment="center">

      </DropdownMenu>
      <Tooltip placement="bottom" isOpen={this.state.tooltipOpen} autohide={false} target={this.props.id} toggle={this.toggleToolTip} tigger="hover" >
        <table cellSpacing={0} cellPadding={0} style={{ backgroundColor: '#fff' }}>
          <tbody>
          <tr>
            <td></td>
            <td style={{ cursor: 'pointer' }} onClick={() => { (upValid) && this.props.onReorderCards('up') }}>{<Icon icon={upArrowIcon} size='16' color={(upValid()) ? '#000' : '#ccc'} />}</td>
            <td></td>
          </tr>
          <tr>
            <td style={{ cursor: 'pointer' }} onClick={() => { (leftValid) && this.props.onMove('left') }}>{<Icon icon={leftArrowIcon} size='14' color={(leftValid) ? '#000' : '#ccc'} />}</td>
            <td></td>
            <td style={{ cursor: 'pointer' }} onClick={() => { (rightValid) && this.props.onMove('right') }}>{<Icon icon={rightArrowIcon} size='14' color={(rightValid) ? '#000' : '#ccc'} />}</td>
          </tr>
          <tr>
            <td></td>
            <td style={{ cursor: 'pointer' }} onClick={() => { (downValid) && this.props.onReorderCards('down') }}>{<Icon icon={downArrowIcon} size='14' color={(downValid()) ? '#000' : '#ccc'} />}</td>
            <td></td>
          </tr>
          </tbody>
        </table>
      </Tooltip>
    </div>)
  }

  //****** UI components and UI Interaction
  //********************************************
  toggleToolTip () {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen
    })
  }

  toggleTabs (tab: string) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
        propertyBadge: ((tab === 'Properties') ? 'primary' : 'dark'),
        statsBadge: ((tab === 'Statistics') ? 'primary' : 'dark'),
        diagramsBadge: ((tab === 'Diagrams') ? 'primary' : 'dark')
      })
    }
    return tab
  }

  toggleMinimize =() => {
    const toggleState = this.props.onMinimize()
    this.setState({ minimized: toggleState })
  }

  _dynamicHeaderSize =(title: string) => {
    let newTitleSize = title
    if (this.props.panel > 0) {
      if (title.length > 35) {
        const split1 = title.substring(0, 35)
        const split2 = title.substring(35, title.length)
        newTitleSize = split1 + '<br>' + split2
      } else {
        newTitleSize = title
      }
    } else {
      newTitleSize = title
    }
    return newTitleSize
  }
}
