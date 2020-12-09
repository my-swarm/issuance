import React, { ReactElement } from 'react';
import { TokenAction } from '@lib';
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
  [TokenAction.Info]: 'Details about',
};

export function TokenActionTitle({ action }: TokenActionTitleProps): ReactElement {
  const [{ localToken, onlineToken }] = useAppState();

  const tokenName = onlineToken?.name || localToken?.name || '';
  const actionTitle = tokenActionTitle[action];

  if (action === TokenAction.Create) {
    return <>Create new token</>;
  } else if (actionTitle) {
    return (
      <>
        {actionTitle} <strong>{tokenName}</strong>
      </>
    );
  } else {
    return null;
  }
}
