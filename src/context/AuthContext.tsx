import React, { createContext, useContext, useState } from 'react';

type AuthContextType = {
  userID: string | null;
  token: string | null;
  username: string | null;
  loading: boolean;
  login: (userID: string, token: string, username: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userID, setUserID] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const login = (userID: string, token: string, username: string) => {
    setLoading(true);
    setUserID(userID);
    setToken(token);
    setUsername(username);
    setLoading(false);
  };

  const logout = () => {
    setUserID(null);
    setToken(null);
    setUsername(null);
  };

  return (
    <AuthContext.Provider
      value={{
        userID,
        token,
        username,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

