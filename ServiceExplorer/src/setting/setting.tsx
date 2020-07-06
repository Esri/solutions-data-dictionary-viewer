import {React, FormattedMessage, Immutable, DataSource, DataSourceSchema, FieldSchema, DataSourceManager} from 'jimu-core';
//import {React, FormattedMessage, DataSourceTypes, Immutable, ImmutableArray, IMUseDataSource, UseDataSource, IMDataSourceInfo, DataSource, DataSourceComponent, loadArcGISJSAPIModules} from 'jimu-core';
import {loadArcGISJSAPIModules} from 'jimu-arcgis';
import {BaseWidgetSetting, AllWidgetSettingProps} from 'jimu-for-builder';
import {DataSourceSelector, AllDataSourceTypes} from 'jimu-ui/advanced/data-source-selector';
import {ArcGISDataSourceTypes} from 'jimu-arcgis';
import {IMConfig} from '../config';
import defaultI18nMessages from './translations/default';

interface State{
  query: any;
  cacheStructure: any;
  cacheStatus: string;
  showCacheButton: boolean;
  datasource: DataSource;
  fields: { [jimuName: string]: FieldSchema };
  serviceURL: string;
  cacheFileName: string;
  allowUrlLookup:boolean
}

export default class Setting extends BaseWidgetSetting<AllWidgetSettingProps<IMConfig>, State>{
  supportedTypes = Immutable([ArcGISDataSourceTypes.FeatureLayer]);
  constructor(props) {
    super(props);
    this.state = {
      query: null,
      cacheStructure: {
        featureServer: {},
        layers: {},
        tables: {},
        queryDataElements: {},
        queryDomains: {},
        contingentValues : {},
        relationships : {},
        connectivityRules: {},
        metadata: {}
      },
      cacheStatus: "",
      showCacheButton: (this.props.config.useCache)?this.props.config.useCache:false,
      datasource: null,
      fields: {},
      serviceURL: "",
      cacheFileName: (this.props.config.cacheFileName)?this.props.config.cacheFileName:"",
      allowUrlLookup: (this.props.config.allowUrlLookup)?this.props.config.allowUrlLookup:false
    };
  }

  componentWillMount(){
    if(typeof this.props.config.url !== "undefined") {
      this.setState({serviceURL:this.props.config.url});
    }
  }

  componentDidMount(){}

  setDatasource = (ds: DataSource) => {
    let schema = ds && ds.getSchema();
    this.setState({datasource: ds, fields: (schema as DataSourceSchema).fields as {[jimuName: string]: FieldSchema; }});
  }

  onDsCreate = (ds: any) => {
    this.setDatasource(ds);
  };

  onDataSourceSelected = (allSelectedDss: any[]) => { 
    this.props.onSettingChange({
      id: this.props.id,
      useDataSources: allSelectedDss,
      config: this.props.config.set('url', "")
    });
    let ds = DataSourceManager.getInstance();    
    let dsList = ds.getDataSources(); 

    let sUrl = dsList[allSelectedDss[0].dataSourceId].url;
    sUrl = sUrl.substring(0,sUrl.lastIndexOf("/")); 

    this.props.onSettingChange({
      id: this.props.id,
      useDataSources: allSelectedDss,
      config: this.props.config.set('url', "")
    });    
    
    this.setState({serviceURL: sUrl});
  };


  onURLChange = (evt: React.FormEvent<HTMLInputElement>) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('url', evt.currentTarget.value)
    });
  }

  onCachePathChange = (evt: React.FormEvent<HTMLInputElement>) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('cachePath', evt.currentTarget.value)
    });
  }

  onAllowLookupChange = (evt: React.FormEvent<HTMLInputElement>) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('allowUrlLookup', evt.currentTarget.checked)
    });
    this.setState({allowUrlLookup: evt.currentTarget.checked});
  }

  onUseCacheChange = (evt: React.FormEvent<HTMLInputElement>) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('useCache', evt.currentTarget.checked)
    });
    this.setState({showCacheButton: evt.currentTarget.checked});
  }

  onCacheNameChange = (evt: React.FormEvent<HTMLInputElement>) => {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set('cacheFileName', evt.currentTarget.value)
    });
    this.setState({cacheFileName: evt.currentTarget.value});
  }

  /*
  onDataSourceSelect = (ds: any) => {
    console.log(ds);

    const useDataSources: UseDataSource[] = ds.map(d => ({
      dataSourceId: d.dataSourceJson && d.dataSourceJson.id,
      rootDataSourceId: d.rootDataSourceId
    }));

    this.props.onSettingChange({
      id: this.props.id,
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

  */

  render(){
    /*
        const { useDataSources, id } = this.props;
          <DataSourceSelector widgetId={id} isMultiple={true} selectedDataSourceIds={this.getDataSourceIds(useDataSources)}
            onSelect={this.onDataSourceSelect}
            types={this.supportedTypes}
             />
    */
    return <div className="widget-setting-demo">

      <DataSourceSelector
        mustUseDataSource
        types={Immutable([
          AllDataSourceTypes.FeatureLayer,
          AllDataSourceTypes.FeatureQuery
        ])}
        selectedDataSourceIds={
          this.props.useDataSources && Immutable(this.props.useDataSources.map(ds => ds.dataSourceId))
        }
        useDataSourcesEnabled={this.props.useDataSourcesEnabled}
        onChange={this.onDataSourceSelected}
         />


      <div style={{paddingBottom:10}}><FormattedMessage id="url" defaultMessage={defaultI18nMessages.url}/>: <input defaultValue={this.state.serviceURL} onChange={this.onURLChange} style={{width:"90%"}} value={this.state.serviceURL}/></div>
      <div style={{paddingBottom:10}}><FormattedMessage id="Use Cache" defaultMessage={defaultI18nMessages.useCache}/>: <input type="checkbox" checked={this.state.showCacheButton} onChange={this.onUseCacheChange} /></div>

      {(this.state.showCacheButton)?
        <div>
          <div style={{paddingBottom:10}}>Name of Cache: <input defaultValue={this.state.cacheFileName} onChange={this.onCacheNameChange} style={{width:"90%"}} value={this.state.cacheFileName}/></div>
          <div style={{paddingBottom:10}}>Build cache: <input defaultValue="Build Cache" onClick={this.checkCreatePortalItem} type="button"/></div>
          <div style={{paddingBottom:10}}>{this.state.cacheStatus}</div>
        </div>
        :''
      }
      <div style={{height:"25px"}}></div>
      <div style={{paddingBottom:10}}><FormattedMessage id="allowurlLookup" defaultMessage={defaultI18nMessages.urlLookup}/>: <input type="checkbox" checked={this.state.allowUrlLookup} onChange={this.onAllowLookupChange} /></div>

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
          query: "tags:" + this.state.cacheFileName + " Data Dictionary Support Files AND owner:"+this.props.user.username,
          num: 1
        };
        portal.queryItems(queryParams).then((response:any) => {
          if(response.results.length > 0) {
            this.requestServiceInfo(response.results[0].id);
            response.results[0].access = "public";
            this.props.onSettingChange({
              id: this.props.id,
              config: this.props.config.set('cacheId', response.results[0].id)
            });
          } else {
            this.httpRequest({method: 'POST', url:this.props.portalUrl + "/sharing/rest/content/users/"+this.props.user.username+"/addItem",
              params: {
                  f : "json",
                  token: this.props.token,
                  tags: this.state.cacheFileName + " Data Dictionary Support Files",
                  title: this.state.cacheFileName,
                  type: "Application",
              }
            })
            .then((result:any) => {
              console.log(result);
              //var data = {"org":true, "everyone":true};
              //portal.shareItem(data, result.id).then((res)  => {
                this.requestServiceInfo(result.id);
                this.props.onSettingChange({
                  id: this.props.id,
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
    let url = this.state.serviceURL;
    //grab feature Service json to store
    this.setState({cacheStatus: "Step 1 of 10: Saving Feature Service"});
    await this.fetchRequest(url+"/?f=pjson",{type:"featureServer"},itemId,"").then(async(response:any) => {
    
      //Grab all Domains
      this.setState({cacheStatus: "Step 2 of 10: Saving Domains"});
      let qDomainURL = url + "/queryDomains/?f=pjson";
      await this.fetchRequest(qDomainURL,{type:"queryDomains"},itemId,"");

      //Grab all CAVs
      this.setState({cacheStatus: "Step 3 of 10: Saving Contingent Attribute Values"});
      let qCAVURL = url + "/queryContingentValues/?f=pjson";
      await this.fetchRequest(qCAVURL,{type:"contingentValues"},itemId,"");

      this.setState({cacheStatus: "Step 4 of 10: Saving Diagram Templates"});
      let qDiagrams = url + "/NetworkDiagramServer/diagramDataset?f=pjson";
      await this.fetchRequest(qDiagrams,{type:"diagramTemplateInfos"},itemId,"");

      //Grab all Relationships
      let qRelUrl = url + "/relationships/?f=pjson";
      this.setState({cacheStatus: "Step 5 of 10: Saving Relationships"});
      await this.fetchRequest(qRelUrl,{type:"relationships"},itemId,"");

      //Grab all Data Elements
      this.setState({cacheStatus: "Step 6 of 10: Saving Data Elements"});
      let qDEUrl = url + "/queryDataElements/?f=pjson";
      await this.fetchRequest(qDEUrl,{type:"queryDataElements"},itemId,"").then(async(response:any) => {
        //do connectivity rules by layer and subtype
        if(response.hasOwnProperty("layerDataElements")) {
          let rulesTable = response.layerDataElements.filter((de:any) =>{
            return de.dataElement.aliasName === "Rules";
          });
          if(rulesTable.length > 0) {
            this.setState({cacheStatus: "Step 7 of 10: Saving Connectivity Rules"});
            await this.prepConnectivityRulesCache(response, url, rulesTable[0].dataElement.layerId ,itemId);
          }
        } else {
          this.setState({cacheStatus: "Step 7 of 10: Skipping Connectivity Rules"});
        }
      });

      //grab layers json to store
      this.setState({cacheStatus: "Step 8 of 10: Saving Layers and Metadata"});
      let domains = [];
      let promises = response.layers.map(async(lyr:any, i:number) => {
        let newURL = url + "/" + lyr.id+"/?f=pjson";
        let lyrData = await this.fetchRequestNoProcess(newURL,{type:"layers"},itemId,"");
        let currStruct = {...this.state.cacheStructure};
        if(currStruct["layers"].hasOwnProperty(lyr.id)) {
          currStruct["layers"][lyr.id] = lyrData;
        } else {
          currStruct["layers"][lyr.id] = {};
          currStruct["layers"][lyr.id] = lyrData;
        }

        if(!this.state.cacheStructure.queryDomains.hasOwnProperty("domains")) {
          lyrData.fields.map((fld:any) => {
            if(fld.domain !== null) {
              let foundDomain = domains.some((d:any) => {return d.name === fld.domain.name});
              if(!foundDomain) {
                domains.push(fld.domain);
              }
            }
          });
          currStruct["queryDomains"] = {"domains": domains};
        }

        let metadataUrl = url + "/" + lyr.id +"/metadata";
        let lyrMeta = await this.fetchRequestNoProcess(metadataUrl,{type:"metadata"},itemId,(lyr.id).toString());
        if((lyr.id).toString() !== "") {
          currStruct["metadata"][(lyr.id).toString()] = lyrMeta;
        } else {
          currStruct["metadata"] = lyrMeta;
        }         

        this.setState({cacheStructure: currStruct});         
      });
      await Promise.all(promises).then(async(result) => {
        console.log(this.state.cacheStructure);
        await this.updateCache(itemId);
        console.log("finished layer data");
      });

      //grab tables json to store
      this.setState({cacheStatus: "Step 9 of 10: Saving Tables and Metadata"});
      if(response.tables.length > 0) {
        let tableDatapromise = response.tables.map(async(tbl:any, i:number) => {
          let newURL = url + "/" + tbl.id+"/?f=pjson";
          let tblData = await this.fetchRequestNoProcess(newURL,{type:"tables"},itemId,"");
          let currStruct = {...this.state.cacheStructure};
          if(currStruct["tables"].hasOwnProperty(tbl.id)) {
            currStruct["tables"][tbl.id] = tblData;
          } else {
            currStruct["tables"][tbl.id] = {};
            currStruct["tables"][tbl.id] = tblData;
          }
          let metadataUrl = url + "/" + tbl.id +"/metadata";
          let tblMeta = await this.fetchRequestNoProcess(metadataUrl,{type:"metadata"},itemId,(tbl.id).toString());
          if(currStruct["metadata"].hasOwnProperty(tbl.id)) {
            currStruct["metadata"][tbl.id] = tblMeta;
          } else {
            currStruct["metadata"][tbl.id] = {};
            currStruct["metadata"][tbl.id] = tblMeta;          
          }
          this.setState({cacheStructure: currStruct}); 
        });
        await Promise.all(tableDatapromise).then(async() => {
          await this.updateCache(itemId);
          this.setState({cacheStatus: "Step 10 of 10: Finished"});
        });
      } else {
        this.setState({cacheStatus: "Step 10 of 10: Finished"});
      }

    });

  }


  fetchRequest = (url:string, params:any, itemId:any, subCat:string) => {
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

  fetchRequestNoProcess = (url:string, params:any, itemId:any, subCat:string) => {
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
        resolve(data);
      });
    });
  }  

  updateCache = async (itemId:any) => {
    return new Promise((resolve, reject) => {
      let url = this.props.portalUrl + "/sharing/rest/content/users/"+this.props.user.username+"/items/"+itemId + "/update";
      this.httpRequest({method: 'POST', url:url,
        params: {
          f : "json",
          token: this.props.token,
          tags: this.state.cacheFileName + " Data Dictionary Support Files",
          overwrite: true,
          text: JSON.stringify(this.state.cacheStructure),
          access: "public"
        }
      })
      .then((result:any) => {
        resolve(result);
      });
    });
  }

  processCache = async (data: any, type: any, itemId:any, subCat:string) => {
    return new Promise((resolve, reject) => {
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
            tags: this.state.cacheFileName + " Data Dictionary Support Files",
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
  }

  prepConnectivityRulesCache = (de:any, url:string, rulesLayer:number, itemId:any) => {
    return new Promise(async(resolve, reject) => {
      let layers = de.layerDataElements;
      let whereClause = "";
      let crPromise = layers.map((lyr:any) => {
        let de = lyr.dataElement;
        let sourceId = this.getSourceId(layers, de);
        if(sourceId !== -1) {
          if(de.hasOwnProperty("subtypes")) {
            let currStruct = {...this.state.cacheStructure};
            de.subtypes.map(async(st:any) => {
              whereClause = "(fromassetgroup=" + st.subtypeCode + " and fromnetworksourceid=" + sourceId + ") OR (toassetgroup=" + st.subtypeCode + " and tonetworksourceid=" + sourceId + ")";
              let qCRurl = url + "/" + rulesLayer + "/query?where="+whereClause+"&f=pjson";
              let data = await this.fetchRequestNoProcess(qCRurl,{type:"connectivityRules"},itemId,sourceId.toString());
              if(sourceId.toString() !== "") {
                if(currStruct["connectivityRules"].hasOwnProperty(sourceId.toString())) {
                  currStruct["connectivityRules"][sourceId.toString()].push(data);
                } else {
                  currStruct["connectivityRules"][sourceId.toString()] = [];
                  currStruct["connectivityRules"][sourceId.toString()].push(data);
                }
              } else {
                currStruct["connectivityRules"].push(data);
              }
            });
            this.setState({cacheStructure: currStruct}); 
          }
        }
      });
      await Promise.all(crPromise).then(async() => {
        await this.updateCache(itemId);
        resolve(true);
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