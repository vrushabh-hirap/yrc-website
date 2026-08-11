'use client';

import { useState, useEffect } from 'react';
import { getAssignedPapers, approvePaper, rejectPaper, updatePublicationStatus, submitFeedback } from '@/services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { HiDocumentArrowDown, HiCheckCircle, HiXMark, HiChevronDown } from 'react-icons/hi2';
import confetti from 'canvas-confetti';

export default function FacultyDashboard() {
    const [teams, setTeams] = useState([]);
    const [expandedTeam, setExpandedTeam] = useState(null);
    const [rejectionReason, setRejectionReason] = useState({});
    const [feedbackContent, setFeedbackContent] = useState({});
    const [submitting, setSubmitting] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const res = await getAssignedPapers();
            setTeams(res.data);
        } catch (err) {
            toast.error('Failed to load assigned papers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const toggleTeam = (teamId) => {
        setExpandedTeam(prev => prev === teamId ? null : teamId);
    };

    const handleApprove = async (paperId) => {
        if (!confirm('Approve this research paper?')) return;
        setSubmitting(prev => ({ ...prev, [paperId]: true }));
        try {
            await approvePaper(paperId);
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            toast.success('Paper approved successfully! 🎉');
            fetchData();
        } catch (err) {
            toast.error('Failed to approve paper');
        } finally {
            setSubmitting(prev => ({ ...prev, [paperId]: false }));
        }
    };

    const handleReject = async (paperId) => {
        const reason = rejectionReason[paperId];
        if (!reason?.trim()) {
            toast.error('Please provide a rejection reason');
            return;
        }
        setSubmitting(prev => ({ ...prev, [paperId]: true }));
        try {
            await rejectPaper(paperId, reason);
            toast.success('Paper rejected. Student team notified for resubmission.');
            fetchData();
        } catch (err) {
            toast.error('Failed to reject paper');
        } finally {
            setSubmitting(prev => ({ ...prev, [paperId]: false }));
        }
    };

    const handleFeedback = async (paperId) => {
        const content = feedbackContent[paperId];
        if (!content?.trim()) {
            toast.error('Please enter feedback');
            return;
        }
        try {
            await submitFeedback(paperId, content);
            toast.success('Feedback sent to student team! 💬');
            setFeedbackContent(prev => ({ ...prev, [paperId]: '' }));
            fetchData();
        } catch (err) {
            toast.error('Failed to send feedback');
        }
    };

    if (loading) return <div className="loader-page"><div className="spinner"></div></div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Faculty Review Dashboard</h1>
                <p style={{ marginTop: 8 }}>
                    Review assigned student research teams, provide written feedback, and approve/reject papers.
                </p>
            </div>

            {teams.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">📋</div>
                    <h3>No Teams Assigned Yet</h3>
                    <p>You haven't been assigned any student research teams by the admin yet.</p>
                </div>
            ) : (
                <div>
                    {teams.map(team => (
                        <div key={team.id} className="accordion-item">
                            <div className="accordion-header" onClick={() => toggleTeam(team.id)}>
                                <div>
                                    <span className="badge badge-yellow" style={{ marginRight: 8 }}>{team.groupCode}</span>
                                    <span>{team.teamName}</span>
                                    <span style={{ fontSize: 13, color: 'var(--text-secondary)', marginLeft: 12 }}>({team.track})</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    {team.paper ? (
                                        <span className={`badge badge-${team.paper.status === 'approved' ? 'green' : team.paper.status === 'rejected' ? 'red' : 'blue'}`}>
                                            {team.paper.status}
                                        </span>
                                    ) : (
                                        <span className="badge badge-gray">No Submission</span>
                                    )}
                                    <HiChevronDown style={{ transform: expandedTeam === team.id ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                                </div>
                            </div>

                            {expandedTeam === team.id && (
                                <div className="accordion-body">
                                    <div style={{ marginBottom: 20 }}>
                                        <h4 style={{ fontSize: 16, fontWeight: 800, marginBottom: 8 }}>Team Members:</h4>
                                        <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>
                                            {team.members.map(m => `${m.name} (${m.email})`).join(', ')}
                                        </p>
                                    </div>

                                    {team.paper ? (
                                        <div>
                                            <h4 style={{ fontSize: 18, fontWeight: 800 }}>{team.paper.title}</h4>
                                            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', margin: '8px 0 16px 0' }}>
                                                {team.paper.abstract}
                                            </p>

                                            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
                                                {team.paper.fileUrl && (
                                                    <a href={team.paper.fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                                                        <HiDocumentArrowDown /> Download PDF (Supabase)
                                                    </a>
                                                )}

                                                <button className="btn btn-primary btn-sm" onClick={() => handleApprove(team.paper.id)} disabled={submitting[team.paper.id]}>
                                                    <HiCheckCircle /> Approve Paper
                                                </button>
                                            </div>

                                            {/* Rejection input */}
                                            <div style={{ marginTop: 20, paddingTop: 20, borderTop: 'var(--nb-border-sm)' }}>
                                                <h4 style={{ fontSize: 15, fontWeight: 800, marginBottom: 8 }}>Request Revision / Reject:</h4>
                                                <div style={{ display: 'flex', gap: 12 }}>
                                                    <input
                                                        type="text"
                                                        className="form-input"
                                                        placeholder="Enter mandatory reason for revision"
                                                        value={rejectionReason[team.paper.id] || ''}
                                                        onChange={(e) => setRejectionReason(prev => ({ ...prev, [team.paper.id]: e.target.value }))}
                                                    />
                                                    <button className="btn btn-secondary btn-sm" style={{ background: 'var(--nb-red)', color: 'white' }} onClick={() => handleReject(team.paper.id)}>
                                                        Reject
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Written Feedback input */}
                                            <div style={{ marginTop: 20, paddingTop: 20, borderTop: 'var(--nb-border-sm)' }}>
                                                <h4 style={{ fontSize: 15, fontWeight: 800, marginBottom: 8 }}>Send Mentor Feedback:</h4>
                                                <div style={{ display: 'flex', gap: 12 }}>
                                                    <input
                                                        type="text"
                                                        className="form-input"
                                                        placeholder="Write comments / suggestions..."
                                                        value={feedbackContent[team.paper.id] || ''}
                                                        onChange={(e) => setFeedbackContent(prev => ({ ...prev, [team.paper.id]: e.target.value }))}
                                                    />
                                                    <button className="btn btn-primary btn-sm" onClick={() => handleFeedback(team.paper.id)}>
                                                        Send Feedback
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Team has not submitted a research paper yet.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
