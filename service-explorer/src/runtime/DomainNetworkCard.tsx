/** @jsx jsx */
import { React, jsx } from 'jimu-core'
import { Icon, Collapse, Table } from 'jimu-ui'
import { TabContent, TabPane } from 'reactstrap'
import CardHeader from './_header'
import './css/custom.css'
import EsriLookup from './_constants'
const linkIcon = require('./assets/launch.svg')
const rightArrowIcon = require('jimu-ui/lib/icons/arrow-right.svg')
const downArrowIcon = require('jimu-ui/lib/icons/arrow-down.svg')

interface IProps {
  data: any
  dataElements: any
  domains: any
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
  expandTierGroup: boolean
  expandTiers: any
  expandTiersValidDevice: any
  expandTiersValidLine: any
  expandTiersValidSubnetworkControllers: any
  expandTiersAggregatedLines: any
  expandTiersTraceConfig: any
  expandClassSources: boolean
  expandClassLayers: any
  expandClassAG: any
  expandClassAT: any
  expandEdgeSources: boolean
  expandEdgeLayers: any
  expandEdgeAG: any
  expandEdgeAT: any
  minimizedDetails: boolean
  esriValueList: any
}

interface LayerAGAT {
  layer: any
  assetgroup: string
  assettype: string
}

export default class DomainNetworkCard extends React.Component <IProps, IState> {
  constructor (props: IProps) {
    super(props)

    this.state = {
      nodeData: this.props.data.data,
      activeTab: 'Properties',
      expandTierGroup: false,
      expandTiers: {},
      expandTiersValidDevice: {},
      expandTiersValidLine: {},
      expandTiersValidSubnetworkControllers: {},
      expandTiersAggregatedLines: {},
      expandTiersTraceConfig: {},
      expandClassSources: false,
      expandClassLayers: {},
      expandClassAG: {},
      expandClassAT: {},
      expandEdgeSources: false,
      expandEdgeLayers: {},
      expandEdgeAG: {},
      expandEdgeAT: {},
      minimizedDetails: false,
      esriValueList: new EsriLookup()
    }
  }

  componentWillMount () {
    const tiersCopy = { ...this.state.expandTiers }
    const tiersVDCopy = { ...this.state.expandTiersValidDevice }
    const tiersVLCopy = { ...this.state.expandTiersValidLine }
    const tiersVSCCopy = { ...this.state.expandTiersValidSubnetworkControllers }
    const tiersAGLCopy = { ...this.state.expandTiersAggregatedLines }
    const tiersTraceConfigCopy = { ...this.state.expandTiersTraceConfig }
    const classLayerCopy = { ...this.state.expandClassLayers }
    const classAGCopy = { ...this.state.expandClassAG }
    const classATCopy = { ...this.state.expandClassAT }
    const edgeLayerCopy = { ...this.state.expandEdgeLayers }
    const edgeAGCopy = { ...this.state.expandEdgeAG }
    const edgeATCopy = { ...this.state.expandEdgeAT }
    this.state.nodeData.tiers.forEach((t: any) => {
      tiersCopy[t.name] = 'none'
      tiersVDCopy[t.name] = false
      tiersVLCopy[t.name] = false
      tiersVSCCopy[t.name] = false
      tiersAGLCopy[t.name] = false
      tiersTraceConfigCopy[t.name] = false
    })
    this.state.nodeData.junctionSources.forEach((j: any) => {
      classLayerCopy[j.layerId] = 'none'
      classAGCopy[j.layerId] = false
      j.assetGroups.forEach((ag: any) => {
        classATCopy[ag.assetGroupName] = false
      })
    })
    this.state.nodeData.edgeSources.forEach((j: any) => {
      classLayerCopy[j.layerId] = 'none'
      classAGCopy[j.layerId] = false
      j.assetGroups.forEach((ag: any) => {
        classATCopy[ag.assetGroupName] = false
      })
    })
    this.setState({
      expandTiers: tiersCopy,
      expandTiersValidDevice: tiersVDCopy,
      expandTiersValidLine: tiersVLCopy,
      expandTiersValidSubnetworkControllers: tiersVSCCopy,
      expandTiersAggregatedLines: tiersAGLCopy,
      expandTiersTraceConfig: tiersTraceConfigCopy,
      expandClassLayers: classLayerCopy,
      expandClassAG: classAGCopy,
      expandClassAT: classATCopy,
      expandEdgeLayers: edgeLayerCopy,
      expandEdgeAG: edgeAGCopy,
      expandEdgeAT: edgeATCopy
    })
  }

  componentDidMount () {
    //this._processData();
    // console.log(this.props.dataElements);
    // console.log(this.state.nodeData.junctionSources);
    // console.log(this.state.nodeData.tiers);
  }

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
          <div style={{ paddingTop: 5, paddingBottom: 5, fontSize: 'smaller' }}>{this.buildCrumb()}<span style={{ fontWeight: 'bold' }}>Properties</span></div>
          <div style={{ paddingTop: 5, paddingBottom: 5 }}><span style={{ fontWeight: 'bold' }}>Name:</span> {this.state.nodeData.domainNetworkAliasName}</div>
          <div style={{ paddingTop: 5, paddingBottom: 5 }}><span style={{ fontWeight: 'bold' }}>Field Name:</span> {this.state.nodeData.subnetworkLabelFieldName}</div>
          <div style={{ paddingTop: 5, paddingBottom: 5 }}><span style={{ fontWeight: 'bold' }}>Tier Definition:</span> {this.state.esriValueList.lookupValue(this.state.nodeData.tierDefinition)}</div>
          <div style={{ paddingTop: 5, paddingBottom: 5, cursor: 'pointer' }} onClick={() => { this.toggleTierGroup() }}>{(this.state.expandTierGroup) ? <Icon icon={downArrowIcon} size='12' color='#333' /> : <Icon icon={rightArrowIcon} size='12' color='#333' />} <span style={{ fontWeight: 'bold' }}>Tiers</span></div>
          <Collapse isOpen={this.state.expandTierGroup}>
            <div style={{ minHeight: 100, maxHeight: 500, overflow: 'auto', paddingRight: 2, borderWidth: 2, borderStyle: 'solid', borderColor: '#ccc' }}>
              {(this.state.nodeData.tiers.length > 0) ? this._createTiersTable() : 'No tiers exist'}
            </div>
          </Collapse>
          <div style={{ paddingTop: 5, paddingBottom: 5, cursor: 'pointer' }} onClick={() => { this.toggleClassSources() }}>{(this.state.expandClassSources) ? <Icon icon={downArrowIcon} size='12' color='#333' /> : <Icon icon={rightArrowIcon} size='12' color='#333' />} <span style={{ fontWeight: 'bold' }}>Classes</span></div>
          <Collapse isOpen={this.state.expandClassSources}>
            <div style={{ minHeight: 100, maxHeight: 500, overflow: 'auto', paddingRight: 2, borderWidth: 2, borderStyle: 'solid', borderColor: '#ccc' }}>
              {(this.state.nodeData.junctionSources.length > 0 || this.state.nodeData.edgeSources.length > 0) ? this._createSourceTable() : 'No class exist'}
            </div>
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
  toggleTierGroup =() => {
    if (this.state.expandTierGroup) {
      this.setState({ expandTierGroup: false })
    } else {
      this.setState({ expandTierGroup: true })
    }
  }

  toggleTiers =(name: string) => {
    const tierGroupCopy = { ...this.state.expandTiers }
    if (tierGroupCopy[name] === 'table-row') {
      tierGroupCopy[name] = 'none'
      this.setState({ expandTiers: tierGroupCopy }, () => {
        this.setState(this.state)
      })
    } else {
      tierGroupCopy[name] = 'table-row'
      this.setState({ expandTiers: tierGroupCopy }, () => {
        this.setState(this.state)
      })
    }
  }

  toggleTiersValidDevice =(name: string) => {
    const tierGroupCopy = { ...this.state.expandTiersValidDevice }
    if (tierGroupCopy[name] === false) {
      tierGroupCopy[name] = true
      this.setState({ expandTiersValidDevice: tierGroupCopy })
    } else {
      tierGroupCopy[name] = false
      this.setState({ expandTiersValidDevice: tierGroupCopy })
    }
  }

  toggleTiersValidLine =(name: string) => {
    const tierGroupCopy = { ...this.state.expandTiersValidLine }
    if (tierGroupCopy[name] === false) {
      tierGroupCopy[name] = true
      this.setState({ expandTiersValidLine: tierGroupCopy })
    } else {
      tierGroupCopy[name] = false
      this.setState({ expandTiersValidLine: tierGroupCopy })
    }
  }

  toggleTiersValidSubnetworkControllers =(name: string) => {
    const tierGroupCopy = { ...this.state.expandTiersValidSubnetworkControllers }
    if (tierGroupCopy[name] === false) {
      tierGroupCopy[name] = true
      this.setState({ expandTiersValidSubnetworkControllers: tierGroupCopy })
    } else {
      tierGroupCopy[name] = false
      this.setState({ expandTiersValidSubnetworkControllers: tierGroupCopy })
    }
  }

  toggleTiersAggregatedLines =(name: string) => {
    const tierGroupCopy = { ...this.state.expandTiersAggregatedLines }
    if (tierGroupCopy[name] === false) {
      tierGroupCopy[name] = true
      this.setState({ expandTiersAggregatedLines: tierGroupCopy })
    } else {
      tierGroupCopy[name] = false
      this.setState({ expandTiersAggregatedLines: tierGroupCopy })
    }
  }

  toggleTiersTraceConfig =(name: string) => {
    const tierGroupCopy = { ...this.state.expandTiersTraceConfig }
    if (tierGroupCopy[name] === false) {
      tierGroupCopy[name] = true
      this.setState({ expandTiersTraceConfig: tierGroupCopy })
    } else {
      tierGroupCopy[name] = false
      this.setState({ expandTiersTraceConfig: tierGroupCopy })
    }
  }

  toggleClassSources =() => {
    if (this.state.expandClassSources) {
      this.setState({ expandClassSources: false })
    } else {
      this.setState({ expandClassSources: true })
    }
  }

  toggleValidClass =(name: string) => {
    const classLayerCopy = { ...this.state.expandClassLayers }
    if (classLayerCopy[name] === 'none') {
      classLayerCopy[name] = 'table-row'
      this.setState({ expandClassLayers: classLayerCopy })
    } else {
      classLayerCopy[name] = 'none'
      this.setState({ expandClassLayers: classLayerCopy })
    }
  }

  toggleValidEdges =(name: string) => {
    const edgeLayerCopy = { ...this.state.expandEdgeLayers }
    if (edgeLayerCopy[name] === 'none') {
      edgeLayerCopy[name] = 'table-row'
      this.setState({ expandEdgeLayers: edgeLayerCopy })
    } else {
      edgeLayerCopy[name] = 'none'
      this.setState({ expandEdgeLayers: edgeLayerCopy })
    }
  }

  toggleValidEdgesAT =(name: string) => {
    const edgeLayerCopy = { ...this.state.expandEdgeAT }
    if (edgeLayerCopy[name] === false) {
      edgeLayerCopy[name] = true
      this.setState({ expandEdgeAT: edgeLayerCopy })
    } else {
      edgeLayerCopy[name] = false
      this.setState({ expandEdgeAT: edgeLayerCopy })
    }
  }

  toggleValidClassAT =(name: string) => {
    const classLayerCopy = { ...this.state.expandClassAT }
    if (classLayerCopy[name] === false) {
      classLayerCopy[name] = true
      this.setState({ expandClassAT: classLayerCopy })
    } else {
      classLayerCopy[name] = false
      this.setState({ expandClassAT: classLayerCopy })
    }
  }

  toggleEdgeSources =() => {
    if (this.state.expandEdgeSources) {
      this.setState({ expandEdgeSources: false })
    } else {
      this.setState({ expandEdgeSources: true })
    }
  }

  _createTiersTable =() => {
    const arrList = []
    this.state.nodeData.tiers.forEach((ft: any, i: number) => {
      arrList.push(
        <tr key={i}>
          <td style={{ fontSize: 'small' }}>
          <div style={{ cursor: 'pointer' }} onClick={() => { this.toggleTiers(ft.name) }}>{(this.state.expandTiers[ft.name] === 'table-row') ? <Icon icon={downArrowIcon} size='12' color='#333' /> : <Icon icon={rightArrowIcon} size='12' color='#333' />} {ft.name}</div>
          </td>
          <td style={{ fontSize: 'small' }}>{ft.tierGroupName}</td>
          <td style={{ fontSize: 'small' }}>{ft.rank}</td>
          <td style={{ fontSize: 'small' }}>{ft.subnetworkFieldName}</td>
          <td style={{ fontSize: 'small' }}>{this.state.esriValueList.lookupValue(ft.tierTopology)}</td>
        </tr>
      )
      arrList.push(
        <tr key={i + '_hidden'} style={{ display: this.state.expandTiers[ft.name] }}>
          <td colSpan={5} style={{ fontSize: 'small', paddingLeft: 25 }} >
            <div style={{ cursor: 'pointer' }} onClick={() => { this.toggleTiersValidDevice(ft.name) }}>{(this.state.expandTiersValidDevice[ft.name]) ? <Icon icon={downArrowIcon} size='12' color='#333' /> : <Icon icon={rightArrowIcon} size='12' color='#333' />} Valid Devices</div>
            <Collapse isOpen={this.state.expandTiersValidDevice[ft.name]}>
            <div>{this._createValidAssetsTable(ft.validDevices, 'Device', 'junction')}</div>
            </Collapse>
            <div style={{ cursor: 'pointer', paddingTop: 10 }} onClick={() => { this.toggleTiersValidLine(ft.name) }}>{(this.state.expandTiersValidLine[ft.name]) ? <Icon icon={downArrowIcon} size='12' color='#333' /> : <Icon icon={rightArrowIcon} size='12' color='#333' />} Valid Lines</div>
            <Collapse isOpen={this.state.expandTiersValidLine[ft.name]}>
            <div>{this._createValidAssetsTable(ft.validLines, 'Line', 'edge')}</div>
            </Collapse>
            <div style={{ cursor: 'pointer', paddingTop: 10 }} onClick={() => { this.toggleTiersValidSubnetworkControllers(ft.name) }}>{(this.state.expandTiersValidSubnetworkControllers[ft.name]) ? <Icon icon={downArrowIcon} size='12' color='#333' /> : <Icon icon={rightArrowIcon} size='12' color='#333' />} Valid Subnetwork Controllers</div>
            <Collapse isOpen={this.state.expandTiersValidSubnetworkControllers[ft.name]}>
            <div>{this._createValidAssetsTable(ft.validSubnetworkControllers, 'Device', 'junction')}</div>
            </Collapse>
            <div style={{ cursor: 'pointer', paddingTop: 10 }} onClick={() => { this.toggleTiersAggregatedLines(ft.name) }}>{(this.state.expandTiersAggregatedLines[ft.name]) ? <Icon icon={downArrowIcon} size='12' color='#333' /> : <Icon icon={rightArrowIcon} size='12' color='#333' />} Aggregated Lines for Subnetwork</div>
            <Collapse isOpen={this.state.expandTiersAggregatedLines[ft.name]}>
            <div>{this._createValidAssetsTable(ft.aggregatedLinesForSubnetLine, 'Line', 'edge')}</div>
            </Collapse>
            <div style={{ cursor: 'pointer', paddingTop: 10 }} onClick={() => { this.toggleTiersTraceConfig(ft.name) }}>{(this.state.expandTiersTraceConfig[ft.name]) ? <Icon icon={downArrowIcon} size='12' color='#333' /> : <Icon icon={rightArrowIcon} size='12' color='#333' />} Trace Configuration</div>
            <Collapse isOpen={this.state.expandTiersTraceConfig[ft.name]}>
            <div>{this._createTraceConfigTable(ft.updateSubnetworkTraceConfiguration)}</div>
            </Collapse>
          </td>
        </tr>
      )
    })
    const tableObj = <Table hover>
    <thead>
    <tr>
      <th style={{ fontSize: 'small', fontWeight: 'bold' }}>Name</th>
      <th style={{ fontSize: 'small', fontWeight: 'bold' }}>Group</th>
      <th style={{ fontSize: 'small', fontWeight: 'bold' }}>Rank</th>
      <th style={{ fontSize: 'small', fontWeight: 'bold' }}>Subnetwork Field</th>
      <th style={{ fontSize: 'small', fontWeight: 'bold' }}>Topology</th>
    </tr>
    </thead>
    <tbody>
      {arrList}
    </tbody>
    </Table>
    return tableObj
  }

  _createTierDetailsTable =(tierInfo: any) => {
    const arrTables = []
    if (tierInfo.validDevices.length > 0) {
      arrTables.push(this._createValidAssetsTable(tierInfo.validDevices, 'Device', 'junction'))
      arrTables.push(this._createValidAssetsTable(tierInfo.validLines, 'Line', 'edge'))
    }
    return arrTables
  }

  _createValidAssetsTable =(asset: any, type: string, source: string) => {
    const arrList = []
    const atList = (d: any, domainName: string, subtype: string) => {
      const list = []
      d.assetTypes.forEach((at: any, z: number) => {
        const validAT = this._ATCodeLookup(at.assetTypeCode, domainName)
        list.push(<div key={at.assetTypeCode + '_' + z}>
        <div style={{ cursor: 'pointer' }} onClick={() => { this.props.callbackLinkage(validAT, 'Assettype', this.props.panel, this.state.nodeData.domainNetworkAliasName + ' ' + type, subtype) }} style={{ display: 'inline-block', verticalAlign: 'top', paddingRight: 5, cursor: 'pointer' }}><Icon icon={linkIcon} size='12' color='#333' />{validAT}</div>
        </div>)
      })
      return list
    }
    asset.forEach((d: any, i: number) => {
      const validAsset = this._AGCodeLookup(d.assetGroupCode, source, type)
      arrList.push(
        <tr key={i}>
          <td style={{ fontSize: 'small' }}>
          <div style={{ cursor: 'pointer' }} onClick={() => { this.props.callbackLinkage(validAsset.ag, 'Subtype', this.props.panel, this.state.nodeData.domainNetworkAliasName + ' ' + type) }} style={{ display: 'inline-block', verticalAlign: 'top', paddingRight: 5, cursor: 'pointer' }}><Icon icon={linkIcon} size='12' color='#333' /> {validAsset.ag}</div>
          </td>
          <td style={{ fontSize: 'small' }}>{atList(d, validAsset.ATDomain, validAsset.ag)}</td>
        </tr>
      )
    })

    const tableObj = <Table hover>
    <thead>
    <tr>
      <th style={{ fontSize: 'small', fontWeight: 'bold' }}>Valid {type}</th>
      <th style={{ fontSize: 'small', fontWeight: 'bold' }}>Type</th>
    </tr>
    </thead>
    <tbody>
      {arrList}
    </tbody>
    </Table>
    return tableObj
  }

  _createTraceConfigTable =(tc: any) => {
    const tableObj = <Table hover>
      <tr><td>Traversability Scope: </td><td>{tc.traversabilityScope}</td></tr>
      <tr><td>Condition Barriers: </td><td>{this._handleConditions(tc.conditionBarriers)}</td></tr>
      <tr><td>Function Barriers: </td><td>{this._handleBarriers(tc.functionBarriers)}</td></tr>
      <tr><td>Filter Function Barriers: </td><td>{this._handleBarriers(tc.filterFunctionBarriers)}</td></tr>
      <tr><td>Functions: </td><td>{this._handleFunctions(tc.functions)}</td></tr>
      <tr><td>Output Filters: </td><td>{this._handleOutputFilters(tc.outputFilters)}</td></tr>
      <tr><td>Output Conditions: </td><td>{this._handleConditions(tc.outputConditions)}</td></tr>
    </Table>
    return tableObj
    //      <tr><td>Propagators: </td><td>{tc.traversabilityScope}</td></tr>
    // <tr><td>Arcade Expression Barrier: </td><td>{tc.arcadeExpressionBarrier}</td></tr>
  }

  _handleConditions = (cond: any) => {
    const list = []
    cond.forEach((c: any, i: number) => {
      //c.type
      let valueStr = c.name + ' ' + c.operator + ' ' + c.value
      if (cond.length > 1) {
        if (i < cond.length - 1) {
          if (c.combineUsingOr) {
            valueStr = valueStr + ' or '
          } else {
            valueStr = valueStr + ' and '
          }
        }
      }
      list.push(
        <div key={i}>{valueStr}</div>
      )
    })
    return list
  }

  _handleBarriers = (barr: any) => {
    const list = []
    barr.forEach((c: any, i: number) => {
      //c.type
      const valueStr = c.functionType + ' where ' + c.networkAttributeName + ' ' + c.operator + ' ' + c.value
      list.push(
        <div key={i}>{valueStr}</div>
      )
    })
    return list
  }

  _handleFunctions = (func: any) => {
    const list = []
    func.forEach((f: any, i: number) => {
      //c.type
      list.push(
        <div key={i} style={{ paddingBottom: 10 }}>
          <div>{f.functionType} {f.networkAttributeName} into {f.summaryAttributeName} where</div>
          <div>{this._handleConditions(f.conditions)}</div>
        </div>
      )
    })
    return list
  }

  _handleFilters = (cond: any) => {
    const list = []
    cond.forEach((c: any, i: number) => {
      //c.type
      let valueStr = c.name + ' ' + c.operator + ' ' + c.value
      if (cond.length > 1) {
        if (i < cond.length - 1) {
          if (c.combineUsingOr) {
            valueStr = valueStr + ' or '
          } else {
            valueStr = valueStr + ' and '
          }
        }
      }
      list.push(
        <div key={i}>{valueStr}</div>
      )
    })
    return list
  }

  _handleOutputFilters =(of: any) => {
    const list = []
    if (of.length > 0) {
      list.push(
        <div>Output will only consist of: </div>
      )
    }
    of.forEach((c: any, i: number) => {
      const data = this._sourceIdLookup(c.assetGroupCode, c.assetTypeCode, c.networkSourceId)
      let valueStr = c.assetGroupCode + ' - ' + c.assetTypeCode
      if (data?.assetgroup) {
        valueStr = 'Layer: ' + data.layer + ', Subtype: ' + data.assetgroup + ', Asset type: ' + data.assettype
      } else {
        valueStr = 'Layer: ' + c.networkSourceId + ', Subtype: ' + c.assetGroupCode + ', Asset type: ' + c.assetTypeCode
      }
      list.push(
        <div key={i}>{valueStr}</div>
      )
    })
    return list
  }

  _createSourceTable =() => {
    const arrList = []
    const validAG = (j: any, layerName: string) => {
      const collection = []
      j.assetGroups.forEach((ag: any, z: number) => {
        const ATList = []
        ag.assetTypes.forEach((at: any, a: number) => {
          const catList = []
          at.categories.forEach((c: any, b: number) => {
            catList.push(
              <div id={b + '_c'}><span style={{ cursor: 'pointer' }} onClick={() => { this.props.callbackLinkage(c, 'Category', this.props.panel) }}><Icon icon={linkIcon} size='12' color='#333' /> {c}</span></div>
            )
          })
          let terminalConfig = ''
          if (at.isTerminalConfigurationSupported) {
            terminalConfig = at.terminalConfigurationId
          }
          ATList.push(<tr id={a + '_at'}>
            <td><span style={{ cursor: 'pointer' }} onClick={() => { this.props.callbackLinkage(at.assetTypeName, 'Assettype', this.props.panel, layerName, ag.assetGroupName) }}><Icon icon={linkIcon} size='12' color='#333' /> {at.assetTypeName}</span></td>
            <td>{(at.associationRoleType.indexOf('Container') > 0) ? this.state.esriValueList.lookupValue(at.associationRoleType) : ''}</td>
            <td>{(at.associationRoleType.indexOf('Container') > 0) ? '1:' + at.containmentViewScale : ''}</td>
            <td>{(at.associationDeleteType.indexOf('None') > 0) ? '' : this.state.esriValueList.lookupValue(at.associationDeleteType)}</td>
            <td>{this._terminalLookup(terminalConfig)}</td>
            <td>{catList}</td>
          </tr>)
        })

        collection.push(<tr id={z + '_junction'}>
          <td><span style={{ cursor: 'pointer' }} onClick={() => { this.props.callbackLinkage(ag.assetGroupName, 'Subtype', this.props.panel, layerName) }}><Icon icon={linkIcon} size='12' color='#333' /> {ag.assetGroupName}</span></td>
          <td>
          <div style={{ cursor: 'pointer' }} onClick={() => { this.toggleValidClassAT(ag.assetGroupName) }}>{(this.state.expandClassAT[ag.assetGroupName]) ? <Icon icon={downArrowIcon} size='12' color='#333' /> : <Icon icon={rightArrowIcon} size='12' color='#333' />} Asset Types</div>
          <Collapse isOpen={this.state.expandClassAT[ag.assetGroupName]}>
            <table>
              <tr>
                <th>Name</th>
                <th>Association Role</th>
                <th>Container View Scale</th>
                <th>Association Deletion Semantics</th>
                <th>Terminal Configuration</th>
                <th>Category</th>
              </tr>
              {ATList}
            </table>
          </Collapse>
          </td>
        </tr>)
      })
      return collection
    }
    const classList = ['junctionSources', 'edgeSources']
    classList.forEach((cl: any) => {
      this.state.nodeData[cl].forEach((j: any, i: number) => {
        arrList.push(
          <tr key={i}>
            <td style={{ fontSize: 'small' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => { this.props.callbackLinkage(this._layerLookup(j.layerId), 'Layer', this.props.panel) }}><Icon icon={linkIcon} size='12' color='#333' /> </span>
            <span style={{ cursor: 'pointer' }} onClick={() => { this.toggleValidClass(j.layerId) }}>{(this.state.expandClassLayers[j.layerId] === 'table-row') ? <Icon icon={downArrowIcon} size='12' color='#333' /> : <Icon icon={rightArrowIcon} size='12' color='#333' />} {this._layerLookup(j.layerId)}</span>
            </td>
          </tr>
        )
        arrList.push(
          <tr key={i + '_hidden'} style={{ display: this.state.expandClassLayers[j.layerId] }}>
            <td colSpan={5} style={{ fontSize: 'small', paddingLeft: 50 }} >
              <table>
                <tr>
                  <th>Asset Group</th>
                  <th>Asset Type</th>
                </tr>
                {validAG(j, this._layerLookup(j.layerId))}
              </table>
            </td>
          </tr>
        )
      })
    })
    const tableObj = <Table hover>
    <thead>
    <tr>
      <th style={{ fontSize: 'small', fontWeight: 'bold' }}>Layer</th>
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
  _AGCodeLookup =(value: any, source: string, type: string) => {
    let alias = value
    let layerMatch = -1
    if (source === 'junction') {
      const filteredJunc = this.state.nodeData.junctionSources.filter((js: any) => {
        return ((js.utilityNetworkFeatureClassUsageType).indexOf(type) > -1)
      })
      if (filteredJunc.length > 0) {
        layerMatch = filteredJunc[0].layerId
      }
    } else {
      //edge
      const filteredEdge = this.state.nodeData.edgeSources.filter((js: any) => {
        return ((js.utilityNetworkFeatureClassUsageType).indexOf(type) > -1)
      })
      if (filteredEdge.length > 0) {
        layerMatch = filteredEdge[0].layerId
      }
    }
    const filteredDE = this.props.dataElements.filter((de: any) => {
      return (de.layerId === layerMatch)
    })
    if (filteredDE.length > 0) {
      const match = filteredDE[0].dataElement.subtypes.filter((st: any) => {
        return st.subtypeCode === value
      })
      if (match.length > 0) {
        const atField = match[0].fieldInfos.filter((fi: any) => {
          return (fi.fieldName === 'assettype')
        })
        if (atField.length > 0) {
          alias = { ag: match[0].subtypeName, ATDomain: atField[0].domainName }
        } else {
          alias = { ag: match[0].subtypeName, ATDomain: '' }
        }
      }
    }
    return alias
  }

  _ATCodeLookup =(value: any, domainName: string) => {
    let alias = value
    const domain = this._validAssetTypes(domainName)
    if (domain.length > 0) {
      const filteredDomain = domain[0].codedValues.filter((cv: any) => {
        return cv.code === value
      })
      if (filteredDomain.length > 0) {
        alias = filteredDomain[0].name
      }
    }
    return alias
  }

  _validAssetTypes =(lookup: string) => {
    const domainVals = this.props.domains.filter((d: any) => {
      return (d.name === lookup)
    })
    return domainVals
  }

  _layerLookup = (param: any) => {
    let layerName = param
    const filtered = this.props.dataElements.filter((de: any) => {
      return de.layerId === param
    })
    if (filtered.length > 0) {
      layerName = filtered[0].dataElement.aliasName
    }
    return layerName
  }

  _sourceIdLookup =(asg: number, ast: number, sourceId: number) => {
    const layerData: LayerAGAT = null
    let filteredSource = this.state.nodeData.junctionSources.filter((js: any) => {
      return (js.sourceId === sourceId)
    })
    if (filteredSource.length === 0) {
      filteredSource = this.state.nodeData.edgeSources.filter((es: any) => {
        return (parseInt(es.sourceId) === sourceId)
      })
    }
    if (filteredSource.length > 0) {
      layerData.layer = this._layerLookup(filteredSource[0].layerId)
      const filteredAG = filteredSource[0].assetGroups.filter((ag: any) => {
        return (parseInt(ag.assetGroupCode) === asg)
      })
      if (filteredAG.length > 0) {
        layerData.assetgroup = filteredAG[0].assetGroupName
      }

      if (filteredAG.length > 0) {
        const filteredAT = filteredAG[0].assetTypes.filter((at: any) => {
          return (parseInt(at.assetTypeCode) === ast)
        })
        if (filteredAT.length > 0) {
          layerData.assettype = filteredAT[0].assetTypeName
        }
      }
    }
    return layerData
  }

  _terminalLookup = (ter: any) => {
    let terminalLabel = ter
    const filteredDE = this.props.dataElements.filter((de: any) => {
      return (de.dataElement?.terminalConfigurations)
    })
    if (filteredDE.length > 0) {
      const filteredTC = filteredDE[0].dataElement.terminalConfigurations.filter((tc: any) => {
        return (tc.terminalConfigurationId === ter)
      })
      if (filteredTC.length > 0) {
        terminalLabel = filteredTC[0].terminalConfigurationName
      }
    }
    return terminalLabel
  }
}
