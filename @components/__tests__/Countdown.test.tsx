import React from 'react';
import { shallow } from 'enzyme';
import moment from 'moment';
import { Countdown } from '../utility/Countdown';

export default describe('FundraiserCountdown', () => {
  it('it renders days, hours, minutes and seconds', () => {
    const to = moment().add({ days: 6, hours: 7, minutes: 8, seconds: 9 });
    const component = shallow(<Countdown to={to} />);
    expect(component.find('.c-countdown-days')).toEqual('my ass');
  });
});
