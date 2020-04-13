import { shallow } from 'enzyme';
import React from "react";
import Profile from '../js/components/Profile';

describe('Profile', () => {
  it('Profile render without crashing', () => {
    const info = {
        "name": "Test",
        "email": "abc@email.com"
    };
    const wrapper = shallow(<Profile info={{info}}/>);
    expect(wrapper.find('#profileDiaglog').exists()).toBe(true);
  });
});

