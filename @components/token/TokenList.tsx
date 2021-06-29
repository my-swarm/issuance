import React, { ReactElement, useEffect, useState } from 'react';
import { Drawer, Table } from 'antd';
import {
  TokenActions,
  TokenActionTitle,
  TokenDeploy,
  TokenForm,
  TokenInfo,
  TokenManage,
  TokenManageFundraiser,
  TokenMint,
  TokenStartFundraiser,
} from '@components';
import {
  BaseError,
  LocalToken,
  LocalTokenState,
  localTokenStates,
  processNewToken,
  TokenAction,
  TokenRecord,
} from '@lib';
import { renderAddress, tableColumns } from '../manage/listUtils';
import { useAppState, useDispatch, useEthers } from '@app';

interface Props {
  tokens: TokenRecord[];
  isPublic?: boolean;
  outsideAction?: TokenAction;
  onClearAction?: () => void;
}

export function TokenList({ tokens, isPublic = false, outsideAction, onClearAction }: Props): ReactElement {
  const { connected, networkId } = useEthers();
  const [{ localToken }, dispatch] = useAppState();
  const { setToken } = useDispatch();

  const [action, setAction] = useState<TokenAction>();

  useEffect(() => {
    setAction(outsideAction);
    if (outsideAction === TokenAction.Create) {
      setToken(undefined, undefined);
    }
  }, [outsideAction]);

  function renderTokenState(localState: LocalTokenState, token: TokenRecord): string {
    // if (!connected) return 'Not connected';
    const result = [];
    if (token.address) result.push('Deployed');
    if (token.isFundraising) result.push('Fundraiser');
    if (token.isMinted) result.push('Minted');
    if (result.length === 0) result.push(localTokenStates[localState] || 'Created');
    return result.join(', ');
  }

  const handleAction = (action: TokenAction, tokenRecord: TokenRecord) => {
    if (action === TokenAction.Delete) {
      handleDelete(tokenRecord);
    } else {
      setToken(tokenRecord.localToken, tokenRecord.onlineToken);
      setAction(action);
    }
  };

  const handleSubmit = (newToken: LocalToken) => {
    switch (action) {
      case TokenAction.Create:
        dispatch({ type: 'addToken', token: processNewToken(newToken), networkId });
        break;
      case TokenAction.Edit:
        dispatch({ type: 'updateToken', token: { id: localToken.id, ...newToken } });
        break;
      default:
        throw new BaseError('Cannot submit when not editing');
    }
    handleClearAction();
  };

  const handleDelete = (token) => {
    dispatch({ type: 'deleteToken', id: token.id });
  };

  const handleClearAction = () => {
    // reseting this fucks up any component that's still active before closing the drawer and needs the token state
    // setToken(undefined, undefined);
    setAction(undefined);
    if (onClearAction) onClearAction();
  };

  const handleSwitchActionAnimated = (action: TokenAction) => {
    setAction(undefined);
    window.setTimeout(() => setAction(action), 200);
  };

  const columns = tableColumns<TokenRecord>([
    {
      title: 'Token',
      key: 'name',
      render: (name, token) => `${name} (${token.symbol})`,
    },
    {
      title: 'Status',
      key: 'localState',
      render: renderTokenState,
    },
    {
      title: 'Address',
      key: 'address',
      render: renderAddress,
    },
    {
      title: 'Action',
      key: 'action',
      render: (value: any, token: TokenRecord) => (
        <TokenActions isPublic={isPublic} token={token} onAction={(action) => handleAction(action, token)} />
      ),
    },
  ]);

  function renderAction() {
    if (action === TokenAction.Create || action === TokenAction.Edit)
      return <TokenForm onSubmit={handleSubmit} onCancel={handleClearAction} formData={localToken} />;
    if (action === TokenAction.Deploy)
      return <TokenDeploy onCancel={handleClearAction} onReview={() => handleSwitchActionAnimated(TokenAction.Edit)} />;
    if (action === TokenAction.StartFundraise) return <TokenStartFundraiser onClose={handleClearAction} />;
    if (action === TokenAction.ManageToken) return <TokenManage />;
    if (action === TokenAction.ManageFundraise) return <TokenManageFundraiser />;
    if (action === TokenAction.Mint) return <TokenMint onCancel={handleClearAction} />;
    if (action === TokenAction.Info) return <TokenInfo />;
  }

  return (
    <>
      <Table columns={columns} dataSource={tokens} rowKey="id" />
      <Drawer
        title={<TokenActionTitle action={action} />}
        visible={action !== undefined}
        width="50%"
        closable={true}
        onClose={() => handleClearAction()}
      >
        {renderAction()}
      </Drawer>
    </>
  );
}
