import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';
import { Home, Brain, Users, TrendingUp, AlertCircle, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/', icon: Home, label: 'Check-in' },
  { to: '/feed', icon: Brain, label: 'Memory Feed' },
  { to: '/people', icon: Users, label: 'People' },
  { to: '/patterns', icon: TrendingUp, label: 'Patterns' },
  { to: '/unresolved', icon: AlertCircle, label: 'Unresolved' },
];

export function SidebarNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-surface rounded-lg border border-white/5"
      >
        {isOpen ? (
          <X className="w-5 h-5 text-text-primary" />
        ) : (
          <Menu className="w-5 h-5 text-text-primary" />
        )}
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full w-[220px] bg-surface border-r border-white/5 flex flex-col z-40 transition-transform duration-300',
          'lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <h1 className="text-xl font-semibold text-text-primary tracking-tight">
            MemoryOS
          </h1>
          <p className="text-xs text-text-muted mt-1">Your personal second brain</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-accent/10 text-accent'
                    : 'text-text-muted hover:text-text-primary hover:bg-white/5'
                )
              }
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center text-white text-sm font-medium">
              H
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">Haruto</p>
              <p className="text-xs text-text-muted truncate">Personal</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
