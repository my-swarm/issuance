import local from './local.json';
import kovan from './kovan.json';
import mainnet from './mainnet.json';
import mumbai from './mumbai.json';

export const addresses = {
  local,
  31337: local,
  kovan,
  42: kovan,
  mainnet,
  1: mainnet,
  mumbai,
  80001: mumbai,
};
