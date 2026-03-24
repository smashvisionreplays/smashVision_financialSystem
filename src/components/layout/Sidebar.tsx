import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ArrowLeftRight, Building2, Users, Menu, X, Calculator } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { to: '/clubs', icon: Building2, label: 'Clubs' },
  { to: '/people', icon: Users, label: 'People' },
  { to: '/roi', icon: Calculator, label: 'ROI Calculator' },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-sv-gray p-2 rounded-lg text-sv-white hover:bg-sv-gray-light transition-colors"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-sv-dark border-r border-sv-gray z-40 transform transition-transform lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-sv-gray">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Smash Vision" className="w-9 h-9 rounded-lg" />
            <div>
              <h1 className="text-sv-white font-bold text-lg leading-tight">Smash Vision</h1>
              <p className="text-sv-gray-text text-xs">Financial System</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
                  isActive
                    ? 'bg-sv-lime/10 text-sv-lime border border-sv-lime/20'
                    : 'text-sv-gray-text hover:text-sv-white hover:bg-sv-gray/50'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sv-gray">
          <p className="text-sv-gray-text text-xs text-center">
            Smash Vision &copy; {new Date().getFullYear()}
          </p>
        </div>
      </aside>
    </>
  );
}
