import React, {Component} from 'react';
import esriLoader from 'esri-loader';
import './App.css';
import { store } from './store/index';
import { connect } from 'react-redux';
import { mapStateToProps, mapDispatchToProps } from './StoreHelper';
import { requestHelper, FSurl } from './RemoteRequest';

const options = {
  url: 'https://js.arcgis.com/4.9'
};

export default class App extends Component {
  constructor() {
    super();

    esriLoader.loadModules([
      'esri/Map',
      'esri/WebMap',
      'esri/views/MapView',
      'esri/layers/FeatureLayer'
    ], options)
        .then(([Map, WebMap, MapView, FeatureLayer]) => {
          var webmap = new WebMap({
            portalItem: { // autocasts as new PortalItem()
              id: "690f6848940c46c9be701e25aab3023f"
            }
          });

          requestHelper.parseURL();
          requestHelper.request().then((result) => {
            console.log(result);
            let layerList = [];
            for(let i=0; i < result.layers.length; i++) {
              if(result.layers[i].hasOwnProperty("type")) {
                if(result.layers[i].type === "Feature Layer" && result.layers[i].name !== "Service Territory") {
                  let fl = new FeatureLayer(FSurl+ "/"+result.layers[i].id);
                  let template = {
                    title: "Map Filter",
                    content: "Filter dictionary by Feature"
                  };
                  fl.popupTemplate = template;
                  layerList.push(fl);
                }
              } else {
                let fl = new FeatureLayer(FSurl+ "/"+result.layers[i].id);
                let template = {
                  title: "Map Filter",
                  content: "Filter dictionary by Feature"
                };
                fl.popupTemplate = template;
                layerList.push(fl);
              }
            }
            let map = new Map({
              basemap: 'gray-vector',
              layers: layerList
            });
            let view = new MapView({
              map: map,
              container: "mapContainer",
              center: [-88.153, 41.771],
              zoom: 16
            });

            view.on("click", async (event) => {
              checkFeature(view);
            })

            this.setState({
              map,
              view
            });

          });
;

          let checkFeature = (args) => {
            if(args.popup.features.length === 0) {
              setTimeout(() => {checkFeature(args)},200);
            } else {
              connect(mapStateToProps, mapDispatchToProps)(App);
              let firstFeature = args.popup.features[0];
              if(firstFeature.attributes.hasOwnProperty("assetgroup")) {
                //UN services
                let typeList = firstFeature.layer.types;
                let flag = "";
                typeList.forEach(type => {
                  if(type.id === firstFeature.attributes.assetgroup) {
                    flag = type.name;
                  }
                });
                if(flag !== "") {
                  this.createHandlers(flag);
                } else {
                  this.createHandlers(firstFeature.layer.title);
                }
              } else {
                //regular service
                this.createHandlers(firstFeature.layer.title);
              }
              console.log(args.popup.features);
            }
          };

        })
        .catch(err => {
          console.error(err);
        });
  }

  createHandlers = (data) => {
    console.log(store.getState());
    store.dispatch({type:'FILTER', payload:data});
    console.log(store.getState());
  };

  render() {
    return (
        <div id="mapContainer"/>
    );
  }
}
