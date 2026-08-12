'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { HiAcademicCap, HiBars3, HiXMark } from 'react-icons/hi2';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        router.push('/');
        setIsMobileMenuOpen(false);
    };

    const getDashboardLink = () => {
        if (!user) return '/';
        if (user.role === 'student') return '/team';
        if (user.role === 'faculty') return '/faculty';
        if (user.role === 'admin') return '/admin';
        return '/';
    };

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <div className="nav-wrapper">
            {/* Top Global Navigation Bar (Pure Black 44px) */}
            <div className="global-nav">
                <div className="global-nav-inner">
                    <div className="global-nav-brand">
                        <span>PCCOE AIML</span>
                        <span style={{ opacity: 0.4 }}>|</span>
                        <span style={{ fontWeight: 400 }}>Young's Research Conference 2026</span>
                    </div>

                    <div className="global-nav-links">
                        <a href="https://www.pccoepune.org" target="_blank" rel="noopener noreferrer">PCCOE Main Portal</a>
                        <Link href="/previous-papers">Past Research Papers</Link>
                        {user && (
                            <span className="global-user-badge">
                                👤 {user.name} ({user.role.toUpperCase()})
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Sub-Nav Frosted Glass Strip (52px Height) */}
            <nav className="navbar">
                <div className="navbar-inner">
                    <Link href="/" className="navbar-brand" onClick={closeMobileMenu}>
                        <div className="brand-icon">
                            <HiAcademicCap />
                        </div>
                        <span>YRC 2026</span>
                    </Link>

                    <div className="navbar-links">
                        <Link href="/#tracks">Tracks</Link>
                        <Link href="/#timeline">Roadmap</Link>
                        <Link href="/#faq">FAQs</Link>

                        {user ? (
                            <>
                                <Link href={getDashboardLink()} className="btn btn-primary btn-sm">
                                    Dashboard
                                </Link>
                                <button className="btn btn-logout btn-sm" onClick={handleLogout}>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" style={{ fontWeight: 500 }}>
                                    Login
                                </Link>
                                <Link href="/register" className="btn btn-primary btn-sm">
                                    Register Team
                                </Link>
                            </>
                        )}
                        <ThemeToggle />
                    </div>

                    <div className="mobile-nav-actions">
                        <ThemeToggle />
                        <button
                            className="mobile-menu-toggle"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <HiXMark /> : <HiBars3 />}
                        </button>
                    </div>
                </div>

                {isMobileMenuOpen && (
                    <div className="mobile-menu">
                        {user ? (
                            <>
                                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary-on-dark)', marginBottom: 8 }}>
                                    Logged in as {user.name} ({user.role.toUpperCase()})
                                </div>
                                <Link href={getDashboardLink()} onClick={closeMobileMenu} className="btn btn-primary" style={{ width: '100%' }}>
                                    Dashboard
                                </Link>
                                <button className="btn btn-logout" onClick={handleLogout} style={{ width: '100%', marginTop: 6 }}>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" onClick={closeMobileMenu}>Login</Link>
                                <Link href="/register" className="btn btn-primary" onClick={closeMobileMenu} style={{ width: '100%' }}>
                                    Register Team
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </nav>
        </div>
    );
}
