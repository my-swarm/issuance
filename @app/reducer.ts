import { Reducer } from 'react';
import { v4 as uuid } from 'uuid';
import _ from 'lodash';

import { AppState, Action } from '@types';

export const reducer: Reducer<any, any> = (state: AppState, action: Action) => {
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
      return {
        ...state,
        tokens: [...state.tokens, token],
        isSynced: false,
      };
    }
    case 'updateToken': {
      if (!action.token.id) {
        throw new Error('Token ID not provided');
      }
      // we don't wanna overwrite some properties, like networks - network related stuff is set with different action
      const { id, networks, ...tokenUpdate } = action.token;
      const updatedToken = {
        ...state.tokens.find((token) => token.id === id),
        ...tokenUpdate,
      };

      return {
        ...state,
        tokens: state.tokens.map((token) => (token.id === updatedToken.id ? updatedToken : token)),
        isSynced: false,
      };
    }
    case 'updateTokenNetwork': {
      const { id, networkId, networkData } = action;
      const updatedToken = state.tokens.find((t) => t.id === id);
      if (!updatedToken) {
        throw new Error('Token not found');
      }
      updatedToken.networks[networkId] = networkData;
      return {
        ...state,
        tokens: state.tokens.map((token) => (token.id === updatedToken.id ? updatedToken : token)),
        isSynced: false,
      };
    }

    case 'setTokenState': {
      const { id, networkId, state: tokenState } = action;
      const updatedToken = state.tokens.find((t) => t.id === id);
      if (!updatedToken) {
        throw new Error('Token not found');
      }
      updatedToken.networks[networkId].state = tokenState;
      return {
        ...state,
        tokens: state.tokens.map((token) => (token.id === updatedToken.id ? updatedToken : token)),
        isSynced: false,
      };
    }

    case 'deleteToken':
      return {
        ...state,
        tokens: state.tokens.filter((token) => token.id !== action.id),
        isSynced: false,
      };
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
  }
};
