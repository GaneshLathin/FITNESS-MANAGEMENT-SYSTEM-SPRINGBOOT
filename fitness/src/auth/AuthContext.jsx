// auth/AuthContext.js
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    // Correctly parse the stored JSON string back into an object
    const stored = localStorage.getItem("jwtToken");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (data) => {
    // Correctly stringify the user data before storing
    localStorage.setItem("jwtToken", JSON.stringify(data));
    setAuth(data);
  };

  const logout = () => {
    localStorage.removeItem("jwtToken");
    setAuth(null);
  };

  const hasRole = (role) => {
    return auth?.role === role;
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);