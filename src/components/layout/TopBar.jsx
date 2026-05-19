import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Bell } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import './TopBar.css';

const PAGE_TITLES = {
  '/':           { title: 'Overview',   sub: 'Agency snapshot' },
  '/projects':   { title: 'Projects',   sub: 'Manage client work' },
  '/clients':    { title: 'Clients',    sub: 'Client directory' },
  '/audit':      { title: 'Auditor',    sub: 'Core Web Vitals' },
  '/components': { title: 'Components', sub: 'UI library' },
  '/reports':    { title: 'Reports',    sub: 'Performance reports' },
};

export default function TopBar() {
  const { toggleSidebar } = useAppStore();
  const { pathname } = useLocation();
  const page = PAGE_TITLES[pathname] || { title: 'AgencyOS', sub: '' };

  return (
    <header className="topbar">
      <div className="topbar__left">
        <button className="topbar__menu-btn" onClick={toggleSidebar} aria-label="Toggle menu">
          <Menu size={20} />
        </button>
        <div>
          <h1 className="topbar__title">{page.title}</h1>
          <p className="topbar__sub">{page.sub}</p>
        </div>
      </div>

      <div className="topbar__right">
        <button className="topbar__icon-btn" aria-label="Notifications">
          <Bell size={18} />
          <span className="topbar__notif-dot" />
        </button>
        <div className="topbar__avatar">EN</div>
      </div>
    </header>
  );
}
