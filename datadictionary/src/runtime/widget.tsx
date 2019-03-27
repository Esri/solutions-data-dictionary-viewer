/** @jsx jsx */
import {BaseWidget, React, ReactDOM, classNames, FormattedMessage, defaultMessages as jimuCoreDefaultMessage} from 'jimu-core';
import {AllWidgetProps, css, jsx, styled} from 'jimu-core';
import {IMConfig} from '../config';

import { TabContent, TabPane, Nav, NavItem, NavLink, Button, Image, ButtonDropdown, Popover, PopoverHeader, PopoverBody, Icon, Input,
  Modal, ModalHeader, ModalBody, ModalFooter, Collapse } from 'jimu-ui';
import defaultMessages from './translations/default';
import ServiceExplorerTree from './ServiceExplorerTree';
import SubtypeCard from './SubtypeCard';
import RelationshipCard from './relationshipCard';
import RelationshipsCard from './RelationshipsCard';
import MinimizedCard from './MinimizedCard';
import AttributeRulesCard from './AttributeRulesCard';
import AttributeRuleCard from './AttributeRuleCard';
import FieldCard from './FieldCard';
import { any } from 'prop-types';
import './css/custom.css';
let heartIcon = require('jimu-ui/lib/icons/heart.svg');
let searchIcon = require('jimu-ui/lib/icons/search.svg');
let deleteIcon = require('jimu-ui/lib/icons/delete.svg');
let treeIcon = require('jimu-ui/lib/icons/datasource.svg');

export default class Widget extends BaseWidget<AllWidgetProps<IMConfig>, any>{
  constructor(props){
    super(props);
    this.toggleHistory = this.toggleHistory.bind(this);
    this.toggleSearch = this.toggleSearch.bind(this);
    this.toggleTree = this.toggleTree.bind(this);

    this.state = {
      activeTab: 'properties',
      requestURL: "https://arcgisutilitysolutionsdemo.esri.com/server/rest/services/Water_Distribution_Utility_Network/FeatureServer",
      serviceElements: {},
      hasDataElements: false,
      dataElements: [],
      layerElements: [],
      relationshipElements: [],
      domainElements: [],
      showTree: true,
      showActiveOptions: "none",
      contentStartLocation: 405,
      popoverOpen: false,
      popoverSearch: false,
      favoriteCards: [],
      masterFavoriteCards: [],
      activeCards: [],
      masterActiveCards: [],
      activeSearching: false,
      deleteModal: false,
      deleteAllType: "active"
    };
  }
  //https://pleblanc3.esri.com/server/rest/services/cav/FeatureServer
  //https://arcgisutilitysolutionsdemo.esri.com/server/rest/services/Water_Distribution_Utility_Network/FeatureServer

  toggle = (tab) => {
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

  toggleTree() {
    if(this.state.showTree) {
      this.setState({showTree: false, contentStartLocation:60});
    } else {
      this.setState({showTree: true, contentStartLocation:405});
    }
  }

  componentWillMount() {
    this.parseURL();
  }

  componentDidMount() {
    this.requestServiceDetails().then(() => {
      this._requestObject("queryDataElements").then(() => {
        this._requestObject("relationships").then(() => {
          this._requestObject("queryDomains").then(() => {
            let dataStructure = {
              requestURL: this.state.requestURL,
              serviceElements: this.state.serviceElements,
              hasDataElements: this.state.hasDataElements,
              dataElements: this.state.dataElements,
              layerElements: this.state.layerElements,
              relationshipElements: this.state.relationshipElements,
              domainElements: this.state.domainElements
            }
            ReactDOM.render(<ServiceExplorerTree theme={this.props.theme} height={1000} width={390} callback={this._callbackFromTree} data={dataStructure} />, document.getElementById("serviceExplorerTree"));
          });
        });
      });
    });
    //this._featureLayerList();
  }

  render(){
    return <div className="widget-demo">
      <div style={{float: "left", overflow: "auto", position: "fixed"}}>
        <Button id="PopoverTree" color="info" type="button" onClick={this.toggleTree} style={{top:1, left:0, position:"fixed"}}>
          <Icon icon={treeIcon} size='16' color='#333' />
        </Button>
        <Collapse isOpen={this.state.showTree}>
          <div id="serviceExplorerTree" style={{width: 400}}></div>
        </Collapse>
      </div>
      <div id="serviceExplorerStage" className="customScrollStyle" style={{top:0, left: this.state.contentStartLocation, position: "absolute", whiteSpace:"nowrap", overflowX:"auto"}}>
        {this.state.activeCards}
      </div>
      <div id="serviceExplorerSidebar" style={{top:0, right: 0, position: "fixed", textAlign: "right", display:this.state.showActiveOptions}}>
        <Button id="popoverSearch" color="info" type="button" onClick={this.toggleSearch}>
          <Icon icon={searchIcon} size='16' color='#333' />
        </Button>
        <Popover placement="left" isOpen={this.state.popoverSearch} target="popoverSearch">
          <PopoverHeader>Search Active Cards</PopoverHeader>
          <PopoverBody>
            <Input placeholder="Search Active Cards" ref="activeSearchValue" onChange={(e)=>{this.searchService(e.target.value, "active")}}></Input>
          </PopoverBody>
        </Popover>
        <br></br>
        <Button id="popoverDelete" color="danger" type="button" onClick={this.deleteAllActiveAsk}>
          <Icon icon={deleteIcon} size='16' color='#333' />
        </Button>
        <br></br>
        <Button id="PopoverClick" color="warning" type="button" onClick={this.toggleHistory}>
          <Icon icon={heartIcon} size='16' color='#333' />
        </Button>
        <Popover placement="left" isOpen={this.state.popoverOpen} target="PopoverClick">
          <PopoverHeader><div style={{float:"left"}}>Favorites</div><div style={{float:"right"}} onClick={this.deleteAllFavoritesAsk}><Icon icon={deleteIcon} size='18' color='#333' /></div></PopoverHeader>
          <PopoverBody>
          <Input placeholder="Search favorites" ref="favoritesSearchValue" onChange={(e)=>{this.searchService(e.target.value, "favorites")}}></Input>
          {this.state.favoriteCards}
          </PopoverBody>
        </Popover>
      </div>
      <Modal isOpen={this.state.deleteModal}>
          <ModalBody>
            Are you sure you want to delete all?
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={this.deleteAllYes}>Yes</Button>{' '}
            <Button color="secondary" onClick={this.deleteAllNo}>No</Button>
          </ModalFooter>
        </Modal>
    </div>;
  }

  //Request Info
  requestServiceDetails = async () => {
    //let qDE_url = FSurl + "/queryDomains?layers=" + args.searchLayers +"&f=pjson";
    let URL = this.state.requestURL + "/?f=pjson"
    await fetch(URL, {
      method: 'GET'
    })
    .then((response) => {return response.json()})
    .then((data) => {
      console.log(data);
      if(!data.hasOwnProperty("error")){
        this.setState({serviceElements: data});
      }
    });
  }

  _requestObject = async(type: any) => {
    let url = this.state.requestURL + "/" + type + "?f=pjson";
    let request = await fetch(url, {
      method: 'GET'
    });
    let data = await request.json();
    switch(type) {
      case "queryDataElements": {
        if(!data.hasOwnProperty("error")){
          this.setState({hasDataElements: true, dataElements: data.layerDataElements});
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
      default:
        break;
    }

  }

  //card creator
  _createCardHolder =(dataNode: any, type: any) => {
    let checkArray = this.state.activeCards.filter((ac) => {
      return(ac.key === (dataNode.id).toString());
    });
    if(checkArray.length <= 0) {
      let newActiveList = [...this.state.activeCards];
      switch(type) {
        case "Subtype": {
          newActiveList.push(<SubtypeCard key={dataNode.id} data={dataNode} domains={this.state.domainElements}  width={750}  callbackClose={this._callbackCloseChild} callbackMinimize={this._callbackMinimizeChild} requestURL={this.state.requestURL} />);
        break;
        }
        case "Relationships": {
          newActiveList.push(<RelationshipsCard key={dataNode.id} data={dataNode} width={750}  callbackClose={this._callbackCloseChild} callbackMinimize={this._callbackMinimizeChild} requestURL={this.state.requestURL} />);
          break;
        }
        case "Relationship": {
          newActiveList.push(<RelationshipCard key={dataNode.id} data={dataNode} width={750} callbackClose={this._callbackCloseChild} callbackMinimize={this._callbackMinimizeChild} />);
          break;
        }
        case "AttributeRules": {
          newActiveList.push(<AttributeRulesCard key={dataNode.id} data={dataNode} width={750}  callbackClose={this._callbackCloseChild} callbackMinimize={this._callbackMinimizeChild} requestURL={this.state.requestURL} />);
          break;
        }
        case "AttributeRule": {
          newActiveList.push(<AttributeRuleCard key={dataNode.id} data={dataNode} width={750}  callbackClose={this._callbackCloseChild} callbackMinimize={this._callbackMinimizeChild} requestURL={this.state.requestURL} />);
          break;
        }
        case "Field": {
          newActiveList.push(<FieldCard key={dataNode.id} data={dataNode} domains={this.state.domainElements} width={750}  callbackClose={this._callbackCloseChild} callbackMinimize={this._callbackMinimizeChild} requestURL={this.state.requestURL} />);
          break;
        }
      }
      this.setState({activeCards: newActiveList, masterActiveCards: newActiveList, showActiveOptions:"block"});
    }

  }

  _createMinimizedCardHolder =(dataNode: any) => {
    let favoriteCard = [...this.state.favoriteCards];
    let filterFC = favoriteCard.filter((fc) => {
      return(fc.key === (dataNode.id).toString());
    });
    if(filterFC.length <= 0) {
      favoriteCard.push(<MinimizedCard key={dataNode.id} data={dataNode} width={250} height={50} callbackRestore={this._callbackRestoreChild} callbackDelete={this._callbackDeleteFavorite} />);
      this.setState({favoriteCards: favoriteCard, masterFavoriteCards: favoriteCard});
    }
  }

  _callbackFromTree =(dataNode: any, type: any) => {
    this._createCardHolder(dataNode, type);
  }

  _callbackCloseChild =(dataNode: any) => {
    let activeCard = [...this.state.masterActiveCards];
    let filterAC = activeCard.filter((fc) => {
      return(fc.key !== (dataNode.id).toString());
    });
    this.setState({activeCards: filterAC, masterActiveCards:filterAC});

    //if closing from search, perform search again
    if(this.state.masterActiveCards.length > 1) {
      if(this.state.activeSearching){
        this.searchService(ReactDOM.findDOMNode(this.refs.favoritesSearchValue).value, "active");
      }
    } else {
      if(this.state.masterActiveCards.length <= 1) {
        //check if any in favorites
        if(this.state.masterFavoriteCards.length <= 0) {
          console.log(this.state.masterFavoriteCards);
          this.setState({showActiveOptions: "none", popoverOpen:false, popoverSearch: false});
        }
      }
    }

  }

  _callbackMinimizeChild=(node: any) => {
    this._callbackCloseChild(node);
    this._createMinimizedCardHolder(node);
  }

  _callbackRestoreChild=(node: any) => {
    //this._callbackCloseChild(node.id);
    let favoriteCard = [...this.state.favoriteCards];
    let filterFC = favoriteCard.filter((fc) => {
      return(fc.key !== (node.id).toString());
    });
    this.setState({favoriteCards: filterFC});
    this._createCardHolder(node, node.type);
  }

  _callbackDeleteFavorite=(node: any) => {
    let favoriteCard = [...this.state.masterFavoriteCards];
    let filterFC = favoriteCard.filter((fc) => {
      return(fc.key !== (node.id).toString());
    });
    this.setState({favoriteCards: filterFC, masterFavoriteCards: filterFC});

    if(this.state.masterFavoriteCards.length <= 1) {
      //check if any in favorites
      if(this.state.masterActiveCards.length <= 0) {
        this.setState({showActiveOptions: "none", popoverOpen:false, popoverSearch: false});
      }
    } else {
      if(this.state.activeSearching){
        this.searchService(ReactDOM.findDOMNode(this.refs.favoritesSearchValue).value, "favorites");
      }
    }
  }

  deleteAllFavoritesAsk =() => {
    this.setState({deleteModal: true, deleteAllType: "favorites"});
  }

  deleteAllActiveAsk =() => {
    this.setState({deleteModal: true, deleteAllType: "active"});
  }

  deleteAllYes =() => {
    if(this.state.deleteAllType === "active") {
      if(this.state.masterFavoriteCards.length <= 0) {
        this.setState({activeCards: [], masterActiveCards: [], deleteModal:false, showActiveOptions: "none", popoverOpen:false, popoverSearch: false});
      } else {
        this.setState({activeCards: [], masterActiveCards: [], deleteModal:false});
      }
    } else {
      if(this.state.masterActiveCards.length <= 0) {
        this.setState({favoriteCards: [], masterFavoriteCards: [], deleteModal:false, popoverOpen:false, popoverSearch: false, showActiveOptions: "none"});
      } else {
        this.setState({favoriteCards: [], masterFavoriteCards: [], deleteModal:false});
      }
    }
  }

  deleteAllNo =() => {
    //no, just hide modal again
    this.setState({deleteModal: false});
  }

  //Search function
  searchService =(value: string, type: string) => {
    let matchList = [];
    let activeSearching = false;
    if(value !== "") {
      let serviceNodes: any;
      if(type === "active") {
        serviceNodes = [...this.state.masterActiveCards];
      } else {
        serviceNodes = [...this.state.masterFavoriteCards];
      }
      let hasSubNodes =(node: any) => {
        if((node.props.data.text).toLowerCase().indexOf(value.toLowerCase()) > -1) {
          matchList.push(node);
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

  //Helper Functions
  parseURL= () => {
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m,key,value) => {
        if(key === "lookup") {
          this.setState({requestURL: value});
        }
        return value;
    });
  }

}
