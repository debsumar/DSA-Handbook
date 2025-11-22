import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { Moon, Orbit, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { ErrorBoundary } from '../components/ErrorBoundary';

export const RootLayout = () => {
    const { preference, resolvedTheme, toggleTheme } = useTheme();
    const location = useLocation();
    const isAboutPage = location.pathname === '/about';

    // Get icon based on preference
    const getThemeIcon = () => {
        if (preference === 'system') {
            // return <span className="text-sm">Auto</span>;
            return <Orbit size={20} />;
        }
        return resolvedTheme === 'light' ? <Sun size={20} /> : <Moon size={20} />;
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300 font-sans">
            <nav className="flex items-center justify-between p-4 border-b border-[var(--border-color)] sticky top-0 bg-[var(--bg-primary)]/80 backdrop-blur-md z-50">
                <Link to="/">
                    <h1 className="text-4xl font-bold tracking-wider leading-snug cursor-pointer" style={{ fontFamily: "'Pacifico', cursive" }}>
                        <span className="text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors">Practice Sheets </span>
                        <span className="text-gray-500 italic text-lg ml-[10px] mr-[10px]">by </span>
                        <span className="text-pink-500 text-lg animate-neon hover:text-pink-400 transition-colors" style={{ fontFamily: "'Dancing Script', cursive" }}>debanjan</span>
                    </h1>
                </Link>
                <div className="flex items-center gap-2">
                    <Link to="/about">
                        <motion.span
                            className={`text-sm font-medium transition-colors cursor-pointer inline-block ${isAboutPage
                                ? 'text-[var(--accent-primary)]'
                                : 'text-[var(--text-secondary)] hover:text-[var(--accent-primary)]'
                                }`}
                            whileHover={{ scale: 1.05, y: -1 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                            About
                        </motion.span>
                    </Link>
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer flex items-center gap-1"
                        aria-label="Toggle Theme"
                        title={`Current: ${preference} (${resolvedTheme})`}
                    >
                        <motion.div
                            key={preference}
                            initial={{ rotate: -180, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            {getThemeIcon()}
                        </motion.div>
                    </button>
                </div>
            </nav>
            <main className="p-4 md:p-8">
                <ErrorBoundary>
                    <Outlet />
                </ErrorBoundary>
            </main>
        </div>
    );
};
