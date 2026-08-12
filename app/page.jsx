'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { HiAcademicCap, HiUsers, HiDocumentText, HiChatBubbleLeftRight, HiCpuChip, HiChartBar, HiSignal, HiShieldCheck, HiSparkles, HiArrowRight } from 'react-icons/hi2';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import Antigravity from '@/components/Antigravity';

const tracks = [
    {
        name: 'AI & Machine Learning',
        desc: 'Neural networks, deep learning, NLP, computer vision, and generative AI.',
        icon: <HiCpuChip />,
        badge: 'TRACK 01',
        color: '#2563EB'
    },
    {
        name: 'Data Science & Analytics',
        desc: 'Data mining, big data, visualization, and statistical modeling.',
        icon: <HiChartBar />,
        badge: 'TRACK 02',
        color: '#38BDF8'
    },
    {
        name: 'IoT & Embedded Systems',
        desc: 'Smart devices, sensor networks, edge computing, and automation.',
        icon: <HiSignal />,
        badge: 'TRACK 03',
        color: '#6366F1'
    },
    {
        name: 'Cybersecurity & Blockchain',
        desc: 'Network security, cryptography, distributed ledger, and ethical hacking.',
        icon: <HiShieldCheck />,
        badge: 'TRACK 04',
        color: '#0EA5E9'
    }
];

const timelineData = [
    {
        stage: "Team Registration",
        duration: "5 Days",
        date: "Early September",
        desc: "Form your team of 2–4 members and choose your conference track."
    },
    {
        stage: "Mentor Allocation & Research",
        duration: "45 Days",
        date: "Mid September - October",
        desc: "Assigned faculty mentors guide your research work and paper drafting."
    },
    {
        stage: "Paper Submission",
        duration: "Deadline",
        date: "Early November",
        desc: "Submit your final research paper in IEEE format via the portal."
    },
    {
        stage: "YRC Conference",
        duration: "Main Event",
        date: "Late November",
        desc: "Present your research paper to industry experts and academic reviewers."
    },
    {
        stage: "Winner Announcement",
        duration: "Grand Finale",
        date: "December",
        desc: "Awards, certificates, and recognition for top-performing research teams."
    }
];

const faqData = [
    {
        question: "Who can participate in YRC?",
        answer: "YRC is specifically designed for second-year (SY) students of the AIML department at PCCOE Pune to encourage early research and innovation."
    },
    {
        question: "What is the team size requirement?",
        answer: "Each team must consist of 2 to 4 students. All members must be currently in their second year of study in Division A or B."
    },
    {
        question: "How are mentors assigned?",
        answer: "Once your team registers and selects a track, the AIML department will assign a dedicated faculty mentor specialized in that domain to guide you."
    },
    {
        question: "Do I need a completed project to register?",
        answer: "No, you only need a research idea or problem statement within your chosen track. Your assigned mentor will help you turn it into a paper."
    },
    {
        question: "What format should the paper be in?",
        answer: "Papers must be submitted in standard IEEE double-column PDF format (max file size: 10 MB) directly through your student team dashboard."
    }
];

const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            ease: [0.22, 1, 0.36, 1]
        }
    }
};

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
};

export default function Home() {
    const timelineRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: timelineRef,
        offset: ["start end", "end end"]
    });

    const scaleY = useSpring(scrollYProgress, {
        stiffness: 60,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <div>
            {/* Announcement Marquee Ticker */}
            <div className="marquee-banner">
                <div className="marquee-content">
                    <span>⚡ YRC 2026 SUBMISSIONS ARE NOW OPEN</span>
                    <span>🚀 PCCOE AIML DEPARTMENT</span>
                    <span>🎓 REGISTRATION DEADLINE APPROACHING</span>
                    <span>⚡ 4 CUTTING-EDGE TRACKS</span>
                    <span>⚡ YRC 2026 SUBMISSIONS ARE NOW OPEN</span>
                    <span>🚀 PCCOE AIML DEPARTMENT</span>
                    <span>🎓 REGISTRATION DEADLINE APPROACHING</span>
                    <span>⚡ 4 CUTTING-EDGE TRACKS</span>
                </div>
            </div>

            {/* Hero Section */}
            <section className="hero" style={{ minHeight: 'calc(100vh - 120px)', display: 'flex', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                <Antigravity
                    count={240}
                    magnetRadius={7}
                    ringRadius={9}
                    waveSpeed={0.25}
                    waveAmplitude={1.0}
                    particleSize={2.0}
                    lerpSpeed={0.03}
                    color="#38BDF8"
                    autoAnimate
                    particleVariance={1.5}
                    rotationSpeed={0.001}
                    depthFactor={1.5}
                    pulseSpeed={2.0}
                    particleShape="capsule"
                    fieldStrength={9}
                />

                <motion.div
                    className="hero-content"
                    initial={{ opacity: 0, scale: 0.92, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="hero-tag">
                        <HiSparkles /> SY AIML ANNUAL RESEARCH EVENT
                    </div>

                    <h1>
                        Young's Research <br />
                        <span className="highlight">Conference 2026</span>
                    </h1>

                    <p>
                        The ultimate intra-departmental research portal for second-year AIML students.
                        Form your team, select your track, collaborate with faculty mentors, and publish your work.
                    </p>

                    <div className="hero-buttons">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link href="/register" className="btn-hero btn-hero-primary">
                                Register Your Team <HiArrowRight />
                            </Link>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link href="/login" className="btn-hero btn-hero-outline">
                                Team Login
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            <div style={{ position: 'relative', zIndex: 2, backgroundColor: 'var(--bg)', paddingTop: '60px' }}>
                {/* Conference Tracks */}
                <section className="tracks-section" id="tracks">
                    <motion.div
                        className="section-title"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                    >
                        <h2>Conference Tracks</h2>
                        <p>Choose from 4 domain tracks led by expert faculty mentors</p>
                    </motion.div>

                    <motion.div
                        className="tracks-grid"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-40px" }}
                    >
                        {tracks.map((track, i) => (
                            <motion.div
                                className="track-card"
                                key={i}
                                variants={fadeInUp}
                            >
                                <span className="neo-sticker sticker-rotate-left" style={{ background: track.color, marginBottom: 16 }}>
                                    {track.badge}
                                </span>
                                <div className="track-icon">{track.icon}</div>
                                <h3>{track.name}</h3>
                                <p>{track.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </section>

                {/* Event Timeline Roadmap */}
                <section className="timeline-section" ref={timelineRef}>
                    <motion.div
                        className="section-title"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="premium-badge">Roadmap 2026</span>
                        <h2>Event Timeline</h2>
                        <p>Key milestones from registration to final presentation</p>
                    </motion.div>

                    <div className="timeline-container">
                        <div className="timeline-line-bg" />
                        <motion.div
                            className="timeline-line-progress"
                            style={{ scaleY, originY: 0 }}
                        />

                        {timelineData.map((item, i) => (
                            <motion.div
                                key={i}
                                className={`timeline-item ${i % 2 === 0 ? 'left' : 'right'}`}
                                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                viewport={{ once: true, margin: "-80px" }}
                                transition={{
                                    duration: 0.6,
                                    ease: [0.22, 1, 0.36, 1],
                                    delay: i * 0.1
                                }}
                            >
                                <div className="timeline-content">
                                    <span className="timeline-number">0{i + 1}</span>
                                    <div className="timeline-date">{item.date}</div>
                                    <h3>{item.stage}</h3>
                                    <p>{item.desc}</p>
                                    <span className="timeline-duration">{item.duration}</span>
                                </div>
                                <motion.div
                                    className="timeline-dot-container"
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 + 0.3 }}
                                >
                                    <div className="timeline-dot" />
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* How It Works Features */}
                <section className="features-section">
                    <motion.div
                        className="section-title"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                    >
                        <h2>How It Works</h2>
                        <p>Digitized end-to-end workflow for SY AIML students</p>
                    </motion.div>

                    <motion.div
                        className="features-grid"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-40px" }}
                    >
                        <motion.div className="feature-card" variants={fadeInUp}>
                            <div className="feature-icon"><HiUsers /></div>
                            <h3>1. Form Your Team</h3>
                            <p>Register with 2–4 students in Division A/B. Your group code (e.g. YRCA01) is auto-generated.</p>
                        </motion.div>
                        <motion.div className="feature-card" variants={fadeInUp}>
                            <div className="feature-icon"><HiDocumentText /></div>
                            <h3>2. Submit PDF Paper</h3>
                            <p>Upload your research paper in standard IEEE format with version resubmission tracking.</p>
                        </motion.div>
                        <motion.div className="feature-card" variants={fadeInUp}>
                            <div className="feature-icon"><HiChatBubbleLeftRight /></div>
                            <h3>3. Mentor Review</h3>
                            <p>Assigned faculty mentors provide structured feedback, approvals, and publication tracking.</p>
                        </motion.div>
                    </motion.div>
                </section>

                {/* Previous Research Highlights */}
                <section className="papers-preview-section">
                    <motion.div
                        className="section-title"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="premium-badge">Hall of Fame</span>
                        <h2>Past Research Papers</h2>
                        <p>Explore groundbreaking papers from previous YRC editions</p>
                    </motion.div>

                    <div className="papers-preview-grid">
                        {[
                            {
                                title: "Ensemble Deep Learning Model For Improving CNN Classifier Performance",
                                team: "Ruturaj S. Pandharkar, Abhishek Nikam, Trupti Sukale",
                                track: "AI & ML"
                            },
                            {
                                title: "AI-Optimized Dynamic Road Pricing For Road Safety & Efficiency",
                                team: "Prasad Pawar, Akhilesh Mohorir, Om Shrigiriwar",
                                track: "AI & ML"
                            },
                            {
                                title: "Computer Vision Marine Waste Cleaning Bot Using YOLO-V8",
                                team: "Piyush Daspute, Om Deshmukh, Om Pangaokar",
                                track: "AI & ML"
                            }
                        ].map((paper, i) => (
                            <motion.div
                                key={i}
                                className="paper-preview-card"
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                            >
                                <span className="paper-track">{paper.track}</span>
                                <h3>{paper.title}</h3>
                                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>
                                    Authors: {paper.team}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="view-all-container">
                        <Link href="/previous-papers" className="btn btn-secondary btn-lg">
                            View All Research Papers <HiArrowRight />
                        </Link>
                    </div>
                </section>

                {/* FAQs Accordion Section */}
                <section className="faq-section" id="faq">
                    <motion.div
                        className="section-title"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="premium-badge">Help & FAQs</span>
                        <h2>Frequently Asked Questions</h2>
                        <p>Everything you need to know about YRC 2026</p>
                    </motion.div>

                    <div className="faq-container">
                        {faqData.map((faq, i) => (
                            <FAQItem key={i} question={faq.question} answer={faq.answer} index={i} />
                        ))}
                    </div>
                </section>

                {/* Neo Footer */}
                <footer className="footer">
                    <div className="footer-container">
                        <div className="footer-grid">
                            <div className="footer-brand">
                                <div className="navbar-brand">
                                    <div className="brand-icon-wrapper">
                                        <div className="brand-icon"><HiAcademicCap /></div>
                                    </div>
                                    <span className="brand-text">YRC 2026</span>
                                </div>
                                <p>PCCOE Department of Artificial Intelligence & Machine Learning flagship research conference portal.</p>
                            </div>

                            <div className="footer-links">
                                <div className="footer-column">
                                    <h4>Institution</h4>
                                    <a href="https://www.pccoepune.org" target="_blank" rel="noopener noreferrer">PCCOE Pune</a>
                                    <a href="https://www.pccoepune.com/department-cs-aiml.php" target="_blank" rel="noopener noreferrer">AIML Dept</a>
                                </div>
                                <div className="footer-column">
                                    <h4>Research</h4>
                                    <a href="https://ieeexplore.ieee.org" target="_blank" rel="noopener noreferrer">IEEE Xplore</a>
                                    <a href="https://scholar.google.com" target="_blank" rel="noopener noreferrer">Google Scholar</a>
                                </div>
                                <div className="footer-column">
                                    <h4>Portal</h4>
                                    <Link href="/register">Register Team</Link>
                                    <Link href="/login">Login</Link>
                                    <Link href="/previous-papers">Past Papers</Link>
                                </div>
                            </div>
                        </div>

                        <div className="footer-bottom">
                            <p>© 2026 Young's Research Conference (YRC). PCCOE AIML Department.</p>
                            <div className="footer-credits">
                                Built for PCCOE AIML • Supabase Single Web App Edition
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}

function FAQItem({ question, answer, index }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            className={`faq-item ${isOpen ? 'open' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
        >
            <button
                className="faq-question"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <span>{question}</span>
                <motion.span
                    className="faq-icon"
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    +
                </motion.span>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="faq-answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="faq-answer-content">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
