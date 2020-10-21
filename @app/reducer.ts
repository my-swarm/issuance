import { Reducer } from 'react';
import { v4 as uuid } from 'uuid';
import _ from 'lodash';

import { AppState, Action, Uuid, Token } from '@types';
import { ContractProxy, mergeAccountLists, subtractAccountLists } from '../@lib';

export const reducer: Reducer<any, any> = (state: AppState, action: Action) => {
  function findToken(id: Uuid) {
    const token = state.tokens.find((t) => t.id === id);
    if (!token) {
      throw new Error(`Token not found: ${id}`);
    }
    return { ...token };
  }

  function withUpdatedToken(updatedToken: Token) {
    return state.tokens.map((token) => (token.id === updatedToken.id ? updatedToken : token));
  }

  function unsynced(stateUpdate) {
    return {
      ...state,
      ...stateUpdate,
      isSynced: false,
    };
  }

  switch (action.type) {
    case 'restoreState':
      return {
        ...state,
        ..._.pick(action.data, ['tokens', 'version']),
        isLoaded: true,
        isSynced: true,
      };
    case 'addToken': {
      const token = { ...action.token, id: uuid(), networks: {} };
      return unsynced({
        tokens: [...state.tokens, token],
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

    case 'incrementVersion':
      return {
        ...state,
        version: state.version + 1,
      };
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
      console.log('showerror', action.error);
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
        token: action.token,
      };
    }

    case 'startTransaction': {
      return {
        ...state,
        transaction: action.transaction,
      };
    }

    case 'resetTransaction': {
      return {
        ...state,
        transaction: undefined,
      };
    }

    case 'setAccountProp': {
      console.log('setAccountProp', action);
      const { list, prop, value, address, networkId } = action;
      const id = state.token.id;
      const updatedToken = findToken(id);
      _.set(updatedToken, ['networks', networkId, list, address.toLowerCase(), prop], value);
      return unsynced({
        tokens: withUpdatedToken(updatedToken),
      });
    }

    case 'batchSetAccountProp': {
      const { networkId, list, items } = action;
      const id = state.token.id;

      const updatedToken = findToken(id);
      for (const [address, item] of Object.entries(items)) {
        _.set(updatedToken, ['networks', networkId, list, address.toLowerCase()], item);
      }
      return unsynced({
        tokens: withUpdatedToken(updatedToken),
      });
    }
  }
};
