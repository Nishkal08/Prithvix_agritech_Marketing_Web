import { createContext, useState, useEffect } from 'react';

export const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('erp_sidebar_collapsed');
    if (stored === 'true') {
      setIsCollapsed(true);
    }
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(prev => {
      const newState = !prev;
      localStorage.setItem('erp_sidebar_collapsed', newState.toString());
      return newState;
    });
  };

  return (
    <DashboardContext.Provider value={{ isCollapsed, toggleSidebar }}>
      {children}
    </DashboardContext.Provider>
  );
};
