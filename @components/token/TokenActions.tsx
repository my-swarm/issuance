import React from 'react';
import { Token, TokenState, TokenAction, Uuid } from '@types';
import { Button, Popconfirm, Space } from 'antd';
import {
  EditOutlined,
  InfoCircleOutlined,
  DeleteOutlined,
  RocketOutlined,
  FundOutlined,
  DollarCircleOutlined,
} from '@ant-design/icons';
import { useEthers } from '@app';

interface TokenActionsProps {
  token: Token;
  onAction: (action: TokenAction) => void;
}

// const stateToAction = {
//   [TokenState.Created]: [TokenAction.Edit, TokenAction
// }

export function TokenActions({ token, onAction }: TokenActionsProps): React.ReactElement {
  const actions = [];
  const { connected, networkId } = useEthers();

  if (!connected) {
    return <div>Not connected</div>;
  }

  const state = (token.networks && token.networks[networkId]?.state) || TokenState.Created;

  if (state === TokenState.Created) {
    actions.push(
      <Button key="edit" size="small" onClick={() => onAction(TokenAction.Edit)} icon={<EditOutlined />}>
        Edit
      </Button>,
    );
  }
  if (state === TokenState.Created || state === TokenState.Deploying) {
    actions.push(
      <Button key="deploy" size="small" onClick={() => onAction(TokenAction.Deploy)} icon={<RocketOutlined />}>
        {state === TokenState.Deploying ? 'Resume Deploy' : 'Deploy'}
      </Button>,
    );
  }

  if (state === TokenState.Deployed) {
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

  if (state === TokenState.Fundraising) {
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

  if (state === TokenState.DeployingFundraiser) {
    actions.push(
      <Button
        key="startFundraise"
        size="small"
        onClick={() => onAction(TokenAction.StartFundraise)}
        icon={<EditOutlined />}
      >
        Resume fundraiser deploy
      </Button>,
    );
  }

  if (state === TokenState.Deployed || state === TokenState.Minted) {
    actions.push(
      <Button key="manageToken" size="small" onClick={() => onAction(TokenAction.ManageToken)} icon={<EditOutlined />}>
        Manage token
      </Button>,
    );
  }

  actions.push(
    <Button key="info" size="small" onClick={() => onAction(TokenAction.Info)} icon={<InfoCircleOutlined />}>
      Info
    </Button>,
  );

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
