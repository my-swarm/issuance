import React, { ReactElement } from 'react';
import { TokenAction, TokenRecord, LocalTokenState } from '@lib';
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
  isPublic: boolean;
  onAction: (action: TokenAction) => void;
}

export function TokenActions({ token, isPublic, onAction }: TokenActionsProps): React.ReactElement {
  const actions: ReactElement[] = [];
  const { connected } = useEthers();

  const ActionInfo = (
    <Tooltip title="Token information">
      <Button key="info" onClick={() => onAction(TokenAction.Info)} icon={<InfoCircleOutlined />} type="dashed" />
    </Tooltip>
  );

  if (!connected) {
    return ActionInfo;
  }

  const { localState } = token;

  if (!isPublic && localState === LocalTokenState.Created) {
    actions.push(
      <Tooltip title="Edit undeployed token">
        <Button key="edit" onClick={() => onAction(TokenAction.Edit)} icon={<FormOutlined />} />
      </Tooltip>,
    );
  }
  if (!isPublic && localState === LocalTokenState.Created) {
    actions.push(
      <Tooltip title="Deploy your token">
        <Button key="deploy" onClick={() => onAction(TokenAction.Deploy)} icon={<RocketOutlined />}>
          Deploy
        </Button>
      </Tooltip>,
    );
  }

  if (!isPublic && token.address && !token.isFundraising && !token.isMinted) {
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

  if (!isPublic && token.isFundraising) {
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

  if (!isPublic && token.isMinted) {
    actions.push(
      <Tooltip title="Manage your token">
        <Button key="manageToken" onClick={() => onAction(TokenAction.ManageToken)} icon={<SlidersOutlined />} />
      </Tooltip>,
    );
  }

  actions.push(ActionInfo);

  if (!isPublic && !token.address) {
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
