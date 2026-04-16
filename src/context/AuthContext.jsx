import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check session storage on mount
    const storedUser = sessionStorage.getItem('erp_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const loginDealer = (email, password) => {
    if (email === 'demo@prithvix.com' && password === 'Prithvix@123') {
      const userData = { role: 'dealer', name: 'Ramesh Patel' };
      setUser(userData);
      sessionStorage.setItem('erp_user', JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, message: 'Invalid dealer credentials' };
  };

  const loginStaff = (username, password) => {
    if (username === 'staff_demo' && password === 'Staff@123') {
      const userData = { role: 'staff', name: 'Alok Mishra' };
      setUser(userData);
      sessionStorage.setItem('erp_user', JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, message: 'Invalid staff credentials' };
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('erp_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, loginDealer, loginStaff, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
