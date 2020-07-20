import React, { createContext, useContext, useReducer, Reducer, ReactNode, useState, useEffect } from 'react';
import { AppState } from '../types';
import { useStorage } from './useStorage';

export const StateContext = createContext({});

interface StateProviderProps {
  reducer: Reducer<any, any>;
  initialState: AppState;
  children: ReactNode;
}

export const StateProvider = ({ reducer, children }: StateProviderProps) => {
  const initialState = {
    version: 0,
    tokens: [],
    isSaving: false,
    isLoading: false,
    isLoaded: false,
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
