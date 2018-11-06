import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import { store } from './store/index';
import reducers from './reducers/reducers';
import './index.css';
import App from './App';
import TreeToc from './Tree';
//import MapComponent from './Map';
import DetailsTable from './Details';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from './StoreHelper';

import registerServiceWorker from './registerServiceWorker';

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return (true);
  }

  //connect(mapStateProps, mapDispatchToProps);
}

//export default connect(mapStateToProps, mapDispatchToProps)(Index);

ReactDOM.render(<Provider store={store}><Index /></Provider>, document.getElementById('root'));
ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('map'));
ReactDOM.render(<Provider store={store}><TreeToc /></Provider>, document.getElementById('toc'));

//ReactDOM.render(<Provider store={store}><DetailsTable columns={[]} data={[]} header={"Details"} /></Provider>, document.getElementById('details'));
registerServiceWorker();
