'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { loginUser } from '@/services/api';
import toast from 'react-hot-toast';
import { HiAcademicCap, HiUserGroup } from 'react-icons/hi2';

export default function Login() {
    const [selectedRole, setSelectedRole] = useState('student'); // 'student' or 'faculty'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await loginUser({ email, password });
            const user = res.data.user;

            if (user.role !== selectedRole && user.role !== 'admin') {
                toast.error(`This account is registered as ${user.role.toUpperCase()}. Redirecting to your dashboard.`);
            } else {
                toast.success(`Welcome back, ${user.name}! 🎉`);
            }

            login(res.data.token, user);

            if (user.role === 'student') router.push('/team');
            else if (user.role === 'faculty') router.push('/faculty');
            else if (user.role === 'admin') router.push('/admin');
            else router.push('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>Welcome Back</h1>
                <p className="auth-subtitle">Select your role & sign in</p>

                {/* 2-Way Role Switcher: Student vs Faculty ONLY */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                    <button
                        type="button"
                        className={`btn ${selectedRole === 'student' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setSelectedRole('student')}
                        style={{ padding: '12px 16px', fontSize: 14 }}
                    >
                        <HiUserGroup /> Student
                    </button>
                    <button
                        type="button"
                        className={`btn ${selectedRole === 'faculty' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setSelectedRole('faculty')}
                        style={{ padding: '12px 16px', fontSize: 14 }}
                    >
                        <HiAcademicCap /> Faculty
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>
                            {selectedRole === 'faculty' ? 'Faculty Email Address' : 'Student Leader Email Address'}
                        </label>
                        <input
                            type="email"
                            className="form-input"
                            placeholder={selectedRole === 'faculty' ? "prof.name@pccoepune.org" : "student@pccoepune.org"}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
                        {loading ? 'Logging in...' : `Login as ${selectedRole === 'faculty' ? 'Faculty Mentor' : 'Student Team'}`}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, fontWeight: 700 }}>
                    Don't have an account?{' '}
                    <Link href="/register" style={{ color: 'var(--text)', textDecoration: 'underline' }}>
                        Register your team or faculty account
                    </Link>
                </p>
            </div>
        </div>
    );
}
