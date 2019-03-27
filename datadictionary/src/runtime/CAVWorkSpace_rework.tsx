/** @jsx jsx */
import {BaseWidget, React} from 'jimu-core';
import {AllWidgetProps, css, jsx, styled} from 'jimu-core';
import {IMConfig} from '../config';

import { TabContent, TabPane, Navbar, Nav, NavItem, NavLink, NavbarBrand, Badge, Collapse, Icon,Table, Input, HTMLInputElement, Form
} from 'jimu-ui';
let refreshIcon = require('jimu-ui/lib/icons/filter.svg');

interface IProps {
  data: any,
  domains: any,
  requestURL: string,
  fieldGroups: any
}

interface IState {
  nodeData: any,
  allCAV: any,
  runtimeCAV: any,
  uniqueCAVChoice: any,
  filteredCAVs: any,
  filterSelector: any,
  selectOptions: any,
  resultsOptions: any
}

export default class CAVWorkSpace extends React.Component <IProps, IState> {
  constructor(props: IProps){
    super(props);

    this.state = {
      nodeData: this.props.data.data,
      allCAV: [],
      runtimeCAV: {},
      uniqueCAVChoice: {},
      filteredCAVs: {},
      filterSelector: [],

      selectOptions: {},
      resultsOptions: {}
    };

  }

  componentWillMount() {
    this._requestObject();
    //test
  }

  componentDidMount() {
  }

  render(){

    let ListTables =() => {
      let tableSets = [];
      if(this.state.uniqueCAVChoice !== {}) {
        for(let keyNode in this.state.uniqueCAVChoice) {
          let tableObj = (
            <div style={{width:"100%"}}>
            <div style={{fontWeight:"bold"}}>
              <div style={{display:"inline", float:"left"}}>{keyNode}</div>
              <div style={{display:"inline", float:"right"}} onClick={()=>{this.resetInputs(keyNode, 1)}}><Icon icon={refreshIcon} size='14' color='#333' /></div>
            </div>
            <Table size={"500px"}>
            <thead>
            <tr>

            </tr>
            </thead>
            <tbody>
              <tr>

              </tr>
            </tbody>
          </Table>
          </div>);

          tableSets.push(tableObj);
        }
      }
      return tableSets;
    }

    return (
    <div style={{backgroundColor: "#fff", float:"left", display:"inline-block"}}>
        <div style={{ paddingLeft:10, paddingRight:10, paddingTop: 10}}>
          <div>{ListTables()}</div>
        </div>
    </div>);
  }

  _requestObject = async() => {
    let url = this.props.requestURL + "/queryContingentValues?layers="+this.props.data.parentId+"&f=pjson";
    fetch(url, {
      method: 'GET'
    })
    .then((response) => {return response.json()})
    .then((data) => {
      if(data.hasOwnProperty("contingentValueSets")) {
        this.setState({allCAV: data.contingentValueSets});
        this._filterCurrentCAV();
        this._createSelectOptions();
      }
    });
  }

  _filterCurrentCAV =() => {
    let activeCAVs = {};
    let unique = {};
    let filterbyLayer = this.state.allCAV.filter((cav: any) => {
      return (cav.layerId === this.props.data.parentId);
    });
    if(filterbyLayer.length > 0) {
      filterbyLayer[0].fieldGroups.map((fg: any, z:number) => {
        let filterContigent = fg.contingencies.filter((c: any) => {
          return (c.subtypeCode === this.props.data.data.subtypeCode);
        });
        if(filterContigent.length > 0) {
          let justValues = [];
          filterContigent.map((fc:any, i: number) => {
            if(i === 0) {
              unique[fg.name] = new Array(fc.values.length);
            }
            justValues.push(fc.values);
            fc.values.map((v:any, z: number) => {
              if(typeof(unique[fg.name][z]) === "undefined") {
                unique[fg.name][z] = [];
              }
              unique[fg.name][z].push(v);
              unique[fg.name][z] = Array.from(new Set(unique[fg.name][z]));
            });
          });
          activeCAVs[fg.name] = justValues;
        }
      });
    }
    this.setState({runtimeCAV: activeCAVs, uniqueCAVChoice: unique});
  }

  _createSelectOptions =() => {
    let selectSets = {};
    console.log(this.state.uniqueCAVChoice);
    for(let keyNode in this.state.uniqueCAVChoice) {
      selectSets[keyNode] = [];
      let filterCAVFieldGroups = this.props.data.fieldGroups.filter((fg: any) => {
        return(fg.name === keyNode);
      });
      if(filterCAVFieldGroups.length > 0) {
        let numSlots = this.state.uniqueCAVChoice[keyNode].length;
        for(let i=0; i < numSlots; i++) {
          selectSets[keyNode][i] = [];
          let selOption = [];
          let matchField = this._matchField(filterCAVFieldGroups[0].fieldNames.names[i]);
          if(matchField.length > 0) {
            let matchDomain = this._matchDomain(matchField[0].domainName);
            let codeValues = matchDomain[0].codedValues;
            this.state.uniqueCAVChoice[keyNode][i].map((cav: any, c: number) => {
              let matchCV = codeValues.filter((cv:any) => {
                return(cv.code === cav);
              });
              if(matchCV.length > 0) {
                selectSets[keyNode][i].push(<option key={c} value={cav}>{matchCV[0].name}</option>);
              } else {
                selectSets[keyNode][i].push(<option key={c} value={cav}>{cav}</option>);
              }
            });
          }
        }
      }
    }
    console.log(selectSets);
    return selectSets;
  }




  _createCAVOptions =() => {
    let tableObj = [];
    console.log(this.state.uniqueCAVChoice);
    for(let keyNode in this.state.uniqueCAVChoice) {

      let filterCAVFieldGroups = this.props.data.fieldGroups.filter((fg: any) => {
        return(fg.name === keyNode);
      });

      if(filterCAVFieldGroups.length > 0) {
        let CAVNumber = this.state.uniqueCAVChoice[keyNode].length;
        let header = [];
        let rows = [];
        let validCAVgroup = true;
        for(let i=0; i < CAVNumber; i++) {
          if(this.state.uniqueCAVChoice[keyNode][i].length === 1) {
            if(this.state.uniqueCAVChoice[keyNode][i][0] === true || this.state.uniqueCAVChoice[keyNode][i][0] === false) {
              validCAVgroup = false;
            }
          }
        }
        if(validCAVgroup) {
          for(let i=0; i < CAVNumber; i++) {
            let selOption = [];
            let textList = [];
            let matchField = this._matchField(filterCAVFieldGroups[0].fieldNames.names[i]);
            if(matchField.length > 0) {
              let matchDomain = this._matchDomain(matchField[0].domainName);
              let codeValues = matchDomain[0].codedValues;
              this.state.uniqueCAVChoice[keyNode][i].map((cav: any, c: number) => {
                let matchCV = codeValues.filter((cv:any) => {
                  return(cv.code === cav);
                });
                if(matchCV.length > 0) {
                  selOption.push(<option key={c} value={cav}>{matchCV[0].name}</option>);
                } else {
                  selOption.push(<option key={c} value={cav}>{cav}</option>);
                }
              });
              let filterResult = this.state.filteredCAVs[keyNode];
              if(typeof(filterResult) !== "undefined") {
                if(typeof(document.getElementById(keyNode+i)) !== "undefined") {
                  let value = (document.getElementById(keyNode+i) as HTMLInputElement).value;
                  if(value === "") {
                    let unique = [];
                    if(filterResult.hasOwnProperty("list")) {
                      filterResult.list.map((li: any, z: any) => {
                        if(unique.indexOf(li[i]) <= -1) {
                          unique.push(li[i]);
                          let matchCV = codeValues.filter((cv:any) => {
                            return(cv.code === li[i]);
                          });
                          if(matchCV.length > 0) {
                            textList.push(<div key={i+"-"+z}>{matchCV[0].name}</div>);
                          } else {
                            textList.push(<div key={i+"-"+z}>{li[i]}</div>);
                          }
                        }
                      });
                    }
                  }
                }
              }
              header.push(<th key={i} style={{fontSize:"small", fontWeight:"bold"}}><div style={{fontSize:"small"}}>{filterCAVFieldGroups[0].fieldNames.names[i]}</div>
                <Input type="select" name={keyNode+i} id={keyNode+i} onChange={(e:any)=>{this._showCAVMatch(keyNode, document.getElementById(keyNode+i), i)}}><option value="" selected>Choose an option</option>{selOption}</Input>
              </th>);
              rows.push(<td key={i}>{textList}</td>);
            }
          }

          tableObj.push(
            <div style={{width:"100%"}}>
            <div style={{fontWeight:"bold"}}>
              <div style={{display:"inline", float:"left"}}>{keyNode}</div>
              <div style={{display:"inline", float:"right"}} onClick={()=>{this.resetInputs(keyNode, CAVNumber)}}><Icon icon={refreshIcon} size='14' color='#333' /></div>
            </div>
            <Table size={"500px"}>
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
          </div>);

        } else {
          tableObj[0] = <div style={{width:"100%"}}>No defined Contigent Attribute Values</div>;
        }

      }

    }
    return tableObj;
  }

  //helper functions
  _showCAVMatch =(name: string, code: any, pos:number) => {
    //let selValue = code.options[code.selectedIndex].value;
    let cavList = this.state.runtimeCAV[name];
    let userSelect = [];
    let filterList = cavList;
    let unique = {};
    unique[name] = [];
    for(let i =0; i < cavList[0].length; i++) {
      userSelect[i] = (document.getElementById(name+i) as HTMLInputElement).value;
      if(userSelect[i] !== "") {
        filterList = filterList.filter((cl:any) => {
          return (cl[i].toString() == userSelect[i].toString());
        });
      }
      filterList.map((fl:any, b:number) => {
        if(typeof(unique[name][i]) === "undefined") {
          unique[name][i] = [];
        }
        unique[name][i].push(fl[i]);
        unique[name][i] = Array.from(new Set(unique[name][i]));
      });
    }
    let existingUnique = {...this.state.uniqueCAVChoice};
    existingUnique[name] = unique[name];
    let final = {...this.state.filteredCAVs};
    final[name] = {};
    final[name]["list"] = filterList;
    final[name]["filtered"] = true;
    this.setState({filteredCAVs: final, uniqueCAVChoice: existingUnique});
    return true;
  }

  resetInputs =(name: string, count: number) => {
    console.log(this.state.uniqueCAVChoice);
    console.log("*********************");
    let final = {...this.state.filteredCAVs};
    final[name] = {};
    this.setState({filteredCAVs: final});
    this._filterCurrentCAV();
    for(let i=0; i < count; i++) {
      let userSelect = (document.getElementById(name+i) as HTMLInputElement) ;
      userSelect.options[0].selected = true;
    }


  }

  _compare =(prop: any) => {
    return function(a: any, b: any) {
      let comparison = 0;
      if (a[prop] > b[prop]) {
        comparison = 1;
      } else if (a[prop] < b[prop]) {
        comparison = -1;
      }
      return comparison;
    }
  }

  _validAssetTypes =(lookup: string) => {
    let domainVals = [];
    let currentAT = this.state.nodeData.fieldInfos.filter((fi:any)=> {
      return(fi.fieldName === lookup);
    });
    if(currentAT.length > 0) {
      domainVals = this.props.domains.filter((d:any)=> {
        return(d.name === currentAT[0].domainName);
      });
    }
    return domainVals;
  }

  _matchDomain =(lookup: string) => {
    let domainVals = [];
    domainVals = this.props.domains.filter((d:any)=> {
      return(d.name.toLowerCase() === lookup.toLowerCase());
    });
    return domainVals;
  }

  _matchField =(lookup: string) => {
    let fieldVal = [];
    fieldVal = this.props.data.data.fieldInfos.filter((f:any)=> {
      return(f.fieldName.toLowerCase() === lookup.toLowerCase());
    });
    return fieldVal;
  }

}
