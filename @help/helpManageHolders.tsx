import React from 'react';

export const manageHolders = {
  title: 'Token Holders',
  content: (
    <div>
      <p>Gives you access to all accounts that hold the token and the ability to do actions on individual accounts.</p>
      <p>Depending on the token setup, you can:</p>
      <ul>
        <li>
          <strong>Transfer</strong> - force transfer of tokens between any two accounts
        </li>
        <li>
          <strong>Freeze/Unfreeze</strong> - disable all transactions for an account
        </li>
        <li>
          <strong>Burn</strong> - permanently delete (&ldquo;burn&rdquo;) any number of tokens from an account
        </li>
      </ul>
    </div>
  ),
};
