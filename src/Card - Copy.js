/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";
import ReactDOM from 'react-dom';
import { Icon, Navbar, Alignment } from "@blueprintjs/core";
import { Resizable, ResizableBox } from 'react-resizable';
import Draggable, {DraggableCore} from 'react-draggable';
import { store } from './store/index';
import { Provider } from "react-redux";
import Prism from 'prismjs';
import { Rnd } from 'react-rnd';
import JsonTable from 'ts-react-json-table';
import Collapsible from 'react-collapsible';
//import SyntaxHighlighter from 'react-syntax-highlighter';
//import { docco } from 'react-syntax-highlighter/styles/hljs';

const matchTemplate = require("./support_files/match.json");
const lookupTemplate = require("./support_files/lookup.json");

class DetailCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cardOptions: {
        x: 0,
        y: 0,
        width: 400,
        height: "auto"
      },
      cardSize: {        width: 400,
        height: "auto"},
      collapseIcon: "chevron-up",
      data: null
    };
  };

  render() {
    //<div dangerouslySetInnerHTML={{__html: this.props.data}}></div>
    let localData = this.getData();
    let localId = this.getId();
    let localType = this.getDetailType();
    //let uniqueContainer = this.props.title + "_subDetails";
    return (
      <Rnd
        default={this.state.cardOptions}
        size={this.state.cardSize}
        onResize={this.cardResize}
        className="card-holder"
      >
        <Navbar className="card-nav-style">
          <Navbar.Group align={Alignment.Left}>
            <Navbar.Heading><span className="card-nav-header">{this.props.title}</span></Navbar.Heading>
          </Navbar.Group>
          <Navbar.Group align={Alignment.RIGHT}>
            <Icon icon={this.state.collapseIcon} onClick={this.collapseCard} />
            <Navbar.Divider />
            <Icon icon="delete" onClick={this.closeCard} />
          </Navbar.Group>
        </Navbar>
        <CardTableDetails data={localData} id={localId} title={this.props.title} detailType={localType} />
      </Rnd>
    );
  }

  componentDidMount() {
    //this.formatData();
  }

  closeCard =() => {
    let subs = document.getElementById(this.props.title + "_subDetails").childNodes;
    for (let i=0; i<subs.length; i++) {
      ReactDOM.unmountComponentAtNode(document.getElementById(subs[i].id));
    }
    ReactDOM.unmountComponentAtNode(document.getElementById(this.props.id));
  }

  collapseCard =(args) => {
    let options = {}
    let chevron = "chrevron-up";
    let node = document.getElementsByClassName(this.props.title);
    if(node.length > 0) {
      if(node[0].style.display === "block") {
        node[0].style.display = "none";
        chevron = "chevron-down";
        options.height = "50px";
      } else {
        if(node[0].style.display === "") {
          node[0].style.display = "none";
          chevron = "chevron-down";
          options.height = "50px";
        } else {
          node[0].style.display = "block";
          chevron = "chevron-up";
          options = {};
        }
      }
    }
    this.setState({cardSize: options, collapseIcon:chevron});
  }

  cardResize =(e, direction, ref, delta, position) => {
    let options = {
      width: ref.offsetWidth,
      height: ref.offsetHeight
    }
    this.setState({cardSize: options});
  }

  getData =() => {
    let details = null;
    if(store.getState().state.detailData !== null) {
      details = store.getState().state.detailData[0].details;
    }
    return details;
  }

  getDetailType =() => {
    let type = null;
    if(store.getState().state.detailData !== null) {
      type = store.getState().state.detailData[0].nodeType;
    }
    return type;
  }

  getId =() => {
    let id = null;
    if(store.getState().state.detailData !== null) {
      id = store.getState().state.detailData[0].id;
    }
    return id;
  }

}

class CardTableDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subDetails: []
    }
  };

  componentDidMount() {
    let totalSubDetails = [];
    console.log(this.state.subDetails);
    for(let i=0; i<this.state.subDetails.length; i++) {
      let currSubDet = this.state.subDetails[i];
      console.log(currSubDet);
      totalSubDetails.push({
        data: [currSubDet.data],
        label: currSubDet.label
      });
      for (let key in currSubDet.data) {
        if(typeof(currSubDet.data[key]) === "object" && currSubDet.data[key] !== null) {
          totalSubDetails.push({
            data: currSubDet.data[key],
            label: key
          });
          //currSubDet.data[key] = "See below";
        }
      }
    }
    totalSubDetails = this.state.subDetails;
    for(let i=0; i<totalSubDetails.length; i++) {
      let newSlot = document.createElement("div");
      newSlot.id = this.props.title + totalSubDetails[i].label + "_subDetails";
      document.getElementById(this.props.title + "_subDetails").appendChild(newSlot);
      ReactDOM.render(
        <Provider store={store}>
        <Collapsible trigger={totalSubDetails[i].label} triggerOpenedClassName="card-table-style" triggerClassName ="card-table-style">
          <JsonTable rows={totalSubDetails[i].data} />
          <div className="vertical-spacer"></div>
        </Collapsible>
        </Provider>, document.getElementById(newSlot.id));
      //ReactDOM.render(<Provider store={store}><CardSubDetails data={this.state.subDetails[i]} /></Provider>, document.getElementById(newSlot.id));
    }
  }

  render() {
    let rowHeader = () => {
      return (
        <tr>
          <td>Attribute</td>
          <td>Value</td>
        </tr>
      );
    };
    let uniqueContainer = this.props.title + "_subDetails";
    return (
      <div className={this.props.title}>
        <table className="bp3-html-table bp3-interactive card-table-style">
            <thead>
            {rowHeader()}
            </thead>
            <tbody>
            {this.processRowData()}
            </tbody>
        </table>
        <div id={uniqueContainer}></div>
      </div>
    );
  }

  processRowData =() => {
    let list = [];
    //check matchTemplate to only show what fields are defined and how to handle fields
    if(matchTemplate.hasOwnProperty(this.props.detailType)) {
      if(matchTemplate[this.props.detailType].show[0] !== "all") {
        let showList = matchTemplate[this.props.detailType].show;
        for(let i=0; i<showList.length; i++) {
          if((this.props.data).hasOwnProperty(showList[i].attribute)) {

            let uniqueId = "card-" + this.props.id + "-" + showList[i].attribute;
            if(showList[i].attribute === "scriptExpression") {
              list.push(<tr key={uniqueId}><td>{showList[i].attribute}</td><td className="scriptExpBg" dangerouslySetInnerHTML={{__html: Prism.highlight(this.props.data[showList[i].attribute], Prism.languages.javascript, 'javascript')}} ></td></tr>);
            } else {
              if(typeof(this.props.data[showList[i].attribute]) === "object" && this.props.data[showList[i].attribute] !== null) {
                //list.push(<tr key={uniqueId}><td>{showList[i].attribute}</td><td>{JSON.stringify(this.props.data[showList[i].attribute][showList[i].display])}</td></tr>);
                //Show subDetails if expanded.
                this.state.subDetails.push({
                  data: this.props.data[showList[i].attribute],
                  label: showList[i].attribute
                });
              } else {
                list.push(<tr key={uniqueId}><td>{showList[i].attribute}</td><td>{JSON.stringify(this.props.data[showList[i].attribute])}</td></tr>);
              }
            }

          }
        }
      } else {
        //if match template exist, but value is to show all, output everything
        for(let key in this.props.data) {
          let uniqueId = "card-" + this.props.id + "-" + key;
          if(key === "scriptExpression") {
            list.push(<tr key={uniqueId}><td>{key}</td><td className="scriptExpBg" dangerouslySetInnerHTML={{__html: Prism.highlight(this.props.data[key], Prism.languages.javascript, 'javascript')}} ></td></tr>);
          } else {
            list.push(<tr key={uniqueId}><td>{key}</td><td>{JSON.stringify(this.props.data[key])}</td></tr>);
          }
        }
      }
    } else {
      //if no match template, just output everything
      if(typeof(this.props.data) === "object" && this.props.data !== null) {
        this.state.subDetails.push({
          data: this.props.data,
          label: this.props.title
        });
      } else {
        let groupTier = [];
        for(let key in this.props.data) {
          let uniqueId = "card-" + this.props.id + "-" + key;
          if(key === "scriptExpression") {
            list.push(<tr key={uniqueId}><td>{key}</td><td className="scriptExpBg" dangerouslySetInnerHTML={{__html: Prism.highlight(this.props.data[key], Prism.languages.javascript, 'javascript')}} ></td></tr>);
          } else {
            if(typeof(this.props.data[key]) === "object" && this.props.data[key] !== null) {
              //list.push(<tr key={uniqueId}><td>{key}</td><td>{JSON.stringify(this.props.data[key])}</td></tr>);
              //Show subDetails if expanded.
              groupTier.push(this.props.data[key]);
            } else {
              list.push(<tr key={uniqueId}><td>{key}</td><td>{JSON.stringify(this.props.data[key])}</td></tr>);
            }
          }
        }
        if(groupTier.length > 0) {
          console.log(groupTier);
          this.state.subDetails.push({
            data: groupTier,
            label: this.props.title
          });
        }
      }
    }

    return (list);
  }

};

export default DetailCard;