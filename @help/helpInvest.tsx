import React from 'react';

export const gettingBaseCurrency = {
  title: 'Getting the currency for contributions',
  content: (
    <div>
      <p>
        Investments are done with a stable coin pegged to US dollar. Depending on what crypto assets you own, we
        recommend the following services to get the currency to invest.
      </p>
      <ul>
        <li>
          If you own Ether, other stablecoins or ERC20 tokens with good liquidity, use Balancer, Uniswap or similar
        </li>
        <li>
          If you own Bitcoin, other cryptocurrency or don&apos;t own any crypto at all, use some of the centralized
          exchanges like Binance
        </li>
      </ul>
    </div>
  ),
};

export const search = {
  title: 'Filtering the fundraisers',
  content: (
    <div>
      <p>The following fields are searched:</p>
      <ul>
        <li>Token name and symbol</li>
        <li>Fundraiser label</li>
        <li>Token and fundraiser addresses</li>
      </ul>
      <p>
        <strong>Note that due to system constraints, search is case sensitive (i.e. 'dog' is not 'Dog')</strong>
      </p>
    </div>
  ),
};
