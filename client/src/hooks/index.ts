// Re-export hooks from specific context files
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export { useAppContext, useAuth };