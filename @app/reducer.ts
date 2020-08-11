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
      const token = { ...action.token, id: uuid() };
      return {
        ...state,
        tokens: [...state.tokens, token],
        isSynced: false,
      };
    }
    case 'updateToken': {
      const updatedToken = {
        ...state.tokens.find((token) => token.id === action.token.id),
        ...action.token,
      };

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
