/** @jsx jsx */
import { React, jsx } from 'jimu-core'
import { Collapse, Icon, Table } from 'jimu-ui'
import { TabContent, TabPane } from 'reactstrap'
import CardHeader from './_header'
import EsriLookup from './_constants'
import './css/custom.css'
const rightArrowIcon = require('jimu-ui/lib/icons/arrow-right.svg')
const downArrowIcon = require('jimu-ui/lib/icons/arrow-down.svg')
const linkIcon = require('./assets/launch.svg')

interface IProps {
  data: any
  domains: any
  requestURL: string
  key: any
  panel: number
  config: any
  cacheData: any
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
  siteStats: any
  statsOutput: any
  activeTab: string
  domainHolder: any
  fields: any
  fieldNameHolder: any
  fieldHolder: any
  indexes: any
  expandFields: boolean
  expandSubtypes: boolean
  expandIndexes: boolean
  metadataElements: any
  metadataDescription: string
  minimizedDetails: boolean
  esriValueList: any
}

export default class LayerCard extends React.Component <IProps, IState> {
  constructor (props: IProps) {
    super(props)

    this.state = {
      nodeData: this.props.data.data,
      siteStats: {},
      statsOutput: [],
      activeTab: 'Properties',
      domainHolder: {},
      fields: [],
      fieldNameHolder: {},
      fieldHolder: [],
      indexes: [],
      expandFields: false,
      expandSubtypes: false,
      expandIndexes: false,
      metadataElements: null,
      metadataDescription: '',
      minimizedDetails: false,
      esriValueList: new EsriLookup()
    }
  }

  componentWillMount () {
    const fieldList = {}
    let fields = []
    let indexes = []
    let layerDesc = ''
    if (this.props.data.data?.dataElement) {
      if (this.props.data.data.dataElement?.fields) {
        this.props.data.data.dataElement.fields.fieldArray.forEach((fd: any) => {
          fieldList[fd.name] = false
        })
        fields = this.props.data.data.dataElement.fields.fieldArray
      }
      if (this.props.data.data.dataElement?.indexes) {
        indexes = this.props.data.data.dataElement.indexes.indexArray
      }
    } else {
      this.props.data.data.fields.forEach((f: any) => {
        fieldList[f.name] = false
      })
      fields = this.props.data.data.fields
      indexes = this.props.data.data.indexes
    }

    this._requestMetadata().then(() => {
      if (this.state.metadataElements !== null) {
        layerDesc = this._removeTags(this._unescapeHTML(this._processMetaData()))
        //console.log(layerDesc);
      }
      this.setState({ fieldHolder: fieldList, fields: fields, indexes: indexes, metadataDescription: layerDesc })
    })
  }

  componentDidMount () {
  }

  render () {
    const description = this._removeTags(this._unescapeHTML((this.state.metadataDescription !== '') ? this.state.metadataDescription : (this.state.nodeData?.dataElement) ? (this.state.nodeData.dataElement.description) ? this.state.nodeData.dataElement.description : '' : this.state.nodeData.description))

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
          <div style={{ paddingTop: 5, paddingBottom: 5 }}><span style={{ fontWeight: 'bold' }}>Name:</span> {(this.state.nodeData?.dataElement) ? this.state.nodeData.dataElement.aliasName : this.state.nodeData.name}</div>
          <div style={{ paddingTop: 5, paddingBottom: 5 }}><span style={{ fontWeight: 'bold' }}>Description:</span> <span dangerouslySetInnerHTML={{ __html: description }}></span></div>
          <div style={{ paddingTop: 5, paddingBottom: 5 }}><span style={{ fontWeight: 'bold' }}>Layer Id:</span> {(this.state.nodeData?.layerId) ? this.state.nodeData.layerId : this.state.nodeData.id}</div>
          <div style={{ paddingTop: 5, paddingBottom: 5 }}><span style={{ fontWeight: 'bold' }}>Global Id:</span> {(this.state.nodeData?.dataElement) ? (this.state.nodeData.dataElement.hasGlobalID) ? this.state.nodeData.dataElement.globalIdFieldName : 'None' : this.state.nodeData.globalIdField}</div>
          <div style={{ paddingTop: 5, paddingBottom: 5 }}><span style={{ fontWeight: 'bold' }}>Object Id:</span> {(this.state.nodeData?.dataElement) ? (this.state.nodeData.dataElement.hasOID) ? this.state.nodeData.dataElement.oidFieldName : 'None' : this.state.nodeData.objectIdField}</div>
          <div style={{ paddingTop: 5, paddingBottom: 5 }}><span style={{ fontWeight: 'bold' }}>Shape:</span> {(this.state.nodeData?.dataElement) ? this.state.esriValueList.lookupValue(this.state.nodeData.dataElement.shapeType) : this.state.esriValueList.lookupValue(this.state.nodeData.geometryType)}</div>
            {
            (this.state.nodeData?.dataElement)
              ? (this.state.nodeData.dataElement?.controllerMemberships)
                  ? (this.state.nodeData.dataElement.controllerMemberships.length > 0)
                      ? (this.state.nodeData.dataElement.controllerMemberships.length > 1)
                          ? <div style={{ paddingTop: 5, paddingBottom: 5 }}><span style={{ fontWeight: 'bold' }}>Controller Memberships:</span> {this._getControllerMemberships(this.state.nodeData.dataElement.controllerMemberships)}</div>
                          : <div style={{ paddingTop: 5, paddingBottom: 5 }}><span style={{ fontWeight: 'bold' }}>Controller Membership:</span> {this._getControllerMemberships(this.state.nodeData.dataElement.controllerMemberships)}</div>
                      : ''
                  : ''
              : ''
            }
          {
            (this.state.nodeData?.capabilities) &&
            <div style={{ paddingTop: 5, paddingBottom: 5 }}><span style={{ fontWeight: 'bold' }}>Capabilities:</span> {this.state.nodeData.capabilities}</div>
          }
          {
            (this.state.nodeData?.dataElement)
              ? (this.state.nodeData.dataElement?.subtypeFieldName) &&
              <div style={{ paddingTop: 5, paddingBottom: 5 }}><span style={{ fontWeight: 'bold' }}>Subtype Field:</span> {this.state.nodeData.dataElement.subtypeFieldName}</div>
              : ''
          }
          { (this.state.nodeData?.dataElement)
            ? (this.state.nodeData.dataElement?.subtypes) &&
              <div style={{ paddingTop: 5, paddingBottom: 5, cursor: 'pointer' }} onClick={() => { this.toggleExpandSubtypesBlock() }}>{(this.state.expandSubtypes) ? <Icon icon={downArrowIcon} size='12' color='#333' /> : <Icon icon={rightArrowIcon} size='12' color='#333' />} <span style={{ fontWeight: 'bold' }}>Subtypes</span></div>
            : (this.state.nodeData?.types)
                ? (this.state.nodeData.types.length > 0)
                    ? <div style={{ paddingTop: 5, paddingBottom: 5, cursor: 'pointer' }} onClick={() => { this.toggleExpandSubtypesBlock() }}>{(this.state.expandSubtypes) ? <Icon icon={downArrowIcon} size='12' color='#333' /> : <Icon icon={rightArrowIcon} size='12' color='#333' />} <span style={{ fontWeight: 'bold' }}>{'Types (' + this.state.nodeData.typeIdField + ')'}</span></div>
                    : ''
                : ''
          }
          { (this.state.nodeData?.dataElement)
            ? (this.state.nodeData.dataElement?.subtypes) &&
              <Collapse isOpen={this.state.expandSubtypes}>
              <div style={{ minHeight: 100, maxHeight: 500, overflowY: 'auto', borderWidth: 2, borderStyle: 'solid', borderColor: '#ccc' }}>
                  <Table hover>
                    <thead>
                    <tr>
                      <th style={{ fontSize: 'small', fontWeight: 'bold' }}>Name</th>
                      <th style={{ fontSize: 'small', fontWeight: 'bold' }}>Code</th>
                    </tr>
                    </thead>
                    <tbody>
                      {this._createSubtypesList()}
                    </tbody>
                  </Table>
              </div>
              </Collapse>
            : (this.state.nodeData?.types)
                ? (this.state.nodeData.types.length > 0)
                    ? <Collapse isOpen={this.state.expandSubtypes}>
                <div style={{ minHeight: 100, maxHeight: 500, overflowY: 'auto', borderWidth: 2, borderStyle: 'solid', borderColor: '#ccc' }}>
                    <Table hover>
                      <thead>
                      <tr>
                        <th style={{ fontSize: 'small', fontWeight: 'bold' }}>Name</th>
                        <th style={{ fontSize: 'small', fontWeight: 'bold' }}>Code</th>
                      </tr>
                      </thead>
                      <tbody>
                        {this._createBasicTypesList()}
                      </tbody>
                    </Table>
                </div>
                </Collapse>
                    : ''
                : ''
          }
          {(this.state.fields.length > 0) &&
          <div style={{ paddingTop: 5, paddingBottom: 5, cursor: 'pointer' }} onClick={() => { this.toggleExpandFieldBlock() }}>{(this.state.expandFields) ? <Icon icon={downArrowIcon} size='12' color='#333' /> : <Icon icon={rightArrowIcon} size='12' color='#333' />} <span style={{ fontWeight: 'bold' }}>Fields</span></div>
          }
          {(this.state.fields.length > 0) &&
          <Collapse isOpen={this.state.expandFields}>
          <div style={{ minHeight: 100, maxHeight: 500, overflowY: 'auto', borderWidth: 2, borderStyle: 'solid', borderColor: '#ccc' }}>
              <Table hover>
                <thead>
                <tr>
                  <th style={{ fontSize: 'small', fontWeight: 'bold' }}>Field Name</th>
                  <th style={{ fontSize: 'small', fontWeight: 'bold' }}>Alias</th>
                  <th style={{ fontSize: 'small', fontWeight: 'bold' }}>Description</th>
                  <th style={{ fontSize: 'small', fontWeight: 'bold' }}>Domain</th>
                </tr>
                </thead>
                <tbody>
                 {this._createFieldList()}
                </tbody>
              </Table>
          </div>
          </Collapse>
          }
          {(this.state.indexes.length > 0) &&
          <div style={{ paddingTop: 5, paddingBottom: 5, cursor: 'pointer' }} onClick={() => { this.toggleExpandIndexBlock() }}>{(this.state.expandIndexes) ? <Icon icon={downArrowIcon} size='12' color='#333' /> : <Icon icon={rightArrowIcon} size='12' color='#333' />} <span style={{ fontWeight: 'bold' }}>Indexes</span></div>
          }
          {(this.state.indexes.length > 0) &&
          <Collapse isOpen={this.state.expandIndexes}>
          <div style={{ minHeight: 100, maxHeight: 500, overflowY: 'auto', borderWidth: 2, borderStyle: 'solid', borderColor: '#ccc' }}>
              <Table hover>
                <thead>
                <tr>
                  <th style={{ fontSize: 'small', fontWeight: 'bold' }}>Name</th>
                  <th style={{ fontSize: 'small', fontWeight: 'bold' }}>Field</th>
                </tr>
                </thead>
                <tbody>
                 {this._createIndexList()}
                </tbody>
              </Table>
          </div>
          </Collapse>
          }
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

  toggleTabs (tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      })

      switch (tab) {
        case 'Statistics': {
          const atList = this._validAssetTypes('assettype')
          this._requestObject('ASSETGROUP=' + this.props.data.data.subtypeCode, 'all')
          if (atList.length > 0) {
            atList[0].codedValues.forEach((cv: any) => {
              this._requestObject('(ASSETGROUP=' + this.props.data.data.subtypeCode + ' and ASSETTYPE=' + cv.code + ')', cv.name)
            })
          }
          this._requestObject('ASSETGROUP=' + this.props.data.data.subtypeCode + ' AND isConnected<>1', 'notConnected')
          break
        }
        default: {
          break
        }
      }
    }
  }

  toggleDomains =(domain: string) => {
    if (this.state.domainHolder?.[domain]) {
      const newDomainState = { ...this.state.domainHolder }
      if (newDomainState[domain]) {
        newDomainState[domain] = false
      } else {
        newDomainState[domain] = true
      }
      this.setState({ domainHolder: newDomainState })
    }
  }

  toggleFields =(field: string) => {
    if (this.state.fieldHolder?.[field]) {
      const newFieldState = { ...this.state.fieldHolder }
      if (newFieldState[field]) {
        newFieldState[field] = false
      } else {
        newFieldState[field] = true
      }
      this.setState({ fieldHolder: newFieldState })
    }
  }

  toggleExpandFieldBlock =() => {
    if (this.state.expandFields) {
      this.setState({ expandFields: false })
    } else {
      this.setState({ expandFields: true })
    }
  }

  toggleExpandSubtypesBlock =() => {
    if (this.state.expandSubtypes) {
      this.setState({ expandSubtypes: false })
    } else {
      this.setState({ expandSubtypes: true })
    }
  }

  toggleExpandIndexBlock =() => {
    if (this.state.expandIndexes) {
      this.setState({ expandIndexes: false })
    } else {
      this.setState({ expandIndexes: true })
    }
  }

  _createStatsOutput =() => {
    const output = []
    const atList = this._validAssetTypes('assettype')
    output.push(<div key={'all'}>Number of {this.props.data.text} in the System: {(this.state.siteStats?.all ? this.state.siteStats.all.count : 0)}</div>)
    output.push(<div key={'spacer'} style={{ paddingTop: 15 }}>Breakdown by type ({Object.keys(this.state.siteStats).length - 2} / {atList[0].codedValues.length})</div>)
    for (const keyNode in this.state.siteStats) {
      if (keyNode === 'all' || keyNode === 'notConnected') {
        //skip, will add at front
      } else {
        output.push(<div key={keyNode}>Number of type: {keyNode} in the System: {(this.state.siteStats?.[keyNode] ? this.state.siteStats[keyNode].count : 0)}</div>)
      }
    }
    output.push(<div key={'spacerConnected'} style={{ paddingTop: 15 }}>Validity</div>)
    output.push(<div key={'notConnected'}>Number of {this.props.data.text} NOT connected: {(this.state.siteStats?.notConnected ? this.state.siteStats.notConnected.count : 0)}</div>)
    this.setState({ statsOutput: output })
  }

  _createSubtypesList = () => {
    const arrList = []
    this.state.nodeData.dataElement.subtypes.forEach((fi: any, i: number) => {
      arrList.push(<tr key={i}>
        <td style={{ fontSize: 'small', textAlign: 'left', verticalAlign: 'top' }}>
          <div onClick={() => { this.props.callbackLinkage(fi.subtypeName, 'Subtype', this.props.panel, this.props.data.text) }} style={{ display: 'inline-block', verticalAlign: 'top', paddingRight: 5, cursor: 'pointer' }}><Icon icon={linkIcon} size='12' color='#333' /> {fi.subtypeName}</div>
        </td>
        <td style={{ fontSize: 'small' }}>{fi.subtypeCode}</td>
      </tr>)
    })
    //this.setState({fieldHolder: arrList});
    return arrList
  }

  _createBasicTypesList = () => {
    const arrList = []
    this.state.nodeData.types.forEach((typ: any, i: number) => {
      arrList.push(<tr key={typ.name}>
        <td style={{ fontSize: 'small', textAlign: 'left', verticalAlign: 'top' }}>{typ.name}</td>
        <td style={{ fontSize: 'small' }}>{typ.id}</td>
      </tr>)
    })
    //this.setState({fieldHolder: arrList});
    return arrList
  }

  _createFieldList = () => {
    const arrList = []
    const fieldMetadata = this._getFieldMetadata()

    this.state.fields.forEach((fi: any, i: number) => {
      arrList.push(<tr key={i}>
        <td style={{ fontSize: 'small', textAlign: 'left', verticalAlign: 'top' }}>
          <div onClick={() => { this.props.callbackLinkage(fi.name, 'Field', this.props.panel, this.props.data.text) }} style={{ display: 'inline-block', verticalAlign: 'top', paddingRight: 5, cursor: 'pointer' }}><Icon icon={linkIcon} size='12' color='#333' /> {fi.name}</div>
        </td>
        <td style={{ fontSize: 'small' }}>{(fi?.aliasName) ? fi.aliasName : fi.alias}</td>
        {
          (fieldMetadata?.[fi.name])
            ? <td style={{ fontSize: 'small' }}>{fieldMetadata[fi.name]}</td>
            : <td style={{ fontSize: 'small' }}></td>
        }
        {(fi?.domain && fi.domain !== null)
          ? (fi.domain?.domainName)
              ? <td onClick={() => { this.props.callbackLinkage(fi.domain.domainName, 'Domain', this.props.panel) }} style={{ display: 'inline-block', verticalAlign: 'top', paddingRight: 5, cursor: 'pointer', width: '100%' }}><Icon icon={linkIcon} size='12' color='#333' /> {fi.domain.domainName}</td>
              : <td onClick={() => { this.props.callbackLinkage(fi.domain.name, 'Domain', this.props.panel) }} style={{ display: 'inline-block', verticalAlign: 'top', paddingRight: 5, cursor: 'pointer', width: '100%' }}><Icon icon={linkIcon} size='12' color='#333' /> {fi.domain.name}</td>
          : <td style={{ fontSize: 'small' }}></td>
        }
      </tr>)
    })
    //this.setState({fieldHolder: arrList});
    return arrList
  }

  _createIndexList = () => {
    const arrList = []
    let fieldList = []
    this.state.indexes.forEach((idx: any, i: number) => {
      fieldList = []
      let control = []
      if (idx.fields?.fieldArray) {
        control = idx.fields.fieldArray
      } else {
        control = idx.fields.split(',')
      }
      control.forEach((fi: any, i: number) => {
        fieldList.push(
          <div key={i} onClick={() => { this.props.callbackLinkage((fi?.name) ? fi.name : fi, 'Field', this.props.panel, this.props.data.text) }} style={{ display: 'inline-block', verticalAlign: 'top', paddingRight: 5, cursor: 'pointer' }}><Icon icon={linkIcon} size='12' color='#333' /> {(fi?.name) ? fi.name : fi}</div>
        )
      })
      arrList.push(<tr key={i}>
        <td style={{ fontSize: 'small', textAlign: 'left', verticalAlign: 'top' }}>
          <div onClick={() => { this.props.callbackLinkage(idx.name, 'Index', this.props.panel, this.props.data.text) }} style={{ display: 'inline-block', verticalAlign: 'top', paddingRight: 5, cursor: 'pointer' }}><Icon icon={linkIcon} size='12' color='#333' /> {idx.name}</div>
        </td>
        <td style={{ fontSize: 'small' }}>{fieldList}</td>
      </tr>)
    })
    //this.setState({fieldHolder: arrList});
    return arrList
  }

  _createDomainExpand =(dName: string) => {
    const domain = this._matchDomain(dName)
    let domainTable = null
    let headerName = 'Name'
    let headerValue = 'Code'
    if (domain.length > 0) {
      const vals = []
      if (domain[0]?.codedValues) {
        domain[0].codedValues.forEach((d: any, z: number) => {
          vals.push(
            <tr key={z}>
              <td style={{ fontSize: 'small' }}>{d.name}</td>
              <td style={{ fontSize: 'small' }}>{d.code}</td>
            </tr>
          )
        })
      } else if (domain[0]?.range) {
        headerName = 'Description'
        headerValue = 'Range'
        domain.forEach((d: any, z: number) => {
          vals.push(
          <tr key={z}>
            <td style={{ fontSize: 'small' }}>{d.description}</td>
            <td style={{ fontSize: 'small' }}>{d.range[0] + ' to ' + d.range[d.range.length - 1]}</td>
          </tr>)
        })
      }
      domainTable = <Table>
      <thead>
      <tr>
        <th style={{ fontSize: 'small', fontWeight: 'bold' }}>{headerName}</th>
        <th style={{ fontSize: 'small', fontWeight: 'bold' }}>{headerValue}</th>
      </tr>
      </thead>
      <tbody>
        {vals}
      </tbody>
    </Table>
    }
    return domainTable
  }

  _createFieldsExpand =(f: any) => {
    const field = f
    let fieldTable: any = null
    const vals = []
    for (const keyNode in field) {
      if (keyNode !== 'shape') {
        let v = field[keyNode]
        if (v === true) { v = 'True' }
        if (v === false) { v = 'False' }
        if (keyNode === 'domain') {
          v = field[keyNode].domainName
        }
        vals.push(
            <tr key={keyNode}>
              <td style={{ fontSize: 'small' }}>{keyNode}</td>
              <td style={{ fontSize: 'small' }}>{v}</td>
            </tr>
        )
      } else {
        vals.push(
            <tr key={keyNode}>
              <td style={{ fontSize: 'small' }}>{keyNode}</td>
              <td style={{ fontSize: 'small' }}></td>
            </tr>
        )
      }
    }
    fieldTable = <Table>
      <thead>
      <tr>
        <th style={{ fontSize: 'small', fontWeight: 'bold' }}>Key</th>
        <th style={{ fontSize: 'small', fontWeight: 'bold' }}>Value</th>
      </tr>
      </thead>
      <tbody>
        {vals}
      </tbody>
    </Table>
    return fieldTable
  }

  _createARTable =() => {
    if (this.props.data.attributeRules.length > 0) {
      return (<Table hover>
        <thead>
        <tr>
          <th style={{ fontSize: 'small', fontWeight: 'bold' }}>Name</th>
          <th style={{ fontSize: 'small', fontWeight: 'bold' }}>Description</th>
          <th style={{ fontSize: 'small', fontWeight: 'bold' }}>Priority</th>
        </tr>
        </thead>
        <tbody>
          {this._createARList()}
        </tbody>
      </Table>)
    } else {
      return (<Table hover>
        <tbody>
          <tr><td>Sorry, no Attribute Rules configured</td></tr>
        </tbody>
      </Table>)
    }
  }

  _createARList = () => {
    const arrList = []
    const filterAR = this.props.data.attributeRules.filter((ar: any, i: number) => {
      return (ar.subtypeCode === this.state.nodeData.subtypeCode)
    })
    if (filterAR.length > 0) {
      filterAR.forEach((ar: any, i: number) => {
        arrList.push(
          <tr key={i}>
            <td style={{ fontSize: 'small' }}><div style={{ cursor: 'pointer' }} onClick={() => { this.props.callbackLinkage(ar.name, 'Attribute Rule', this.props.panel) }}><Icon icon={linkIcon} size='12' color='#333' /> {ar.name}</div></td>
            <td style={{ fontSize: 'small', wordWrap: 'break-word' }}>{ar.description}</td>
            <td style={{ fontSize: 'small' }}>{ar.evaluationOrder}</td>
          </tr>
        )
      })
    }

    return arrList
  }

  //****** helper functions and request functions
  //********************************************
  _requestMetadata = async () => {
    let layerId = null
    if (this.props.data.data?.layerId) {
      layerId = this.props.data.data.layerId
    } else {
      if (this.props.data.data?.id) {
        layerId = this.props.data.data.id
      }
    }
    if (this.props.config.useCache) {
      if (layerId !== null) {
        if (this.props.cacheData.metadata?.[layerId]) {
          const data = this.props.cacheData.metadata[layerId]
          const parser = new DOMParser()
          const xmlDoc = parser.parseFromString(data, 'text/xml')
          this.setState({ metadataElements: xmlDoc })
        }
      }
    } else {
      if (layerId !== null) {
        const url = this.props.requestURL + '/' + layerId + '/metadata'
        await fetch(url, {
          method: 'GET'
        })
          .then((response) => { return response.text() })
          .then((data) => {
            const parser = new DOMParser()
            const xmlDoc = parser.parseFromString(data, 'text/xml')
            this.setState({ metadataElements: xmlDoc })
          })
      }
    }
  }

  _requestObject = async (clause: string, category: string) => {
    const url = this.props.requestURL + '/' + this.props.data.parentId + '/query?where=' + clause + '&returnCountOnly=true&f=pjson'
    fetch(url, {
      method: 'GET'
    })
      .then((response) => { return response.json() })
      .then((data) => {
        if (data?.count) {
          const updateStat = { ...this.state.siteStats }
          updateStat[category] = {
            count: data.count
          }
          this.setState({ siteStats: updateStat })
          this._createStatsOutput()
        }
      })
  }

  _processMetaData =() => {
    let desc = ''
    const metadata = this.state.metadataElements
    const dataInfo = metadata.getElementsByTagName('dataIdInfo')
    if (dataInfo.length > 0) {
      const idAbsLevel = dataInfo[0].getElementsByTagName('idAbs')
      if (idAbsLevel.length > 0) {
        desc = idAbsLevel[0].innerHTML
      }
      if (desc === '') {
        const idPurpLevel = dataInfo[0].getElementsByTagName('idPurp')
        if (idPurpLevel.length > 0) {
          desc = idPurpLevel[0].innerHTML
        }
      }
    }
    return desc
  }

  _getFieldMetadata =() => {
    const desc = []
    const metadata = this.state.metadataElements
    if (metadata !== null) {
      const attrNode = metadata.getElementsByTagName('attr')
      if (attrNode.length > 0) {
        for (let i = 0; i < attrNode.length; i++) {
          const fieldlabel = attrNode[i].getElementsByTagName('attrlabl')
          const fieldDesc = attrNode[i].getElementsByTagName('attrdef')
          if (fieldlabel.length > 0) {
            if (fieldDesc.length > 0) {
              desc[fieldlabel[0].innerHTML] = fieldDesc[0].innerHTML
            }
          }
        }
      }
    }
    return desc
  }

  _unescapeHTML =(html: string) => {
    const el = document.createElement('div')
    return html.replace(/\&#?[0-9a-z]+;/gi, function (enc) {
      el.innerHTML = enc
      return el.innerText
    })
  }

  _removeTags (str: string) {
    if ((str === null) || (str === '')) { return str } else { str = str.toString() }
    return str.replace(/(<([^>]+)>)/ig, '')
  }

  _compare =(prop: any) => {
    return function (a: any, b: any) {
      let comparison = 0
      if (a[prop] > b[prop]) {
        comparison = 1
      } else if (a[prop] < b[prop]) {
        comparison = -1
      }
      return comparison
    }
  }

  _validAssetTypes =(lookup: string) => {
    let domainVals = []
    const currentAT = this.state.nodeData.fieldInfos.filter((fi: any) => {
      return (fi.fieldName === lookup)
    })
    if (currentAT.length > 0) {
      domainVals = this.props.domains.filter((d: any) => {
        return (d.name === currentAT[0].domainName)
      })
    }
    return domainVals
  }

  _matchDomain =(lookup: string) => {
    let domainVals = []
    domainVals = this.props.domains.filter((d: any) => {
      return (d.name === lookup)
    })
    return domainVals
  }

  _matchField =(lookup: string) => {
    let fieldVal = []
    fieldVal = this.props.data.fields.filter((f: any) => {
      return (f.name === lookup)
    })
    return fieldVal
  }

  _getControllerMemberships =(CltrMem: any) => {
    const returnVal = []
    CltrMem.forEach((cm: any, i: number) => {
      for (const key in cm) {
        returnVal.push(
          <div key={key + i} onClick={() => { this.props.callbackLinkage(cm[key], 'Domain Network', this.props.panel, this.props.data.text) }} style={{ display: 'inline-block', verticalAlign: 'top', paddingRight: 5, cursor: 'pointer' }}><Icon icon={linkIcon} size='12' color='#333' /> {cm[key]}</div>
        )
      }
    })
    return returnVal
  }

  _handleAliasBrackets =(alias: string, name: string) => {
    let clean = alias
    const code = this.state.nodeData.subtypeCode
    clean = clean.replace(/],/g, '],<br>')
    const pieces = clean.split(',<br>')
    const validList = [', ' + code + ' ', code + ',', code + ' ', code + ']', ', ' + code + ',']
    const filter = pieces.filter((p: any) => {
      return validList.some((v: string) => {
        return (p.indexOf(v) > -1)
      })
    })
    if (filter.length > 0) {
      clean = filter[0]
    } else {
      clean = name
    }
    return clean
  }
}
