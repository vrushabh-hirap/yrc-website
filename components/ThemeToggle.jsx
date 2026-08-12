'use client';

import { useState, useEffect } from 'react';
import { HiSun, HiMoon } from 'react-icons/hi2';

export default function ThemeToggle() {
    const [theme, setTheme] = useState('light');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('yrc_theme') || 'light';
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
        setMounted(true);
    }, []);

    const toggleTheme = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const nextTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(nextTheme);
        localStorage.setItem('yrc_theme', nextTheme);
        document.documentElement.setAttribute('data-theme', nextTheme);
    };

    if (!mounted) {
        return (
            <button className="theme-icon-toggle" aria-label="Toggle Theme">
                <HiMoon style={{ fontSize: 20 }} />
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className="theme-icon-toggle"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle Theme"
        >
            {theme === 'light' ? (
                <HiMoon style={{ color: '#2563EB', fontSize: 20 }} />
            ) : (
                <HiSun style={{ color: '#38BDF8', fontSize: 20 }} />
            )}
        </button>
    );
}
