import React, {
  ReactElement,
  createContext,
  useContext,
  useReducer,
  Reducer,
  ReactNode,
  useEffect,
  Dispatch,
} from 'react';

import { Action } from './actions';
import { AppState } from './state';
import { useStorage } from '@app';

export const StateContext = createContext(undefined);

interface StateProviderProps {
  reducer: Reducer<AppState, Action>;
  children: ReactNode;
}

type StateValue = [AppState, Dispatch<any>];

export const StateProvider = ({ reducer, children }: StateProviderProps): ReactElement => {
  const initialState: AppState = {
    version: 0,
    tokens: [],
    fundraisers: [],
    isSaving: false,
    isLoading: false,
    isLoaded: false,
    isSynced: false,
    accountNames: {},
    accountNotes: {},
  };

  const storage = useStorage();

  const [appState, dispatch]: StateValue = useReducer(reducer, initialState);
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

export const useAppState: () => StateValue = () => useContext(StateContext);
