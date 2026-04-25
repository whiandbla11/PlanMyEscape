import { Link } from 'react-router-dom';
import { Moon, Sun, Compass } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { dark, setDark } = useTheme();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg text-slate-800 dark:text-slate-100 tracking-tight">
            PlanMyEscape
          </span>
        </Link>

        <button
          onClick={() => setDark(!dark)}
          className="w-9 h-9 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          aria-label="Toggle dark mode"
        >
          {dark ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>
      </div>
    </nav>
  );
}
