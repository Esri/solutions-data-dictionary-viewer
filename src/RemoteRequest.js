import esriLoader from 'esri-loader';

export let FSurl = 'https://arcgisutilitysolutionsdemo.esri.com/server/rest/services/Water_Distribution_Utility_Network/FeatureServer';

export const requestHelper = {

  url: FSurl,
  param: {
    query: {
      f: 'json'
    },
    responseType: 'json'
  },

  request: () => {
    return new Promise((resolve, reject) => {
      esriLoader.loadModules([
        'esri/request'
      ], {
        url: 'https://js.arcgis.com/4.9'
      })
      .then(([esriRequest]) => {
        esriRequest(requestHelper.url, requestHelper.param).then((response) => {
          console.log(response.data);
          resolve(response.data);
        });

      })
      .catch(err => {
        console.error(err);
        reject(err);
      });

    })
  },

  parseURL: () => {
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m,key,value) => {
      if(key === "lookup") {
        FSurl = value;
        requestHelper.url = value;
      }
    });
  }

}

