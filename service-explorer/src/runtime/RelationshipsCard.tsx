/** @jsx jsx */
import { React, jsx } from 'jimu-core'
import { Icon, Table } from 'jimu-ui'
import { TabContent, TabPane } from 'reactstrap'
import CardHeader from './_header'
import './css/custom.css'
const linkIcon = require('./assets/launch.svg')

interface IProps {
  data: any
  requestURL: string
  key: any
  panel: number
  dataElements: any
  serviceElements: any
  relationshipElements: any
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
  minimizedDetails: boolean
}

export default class RelationshipsCard extends React.Component <IProps, IState> {
  constructor (props: IProps) {
    super(props)

    this.state = {
      nodeData: this.props.data.data,
      activeTab: 'Properties',
      minimizedDetails: false
    }
  }

  componentWillMount () {}

  componentDidMount () {}

  render () {
    return (
    <div style={{ width: '100%', backgroundColor: '#fff', borderWidth: 2, borderStyle: 'solid', borderColor: '#000', float: 'left', display: 'inline-block' }}>
      <CardHeader title={this.props.data.text} isFavorite={this.headerSearchFavorites} id={'tt_' + (this.props.data.id).toString()}
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
          <div style={{ paddingTop: 5, paddingBottom: 5, fontSize: 'smaller' }}>{this.buildCrumb()}<span style={{ fontWeight: 'bold' }}>{this.props.data.type}</span></div>
            <div style={{ paddingRight: 2, minHeight: 100, maxHeight: 500, overflow: 'auto', borderWidth: 2, borderStyle: 'solid', borderColor: '#ccc' }}>
            <Table hover>
                  <thead>
                  <tr>
                    <th style={{ fontSize: 'small', fontWeight: 'bold' }}>Name</th>
                    <th style={{ fontSize: 'small', fontWeight: 'bold' }}>Origin</th>
                    <th style={{ fontSize: 'small', fontWeight: 'bold' }}>Target</th>
                  </tr>
                  </thead>
                  <tbody>
                    {this._createARList()}
                  </tbody>
            </Table>
            </div>
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
        this.props.callbackLinkage(c.value, c.type, this.props.panel)
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
  _createARList = () => {
    const arrList = []
    let org = null
    let dest = null
    this.props.data.data.forEach((r: any, i: number) => {
      if (r?.backwardPathLabel) {
        org = r.backwardPathLabel
      } else {
        if (r.role === 'esriRelRoleOrigin') {
          // for hosted service, the table id is the reverse of the destination(role)
          dest = this._SElayerNameLookup(r.relatedTableId)
        } else {
          const orgMatch = this._matchCorresRelation(r.id, r.role)
          if (orgMatch !== null) {
            dest = this._SElayerNameLookup(orgMatch.relatedTableId)
          }
        }
      }

      if (r?.forwardPathLabel) {
        dest = r.forwardPathLabel
      } else {
        if (r.role === 'esriRelRoleDestination') {
          // for hosted service, the table id is the reverse of the destination(role)
          org = this._SElayerNameLookup(r.relatedTableId)
        } else {
          const orgMatch = this._matchCorresRelation(r.id, r.role)
          if (orgMatch !== null) {
            org = this._SElayerNameLookup(orgMatch.relatedTableId)
          }
        }
      }

      arrList.push(
          <tr key={i}>
            <td style={{ fontSize: 'small' }}>
            <div onClick={() => { this.props.callbackLinkage(r.name, 'Relationship', this.props.panel) }} style={{ display: 'inline-block', verticalAlign: 'top', paddingRight: 5, cursor: 'pointer' }}><Icon icon={linkIcon} size='12' color='#333' /> {r.name} </div>
            </td>
            <td style={{ fontSize: 'small' }}>{org}</td>
            <td style={{ fontSize: 'small' }}>{dest}</td>
          </tr>
      )
    })
    return arrList
  }

  //****** helper functions and request functions
  //*******************************************
  _layerForLinkageLookup =(layerId: number) => {
    if (this.props.dataElements.length > 0) {
      return this._DElayerNameLookup(layerId)
    } else {
      //for non un services
      return this._SElayerNameLookup(layerId)
    }
  }

  _DElayerNameLookup = (layerId: number) => {
    let foundLayer = ''
    const filterDE = this.props.dataElements.filter((de: any) => {
      return (de.layerId === layerId)
    })
    if (filterDE.length > 0) {
      foundLayer = filterDE[0].dataElement.aliasName
    }
    return foundLayer
  }

  _SElayerNameLookup =(layerId: number) => {
    let foundLayer = layerId
    const filterSETables = this.props.serviceElements.tables.filter((se: any) => {
      return (se.id === layerId)
    })
    if (filterSETables.length > 0) {
      foundLayer = filterSETables[0].name
    } else {
      //if it's not a table, see if it's a lyer
      const filterSELayers = this.props.serviceElements.layers.filter((se: any) => {
        return (se.id === layerId)
      })
      if (filterSELayers.length > 0) {
        foundLayer = filterSELayers[0].name
      }
    }
    return foundLayer
  }

  _matchCorresRelation = (id: number, direction: string) => {
    let found = null
    this.state.nodeData.forEach((re: any) => {
      if (re.id === id) {
        if (re.role !== direction) {
          found = re
        }
      }
    })
    return found
  }
}
