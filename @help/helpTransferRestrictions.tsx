import React from 'react';

export const transferRestrictions = {
  title: 'Tranfer restrictions',
  content: (
    <div>
      <ul>
        <li>
          <strong>No transferrestrictions</strong> - Tokens can be freely transfered between any ERC20 addresses
        </li>
        <li>
          <strong>Whitelist</strong> - Tokens can be transfered between whitelisted addresses
        </li>
        <li>
          <strong>Greylist</strong> - Each token transaction has to be explicitly confirmed by the token owner.
        </li>
      </ul>
    </div>
  ),
};

export const trNone = {
  title: 'No transfer restrictions',
  content: (
    <div>
      <p>Tokens can be freely transfered between any ERC20 addresses</p>
    </div>
  ),
};
export const trWhitelist = {
  title: 'Whitelist',
  content: (
    <div>
      <p>List which has a white color</p>
      <p>Tokens can be transfered between whitelisted addresses</p>
    </div>
  ),
};
export const trGreylist = {
  title: 'Greylist',
  content: (
    <div>
      <p>List which has a gray color</p>
      <p>Each token transaction has to be explicitly confirmed by the token owner.</p>
    </div>
  ),
};
