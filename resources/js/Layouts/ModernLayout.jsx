import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { 
  LayoutDashboard, 
  FileSpreadsheet, 
  Folders, 
  UserCircle, 
  Menu, 
  X 
} from 'lucide-react';

export default function ModernLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActiveRoute = (routeName) => route().current(routeName);

  const navigationItems = [
    { 
      href: route('dashboard'), 
      label: 'Tableau de bord',
      active: 'dashboard',
      icon: LayoutDashboard
    },
    { 
      href: route('cra.index'), 
      label: 'CRAs', 
      active: 'cra.*',
      icon: FileSpreadsheet
    },
    { 
      href: route('projects.index'), 
      label: 'Projets', 
      active: 'projects.*',
      icon: Folders
    },
    { 
      href: route('profile.edit'), 
      label: 'Profil', 
      active: 'profile.*',
      icon: UserCircle
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Fixed Sidebar Navigation */}
      <nav className="hidden md:block fixed top-0 left-0 h-full w-64 bg-gray-900 border-r border-gray-800 p-4 space-y-2 overflow-y-auto">
        {/* Logo */}
        <Link 
          href={route('dashboard')} 
          className="flex items-center space-x-3 mb-8 pl-3"
        >
          
          <ApplicationLogo className="block h-12 w-auto fill-current" />
          {/* <span className="text-xl font-semibold text-gray-100">CRA APP</span> */}
        </Link>

        {/* Navigation Links */}
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center space-x-3 px-3 py-2 rounded-md transition-all duration-200
                ${isActiveRoute(item.active) 
                  ? 'bg-indigo-700 text-white' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'}
              `}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed inset-x-0 top-0 z-50 bg-gray-900">
        <div className="flex justify-between items-center p-4">
          {/* Mobile Logo */}
          <Link 
            href={route('dashboard')} 
            className="flex items-center space-x-3"
          >
            <ApplicationLogo className="block h-12 w-auto fill-current" />
            {/* <span className="text-lg font-semibold text-gray-100">CRA APP</span> */}
          </Link>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-300 hover:text-white"
            aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Menu Slide */}
        <div 
          className={`
            fixed inset-y-0 right-0 w-64 bg-gray-900 z-50 transform transition-transform duration-300
            ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
          `}
        >
          <div className="p-4 space-y-2 mt-16">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center space-x-3 px-3 py-3 rounded-md transition-all duration-200
                    ${isActiveRoute(item.active) 
                      ? 'bg-indigo-700 text-white' 
                      : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'}
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="md:ml-64 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8 pt-16 md:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
}