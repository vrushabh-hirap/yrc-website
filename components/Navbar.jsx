'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { HiAcademicCap, HiBars3, HiXMark } from 'react-icons/hi2';
import { useState } from 'react';

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
        <nav className="navbar">
            <div className="navbar-inner">
                <Link href="/" className="navbar-brand" onClick={closeMobileMenu}>
                    <div className="brand-icon-wrapper">
                        <span className="brand-icon"><HiAcademicCap /></span>
                    </div>
                    <span className="brand-text">YRC 2026</span>
                </Link>

                <div className="navbar-links desktop">
                    {user ? (
                        <>
                            <Link href={getDashboardLink()}>Dashboard</Link>
                            <span style={{ fontSize: 13, fontWeight: 700, padding: '0 6px', color: 'var(--nb-black)' }}>
                                👤 {user.name} ({user.role.toUpperCase()})
                            </span>
                            <button className="btn-logout" onClick={handleLogout}>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link href="/login">Login</Link>
                            <Link href="/register" className="btn-nav-primary">Register Team</Link>
                        </>
                    )}
                </div>

                <button 
                    className="mobile-menu-toggle" 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? <HiXMark /> : <HiBars3 />}
                </button>
            </div>

            {isMobileMenuOpen && (
                <div className="mobile-menu">
                    {user ? (
                        <>
                            <Link href={getDashboardLink()} onClick={closeMobileMenu}>Dashboard</Link>
                            <div style={{ textAlign: 'center', fontWeight: 700, padding: '8px 0' }}>
                                {user.name} ({user.role})
                            </div>
                            <button className="btn-logout" onClick={handleLogout}>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" onClick={closeMobileMenu}>Login</Link>
                            <Link href="/register" className="btn-nav-primary" onClick={closeMobileMenu}>Register Team</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}
