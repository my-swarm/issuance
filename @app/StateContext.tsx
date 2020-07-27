import React, { ReactElement, createContext, useContext, useReducer, Reducer, ReactNode, useEffect } from 'react';

import { Action, AppState } from '@types';
import { useStorage } from '@app';

export const StateContext = createContext({});

interface StateProviderProps {
  reducer: Reducer<AppState, Action>;
  children: ReactNode;
}

export const StateProvider = ({ reducer, children }: StateProviderProps): ReactElement => {
  const initialState: AppState = {
    version: 0,
    tokens: [],
    isSaving: false,
    isLoading: false,
    isLoaded: false,
    isSynced: false,
  };

  const storage = useStorage();

  const [appState, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    storage.load().then((storedState) => {
      if (storedState) {
        dispatch({
          type: 'restoreState',
          data: storedState,
        });
      }
    });
  }, []);

  return <StateContext.Provider value={[appState, dispatch]}>{children}</StateContext.Provider>;
};

export const useStateValue = () => useContext(StateContext);
