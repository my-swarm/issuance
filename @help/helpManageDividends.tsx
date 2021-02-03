import React from 'react';

export const manageDividends = {
  title: 'Dividend distribution',
  content: (
    <div>
      <p>Allows you to distribute Ether or any ERC20 compatible token to a list of receivers.</p>
      <p>
        Common use case is to distribute a reward (dividend) to all your investors in a ratio equal to their SRC20 token
        share. The reward itself can be anything as long as it&apos;s ETH or a ERC20 token.
      </p>
      <p>
        Note: this does not serve as a way to distribute your own SRC20 token. Use the <strong>Distribute token</strong>{' '}
        interface for that.
      </p>
    </div>
  ),
};
