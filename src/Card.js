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
import Prism from 'prismjs';
import { Rnd } from 'react-rnd';
//import SyntaxHighlighter from 'react-syntax-highlighter';
//import { docco } from 'react-syntax-highlighter/styles/hljs';

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
    let uniqueContainer = this.props.title + "_container";
    return (
      <div className={uniqueContainer}>
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
        <CardTableDetails data={localData} id={localId} title={this.props.title} />
      </Rnd>
      </div>
    );
  }

  componentDidMount() {
    //this.formatData();
  }

  closeCard =() => {
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
  };
  render() {
    var rowHeader = () => {
      return (
        <tr>
          <td>Attribute</td>
          <td>Value</td>
        </tr>
      );
    };
    var rowData = () => {
      //<SyntaxHighlighter language='javascript' style={docco}>{codeString}</SyntaxHighlighter>
      let list = [];
      for(let key in this.props.data) {
        let uniqueId = "card-" + this.props.id + "-" + key;
        if(key === "scriptExpression") {
          list.push(<tr key={uniqueId}><td>{key}</td><td className="scriptExpBg" dangerouslySetInnerHTML={{__html: Prism.highlight(this.props.data[key], Prism.languages.javascript, 'javascript')}} ></td></tr>);
        } else {
          list.push(<tr key={uniqueId}><td>{key}</td><td>{JSON.stringify(this.props.data[key])}</td></tr>);
        }
      }
      return (list);
    };
    return (
      <div className={this.props.title}>
        <table className="bp3-html-table bp3-interactive card-table-style">
            <thead>
            {rowHeader()}
            </thead>
            <tbody>
            {rowData()}
            </tbody>
        </table>
      </div>
    );
  }
};

export default DetailCard;