import React from 'react';
import { Token, TokenState, TokenAction, Uuid } from '@types';
import { Button, Popconfirm, Space } from 'antd';
import { EditOutlined, DeleteOutlined, RocketOutlined, FundOutlined, DollarCircleOutlined } from '@ant-design/icons';

interface TokenActionsProps {
  token: Token;
  onAction: (action: TokenAction) => void;
}

// const stateToAction = {
//   [TokenState.Created]: [TokenAction.Edit, TokenAction
// }

export function TokenActions({ token, onAction }: TokenActionsProps): React.ReactElement {
  const actions = [];

  if (token.state === TokenState.Created) {
    actions.push(
      <Button key="edit" size="small" onClick={() => onAction(TokenAction.Edit)} icon={<EditOutlined />}>
        Edit
      </Button>,
    );
  }
  if (token.state === TokenState.Created || token.state === TokenState.Deploying) {
    actions.push(
      <Button key="deploy" size="small" onClick={() => onAction(TokenAction.Deploy)} icon={<RocketOutlined />}>
        {token.state === TokenState.Deploying ? 'Resume Deploy' : 'Deploy'}
      </Button>,
    );
  }

  if (token.state === TokenState.Deployed) {
    actions.push(
      <Button
        key="fundraiser"
        size="small"
        onClick={() => onAction(TokenAction.StartFundraise)}
        icon={<FundOutlined />}
      >
        Start fundraiser
      </Button>,
    );

    actions.push(
      <Button
        key="stake"
        size="small"
        onClick={() => onAction(TokenAction.StakeAndMint)}
        icon={<DollarCircleOutlined />}
      >
        Stake &amp; Mint
      </Button>,
    );
  }

  if (token.state === TokenState.Fundraising) {
    actions.push(
      <Button
        key="manageFundraise"
        size="small"
        onClick={() => onAction(TokenAction.ManageFundraise)}
        icon={<EditOutlined />}
      >
        Manage fundraiser
      </Button>,
    );
  }

  if (token.state === TokenState.Minted) {
    actions.push(
      <Button key="manageToken" size="small" onClick={() => onAction(TokenAction.ManageToken)} icon={<EditOutlined />}>
        Manage token
      </Button>,
    );
  }

  actions.push(
    <Popconfirm
      key="delete"
      title={`Are you sure you want to delete '${token.name}`}
      onConfirm={() => onAction(TokenAction.Delete)}
    >
      <Button key="delete" size="small" icon={<DeleteOutlined />}>
        Delete
      </Button>
    </Popconfirm>,
  );

  return <Space size="small">{actions}</Space>;
}
