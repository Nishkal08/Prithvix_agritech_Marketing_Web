import { createContext, useState, useEffect } from 'react';
import { buildPermissions } from '../config/roles';
import { RoleContext } from './RoleContext';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('erp_user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setPermissions(buildPermissions(parsed.role));
    }
    setLoading(false);
  }, []);

  const loginDealer = (email, password) => {
    if (email === 'demo@prithvix.com' && password === 'Prithvix@123') {
      const userData = { role: 'dealer', name: 'Ramesh Patel', email };
      setUser(userData);
      setPermissions(buildPermissions('dealer'));
      sessionStorage.setItem('erp_user', JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, message: 'Invalid dealer credentials' };
  };

  const loginStaff = (username, password) => {
    if (username === 'staff_demo' && password === 'Staff@123') {
      const userData = { role: 'staff', name: 'Alok Mishra', username };
      setUser(userData);
      setPermissions(buildPermissions('staff'));
      sessionStorage.setItem('erp_user', JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, message: 'Invalid staff credentials' };
  };

  const logout = () => {
    setUser(null);
    setPermissions(null);
    sessionStorage.removeItem('erp_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, loginDealer, loginStaff, logout }}>
      <RoleContext.Provider value={permissions}>
        {children}
      </RoleContext.Provider>
    </AuthContext.Provider>
  );
};
