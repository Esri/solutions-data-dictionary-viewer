/** @jsx jsx */
import { jsx, React, ReactDOM } from 'jimu-core'
import { Icon, Table, Input } from 'jimu-ui'
import './css/custom.css'

const undoIcon = require('jimu-ui/lib/icons/undo.svg')
const refreshIcon = require('jimu-ui/lib/icons/refresh.svg')

interface IProps {
  data: any
  domains: any
  requestURL: string
  fieldGroups: any
}

interface IState {
  nodeData: any
  allCAV: any
  runtimeCAV: any
  uniqueCAVChoice: any
  filteredCAVs: any
  filterSelector: any
  results: any
}

export default class CAVWorkSpace extends React.Component <IProps, IState> {
  constructor (props: IProps) {
    super(props)

    this.state = {
      nodeData: this.props.data.data,
      allCAV: [],
      runtimeCAV: {},
      uniqueCAVChoice: {},
      filteredCAVs: {},
      filterSelector: [],
      results: []
    }
  }

  componentWillMount () {
    this._requestObject()
    //test
  }

  componentDidMount () {
    //this._createCAVOptions();
  }

  componentWillUpdate () {
  }

  render () {
    return (
    <div style={{ width: '100%', backgroundColor: '#fff', float: 'left', display: 'inline-block' }}>
        <div style={{ paddingLeft: 10, paddingRight: 10, paddingTop: 10 }}>
          <div>{this._createCAVTables()}</div>
        </div>
    </div>)
  }

  _requestObject = async () => {
    const url = this.props.requestURL + '/queryContingentValues?layers=' + this.props.data.parentId + '&f=pjson'
    fetch(url, {
      method: 'GET'
    })
      .then((response) => { return response.json() })
      .then((data) => {
        if (data?.contingentValueSets) {
          const filterbyLayer = data.contingentValueSets.filter((cvs: any) => {
            return (cvs.layerId === this.props.data.parentId)
          })
          this.setState({ allCAV: filterbyLayer }, () => {
            this._filterCurrentCAV()
          })
        }
      })
  }

  _filterCurrentCAV =() => {
    const activeCAVs = {}
    let unique = []
    const cavList = [...this.state.allCAV]
    if (cavList.length > 0) {
      cavList.forEach((ac: any) => {
        ac.fieldGroups.forEach((fg: any, z: number) => {
          const filterContigent = fg.contingencies.filter((c: any) => {
            return (c.subtypeCode === this.props.data.data.subtypeCode)
          })
          if (filterContigent.length > 0) {
            const justValues = []
            filterContigent.forEach((fc: any, i: number) => {
              if (i === 0) {
                unique = new Array(fc.values.length)
              }
              justValues.push(fc.values)
              fc.values.forEach((v: any, z: number) => {
                if (typeof (unique[z]) === 'undefined') {
                  unique[z] = []
                }
                unique[z].push(v)
                unique[z] = Array.from(new Set(unique[z]))
              })
            })
            activeCAVs[fg.name] = justValues
            fg.allPossible = justValues
            fg.uniqueValues = unique
            fg.filteredPossible = justValues
            fg.filteredUniqueValues = unique
            fg.filteredSelection = unique.forEach((u: any) => { return -1 })
          }
        })
      })
    }
    this.setState({ allCAV: cavList }, () => {

    })
  }

  _createCAVTables =() => {
    const tableList = []
    let checkActiveFilter = false
    if (this.state.allCAV.length > 0) {
      this.state.allCAV.forEach((ac: any) => {
        ac.fieldGroups.forEach((fg: any, z: number) => {
          if (fg?.uniqueValues) {
            const filterOptions = this._createFilterOptions(fg)
            const resultSet = this._createMatchList(fg)
            checkActiveFilter = this._checkIfFiltered(fg)
            const table = (
            <Table key={z} style={{ paddingBottom: 25, width: '95%' }}>
              <thead><tr>
                <td colSpan={fg.uniqueValues.length - 1} style={{ fontWeight: 'bold' }}>{fg.name}</td>
                <td style={{ textAlign: 'right' }}><Icon icon={undoIcon} size='14' color='#333' onClick={() => { this.resetInputs(fg) }} /></td>
                </tr></thead>
              <tbody>
                <tr>{filterOptions}</tr>
                <tr>{(checkActiveFilter) && resultSet}</tr>
              </tbody>
            </Table>)
            tableList.push(table)
          }
        })
      })
    }
    return tableList
  }

  _createFilterOptions =(fieldGroup: any) => {
    const optionsList = []
    const filterCAVFieldGroups = this.props.data.fieldGroups.filter((fg: any) => {
      return (fg.name === fieldGroup.name)
    })
    if (fieldGroup?.filteredUniqueValues) {
      if (filterCAVFieldGroups.length > 0) {
        fieldGroup.filteredUniqueValues.forEach((fuv: any, p: number) => {
          const valueList = this._createValueList(fuv, filterCAVFieldGroups[0].fieldNames.names[p], fieldGroup.filteredSelection[p])
          const cell = (
            <td>
              <div style={{ fontSize: 'small', fontWeight: 'bold' }}>{filterCAVFieldGroups[0].fieldNames.names[p]}</div>
              <div>
                <Input type="select" name={fieldGroup.name + p} id={fieldGroup.name + p}
                ref={fieldGroup.name + p}
                onChange={(e: any) => { this._showCAVMatch(e.target.value, p, fieldGroup.name) }}>
                  {valueList}
                </Input>
              </div>
            </td>
          )
          optionsList.push(cell)
        })
      }
    }
    return optionsList
  }

  _createValueList =(fuv: any, fieldName: string, existing: any) => {
    const selOptions = []
    selOptions.push(<option value="-1">Choose an option</option>)
    /*
    const checkBool = fuv.some((v: any) => {
      return (v === true || v === false)
    })
    */
    //check if there are valid and not just true or false values
    //if(!checkBool) {
    const matchField = this._matchField(fieldName)
    if (matchField.length > 0) {
      const matchDomain = this._matchDomain(matchField[0].domainName)
      const codeValues = matchDomain[0].codedValues
      fuv.forEach((cav: any, c: number) => {
        if (cav !== true || cav !== false) {
          const matchCV = codeValues.filter((cv: any) => {
            return (cv.code === cav)
          })
          if (parseInt(existing) !== -1) {
            if (parseInt(existing) === parseInt(cav)) {
              if (matchCV.length > 0) {
                selOptions.push(<option key={c} value={cav} selected>{matchCV[0].name}</option>)
              } else {
                selOptions.push(<option key={c} value={cav} selected>{cav}</option>)
              }
            }
          } else {
            if (matchCV.length > 0) {
              selOptions.push(<option key={c} value={cav}>{matchCV[0].name}</option>)
            } else {
              selOptions.push(<option key={c} value={cav}>{cav}</option>)
            }
          }
        }
      })
      //}
    }
    return selOptions
  }

  _createMatchList =(fieldGroup: any) => {
    const optionsList = []
    const filterCAVFieldGroups = this.props.data.fieldGroups.filter((fg: any) => {
      return (fg.name === fieldGroup.name)
    })

    const getValues = (slot: number, fieldName: string) => {
      const valueList = []
      const list = []
      fieldGroup.filteredPossible.forEach((fuv: any, p: number) => {
        /*
        const checkBool = fuv.some((v: any) => {
          return (v === true || v === false)
        })
        */
        //if(!checkBool) {
        const matchField = this._matchField(fieldName)
        if (matchField.length > 0) {
          const matchDomain = this._matchDomain(matchField[0].domainName)
          const codeValues = matchDomain[0].codedValues
          fuv.forEach((cav: any, c: number) => {
            if (cav !== true || cav !== false) {
              if (c === slot) {
                const matchCV = codeValues.filter((cv: any) => {
                  return (cv.code === cav)
                })
                if (matchCV.length > 0) {
                  if (!list.includes(matchCV[0].name)) {
                    list.push(matchCV[0].name)
                    valueList.push(<div key={matchCV[0].name} onClick={() => { this._showCAVMatch(cav, slot, fieldGroup.name) }} style={{ textDecoration: 'underline', fontSize: 'small', cursor: 'pointer' }}>{matchCV[0].name}</div>)
                  }
                } else {
                  if (!list.includes(cav)) {
                    list.push(cav)
                    valueList.push(<div key={cav} onClick={() => { this._showCAVMatch(cav, slot, fieldGroup.name) }} style={{ textDecoration: 'underline', fontSize: 'small', cursor: 'pointer' }}>{cav}</div>)
                  }
                }
              }
            }
          })
        }
        //}
      })
      //list = Array.from(new Set(list));
      //valueList = list;
      return valueList
    }

    if (fieldGroup?.filteredPossible) {
      if (fieldGroup.filteredPossible.length > 0) {
        const slots = fieldGroup.filteredPossible[0].length
        for (let i = 0; i < slots; i++) {
          const cell = (
            <td key={filterCAVFieldGroups[0].fieldNames.names[i] + i}>
              {getValues(i, filterCAVFieldGroups[0].fieldNames.names[i])}
            </td>
          )
          optionsList.push(cell)
        }
      }
    }
    return optionsList
  }

  _createCAVOptions =() => {
    const tableObj = []
    if (Object.keys(this.state.uniqueCAVChoice).length !== 0 && this.state.uniqueCAVChoice.constructor === Object) {
      for (const keyNode in this.state.uniqueCAVChoice) {
        const filterCAVFieldGroups = this.props.data.fieldGroups.filter((fg: any) => {
          return (fg.name === keyNode)
        })

        if (filterCAVFieldGroups.length > 0) {
          const CAVNumber = this.state.uniqueCAVChoice[keyNode].length
          const header = []
          const rows = []
          let validCAVgroup = true
          for (let i = 0; i < CAVNumber; i++) {
            if (this.state.uniqueCAVChoice[keyNode][i].length === 1) {
              if (this.state.uniqueCAVChoice[keyNode][i][0] === true || this.state.uniqueCAVChoice[keyNode][i][0] === false) {
                validCAVgroup = false
              }
            }
          }
          if (validCAVgroup) {
            for (let i = 0; i < CAVNumber; i++) {
              const selOption = []
              const matchField = this._matchField(filterCAVFieldGroups[0].fieldNames.names[i])
              if (matchField.length > 0) {
                const matchDomain = this._matchDomain(matchField[0].domainName)
                const codeValues = matchDomain[0].codedValues
                this.state.uniqueCAVChoice[keyNode][i].forEach((cav: any, c: number) => {
                  const matchCV = codeValues.filter((cv: any) => {
                    return (cv.code === cav)
                  })
                  if (matchCV.length > 0) {
                    selOption.push(<option key={c} value={cav}>{matchCV[0].name}</option>)
                  } else {
                    selOption.push(<option key={c} value={cav}>{cav}</option>)
                  }
                })
                header.push(<th key={i} style={{ fontSize: 'small', fontWeight: 'bold' }}><div style={{ fontSize: 'small' }}>{filterCAVFieldGroups[0].fieldNames.names[i]}</div>
                  <Input type="select" name={keyNode + i} id={keyNode + i} onChange={(e: any) => { this._showCAVMatch(keyNode, document.getElementById(keyNode + i), i) }}><option value="" selected>Choose an option</option>{selOption}</Input>
                </th>)
                //rows.push(<td key={i}>{textList}</td>);
              }
            }

            tableObj.push(
              <div style={{ width: '100%' }}>
              <div style={{ fontWeight: 'bold' }}>
                <div style={{ display: 'inline', float: 'left' }}>{keyNode}</div>
                <div style={{ display: 'inline', float: 'right' }} onClick={() => { this.resetInputs(keyNode) }}><Icon icon={refreshIcon} size='14' color='#333' /></div>
              </div>
              <Table size={'500px'}>
              <thead>
              <tr>
                {header}
              </tr>
              </thead>
              <tbody>
                <tr>
                {rows}
                </tr>
              </tbody>
            </Table>
            </div>)
          } else {
            tableObj[0] = <div style={{ width: '100%' }}>No defined Contigent Attribute Values</div>
          }
        }
      }
    } else {
      tableObj.push(<Table size={'500px'}>
      <tbody>
        <tr>
        <td>Sorry, no Contigent Attribute Values defined</td>
        </tr>
      </tbody>
    </Table>)
    }
    return tableObj
  }

  _showCAVMatch =(value: any, slot: any, name: string|number) => {
    //let selValue = code.options[code.selectedIndex].value;
    const cavCopy = [...this.state.allCAV]
    cavCopy.forEach((c: any) => {
      c.fieldGroups.forEach((fg: any) => {
        if (fg.name === name) {
          fg.filteredSelection[slot] = value
          const matchPossible = fg.filteredPossible.filter((poss: any) => {
            return (parseInt(poss[slot]) === parseInt(value))
          })
          if (matchPossible.length > 0) {
            //loop unique and set filtered values to jsut matching so dropdowns can filter selectable values
            //const totalSlots = matchPossible[0].length
            const newUnique = []
            fg.filteredUniqueValues.forEach((fuv: any, i: number) => {
              newUnique[i] = []
              const fuvFiltered = fuv.filter((val: any) => {
                return (
                  matchPossible.some((mp: any) => {
                    return (parseInt(mp[i]) === parseInt(val))
                  })
                )
              })
              if (fuvFiltered.length > 0) {
                newUnique[i] = fuvFiltered
              }
            })
            fg.filteredUniqueValues = newUnique
            fg.filteredPossible = matchPossible
          }
        }
      })
    })

    this.setState({ allCAV: cavCopy })

    return true
  }

  //helper functions

  resetInputs =(fldGrp: any) => {
    const cavCopy = [...this.state.allCAV]
    const doms = []
    cavCopy.forEach((c: any) => {
      c.fieldGroups.forEach((fg: any) => {
        if (fg.name === fldGrp.name) {
          for (let i = 0; i < fg.filteredSelection.length; i++) {
            fg.filteredSelection[i] = -1
            doms.push(ReactDOM.findDOMNode(this.refs[fldGrp.name + i]))
          };
          fg.filteredUniqueValues = fg.uniqueValues
          fg.filteredPossible = fg.allPossible
        }
      })
    })

    this.setState({ allCAV: cavCopy }, () => {
      doms.forEach((d: any) => {
        d.selectedIndex = 0
      })
    })
  }

  _checkIfFiltered =(fldGrp: any) => {
    let value = false
    value = fldGrp.filteredSelection.some((fs: any) => {
      return fs !== -1
    })
    return value
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
      return (d.name.toLowerCase() === lookup.toLowerCase())
    })
    return domainVals
  }

  _matchField =(lookup: string) => {
    let fieldVal = []
    fieldVal = this.props.data.data.fieldInfos.filter((f: any) => {
      return (f.fieldName.toLowerCase() === lookup.toLowerCase())
    })
    return fieldVal
  }
}
