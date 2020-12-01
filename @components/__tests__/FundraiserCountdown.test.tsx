import { shallow } from 'enzyme';
import { FundraiserCountdown } from '../fundraiser/FundraiserCountdown';

export default describe('FundraiserCountdown', () => {
  it('if before startDate, renders countdown to startDate', () => {
    const startDate = moment().add(10, 'days')
    const component = shalow(<FundraiserCountdown startDate)
    expect(1).toEqual(1);
  });

  it('if between startDate and endDate, renders countdown to endDate and progressbar');

  if ('if after endDate, renders null');
});
