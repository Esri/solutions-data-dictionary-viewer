/** @jsx jsx */
import {BaseWidget, React, ReactDOM, classNames, FormattedMessage, defaultMessages as jimuCoreDefaultMessage} from 'jimu-core';
import {AllWidgetProps, css, jsx, styled} from 'jimu-core';
import {IMConfig} from '../config';
import {loadArcGISJSAPIModules} from 'jimu-arcgis';
import {Button, Icon, Input, Modal, ModalBody, ModalFooter, Collapse, Alert, Progress } from 'jimu-ui';
import {Popover, PopoverHeader, PopoverBody} from 'reactstrap';
import defaultMessages from './translations/default';
import {ServiceExplorerTree} from './ServiceExplorerTree';
import SubtypeCard from './SubtypeCard';
import SubtypesCard from './SubTypesCard';
import RelationshipCard from './relationshipCard';
import RelationshipsCard from './RelationshipsCard';
import MinimizedCard from './_MinimizedCard';
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
import FeatureServiceCard from './FeatureServiceCard';
import { any } from 'prop-types';
import './css/custom.css';
import AssetTypesCard from './AssetTypesCard';
let heartIcon = require('jimu-ui/lib/icons/heart.svg');
let searchIcon = require('jimu-ui/lib/icons/search.svg');
let deleteIcon = require('jimu-ui/lib/icons/delete.svg');
let treeIcon = require('jimu-ui/lib/icons/datasource.svg');
let panelIcon = require('jimu-ui/lib/icons/snap-to-right.svg');
let closeIcon = require('jimu-ui/lib/icons/close.svg');
let linkIcon = require('./assets/launch.svg');

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
      favoriteSearchValue: "",
      masterFavoriteCards: [],
      activeCards: [],
      masterActiveCards: [],
      activeSearching: false,
      deleteModal: false,
      deleteAllType: "active",
      favoriteAlert: false,
      winHeight: document.body.clientHeight,
      cardWidth: (document.body.clientWidth - 425),
      tocWidth: 400,
      favoriteMessage: "Added to Favorites"
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
    window.addEventListener('resize', this.handleResize);

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
                  this._processData().then(() => {
                    this.setState({treeReady:true});
                    this._checkCookie();
                    this._parseStartUpURL();
                  });
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
              this._processData().then(() => {
                this.setState({treeReady:true});
                this._checkCookie();
                this._parseStartUpURL();
              });
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
        {(this.state.treeReady)?
          <ServiceExplorerTree width={this.state.tocWidth} callback={this._callbackFromTree} data={this.state.serviceNodes} callbackActiveCards={this._callbackGetActiveCards} ref={this.treeRef} />
          :
          <div style={{paddingLeft:58, width:this.state.tocWidth, height:document.body.clientHeight-10, overflow: "auto", position: "fixed"}}>
            <Progress color="primary" value={100} />
            Loading...
          </div>
        }
        </Collapse>
      </div>
      <div id="serviceExplorerStage" style={{top:0, height:this.state.winHeight -5, left:this.state.contentStartLocation, position: "absolute", overflowX:"auto", overflowY:"auto", whiteSpace: "nowrap"}}>
        <div key={"stage0"} id={"stage0"} style={{height:"99%", width:this.state.cardWidth+10, overflowX:"auto", overflowY:"auto", backgroundColor:"#efefef", border:2, borderColor:"#aaa", borderStyle:"dashed", display:"inline-block"}}>
        {
          (this.state.activeCards[0].length > 0)?
            this.state.activeCards[0]
          :
            <div style={{width:"100%", textAlign:"center", paddingTop:"25%"}}>
              Click on topics in the table of contents to load more information.
            </div>
        }
        </div>
        {this.state.showPanel2 &&
          <div key={"stage1"} id={"stage1"} style={{height:"99%", width:this.state.cardWidth+10, overflowX:"auto", overflowY:"auto", backgroundColor:"#efefef", border:2, borderColor:"#aaa", borderStyle:"dashed", display:"inline-block"}}>
          {this.state.activeCards[1]}
          </div>
        }
      </div>
      <div id="serviceExplorerSidebar" style={{top:0, left: 0, position: "relative", width:"60px", textAlign: "left", display:this.state.showActiveOptions}}>
        <Button id="PopoverTree" type="secondary" onClick={this.toggleTree} aria-label="Expand and collapse table of content">
          <div title="Expand and collapse table of content"><Icon icon={treeIcon} size='17' color='#00f' /></div>
        </Button>
        <br></br>
        <Button id="addPanel" type="secondary" onClick={()=> {this.togglePanel2(this.state.showPanel2)}}>
      <div title="Split the canvas">{(this.state.showPanel2)?<Icon icon={panelIcon} size='16' color='#333' rotate='180' />:<Icon icon={panelIcon} size='16' color='#333' />}</div>
        </Button>
        <br></br>
        <Button id="popoverDelete" type="secondary" onClick={this.deleteAllActiveAsk}>
          <div title="Clear all cards"><Icon icon={closeIcon} size='16' color='#f00' /></div>
        </Button>
        <br></br>
        <Button id="PopoverClick" type="secondary" onClick={this.toggleHistory}>
          <div title="View and manage saved cards"><Icon icon={heartIcon} size='16' color='#FFA500' /></div>
        </Button>
        <Popover innerClassName="popOverBG" placement="right" isOpen={this.state.popoverOpen} target="PopoverClick">
          <PopoverHeader><div className="leftRightPadder5" style={{float:"left"}}>Favorites</div><div className="leftRightPadder5" style={{float:"right", cursor:"pointer"}} onClick={this.deleteAllFavoritesAsk}><Icon icon={deleteIcon} size='18' color='#333' /></div></PopoverHeader>
          <PopoverBody>
            <div className="leftRightPadder5">
              <Input placeholder="Search favorites" ref="favoritesSearchValue"
                onKeyPress={(e:any) => {
                  if(e.key === "Enter") {
                    this.searchService(e.target.value, "favorites");
                  }
                }}
                onChange={(e:any)=>{
                  e.persist();
                  this.setState({favoriteSearchValue: e.target.value},()=>{
                    if(e.target.value == "") {
                      this.searchService(e.target.value, "favorites");
                    }
                  });
                }}
                style={{width:"90%"}}>
              </Input>
              <div style={{float:"right", cursor:"pointer"}} onClick={()=> {this.searchService(this.state.favoriteSearchValue, "favorites")}}><Icon icon={searchIcon} size='18' color='#333' /></div>
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
          <Button type="secondary" onClick={this.deleteAllNo}>No</Button>
        </ModalFooter>
      </Modal>
      <div style={{width:225, position: "relative", top: 0, left:0}}>
        <Alert color="warning" isOpen={this.state.favoriteAlert} toggle={()=> {this.setState({favoriteAlert:false})}}>
          <div style={{width:"100%", height:"100%", fontWeight:"bold", fontSize:"smaller"}}>{this.state.favoriteMessage}</div>
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
        data = request.text();
      } else {
        data = request.json();
      }
    }
    switch(type) {
      case "queryDataElements": {
        if(!data.hasOwnProperty("error")){
          if(data.hasOwnProperty("layerDataElements")) {
            var controllerDS = data.layerDataElements.filter((lde:any) => {
              return lde.dataElement.hasOwnProperty("domainNetworks");
            });
            if(controllerDS.length > 0) {
              this.setState({hasDataElements: true, dataElements: data.layerDataElements, controllerDS: controllerDS[0]});
            } else {
              this.setState({hasDataElements: true, dataElements: data.layerDataElements});
            }
          } else {
            this.setState({hasDataElements: false});
          }
        }
        break;
      }
      case "relationships": {
        if(!data.hasOwnProperty("error")){
          if(!this.isEmpty(data.relationships)) {
            this.setState({relationshipElements: data.relationships});
          }
        }
        break;
      }
      case "queryDomains": {
        if(!data.hasOwnProperty("error")){
          if(!this.isEmpty(data.domains)) {
            this.setState({domainElements: data.domains});
          }
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

  _requestCacheObject = (type: any, layer: number) => {
    let data = null;
    if(layer !== -1) {
      if(type === "metadata") {
        data = this.state.cacheData.metadata[layer];
      } else {
        data = this.state.cacheData.layers[layer];
      }
    } else {
      data = this.state.cacheData[type];
    }
    switch(type) {
      case "queryDataElements": {
        if(!data.hasOwnProperty("error")){
          if(data.hasOwnProperty("layerDataElements")) {
            var controllerDS = data.layerDataElements.filter((lde:any) => {
              return lde.dataElement.hasOwnProperty("domainNetworks");
            });
            if(controllerDS.length > 0) {
              this.setState({hasDataElements: true, dataElements: data.layerDataElements, controllerDS: controllerDS[0]});
            } else {
              this.setState({hasDataElements: true, dataElements: data.layerDataElements});
            }
          } else {
            this.setState({hasDataElements: false});
          }
        }
        break;
      }
      case "relationships": {
        if(!data.hasOwnProperty("error")){
          if(!this.isEmpty(data.relationships)) {
            this.setState({relationshipElements: data.relationships});
          }
        }
        break;
      }
      case "queryDomains": {
        if(!data.hasOwnProperty("error")){
          if(!this.isEmpty(data.domains)) {
            this.setState({domainElements: data.domains});
          }
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
  _processData = async() => {
    return new Promise((resolve:any, reject:any) => {
      let data = {...this.state.serviceElements};
      let domains = (this.state.domainElements.length > 0)?[...this.state.domainElements]:[];
      let relationship = (this.state.relationshipElements.length > 0)?[...this.state.relationshipElements]:[];
      let unData = null;
      let checkNodes = null;
      //domains.sort(this._compare("name"));

      data.layers.map((layer: any, i:number) => {
        checkNodes = this._queryDataElement(layer.id);
        if(checkNodes.hasOwnProperty("dataElement")) {
          if(checkNodes.dataElement.hasOwnProperty("domainNetworks")) {
            unData = this._queryDataElement(layer.id);
          }
        }
      });
      let cleanId = (data.hasOwnProperty("documentInfo"))?data.documentInfo.Title.replace(/ /g,"_") + "_Service":data.serviceDescription.replace(/ /g,"_") + "_Service";
      cleanId = cleanId.replace(/./g, "_");
      let nodeStructure = {
        id: cleanId,
        type: "Feature Service",
        text: (data.hasOwnProperty("documentInfo"))?data.documentInfo.Title + " Service":data.serviceDescription + " Service",
        subNodeCount: 0,
        icon: "",
        requestAdditional: false,
        root: true,
        clickable: true,
        data: this.state.serviceElements,
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
          {type: "Feature Service",value:(data.hasOwnProperty("documentInfo"))?data.documentInfo.Title+" Service":data.serviceDescription+" Service", node: nodeStructure.id}
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
          id: this.replaceColon(layer.id),
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
          {type: "Feature Service", value: (data.hasOwnProperty("documentInfo"))?data.documentInfo.Title+" Service":data.serviceDescription+" Service", node: nodeStructure.id},
          {type: "Layers", value:"Layers", node: layersNode.id}
        ];
        let crumb = [
          {type: "Feature Service", value: (data.hasOwnProperty("documentInfo"))?data.documentInfo.Title+" Service":data.serviceDescription+" Service", node: nodeStructure.id},
          {type: "Layers", value:"Layers", node: layersNode.id},
          {type: type, value:layer.name, node: subNode.id}
        ];
        if(this.state.hasDataElements) {
          subNode.nodes = this._processDataElements(layer.id, crumb, layer.name);
        } else {
          let reqData = this._requestCacheObject(null,layer.id);
          subNode.data = reqData;
          subNode.nodes = this._processDataSimple(reqData, layer.id, crumb, layer.name);
        }
        return(subNode);
      });

      //if(this.state.hasDataElements) {
        nodeStructure.nodes.push(layersNode);
      //}

      //Handling TABLE nodes
      if(data.tables.length > 0) {
        let tablesNode = {
          id: "Tables",
          type: "Tables",
          text: "Tables",
          subNodeCount: this.state.serviceElements.tables.length,
          data: this.state.serviceElements.tables,
          clickable: true,
          crumb:[
            {type: "Feature Service", value: (data.hasOwnProperty("documentInfo"))?data.documentInfo.Title+" Service":data.serviceDescription+" Service", node:nodeStructure.id}
          ],
          search: false,
          nodes: []
        };
        data.tables.map(async(table: any, i:number) => {
          if(table) {
            let newCrumb = [
              {type: "Feature Service", value: (data.hasOwnProperty("documentInfo"))?data.documentInfo.Title+" Service":data.serviceDescription+" Service", node:nodeStructure.id},
              {type: "Tables", value:"Tables", node:tablesNode.id},
            ];
            let simpleData = table;
            let nodeStruct = {
              id: this.replaceColon(table.id),
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
            let crumb = [
              {type: "Feature Service", value: (data.hasOwnProperty("documentInfo"))?data.documentInfo.Title+" Service":data.serviceDescription+" Service", node: nodeStructure.id},
              {type: "Tables", value:"Tables", node:tablesNode.id},
              {type: "Table", value:table.name, node: nodeStruct.id}
            ];
            if(this.state.hasDataElements) {
              nodeStruct.nodes = this._processDataElements(table.id, crumb, table.name);
            } else {
              await this._requestObject(null,table.id).then((data) => {
                nodeStruct.data = data;
                nodeStruct.nodes = this._processDataSimple(data, table.id, crumb, table.name);
              });
            }
            tablesNode.nodes.push(nodeStruct);
          }
        });
        nodeStructure.nodes.push(tablesNode);
      }

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
            {type: "Feature Service", value: (data.hasOwnProperty("documentInfo"))?data.documentInfo.Title+" Service":data.serviceDescription+" Service", node:nodeStructure.id}
          ],
          search: false,
          nodes: []
        };
        relationship.map((relship: any, i:number) => {
          let newCrumb = [
            {type: "Feature Service", value: (data.hasOwnProperty("documentInfo"))?data.documentInfo.Title+" Service":data.serviceDescription+" Service", node:nodeStructure.id},
            {type: "Relationships", value:"Relationships", node:relationNode.id},
          ];
          let reSubNode = {
            id: this.replaceColon(relship.id),
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
            {type: "Feature Service", value: (data.hasOwnProperty("documentInfo"))?data.documentInfo.Title+" Service":data.serviceDescription+" Service", node:nodeStructure.id}
          ],
          search: false,
          nodes: []
        };
        domains.map((domain: any, i:number) => {
          let newCrumb = [
            {type: "Feature Service", value: (data.hasOwnProperty("documentInfo"))?data.documentInfo.Title+" Service":data.serviceDescription+" Service", node:nodeStructure.id},
            {type: "Domains", value:"Domains", node:domainNode.id},
          ];
          domainNode.nodes.push({
            id: this.replaceColon(domain.name),
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
            {type: "Feature Service", value: (data.hasOwnProperty("documentInfo"))?data.documentInfo.Title+" Service":data.serviceDescription+" Service", node:nodeStructure.id}
          ],
          search: false,
          nodes: []
        };
        let newCrumb = [
          {type: "Feature Service", value: (data.hasOwnProperty("documentInfo"))?data.documentInfo.Title+" Service":data.serviceDescription+" Service", node:nodeStructure.id},
          {type: "Controller Dataset", value:"Controller Dataset", node: domainNetworkNode.id},
        ];
        domainNetworkNode.nodes = this._processDataElements(unData.layerId, newCrumb, "Feature Service");
        nodeStructure.nodes.unshift(domainNetworkNode);
      }

      this.setState({serviceNodes: [nodeStructure], layerElements:layersNode}, () => {
        resolve(true);
      });
      //this._serviceList(rest);
    });
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
            id: this.replaceColon(de.layerId + "_subtype"),
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
            id: this.replaceColon(de.layerId + "_attrRules"),
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
          let ars = this._processAttrRules(de.dataElement.attributeRules, de.layerId + "_attrRules", de.dataElement.subtypes, newCrumb, parent);
          if(ars.length > 0) {
            arNode.nodes = this._processAttrRules(de.dataElement.attributeRules, de.layerId + "_attrRules", de.dataElement.subtypes, newCrumb, parent);
            nodeData.push(arNode);
          }
        }
        //Handing FIELD nodes
        if(de.dataElement.hasOwnProperty("fields")) {
          let fieldsNode = {
            id: this.replaceColon(de.layerId + "_allfields"),
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
            id: this.replaceColon(de.layerId + "_indexes"),
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
            id: this.replaceColon(de.layerId + "_categories"),
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
            id: this.replaceColon(de.layerId + "_domainNetworks"),
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
            id: this.replaceColon(de.layerId + "_networkAttributes"),
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
            id: this.replaceColon(de.layerId + "_terminalConfigurations"),
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

  _processDataSimple = (data: any, id: any, crumb:any, parent:string) => {
    let nodeData = [];
    //this._requestObject(null,id).then((data) => {
      if(typeof(data) !== "undefined") {
        if(data.fields.length > 0) {
          let currCrumb = [...crumb];
          currCrumb.push({
            type:"Fields",
            value:"Fields",
            node: this.replaceColon(id + "_fields")
          });
          let fNode = {
            id: this.replaceColon(id + "_fields"),
            type: "Fields",
            text: "Fields (" + data.fields.length + ")",
            icon: "",
            data: data.fields,
            requestAdditional: false,
            nodes: this._processFields(data.fields, this.replaceColon(id + "_fields"), null, id, currCrumb, parent),
            clickable: true,
            crumb:crumb,
            parent: parent
          };
          nodeData.push(fNode);
        }
        if(data.indexes.length > 0) {
          let currCrumb = [...crumb];
          currCrumb.push({
            type:"Indexes",
            value:"Indexes",
            node: this.replaceColon(id + "_indexes")
          });
          let iNode = {
            id: this.replaceColon(id + "_indexes"),
            type: "Indexes",
            text: "Indexes (" + data.indexes.length + ")",
            icon: "",
            data: data.indexes,
            requestAdditional: false,
            nodes: this._processIndexes(data.indexes, this.replaceColon(id + "_indexes"), currCrumb, parent),
            clickable: true,
            crumb:crumb,
            parent: parent
          };
          nodeData.push(iNode);
        }
      }
    return nodeData;
  }

  _processSubTypes =(subTypes: any, id: string, parentId: string, fields:any, fieldGroups:any, attributeRules: any, crumb:any, parent:string) => {
    //subTypes.sort(this._compare("subtypeName"));
    let nodeData = [];
    if(subTypes.length > 0) {
      subTypes.map((st: any) => {
        let stNode = {
          id: this.replaceColon(id + "_" + st.subtypeCode),
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
        let at = this._processAssetTypes(st, id + "_" + st.subtypeCode, fieldGroups, parentId, st.subtypeCode, newCrumb, parent);
        if(at.length> 0) {
          stNode.nodes = at;
        } else {
          delete stNode.nodes;
        }
        nodeData.push(stNode);
      });
    }
    return nodeData;
  }

  _processAssetTypes =(st:any, id:string, fieldGroups:any, parentId: string, subtypeCode:number, crumb:any, parent:string) => {
    let nodeData = [];
    if(st) {
      let arNode = {
        id: this.replaceColon(id + "_assettypes"),
        type: "Asset types",
        text: "Asset types",
        subNodeCount: 0,
        icon: "",
        data: null,
        subtypes: st,
        requestAdditional: false,
        nodes: [],
        clickable: true,
        search: false,
        crumb: crumb,
        parent: parent
      };
      let newCrumb = [...crumb];
      newCrumb.push({
        type:"Asset types",
        value:"Asset types",
        node: arNode.id
      });
      //arNode["crumb"] = newCrumb;
      let at = this._processAssetType(st, id + "_" + st.subtypeCode, fieldGroups, parentId, st.subtypeCode, newCrumb, parent);
      if(at.length> 0) {
        arNode.nodes = at;
        arNode.data = arNode.nodes;
        nodeData.push(arNode);
      }
    }
    return nodeData;
  }

  _processAssetType =(st:any, id:string, fieldGroups:any, parentId: string, subtypeCode:number, crumb:any, parent:string) => {
    let nodeData = [];
    let atList = [];
    let relFilter = [];
    let sourceId = parentId;
      //need to check if subtype is a table, if so, find it's target feature class that's it related to to get junction and edge sources
      let checkTables = crumb.some((c:any) => {
        return c.type === "Table";
      });
      if(checkTables) {
        relFilter = this.state.relationshipElements.filter((re:any) => {
          return (re.destinationLayerId === parseInt(parentId) || re.originLayerId === parseInt(parentId));
        });
        if(relFilter.length > 0) {
          if(relFilter[0].destinationLayerId !== parseInt(parentId)) {
            sourceId = relFilter[0].destinationLayerId;
          } else if(relFilter[0].originLayerId !== parseInt(parentId)) {
            sourceId = relFilter[0].originLayerId;
          } else {
            //keep it the same
          }
        }
      }
      //end table check to get FL id
      if(this.state.controllerDS !== null) {
        this.state.controllerDS.dataElement.domainNetworks.map((dn:any) => {
          var junctionSource = dn.junctionSources.filter((js:any) => {
            return js.layerId === parseInt(sourceId);
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
              return es.layerId === parseInt(sourceId);
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
        //atList.sort(this._compare("assetTypeName"));
        atList.map((at: any) => {
          nodeData.push({
            id: this.replaceColon(id+ "_" + at.assetTypeCode),
            type: "Assettype",
            text: at.assetTypeName,
            icon: "",
            requestAdditional: true,
            data: at,
            fieldGroups: fieldGroups,
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
    //ar.sort(this._compare("name"));
    let nodeData = [];
    if(ar.length > 0) {
      ar.map((fd: any, i: number) => {
        nodeData.push({
          id: this.replaceColon(id + "_" + fd.name),
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
    //fields.sort(this._compare("name"));
    let nodeData = [];
    if(fields.length > 0) {
      fields.map((fd: any) => {
        nodeData.push({
          id: this.replaceColon(id + "_" + fd.name),
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
    //indexes.sort(this._compare("name"));
    let nodeData = [];
    if(indexes.length > 0) {
      indexes.map((idx: any) => {
        //don't add indexes with period in them.
        if(idx.name.indexOf(".") <= -1) {
          nodeData.push({
            id: this.replaceColon(id + "_" + idx.name),
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
    //categories.sort(this._compare("name"));
    let nodeData = [];
    if(categories.length > 0) {
      categories.map((cat: any) => {
        let cleanId = id + "_" + cat.name.replace(/ /g, "_");
        nodeData.push({
          id: this.replaceColon(cleanId),
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
    //domainNetworks.sort(this._compare("domainNetworkAliasName"));
    let nodeData = [];
    if(domainNetworks.length > 0) {
      domainNetworks.map((dn: any) => {
        nodeData.push({
          id: this.replaceColon(id + "_" + dn.domainNetworkName),
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
    //networkAttributes.sort(this._compare("name"));
    let nodeData = [];
    if(networkAttributes.length > 0) {
      networkAttributes.map((na: any) => {
        let cleanId = id + "_" + na.name.replace(/ /g, "_");
        nodeData.push({
          id: this.replaceColon(cleanId),
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
    //terminalConfigurations.sort(this._compare("terminalConfigurationName"));
    let nodeData = [];
    if(terminalConfigurations.length > 0) {
      terminalConfigurations.map((tc: any) => {
        let cleanId = id + "_" + tc.terminalConfigurationName.replace(/ /g, "_");
        nodeData.push({
          id: this.replaceColon(cleanId),
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
        case "Asset types": {
          newActiveList.push(<AssetTypesCard data={dataNode} requestURL={this.state.requestURL}
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
              domains={this.state.domainElements}
              cacheData={this.state.cacheData}
              relationships={this.state.relationshipElements}
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
            serviceElements={this.state.serviceElements}
            dataElements={this.state.dataElements}
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
          newActiveList.push(<FieldsCard data={dataNode} requestURL={this.state.requestURL} cacheData={this.state.cacheData}
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
        case "Field": {
          newActiveList.push(<FieldCard data={dataNode} domains={this.state.domainElements} requestURL={this.state.requestURL} cacheData={this.state.cacheData}
            dataElements={this.state.dataElements}
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
          newActiveList.push(<DomainCard data={dataNode} dataElements={this.state.dataElements} requestURL={this.state.requestURL} layerElements={this.state.layerElements}
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
          newActiveList.push(<TableCard data={dataNode} domains={this.state.domainElements} requestURL={this.state.requestURL} cacheData={this.state.cacheData}
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
        case "Layer": {
          newActiveList.push(<LayerCard key={dataNode.id} data={dataNode} domains={this.state.domainElements} requestURL={this.state.requestURL} cacheData={this.state.cacheData}
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
        case "Feature Service": {
          newActiveList.push(<FeatureServiceCard key={dataNode.id} data={dataNode} requestURL={this.state.requestURL}
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
      this.setState({favoriteCards: favoriteCard, masterFavoriteCards: favoriteCard, favoriteMessage: "Added to favorites"}, ()=> {
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
    } else {
      let filterFC = favoriteCard.filter((fc) => {
        return(fc.key !== (dataNode.id).toString());
      });
      this.setState({favoriteCards: filterFC, masterFavoriteCards: filterFC, favoriteMessage: "Removed from favorites"}, ()=> {
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
        if(Array.isArray(sn)) {
          sn.map((s:any) => {
            hasSubNodes(s, i);
          });
        } else {
          if((sn.props.data.text).toLowerCase().indexOf(value.toLowerCase()) > -1) {
            matchList[0].push(sn);
          }
        }
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
      let cleanValue = this.replaceSpaces(value);
      parent = this.replaceSpaces(parent);
      let serviceNodes = [...this.state.serviceNodes];
      let hasSubNodes =(node: any) => {
        if(node.type === type) {
          let nodeText = this.replaceSpaces(node.text);
          if(node.hasOwnProperty("parent")) {
            if(typeof(parent) !== "undefined") {
              let nodeParentVal = this.replaceSpaces(node.parent);
              if((nodeParentVal).toLowerCase() === this.replaceSpaces((parent)).toLowerCase()) {
                //see if there is another level of parent to search for example if "unknown" asset type is passed
                if(typeof(parentSub) !== "undefined") {
                  if((nodeText).toLowerCase() === (this.replaceSpaces(parentSub)).toLowerCase()) {
                    matchNode = node;
                  }
                  else {
                    node.crumb.map((c: any) => {
                      if((this.replaceSpaces(c.value)).toLowerCase() === (this.replaceSpaces(parentSub)).toLowerCase()) {
                        if((nodeText).toLowerCase() === (cleanValue).toLowerCase()) {
                          matchNode = node;
                        }
                      }
                    });
                  }
                } else {
                  if((nodeText).toLowerCase() === (cleanValue).toLowerCase()) {
                    matchNode = node;
                  }
                }
              }
            } else {
              if((nodeText).toLowerCase() === (cleanValue).toLowerCase()) {
                matchNode = node;
              }
            }
          } else {
            if((nodeText).toLowerCase() === (cleanValue).toLowerCase()) {
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
  togglePanel2 =(panel2State: boolean) => {
    let newState = false;
    let newSize = document.body.clientWidth;
    let newPanelCount = 0;
    let existingPanel1Cards = this.state.activeCards;
    if(panel2State) {
      newState = false;
      newPanelCount = 0;
      if(this.state.showTree) {
        newSize = (document.body.clientWidth - (this.state.tocWidth + 25));
      } else {
        newSize = (document.body.clientWidth - 75);
      }
      if(existingPanel1Cards.length > 1) {
        existingPanel1Cards[1].map((ac:any) => {
          this._callMovePanels(ac.props.data, ac.props.data.type, 1, "Left");
        });
        existingPanel1Cards[1] = [];
      }
    } else {
      newState = true;
      newPanelCount = 1;
      if(this.state.showTree) {
        newSize = (document.body.clientWidth - (this.state.tocWidth + 25)) / 2;
      } else {
        newSize = (document.body.clientWidth - 75) / 2;
      }
    }
    this.setState({showPanel2: newState, stagePanels:newPanelCount, cardWidth:newSize, winHeight: document.body.clientHeight, activeCards:existingPanel1Cards});

  }

  toggleTree() {
    if(this.state.showTree) {
      let newSize = (document.body.clientWidth - 90);
      if(this.state.showPanel2) {
        newSize = ((document.body.clientWidth - 90) / 2);
      }
      this.setState({showTree: false, contentStartLocation:60, cardWidth:newSize, winHeight: document.body.clientHeight});
    } else {
      let newSize = (document.body.clientWidth - (this.state.tocWidth + 30));
      if(this.state.showPanel2) {
        newSize = ((document.body.clientWidth - (this.state.tocWidth + 30)) / 2);
      }
      this.setState({showTree: true, contentStartLocation:this.state.tocWidth, cardWidth: newSize, winHeight: document.body.clientHeight});
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
    if(this.props.queryObject.hasOwnProperty("cacheId")) {
      this.setState({cacheId: this.props.queryObject.cacheId});
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
    } else {
      this.searchLaunchCard(this.state.serviceNodes[0].text, "Feature Service", 0);
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

  replaceColon =(value:string) => {
    if(typeof(value) !== "string") {
      value = value.toString();
    }
    value = this.replaceSpaces(value);
    if(value.indexOf(":") > -1) {
      value = value.replace(/:/g,"__");
    }
    return value;
  }

  replaceSpaces =(value:string) => {
    if(typeof value !== "undefined") {
      if(value.indexOf(" ") > -1) {
        value = value.replace(/ /g,"");
      }
    }
    return value;
  }


  handleResize =() => {
    let currentTOCState = !this.state.showPanel2;
    this.togglePanel2(currentTOCState);
  }

  isEmpty =(obj) => {
    if(typeof(obj) !== "undefined") {
      return Object.keys(obj).length === 0;
    } else {
      return true;
    }
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
