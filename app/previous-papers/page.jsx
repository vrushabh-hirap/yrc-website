'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HiArrowLeft, HiUsers, HiAcademicCap, HiArrowDownTray, HiMagnifyingGlass } from 'react-icons/hi2';

const previousPapers = [
    {
        title: "Ensemble Deep Learning Model For Improving CNN Classifier Performance",
        team: "Ruturaj S. Pandharkar, Abhishek Nikam, Trupti Sukale",
        mentor: "Prof. AIML Department",
        track: "AI & Machine Learning",
        year: "2024"
    },
    {
        title: "Enhancing Road Safety And Efficiency With AI-Optimized Dynamic Road Pricing",
        team: "Prasad Pawar, Akhilesh Mohorir, Om Shrigiriwar",
        mentor: "Prof. AIML Department",
        track: "AI & Machine Learning",
        year: "2024"
    },
    {
        title: "Computer Vision Bot For Marine Waste Cleaning Using YOLO-V8",
        team: "Piyush Daspute, Om Deshmukh, Om Pangaokar",
        mentor: "Prof. AIML Department",
        track: "AI & Machine Learning",
        year: "2024"
    },
    {
        title: "Stock Market Volatility Prediction Using Deep ML Models",
        team: "Atharva Palande, Ayurshi Jhawar, Keshav Mittal",
        mentor: "Prof. AIML Department",
        track: "Data Science & Analytics",
        year: "2024"
    },
    {
        title: "IoT Smart Grid Energy Optimization & Predictive Load Balancing",
        team: "Janhavi S. Dhamak, Sneha I. Mali, Siddhika D. Pujari",
        mentor: "Prof. AIML Department",
        track: "IoT & Embedded Systems",
        year: "2024"
    },
    {
        title: "Blockchain Smart Contracts Security Analysis & Vulnerability Scanner",
        team: "Raj Patil, Abhay Ingle, Raghvendra Kotgire",
        mentor: "Prof. AIML Department",
        track: "Cybersecurity & Blockchain",
        year: "2024"
    }
];

export default function PreviousPapers() {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredPapers = previousPapers.filter(paper =>
        paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.track.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="page-container">
            <header className="page-header">
                <Link href="/" className="btn-back">
                    <HiArrowLeft /> Back to Home
                </Link>
                <h1>Past Research Papers Gallery</h1>
                <p style={{ marginTop: 8, color: 'var(--ink-muted-80)' }}>
                    Explore outstanding research work published by alumni of the PCCOE AIML Department.
                </p>

                {/* Apple Search Input Pill */}
                <div style={{ marginTop: 24, position: 'relative', maxWidth: 480 }}>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search by title, author, or track..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ width: '100%', paddingLeft: 44 }}
                    />
                    <HiMagnifyingGlass style={{ position: 'absolute', left: 16, top: 14, fontSize: 18, color: 'var(--ink-muted-48)' }} />
                </div>
            </header>

            <motion.div
                className="papers-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {filteredPapers.map((paper, index) => (
                    <motion.div
                        key={index}
                        className="store-utility-card paper-card"
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.06 }}
                    >
                        <div>
                            <span className="badge">{paper.track}</span>
                            <h3 className="paper-title" style={{ marginTop: 12 }}>{paper.title}</h3>

                            <div className="paper-details">
                                <div className="detail-item">
                                    <HiUsers className="detail-icon" />
                                    <div>
                                        <span style={{ fontWeight: 600 }}>Team: </span>
                                        <span>{paper.team}</span>
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <HiAcademicCap className="detail-icon" />
                                    <div>
                                        <span style={{ fontWeight: 600 }}>Mentor: </span>
                                        <span>{paper.mentor}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="paper-footer">
                            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-muted-80)' }}>{paper.year} Edition</span>
                            <button className="btn btn-primary btn-sm" onClick={() => alert('Sample paper download requested')}>
                                <HiArrowDownTray /> Sample PDF
                            </button>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
