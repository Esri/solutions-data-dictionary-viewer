
## Data Dictionary Viewer

An application that allows viewing and searching of details of a feature Service in an user friendly way.

## Features
* Tree view of your feature service
* Search for finding things in a service
* Cards of each aspect of the service

## Installation
1. Make sure you have ArcGIS Experience Builder (ExB) Developer Edition installed on your machine.

2. Fork and then clone the repo. Copy the folder "ServiceExplorer" into the your ```<ExB install location>\client\your-extensions\widgets```

3. In a command prompt, navigate to ```<drive letter>:\<ExB install location>\client\your-extensions\server```. Type ```npm ci```. After it completes, type ```npm start```

4. Open a second command prompt, navigate to ```<drive letter>:\<ExB install location>\client\your-extensions\client```. Type ```npm ci```. After it completes, type ```npm start```.  Make sure you see the widget copied over in the command window.

5. Launch ExB in the browser (usually http://localhost:3000/).  Create a new app (full screen blank preferred).

6. On the left hand panel in th widget list, scroll down and locate the ```Service Explorer``` widget and add it to the canvas.

7. On the configuration panel (right side), click the ```Select Data``` button. Add a new data source from the slide out panel.

8. Look up and add data by URL and paste in your feature service rest endpoint (Utility Network Service only currently). Select any one of your layers as the control.  You should see the URL textbox filled out with the path.

At this point you have 2 paths to choose.

9. If you want to run the Data Dictionary hitting your live service, then you are finished with the configuration. Proceed to step 10.
If you want to run the Data Dictionary hitting a cache of your service (so it is not dependent on it being live and running), follow these additional steps:
   - Check the ```Use cache instead of service``` checkbox
   - Give your cache a name
   - Press the ```Build Cache```
   - This will create an item in your organization (currently org which you signed into Experience Builder). Once the cache is built, access the item in your org and share it publicly.

Optionally, if you want to be able to load other services via a url parameter check the box labeled "allowurlLookup".

10. On the "General" tab of the configuration panel, define the height and width as 100%.

11. Save the application and "Preview" or "Publish".

12. Since this is a custom widget you will need to deploy the application to a web server if you want to share it with your company. To do so, click the 3 ellipses next to the publish button. In the menu, click the ```Download``` button.

13. Extract the download zip into your web server and use a web browser to access it.

## Requirements

* Install Node JS
* Install ArcGIS Experience Builder
* Web browser with access to the Internet

## Resources

## Usage

The application loads a default feature service defined in the configuration.  You can load your own by adding a url parameter if allowed in the configuration.
at the end of the url, type:
* ?lookup=url to your feature service

If you want a specific card to load on startup, add it as a url parameter with this pattern ```<name of card>:<type of card>,<name of card>:<type of card>, etc```
* ?startup=Water Device:Layer

## Issues

Find a bug or want to request a new feature?  Please let us know by submitting an issue.

## Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/esri/contributing).

## Licensing
Copyright 2016 Esri

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

A copy of the license is available in the repository's [license.txt](https://github.com/ArcGIS/solutions-data-dictionary-viewer/edit/master/License.txt) file.
