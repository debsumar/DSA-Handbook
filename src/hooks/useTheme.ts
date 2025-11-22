import { useEffect, useState } from 'react';

type ThemePreference = 'system' | 'light' | 'dark';
type ResolvedTheme = 'light' | 'dark';

export function useTheme() {
    // Get system theme
    const getSystemTheme = (): ResolvedTheme => {
        if (typeof window === 'undefined') return 'light';
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        console.log('[useTheme] System theme detected:', isDark ? 'dark' : 'light');
        return isDark ? 'dark' : 'light';
    };

    // Get initial preference from localStorage, default to 'dark'
    // Note: Defaulting to dark because Chrome on Mac has bugs detecting system theme
    const [preference, setPreference] = useState<ThemePreference>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('theme-preference');
            console.log('[useTheme] Saved preference:', saved);
            if (saved === 'system' || saved === 'light' || saved === 'dark') {
                return saved;
            }
        }
        console.log('[useTheme] No saved preference, defaulting to dark');
        return 'dark';
    });

    // Initialize resolved theme based on preference
    const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
        if (typeof window === 'undefined') return 'light';

        const saved = localStorage.getItem('theme-preference');
        const initialPreference = (saved === 'system' || saved === 'light' || saved === 'dark') ? saved : 'system';

        if (initialPreference === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            console.log('[useTheme] Initial resolved theme (system):', systemTheme);
            return systemTheme;
        }
        console.log('[useTheme] Initial resolved theme (manual):', initialPreference);
        return initialPreference;
    });

    // Apply theme to document
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(resolvedTheme);
        console.log('[useTheme] Applied theme to document:', resolvedTheme);
    }, [resolvedTheme]);

    // Listen for system theme changes when preference is 'system'
    useEffect(() => {
        console.log('[useTheme] Preference changed to:', preference);

        if (preference !== 'system') {
            console.log('[useTheme] Not in system mode, setting to:', preference);
            setResolvedTheme(preference);
            return;
        }

        // Set initial system theme
        const systemTheme = getSystemTheme();
        setResolvedTheme(systemTheme);

        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
            const newTheme = e.matches ? 'dark' : 'light';
            console.log('[useTheme] System theme changed to:', newTheme);
            setResolvedTheme(newTheme);
        };

        // Modern browsers
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleChange);
        } else {
            // Legacy browsers
            mediaQuery.addListener(handleChange);
        }

        return () => {
            if (mediaQuery.removeEventListener) {
                mediaQuery.removeEventListener('change', handleChange);
            } else {
                mediaQuery.removeListener(handleChange);
            }
        };
    }, [preference]);

    // Save preference to localStorage
    useEffect(() => {
        localStorage.setItem('theme-preference', preference);
        console.log('[useTheme] Saved preference to localStorage:', preference);
    }, [preference]);

    const setTheme = (newPreference: ThemePreference) => {
        console.log('[useTheme] setTheme called with:', newPreference);
        setPreference(newPreference);
    };

    const toggleTheme = () => {
        setPreference((prev) => {
            const next = prev === 'system' ? 'light' : prev === 'light' ? 'dark' : 'system';
            console.log('[useTheme] Toggle:', prev, '→', next);
            return next;
        });
    };

    return {
        preference,
        resolvedTheme,
        setTheme,
        toggleTheme,
        isSystemTheme: preference === 'system'
    };
}
