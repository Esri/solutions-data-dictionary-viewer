/** @jsx jsx */
import {BaseWidget, React, defaultMessages as jimuCoreDefaultMessage} from 'jimu-core';
import {AllWidgetProps, css, jsx, styled} from 'jimu-core';
import {IMConfig} from '../config';

import {Badge, Icon} from 'jimu-ui';
import './css/custom.css';
let RestoreIcon = require('jimu-ui/lib/icons/zoom-out-fixed.svg');
let CloseIcon = require('jimu-ui/lib/icons/close.svg');

interface IProps {
  data: any,
  width: number,
  height: number,
  callbackRestore: any,
  callbackDelete: any
}

interface IState {
  width: number,
  height: number,
  nodeData: any
}

export default class MinimizedCard extends React.Component <IProps, IState> {
  constructor(props: IProps){
    super(props);

    this.state = {
      width: this.props.width,
      height: this.props.height,
      nodeData: this.props.data.data
    };

  }

  componentWillMount() {
    //test
  }

  componentDidMount() {
    //this._processData();
  }

  render(){
    return (
    <div style={{width: this.state.width, height: this.state.height}}>
      <div style={{width: "100%", height: this.state.height, position: "relative", backgroundColor:"#ccc",  borderWidth:2, borderStyle:"solid", borderColor:"#000"}}>
        <div style={{left:5, top:3, width: 210, position:"absolute", textOverflow: "ellipsis", overflow: "hidden"}}>{this.props.data.text}</div>
        <div style={{right:25, top:3, width:20, position:"absolute"}} onClick={this.sendRestore}><Badge color="warning"><Icon icon={RestoreIcon} size='12' color='#333' /></Badge></div>
        <div style={{right:5, top:3, width:20, position:"absolute"}} onClick={this.sendDelete}><Badge color="danger"><Icon icon={CloseIcon} size='11' color='#333' /></Badge></div>
      </div>
    </div>);
  }

  sendRestore =() => {
    this.props.callbackRestore(this.props.data);
  }

  sendDelete =() => {
    this.props.callbackDelete(this.props.data);
  }

}
