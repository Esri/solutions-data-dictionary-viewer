/** @jsx jsx */
import { React, jsx } from 'jimu-core'
import { Icon, Collapse, Table } from 'jimu-ui'
import { TabContent, TabPane } from 'reactstrap'
import CardHeader from './_header'
import './css/custom.css'
const linkIcon = require('./assets/launch.svg')
const rightArrowIcon = require('jimu-ui/lib/icons/arrow-right.svg')
const downArrowIcon = require('jimu-ui/lib/icons/arrow-down.svg')

interface IProps {
  data: any
  requestURL: string
  panel: number
  callbackClose: any
  callbackSave: any
  callbackLinkage: any
  callbackGetPanels: any
  callbackReorderCards: any
  callbackActiveCards: any
  callbackGetFavorites: any
  callbackMove: any
}

interface IState {
  nodeData: any
  activeTab: string
  expandLayers: boolean
  expandTables: boolean
  minimizedDetails: boolean
}

export default class FeatureServiceCard extends React.Component <IProps, IState> {
  constructor (props: IProps) {
    super(props)

    this.state = {
      nodeData: this.props.data.data,
      activeTab: 'Properties',
      expandLayers: false,
      expandTables: false,
      minimizedDetails: false
    }
  }

  componentWillMount () {}

  componentDidMount () {
  }

  render () {
    const title = (this.state.nodeData.documentInfo) ? this.state.nodeData.documentInfo.Title : this.props.data.text
    const subject = (this.state.nodeData.documentInfo) ? this.state.nodeData.documentInfo.Subject : this.state.nodeData.description
    const cleanId = this.props.data.id.replace(/./g, '_')

    return (
    <div style={{ width: '100%', backgroundColor: '#fff', borderWidth: 2, borderStyle: 'solid', borderColor: '#000', float: 'left', display: 'inline-block' }}>
      <CardHeader title={this.props.data.text} isFavorite={this.headerSearchFavorites} id={'tt_' + (cleanId).toString()}
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
        (this.state.minimizedDetails)
          ? ''
          : <TabContent activeTab={this.state.activeTab}>
        <TabPane tabId="Properties">
        <div style={{ width: '100%', paddingLeft: 10, paddingRight: 10, wordWrap: 'break-word', whiteSpace: 'normal' }}>
          <div style={{ paddingTop: 5, paddingBottom: 5 }}><span style={{ fontWeight: 'bold' }}>Title:</span> {title}</div>
          {(this.state.nodeData.documentInfo) && <div style={{ paddingTop: 5, paddingBottom: 5 }}><span style={{ fontWeight: 'bold' }}>Subject:</span> {this._removeTags(this._unescapeHTML(subject))}</div>}
          {(this.state.nodeData.documentInfo) && <div style={{ paddingTop: 5, paddingBottom: 5 }}><span style={{ fontWeight: 'bold' }}>Description:</span> {this._removeTags(this._unescapeHTML(this.state.nodeData.serviceDescription))}</div>}
          <div style={{ paddingTop: 5, paddingBottom: 5 }}><span style={{ fontWeight: 'bold' }}>Version:</span> {this.state.nodeData.currentVersion}</div>
          <div style={{ paddingTop: 5, paddingBottom: 5, cursor: 'pointer' }} onClick={() => { this.toggleLayers() }}>{(this.state.expandLayers) ? <Icon icon={downArrowIcon} size='12' color='#333' /> : <Icon icon={rightArrowIcon} size='12' color='#333' />} <span style={{ fontWeight: 'bold' }}>Layers</span></div>
          <Collapse isOpen={this.state.expandLayers}>
            <div style={{ minHeight: 100, maxHeight: 500, overflow: 'auto', paddingRight: 2, borderWidth: 2, borderStyle: 'solid', borderColor: '#ccc' }}>
              {this._createLayersList()}
            </div>
          </Collapse>
          {(this.state.nodeData.tables.length > 0)
            ? <div style={{ paddingTop: 5, paddingBottom: 5, cursor: 'pointer' }} onClick={() => { this.toggleTables() }}>{(this.state.expandTables) ? <Icon icon={downArrowIcon} size='12' color='#333' /> : <Icon icon={rightArrowIcon} size='12' color='#333' />} <span style={{ fontWeight: 'bold' }}>Tables</span></div>
            : ''}
          {(this.state.nodeData.tables.length > 0)
            ? <Collapse isOpen={this.state.expandTables}>
            <div style={{ minHeight: 100, maxHeight: 500, overflow: 'auto', paddingRight: 2, borderWidth: 2, borderStyle: 'solid', borderColor: '#ccc' }}>
              {this._createTablesList()}
            </div>
          </Collapse>
            : ''}
          <div style={{ paddingBottom: 15 }}></div>
        </div>
        </TabPane>
      </TabContent>
      }
    </div>)
  }

  //**** breadCrumb */
  buildCrumb =() => {
    const list = []
    this.props.data.crumb.forEach((c: any, i: number) => {
      list.push(<span key={i} onClick={() => {
        this.props.callbackLinkage(c.value, c.type, this.props.panel, this.props.data.parent)
        this.headerCallClose()
      }} style={{ cursor: 'pointer' }}>{c.value + ' > '}</span>)
    })
    return (list)
  }

  //****** Header Support functions
  //********************************************
  headerToggleTabs =(tab: string) => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      })
    }
    switch (tab) {
      case 'Statistics': {
        break
      }
      default: {
        break
      }
    }
  }

  headerCallMove =(direction: string) => {
    this.props.callbackMove(this.props.data, this.props.data.type, this.props.panel, direction)
  }

  headerCallReorder =(direction: string) => {
    this.props.callbackReorderCards(this.props.data, this.props.panel, direction)
  }

  headerCallClose =() => {
    this.props.callbackClose(this.props.data, this.props.panel)
  }

  headerCallFavorite =() => {
    return new Promise((resolve, reject) => {
      this.props.callbackSave(this.props.data).then(resolve(true))
    })
  }

  headerSearchFavorites =() => {
    let isFavorite = false
    const list = this.props.callbackGetFavorites()
    isFavorite = list.some((li: any) => {
      return li.props.data.id === this.props.data.id
    })
    return isFavorite
  }

  headerActiveCardLocation =() => {
    let currPos = -1
    const list = this.props.callbackActiveCards()
    list[this.props.panel].forEach((mac: any, i: number) => {
      if (mac.props.data.id === this.props.data.id) {
        currPos = i
      }
    })
    return currPos
  }

  headerCallMinimize =() => {
    let currState = this.state.minimizedDetails
    if (currState) {
      currState = false
      this.setState({ minimizedDetails: currState })
    } else {
      currState = true
      this.setState({ minimizedDetails: currState })
    }
    return currState
  }

  //****** UI components and UI Interaction
  //********************************************
  toggleLayers =() => {
    if (this.state.expandLayers) {
      this.setState({ expandLayers: false })
    } else {
      this.setState({ expandLayers: true })
    }
  }

  toggleTables =() => {
    if (this.state.expandTables) {
      this.setState({ expandTables: false })
    } else {
      this.setState({ expandTables: true })
    }
  }

  _createLayersList = () => {
    const arrList = []
    this.state.nodeData.layers.forEach((lyr: any, i: number) => {
      if (lyr.name.indexOf('Errors') < 0 && lyr.name !== 'Dirty Areas') {
        let type = 'Layer'
        if (lyr.type === 'Utility Network Layer') {
          type = 'Utility Network'
        }
        arrList.push(
          <tr key={i}>
            <td style={{ fontSize: 'small' }}>
            <div onClick={() => { this.props.callbackLinkage(lyr.name, type, this.props.panel) }} style={{ display: 'inline-block', verticalAlign: 'top', paddingRight: 5, cursor: 'pointer' }}><Icon icon={linkIcon} size='12' color='#333' /> {lyr.name} </div>
            </td>
          </tr>
        )
      }
    })
    const tableObj = <Table hover>
    <thead>
    <tr>
      <th style={{ fontSize: 'small', fontWeight: 'bold' }}>Name</th>
    </tr>
    </thead>
    <tbody>
      {arrList}
    </tbody>
    </Table>
    return tableObj
  }

  _createTablesList = () => {
    const arrList = []
    this.state.nodeData.tables.forEach((tbl: any, i: number) => {
      arrList.push(
        <tr key={i}>
          <td style={{ fontSize: 'small' }}>
          <div onClick={() => { this.props.callbackLinkage(tbl.name, 'Table', this.props.panel) }} style={{ display: 'inline-block', verticalAlign: 'top', paddingRight: 5, cursor: 'pointer' }}><Icon icon={linkIcon} size='12' color='#333' /> {tbl.name} </div>
          </td>
        </tr>
      )
    })
    const tableObj = <Table hover>
    <thead>
    <tr>
      <th style={{ fontSize: 'small', fontWeight: 'bold' }}>Name</th>
    </tr>
    </thead>
    <tbody>
      {arrList}
    </tbody>
    </Table>
    return tableObj
  }

  _createNetworkAttributeTable = () => {
    const arrList = []
    this.props.data.data.dataElement.networkAttributes.forEach((na: any, i: number) => {
      arrList.push(
        <tr key={i}>
          <td style={{ fontSize: 'small' }}>
          <div onClick={() => { this.props.callbackLinkage(na.name, 'Network Attribute', this.props.panel) }} style={{ display: 'inline-block', verticalAlign: 'top', paddingRight: 5, cursor: 'pointer' }}><Icon icon={linkIcon} size='12' color='#333' /> {na.name} </div>
          </td>
        </tr>
      )
    })
    const tableObj = <Table hover>
    <thead>
    <tr>
      <th style={{ fontSize: 'small', fontWeight: 'bold' }}>Name</th>
    </tr>
    </thead>
    <tbody>
      {arrList}
    </tbody>
    </Table>
    return tableObj
  }

  _createTerminalsTable = () => {
    const arrList = []
    this.props.data.data.dataElement.terminalConfigurations.forEach((tc: any, i: number) => {
      arrList.push(
        <tr key={i}>
          <td style={{ fontSize: 'small' }}>
          <div onClick={() => { this.props.callbackLinkage(tc.terminalConfigurationName, 'Terminal Configuration', this.props.panel) }} style={{ display: 'inline-block', verticalAlign: 'top', paddingRight: 5, cursor: 'pointer' }}><Icon icon={linkIcon} size='12' color='#333' /> {tc.terminalConfigurationName} </div>
          </td>
          <td>{tc.terminals.length}</td>
        </tr>
      )
    })
    const tableObj = <Table hover>
    <thead>
    <tr>
      <th style={{ fontSize: 'small', fontWeight: 'bold' }}>Name</th>
      <th style={{ fontSize: 'small', fontWeight: 'bold' }}>No of Terminals</th>
    </tr>
    </thead>
    <tbody>
      {arrList}
    </tbody>
    </Table>
    return tableObj
  }

  //****** helper functions and request functions
  //********************************************
  _removeTags (str: string) {
    if ((str === null) || (str === '')) { return str } else { str = str.toString() }
    return str.replace(/(<([^>]+)>)/ig, '')
  }

  _unescapeHTML =(html: string) => {
    const el = document.createElement('div')
    return html.replace(/\&#?[0-9a-z]+;/gi, function (enc) {
      el.innerHTML = enc
      return el.innerText
    })
  }
}
