'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { registerTeam } from '@/services/api';
import toast from 'react-hot-toast';
import { HiPlus, HiXMark, HiUserGroup, HiAcademicCap } from 'react-icons/hi2';
import confetti from 'canvas-confetti';

const TRACKS = [
    { name: 'AI & Machine Learning', short: 'AI & ML' },
    { name: 'Data Science & Analytics', short: 'Data Sci' },
    { name: 'IoT & Embedded Systems', short: 'IoT' },
    { name: 'Cybersecurity & Blockchain', short: 'CyberSec' }
];

const DIVISIONS = [
    { value: 'A', label: 'Division A' },
    { value: 'B', label: 'Division B' }
];

const emptyMember = { name: '', email: '', password: '', phone: '', prn: '' };

export default function Register() {
    const [accountType, setAccountType] = useState('student'); // 'student' or 'faculty'

    // Faculty form
    const [facultyData, setFacultyData] = useState({ name: '', email: '', password: '', department: 'AIML' });

    // Student form steps
    const [step, setStep] = useState(1);
    const [track, setTrack] = useState('');
    const [division, setDivision] = useState('');
    const [teamName, setTeamName] = useState('');
    const [members, setMembers] = useState([
        { ...emptyMember },
        { ...emptyMember }
    ]);

    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const totalSteps = 4;

    const updateMember = (index, field, value) => {
        const updated = [...members];
        updated[index] = { ...updated[index], [field]: value };
        setMembers(updated);
    };

    const addMember = () => {
        if (members.length < 4) {
            setMembers([...members, { ...emptyMember }]);
        }
    };

    const removeMember = (index) => {
        if (members.length > 2 && index > 0) {
            setMembers(members.filter((_, i) => i !== index));
        }
    };

    const nextStep = () => {
        if (step === 1 && !track) {
            toast.error('Please select a conference track');
            return;
        }
        if (step === 2 && !division) {
            toast.error('Please select a division');
            return;
        }
        if (step === 3 && !teamName.trim()) {
            toast.error('Please enter a team name');
            return;
        }
        setStep(step + 1);
    };

    const handleFacultySubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await registerTeam({
                accountType: 'faculty',
                ...facultyData
            });
            login(res.data.token, res.data.user);
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            toast.success('Faculty Mentor account registered successfully! 🎉');
            router.push('/faculty');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Faculty registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleTeamSubmit = async (e) => {
        e.preventDefault();
        for (let i = 0; i < members.length; i++) {
            const m = members[i];
            if (!m.name || !m.email || !m.password || !m.phone || !m.prn) {
                toast.error(`Please fill all fields for Member ${i + 1}`);
                return;
            }
            if (m.password.length < 6) {
                toast.error(`Password for Member ${i + 1} must be at least 6 characters`);
                return;
            }
        }

        setLoading(true);
        try {
            const res = await registerTeam({
                accountType: 'student',
                teamName,
                track,
                division,
                members
            });
            login(res.data.token, res.data.user);
            confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
            toast.success('Student Team registered successfully in Supabase! 🎉');
            router.push('/team');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
            <div className="register-card">
                <h1>Registration Portal</h1>
                <p>Choose your account type to register for Young's Research Conference</p>

                {/* Account Type Selector */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
                    <button
                        type="button"
                        className={`btn ${accountType === 'student' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setAccountType('student')}
                        style={{ padding: '12px 16px', fontSize: 15 }}
                    >
                        <HiUserGroup /> Student Team
                    </button>
                    <button
                        type="button"
                        className={`btn ${accountType === 'faculty' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setAccountType('faculty')}
                        style={{ padding: '12px 16px', fontSize: 15 }}
                    >
                        <HiAcademicCap /> Faculty Mentor
                    </button>
                </div>

                {/* FACULTY REGISTRATION FORM */}
                {accountType === 'faculty' && (
                    <form onSubmit={handleFacultySubmit}>
                        <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Faculty Mentor Details</h3>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Prof. Full Name"
                                value={facultyData.name}
                                onChange={(e) => setFacultyData(prev => ({ ...prev, name: e.target.value }))}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                className="form-input"
                                placeholder="prof.name@pccoepune.org"
                                value={facultyData.email}
                                onChange={(e) => setFacultyData(prev => ({ ...prev, email: e.target.value }))}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                className="form-input"
                                placeholder="Min 6 characters"
                                value={facultyData.password}
                                onChange={(e) => setFacultyData(prev => ({ ...prev, password: e.target.value }))}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Department</label>
                            <input
                                type="text"
                                className="form-input"
                                value={facultyData.department}
                                onChange={(e) => setFacultyData(prev => ({ ...prev, department: e.target.value }))}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 12 }} disabled={loading}>
                            {loading ? 'Creating Faculty Account...' : 'Register as Faculty Mentor'}
                        </button>
                    </form>
                )}

                {/* STUDENT TEAM REGISTRATION FORM */}
                {accountType === 'student' && (
                    <div>
                        {/* Step indicators */}
                        <div className="steps-indicator">
                            {Array.from({ length: totalSteps }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`step-dot ${i + 1 === step ? 'active' : ''} ${i + 1 < step ? 'completed' : ''}`}
                                />
                            ))}
                        </div>

                        <form onSubmit={handleTeamSubmit}>
                            {/* Step 1: Track */}
                            {step === 1 && (
                                <div>
                                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Select Conference Track</h3>
                                    <div className="track-selection">
                                        {TRACKS.map(t => (
                                            <div
                                                key={t.name}
                                                className={`track-option ${track === t.name ? 'selected' : ''}`}
                                                onClick={() => setTrack(t.name)}
                                            >
                                                <h4>{t.short}</h4>
                                                <p>{t.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="form-buttons">
                                        <button type="button" className="btn btn-primary" onClick={nextStep}>
                                            Continue
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Division */}
                            {step === 2 && (
                                <div>
                                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Select Your Division</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                                        {DIVISIONS.map(d => (
                                            <button
                                                key={d.value}
                                                type="button"
                                                className={`track-option ${division === d.value ? 'selected' : ''}`}
                                                onClick={() => setDivision(d.value)}
                                                style={{ padding: 20 }}
                                            >
                                                <h4 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>{d.value}</h4>
                                                <p>{d.label}</p>
                                            </button>
                                        ))}
                                    </div>
                                    <div style={{ padding: '12px 16px', background: 'var(--nb-yellow)', border: 'var(--nb-border-sm)', borderRadius: 8, marginBottom: 20, fontSize: 13, fontWeight: 700 }}>
                                        Track: {track}
                                    </div>
                                    <div className="form-buttons">
                                        <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>Back</button>
                                        <button type="button" className="btn btn-primary" onClick={nextStep}>Continue</button>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Team Name */}
                            {step === 3 && (
                                <div>
                                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Team Details</h3>
                                    <div className="form-group">
                                        <label>Team Name</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Enter a unique team name"
                                            value={teamName}
                                            onChange={(e) => setTeamName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div style={{ padding: '12px 16px', background: 'var(--nb-yellow)', border: 'var(--nb-border-sm)', borderRadius: 8, marginBottom: 20, fontSize: 13, fontWeight: 700 }}>
                                        Track: {track} • Division: {division}
                                    </div>
                                    <div className="form-buttons">
                                        <button type="button" className="btn btn-secondary" onClick={() => setStep(2)}>Back</button>
                                        <button type="button" className="btn btn-primary" onClick={nextStep}>Continue</button>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Members */}
                            {step === 4 && (
                                <div>
                                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Team Members (2-4 Students)</h3>
                                    {members.map((member, index) => (
                                        <div className="member-card" key={index}>
                                            <h3>
                                                <span>
                                                    {index === 0 ? '👑 Team Leader' : `Member ${index + 1}`}
                                                </span>
                                                {index > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeMember(index)}
                                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--nb-red)', fontSize: 18 }}
                                                    >
                                                        <HiXMark />
                                                    </button>
                                                )}
                                            </h3>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                                <div className="form-group">
                                                    <label>Full Name</label>
                                                    <input
                                                        type="text"
                                                        className="form-input"
                                                        placeholder="Full name"
                                                        value={member.name}
                                                        onChange={(e) => updateMember(index, 'name', e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Email</label>
                                                    <input
                                                        type="email"
                                                        className="form-input"
                                                        placeholder="Email address"
                                                        value={member.email}
                                                        onChange={(e) => updateMember(index, 'email', e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Password</label>
                                                    <input
                                                        type="password"
                                                        className="form-input"
                                                        placeholder="Min 6 chars"
                                                        value={member.password}
                                                        onChange={(e) => updateMember(index, 'password', e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>PRN</label>
                                                    <input
                                                        type="text"
                                                        className="form-input"
                                                        placeholder="Student PRN"
                                                        value={member.prn}
                                                        onChange={(e) => updateMember(index, 'prn', e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                                    <label>Phone</label>
                                                    <input
                                                        type="tel"
                                                        className="form-input"
                                                        placeholder="Phone number"
                                                        value={member.phone}
                                                        onChange={(e) => updateMember(index, 'phone', e.target.value)}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {members.length < 4 && (
                                        <button type="button" className="btn btn-secondary btn-sm" style={{ marginBottom: 20 }} onClick={addMember}>
                                            <HiPlus style={{ verticalAlign: 'middle', marginRight: 4 }} /> Add Another Member
                                        </button>
                                    )}

                                    <div className="form-buttons">
                                        <button type="button" className="btn btn-secondary" onClick={() => setStep(3)}>Back</button>
                                        <button type="submit" className="btn btn-primary" disabled={loading}>
                                            {loading ? 'Registering...' : 'Register Team'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
