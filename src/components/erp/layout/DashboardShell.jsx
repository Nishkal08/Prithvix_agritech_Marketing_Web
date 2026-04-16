import { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { DashboardContext } from '../../../context/DashboardContext';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import MobileNav from './MobileNav';

export default function DashboardShell() {
  const { isCollapsed } = useContext(DashboardContext);

  return (
    <div className="flex min-h-screen bg-offwhite font-ui text-dark">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div 
        className="flex-1 flex flex-col min-w-0 transition-all duration-250 ease-out"
        style={{ marginLeft: 0 }} // On mobile
      >
        <TopBar />
        
        {/* The Page Transition Wrapper should be inside the Outlet components themselves, 
            or wrap the Outlet if it can handle the key correctly.
            Based on Master Prompt: PageTransition wraps all page content.
        */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 pb-24 md:pb-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <MobileNav />
    </div>
  );
}
