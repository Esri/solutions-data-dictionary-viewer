
data-dictionary-viewer

An application that allows viewing and searching of details of a feature Service in an user friendly way.

## Features
* Tree view of your feature service
* Search for finding things in a service
* Cards of each aspect of the service

## Instructions
1. Make sure you have ArcGIS Experience Builder (ExB) Developer Edition installed on your machine.

2. Fork and then clone the repo. Copy the folder "ServiceExplorer" into the your ```<ExB install location>\client\your-extensions\widgets```

3. Start up ExB.  Start file watcher.

4. Launch ExB in the browser.  Create a new app.  In the "Home" page in the left panel, click the "Insert" button.

5. Add the Service Explorer widget.

6. On the configuration panel (right side). Provide the URL to your feature service (Utility Network for now). Optionally, if you want to be able to load other services via a url parameter check the box labeled "allowurlLookup".

7. On the "General" tab of the configuration panel, define the height and width as 100%.

8. Save the application and "Preview" or "Publish".

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