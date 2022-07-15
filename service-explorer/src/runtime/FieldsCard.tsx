/** @jsx jsx */
import { React, jsx } from 'jimu-core'
import { Icon, Table } from 'jimu-ui'
import { TabContent, TabPane } from 'reactstrap'
import CardHeader from './_header'
import EsriLookup from './_constants'
import './css/custom.css'
const linkIcon = require('./assets/launch.svg')
const rightArrowIcon = require('jimu-ui/lib/icons/arrow-right.svg')
const downArrowIcon = require('jimu-ui/lib/icons/arrow-down.svg')

interface IProps {
  data: any
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
  activeTab: string
  minimizedDetails: boolean
  esriValueList: any
  metadataElements: any
  subtypeList: any
  expandAlias: any
  fieldDescriptions: any
}

export default class FieldsCard extends React.Component <IProps, IState> {
  constructor (props: IProps) {
    super(props)

    this.state = {
      nodeData: JSON.parse(JSON.stringify(this.props.data.data)),
      activeTab: 'Properties',
      minimizedDetails: false,
      esriValueList: new EsriLookup(),
      metadataElements: null,
      subtypeList: [],
      expandAlias: [],
      fieldDescriptions: []
    }
  }

  componentWillMount () {
    const cleanAlais = [...this.state.nodeData]
    cleanAlais.forEach((f: any, i: number) => {
      if (f?.aliasName) {
        f.aliasName = (f.aliasName.substring((f.aliasName.indexOf(':') + 1), f.aliasName.length)).split(',')
        for (let z = 0; z < f.aliasName.length; z++) {
          f.aliasName[z] = f.aliasName[z].trim()
        }
      } else {
        f.alias = (f.alias.substring((f.alias.indexOf(':') + 1), f.alias.length)).split(',')
        for (let z = 0; z < f.alias.length; z++) {
          f.alias[z] = f.alias[z].trim()
        }
      }
    })
    this.setState({ nodeData: cleanAlais }, () => {
      this._fillExpandState()
      this._requestMetadata().then(() => {
        this.setState({ nodeData: cleanAlais }, () => {
          this._processMetaData()
        })
      })
    })
  }

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
                    <th style={{ fontSize: 'small', fontWeight: 'bold' }}>Alias</th>
                    <th style={{ fontSize: 'small', fontWeight: 'bold' }}>Type</th>
                    <th style={{ fontSize: 'small', fontWeight: 'bold' }}>Description</th>
                    <th style={{ fontSize: 'small', fontWeight: 'bold' }}>Domain</th>
                  </tr>
                  </thead>
                  <tbody>
                    {this._createFList()}
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
  _createFList = () => {
    const arrList = []
    this.state.nodeData.forEach((f: any, i: number) => {
      arrList.push(
          <tr key={i}>
            <td style={{ fontSize: 'small' }}>
            <div onClick={() => { this.props.callbackLinkage(f.name, 'Field', this.props.panel, this.props.data.parent) }} style={{ display: 'inline-block', verticalAlign: 'top', paddingRight: 5, cursor: 'pointer' }}><Icon icon={linkIcon} size='12' color='#333' /> {f.name} </div>
            </td>
            <td style={{ fontSize: 'small', wordWrap: 'break-word' }}>{(f?.aliasName) ? this._createAliasList(f.name, f.aliasName) : this._createAliasList(f.name, f.alias)}
            </td>
            <td style={{ fontSize: 'small' }}>{this.state.esriValueList.lookupValue(f.type)}</td>
            {
              (this.state.fieldDescriptions?.[f.name])
                ? <td style={{ fontSize: 'small' }}>{this.state.fieldDescriptions[f.name]}</td>
                : <td style={{ fontSize: 'small' }}></td>
            }
            {(f?.domain && f?.domain !== null)
              ? (f.domain?.domainName)
                  ? <td onClick={() => { this.props.callbackLinkage(f.domain.domainName, 'Domain', this.props.panel) }} style={{ display: 'inline-block', verticalAlign: 'top', paddingRight: 5, cursor: 'pointer', width: '100%' }}><Icon icon={linkIcon} size='12' color='#333' /> {f.domain.domainName}</td>
                  : <td onClick={() => { this.props.callbackLinkage(f.domain.name, 'Domain', this.props.panel) }} style={{ display: 'inline-block', verticalAlign: 'top', paddingRight: 5, cursor: 'pointer', width: '100%' }}><Icon icon={linkIcon} size='12' color='#333' /> {f.domain.name}</td>
              : <td style={{ fontSize: 'small' }}></td>
            }
          </tr>
      )
    })
    return arrList
  }

  _createAliasList =(parent: string, values: any) => {
    const list = []
    if (Array.isArray(values)) {
      if (values.length > 1) {
        values.forEach((v: any, i: number) => {
          list.push(
            <div key={i}>
            <div style={{ cursor: 'pointer' }} onClick={() => { this.toggleExpandAlias(v) }}>{(this._getExpandStatus(v)) ? <Icon icon={downArrowIcon} size='12' color='#333' /> : <Icon icon={rightArrowIcon} size='12' color='#333' />} {v}</div>
              {
                (this._getExpandStatus(v))
                  ? <div style={{ paddingLeft: '15px', paddingRight: '15px', paddingTop: '2px', paddingBottom: '10px' }}>{this._matchAliasandSubtype(v)}</div>
                  : ''
              }
            </div>
          )
        })
      } else {
        values.forEach((v: any, i: number) => {
          list.push(
            <div key={i}>{v}</div>
          )
        })
      }
    } else {
      list.push(
        <div key={values}>{values}</div>
      )
    }
    return list
  }

  _matchAliasandSubtype =(alias: string) => {
    let returnVal = ''
    const stList = []
    this.state.subtypeList.forEach((st: any) => {
      const matchField = st.fields.filter((f: any) => {
        return (f.alias).trim() === (alias).trim()
      })
      if (matchField.length > 0) {
        stList.push(st.subtype)
      }
    })
    if (stList.length > 0) {
      if (stList.length > 1) {
        returnVal = 'This alias is used in the following subtypes: ' + (stList.join()).replace(/,/g, ', ')
      } else {
        returnVal = 'This alias is used in the following subtype: ' + (stList.join()).replace(/,/g, ', ')
      }
    } else {
      returnVal = 'Sorry, this alias is not used'
    }
    return returnVal
  }

  toggleExpandAlias =(alias: string) => {
    const newExpand = JSON.parse(JSON.stringify(this.state.expandAlias))
    newExpand.forEach((e: any) => {
      if (e.alias === alias) {
        if (e.expand) {
          e.expand = false
        } else {
          e.expand = true
        }
      }
    })
    this.setState({ expandAlias: newExpand })
  }

  _getExpandStatus = (alias: string) => {
    let expandStatus = false
    this.state.expandAlias.forEach((e: any) => {
      if (e.alias === alias) {
        expandStatus = e.expand
      }
    })
    return expandStatus
  }

  //****** helper functions and request functions
  //********************************************
  _requestMetadata = async () => {
    if (this.props.config.useCache) {
      const data = this.props.cacheData.metadata[this._getParentId(this.props.data.parent)]
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(data, 'text/xml')
      this.setState({ metadataElements: xmlDoc })
    } else {
      const url = this.props.requestURL + '/' + this.props.data.parentId + '/metadata'
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

  _processMetaData =() => {
    const subtypeList = []
    const desc = []
    const metadata = this.state.metadataElements
    const metaLevel = metadata.getElementsByTagName('metadata')
    if (metaLevel.length > 0) {
      const eaInfoLevel = metaLevel[0].getElementsByTagName('eainfo')
      if (eaInfoLevel.length > 0) {
        const detailedLevel = eaInfoLevel[0].getElementsByTagName('detailed')
        if (detailedLevel.length > 0) {
          for (let i = 0; i < detailedLevel.length; i++) {
            const enttyplLevel = detailedLevel[i].getElementsByTagName('enttypl')
            if (enttyplLevel.length > 0) {
              const fieldList = []
              const attrLevel = detailedLevel[i].getElementsByTagName('attr')
              if (attrLevel.length > 0) {
                for (let a = 0; a < attrLevel.length; a++) {
                  const attrlablLevel = attrLevel[a].getElementsByTagName('attrlabl')
                  const attaliasLevel = attrLevel[a].getElementsByTagName('attalias')
                  if (attaliasLevel.length > 0) {
                    fieldList.push({
                      name: attrlablLevel[0].innerHTML,
                      alias: attaliasLevel[0].innerHTML
                    })
                  }
                }
              }
              subtypeList.push(
                {
                  subtype: enttyplLevel[0].innerHTML,
                  fields: fieldList
                }
              )
            }
          }
        }
      }
    }
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
    this.setState({ subtypeList: subtypeList, fieldDescriptions: desc })
  }

  _getParentId =(value: string) => {
    let returnVal = value
    const matchCrumb = this.props.data.crumb.filter((c: any) => {
      return c.value === value
    })
    if (matchCrumb.length > 0) {
      returnVal = matchCrumb[0].node
    }
    return returnVal
  }

  _fillExpandState =() => {
    const expand = [...this.state.expandAlias]
    this.state.nodeData.forEach((f: any, i: number) => {
      let alias = null
      if (f?.aliasName) {
        alias = f.aliasName
      } else {
        alias = f.alias
      }
      if (alias.length > 1) {
        alias.forEach((a: any, i: number) => {
          expand.push({
            alias: a,
            expand: false
          })
        })
      }
    })
    this.setState({ expandAlias: expand })
  }
}
