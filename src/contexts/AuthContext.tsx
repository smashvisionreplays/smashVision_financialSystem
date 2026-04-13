import { createContext, useContext, useState } from 'react';

const PASSWORD = 'SmashVisionTomasCesar2026*';
const STORAGE_KEY = 'sv_auth';

interface AuthContextValue {
  isAuthenticated: boolean;
  signIn: (password: string) => boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  signIn: () => false,
  signOut: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem(STORAGE_KEY) === '1'
  );

  const signIn = (password: string) => {
    if (password === PASSWORD) {
      localStorage.setItem(STORAGE_KEY, '1');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const signOut = () => {
    localStorage.removeItem(STORAGE_KEY);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
