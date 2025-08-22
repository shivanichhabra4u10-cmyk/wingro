export * from './AppContext';
export * from './AuthContext';

// Custom hook to use the AppContext
export const useAppContext = () => {
    return useContext(AppContext);
};