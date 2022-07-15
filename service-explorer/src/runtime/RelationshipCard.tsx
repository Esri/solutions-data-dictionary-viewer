/** @jsx jsx */
import { React, jsx } from 'jimu-core'
import { Icon, Collapse } from 'jimu-ui'
import { TabContent, TabPane } from 'reactstrap'
import CardHeader from './_header'
import './css/custom.css'
const linkIcon = require('./assets/launch.svg')
const rightArrowIcon = require('jimu-ui/lib/icons/arrow-right.svg')
const downArrowIcon = require('jimu-ui/lib/icons/arrow-down.svg')

interface IProps {
  data: any
  key: any
  width: any
  serviceElements: any
  dataElements: any
  relationshipElements: any
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
  activeTab: string
  nodeData: any
  minimizedDetails: boolean
  expandRules: boolean
}

export default class RelationshipCard extends React.Component <IProps, IState> {
  constructor (props: IProps) {
    super(props)

    this.state = {
      activeTab: 'Properties',
      nodeData: this.props.data.data,
      minimizedDetails: false,
      expandRules: false
    }
  }

  componentWillMount () {
    //console.log(this.state.nodeData);
    //console.log(this.props.serviceElements);
    //console.log(this.props.dataElements);
  }

  componentDidMount () {}

  render () {
    const cardinality = this.state.nodeData.cardinality
    const composite = this.state.nodeData.composite
    let orgId = -1
    let destId = -1
    let orgField = ''
    let destField = ''
    if (this.state.nodeData?.originLayerId) {
      orgId = this.state.nodeData.originLayerId
    } else {
      if (this.state.nodeData.role === 'esriRelRoleOrigin') {
        // for hosted service, the table id is the reverse of the destination(role)
        destId = this.state.nodeData.relatedTableId
      } else {
        const orgMatch = this._matchCorresRelation(
          this.state.nodeData.id,
          this.state.nodeData.role
        )
        if (orgMatch !== null) {
          destId = orgMatch.relatedTableId
        }
      }
    }

    if (this.state.nodeData?.destinationLayerId) {
      destId = this.state.nodeData.destinationLayerId
    } else {
      if (this.state.nodeData.role === 'esriRelRoleDestination') {
        // for hosted service, the table id is the reverse of the destination(role)
        orgId = this.state.nodeData.relatedTableId
      } else {
        const orgMatch = this._matchCorresRelation(
          this.state.nodeData.id,
          this.state.nodeData.role
        )
        if (orgMatch !== null) {
          orgId = orgMatch.relatedTableId
        }
      }
    }

    if (this.state.nodeData?.originPrimaryKey) {
      orgField = this.state.nodeData.originPrimaryKey
    } else {
      if (this.state.nodeData.role === 'esriRelRoleOrigin') {
        orgField = this.state.nodeData.keyField
      } else {
        const orgMatch = this._matchCorresRelation(
          this.state.nodeData.id,
          this.state.nodeData.role
        )
        if (orgMatch !== null) {
          orgField = orgMatch.keyField
        }
      }
    }

    if (this.state.nodeData?.originForeignKey) {
      destField = this.state.nodeData.originForeignKey
    } else {
      if (this.state.nodeData.role === 'esriRelRoleDestination') {
        destField = this.state.nodeData.keyField
      } else {
        const orgMatch = this._matchCorresRelation(
          this.state.nodeData.id,
          this.state.nodeData.role
        )
        if (orgMatch !== null) {
          destField = orgMatch.keyField
        }
      }
    }

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
              <div style={{ paddingTop: 5, paddingBottom: 5, fontSize: 'smaller' }}>{this.buildCrumb()}<span style={{ fontWeight: 'bold' }}>Properties</span></div>
              <div style={{ paddingBottom: 15 }}></div>
              <table style={{ width: '100%' }} cellPadding={0} cellSpacing={0}>
                <tbody>
                  <tr>
                    <td className="relationshipTableStyleHeader">Cardinality: </td><td className="relationshipTableStyle">{this._cardinalityLookup(cardinality)}</td>
                    <td className="relationshipTableStyleHeader">Type: </td><td className="relationshipTableStyle">{(composite) ? 'Composite' : 'Simple'}</td>
                  </tr>
                  <tr>
                    <td className="relationshipTableStyleHeader">Origin Name: </td>
                    <td className="relationshipTableStyle"><div onClick={() => { this.props.callbackLinkage(this._layerForLinkageLookup(orgId), 'Layer', this.props.panel) }} style={{ display: 'inline-block', verticalAlign: 'top', paddingRight: 5, cursor: 'pointer' }}><Icon icon={linkIcon} size='12' color='#333' /></div> {(this.props?.dataElements?.length > 0) ? this.state.nodeData.backwardPathLabel : this._SElayerNameLookup(orgId)}</td>
                    <td className="relationshipTableStyleHeader">Destination Name: </td>
                    <td className="relationshipTableStyle"><div onClick={() => { this.props.callbackLinkage(this._layerForLinkageLookup(destId), 'Table', this.props.panel) }} style={{ display: 'inline-block', verticalAlign: 'top', paddingRight: 5, cursor: 'pointer' }}><Icon icon={linkIcon} size='12' color='#333' /></div> {(this.props?.dataElements?.length > 0) ? this.state.nodeData.forwardPathLabel : this._SElayerNameLookup(destId)}</td>
                  </tr>
                  <tr>
                    <td className="relationshipTableStyleHeader">Origin Primary Key: </td>
                    <td className="relationshipTableStyle"><div onClick={() => { this.props.callbackLinkage(orgField, 'Field', this.props.panel, this._layerForLinkageLookup((this.props?.dataElements?.length > 0) ? this.state.nodeData.originLayerId : orgId)) }} style={{ display: 'inline-block', verticalAlign: 'top', paddingRight: 5, cursor: 'pointer' }}><Icon icon={linkIcon} size='12' color='#333' /></div> {orgField}</td>
                    <td className="relationshipTableStyleHeader">Origin Foreign Key: </td>
                    <td className="relationshipTableStyle"><div onClick={() => { this.props.callbackLinkage(destField, 'Field', this.props.panel, this._layerForLinkageLookup((this.props?.dataElements?.length > 0) ? this.state.nodeData.destinationLayerId : destId)) }} style={{ display: 'inline-block', verticalAlign: 'top', paddingRight: 5, cursor: 'pointer' }}><Icon icon={linkIcon} size='12' color='#333' /></div> {destField}</td>
                  </tr>
                </tbody>
              </table>
              {(this.props?.dataElements?.length > 0) ? <div style={{ paddingLeft: 10, paddingTop: 5, paddingBottom: 5, cursor: 'pointer' }} onClick={() => { this.toggleRules() }}>{(this.state.expandRules) ? <Icon icon={downArrowIcon} size='12' color='#333' /> : <Icon icon={rightArrowIcon} size='12' color='#333' />} <span style={{ fontWeight: 'bold' }}>Rules</span></div> : ''}
              <Collapse isOpen={this.state.expandRules}>
              <table style={{ width: '100%' }} cellPadding={0} cellSpacing={0}>
                <tbody>
                  {this._relationshipRules()}
                </tbody>
              </table>
              </Collapse>
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

  toggleRules =() => {
    if (this.state.expandRules) {
      this.setState({ expandRules: false })
    } else {
      this.setState({ expandRules: true })
    }
  }

  //****** helper functions and request functions
  //********************************************
  _relationshipRules = () => {
    const rows = []
    if (this.state.nodeData?.rules?.length > 0) {
      rows.push(
        <tr>
          <td className="relationshipTableStyleHeader">Origin Subtype</td>
          <td className="relationshipTableStyleHeader">Min</td>
          <td className="relationshipTableStyleHeader">Max</td>
          <td className="relationshipTableStyleHeader">Destination Subtype</td>
          <td className="relationshipTableStyleHeader">Min</td>
          <td className="relationshipTableStyleHeader">Max</td>
        </tr>
      )
      this.state.nodeData.rules.forEach((r: any, i: number) => {
        rows.push(
          <tr key={i}>
            <td className="relationshipTableStyle">{this._getSubtypeInfo(this.state.nodeData.originLayerId, r.originSubtypeCode)}</td>
            <td className="relationshipTableStyle">{r.originMinimumCardinality}</td>
            <td className="relationshipTableStyle">{r.originMaximumCardinality}</td>
            <td className="relationshipTableStyle">{this._getSubtypeInfo(this.state.nodeData.destinationLayerId, r.destinationSubtypeCode)}</td>
            <td className="relationshipTableStyle">{r.destinationMinimumCardinality}</td>
            <td className="relationshipTableStyle">{r.destinationMaximumCardinality}</td>
          </tr>
        )
      })
    } else {
      rows.push(
        <tr>
          <td className="relationshipTableStyleHeader">No rules defined.</td>
        </tr>
      )
    }
    return rows
  }

  _cardinalityLookup =(code: string) => {
    const possible = {
      esriRelCardinalityOneToMany: 'One to many',
      esriRelCardinalityOneToOne: 'One to one',
      esriRelCardinalityManyToMany: 'Many to many'
    }
    if (possible?.[code]) {
      return possible[code]
    } else {
      return code
    }
  }

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
    let foundLayer = ''
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

  _getSubtypeInfo = (layerId: number, subtypecode: number) => {
    let foundST = ''
    const filterDE = this.props.dataElements.filter((de: any) => {
      return (de.layerId === layerId)
    })
    if (filterDE.length > 0) {
      if (filterDE[0].dataElement?.subtypes) {
        const stMatch = filterDE[0].dataElement.subtypes.filter((st: any) => {
          return (st.subtypeCode === subtypecode)
        })
        if (stMatch.length > 0) {
          foundST = stMatch[0].subtypeName
        }
      }
    }
    return foundST
  }

  _matchCorresRelation = (id: number, direction: string) => {
    let found = null
    this.props.relationshipElements.forEach((re: any) => {
      if (re.id === id) {
        if (re.role !== direction) {
          found = re
        }
      }
    })
    return found
  };
}
