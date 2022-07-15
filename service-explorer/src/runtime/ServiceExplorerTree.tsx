/** @jsx jsx */
import { jsx, React } from 'jimu-core'
import './css/custom.css'
import { ListGroup, ListGroupItem, Input, Collapse, Icon, Progress } from 'jimu-ui'
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap'
const ArrowUpIcon = require('jimu-ui/lib/icons/arrow-up-8.svg')
const rightArrowIcon = require('jimu-ui/lib/icons/arrow-right.svg')
const downArrowIcon = require('jimu-ui/lib/icons/arrow-down.svg')
const moreIcon = require('jimu-ui/lib/icons/filter.svg')
const searchIcon = require('jimu-ui/lib/icons/search.svg')

interface IProps {
  theme: any
  width: any
  callback: any
  data: any
  callbackActiveCards: any
}

interface IState {
  collapse: boolean
  arrowIcon: any
  nodeTypeIcon: any
  postIcon: any
  masterServiceNodes: any
  serviceNodes: any
  nodeList: any
  iconState: any
  featureLayerNodes: any
  state: any
  requestURL: string
  hasDataElements: boolean
  dataElements: any
  serviceElements: any
  layerElements: any
  relationshipElements: any
  domainElements: any
  autoRefresh: boolean
  showSearchOptions: boolean
  searchOptionState: any
  searchWait: boolean
  searchValue: string
  searchActive: boolean
}

class _ServiceExplorerTree extends React.Component <IProps, IState> {
  constructor (props: IProps) {
    super(props)

    this.state = {
      collapse: false,
      arrowIcon: ArrowUpIcon,
      nodeTypeIcon: '',
      postIcon: '',
      masterServiceNodes: [],
      serviceNodes: [],
      nodeList: [],
      iconState: {},
      featureLayerNodes: [],
      state: null,
      requestURL: this.props.data.requestURL,
      serviceElements: this.props.data.serviceElements,
      hasDataElements: this.props.data.hasDataElements,
      dataElements: this.props.data.dataElements,
      layerElements: this.props.data.layerElements,
      relationshipElements: this.props.data.relationshipElements,
      domainElements: this.props.data.domainElements,
      autoRefresh: false,
      showSearchOptions: false,
      searchOptionState: {
        layers: { check: true, expand: true, subs: [], display: 'Layers' },
        layerElements: { check: true, expand: true, subs: [], display: 'Layer Elements' },
        utilityNetwork: { check: true, expand: true, subs: [], display: 'Utility Network' },
        otherElements: { check: true, expand: true, subs: [], display: 'Other Elements' }
      },
      searchWait: false,
      searchValue: '',
      searchActive: false
    }
  }

  componentWillMount () {
    //this._processData();
    this.setState({ serviceNodes: [...this.props.data], masterServiceNodes: [...this.props.data] }, () => {
      this._popSearchParameters()
    })
  }

  componentDidMount () {
    //this._processData();
  }

  render () {
    const checkState = () => {
      let item = null
      item = this.mapper(this.state.serviceNodes, null, 0)
      return item
    }

    return (
      <div style={{ paddingLeft: 58, width: this.props.width, height: document.body.clientHeight - 10, overflow: 'auto', position: 'fixed' }}>
        <div style={{ display: 'inline', width: '100%' }}>
          <div style={{ display: 'inline-block', width: this.props.width - 120 }}>
            <Input placeholder="Search" value={this.state.searchValue} onKeyPress={(e: any) => {
              if (e.key === 'Enter') {
                this.setState({ searchWait: true, searchValue: this.state.searchValue }, () => {
                  setTimeout(this.searchService, 500, this.state.searchValue)
                })
              }
            }}
            onChange={(e: any) => {
              e.persist()
              this.setState({ searchValue: e.target.value }, () => {
                if (e.target.value === '') {
                  this.setState({ searchActive: false })
                }
              })
            }}
              style={{ width: '100%' }}>
            </Input>
          </div>
            <div style={{ display: 'inline-block', paddingLeft: '5px', paddingRight: '5px', cursor: 'pointer' }}>
            <div id="seachTree" onClick={() => {
              this.setState({ searchWait: true, searchValue: this.state.searchValue }, () => {
                setTimeout(this.searchService, 500, this.state.searchValue)
              })
            }}>
              <Icon icon={searchIcon} size='16' color='#333' />
            </div>
            </div>
          <div style={{ display: 'inline-block', paddingLeft: '5px', paddingRight: '5px', cursor: 'pointer' }} onClick={this._toggleSearchOption} id="iconSearchOptions"><Icon icon={moreIcon} size='16' color='#333' /></div>
          <div style={{ width: '100%', display: (this.state.searchWait) ? 'block' : 'none' }}><Progress theme={this.props.theme} color="primary" value={100} /></div>
          <Popover className="popOverBG" innerClassName="popOverBG" hideArrow={true} placement="left" isOpen={this.state.showSearchOptions} target="iconSearchOptions">
            <PopoverHeader><div className="leftRightPadder5">Search Options</div></PopoverHeader>
            <PopoverBody>
            <div className="leftRightPadder5" style={{ paddingBottom: '10px' }}>Select the elements to include in the search results.</div>
            {this.searchOptionsTable()}
            </PopoverBody>
          </Popover>
        </div>
        <ListGroup>
            {checkState()}
        </ListGroup>
    </div>)
  }

  mapper = (nodes: any, parentId: string, lvl: number) => {
    return nodes.map((node: any, index: number) => {
      let item = null
      if (node?.text) {
        if (node.text.indexOf('Errors') === -1) {
          if (node.text !== 'Dirty Areas') {
            if (!this.state.searchActive) {
              const id = `${node.text}-${parentId || 'top'}`.replace(/[^a-zA-Z0-9-_]/g, '')
              item = <React.Fragment key={id}>
                <ListGroupItem key={id} style={{ zIndex: 0 }} className={`${parentId ? `rounded-0 ${lvl ? '' : ''}` : ''}`}>
                  {<div style={{ paddingLeft: `${15 * lvl}px` }}>
                    {node.nodes && <div style={{ display: 'inline-block', paddingRight: '5px', cursor: 'pointer' }} id={id} onClick={(e: any) => { this.toggle(node, e) }}>{(node?.root) ? '' : (this.state[id] ? <Icon icon={downArrowIcon} size='16' color='#333' /> : <Icon icon={rightArrowIcon} size='16' color='#333' />)}</div>}
                    {<span onClick={(e: any) => { node.clickable && this.sendBackToParent(node, e) }} style={this.setNodeColor(node.text, node.id)} title={node.text}>{node.text}</span>}
                  </div>}
                </ListGroupItem>
                {node.nodes &&
                  <Collapse isOpen={(node?.root) ? true : this.state[id]}>
                    {this.mapper(node.nodes, id, (lvl || 0) + 1)}
                  </Collapse>}
              </React.Fragment>
            } else {
              if (node.search) {
                const id = `${node.text}-${parentId || 'top'}`.replace(/[^a-zA-Z0-9-_]/g, '')
                item = <React.Fragment key={id}>
                  <ListGroupItem key={id} style={{ zIndex: 0 }} className={`${parentId ? `rounded-0 ${lvl ? '' : ''}` : ''}`}>
                    {<div style={{ paddingLeft: `${15 * lvl}px` }}>
                      {node.nodes && <div style={{ display: 'inline-block', paddingRight: '5px', cursor: 'pointer' }} id={id} onClick={(e: any) => { this.toggle(node, e) }}>{(node?.root) ? '' : (node.search ? <Icon icon={downArrowIcon} size='16' color='#333' /> : <Icon icon={rightArrowIcon} size='16' color='#333' />)}</div>}
                      {<span onClick={(e: any) => { node.clickable && this.sendBackToParent(node, e) }} style={this.setNodeColor(node.text, node.id)} title={node.text}>{node.text}</span>}
                    </div>}
                  </ListGroupItem>
                  {node.nodes &&
                    <Collapse isOpen={(node.search) ? true : this.state[id]}>
                      {this.mapper(node.nodes, id, (lvl || 0) + 1)}
                    </Collapse>}
                </React.Fragment>
              }
            }
          }
        }
      }
      return item
    })
  }

  //Request Info
  requestItemDetails = async (item: any) => {
    const url = this.state.requestURL + '/' + item.id + '?f=pjson'
    const request = await fetch(url, {
      method: 'GET'
    })
    const data = await request.json()
    return data
  }

  toggle = (node: any, event: any) => {
    if (node.requestAdditional) {
      //let data = this.requestItemDetails(node).then((data) => {
      //  console.log(data);
      //});

    }
    const id = event.currentTarget.getAttribute('id')
    //@ts-expect-error
    this.setState(state => ({ [id]: !state[id] }))
  }

  findSelectedInList =(list: any) => {
    let selected = null
    selected = list.some((currentItem: any) => { return currentItem.selected === 'selected' ? currentItem : this.findSelectedInList(currentItem.children) })
    return selected
  }

  sendBackToParent =(node: any, event: any) => {
    event = event || window.event
    let targ = event.target || event.srcElement
    if (targ.nodeType === 3) targ = targ.parentNode
    //targ.style.color = "#ff0000";
    this.props.callback(node, node.type)
  }

  checkActives =(text: string, id: any) => {
    const masterActive = this.props.callbackActiveCards()
    let active = false
    masterActive.forEach((m: any) => {
      if (!active) {
        active = m.some((a: any) => {
          return (a.props.data.text === text && a.props.data.id === id)
        })
      }
    })
    return active
  }

  setNodeColor =(text: string, id: any) => {
    let color = '#000000'
    const isActive = this.checkActives(text, id)
    if (isActive) {
      color = '#007ac2'
      return { color: color, fontWeight: 'bold', cursor: 'pointer', overflowWrap: 'break-word' }
    } else {
      return { color: color, cursor: 'pointer', overflowWrap: 'break-word' }
    }
  }

  hookForParent =() => {
    this.props.callbackActiveCards()
    this.setState(this.state)
  }

  searchService = (value: string) => {
    let serviceNodes = JSON.parse(JSON.stringify(this.state.masterServiceNodes))

    if (value !== '') {
      //this.setState({searchWait:true}, ()=> {
      const hasSubNodes = (node: any, level: any, record: number) => {
        if (this.checkIncludeInSearchResults(node.type)) {
          if (node?.nodes) {
            if (node.text.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
              node.search = true
              serviceNodes = this._upStreamHierarchy(node.crumb, serviceNodes)
              //matchList.push(node);
            }
            node.nodes.forEach((n: any, z: number) => {
              hasSubNodes(n, node, z)
            })
          } else {
            if (node.text.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
              node.search = true
              serviceNodes = this._upStreamHierarchy(node.crumb, serviceNodes)
              // matchList.push(node);
            }
          }
        }
      }
      serviceNodes.forEach((sn: any, i: number) => {
        const level = sn
        hasSubNodes(sn, level, i)
      })
      this.setState({ serviceNodes: serviceNodes, searchWait: false, searchActive: true })
      //});
    } else {
      this.setState({ serviceNodes: serviceNodes, searchWait: false, searchActive: false })
    }
  }

  _upStreamHierarchy =(item: any, structure: any) => {
    const serviceNodes = structure
    const hasSubNodes = (node: any) => {
      item.forEach((i: any) => {
        if (i?.node) {
          if ((node.id).toString() === (i.node).toString()) {
            node.search = true
          }
        }
      })
      if (node?.nodes) {
        node.nodes.forEach((n: any) => {
          hasSubNodes(n)
        })
      }
    }
    serviceNodes.forEach((sn: any) => {
      hasSubNodes(sn)
    })
    return serviceNodes
  }

  _toggleSearchOption =() => {
    if (this.state.showSearchOptions) {
      this.setState({ showSearchOptions: false }, () => {
        //this.searchService(this.state.searchValue);
      })
    } else {
      this.setState({ showSearchOptions: true })
    }
  }

  _popSearchParameters =() => {
    const elementTemp = []
    const serviceNodes = [...this.state.masterServiceNodes]
    const searchOptions = { ...this.state.searchOptionState }
    const hasSubNodes = (node: any) => {
      if (node.type === 'Layers') {
        node.nodes.forEach((n: any) => {
          if (n.type !== 'Utility Network') {
            if (n?.text) {
              if (n.text.indexOf('Errors') < 0 && n.text !== 'Dirty Areas') {
                searchOptions.layers.subs.push({
                  check: true,
                  name: n.text
                })
                n.nodes.forEach((ele: any) => {
                  if (!elementTemp.includes(ele.type)) {
                    elementTemp.push(ele.type)
                  }
                })
              }
            }
          } else {
            if (n.type === 'Utility Network') {
              n.nodes.forEach((un: any) => {
                searchOptions.utilityNetwork.subs.push({
                  check: true,
                  name: un.type
                })
              })
            }
          }
        })
        if (elementTemp.length > 0) {
          elementTemp.forEach((el: any) => {
            searchOptions.layerElements.subs.push({
              check: true,
              name: el
            })
          })
        }
      } else {
        if (node.type !== 'Utility Network') {
          searchOptions.otherElements.subs.push({
            check: true,
            name: node.type
          })
        }
      }
    }
    serviceNodes[0].nodes.forEach((n: any) => {
      hasSubNodes(n)
    })

    this.setState({ searchOptionState: searchOptions })
  }

  searchOptionsTable = () => {
    const layerList = []
    const layerElements = []
    const unList = []
    const otherElements = []
    const searchBlock = []
    let currSection = []
    for (const obj in this.state.searchOptionState) {
      const currObj = this.state.searchOptionState[obj]
      currObj.subs.forEach((n: any, i: number) => {
        const item = <div key={i}>
          <div className="searchOptionDivNode"><Input type="checkbox" theme={this.props.theme} aria-label={'Include ' + n.name} checked={n.check} onChange={(e: any) => { this.toggleIndividualOption(e, n.name, obj) }} /></div>
          <div className="searchOptionDivNode" style={{ paddingLeft: '5px' }}> {n.name}</div>
        </div>
        switch (obj) {
          case 'layers': {
            layerList.push(item)
            currSection = layerList
            break
          }
          case 'layerElements': {
            layerElements.push(item)
            currSection = layerElements
            break
          }
          case 'utilityNetwork': {
            unList.push(item)
            currSection = unList
            break
          }
          case 'otherElements': {
            otherElements.push(item)
            currSection = otherElements
            break
          }
          default: {
            break
          }
        }
      })

      const searchHeader =
        <div style={{ width: '100%' }} key={obj}>
          <div style={{ fontWeight: 'bold', width: '100%', backgroundColor: '#e1e1e1' }}>
          <div className="leftRightPadder5" style={{ display: 'inline-block', float: 'left' }}>
          <Input type="checkbox" aria-label={'Include ' + currObj.display + ' in search'} checked={currObj.check} onChange={(e: any) => { this.searchGroupCheck(e, obj) }} /></div>
          <div style={{ display: 'inline-block', paddingLeft: '5px' }}>{currObj.display}</div>
          <div className="leftRightPadder10" style={{ display: 'inline-block', float: 'right' }}><a onClick={() => { this.toggleSearchExpand(obj) }}><Icon icon={(currObj.expand) ? downArrowIcon : rightArrowIcon} size='16' color='#333' /></a></div>
          </div>
          <div style={{ paddingLeft: '20px', paddingTop: '5px', display: (currObj.expand) ? 'block' : 'none' }}>
            {currSection}
          </div>
        </div>

      searchBlock.push(searchHeader)
    }

    return searchBlock
  }

  searchGroupCheck = (event: any, value: string) => {
    const newState = { ...this.state.searchOptionState }
    if (event.target.checked) {
      newState[value].check = true
      newState[value].subs.forEach((n: any) => {
        n.check = true
      })
    } else {
      newState[value].check = false
      newState[value].subs.forEach((n: any) => {
        n.check = false
      })
    }
    this.setState({ searchOptionState: newState })
  }

  toggleSearchExpand = (value: string) => {
    const newState = { ...this.state.searchOptionState }
    if (newState[value].expand === false) {
      newState[value].expand = true
    } else {
      newState[value].expand = false
    }
    this.setState({ searchOptionState: newState })
  }

  toggleIndividualOption = (event: any, value: string, key: string) => {
    let parentCheck = false
    const newState = { ...this.state.searchOptionState }
    if (event.target.checked) {
      newState[key].subs.forEach((n: any) => {
        if (n.name === value) {
          n.check = true
          parentCheck = true
        }
      })
    } else {
      newState[key].subs.forEach((n: any) => {
        if (n.name === value) {
          n.check = false
        }
      })
    }
    //see any any subcheckboxes are check, if so, keep parent checked
    const someChecked = newState[key].subs.some((n: any) => {
      return n.check
    })
    if (someChecked) {
      parentCheck = true
    }
    newState[key].check = parentCheck
    this.setState({ searchOptionState: newState })
  }

  checkIncludeInSearchResults = (type: string) => {
    let includeInSearch = true
    const newState = { ...this.state.searchOptionState }
    const hasSubNodes = (node: any) => {
      node.forEach((s: any) => {
        if (s.name === type) {
          includeInSearch = s.check
        }
      })
    }
    for (const key in newState) {
      if (!newState[key].check) {
        hasSubNodes(newState[key].subs)
      } else {
        //if it's checked, see if it's a layer, if it's a layer, see what layer elements user has chosen
        if (key === 'layers') {
          if (!newState.layerElements.check) {
            newState.layerElements.subs.forEach((s: any) => {
              if (s.name === type) {
                includeInSearch = s.check
              }
            })
          }
        }
      }
    }

    return includeInSearch
  }

  reduceNodesForSearch = (inArray: any) => {
    let includeInSearch = true
    const newState = { ...this.state.searchOptionState }
    const hasSubNodes = (node: any) => {
      node.forEach((s: any) => {
        if (!s.check) {
          includeInSearch = s.check
        }
      })
    }
    for (const key in newState) {
      if (!newState[key].check) {
        hasSubNodes(newState[key].subs)
      }
    }

    return includeInSearch
  }

  //helper functions
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
}

export const ServiceExplorerTree = _ServiceExplorerTree
