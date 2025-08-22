import React, { createContext, useContext, useReducer } from 'react';

interface AppState {
  // Add your state properties here
  [key: string]: any;
}

interface AppAction {
  type: string;
  payload?: any;
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

// Define the initial state
const initialState: AppState = {
  // Define your initial state properties here
};

// Create context with type
export const AppContext = createContext<AppContextType>({
  state: initialState,
  dispatch: () => null,
});

// Define a reducer function to manage state updates
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    // Define your action cases here
    default:
      return state;
  }
};

// Create a provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }): React.ReactElement => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the AppContext
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
