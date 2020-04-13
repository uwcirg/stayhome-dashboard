import { shallow } from 'enzyme';
import React from "react";
import CarePlan from '../js/components/CarePlan';

describe('Care plan', () => {
  it('Care plan render without crashing', () => {
    const wrapper = shallow(<CarePlan />);
    expect(wrapper.find('.careplan-container').exists()).toBe(true);
  });
});

