import React from 'react';

export const supplyOrPrice = {
  title: 'Token Supply or Token Price',
  content: (
    <div>
      <p>One depends on another. Depending on your your financial model, you might wanna chose to</p>
      <ul>
        <li>Set a fixed token price with a variable initial supply</li>
        <li>Set a fixed token supply with a variable initial price</li>
      </ul>
    </div>
  ),
};

export const contributionsLocked = {
  title: 'Contributions are locked',
  content: (
    <div>
      <p>When contributions are locked, investors cannot withdraw their funds while the fundraiser is live</p>
      <p>note: in case the fundraiser is canceled, the lock doesn’t apply and anyone can withdraw</p>
    </div>
  ),
};

export const contributorRestrictions = {
  title: 'Contributor restrictions',
  content: (
    <div>
      <p>
        Limit the number of contributors or the amount a single investor can contribute (you can specify a minimum,
        maximum or both). The limits are inclusive (minimum 20 USD means 20 USD or more)
      </p>
      <p>Leave empty or put zero for no limit</p>
    </div>
  ),
};
