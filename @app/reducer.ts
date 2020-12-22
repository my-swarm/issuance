import { Reducer } from 'react';
import { v4 as uuid } from 'uuid';
import _ from 'lodash';

import { LocalToken, Uuid } from '@lib';
import { Action, AppState } from '.';

export const reducer: Reducer<any, any> = (state: AppState, action: Action) => {
  function findToken(id: Uuid) {
    const token = state.tokens.find((t) => t.id === id);
    if (!token) {
      throw new Error(`Token not found: ${id}`);
    }
    return { ...token };
  }

  function withUpdatedToken(updatedToken: LocalToken) {
    return state.tokens.map((token) => (token.id === updatedToken.id ? updatedToken : token));
  }

  function unsynced(stateUpdate) {
    return {
      ...state,
      ...stateUpdate,
      isSynced: false,
      version: Date.now(),
    };
  }

  switch (action.type) {
    case 'restoreState':
      return {
        ...state,
        ..._.pick(action.data, ['tokens', 'version', 'accountNames', 'accountNotes', 'fundraisers']),
        isLoaded: true,
        isSynced: true,
      };
    case 'addToken': {
      const token = { ...action.token, id: uuid(), networks: {} };
      return unsynced({
        tokens: [...state.tokens, token],
      });
    }
    case 'saveFundraiser': {
      const tokenAddress = action.tokenAddress;
      return unsynced({
        fundraisers: { ...state.fundraisers, [tokenAddress]: { ...action.fundraiser, tokenAddress } },
      });
    }
    case 'updateToken': {
      if (!action.token.id) {
        throw new Error('Token ID not provided');
      }
      // we don't wanna overwrite some properties, like networks - network related stuff is set with different action
      const { id, networks, ...tokenUpdate } = action.token;
      const updatedToken = {
        ...findToken(id),
        ...tokenUpdate,
      };

      return unsynced({
        tokens: withUpdatedToken(updatedToken),
      });
    }

    case 'updateTokenNetwork': {
      const { id, networkId, networkData } = action;
      const updatedToken = findToken(id);
      const oldNetworkData = updatedToken.networks[networkId] || {};
      updatedToken.networks[networkId] = { ...oldNetworkData, ...networkData };
      return unsynced({
        tokens: withUpdatedToken(updatedToken),
      });
    }

    case 'updateFundraiserNetwork': {
      const { tokenAddress, networkId, networkData } = action;
      return unsynced({
        fundraisers: {
          ...state.fundraisers,
          [tokenAddress]: { ...state.fundraisers[tokenAddress], networkId, networkData },
        },
      });
    }

    case 'setTokenState': {
      const { id, networkId, state: tokenState } = action;
      const updatedToken = findToken(id);
      updatedToken.networks[networkId].state = tokenState;
      return unsynced({
        tokens: withUpdatedToken(updatedToken),
      });
    }
    /*
    case 'deleteFromTokenAccountList': {
      const { id, list, items } = action;
      const updatedToken = findToken(id);
      updatedToken[list] = subtractAccountLists(updatedToken[list] || [], items);
      return unsynced({
        tokens: withUpdatedToken(updatedToken),
      });
    }
*/
    case 'deleteToken':
      return unsynced({
        tokens: state.tokens.filter((token) => token.id !== action.id),
      });

    case 'startSaving':
      return {
        ...state,
        isSaving: true,
      };
    case 'endSaving':
      return {
        ...state,
        isSaving: false,
        isSynced: true,
      };
    case 'showError': {
      return {
        ...state,
        error: action.error,
      };
    }
    case 'hideError': {
      return {
        ...state,
        error: undefined,
      };
    }

    case 'setToken': {
      return {
        ...state,
        localToken: action.localToken,
        onlineToken: action.onlineToken,
      };
    }

    case 'startTransaction': {
      return {
        ...state,
        transaction: { ...action.transaction, createdAt: new Date() },
      };
    }

    case 'resetTransaction': {
      return {
        ...state,
        transaction: undefined,
      };
    }

    case 'approveSpending': {
      return {
        ...state,
        spendingApproval: action.spendingApproval,
      };
    }

    case 'resetSpendingApproval': {
      return {
        ...state,
        spendingApproval: undefined,
      };
    }

    case 'setAccountProp': {
      const { prop, value, address } = action;
      const tokenAddress = state.onlineToken?.address;
      switch (prop) {
        case 'name':
          return unsynced({
            accountNames: { ...(state.accountNames || {}), [address.toLowerCase()]: value },
          });
        case 'note':
          return unsynced({
            accountNotes: {
              ...(state.accountNotes || {}),
              [tokenAddress]: { ...((state.accountNotes || {})[tokenAddress] || {}), [address.toLowerCase()]: value },
            },
          });
      }
      return state;
    }

    case 'batchSetAccountProp': {
      const { items } = action;
      const tokenAddress = state.onlineToken?.address;

      const names: Record<string, string> = {};
      const notes: Record<string, string> = {};
      for (const [address, meta] of Object.entries(items)) {
        names[address.toLowerCase()] = meta.name;
        notes[address.toLowerCase()] = meta.note;
      }

      return unsynced({
        accountNames: { ...(state.accountNames || {}), ...names },
        accountNotes: {
          ...(state.accountNotes || {}),
          [tokenAddress]: { ...((state.accountNotes || {})[tokenAddress] || {}), ...notes },
        },
      });
    }

    case 'addPendingTransaction': {
      return unsynced({
        pendingTransactions: [...(state.pendingTransactions || []), action.transaction],
      });
    }

    case 'removePendingTransaction': {
      const index = state.pendingTransactions.findIndex((tx) => tx.hash === action.transaction.hash);
      if (index !== -1) {
        return unsynced({
          pendingTransactions: [
            ...state.pendingTransactions.slice(0, index),
            ...state.pendingTransactions.slice(index + 1),
          ],
        });
      } else {
        return state;
      }
    }
  }
};
