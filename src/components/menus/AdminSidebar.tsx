import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Users, 
  MessageSquare,
  Activity as ActivityIcon,
  LogOut,
  Menu,
  Image as ImageIcon,
  FileText
} from 'lucide-react';
import AdminMobileMenu from './AdminMobileMenu';
import { logout } from '../../api/authApi'; // <-- Import logout API

const BASE_URL = import.meta.env.BASE_URL || "/";

const menuItems = [
  {
    path: '/admin/activities',
    icon: <ActivityIcon className="w-5 h-5" />,
    label: 'Activities',
  },
  {
    path: '/admin/events',
    icon: <Calendar className="w-5 h-5" />,
    label: 'Events',
  },
  {
    path: '/admin/locations',
    icon: <MapPin className="w-5 h-5" />,
    label: 'Locations',
  },
  {
    path: '/admin/volunteers',
    icon: <Users className="w-5 h-5" />,
    label: 'Volunteers',
  },
  {
    path: '/admin/suggestions',
    icon: <MessageSquare className="w-5 h-5" />,
    label: 'Suggestions',
  },
  {
    path: '/admin/gallery',
    icon: <ImageIcon className="w-5 h-5" />,
    label: 'Gallery',
  }
];

const AdminSidebar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  //@ts-ignore
  const navigate = useNavigate();

  // Logout handler
  const handleLogout = async () => {
    try {
      await logout();
      window.location.replace("https://www.alkemites.com/alkemites/alkem/login.aspx");
    } catch {
      window.location.replace("https://www.alkemites.com/alkemites/alkem/login.aspx");
    }
  };

  return (
    <>
      {/* Mobile Hamburger */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 text-white p-2 rounded-lg shadow-lg transition-colors"
        style={{ backgroundColor: 'var(--brand-secondary)' }}
        onClick={() => setMobileMenuOpen(true)}
        aria-label="Open sidebar"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Menu */}
      <AdminMobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        menuItems={menuItems}
      />

      {/* Desktop Sidebar */}
      <div className="hidden md:flex fixed left-0 top-0 z-30 text-white flex-col w-64 h-screen" style={{ backgroundColor: 'var(--brand-secondary)' }}>
        {/* Logo Section */}
        <div className="p-6 border-b border-red-600">
          <div className="flex items-center justify-center gap-4 mb-4">
            {/* Alkem Logo in white container */}
            <div className="bg-white p-2 rounded-lg shadow-md">
              <img 
                src={`${BASE_URL}logos/alkem_logo.png`} 
                alt="Alkem Logo" 
                className="h-9 w-auto"
              />
            </div>
            {/* SMILE Logo directly on red background, now a Link to /home */}
            <Link to="/home">
              <img 
                src={`${BASE_URL}logos/smile_logo_full.png`} 
                alt="SMILE Logo" 
                className="h-20 w-auto"
                style={{ cursor: "pointer" }}
              />
            </Link>
          </div>
          <div className="text-center">
            <p className="text-sm text-red-100">Smile Administrative Panel</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'text-white font-medium'
                        : 'text-red-100 hover:text-white'
                    }`
                  }
                  style={({ isActive }) => ({
                    backgroundColor: isActive ? 'var(--brand-secondary-dark)' : 'transparent',
                    borderLeft: isActive ? '4px solid var(--brand-primary)' : '4px solid transparent'
                  })}
                  onMouseEnter={(e) => {
                    if (!e.currentTarget.classList.contains('text-white')) {
                      e.currentTarget.style.backgroundColor = 'var(--brand-secondary-dark)';
                      e.currentTarget.style.opacity = '0.8';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.currentTarget.classList.contains('text-white')) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.opacity = '1';
                    }
                  }}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="px-5 mx-auto border-t border-red-600">
          <div className="flex gap-2 mb-2 mt-4">
            <a
              href={`${BASE_URL}Manuals/Alkem Smile Admin Manual.pdf`}
              download
              className="flex items-center gap-2 px-4 py-3 text-red-100 hover:text-white rounded-lg transition-all duration-200"
              style={{ textDecoration: "none" }}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = 'var(--brand-secondary-dark)';
                e.currentTarget.style.opacity = '0.8';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.opacity = '1';
              }}
            >
              <FileText className="w-5 h-5" />
              <span className="font-medium">Admin Manual</span>
            </a>
          </div>
          <button 
            className="flex items-center gap-3 px-4 py-3 text-red-100 hover:text-white rounded-lg transition-all duration-200 w-full"
            onClick={handleLogout}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--brand-secondary-dark)';
              e.currentTarget.style.opacity = '0.8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.opacity = '1';
            }}
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;