'use client';

import { useState, useEffect } from 'react';
import { getAdminStats, getAllTeams, getFacultyList, createFacultyAccount, assignMentor, deleteTeam } from '@/services/api';
import toast from 'react-hot-toast';
import { HiUsers, HiDocumentText, HiAcademicCap, HiTrash, HiUserPlus } from 'react-icons/hi2';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ totalTeams: 0, totalPapers: 0, totalFaculty: 0, totalStudents: 0 });
    const [teams, setTeams] = useState([]);
    const [faculty, setFaculty] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTrack, setSelectedTrack] = useState('');

    // Faculty modal form
    const [newFaculty, setNewFaculty] = useState({ name: '', email: '', password: '', department: 'AIML' });
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
            toast.error('Failed to load admin dashboard data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, [selectedTrack]);

    const handleAssignMentor = async (teamId, mentorId) => {
        if (!mentorId) return;
        try {
            await assignMentor(teamId, mentorId);
            toast.success('Faculty mentor assigned successfully!');
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
            toast.success('Faculty account created! 🎉');
            setShowFacultyModal(false);
            setNewFaculty({ name: '', email: '', password: '', department: 'AIML' });
            loadData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create faculty account');
        }
    };

    if (loading) return <div className="loader-page"><div className="spinner"></div></div>;

    return (
        <div className="page-container">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <h1>Admin Command Center</h1>
                    <p style={{ marginTop: 4 }}>Manage teams, faculty mentors, and monitor research progress</p>
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
            <div className="filters-bar">
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

            {/* Teams Management Table */}
            <div className="data-table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Group Code</th>
                            <th>Team Name</th>
                            <th>Track & Div</th>
                            <th>Leader</th>
                            <th>Paper Status</th>
                            <th>Assign Mentor</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teams.map(team => (
                            <tr key={team.id}>
                                <td><span className="badge badge-yellow">{team.groupCode}</span></td>
                                <td><strong>{team.teamName}</strong></td>
                                <td>{team.track} (Div {team.division})</td>
                                <td>{team.leader?.name || 'N/A'}</td>
                                <td>
                                    {team.paper ? (
                                        <span className={`badge badge-${team.paper.status === 'approved' ? 'green' : 'blue'}`}>
                                            {team.paper.status}
                                        </span>
                                    ) : (
                                        <span className="badge badge-gray">No Paper</span>
                                    )}
                                </td>
                                <td>
                                    <select
                                        className="form-input"
                                        style={{ padding: '6px 10px', fontSize: 13 }}
                                        value={team.mentor_id || ''}
                                        onChange={(e) => handleAssignMentor(team.id, e.target.value)}
                                    >
                                        <option value="">Select Mentor...</option>
                                        {faculty.map(f => (
                                            <option key={f.id} value={f.id}>{f.name}</option>
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

            {/* Faculty Creation Modal */}
            {showFacultyModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
                    <div className="auth-card" style={{ width: '100%', maxWidth: 480, margin: 20 }}>
                        <h2>Create Faculty Account</h2>
                        <form onSubmit={handleCreateFaculty} style={{ marginTop: 20 }}>
                            <div className="form-group">
                                <label>Faculty Name</label>
                                <input
                                    type="text"
                                    className="form-input"
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
                                    value={newFaculty.password}
                                    onChange={(e) => setNewFaculty(prev => ({ ...prev, password: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="form-buttons">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowFacultyModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Create Account</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
