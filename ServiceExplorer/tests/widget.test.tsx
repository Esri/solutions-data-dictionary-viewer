import * as React from 'react';
import { shallow, configure, ShallowWrapper, mount } from 'enzyme';

import _Widget from '../src/runtime/widget';
import {wrapWidget} from 'jimu-for-test';

// setup file
import * as Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('demo widget', function() {
  it('with config', function() {
    const config = {
      p1: 'p1',
      p2: 'p2'
    };
    let Widget = wrapWidget(_Widget, {
      config: config,
      manifest: {name: 'demo'} as any,
      messages: {},
    });
    let wrapper = shallow(<Widget/>).shallow();
    expect(wrapper.find('.widget-demo').length).toEqual(1);
  }); 
  
  it('without config', function() {
    let Widget = wrapWidget(_Widget, {
      manifest: {name: 'demo'} as any,
      messages: {},
    });
    let wrapper = shallow(<Widget/>).shallow();
    expect(wrapper.find('.widget-demo').length).toEqual(1);
  });
});