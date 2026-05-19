import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FolderKanban, Gauge, Layers, FileBarChart2,
  Zap, X, Users,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import './Sidebar.css';

const NAV_ITEMS = [
  { path: '/',           label: 'Overview',    icon: LayoutDashboard },
  { path: '/projects',   label: 'Projects',    icon: FolderKanban    },
  { path: '/clients',    label: 'Clients',     icon: Users           },
  { path: '/audit',      label: 'Audit',       icon: Gauge           },
  { path: '/components', label: 'Components',  icon: Layers          },
  { path: '/reports',    label: 'Reports',     icon: FileBarChart2   },
];

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useAppStore();
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__header">
          <div className="sidebar__logo">
            <Zap size={18} className="sidebar__logo-icon" />
            <span className="sidebar__logo-text">Agency<strong>OS</strong></span>
          </div>
          <button
            className="sidebar__close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="sidebar__nav">
          <p className="sidebar__section-label">Workspace</p>
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className={({ isActive }) =>
                `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={16} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__footer">
          <div className="sidebar__avatar">EN</div>
          <div className="sidebar__user">
            <p className="sidebar__user-name">Eniola Omoniyi</p>
            <p className="sidebar__user-role">Frontend Engineer</p>
          </div>
        </div>
      </aside>
    </>
  );
}
