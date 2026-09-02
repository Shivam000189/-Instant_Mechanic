import { NavLink, Link, useLocation } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NotificationDropdown } from './NotificationDropdown';
import { cn } from '@/lib/utils';

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/bookings', label: 'Bookings' },
  { to: '/mechanics', label: 'Mechanics' },
];

export function Header({ isDark, onToggleTheme }: HeaderProps) {
  const location = useLocation();

  return (
    <header className="sticky top-3 sm:top-4 z-40 w-full px-3 sm:px-6 lg:px-8 flex justify-center pointer-events-none">
      {/* Floating Cylindrical Pill Capsule Navbar */}
      <div className="w-full max-w-6xl h-14 sm:h-16 rounded-full border border-border/80 bg-background/85 dark:bg-card/85 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.25)] flex items-center justify-between px-3.5 sm:px-6 transition-all duration-300 pointer-events-auto">
        
        {/* Brand & Text Navigation */}
        <div className="flex items-center gap-4 sm:gap-8">
          <Link to="/" className="flex items-center gap-2 group no-underline pl-1 sm:pl-2">
            <span className="text-base sm:text-lg font-black tracking-tight text-foreground group-hover:text-primary transition-colors">
              Instant Mechanic<sup className="text-[0.55em] align-super text-primary font-bold">™</sup>
            </span>
          </Link>

          {/* Top Navigation - Names only, NO icons, cylindrical pill styling */}
          <nav className="flex items-center gap-1 sm:gap-1.5 bg-muted/50 dark:bg-muted/30 p-1 rounded-full border border-border/50">
            {navItems.map((item) => {
              const isActive =
                item.to === '/dashboard'
                  ? location.pathname === '/' || location.pathname === '/dashboard'
                  : location.pathname === item.to;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={cn(
                    'px-3.5 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 no-underline',
                    isActive
                      ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/80'
                  )}
                >
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 pr-1 sm:pr-2">
          {/* Notification dropdown popover for new bookings */}
          <NotificationDropdown />

          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleTheme}
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </header>
  );
}