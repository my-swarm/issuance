import React, { ReactElement } from 'react';
import { TokenState, TokenAction, TokenRecord } from '@lib';
import { Button, Popconfirm } from 'antd';
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
  token: TokenRecord;
  onAction: (action: TokenAction) => void;
}

export function TokenActions({ token, onAction }: TokenActionsProps): React.ReactElement {
  const actions: ReactElement[] = [];
  const { connected } = useEthers();

  if (!connected) {
    return <div>Not connected</div>;
  }

  const { localState } = token;

  if (localState === TokenState.Created) {
    actions.push(
      <Button key="edit" size="small" onClick={() => onAction(TokenAction.Edit)} icon={<EditOutlined />}>
        Edit
      </Button>,
    );
  }
  if (localState === TokenState.Created || localState === TokenState.Deploying) {
    actions.push(
      <Button key="deploy" size="small" onClick={() => onAction(TokenAction.Deploy)} icon={<RocketOutlined />}>
        {localState === TokenState.Deploying ? 'Resume Deploy' : 'Deploy'}
      </Button>,
    );
  }

  if (localState === TokenState.DeployingFundraiser) {
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
  } else if (token.isDeployed && !token.isFundraising && !token.isMinted) {
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

  if (token.isFundraising) {
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

  if (token.isMinted) {
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

  if (!token.isDeployed) {
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
  }

  return (
    <>
      {actions.map((action, key) => (
        <span className="mr-1 lh-2" key={key}>
          {action}
        </span>
      ))}
    </>
  );
}
