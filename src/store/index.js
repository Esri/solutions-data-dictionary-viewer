import React from 'react';
import { createStore, combineReducers } from 'redux';
import reducers from '../reducers/reducers';

export const store = createStore(
  combineReducers({
    state: reducers
  }),
  //just for borwser extension, optional
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);