# solutions-data-dictionary-viewer

Data Dictionary Viewer reads your feature service and presents it in a layout which allows you to navigate, search, and interact with it.

Here are the steps to get this application running.
INSTALLATION

1) install node modules.
* You are clone or downloaded this, open a command prompt and type "npm install"

2) install Yarn (to install and keep modules in sync)
* https://yarnpkg.com/en/

3) Yarn React modules (react and react-dom are standard). React-Redux is for global state storage and messaging
 and BluePrint(UI component) Modules, in command prompt, type:
* yarn add @blueprintjs/core react react-dom react-redux

4) (Only for new app creation, not needed in this case) if you starting blank you would have to call react-create-app to make a file structure for the app.
This repo already did this.  But for reference, I used a react create esri app, that module is here.  It's great because it's an app with esri dojo bindings already
* https://www.npmjs.com/package/create-esri-react-app

5) Optional, if you installed an updated BluePrint, copy the "@blueprintjs" folder instead "node_modules" folder into the "src" folder.  This is so the code doesn't have to look for these inside the node modules folder.

6) At the root of application, open a command prompt here, and type "npm start". This should open a web browser and load the page.


USAGE

The application loads a default feature service.  You can load your own by adding a url parameter.
at the end of the url, type:
* ?lookup=url to your feature service