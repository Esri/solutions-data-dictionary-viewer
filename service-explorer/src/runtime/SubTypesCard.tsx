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
  config: any
  cacheData: any
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
  minimizedDetails: boolean
  subTypeDesc: string[]
  metadataElements: any
}

export default class SubTypesCard extends React.Component <IProps, IState> {
  constructor (props: IProps) {
    super(props)

    this.state = {
      nodeData: this.props.data,
      activeTab: 'Properties',
      minimizedDetails: false,
      subTypeDesc: [],
      metadataElements: null
    }
  }

  componentWillMount () {
    this._requestMetadata().then(() => {
      this._processMetaData()
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
                    <th style={{ fontSize: 'small', fontWeight: 'bold' }}>Code</th>
                    <th style={{ fontSize: 'small', fontWeight: 'bold' }}>Description</th>
                  </tr>
                  </thead>
                  <tbody>
                    {this._createSTList()}
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
  _createSTList = () => {
    const arrList = []
    this.props.data.nodes.forEach((ar: any, i: number) => {
      const subDesc: any = this.state.subTypeDesc.filter((std: any) => {
        return (parseInt(std.code) === parseInt(ar.data.subtypeCode))
      })
      arrList.push(
          <tr key={i}>
            <td style={{ fontSize: 'small' }}>
            <div onClick={() => { this.props.callbackLinkage(ar.data.subtypeName, 'Subtype', this.props.panel, this.props.data.parent) }} style={{ display: 'inline-block', verticalAlign: 'top', paddingRight: 5, cursor: 'pointer' }}><Icon icon={linkIcon} size='12' color='#333' /> {ar.data.subtypeName} </div>
            </td>
            <td style={{ fontSize: 'small' }}>{ar.data.subtypeCode}</td>
            <td style={{ fontSize: 'small' }}>{subDesc.length > 0 ? subDesc[0].description : ''}</td>
          </tr>
      )
    })
    return arrList
  }

  //****** helper functions and request functions
  //********************************************
  _requestMetadata = async () => {
    if (this.props.config.useCache) {
      const data = this.props.cacheData.metadata[this.props.data.layerId]
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
    const description = []
    const metadata = this.state.metadataElements
    const metaLevel = metadata.getElementsByTagName('metadata')
    if (metaLevel.length > 0) {
      const eaInfoLevel = metaLevel[0].getElementsByTagName('eainfo')
      if (eaInfoLevel.length > 0) {
        const detailedLevel = eaInfoLevel[0].getElementsByTagName('detailed')
        if (detailedLevel.length > 0) {
          for (let i = 0; i < detailedLevel.length; i++) {
            const subTypeCodeLevel = detailedLevel[i].getElementsByTagName('enttypdv')
            if (subTypeCodeLevel.length > 0) {
              //loop thorugh details and get code node and see if it's the current code card is on.
              //if (parseInt(subTypeCodeLevel[0].innerHTML) === parseInt(this.state.nodeData.layerId)) {
              //this tag stores the descriptions
              const subTypeDescLevel = detailedLevel[i].getElementsByTagName('enttypd')
              if (subTypeDescLevel.length > 0) {
                description.push({ code: parseInt(subTypeCodeLevel[0].innerHTML), description: subTypeDescLevel[0].innerHTML })
              }
              //}
            }
          }
        }
      }
    }
    this.setState({ subTypeDesc: description })
  }
}
