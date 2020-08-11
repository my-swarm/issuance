import React, { ReactElement } from 'react';
import { Token, TokenAction } from '../../@types';

interface TokenActionTitleProps {
  action: TokenAction;
  token?: Token;
}

const tokenActionTitle = {
  [TokenAction.Create]: 'Create',
  [TokenAction.Edit]: 'Edit',
  [TokenAction.Delete]: 'Delete',
  [TokenAction.Deploy]: 'Deploy',
  [TokenAction.StakeAndMint]: 'Stake and mint',
  [TokenAction.StartFundraise]: 'Start fundraiser for',
  [TokenAction.ManageToken]: 'Manage',
  [TokenAction.ManageFundraise]: 'Manage fundraiser for',
};

export function TokenActionTitle({ action, token }: TokenActionTitleProps): ReactElement {
  const tokenName = token ? <strong>{token.name}</strong> : null;
  const actionTitle = tokenActionTitle[action];

  if (action === TokenAction.Create) {
    return <>Create new token</>;
  } else if (actionTitle) {
    return (
      <>
        {actionTitle} {tokenName}
      </>
    );
  } else {
    return null;
  }
}
