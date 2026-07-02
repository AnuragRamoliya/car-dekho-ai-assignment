import { NavLink, Outlet } from 'react-router-dom';
import carDekhoLogo from '../assets/cardekho-logo.svg';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/quiz', label: 'Quiz' },
  { to: '/browse', label: 'Browse' },
  { to: '/shortlist', label: 'Shortlist' }
];

export const Layout = () => (
  <div className="min-h-screen bg-mist">
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <NavLink to="/" className="flex items-center gap-2" aria-label="Car Dekho home">
          <img src={carDekhoLogo} alt="Car Dekho" className="h-10 w-auto" />
        </NavLink>
        <nav className="flex gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-medium ${isActive ? 'bg-reef text-white' : 'text-slate-600 hover:bg-slate-100'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
    <main className="mx-auto max-w-6xl px-4 py-6">
      <Outlet />
    </main>
  </div>
);
