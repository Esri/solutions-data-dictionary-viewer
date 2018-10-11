
data-dictionary-viewer

An application that allows viewing and searching of details of a feature Service in an user friendly way.

## Features
* Tree view of your feature service
* Search for finding things in a service
* A map to interactively filter
* a table to show details

## Instructions

1. Fork and then clone the repo.
2. install node modules.
* You are clone or downloaded this, open a command prompt and type "npm install"

3. install Yarn (to install and keep modules in sync)
* https://yarnpkg.com/en/

4. Yarn React modules (react and react-dom are standard). React-Redux is for global state storage and messaging
 and BluePrint(UI component) Modules, in command prompt, type:
* yarn add @blueprintjs/core react react-dom react-redux

5. (Only for new app creation, not needed in this case) if you starting blank you would have to call react-create-app to make a file structure for the app.
This repo already did this.  But for reference, I used a react create esri app, that module is here.  It's great because it's an app with esri dojo bindings already
* https://www.npmjs.com/package/create-esri-react-app

6. Optional, if you installed an updated BluePrint, copy the "@blueprintjs" folder instead "node_modules" folder into the "src" folder.  This is so the code doesn't have to look for these inside the node modules folder.

7. At the root of application, open a command prompt here, and type "npm start". This should open a web browser and load the page.

## Requirements

* Install Node JS
* Install React, React-dom, React-redux, BluePrint, esri-react-app
* Web browser with access to the Internet

## Resources

## Usage

The application loads a default feature service.  You can load your own by adding a url parameter.
at the end of the url, type:
* ?lookup=url to your feature service

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