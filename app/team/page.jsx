'use client';

import { useState, useEffect } from 'react';
import { getMyTeam, submitPaper } from '@/services/api';
import toast from 'react-hot-toast';
import { HiDocumentArrowUp, HiCloudArrowUp, HiCheckCircle, HiClock, HiXMark, HiArrowPath } from 'react-icons/hi2';
import confetti from 'canvas-confetti';

export default function TeamDashboard() {
    const [team, setTeam] = useState(null);
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [isResubmitting, setIsResubmitting] = useState(false);

    // Paper form
    const [paperTitle, setPaperTitle] = useState('');
    const [paperAbstract, setPaperAbstract] = useState('');
    const [paperFile, setPaperFile] = useState(null);

    const fetchTeam = async () => {
        try {
            const res = await getMyTeam();
            setTeam(res.data.team);
            setFeedback(res.data.feedback);
            
            if (res.data.team?.paper && res.data.team.paper.status === 'rejected') {
                setPaperTitle(res.data.team.paper.title);
                setPaperAbstract(res.data.team.paper.abstract);
            }
        } catch (err) {
            toast.error('Failed to load team data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchTeam(); }, []);

    const handlePaperSubmit = async (e) => {
        e.preventDefault();
        if (!paperFile) {
            toast.error('Please select a PDF file');
            return;
        }
        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('title', paperTitle);
            formData.append('abstract', paperAbstract);
            formData.append('paper', paperFile);
            
            await submitPaper(formData);
            
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });

            const messageType = isResubmitting ? 'resubmitted' : 'submitted';
            toast.success(`Paper ${messageType} successfully to Supabase Storage! 🎉`);
            
            setPaperTitle('');
            setPaperAbstract('');
            setPaperFile(null);
            setIsResubmitting(false);
            
            fetchTeam();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit paper');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="loader-page"><div className="spinner"></div></div>;
    
    if (!team) return (
        <div className="page-container">
            <div className="empty-state">
                <div className="empty-state-icon">😕</div>
                <h3>No Team Found</h3>
                <p>You don't appear to be part of any team yet.</p>
            </div>
        </div>
    );

    const statusBadge = (status) => {
        switch (status) {
            case 'submitted': 
                return <span className="badge badge-blue"><HiClock style={{ marginRight: 4 }} /> Submitted</span>;
            case 'under_review': 
                return <span className="badge badge-amber"><HiClock style={{ marginRight: 4 }} /> Under Review</span>;
            case 'rejected': 
                return <span className="badge badge-red"><HiXMark style={{ marginRight: 4 }} /> Requires Revision</span>;
            case 'approved': 
                return <span className="badge badge-green"><HiCheckCircle style={{ marginRight: 4 }} /> Approved</span>;
            default: 
                return <span className="badge badge-gray">Unknown</span>;
        }
    };

    const paper = team.paper;
    const isRejected = paper && paper.status === 'rejected';
    const isApproved = paper && paper.status === 'approved';
    const canSubmitNew = !paper || isRejected;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>{team.teamName}</h1>
                <p style={{ marginTop: 8 }}>
                    <span className="badge badge-teal" style={{ marginRight: 8 }}>{team.track}</span>
                    <span className="badge badge-blue" style={{ marginRight: 8 }}>Division {team.division}</span>
                    <span className="badge badge-green" style={{ marginRight: 8 }}>Group Code: {team.groupCode}</span>
                </p>
            </div>

            <div className="dashboard-grid">
                {/* Left Column */}
                <div>
                    {/* Members */}
                    <div className="section-card" style={{ marginBottom: 24 }}>
                        <div className="section-card-header">
                            <h3>Team Members</h3>
                            <span className="badge badge-gray">{team.members.length} members</span>
                        </div>
                        <div className="section-card-body">
                            <ul className="team-members-list">
                                {team.members.map((m, i) => (
                                    <li className="team-member-item" key={m.id || i}>
                                        <div className="team-member-avatar">
                                            {m.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="team-member-info">
                                            <h4>
                                                {m.name}
                                                {team.leader && m.id === team.leader.id && (
                                                    <span className="badge badge-yellow" style={{ fontSize: 10, marginLeft: 6 }}>👑 Leader</span>
                                                )}
                                            </h4>
                                            <p>{m.email} • PRN: {m.prn}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Assigned Mentor */}
                    <div className="section-card">
                        <div className="section-card-header">
                            <h3>Assigned Mentor</h3>
                        </div>
                        <div className="section-card-body">
                            {team.mentor ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                    <div className="team-member-avatar" style={{ background: 'var(--nb-yellow)' }}>
                                        {team.mentor.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: 18, fontWeight: 800 }}>{team.mentor.name}</h4>
                                        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>{team.mentor.email}</p>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <p style={{ fontWeight: 600 }}>No mentor assigned yet. Wait for admin allocation.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div>
                    {/* Paper Section */}
                    <div className="section-card" style={{ marginBottom: 24 }}>
                        <div className="section-card-header">
                            <h3>Research Paper</h3>
                            {paper && statusBadge(paper.status)}
                        </div>
                        <div className="section-card-body">
                            {paper && !isRejected ? (
                                <div>
                                    <h4 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>{paper.title}</h4>
                                    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 16 }}>{paper.abstract}</p>
                                    {paper.fileUrl && (
                                        <a href={paper.fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                                            📄 View Paper PDF (Supabase)
                                        </a>
                                    )}
                                </div>
                            ) : (
                                <form onSubmit={handlePaperSubmit}>
                                    {isRejected && (
                                        <div style={{ padding: 16, background: '#FFEBEB', border: 'var(--nb-border-sm)', borderRadius: 8, marginBottom: 16 }}>
                                            <h4 style={{ color: 'var(--nb-red)', fontWeight: 800 }}>Revision Required</h4>
                                            <p style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>Reason: {paper.rejectionReason}</p>
                                        </div>
                                    )}

                                    <div className="form-group">
                                        <label>Paper Title</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Enter research paper title"
                                            value={paperTitle}
                                            onChange={(e) => setPaperTitle(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Abstract</label>
                                        <textarea
                                            className="form-input"
                                            rows={4}
                                            placeholder="Brief description of research"
                                            value={paperAbstract}
                                            onChange={(e) => setPaperAbstract(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>PDF File (Max 10 MB)</label>
                                        <input
                                            type="file"
                                            accept="application/pdf"
                                            className="form-input"
                                            onChange={(e) => setPaperFile(e.target.files[0])}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
                                        {submitting ? 'Uploading to Supabase...' : (isRejected ? 'Resubmit Paper' : 'Submit Paper')}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
