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
                <p className="auth-subtitle">Select your role & sign in to YRC Portal</p>

                {/* Apple-style Segmented Role Control */}
                <div className="seg-control">
                    <button
                        type="button"
                        className={`seg-btn ${selectedRole === 'student' ? 'seg-btn-active' : ''}`}
                        onClick={() => setSelectedRole('student')}
                    >
                        <HiUserGroup /> Student Team
                    </button>
                    <button
                        type="button"
                        className={`seg-btn ${selectedRole === 'faculty' ? 'seg-btn-active' : ''}`}
                        onClick={() => setSelectedRole('faculty')}
                    >
                        <HiAcademicCap /> Faculty Mentor
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
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
                        {loading ? 'Signing in...' : `Login as ${selectedRole === 'faculty' ? 'Faculty Mentor' : 'Student Team'}`}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--ink-muted-80)' }}>
                    Don't have an account?{' '}
                    <Link href="/register" style={{ color: 'var(--primary)', fontWeight: 500 }}>
                        Register your team or faculty account
                    </Link>
                </p>
            </div>
        </div>
    );
}
