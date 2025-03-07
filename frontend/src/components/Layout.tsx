import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { AppBar } from './AppBar';

export function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <div className="flex flex-col flex-1">
        <AppBar />
        <main className={`flex-1 overflow-auto transition-all duration-200 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
          {children}
        </main>
        
        <footer className="bg-white border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <p className="text-center text-gray-500">
              © {new Date().getFullYear()} Palovito. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
} 