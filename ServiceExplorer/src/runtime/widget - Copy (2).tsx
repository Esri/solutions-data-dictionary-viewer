/** @jsx jsx */
import {BaseWidget, React, ReactDOM, classNames, FormattedMessage, defaultMessages as jimuCoreDefaultMessage} from 'jimu-core';
import {AllWidgetProps, css, jsx, styled} from 'jimu-core';
import {IMConfig} from '../config';
import {loadArcGISJSAPIModules} from 'jimu-arcgis';
import { TabContent, TabPane, Nav, NavItem, NavLink, Button, Image, ButtonDropdown, Popover, PopoverHeader, PopoverBody, Icon, Input,
  Modal, ModalHeader, ModalBody, ModalFooter, Collapse, Alert } from 'jimu-ui';
import defaultMessages from './translations/default';
import {ServiceExplorerTree} from './ServiceExplorerTree';
import SubtypeCard from './SubtypeCard';
import SubtypesCard from './SubTypesCard';
import RelationshipCard from './relationshipCard';
import RelationshipsCard from './RelationshipsCard';
import MinimizedCard from './MinimizedCard';
import AttributeRulesCard from './AttributeRulesCard';
import AttributeRuleCard from './AttributeRuleCard';
import FieldsCard from './FieldsCard';
import FieldCard from './FieldCard';
import IndexCard from './IndexCard';
import IndexesCard from './IndexesCard';
import DomainsCard from './DomainsCard';
import DomainCard from './DomainCard';
import TablesCard from './TablesCard';
import TableCard from './TableCard';
import LayerCard from './LayerCard';
import LayersCard from './LayersCard';
import UtilityNetworkCard from './UtilityNetworkCard';
import DomainNetworkCard from './DomainNetworkCard';
import DomainNetworksCard from './DomainNetworksCard';
import NetworkAttributeCard from './NetworkAttributeCard';
import NetworkAttributesCard from './NetworkAttributesCard';
import TerminalConfigurationCard from './TerminalConfigurationCard';
import TerminalConfigurationsCard from './TerminalConfigurationsCard';
import CategoryCard from './CategoryCard';
import CategoriesCard from './CategoriesCard';
import AssetTypeCard from './AssetTypeCard';
import { any } from 'prop-types';
import './css/custom.css';
let heartIcon = require('jimu-ui/lib/icons/heart.svg');
let searchIcon = require('jimu-ui/lib/icons/search.svg');
let deleteIcon = require('jimu-ui/lib/icons/delete.svg');
let treeIcon = require('jimu-ui/lib/icons/datasource.svg');
let panelIcon = require('jimu-ui/lib/icons/toc-add-page.svg');

export default class Widget extends BaseWidget<AllWidgetProps<IMConfig>, any>{
  constructor(props){
    super(props);
    this.treeRef = React.createRef();
    this.toggleHistory = this.toggleHistory.bind(this);
    this.toggleSearch = this.toggleSearch.bind(this);
    this.toggleTree = this.toggleTree.bind(this);

    this.state = {
      useCache: (props.config.useCache)?props.config.useCache:true,
      cacheId: props.config.cacheId,
      cacheData: null,
      stagePanels: 0,
      showPanel2: false,
      panelList: [],
      activeTab: 'properties',
      requestURL: props.config.url,
      serviceElements: {},
      hasDataElements: false,
      controllerDS: null,
      dataElements: [],
      layerElements: [],
      relationshipElements: [],
      domainElements: [],
      metadataElements: null,
      serviceNodes: [],
      showTree: true,
      treeReady:false,
      showActiveOptions: "block",
      contentStartLocation: 400,
      popoverOpen: false,
      popoverSearch: false,
      favoriteCards: [],
      masterFavoriteCards: [],
      activeCards: [],
      masterActiveCards: [],
      activeSearching: false,
      deleteModal: false,
      deleteAllType: "active",
      favoriteAlert: false,
      winHeight: document.body.clientHeight,
      cardWidth: (document.body.clientWidth - 425),
    };
  }
  //https://pleblanc3.esri.com/server/rest/services/cav/FeatureServer
  //https://arcgisutilitysolutionsdemo.esri.com/server/rest/services/Water_Distribution_Utility_Network/FeatureServer
  //https://arcgisutilitysolutionsdemo.esri.com/server/rest/services/Water_Distribution_Utility_Network_Metadata/FeatureServer

  toggle = (tab:string) => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  };

  toggleHistory() {
    this.setState({popoverOpen: !this.state.popoverOpen});
  }

  toggleSearch() {
    this.setState({popoverSearch: !this.state.popoverSearch});
  }

  componentWillMount() {
    let newActive = [...this.state.activeCards];
    newActive[0] = [];
    newActive[1] = [];
    this.setState({
      activeCards: newActive,
      masterActiveCards: newActive
    },()=> {
      let newPanelList = [...this.state.panelList];
      newPanelList[0] = [];
      newPanelList[0].push(
        <div key={"stage0"} id={"stage0"} className="customScrollStyle" style={{height:this.state.winHeight, width:this.state.cardWidth+10, overflowX:"auto", overflowY:"auto", backgroundColor:"#efefef", border:2, borderColor:"#aaa", borderStyle:"dashed", display:"inline-block"}}>
        {this.state.activeCards[0]}
        </div>
      );
      this.setState({panelList:newPanelList});
    });
    this.parseURL();
  }

  componentDidMount() {
    if(this.state.useCache) {
      let data = this.pullDataFromCache().then((d:any) => {
        this.setState({cacheData: d},() => {
          this.requestServiceDetails().then(() => {
            this._requestObject("queryDataElements", -1).then(() => {
              this._requestObject("relationships", -1).then(() => {
                this._requestObject("queryDomains", -1).then(() => {
                  this._processData();
                  this.setState({treeReady:true});
     // ReactDOM.render(<ServiceExplorerTree theme={this.props.theme} width={390} callback={this._callbackFromTree} data={this.state.serviceNodes} callbackActiveCards={this._callbackGetActiveCards} ref={this.treeRef} />, document.getElementById("serviceExplorerTree"));
                  this._checkCookie();
                  this._parseStartUpURL();
                });
              });
            });
          });
        });
      });
    } else {
      this.requestServiceDetails().then(() => {
        this._requestObject("queryDataElements", -1).then(() => {
          this._requestObject("relationships", -1).then(() => {
            this._requestObject("queryDomains", -1).then(() => {
              this._processData();
              this.setState({treeReady:true});
              this._checkCookie();
              this._parseStartUpURL();
            });
          });
        });
      });
    }
    //this._featureLayerList();
  }

  componentDidUpdate() {
  }

  render(){

/*
        <Button id="popoverSearch" type="secondary" onClick={this.toggleSearch}>
          <Icon icon={searchIcon} size='16' color='#333' />
        </Button>
        <Popover placement="left" isOpen={this.state.popoverSearch} target="popoverSearch">
          <PopoverHeader>Search Active Cards</PopoverHeader>
          <PopoverBody>
            <Input placeholder="Search Active Cards" ref="activeSearchValue" onChange={(e)=>{this.searchService(e.target.value, "active")}}></Input>
          </PopoverBody>
        </Popover>
        <br></br>
*/


    return <div className="widget-demo" style={{top:0, height:this.state.winHeight, backgroundColor:"#fff"}}>
      <div>
        <Collapse isOpen={this.state.showTree}>
        {this.state.treeReady && <ServiceExplorerTree width={400} callback={this._callbackFromTree} data={this.state.serviceNodes} callbackActiveCards={this._callbackGetActiveCards} ref={this.treeRef} />}
        </Collapse>
      </div>
      <div id="serviceExplorerStage" style={{top:0, height:this.state.winHeight -5, left:this.state.contentStartLocation, position: "absolute", overflowX:"auto", overflowY:"auto", whiteSpace: "nowrap"}}>
        <div key={"stage0"} id={"stage0"} style={{height:"99%", width:this.state.cardWidth+10, overflowX:"auto", overflowY:"auto", backgroundColor:"#efefef", border:2, borderColor:"#aaa", borderStyle:"dashed", display:"inline-block"}}>
        {this.state.activeCards[0]}
        </div>
        {this.state.showPanel2 &&
          <div key={"stage1"} id={"stage1"} style={{height:"99%", width:this.state.cardWidth+10, overflowX:"auto", overflowY:"auto", backgroundColor:"#efefef", border:2, borderColor:"#aaa", borderStyle:"dashed", display:"inline-block"}}>
          {this.state.activeCards[1]}
          </div>
        }
      </div>
      <div id="serviceExplorerSidebar" style={{top:0, left: 0, position: "relative", width:"60px", textAlign: "left", display:this.state.showActiveOptions}}>
        <Button id="PopoverTree" type="secondary" onClick={this.toggleTree}>
          <Icon icon={treeIcon} size='17' color='#00f' />
        </Button>
        <br></br>
        <Button id="addPanel" type="secondary" onClick={this.togglePanel2}>
          <Icon icon={panelIcon} size='16' color='#333' />
        </Button>
        <br></br>
        <Button id="popoverDelete" type="secondary" onClick={this.deleteAllActiveAsk}>
          <Icon icon={deleteIcon} size='16' color='#f00' />
        </Button>
        <br></br>
        <Button id="PopoverClick" type="secondary" onClick={this.toggleHistory}>
          <Icon icon={heartIcon} size='16' color='#FFA500' />
        </Button>
        <Popover innerClassName="popOverBG" placement="right" isOpen={this.state.popoverOpen} target="PopoverClick">
          <PopoverHeader><div className="leftRightPadder5" style={{float:"left"}}>Favorites</div><div className="leftRightPadder5" style={{float:"right"}} onClick={this.deleteAllFavoritesAsk}><Icon icon={deleteIcon} size='18' color='#333' /></div></PopoverHeader>
          <PopoverBody>
            <div className="leftRightPadder5">
              <Input placeholder="Search favorites" ref="favoritesSearchValue" onChange={(e)=>{this.searchService(e.target.value, "favorites")}}></Input>
              <div style={{paddingBottom:"5px"}}></div>
              {this.state.favoriteCards}
            </div>
            <div style={{paddingBottom:"10px"}}></div>
          </PopoverBody>
        </Popover>
      </div>
      <Modal isOpen={this.state.deleteModal}>
        <ModalBody>
          Are you sure you want to clear all?
        </ModalBody>
        <ModalFooter>
          <Button type="danger" onClick={this.deleteAllYes}>Yes</Button>{' '}
          <Button color="secondary" onClick={this.deleteAllNo}>No</Button>
        </ModalFooter>
      </Modal>
      <div style={{width:225, position: "relative", top: 0, left:0}}>
        <Alert color="warning" isOpen={this.state.favoriteAlert} toggle={()=> {this.setState({favoriteAlert:false})}}>
          <div style={{width:"100%", height:"100%", fontWeight:"bold", fontSize:"smaller"}}>
            Added to favorites.
          </div>
        </Alert>
      </div>
    </div>;

    /*
        <Button id="addPanel" color="secondary" type="button" onClick={this.togglePanel2}>
          <Icon icon={panelIcon} size='16' color='#333' />
        </Button>
        <br></br>
    */
  }

  //Request Info
  requestServiceDetails = async () => {
    //let qDE_url = FSurl + "/queryDomains?layers=" + args.searchLayers +"&f=pjson";
    if(this.state.useCache) {
      this.setState({serviceElements: this.state.cacheData.featureServer});
    } else {
      let url = this.state.requestURL + "/?f=pjson";
      await fetch(url, {
        method: 'GET'
      })
      .then((response) => {return response.json()})
      .then((data) => {
        if(!data.hasOwnProperty("error")){
          this.setState({serviceElements: data});
        }
      });
    }
  }

  _requestObject = async(type: any, layer: number) => {
    let url = this.state.requestURL;
    let data = null;
    if(layer !== -1) {
      if(type === "metadata") {
        if(this.state.useCache) {
          data = this.state.cacheData.metadata[layer];
        } else {
          url = url + "/" + layer + "/" + type;
        }
      } else {
        if(type !== null) {
          url = url + "/" + layer + "/" + type + "?f=pjson";
        } else {
          if(this.state.useCache) {
            data = this.state.cacheData.layers[layer];
            //url = this.state.cachePath + "layers/" + layer + ".json";
          } else {
            url = url + "/" + layer + "?f=pjson";
          }
        }
      }
    } else {
      if(this.state.useCache) {
        data = this.state.cacheData[type];
        //url = this.state.cachePath + type + "/" + type + ".json";
      } else {
        url = url + "/" + type + "?f=pjson";
      }
    }
    if(!this.state.useCache) {
      let request = await fetch(url, {
        method: 'GET'
      });
      if(type === "metadata") {
        data = await request.text();
      } else {
        data = await request.json();
      }
    }
    switch(type) {
      case "queryDataElements": {
        if(!data.hasOwnProperty("error")){
          var controllerDS = data.layerDataElements.filter((lde:any) => {
            return lde.dataElement.hasOwnProperty("domainNetworks");
          });
          if(controllerDS.length > 0) {
            this.setState({hasDataElements: true, dataElements: data.layerDataElements, controllerDS: controllerDS[0]});
          } else {
            this.setState({hasDataElements: true, dataElements: data.layerDataElements});
          }
        }
        break;
      }
      case "relationships": {
        if(!data.hasOwnProperty("error")){
          this.setState({relationshipElements: data.relationships});
        }
        break;
      }
      case "queryDomains": {
        if(!data.hasOwnProperty("error")){
          this.setState({domainElements: data.domains});
        }
        break;
      }
      case "metadata": {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(data,"text/xml");
        this.setState({metadataElements: xmlDoc});
        break;
      }
      default:
        break;
    }
    return data;
  }

  //process json from service and format into node structure tree is expecting.
  _processData =() => {
    let data = {...this.state.serviceElements};
    let domains = [...this.state.domainElements];
    let relationship = [...this.state.relationshipElements];
    let unData = null;
    let checkNodes = null;
    domains.sort(this._compare("name"));

    data.layers.map((layer: any, i:number) => {
      checkNodes = this._queryDataElement(layer.id);
      if(checkNodes.hasOwnProperty("dataElement")) {
        if(checkNodes.dataElement.hasOwnProperty("domainNetworks")) {
          unData = this._queryDataElement(layer.id);
        }
      }
    });
    let nodeStructure = {
      id: (data.hasOwnProperty("documentInfo"))?data.documentInfo.Title:data.serviceDescription,
      type: "Feature Service",
      text: (data.hasOwnProperty("documentInfo"))?data.documentInfo.Title:data.serviceDescription,
      subNodeCount: 0,
      icon: "",
      requestAdditional: false,
      root: true,
      clickable: false,
      data:unData,
      crumb:[],
      search: false,
      nodes: []
    };
    //Handling LAYERS nodes
    let layersNode = {
      id: "Layers",
      type: "Layers",
      text: "Layers",
      subNodeCount: this.state.serviceElements.layers.length,
      data: this.state.serviceElements.layers,
      clickable: true,
      crumb:[
        {type: "Feature Service",value:(data.hasOwnProperty("documentInfo"))?data.documentInfo.Title:data.serviceDescription, node: nodeStructure.id}
      ],
      search: false,
      nodes:[]
    };
    layersNode.nodes = data.layers.map((layer: any, i:number) => {
      let checkNodes = this._queryDataElement(layer.id);
      let simpleData = layer;
      let type="Layer";
      if(checkNodes.hasOwnProperty("dataElement")) {
        if(checkNodes.dataElement.hasOwnProperty("domainNetworks")) {
          type = "Utility Network"
        }
      }
      let subNode = {
        id: layer.id,
        type: type,
        text: layer.name,
        subNodeCount: 0,
        icon: "",
        requestAdditional: true,
        nodes: [],
        search: false,
        data: (this.state.hasDataElements)?this._queryDataElement(layer.id):simpleData,
        clickable: true
      };
      subNode["crumb"]= [
        {type: "Feature Service", value: (data.hasOwnProperty("documentInfo"))?data.documentInfo.Title:data.serviceDescription, node: nodeStructure.id},
        {type: "Layers", value:"Layers", node: layersNode.id}
      ];
      if(this.state.hasDataElements) {
        let crumb = [
          {type: "Feature Service", value: (data.hasOwnProperty("documentInfo"))?data.documentInfo.Title:data.serviceDescription, node: nodeStructure.id},
          {type: "Layers", value:"Layers", node: layersNode.id},
          {type: type, value:layer.name, node: subNode.id}
        ];
        subNode.nodes = this._processDataElements(layer.id, crumb, layer.name);
      } else {
        this._requestObject(null,layer.id).then((data) => {
          subNode.data = data;
          subNode.nodes = this._processDataSimple(data, layer.id);
        });
      }
      return(subNode);
    });
    nodeStructure.nodes.push(layersNode);

    //Handling TABLE nodes
    let tablesNode = {
      id: "Tables",
      type: "Tables",
      text: "Tables",
      subNodeCount: this.state.serviceElements.tables.length,
      data: this.state.serviceElements.tables,
      clickable: true,
      crumb:[
        {type: "Feature Service", value: (data.hasOwnProperty("documentInfo"))?data.documentInfo.Title:data.serviceDescription, node:nodeStructure.id}
      ],
      search: false,
      nodes: []
    };
    data.tables.map((table: any, i:number) => {
      let newCrumb = [
        {type: "Feature Service", value: (data.hasOwnProperty("documentInfo"))?data.documentInfo.Title:data.serviceDescription, node:nodeStructure.id},
        {type: "Tables", value:"Tables", node:tablesNode.id},
      ];
      let simpleData = table;
      let nodeStruct = {
        id: table.id,
        type: "Table",
        text: table.name,
        subNodeCount: 0,
        icon: "",
        requestAdditional: true,
        nodes: [],
        search: false,
        data: (this.state.hasDataElements)?this._queryDataElement(table.id):simpleData,
        clickable: true,
        crumb:newCrumb,
      };
      if(this.state.hasDataElements) {
        nodeStruct.nodes = this._processDataElements(table.id, newCrumb, "Table");
      } else {
        this._requestObject(null,table.id).then((data) => {
          nodeStruct.data = data;
          nodeStruct.nodes = this._processDataSimple(data, table.id);
        });
      }
      tablesNode.nodes.push(nodeStruct);
    });
    nodeStructure.nodes.push(tablesNode);

    //Handling RELATIONSHIP nodes
    if(this.state.serviceElements.hasOwnProperty("relationships")) {
      let relationNode = {
        id: "Relationships",
        type: "Relationships",
        text: "Relationships",
        subNodeCount: this.state.serviceElements.relationships.length,
        data: relationship,
        clickable: true,
        crumb:[
          {type: "Feature Service", value: (data.hasOwnProperty("documentInfo"))?data.documentInfo.Title:data.serviceDescription, node:nodeStructure.id}
        ],
        search: false,
        nodes: []
      };
      relationship.map((relship: any, i:number) => {
        let newCrumb = [
          {type: "Feature Service", value: (data.hasOwnProperty("documentInfo"))?data.documentInfo.Title:data.serviceDescription, node:nodeStructure.id},
          {type: "Relationships", value:"Relationships", node:relationNode.id},
        ];
        let reSubNode = {
          id: relship.id,
          type: "Relationship",
          text: relship.name,
          subNodeCount: 0,
          icon: "",
          requestAdditional: false,
          data: relship,
          clickable: true,
          crumb:newCrumb,
          search:false
        };
        relationNode.nodes.push(reSubNode);
      });
      nodeStructure.nodes.push(relationNode);
    }

    //Handling DOMAINS nodes
    if(this.state.domainElements.length > 0) {
      let domainNode = {
        id: "Domains",
        type: "Domains",
        text: "Domains",
        subNodeCount: this.state.domainElements.length,
        data: domains,
        clickable: true,
        crumb:[
          {type: "Feature Service", value: (data.hasOwnProperty("documentInfo"))?data.documentInfo.Title:data.serviceDescription, node:nodeStructure.id}
        ],
        search: false,
        nodes: []
      };
      domains.map((domain: any, i:number) => {
        let newCrumb = [
          {type: "Feature Service", value: (data.hasOwnProperty("documentInfo"))?data.documentInfo.Title:data.serviceDescription, node:nodeStructure.id},
          {type: "Domains", value:"Domains", node:domainNode.id},
        ];
        domainNode.nodes.push({
          id: domain.name,
          type: "Domain",
          text: domain.name,
          subNodeCount: 0,
          icon: "",
          requestAdditional: false,
          data: domain,
          clickable: true,
          search: false,
          crumb:newCrumb,
        });
      })
      nodeStructure.nodes.push(domainNode);
    }

    //Handling UN specific nodes
    if(unData !== null) {
      let domainNetworkNode = {
        id: "UtilityNetwork",
        type: "Controller Dataset",
        text: "Controller Dataset",
        subNodeCount: 0,
        data: unData,
        clickable: true,
        crumb:[
          {type: "Feature Service", value: (data.hasOwnProperty("documentInfo"))?data.documentInfo.Title:data.serviceDescription, node:nodeStructure.id}
        ],
        search: false,
        nodes: []
      };
      let newCrumb = [
        {type: "Feature Service", value: (data.hasOwnProperty("documentInfo"))?data.documentInfo.Title:data.serviceDescription, node:nodeStructure.id},
        {type: "Controller Dataset", value:"Controller Dataset", node: domainNetworkNode.id},
      ];
      domainNetworkNode.nodes = this._processDataElements(unData.layerId, newCrumb, "Feature Service");
      nodeStructure.nodes.unshift(domainNetworkNode);
    }

    console.log(nodeStructure);
    this.setState({serviceNodes: [nodeStructure]});
    //this._serviceList(rest);
  }

  _processDataElements(id: any, crumb:any, parent: string) {
    let filtered = this.state.dataElements.filter((de: any) => {
      if(de.layerId === id) {return de}
    });
    let nodeData = [];
    if(filtered.length > 0) {
      filtered.map((de: any) => {
        //Handing SUBTYPES nodes
        if(de.dataElement.hasOwnProperty("subtypeFieldName")) {
          let stNode = {
            id: de.layerId + "_subtype",
            type: "Subtypes",
            text: "Subtypes",
            subNodeCount: de.dataElement.subtypes.length,
            icon: "",
            requestAdditional: false,
            nodes: [],
            clickable: true,
            crumb: crumb,
            search: false,
            parent: parent
          };
          let newCrumb = [...crumb];
          newCrumb.push({
            type:"Subtypes",
            value:"Subtypes",
            node: stNode.id
          });
          //stNode.crumb = newCrumb;
          stNode.nodes = this._processSubTypes(de.dataElement.subtypes, de.layerId + "_subtype", de.layerId, de.dataElement.fields.fieldArray, de.dataElement.fieldGroups, de.dataElement.attributeRules, newCrumb, parent);
          nodeData.push(stNode);
        }
        //Handing ATTRIBUTE RULES nodes
        if(de.dataElement.hasOwnProperty("attributeRules")) {
          let arNode = {
            id: de.layerId + "_attrRules",
            type: "Attribute Rules",
            text: "Attribute Rules",
            subNodeCount: de.dataElement.attributeRules.length,
            icon: "",
            data: de.dataElement.attributeRules,
            subtypes: de.dataElement.subtypes,
            requestAdditional: false,
            nodes: [],
            clickable: true,
            search: false,
            crumb: crumb,
            parent: parent
          };
          let newCrumb = [...crumb];
          newCrumb.push({
            type:"Attribute Rules",
            value:"Attribute Rules",
            node: arNode.id
          });
          //arNode["crumb"] = newCrumb;
          arNode.nodes = this._processAttrRules(de.dataElement.attributeRules, de.layerId + "_attrRules", de.dataElement.subtypes, newCrumb, parent);
          nodeData.push(arNode);
        }
        //Handing FIELD nodes
        if(de.dataElement.hasOwnProperty("fields")) {
          let fieldsNode = {
            id: de.layerId + "_allfields",
            type: "Fields",
            text: "Fields",
            subNodeCount: de.dataElement.fields.fieldArray.length,
            icon: "",
            data: de.dataElement.fields.fieldArray,
            st: de.dataElement.subtypes,
            requestAdditional: false,
            nodes: [],
            clickable: true,
            search: false,
            crumb: crumb,
            parent: parent
          };
          let newCrumb = [...crumb];
          newCrumb.push({
            type:"Fields",
            value:"Fields",
            node: fieldsNode.id
          });
          //fieldsNode.crumb = newCrumb;
          fieldsNode.nodes = this._processFields(de.dataElement.fields.fieldArray, de.layerId + "_allfields", de.dataElement.subtypes, de.layerId, newCrumb, parent);
          nodeData.push(fieldsNode);
        }
        //Handing INDEX nodes
        if(de.dataElement.hasOwnProperty("indexes")) {
          let indexesNode = {
            id: de.layerId + "_indexes",
            type: "Indexes",
            text: "Indexes",
            subNodeCount: de.dataElement.indexes.indexArray.length,
            icon: "",
            data: de.dataElement.indexes.indexArray,
            requestAdditional: false,
            nodes: [],
            clickable: true,
            search: false,
            crumb: crumb,
            parent: parent
          };
          let newCrumb = [...crumb];
          newCrumb.push({
            type:"Indexes",
            value:"Indexes",
            node: indexesNode.id
          });
          //indexesNode.crumb = newCrumb;
          indexesNode.nodes = this._processIndexes(de.dataElement.indexes.indexArray, de.layerId + "_indexes", newCrumb, parent);
          nodeData.push(indexesNode);
        }
        //UN layer type specific
        if(de.dataElement.hasOwnProperty("domainNetworks")) {
          // UN CATEGORIES nodes
          let cNode = {
            id: de.layerId + "_categories",
            type: "Categories",
            text: "Categories",
            subNodeCount: de.dataElement.categories.length,
            icon: "",
            requestAdditional: false,
            data: de.dataElement.categories,
            clickable: true,
            search: false,
            crumb: crumb,
            nodes: []
          };
          let cCrumb = [...crumb];
          cCrumb.push({
            type:"Categories",
            value:"Categories",
            node: cNode.id
          });
          //cNode.crumb = cCrumb;
          cNode.nodes = this._processCategories(de.dataElement.categories, de.layerId + "_categories", cCrumb);
          nodeData.push(cNode);

          // UN DOMAIN NETWORK nodes
          let dnNode = {
            id: de.layerId + "_domainNetworks",
            type: "Domain Networks",
            text: "Domain Networks",
            subNodeCount: de.dataElement.domainNetworks.length,
            icon: "",
            requestAdditional: false,
            data: de.dataElement.domainNetworks,
            clickable: true,
            search: false,
            crumb: crumb,
            nodes: []
          };
          let dnCrumb = [...crumb];
          dnCrumb.push({
            type:"Domain Networks",
            value:"Domain Networks",
            node: dnNode.id
          });
          //dnNode.crumb = dnCrumb;
          dnNode.nodes = this._processDomainNetworks(de.dataElement.domainNetworks, de.layerId + "_domainNetwork", dnCrumb);
          nodeData.push(dnNode);

          // UN Network ATTRIBUTE nodes
          let naNode = {
            id: de.layerId + "_networkAttributes",
            type: "Network Attributes",
            text: "Network Attributes",
            subNodeCount: de.dataElement.networkAttributes.length,
            icon: "",
            requestAdditional: false,
            data: de.dataElement.networkAttributes,
            clickable: true,
            search: false,
            crumb: crumb,
            nodes: []
          };
          let naCrumb = [...crumb];
          naCrumb.push({
            type:"Network Attributes",
            value:"Network Attributes",
            node: naNode.id
          });
          //naNode.crumb = naCrumb;
          naNode.nodes = this._processNetworkAttributes(de.dataElement.networkAttributes, de.layerId + "_networkAttributes", naCrumb);
          nodeData.push(naNode);

          // UN Terminal Config nodes
          let tcNode = {
            id: de.layerId + "_terminalConfigurations",
            type: "Terminal Configurations",
            text: "Terminal Configurations",
            subNodeCount: de.dataElement.terminalConfigurations.length,
            icon: "",
            requestAdditional: false,
            data: de.dataElement.terminalConfigurations,
            clickable: true,
            search: false,
            crumb: crumb,
            nodes: []
          };
          let tcCrumb = [...crumb];
          tcCrumb.push({
            type:"Terminal Configurations",
            value:"Terminal Configurations",
            node: tcNode.id
          });
          //tcNode.crumb = tcCrumb;
          tcNode.nodes = this._processTerminalConfigurations(de.dataElement.terminalConfigurations, de.layerId + "_terminalConfigurations", tcCrumb);
          nodeData.push(tcNode);
        }
      });
    }
    return nodeData;
  }

  _processDataSimple = (data: any, id: any) => {
    let nodeData = [];
    //this._requestObject(null,id).then((data) => {
      console.log(data);
      if(data.fields.length > 0) {
          let fNode = {
            id: id + "_fields",
            type: "Fields",
            text: "Fields (" + data.fields.length + ")",
            icon: "",
            data: data.fields,
            requestAdditional: false,
            nodes: this._processFields(data.fields, id + "_fields", null, id),
            clickable: true
          };
          nodeData.push(fNode);
      }
      if(data.indexes.length > 0) {
        let iNode = {
          id: id + "_indexes",
          type: "Indexes",
          text: "Indexes (" + data.indexes.length + ")",
          icon: "",
          data: data.indexes,
          requestAdditional: false,
          nodes: this._processIndexes(data.indexes, id + "_indexes"),
          clickable: true
        };
        nodeData.push(iNode);
    }
    //});
    return nodeData;
  }

  _processSubTypes =(subTypes: any, id: string, parentId: string, fields:any, fieldGroups:any, attributeRules: any, crumb:any, parent:string) => {
    subTypes.sort(this._compare("subtypeName"));
    let nodeData = [];
    if(subTypes.length > 0) {
      subTypes.map((st: any) => {
        let stNode = {
          id: id + "_" + st.subtypeCode,
          type: "Subtype",
          text: st.subtypeName,
          subNodeCount:0,
          icon: "",
          requestAdditional: true,
          data: st,
          fields: fields,
          fieldGroups: fieldGroups,
          attributeRules: attributeRules,
          clickable: true,
          parentId: parentId,
          search: false,
          crumb: crumb,
          parent: parent,
          nodes: []
        };
        let newCrumb = [...crumb];
        newCrumb.push({
          type:"Subtype",
          value: st.subtypeName,
          node: stNode.id
        });
        //stNode.crumb = newCrumb;
        stNode.nodes = this._processAssetTypes(st, id + "_" + st.subtypeCode, parentId, st.subtypeCode, newCrumb, parent);
        nodeData.push(stNode);
      });
    }
    return nodeData;
  }

  _processAssetTypes =(st:any, id:string, parentId: string, subtypeCode:number, crumb:any, parent:string) => {
    let nodeData = [];
    let atList = [];
    if(this.state.controllerDS !== null) {
      this.state.controllerDS.dataElement.domainNetworks.map((dn:any) => {
        var junctionSource = dn.junctionSources.filter((js:any) => {
          return js.layerId === parseInt(parentId);
        });
        if(junctionSource.length > 0) {
          var assetGroup = junctionSource[0].assetGroups.filter((ag:any) => {
            return ag.assetGroupCode === parseInt(st.subtypeCode);
          });
          if(assetGroup.length > 0) {
            atList = assetGroup[0].assetTypes;
          }
        } else {
          var edgeSource = dn.edgeSources.filter((es:any) => {
            return es.layerId === parseInt(parentId);
          });
          if(edgeSource.length > 0) {
            var assetGroup = edgeSource[0].assetGroups.filter((ag:any) => {
              return ag.assetGroupCode === parseInt(st.subtypeCode);
            });
            if(assetGroup.length > 0) {
              atList = assetGroup[0].assetTypes;
            }
          }
        }
      });
    }
    if(atList.length > 0) {
      atList.sort(this._compare("assetTypeName"));
      atList.map((at: any) => {
        nodeData.push({
          id: id+ "_" + at.assetTypeCode,
          type: "Assettype",
          text: at.assetTypeName,
          icon: "",
          requestAdditional: true,
          data: at,
          clickable: true,
          search: false,
          parentId: parentId,
          subtypeCode: subtypeCode,
          crumb: crumb,
          parent: parent
        });
      });
    }

    return nodeData;
  }

  _processAttrRules =(ar: any, id: string, subtypes: any, crumb:any, parent:string) => {
    ar.sort(this._compare("name"));
    let nodeData = [];
    if(ar.length > 0) {
      ar.map((fd: any, i: number) => {
        nodeData.push({
          id: id + "_" + fd.name,
          type: "Attribute Rule",
          text: fd.name,
          icon: "",
          requestAdditional: false,
          data: ar[i],
          subtypes: subtypes,
          clickable: true,
          crumb:crumb,
          search: false,
          parent:parent
        });
      });
    }
    return nodeData;
  }

  _processFields =(fields: any, id: string, subtypes: any,  parentId: string, crumb:any, parent:string) => {
    fields.sort(this._compare("name"));
    let nodeData = [];
    if(fields.length > 0) {
      fields.map((fd: any) => {
        nodeData.push({
          id: id + "_" + fd.name,
          type: "Field",
          text: fd.name,
          icon: "",
          requestAdditional: false,
          data: fd,
          st: subtypes,
          clickable: true,
          search: false,
          parentId: parentId,
          crumb:crumb,
          parent:parent
        });
      });
    }
    return nodeData;
  }

  _processIndexes =(indexes: any, id:string, crumb:any, parent:string) => {
    indexes.sort(this._compare("name"));
    let nodeData = [];
    if(indexes.length > 0) {
      indexes.map((idx: any) => {
        //don't add indexes with period in them.
        if(idx.name.indexOf(".") <= -1) {
          nodeData.push({
            id: id + "_" + idx.name,
            type: "Index",
            text: idx.name,
            icon: "",
            requestAdditional: false,
            data: idx,
            clickable: true,
            search: false,
            crumb:crumb,
            parent:parent
          });
        }
      });
    }
    return nodeData;
  }

  _processCategories =(categories: any, id: string, crumb:any) => {
    categories.sort(this._compare("name"));
    let nodeData = [];
    if(categories.length > 0) {
      categories.map((cat: any) => {
        let cleanId = id + "_" + cat.name.replace(/ /g, "_");
        nodeData.push({
          id: cleanId,
          type: "Category",
          text: cat.name,
          icon: "",
          requestAdditional: false,
          data: cat,
          clickable: true,
          search: false,
          crumb:crumb
        });
      });
    }
    return nodeData;
  }

  _processDomainNetworks =(domainNetworks: any, id: string, crumb:any) => {
    domainNetworks.sort(this._compare("domainNetworkAliasName"));
    let nodeData = [];
    if(domainNetworks.length > 0) {
      domainNetworks.map((dn: any) => {
        nodeData.push({
          id: id + "_" + dn.domainNetworkName,
          type: "Domain Network",
          text: dn.domainNetworkAliasName,
          icon: "",
          requestAdditional: false,
          data: dn,
          clickable: true,
          search: false,
          crumb:crumb
        });
      });
    }
    return nodeData;
  }

  _processNetworkAttributes =(networkAttributes: any, id: string, crumb:any) => {
    networkAttributes.sort(this._compare("name"));
    let nodeData = [];
    if(networkAttributes.length > 0) {
      networkAttributes.map((na: any) => {
        let cleanId = id + "_" + na.name.replace(/ /g, "_");
        nodeData.push({
          id: cleanId,
          type: "Network Attribute",
          text: na.name,
          icon: "",
          requestAdditional: false,
          data: na,
          clickable: true,
          search: false,
          crumb:crumb
        });
      });
    }
    return nodeData;
  }

  _processTerminalConfigurations =(terminalConfigurations: any, id: string, crumb:any) => {
    terminalConfigurations.sort(this._compare("terminalConfigurationName"));
    let nodeData = [];
    if(terminalConfigurations.length > 0) {
      terminalConfigurations.map((tc: any) => {
        let cleanId = id + "_" + tc.terminalConfigurationName.replace(/ /g, "_");
        nodeData.push({
          id: cleanId,
          type: "Terminal Configuration",
          text: tc.terminalConfigurationName,
          icon: "",
          requestAdditional: false,
          data: tc,
          clickable: true,
          search: false,
          crumb:crumb
        });
      });
    }
    return nodeData;
  }

  //card creator, close card, min/max cards
  _createCardHolder =(dataNode: any, type: any, slot:number) => {
    let checkArray = this.state.activeCards[slot].filter((ac:any) => {
      return(ac.key === (dataNode.id).toString());
    });
    if(checkArray.length <= 0) {
      let activeListCopy = [...this.state.activeCards];
      let newActiveList = activeListCopy[slot];
      switch(type) {
        case "Subtypes": {
          newActiveList.push(<SubtypesCard data={dataNode} requestURL={this.state.requestURL}
            key={dataNode.id}
            panel={slot}
            callbackClose={this._callbackCloseChild}
            callbackSave={this._callbackSaveChild}
            callbackLinkage={this.searchLaunchCard}
            callbackMove={this._callMovePanels}
            callbackGetPanels={this._callbackGetPanels}
            callbackReorderCards={this.callbackReorderCards}
            callbackActiveCards={this._callbackGetActiveCards}
            callbackGetFavorites={this._callbackGetFavorites}
          />);
          break;
        }
        case "Subtype": {
          newActiveList.push(<SubtypeCard data={dataNode} domains={this.state.domainElements} requestURL={this.state.requestURL} cacheData={this.state.cacheData}
              config={this.props.config}
              key={dataNode.id}
              panel={slot}
              callbackClose={this._callbackCloseChild}
              callbackSave={this._callbackSaveChild}
              callbackLinkage={this.searchLaunchCard}
              callbackMove={this._callMovePanels}
              callbackGetPanels={this._callbackGetPanels}
              callbackReorderCards={this.callbackReorderCards}
              callbackActiveCards={this._callbackGetActiveCards}
              callbackGetFavorites={this._callbackGetFavorites}
              />);
          break;
        }
        case "Assettype": {
          newActiveList.push(<AssetTypeCard data={dataNode} controllerDS={this.state.controllerDS} dataElements={this.state.dataElements} requestURL={this.state.requestURL}
              key={dataNode.id}
              panel={slot}
              config={this.props.config}
              callbackClose={this._callbackCloseChild}
              callbackSave={this._callbackSaveChild}
              callbackLinkage={this.searchLaunchCard}
              callbackMove={this._callMovePanels}
              callbackGetPanels={this._callbackGetPanels}
              callbackReorderCards={this.callbackReorderCards}
              callbackActiveCards={this._callbackGetActiveCards}
              callbackGetFavorites={this._callbackGetFavorites}
              />);
          break;
        }
        case "Relationships": {
          newActiveList.push(<RelationshipsCard data={dataNode} requestURL={this.state.requestURL}
            key={dataNode.id}
            panel={slot}
            callbackClose={this._callbackCloseChild}
            callbackSave={this._callbackSaveChild}
            callbackLinkage={this.searchLaunchCard}
            callbackMove={this._callMovePanels}
            callbackGetPanels={this._callbackGetPanels}
            callbackReorderCards={this.callbackReorderCards}
            callbackActiveCards={this._callbackGetActiveCards}
            callbackGetFavorites={this._callbackGetFavorites}
          />);
          break;
        }
        case "Relationship": {
          newActiveList.push(<RelationshipCard data={dataNode} width={this.state.cardWidth}
            key={dataNode.id}
            panel={slot}
            callbackClose={this._callbackCloseChild}
            callbackSave={this._callbackSaveChild}
            callbackLinkage={this.searchLaunchCard}
            callbackMove={this._callMovePanels}
            callbackGetPanels={this._callbackGetPanels}
            callbackReorderCards={this.callbackReorderCards}
            callbackActiveCards={this._callbackGetActiveCards}
            callbackGetFavorites={this._callbackGetFavorites}
          />);
          break;
        }
        case "Attribute Rules": {
          newActiveList.push(<AttributeRulesCard data={dataNode} requestURL={this.state.requestURL}
            key={dataNode.id}
            panel={slot}
            callbackClose={this._callbackCloseChild}
            callbackSave={this._callbackSaveChild}
            callbackLinkage={this.searchLaunchCard}
            callbackMove={this._callMovePanels}
            callbackGetPanels={this._callbackGetPanels}
            callbackReorderCards={this.callbackReorderCards}
            callbackActiveCards={this._callbackGetActiveCards}
            callbackGetFavorites={this._callbackGetFavorites}
          />);
          break;
        }
        case "Attribute Rule": {
          newActiveList.push(<AttributeRuleCard data={dataNode} requestURL={this.state.requestURL}
            key={dataNode.id}
            panel={slot}
            callbackClose={this._callbackCloseChild}
            callbackSave={this._callbackSaveChild}
            callbackLinkage={this.searchLaunchCard}
            callbackMove={this._callMovePanels}
            callbackGetPanels={this._callbackGetPanels}
            callbackReorderCards={this.callbackReorderCards}
            callbackActiveCards={this._callbackGetActiveCards}
            callbackGetFavorites={this._callbackGetFavorites}
          />);
          break;
        }
        case "Fields": {
          newActiveList.push(<FieldsCard data={dataNode} requestURL={this.state.requestURL}
            key={dataNode.id}
            panel={slot}
            callbackClose={this._callbackCloseChild}
            callbackSave={this._callbackSaveChild}
            callbackLinkage={this.searchLaunchCard}
            callbackMove={this._callMovePanels}
            callbackGetPanels={this._callbackGetPanels}
            callbackReorderCards={this.callbackReorderCards}
            callbackActiveCards={this._callbackGetActiveCards}
            callbackGetFavorites={this._callbackGetFavorites}
          />);
          break;
        }
        case "Field": {
          newActiveList.push(<FieldCard data={dataNode} domains={this.state.domainElements} requestURL={this.state.requestURL}
            key={dataNode.id}
            panel={slot}
            callbackClose={this._callbackCloseChild}
            callbackSave={this._callbackSaveChild}
            callbackLinkage={this.searchLaunchCard}
            callbackMove={this._callMovePanels}
            callbackGetPanels={this._callbackGetPanels}
            callbackReorderCards={this.callbackReorderCards}
            callbackActiveCards={this._callbackGetActiveCards}
            callbackGetFavorites={this._callbackGetFavorites}
          />);
          break;
        }
        case "Indexes": {
          newActiveList.push(<IndexesCard data={dataNode} requestURL={this.state.requestURL}
            key={dataNode.id}
            panel={slot}
            callbackClose={this._callbackCloseChild}
            callbackSave={this._callbackSaveChild}
            callbackLinkage={this.searchLaunchCard}
            callbackMove={this._callMovePanels}
            callbackGetPanels={this._callbackGetPanels}
            callbackReorderCards={this.callbackReorderCards}
            callbackActiveCards={this._callbackGetActiveCards}
            callbackGetFavorites={this._callbackGetFavorites}
          />);
          break;
        }
        case "Index": {
          newActiveList.push(<IndexCard data={dataNode} requestURL={this.state.requestURL}
            key={dataNode.id}
            panel={slot}
            callbackClose={this._callbackCloseChild}
            callbackSave={this._callbackSaveChild}
            callbackLinkage={this.searchLaunchCard}
            callbackMove={this._callMovePanels}
            callbackGetPanels={this._callbackGetPanels}
            callbackReorderCards={this.callbackReorderCards}
            callbackActiveCards={this._callbackGetActiveCards}
            callbackGetFavorites={this._callbackGetFavorites}
          />);
          break;
        }
        case "Domains": {
          newActiveList.push(<DomainsCard data={dataNode} requestURL={this.state.requestURL}
            key={dataNode.id}
            panel={slot}
            callbackClose={this._callbackCloseChild}
            callbackSave={this._callbackSaveChild}
            callbackLinkage={this.searchLaunchCard}
            callbackMove={this._callMovePanels}
            callbackGetPanels={this._callbackGetPanels}
            callbackReorderCards={this.callbackReorderCards}
            callbackActiveCards={this._callbackGetActiveCards}
            callbackGetFavorites={this._callbackGetFavorites}
          />);
          break;
        }
        case "Domain": {
          newActiveList.push(<DomainCard data={dataNode} dataElements={this.state.dataElements} requestURL={this.state.requestURL}
            key={dataNode.id}
            panel={slot}
            callbackClose={this._callbackCloseChild}
            callbackSave={this._callbackSaveChild}
            callbackLinkage={this.searchLaunchCard}
            callbackMove={this._callMovePanels}
            callbackGetPanels={this._callbackGetPanels}
            callbackReorderCards={this.callbackReorderCards}
            callbackActiveCards={this._callbackGetActiveCards}
            callbackGetFavorites={this._callbackGetFavorites}
          />);
          break;
        }
        case "Tables": {
          newActiveList.push(<TablesCard data={dataNode} relationships={this.state.relationshipElements} requestURL={this.state.requestURL}
            key={dataNode.id}
            panel={slot}
            callbackClose={this._callbackCloseChild}
            callbackSave={this._callbackSaveChild}
            callbackLinkage={this.searchLaunchCard}
            callbackMove={this._callMovePanels}
            callbackGetPanels={this._callbackGetPanels}
            callbackReorderCards={this.callbackReorderCards}
            callbackActiveCards={this._callbackGetActiveCards}
            callbackGetFavorites={this._callbackGetFavorites}
          />);
          break;
        }
        case "Table": {
          newActiveList.push(<TableCard data={dataNode} domains={this.state.domainElements} requestURL={this.state.requestURL}
            key={dataNode.id}
            panel={slot}
            callbackClose={this._callbackCloseChild}
            callbackSave={this._callbackSaveChild}
            callbackLinkage={this.searchLaunchCard}
            callbackMove={this._callMovePanels}
            callbackGetPanels={this._callbackGetPanels}
            callbackReorderCards={this.callbackReorderCards}
            callbackActiveCards={this._callbackGetActiveCards}
            callbackGetFavorites={this._callbackGetFavorites}
          />);
          break;
        }
        case "Layer": {
          newActiveList.push(<LayerCard key={dataNode.id} data={dataNode} domains={this.state.domainElements} requestURL={this.state.requestURL}
            panel={slot}
            callbackClose={this._callbackCloseChild}
            callbackSave={this._callbackSaveChild}
            callbackLinkage={this.searchLaunchCard}
            callbackMove={this._callMovePanels}
            callbackGetPanels={this._callbackGetPanels}
            callbackReorderCards={this.callbackReorderCards}
            callbackActiveCards={this._callbackGetActiveCards}
            callbackGetFavorites={this._callbackGetFavorites}
            />);
          break;
        }
        case "Layers": {
          newActiveList.push(<LayersCard key={dataNode.id} data={dataNode} requestURL={this.state.requestURL}
            panel={slot}
            callbackClose={this._callbackCloseChild}
            callbackSave={this._callbackSaveChild}
            callbackLinkage={this.searchLaunchCard}
            callbackMove={this._callMovePanels}
            callbackGetPanels={this._callbackGetPanels}
            callbackReorderCards={this.callbackReorderCards}
            callbackActiveCards={this._callbackGetActiveCards}
            callbackGetFavorites={this._callbackGetFavorites}
          />);
          break;
        }
        case "Utility Network": {
          newActiveList.push(<UtilityNetworkCard key={dataNode.id} data={dataNode} requestURL={this.state.requestURL}
            panel={slot}
            callbackClose={this._callbackCloseChild}
            callbackSave={this._callbackSaveChild}
            callbackLinkage={this.searchLaunchCard}
            callbackMove={this._callMovePanels}
            callbackGetPanels={this._callbackGetPanels}
            callbackReorderCards={this.callbackReorderCards}
            callbackActiveCards={this._callbackGetActiveCards}
            callbackGetFavorites={this._callbackGetFavorites}
          />);
          break;
        }
        case "Controller Dataset": {
          newActiveList.push(<UtilityNetworkCard key={dataNode.id} data={dataNode} requestURL={this.state.requestURL}
            panel={slot}
            callbackClose={this._callbackCloseChild}
            callbackSave={this._callbackSaveChild}
            callbackLinkage={this.searchLaunchCard}
            callbackMove={this._callMovePanels}
            callbackGetPanels={this._callbackGetPanels}
            callbackReorderCards={this.callbackReorderCards}
            callbackActiveCards={this._callbackGetActiveCards}
            callbackGetFavorites={this._callbackGetFavorites}
          />);
          break;
        }
        case "Domain Networks": {
          newActiveList.push(<DomainNetworksCard key={dataNode.id} data={dataNode} requestURL={this.state.requestURL}
            panel={slot}
            callbackClose={this._callbackCloseChild}
            callbackSave={this._callbackSaveChild}
            callbackLinkage={this.searchLaunchCard}
            callbackMove={this._callMovePanels}
            callbackGetPanels={this._callbackGetPanels}
            callbackReorderCards={this.callbackReorderCards}
            callbackActiveCards={this._callbackGetActiveCards}
            callbackGetFavorites={this._callbackGetFavorites}
          />);
          break;
        }
        case "Domain Network": {
          newActiveList.push(<DomainNetworkCard key={dataNode.id} data={dataNode} dataElements={this.state.dataElements} domains={this.state.domainElements} requestURL={this.state.requestURL}
            panel={slot}
            callbackClose={this._callbackCloseChild}
            callbackSave={this._callbackSaveChild}
            callbackLinkage={this.searchLaunchCard}
            callbackMove={this._callMovePanels}
            callbackGetPanels={this._callbackGetPanels}
            callbackReorderCards={this.callbackReorderCards}
            callbackActiveCards={this._callbackGetActiveCards}
            callbackGetFavorites={this._callbackGetFavorites}
          />);
          break;
        }
        case "Network Attributes": {
          newActiveList.push(<NetworkAttributesCard key={dataNode.id} data={dataNode} requestURL={this.state.requestURL}
            panel={slot}
            callbackClose={this._callbackCloseChild}
            callbackSave={this._callbackSaveChild}
            callbackLinkage={this.searchLaunchCard}
            callbackMove={this._callMovePanels}
            callbackGetPanels={this._callbackGetPanels}
            callbackReorderCards={this.callbackReorderCards}
            callbackActiveCards={this._callbackGetActiveCards}
            callbackGetFavorites={this._callbackGetFavorites}
          />);
          break;
        }
        case "Network Attribute": {
          newActiveList.push(<NetworkAttributeCard key={dataNode.id} data={dataNode} dataElements={this.state.dataElements} domains={this.state.domainElements} requestURL={this.state.requestURL}
            panel={slot}
            callbackClose={this._callbackCloseChild}
            callbackSave={this._callbackSaveChild}
            callbackLinkage={this.searchLaunchCard}
            callbackMove={this._callMovePanels}
            callbackGetPanels={this._callbackGetPanels}
            callbackReorderCards={this.callbackReorderCards}
            callbackActiveCards={this._callbackGetActiveCards}
            callbackGetFavorites={this._callbackGetFavorites}
          />);
          break;
        }
        case "Terminal Configuration": {
          newActiveList.push(<TerminalConfigurationCard key={dataNode.id} data={dataNode} dataElements={this.state.dataElements} domains={this.state.domainElements} requestURL={this.state.requestURL}
            panel={slot}
            callbackClose={this._callbackCloseChild}
            callbackSave={this._callbackSaveChild}
            callbackLinkage={this.searchLaunchCard}
            callbackMove={this._callMovePanels}
            callbackGetPanels={this._callbackGetPanels}
            callbackReorderCards={this.callbackReorderCards}
            callbackActiveCards={this._callbackGetActiveCards}
            callbackGetFavorites={this._callbackGetFavorites}
          />);
          break;
        }
        case "Terminal Configurations": {
          newActiveList.push(<TerminalConfigurationsCard key={dataNode.id} data={dataNode} requestURL={this.state.requestURL}
            panel={slot}
            callbackClose={this._callbackCloseChild}
            callbackSave={this._callbackSaveChild}
            callbackLinkage={this.searchLaunchCard}
            callbackMove={this._callMovePanels}
            callbackGetPanels={this._callbackGetPanels}
            callbackReorderCards={this.callbackReorderCards}
            callbackActiveCards={this._callbackGetActiveCards}
            callbackGetFavorites={this._callbackGetFavorites}
          />);
          break;
        }
        case "Category": {
          newActiveList.push(<CategoryCard key={dataNode.id} data={dataNode} dataElements={this.state.dataElements} domains={this.state.domainElements} requestURL={this.state.requestURL}
            panel={slot}
            callbackClose={this._callbackCloseChild}
            callbackSave={this._callbackSaveChild}
            callbackLinkage={this.searchLaunchCard}
            callbackMove={this._callMovePanels}
            callbackGetPanels={this._callbackGetPanels}
            callbackReorderCards={this.callbackReorderCards}
            callbackActiveCards={this._callbackGetActiveCards}
            callbackGetFavorites={this._callbackGetFavorites}
          />);
          break;
        }
        case "Categories": {
          newActiveList.push(<CategoriesCard key={dataNode.id} data={dataNode} requestURL={this.state.requestURL}
            panel={slot}
            callbackClose={this._callbackCloseChild}
            callbackSave={this._callbackSaveChild}
            callbackLinkage={this.searchLaunchCard}
            callbackMove={this._callMovePanels}
            callbackGetPanels={this._callbackGetPanels}
            callbackReorderCards={this.callbackReorderCards}
            callbackActiveCards={this._callbackGetActiveCards}
            callbackGetFavorites={this._callbackGetFavorites}
          />);
          break;
        }
        default:
          break;
      }
      this.setState({activeCards: activeListCopy, masterActiveCards: activeListCopy},() => {
        this.treeRef.current.hookForParent();
        this.animateScroll(500, slot);
      });
    }

  }

  _createMinimizedCardHolder =(dataNode: any) => {
    let favoriteCard = [...this.state.favoriteCards];
    let filterFC = favoriteCard.filter((fc) => {
      return(fc.key === (dataNode.id).toString());
    });
    if(filterFC.length <= 0) {
      favoriteCard.push(<MinimizedCard key={dataNode.id} data={dataNode} width={250} height={35} callbackRestore={this._callbackRestoreChild} callbackDelete={this._callbackDeleteFavorite} />);
      this.setState({favoriteCards: favoriteCard, masterFavoriteCards: favoriteCard}, ()=> {
        //save into cookie
        let cookieList = [];
        if(this.state.masterFavoriteCards.length > 0) {
          this.state.masterFavoriteCards.map((mf:any) => {
            let id = {id:mf.key, type:mf.props.data.type};
            cookieList.push(JSON.stringify(id));
          });
          document.cookie = "favorites=" + cookieList.join("@") + ";path=/;";
        }
      });
    }
  }

  _callbackFromTree =(dataNode: any, type: any) => {
    if(dataNode.requestAdditional) {
      let id = -1;
      if(dataNode.hasOwnProperty("parentId")) {
        id = dataNode.parentId;
      } else {
        id = dataNode.id;
      }
      //this._requestObject("metadata", id).then(() => {
        //dataNode.metaData = this.state.metadataElements;
        this._createCardHolder(dataNode, type, 0);
      //});
    } else {
      this._createCardHolder(dataNode, type, 0);
    }
  }

  _callbackCloseChild =(dataNode: any, panel:number) => {
    let activeCard = [...this.state.masterActiveCards];
    let filterAC = activeCard[panel].filter((fc:any) => {
      return(fc.key !== (dataNode.id).toString());
    });
    activeCard[panel] = filterAC;
    this.setState({activeCards: activeCard, masterActiveCards:activeCard}, ()=> {
      //if closing from search, perform search again
      if(this.state.masterActiveCards.length > 1) {
        if(this.state.activeSearching){
          this.searchService(ReactDOM.findDOMNode(this.refs.favoritesSearchValue).value, "active");
        }
      } else {
        if(this.state.masterActiveCards.length <= 1) {
          //there will always be slot [0], so check if slot zero is empty
          if(this.state.masterActiveCards[0].length <= 0) {
            //check if any in favorites
            if(this.state.masterFavoriteCards.length <= 0) {
              this.setState({popoverOpen:false, popoverSearch: false});
            }
          }
        }
      }
      this.treeRef.current.hookForParent();
    });
  }

  _callbackSaveChild=(node: any) => {
    return new Promise((resolve, reject) => {
      //*** if you want to close card on favorite, uncomment below */
      //this._callbackCloseChild(node);
      this._createMinimizedCardHolder(node);
      this.showFavoriteAlert();
      resolve(true);
    });
  }

  _callbackRestoreChild=(node: any) => {
    //**** If you want to remove once it's restored, uncomment the lines below */
    //let favoriteCard = [...this.state.favoriteCards];
    //let filterFC = favoriteCard.filter((fc) => {
    //  return(fc.key !== (node.id).toString());
    //});
    //this.setState({favoriteCards: filterFC});
    this._createCardHolder(node, node.type, 0);
  }

  _callbackDeleteFavorite=(node: any) => {
    let favoriteCard = [...this.state.masterFavoriteCards];
    let filterFC = favoriteCard.filter((fc) => {
      return(fc.key !== (node.id).toString());
    });
    this.setState({favoriteCards: filterFC, masterFavoriteCards: filterFC},() => {
        //save into cookie
        let cookieList = [];
        if(this.state.masterFavoriteCards.length > 0) {
          this.state.masterFavoriteCards.map((mf:any) => {
            let id = {id:mf.key, type:mf.props.data.type};
            cookieList.push(JSON.stringify(id));
          });
          document.cookie = "favorites=" + cookieList.join("@") + ";path=/;";
        } else {
          document.cookie = "favorites=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }
    });

    if(this.state.masterFavoriteCards.length <= 1) {
      //check if any in favorites
      if(this.state.masterActiveCards.length <= 0) {
        this.setState({popoverOpen:false, popoverSearch: false});
      }
    } else {
      if(this.state.activeSearching){
        this.searchService(ReactDOM.findDOMNode(this.refs.favoritesSearchValue).value, "favorites");
      }
    }
  }

  _callbackGetActiveCards=() => {
    return this.state.masterActiveCards;
  }

  _callbackGetPanels=() => {
    return this.state.stagePanels;
  }

  _callbackGetFavorites=() => {
    return this.state.masterFavoriteCards;
  }

  _callMovePanels=(dataNode: any, type:string, panel:number, direction:string) => {
    let diff = 0;
    let newPos = panel;
    if(direction === "right") {
      diff = this.state.stagePanels - panel;
      if(diff > 0) {
        //still space to move
        newPos = panel + 1;
        this._createCardHolder(dataNode, type, newPos);
        this._callbackCloseChild(dataNode, panel);
      } else {
        alert("can't go forward anymore");
      }
    } else {
      if(panel >= 1) {
        newPos = panel - 1;
        this._createCardHolder(dataNode, type, newPos);
        this._callbackCloseChild(dataNode, panel);
      } else {
        alert("can't go back anymore");
      }
    }
    this._createCardHolder(dataNode, type, newPos);
  }

  callbackReorderCards =(dataNode:any, panel:number, direction:string) => {
    return new Promise((resolve, reject) => {
      let array_move =(arr:any, old_index:number, new_index:number) => {
        if (new_index >= arr.length) {
            var k = new_index - arr.length + 1;
            while (k--) {
                arr.push(undefined);
            }
        }
        arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
        return arr;
      };
      let masterActiveCards = [...this.state.masterActiveCards];
      let currPos = -1;
      masterActiveCards[panel].map((mac:any, i:number) => {
        if(mac.props.data.id === dataNode.id) {
          currPos = i;
        }
      });
      if(currPos > -1) {
        let newPos = currPos;
        if(direction === "down") {
          if(newPos >= (masterActiveCards[panel].length)-1) {
            alert("can't go down anymore");
          } else {
            newPos = newPos + 1;
            masterActiveCards[panel] = array_move(masterActiveCards[panel], currPos, newPos);
            this.setState({masterActiveCards:masterActiveCards, activeCards:masterActiveCards},()=>{resolve(true);});
          }
        } else {
          if(newPos <= 0) {
            alert("can't go up anymore");
          } else {
            newPos = newPos - 1;
            masterActiveCards[panel] = array_move(masterActiveCards[panel], currPos, newPos);
            this.setState({masterActiveCards:masterActiveCards, activeCards:masterActiveCards},()=>{resolve(true);});
          }
        }
      } else {
        resolve(false);
      }
    });
  }

  //SAVING AND DELETING FUNCTIONS
  deleteAllFavoritesAsk =() => {
    this.setState({deleteModal: true, deleteAllType: "favorites"});
  }

  deleteAllActiveAsk =() => {
    this.setState({deleteModal: true, deleteAllType: "active"});
  }

  deleteAllYes =() => {
    if(this.state.deleteAllType === "active") {
      let newActive = [...this.state.activeCards];
      for(let i=0; i<= this.state.stagePanels; i++) {
        newActive[i] =  [];
      }
      if(this.state.masterFavoriteCards.length <= 0) {
        this.setState({activeCards: newActive, masterActiveCards: newActive, deleteModal:false, popoverOpen:false, popoverSearch: false},() => {
          this.treeRef.current.hookForParent();
        });
      } else {
        this.setState({activeCards: newActive, masterActiveCards: newActive, deleteModal:false},()=> {
          this.treeRef.current.hookForParent();
        });
      }
    } else {
      if(this.state.masterActiveCards.length <= 0) {
        this.setState({favoriteCards: [], masterFavoriteCards: [], deleteModal:false, popoverOpen:false, popoverSearch: false});
      } else {
        this.setState({favoriteCards: [], masterFavoriteCards: [], deleteModal:false});
      }
      document.cookie = "favorites=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
  }

  deleteAllNo =() => {
    //no, just hide modal again
    this.setState({deleteModal: false});
  }

  showFavoriteAlert =() => {
    this.setState({favoriteAlert: true}, () => {
      setTimeout(()=> {this.setState({favoriteAlert: false})}, 3000);
    });
  }
  //END SAVE AND DELETE FUNCTIONS


  //Search function
  searchService =(value: string, type: string) => {
    let matchList = [];
    for(let i=0; i<= this.state.stagePanels; i++) {
      matchList[i] =  [];
    }
    let activeSearching = false;
    if(value !== "") {
      let serviceNodes: any;
      if(type === "active") {
        serviceNodes = [...this.state.masterActiveCards];
      } else {
        serviceNodes = [...this.state.masterFavoriteCards];
      }
      let hasSubNodes =(node: any, num:number) => {
        if((node.props.data.text).toLowerCase().indexOf(value.toLowerCase()) > -1) {
          matchList[num].push(node);
        }
        if(node.hasOwnProperty("nodes")) {
          node.nodes.map((n: any) => {
            hasSubNodes(n, num);
          });
        }
      }
      serviceNodes.map((sn: any, i:number) => {
        sn.map((s:any) => {
          hasSubNodes(s, i);
        })
      });
      activeSearching = true;
    } else {
      if(type === "active") {
        matchList = [...this.state.masterActiveCards];
      } else {
        matchList = [...this.state.masterFavoriteCards];
      }
      activeSearching = false;
    }
    if(type === "active") {
      this.setState({activeCards: matchList, activeSearching:activeSearching});
    } else {
      this.setState({favoriteCards: matchList, activeSearching:activeSearching});
    }
  }

  searchLaunchCard = (value: string, type: string, panel:number, parent?:string, parentSub?:string) => {
    let matchNode = null;
    let parentNodes = [];
    if(value !== "") {
      let serviceNodes = [...this.state.serviceNodes];
      let hasSubNodes =(node: any) => {
        if(node.type === type) {
          if(node.hasOwnProperty("parent")) {
            if(typeof(parent) !== "undefined") {
              if(node.parent === parent) {
                //see if there is another level of parent to search for example if "unknown" asset type is passed
                if(typeof(parentSub) !== "undefined") {
                  node.crumb.map((c: any) => {
                    if(c.value === parentSub) {
                      matchNode = node;
                    }
                  });
                } else {
                  if(node.text === value) {
                    matchNode = node;
                  }
                }
              }
            } else {
              if(node.text === value) {
                matchNode = node;
              }
            }
          } else {
            if(node.text === value) {
              matchNode = node;
            }
          }
        }
        if(node.hasOwnProperty("nodes")) {
          node.nodes.map((n: any) => {
            hasSubNodes(n);
          });
        }
      }
    serviceNodes.map((sn: any) => {
      hasSubNodes(sn);
    });

    if(matchNode !== null) {
      this._createCardHolder(matchNode, type, panel);
    } else {
      alert("Sorry, no card found");
    }
  }

  }


  //Helper Functions
  togglePanel2 =() => {
    let newState = false;
    let newSize = document.body.clientWidth;
    let newPanelCount = 0;
    if(this.state.showPanel2) {
      newState = false;
      newPanelCount = 0;
      if(this.state.showTree) {
        newSize = (document.body.clientWidth - 425);
      } else {
        newSize = (document.body.clientWidth - 75);
      }
    } else {
      newState = true;
      newPanelCount = 1;
      if(this.state.showTree) {
        newSize = (document.body.clientWidth - 425) / 2;
      } else {
        newSize = (document.body.clientWidth - 75) / 2;
      }
    }
    this.setState({showPanel2: newState, stagePanels:newPanelCount, cardWidth:newSize});

  }

  toggleTree() {
    if(this.state.showTree) {
      let newSize = (document.body.clientWidth - 90);
      if(this.state.showPanel2) {
        newSize = ((document.body.clientWidth - 90) / 2);
      }
      this.setState({showTree: false, contentStartLocation:60, cardWidth:newSize});
    } else {
      let newSize = (document.body.clientWidth - 430);
      if(this.state.showPanel2) {
        newSize = ((document.body.clientWidth - 430) / 2);
      }
      this.setState({showTree: true, contentStartLocation:400, cardWidth: newSize});
    }
  }


  addStagePanel =() => {
    let currNumber = this.state.stagePanels;
    currNumber = currNumber + 1;
    this.setState({stagePanels:currNumber},() => {
      let newPosition = [...this.state.masterActiveCards];
      newPosition[this.state.stagePanels] = [];
      this.setState({activeCards:newPosition, masterActiveCards:newPosition},()=> {
        let newPanelList = [...this.state.panelList];
        newPanelList[this.state.stagePanels] = [];
        newPanelList[this.state.stagePanels].push(
          <div key={"stage"+this.state.stagePanels} id={"stage"+this.state.stagePanels} className="customScrollStyle" style={{height:this.state.winHeight, width:760, overflowX:"auto", overflowY:"auto", backgroundColor:"#efefef", border:2, borderColor:"#aaa", borderStyle:"dashed", display:"inline-block"}}>
          {this.state.activeCards[this.state.stagePanels]}
          </div>
        );
        this.setState({panelList:newPanelList});
      });
    });


  }

  parseURL= () => {
    if(this.props.config.hasOwnProperty("allowUrlLookup")) {
      if(this.props.config.allowUrlLookup) {
        if(this.props.queryObject.hasOwnProperty("lookup")) {
          this.setState({requestURL: this.props.queryObject.lookup});
        }
      }
    }
  }

  _parseStartUpURL =() => {
    if(this.props.queryObject.hasOwnProperty("startup")) {
      if(this.props.queryObject.startup !== "") {
        let param = (this.props.queryObject.startup).split(",");
        if(param.length > 0) {
          param.map((p:string) => {
            if(p.indexOf(":") > -1) {
              let keys = p.split(":");
              this.searchLaunchCard(keys[0], keys[1], 0, "");
            }
          });
        }
      }
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

  _queryDataElement =(id: number) => {
    let layerDE = this.state.dataElements.filter((de: any)=>{
      return(de.layerId === id);
    });
    if(layerDE.length > 0) {
      return layerDE[0];
    } else {
      return {};
    }
  }

  animateScroll =(duration:number, panel:number) => {
    var start = document.getElementById("stage"+panel).scrollTop;
    var end = document.getElementById("stage"+panel).scrollHeight;
    var change = end - start;
    var increment = 20;
    let easeInOut =(currentTime, start, change, duration) => {
      // by Robert Penner
      currentTime /= duration / 2;
      if (currentTime < 1) {
        return change / 2 * currentTime * currentTime + start;
      }
      currentTime -= 1;
      return -change / 2 * (currentTime * (currentTime - 2) - 1) + start;
    }
    let animate =(elapsedTime) => {
      elapsedTime += increment;
      var position = easeInOut(elapsedTime, start, change, duration);
      document.getElementById("stage"+panel).scrollTop = position;
      if (elapsedTime < duration) {
        setTimeout(function() {
          animate(elapsedTime);
        }, increment)
      }
    }
    animate(0);
  }

  _checkCookie =() => {
    var favorites = this._getCookie("favorites");
    if (favorites != "") {
     let favArray = favorites.split("@");
     favArray.map((f:any) => {
      let obj = JSON.parse(f);
      let foundMatch = this.matchCookieToFav(obj.id, obj.type);
      if(foundMatch !== null) {
        this._createMinimizedCardHolder(foundMatch);
      }
     });
    }
  }

  _getCookie =(cname) => {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  matchCookieToFav =(id: string, type:string) => {
    let matchList = null;
    let serviceNodes = [...this.state.serviceNodes];
    let hasSubNodes =(node: any) => {
      if((node.id).toString() === (id).toString() && node.type === type) {
        matchList = node;
      }
      if(node.hasOwnProperty("nodes")) {
        node.nodes.map((n: any) => {
          hasSubNodes(n);
        });
      }
    }
    serviceNodes.map((sn: any) => {
      hasSubNodes(sn);
    });
    return matchList;
  }

  pullDataFromCache = async() => {
    return new Promise((resolve, reject) => {
      loadArcGISJSAPIModules(['esri/portal/Portal','esri/portal/PortalItem', 'esri/portal/PortalUser']).then(async ([Portal, PortalItem, PortalUser]) => {
        let portalA = new Portal({
          url: this.props.portalUrl // First instance
        });
        let item = new PortalItem({
          id: this.state.cacheId,
          portal: portalA // This loads the first portal instance set above
        });
        await item.load().then(async (data:any) => {
          await data.fetchData().then((d:any) => {
            resolve(d);
          });
        });
        /*
        portalA.load().then(() => {
          let queryParams = {
            query: "id:"+this.state.cacheId,
            num: 1
          };
          portalA.queryItems(queryParams).then((response:any) => {
            if(response.results.length > 0) {
              console.log(response.results);
            } else {

            }
          });
        });
        */
      });
    });
  }


}
