import {React, FormattedMessage, DataSourceTypes, Immutable, ImmutableArray, IMUseDataSource, UseDataSource, IMDataSourceInfo, DataSource, DataSourceComponent, loadArcGISJSAPIModules} from 'jimu-core';
import {BaseWidgetSetting, AllWidgetSettingProps, DataSourceChooser, FieldChooser, SettingRow, SettingSection, FileUploader} from 'jimu-for-builder';
import {ArcGISDataSourceTypes} from 'jimu-arcgis/arcgis-data-source-type';
import {IMConfig} from '../config';
import defaultI18nMessages from './translations/default';
import { DataActionDropDown } from 'jimu-ui';

interface State{
  query: any;
  cacheStructure: any;
  cacheStatus: string;
  showCacheButton: boolean;
}

export default class Setting extends BaseWidgetSetting<AllWidgetSettingProps<IMConfig>, State>{
  supportedTypes = Immutable([ArcGISDataSourceTypes.FeatureLayer]);
  state = {
    query: null,
    cacheStructure: {
      featureServer: {},
      layers: {},
      queryDataElements: {},
      queryDomains: {},
      contingentValues : {},
      relationships : {},
      connectivityRules: {},
      metadata: {}
    },
    cacheStatus: "",
    showCacheButton: (this.props.config.useCache)?this.props.config.useCache:false
  };

  componentWillMount(){
    console.log(this);
  }

  componentDidMount(){

  }

  onURLChange = (evt: React.FormEvent<HTMLInputElement>) => {
    this.props.onSettingChange({
      widgetId: this.props.id,
      config: this.props.config.set('url', evt.currentTarget.value)
    });
  }

  onCachePathChange = (evt: React.FormEvent<HTMLInputElement>) => {
    this.props.onSettingChange({
      widgetId: this.props.id,
      config: this.props.config.set('cachePath', evt.currentTarget.value)
    });
  }

  onAllowLookupChange = (evt: React.FormEvent<HTMLInputElement>) => {
    this.props.onSettingChange({
      widgetId: this.props.id,
      config: this.props.config.set('allowUrlLookup', evt.currentTarget.checked)
    });
  }

  onUseCacheChange = (evt: React.FormEvent<HTMLInputElement>) => {
    this.props.onSettingChange({
      widgetId: this.props.id,
      config: this.props.config.set('useCache', evt.currentTarget.checked)
    });
    this.setState({showCacheButton: evt.currentTarget.checked});
  }

  onDataSourceSelect = (ds: any) => {
    console.log(ds);

    const useDataSources: UseDataSource[] = ds.map(d => ({
      dataSourceId: d.dataSourceJson && d.dataSourceJson.id,
      rootDataSourceId: d.rootDataSourceId
    }));

    this.props.onSettingChange({
      widgetId: this.props.id,
      useDataSources: Immutable(useDataSources) as ImmutableArray<IMUseDataSource>
    });

  }

  private getDataSourceIds = (useDataSources = Immutable([])) => {
    return Immutable(useDataSources.map(ds => ds.dataSourceId));
  }

  dataRender = (ds: DataSource, info: IMDataSourceInfo) => {
    let fName = this.props.useDataSources[0].fields[0];
    console.log(fName);
    return <div>
      <div className="record-list" style={{width: '100%', marginTop: '20px', height: 'calc(100% - 80px)', overflow: 'auto'}}>
        {
          ds ? ds.getRecords().map((r, i) => {
            return <div key={i}>{r.getData()[fName]}</div>
          }) : null
        }
      </div>

      <DataActionDropDown dataSource={ds} records={ds.getRecords()}></DataActionDropDown>
    </div>
  }


  render(){
    const { useDataSources, id } = this.props;
    return <div className="widget-setting-demo">
      <SettingSection>
        <SettingRow>
          <DataSourceChooser widgetId={id} isMultiple={true} selectedDataSourceIds={this.getDataSourceIds(useDataSources)}
            onSelect={this.onDataSourceSelect}
            types={this.supportedTypes} />
        </SettingRow>
      </SettingSection>

      <div style={{paddingBottom:10}}><FormattedMessage id="url" defaultMessage={defaultI18nMessages.url}/>: <input defaultValue={this.props.config.url} onChange={this.onURLChange} style={{width:"90%"}}/></div>
      <div style={{paddingBottom:10}}><FormattedMessage id="Use Cache" defaultMessage={defaultI18nMessages.useCache}/>: <input type="checkbox" checked={this.props.config.useCache} onChange={this.onUseCacheChange} /></div>

      {(this.state.showCacheButton)?
        <div>
          <div style={{paddingBottom:10}}>Build cache: <input defaultValue="Build Cache" onClick={this.checkCreatePortalItem} type="button"/></div>
          <div style={{paddingBottom:10}}>{this.state.cacheStatus}</div>
        </div>
        :''
      }
      <div style={{height:"25px"}}></div>
      <div style={{paddingBottom:10}}><FormattedMessage id="allowurlLookup" defaultMessage={defaultI18nMessages.urlLookup}/>: <input type="checkbox" checked={this.props.config.allowUrlLookup} onChange={this.onAllowLookupChange} /></div>


      {(typeof(this.props.useDataSources) !== "undefined") &&
        <DataSourceComponent useDataSource={this.props.useDataSources[0]} query={''}>
        {
          this.dataRender
        }
      </DataSourceComponent>
      }

    </div>
  }

  checkCreatePortalItem =() => {
    loadArcGISJSAPIModules(['esri/portal/Portal','esri/portal/PortalItem', 'esri/portal/PortalUser']).then(async ([Portal, PortalItem, PortalUser]) => {
      console.log(this);
      let portal = new Portal({
        url: this.props.portalUrl // First instance
      });
      portal.load().then(() => {
        let queryParams = {
          query: "tags:Data Dictionary Support Files AND owner:"+this.props.user.username,
          num: 1
        };
        portal.queryItems(queryParams).then((response:any) => {
          if(response.results.length > 0) {
            this.requestServiceInfo(response.results[0].id);
            response.results[0].access = "public";
            this.props.onSettingChange({
              widgetId: this.props.id,
              config: this.props.config.set('cacheId', response.results[0].id)
            });
          } else {
            this.httpRequest({method: 'POST', url:this.props.portalUrl + "/sharing/rest/content/users/"+this.props.user.username+"/addItem",
              params: {
                  f : "json",
                  token: this.props.token,
                  tags: "Data Dictionary Support Files",
                  title: "Data Dictionary Support Files",
                  type: "Application",
              }
            })
            .then((result:any) => {
              //var data = {"org":true, "everyone":true};
              //portal.shareItem(data, result.id).then((res)  => {
                this.requestServiceInfo(result.id);
                this.props.onSettingChange({
                  widgetId: this.props.id,
                  config: this.props.config.set('cacheId', result.id)
                });
              //});
            });
          }
        });
      });
    });
  }


  requestServiceInfo = async(itemId:any) => {
    let url = this.props.config.url;
    //grab feature Service json to store
    this.setState({cacheStatus: "Step 1 of 7: Saving Feature Service"});
    await this.fetchRequest(url+"/?f=pjson",{type:"featureServer"},itemId,"").then(async(response:any) => {

      //Grab all Domains
      this.setState({cacheStatus: "Step 2 of 7: Saving Domains"});
      let qDomainURL = url + "/queryDomains/?f=pjson";
      await this.fetchRequest(qDomainURL,{type:"queryDomains"},itemId,"");

      //Grab all CAVs
      this.setState({cacheStatus: "Step 3 of 7: Saving Contingent Attribute Values"});
      let qCAVURL = url + "/queryContingentValues/?f=pjson";
      await this.fetchRequest(qCAVURL,{type:"contingentValues"},itemId,"");

      //Grab all Relationships
      let qRelUrl = url + "/relationships/?f=pjson";
      this.setState({cacheStatus: "Step 4 of 7: Saving Relationships"});
      await this.fetchRequest(qRelUrl,{type:"relationships"},itemId,"");

      //Grab all Data Elements
      this.setState({cacheStatus: "Step 5 of 7: Saving Data Elements"});
      let qDEUrl = url + "/queryDataElements/?f=pjson";
      await this.fetchRequest(qDEUrl,{type:"queryDataElements"},itemId,"").then(async(response:any) => {
        console.log(response);
        //do connectivity rules by layer and subtype
        let rulesTable = response.layerDataElements.filter((de:any) =>{
          return de.dataElement.aliasName === "Rules";
        });
        if(rulesTable.length > 0) {
          this.setState({cacheStatus: "Step 6 of 7: Saving Connectivity Rules"});
          await this.prepConnectivityRulesCache(response, url, rulesTable[0].dataElement.layerId ,itemId);
        }
      });

      //grab layers json to store
      this.setState({cacheStatus: "Step 7 of 7: Saving Layers and Metadata"});
      response.layers.map(async(lyr:any, i:number) => {
        let newURL = url + "/" + lyr.id+"/?f=pjson";
        await this.fetchRequest(newURL,{type:"layers"},itemId,"");

        let metadataUrl = url + "/" + lyr.id +"/metadata";
        await this.fetchRequest(metadataUrl,{type:"metadata"},itemId,(lyr.id).toString());

        if(i === response.layers.length - 1) {
          this.setState({cacheStatus: "Done"});
        }
      });

    });

  }


  fetchRequest = (url, params, itemId, subCat) => {
    return new Promise((resolve, reject) => {
      let response = {};
      let requestURL = url;
      fetch(requestURL, {method: 'GET'})
      .then((response) => {
        if(params.type == "metadata") {
          return response.text();
        } else {
          return response.json();
        }
      })
      .then(async (data) => {
        if(params.type == "metadata") {
          await this.processCache(data, params.type, itemId, subCat);
        }
        else {
          if(!data.hasOwnProperty("error")){
          await this.processCache(data, params.type, itemId, subCat);
          }
        }
        response = data;
        resolve(response);
      });
    });
  }

  processCache = async (data: any, type: any, itemId:any, subCat:string) => {
    return new Promise((resolve, reject) => {
      loadArcGISJSAPIModules(['esri/portal/Portal','esri/portal/PortalItem', 'esri/portal/PortalUser']).then(async ([Portal, PortalItem, PortalUser]) => {
        let currStruct = {...this.state.cacheStructure};

        switch(type) {
          case "layers": {
            if(currStruct[type].hasOwnProperty(data.id)) {
              currStruct[type][data.id] = data;
            } else {
              currStruct[type][data.id] = {};
              currStruct[type][data.id] = data;
            }
            break;
          }
          case "metadata": {
            if(subCat !== "") {
              currStruct[type][subCat] = data;
            } else {
              currStruct[type] = data;
            }
            break;
          }
          case "connectivityRules": {
            if(subCat !== "") {
              if(currStruct[type].hasOwnProperty(subCat)) {
                currStruct[type][subCat].push(data);
              } else {
                currStruct[type][subCat] = [];
                currStruct[type][subCat].push(data);
              }
            } else {
              currStruct[type].push(data);
            }
            break;
          }
          default : {
            currStruct[type] = data;
            break;
          }
        }

        let url = this.props.portalUrl + "/sharing/rest/content/users/"+this.props.user.username+"/items/"+itemId + "/update";
        this.httpRequest({method: 'POST', url:url,
          params: {
            f : "json",
            token: this.props.token,
            tags: "Data Dictionary Support Files",
            overwrite: true,
            text: JSON.stringify(currStruct),
            access: "public"
          }
        })
        .then((result:any) => {
          this.setState({cacheStructure: currStruct}, () => {
            resolve(result);
          });
        });

      });
    });
  }

  prepConnectivityRulesCache = (de:any, url:string, rulesLayer:number, itemId:any) => {
    return new Promise((resolve, reject) => {
      let layers = de.layerDataElements;
      let whereClause = "";
      layers.map((lyr:any) => {
        let de = lyr.dataElement;
        let sourceId = this.getSourceId(layers, de);
        if(sourceId !== -1) {
          if(de.hasOwnProperty("subtypes")) {
            de.subtypes.map(async(st:any) => {
              whereClause = "(fromassetgroup=" + st.subtypeCode + " and fromnetworksourceid=" + sourceId + ") OR (toassetgroup=" + st.subtypeCode + " and tonetworksourceid=" + sourceId + ")";
              let qCRurl = url + "/" + rulesLayer + "/query?where="+whereClause+"&f=pjson";
              await this.fetchRequest(qCRurl,{type:"connectivityRules"},itemId,sourceId.toString());
              resolve(true);
            });
          }
        }
      });
    });
  };

  getSourceId =(layers: any, currLayer: any) => {
    let sourceId = -1;
    layers.map((lyr:any) => {
      let de = lyr.dataElement;
      if(de.hasOwnProperty("domainNetworks")) {
        de.domainNetworks.map((dn:any) =>{
          let edges = dn.edgeSources.filter((es:any) =>{
            return es.layerId === currLayer.layerId;
          });
          if(edges.length > 0) {
            sourceId = edges[0].sourceId;
          }
          let junctions = dn.junctionSources.filter((js:any) =>{
            return js.layerId === currLayer.layerId;
          });
          if(junctions.length > 0) {
            sourceId = junctions[0].sourceId;
          }
        });
      }
    });
    return sourceId;
  }



  httpRequest = (opts:any) => {
    return new Promise(function (resolve, reject) {
      let xhr = new XMLHttpRequest();

      xhr.open(opts.method, opts.url);
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhr.onerror = function(e){reject(e)};
      xhr.onload = function () {
        if (this.status >= 200 && this.status < 300) {
            let jsonRes = xhr.response;
            try {
              if (typeof jsonRes !== "object") {jsonRes = JSON.parse(xhr.response)};
            } catch(e) {
              resolve(jsonRes);
            }
            resolve(jsonRes);
        } else {
            reject({
            status: this.status,
            statusText: xhr.statusText
            });
        }
      };

      if (opts.headers)
      Object.keys(opts.headers).forEach(  key => xhr.setRequestHeader(key, opts.headers[key]) )
      let params = opts.params;
      // We'll need to stringify if we've been given an object
      // If we have a string, this is skipped.
      if (params && typeof params === 'object')
          params = Object.keys(params).map(key =>  encodeURIComponent(key) + '=' + encodeURIComponent(params[key])).join('&');
      xhr.send(params);
    });
  };

}