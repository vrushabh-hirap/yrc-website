'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getAdminStats, getAllTeams, getFacultyList, createFacultyAccount, assignMentor, deleteTeam, loginUser } from '@/services/api';
import toast from 'react-hot-toast';
import { HiUsers, HiDocumentText, HiAcademicCap, HiTrash, HiUserPlus, HiShieldCheck } from 'react-icons/hi2';

export default function AdminDashboard() {
    const { user, login: authLogin, loading: authLoading } = useAuth();
    const router = useRouter();

    // Admin inline login state
    const [adminEmail, setAdminEmail] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);

    // Dashboard state
    const [stats, setStats] = useState({ totalTeams: 0, totalPapers: 0, totalFaculty: 0, totalStudents: 0 });
    const [teams, setTeams] = useState([]);
    const [faculty, setFaculty] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTrack, setSelectedTrack] = useState('');

    // Faculty modal form
    const [newFaculty, setNewFaculty] = useState({ name: '', email: '', password: '', department: 'AIML', phone: '' });
    const [showFacultyModal, setShowFacultyModal] = useState(false);

    const loadData = async () => {
        try {
            const [statsRes, teamsRes, facultyRes] = await Promise.all([
                getAdminStats(),
                getAllTeams(selectedTrack ? { track: selectedTrack } : {}),
                getFacultyList()
            ]);
            setStats(statsRes.data.stats);
            setTeams(teamsRes.data);
            setFaculty(facultyRes.data);
        } catch (err) {
            toast.error('Failed to load admin data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading) {
            if (user && user.role === 'admin') {
                loadData();
            } else {
                setLoading(false);
            }
        }
    }, [authLoading, user, selectedTrack]);

    const handleAdminLogin = async (e) => {
        e.preventDefault();
        setLoginLoading(true);
        try {
            const res = await loginUser({ email: adminEmail, password: adminPassword });
            if (res.data.user.role !== 'admin') {
                toast.error('Access denied. Administrator credentials required.');
                return;
            }
            authLogin(res.data.token, res.data.user);
            toast.success('Admin Authenticated! Welcome to Command Center 🛡️');
            setLoading(true);
            loadData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid administrator credentials');
        } finally {
            setLoginLoading(false);
        }
    };

    const handleAssignMentor = async (teamId, mentorId) => {
        if (!mentorId) return;
        try {
            await assignMentor(teamId, mentorId);
            toast.success('Faculty mentor assigned successfully! 🤝');
            loadData();
        } catch (err) {
            toast.error('Failed to assign mentor');
        }
    };

    const handleDeleteTeam = async (teamId) => {
        if (!confirm('Delete this team and member accounts? Action cannot be undone.')) return;
        try {
            await deleteTeam(teamId);
            toast.success('Team deleted successfully');
            loadData();
        } catch (err) {
            toast.error('Failed to delete team');
        }
    };

    const handleCreateFaculty = async (e) => {
        e.preventDefault();
        try {
            await createFacultyAccount(newFaculty);
            toast.success('Faculty mentor account created! 🎉');
            setShowFacultyModal(false);
            setNewFaculty({ name: '', email: '', password: '', department: 'AIML', phone: '' });
            loadData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create faculty account');
        }
    };

    if (authLoading || (user && user.role === 'admin' && loading)) {
        return <div className="loader-page"><div className="spinner"></div></div>;
    }

    // Camouflaged Admin Login Form (Rendered ONLY on /admin URL when unauthenticated)
    if (!user || user.role !== 'admin') {
        return (
            <div className="auth-page">
                <div className="auth-card" style={{ maxWidth: 440 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                        <span style={{ fontSize: 32 }}>🛡️</span>
                        <h1 style={{ fontSize: 24, margin: 0 }}>Admin Authentication</h1>
                    </div>
                    <p className="auth-subtitle">Restricted Command Center. Enter admin credentials to proceed.</p>

                    <form onSubmit={handleAdminLogin}>
                        <div className="form-group">
                            <label>Admin Email</label>
                            <input
                                type="email"
                                className="form-input"
                                placeholder="admin@pccoepune.org"
                                value={adminEmail}
                                onChange={(e) => setAdminEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Admin Password</label>
                            <input
                                type="password"
                                className="form-input"
                                placeholder="Enter admin password"
                                value={adminPassword}
                                onChange={(e) => setAdminPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 8 }} disabled={loginLoading}>
                            {loginLoading ? 'Authenticating...' : 'Sign In to Admin Portal'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <span className="premium-badge">Administrator Command Center</span>
                    <h1>YRC 2026 Admin Portal</h1>
                    <p style={{ marginTop: 4 }}>Bridge student teams with faculty mentors, allocate reviews, and oversee papers.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowFacultyModal(true)}>
                    <HiUserPlus /> Add Faculty Account
                </button>
            </div>

            {/* Stats Overview Grid */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-number">{stats.totalTeams}</div>
                    <div className="stat-label">Registered Teams</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{stats.totalPapers}</div>
                    <div className="stat-label">Submitted Papers</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{stats.totalFaculty}</div>
                    <div className="stat-label">Faculty Mentors</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{stats.totalStudents}</div>
                    <div className="stat-label">Student Researchers</div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="filters-bar" style={{ background: 'var(--bg-card)', padding: '16px 20px', border: 'var(--nb-border)', borderRadius: 'var(--radius)', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <label style={{ fontWeight: 800, fontFamily: 'Space Grotesk' }}>FILTER BY TRACK:</label>
                    <select
                        className="form-input"
                        style={{ maxWidth: 280 }}
                        value={selectedTrack}
                        onChange={(e) => setSelectedTrack(e.target.value)}
                    >
                        <option value="">All Track Domains</option>
                        <option value="AI & Machine Learning">AI & Machine Learning</option>
                        <option value="Data Science & Analytics">Data Science & Analytics</option>
                        <option value="IoT & Embedded Systems">IoT & Embedded Systems</option>
                        <option value="Cybersecurity & Blockchain">Cybersecurity & Blockchain</option>
                    </select>
                </div>

                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)' }}>
                    Showing {teams.length} teams
                </div>
            </div>

            {/* Teams & Mentor Allocation Management Table */}
            <div className="section-card" style={{ marginBottom: 32 }}>
                <div className="section-card-header">
                    <h3>🤝 Team to Faculty Mentor Allocation</h3>
                    <span className="badge badge-yellow">{teams.length} Teams Registered</span>
                </div>
                <div className="section-card-body" style={{ padding: 0 }}>
                    <div className="data-table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Group Code</th>
                                    <th>Team Name</th>
                                    <th>Track & Div</th>
                                    <th>Team Leader</th>
                                    <th>Paper Status</th>
                                    <th>Assigned Faculty Mentor</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teams.map(team => (
                                    <tr key={team.id}>
                                        <td><span className="badge badge-yellow">{team.groupCode}</span></td>
                                        <td><strong>{team.teamName}</strong></td>
                                        <td>{team.track} (Div {team.division})</td>
                                        <td>
                                            <div>
                                                <strong>{team.leader?.name || 'N/A'}</strong>
                                                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{team.leader?.email}</div>
                                            </div>
                                        </td>
                                        <td>
                                            {team.paper ? (
                                                <span className={`badge badge-${team.paper.status === 'approved' ? 'green' : team.paper.status === 'rejected' ? 'red' : 'blue'}`}>
                                                    {team.paper.status}
                                                </span>
                                            ) : (
                                                <span className="badge badge-gray">No Paper</span>
                                            )}
                                        </td>
                                        <td>
                                            <select
                                                className="form-input"
                                                style={{ padding: '8px 12px', fontSize: 13, fontWeight: 700, minWidth: 200, background: team.mentor ? '#DCFCE7' : '#EFF6FF', border: 'var(--nb-border-sm)' }}
                                                value={team.mentor_id || ''}
                                                onChange={(e) => handleAssignMentor(team.id, e.target.value)}
                                            >
                                                <option value="">Select Faculty Mentor...</option>
                                                {faculty.map(f => (
                                                    <option key={f.id} value={f.id}>👨‍🏫 {f.name} ({f.department})</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
                                            <button className="btn btn-secondary btn-sm" style={{ background: 'var(--nb-red)', color: 'white' }} onClick={() => handleDeleteTeam(team.id)}>
                                                <HiTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Faculty List Section */}
            <div className="section-card">
                <div className="section-card-header">
                    <h3>👨‍🏫 Registered Faculty Mentors</h3>
                    <span className="badge badge-purple">{faculty.length} Mentors</span>
                </div>
                <div className="section-card-body">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                        {faculty.map(f => {
                            const assignedCount = teams.filter(t => t.mentor_id === f.id).length;
                            return (
                                <div key={f.id} style={{ padding: 16, background: 'var(--bg-card)', border: 'var(--nb-border-sm)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-sm)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <h4 style={{ fontSize: 16, fontWeight: 800 }}>{f.name}</h4>
                                            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginTop: 2 }}>{f.email}</p>
                                        </div>
                                        <span className="badge badge-green" style={{ fontSize: 11 }}>{assignedCount} Teams</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Faculty Creation Modal */}
            {showFacultyModal && (
                <div className="modal-overlay">
                    <div className="auth-card glass-modal" style={{ width: '100%', maxWidth: 480, margin: 20 }}>
                        <h2>Create Faculty Mentor Account</h2>
                        <form onSubmit={handleCreateFaculty} style={{ marginTop: 20 }}>
                            <div className="form-group">
                                <label>Faculty Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Prof. Name"
                                    value={newFaculty.name}
                                    onChange={(e) => setNewFaculty(prev => ({ ...prev, name: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    placeholder="prof.email@pccoepune.org"
                                    value={newFaculty.email}
                                    onChange={(e) => setNewFaculty(prev => ({ ...prev, email: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    className="form-input"
                                    placeholder="Min 6 characters"
                                    value={newFaculty.password}
                                    onChange={(e) => setNewFaculty(prev => ({ ...prev, password: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone / Mobile</label>
                                <input
                                    type="tel"
                                    className="form-input"
                                    placeholder="Phone number"
                                    value={newFaculty.phone}
                                    onChange={(e) => setNewFaculty(prev => ({ ...prev, phone: e.target.value }))}
                                />
                            </div>
                            <div className="form-group">
                                <label>Department</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={newFaculty.department}
                                    onChange={(e) => setNewFaculty(prev => ({ ...prev, department: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="form-buttons">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowFacultyModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Create Faculty Account</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
