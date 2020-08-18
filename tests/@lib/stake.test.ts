import { getStakeFromNav } from '@lib/stake';

test('computes stake from nav and stake table', () => {
  expect(getStakeFromNav(1000)).toBe(2500);
  expect(getStakeFromNav(900000)).toBe(900000 * 0.005);
  expect(getStakeFromNav(1000000)).toBe(1000000 * 0.005); // it's includeing the upper limit
  expect(getStakeFromNav(10000000)).toBe(10000000 * 0.004); // it's includeing the upper limit
  expect(getStakeFromNav(20000000)).toBe(20000000 * 0.0025); // it's includeing the upper limit
  expect(getStakeFromNav(60000000)).toBe(60000000 * 0.002); // it's includeing the upper limit
  expect(getStakeFromNav(120000000)).toBe(120000000 * 0.0015); // it's includeing the upper limit
  expect(getStakeFromNav(200000000)).toBe(200000000 * 0.001); // it's includeing the upper limit
});
