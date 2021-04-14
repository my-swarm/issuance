import React, { ReactElement } from 'react';
import { TokenAction, TokenRecord, TokenState } from '@lib';
import { Button, Popconfirm, Tooltip } from 'antd';
import {
  DeleteOutlined,
  DollarCircleOutlined,
  FormOutlined,
  InfoCircleOutlined,
  LineChartOutlined,
  RocketOutlined,
  SlidersOutlined,
} from '@lib/icons';
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
      <Tooltip title="Edit undeployed token">
        <Button key="edit" onClick={() => onAction(TokenAction.Edit)} icon={<FormOutlined />} />
      </Tooltip>,
    );
  }
  if (localState === TokenState.Created || localState === TokenState.Deploying) {
    actions.push(
      <Tooltip title={localState === TokenState.Deploying ? 'Resume token deployment' : 'Deploy your token'}>
        <Button key="deploy" onClick={() => onAction(TokenAction.Deploy)} icon={<RocketOutlined />}>
          {localState === TokenState.Deploying ? 'Resume' : 'Deploy'}
        </Button>
      </Tooltip>,
    );
  }

  if (localState === TokenState.DeployingFundraiser) {
    actions.push(
      <Button key="startFundraise" onClick={() => onAction(TokenAction.StartFundraise)} icon={<RocketOutlined />}>
        Resume
      </Button>,
    );
  } else if (token.address && !token.isFundraising && !token.isMinted) {
    actions.push(
      <Button key="fundraiser" onClick={() => onAction(TokenAction.StartFundraise)} icon={<RocketOutlined />}>
        Fundraise
      </Button>,
    );
    actions.push(
      <Tooltip title="Stake and Mint">
        <Button key="stake" onClick={() => onAction(TokenAction.Mint)} icon={<DollarCircleOutlined />}>
          Mint
        </Button>
      </Tooltip>,
    );
  }

  if (token.isFundraising) {
    actions.push(
      <Tooltip title="Manage your fundraiser">
        <Button
          key="manageFundraise"
          onClick={() => onAction(TokenAction.ManageFundraise)}
          icon={<LineChartOutlined />}
        />
      </Tooltip>,
    );
  }

  if (token.isMinted) {
    actions.push(
      <Tooltip title="Manage your token">
        <Button key="manageToken" onClick={() => onAction(TokenAction.ManageToken)} icon={<SlidersOutlined />} />
      </Tooltip>,
    );
  }

  actions.push(
    <Tooltip title="Token information">
      <Button key="info" onClick={() => onAction(TokenAction.Info)} icon={<InfoCircleOutlined />} type="dashed" />
    </Tooltip>,
  );

  if (!token.address) {
    actions.push(
      <Popconfirm
        key="delete"
        title={`Are you sure you want to delete '${token.name}`}
        onConfirm={() => onAction(TokenAction.Delete)}
      >
        <Tooltip title="Delete undeployed token">
          <Button key="delete" icon={<DeleteOutlined />} type="dashed" danger ghost />
        </Tooltip>
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
