import React, { ReactElement } from 'react';
import { TokenAction } from '@types';
import { useAppState } from '@app';

interface TokenActionTitleProps {
  action: TokenAction;
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
  [TokenAction.Info]: 'Token information',
};

export function TokenActionTitle({ action }: TokenActionTitleProps): ReactElement {
  const [{ token }] = useAppState();

  const tokenName = token ? (
    <strong>
      {token.name} ({token.symbol})
    </strong>
  ) : null;
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
