'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { HiArrowLeft, HiUsers, HiAcademicCap, HiArrowDownTray } from 'react-icons/hi2';

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
    return (
        <div className="page-container">
            <header className="page-header">
                <Link href="/" className="btn-back">
                    <HiArrowLeft /> Back to Home
                </Link>
                <h1>Past Research Papers Gallery</h1>
                <p style={{ marginTop: 8 }}>
                    Explore outstanding research work published by alumni of the PCCOE AIML Department.
                </p>
            </header>

            <motion.div
                className="papers-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {previousPapers.map((paper, index) => (
                    <motion.div
                        key={index}
                        className="paper-card"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.08 }}
                    >
                        <div className="paper-track-badge">{paper.track}</div>
                        <h3 className="paper-title">{paper.title}</h3>

                        <div className="paper-details">
                            <div className="detail-item">
                                <HiUsers className="detail-icon" />
                                <div>
                                    <span style={{ fontWeight: 800 }}>Team: </span>
                                    <span>{paper.team}</span>
                                </div>
                            </div>
                            <div className="detail-item">
                                <HiAcademicCap className="detail-icon" />
                                <div>
                                    <span style={{ fontWeight: 800 }}>Mentor: </span>
                                    <span>{paper.mentor}</span>
                                </div>
                            </div>
                        </div>

                        <div className="paper-footer">
                            <span className="paper-year">{paper.year} Edition</span>
                            <button className="btn btn-primary btn-sm" onClick={() => alert('Sample paper download')}>
                                <HiArrowDownTray /> Sample PDF
                            </button>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
