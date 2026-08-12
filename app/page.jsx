'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { HiAcademicCap, HiUsers, HiDocumentText, HiChatBubbleLeftRight, HiCpuChip, HiChartBar, HiSignal, HiShieldCheck, HiSparkles, HiArrowRight } from 'react-icons/hi2';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import Antigravity from '@/components/Antigravity';

const tracks = [
    {
        name: 'AI & Machine Learning',
        desc: 'Neural networks, deep learning, NLP, computer vision, and generative AI systems.',
        icon: <HiCpuChip />,
        badge: 'TRACK 01',
    },
    {
        name: 'Data Science & Analytics',
        desc: 'Data mining, big data processing, analytics visualization, and statistical modeling.',
        icon: <HiChartBar />,
        badge: 'TRACK 02',
    },
    {
        name: 'IoT & Embedded Systems',
        desc: 'Smart devices, industrial sensor networks, edge computing, and robotics automation.',
        icon: <HiSignal />,
        badge: 'TRACK 03',
    },
    {
        name: 'Cybersecurity & Blockchain',
        desc: 'Network defense, applied cryptography, distributed ledgers, and vulnerability scanning.',
        icon: <HiShieldCheck />,
        badge: 'TRACK 04',
    }
];

const timelineData = [
    {
        stage: "Team Registration",
        duration: "5 Days",
        date: "Early September",
        desc: "Form your team of 2–4 members and select your conference domain track."
    },
    {
        stage: "Mentor Allocation & Research",
        duration: "45 Days",
        date: "Mid September - October",
        desc: "Assigned faculty mentors guide your domain research and IEEE paper drafting."
    },
    {
        stage: "Paper Submission",
        duration: "Deadline",
        date: "Early November",
        desc: "Submit your final research paper in standard double-column IEEE PDF format."
    },
    {
        stage: "YRC Conference",
        duration: "Main Event",
        date: "Late November",
        desc: "Present your research findings to academic reviewers and industry experts."
    },
    {
        stage: "Winner Announcement",
        duration: "Grand Finale",
        date: "December",
        desc: "Awards, certificates, and institutional recognition for top-performing research teams."
    }
];

const faqData = [
    {
        question: "Who can participate in YRC 2026?",
        answer: "YRC is specifically designed for second-year (SY) students of the AIML department at PCCOE Pune to encourage early academic research and publication."
    },
    {
        question: "What is the team size requirement?",
        answer: "Each team must consist of 2 to 4 students. All members must be currently in their second year of study in Division A or B."
    },
    {
        question: "How are faculty mentors assigned?",
        answer: "Once your team registers and selects a domain track, the AIML department assigns a dedicated faculty mentor specialized in that track to guide your research."
    },
    {
        question: "Do I need a completed project to register?",
        answer: "No, you only need a research idea or problem statement within your chosen track. Your mentor will guide you in developing it into a publishable paper."
    },
    {
        question: "What format should the paper submission be in?",
        answer: "Papers must be submitted in standard IEEE double-column PDF format directly through your student team dashboard."
    }
];

const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            ease: [0.16, 1, 0.3, 1]
        }
    }
};

const fadeInUp = {
    hidden: { opacity: 0, y: 24 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    }
};

export default function Home() {
    const timelineRef = useRef(null);
    const [particleColor, setParticleColor] = useState('#0066cc');

    const { scrollYProgress } = useScroll({
        target: timelineRef,
        offset: ["start end", "end end"]
    });

    const scaleY = useSpring(scrollYProgress, {
        stiffness: 60,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        const updateThemeColor = () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            setParticleColor(currentTheme === 'dark' ? '#2997ff' : '#0066cc');
        };

        updateThemeColor();
        const observer = new MutationObserver(updateThemeColor);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        return () => observer.disconnect();
    }, []);

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

            {/* Section 1: Hero Canvas (Light & Dark Theme Native) */}
            <section className="hero">
                <Antigravity
                    count={180}
                    magnetRadius={6}
                    ringRadius={8}
                    waveSpeed={0.2}
                    waveAmplitude={0.8}
                    particleSize={1.8}
                    lerpSpeed={0.03}
                    color={particleColor}
                    autoAnimate
                    particleVariance={1.2}
                    rotationSpeed={0.001}
                    depthFactor={1.2}
                    pulseSpeed={1.5}
                    particleShape="capsule"
                    fieldStrength={8}
                />

                <motion.div
                    className="hero-content"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
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
                        <Link href="/register" className="btn btn-primary btn-lg">
                            Register Your Team <HiArrowRight />
                        </Link>
                        <Link href="/login" className="btn btn-secondary btn-lg">
                            Team Login
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* Section 2: Conference Tracks (Parchement in Light / Darker in Dark Mode) */}
            <section className="section-tracks" id="tracks">
                <motion.div
                    className="section-title"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                >
                    <span className="badge badge-primary" style={{ marginBottom: 12 }}>DOMAINS</span>
                    <h2>Conference Tracks</h2>
                    <p>Choose from 4 research domains led by specialized faculty mentors</p>
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
                            className="store-utility-card track-card"
                            key={i}
                            variants={fadeInUp}
                        >
                            <span className="badge" style={{ marginBottom: 12 }}>
                                {track.badge}
                            </span>
                            <div className="track-icon">{track.icon}</div>
                            <h3>{track.name}</h3>
                            <p>{track.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* Section 3: Event Timeline Roadmap */}
            <section className="section-timeline" id="timeline" ref={timelineRef}>
                <motion.div
                    className="section-title"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <span className="badge badge-primary" style={{ marginBottom: 12 }}>MILESTONES</span>
                    <h2>Event Timeline</h2>
                    <p>Key phases from team registration to paper publication</p>
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
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.5, delay: i * 0.08 }}
                        >
                            <div className="timeline-content">
                                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary)', marginBottom: 4 }}>
                                    STAGE 0{i + 1} • {item.date}
                                </div>
                                <h3 style={{ fontSize: 21, fontWeight: 600, marginBottom: 8 }}>{item.stage}</h3>
                                <p style={{ fontSize: 14, color: 'var(--ink-muted-80)' }}>{item.desc}</p>
                                <span className="badge" style={{ marginTop: 12 }}>{item.duration}</span>
                            </div>
                            <div className="timeline-dot-container" />
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Section 4: How It Works (White in Light Mode per user request!) */}
            <section className="section-how-it-works">
                <motion.div
                    className="section-title"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <span className="badge badge-primary" style={{ marginBottom: 12 }}>
                        WORKFLOW
                    </span>
                    <h2>How It Works</h2>
                    <p>Digitized end-to-end research submission for SY AIML students</p>
                </motion.div>

                <motion.div
                    className="features-grid"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-40px" }}
                >
                    <motion.div className="store-utility-card feature-card" variants={fadeInUp}>
                        <div className="feature-icon"><HiUsers /></div>
                        <h3>1. Form Your Team</h3>
                        <p>Register with 2–4 students in Division A or B. Your group code (e.g., YRCA01) is automatically generated.</p>
                    </motion.div>
                    <motion.div className="store-utility-card feature-card" variants={fadeInUp}>
                        <div className="feature-icon"><HiDocumentText /></div>
                        <h3>2. Submit PDF Paper</h3>
                        <p>Upload your research paper draft in IEEE double-column format with instant version tracking.</p>
                    </motion.div>
                    <motion.div className="store-utility-card feature-card" variants={fadeInUp}>
                        <div className="feature-icon"><HiChatBubbleLeftRight /></div>
                        <h3>3. Mentor Review</h3>
                        <p>Assigned faculty mentors review your draft, provide feedback, and approve your final submission.</p>
                    </motion.div>
                </motion.div>
            </section>

            {/* Section 5: Past Research Papers & FAQs */}
            <section className="section-papers-faq" id="faq">
                <motion.div
                    className="section-title"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <span className="badge badge-primary" style={{ marginBottom: 12 }}>GALLERY</span>
                    <h2>Past Research Papers</h2>
                    <p>Explore outstanding research published by alumni of PCCOE AIML</p>
                </motion.div>

                <div className="papers-preview-grid" style={{ marginBottom: 40 }}>
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
                            className="store-utility-card paper-preview-card"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                        >
                            <div>
                                <span className="badge">{paper.track}</span>
                                <h3 className="paper-title" style={{ fontSize: 18, marginTop: 12 }}>{paper.title}</h3>
                                <p style={{ fontSize: 14, color: 'var(--ink-muted-80)' }}>
                                    Authors: {paper.team}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="view-all-container" style={{ marginBottom: 80 }}>
                    <Link href="/previous-papers" className="btn btn-primary">
                        View All Research Papers <HiArrowRight />
                    </Link>
                </div>

                {/* FAQs Accordion Section */}
                <motion.div
                    className="section-title"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <span className="badge badge-primary" style={{ marginBottom: 12 }}>SUPPORT</span>
                    <h2>Frequently Asked Questions</h2>
                    <p>Everything you need to know about YRC 2026</p>
                </motion.div>

                <div className="faq-container">
                    {faqData.map((faq, i) => (
                        <FAQItem key={i} question={faq.question} answer={faq.answer} index={i} />
                    ))}
                </div>
            </section>

            {/* Apple Parchment / Dark Footer */}
            <footer className="footer">
                <div className="footer-container">
                    <div className="footer-grid">
                        <div className="footer-brand">
                            <div className="navbar-brand" style={{ fontSize: 21 }}>
                                <div className="brand-icon">
                                    <HiAcademicCap />
                                </div>
                                <span>YRC 2026</span>
                            </div>
                            <p>
                                PCCOE Department of Artificial Intelligence & Machine Learning flagship annual research conference portal.
                            </p>
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
                                <h4>Portal Navigation</h4>
                                <Link href="/register">Register Team</Link>
                                <Link href="/login">Team Login</Link>
                                <Link href="/previous-papers">Past Papers</Link>
                            </div>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <p>© 2026 Young's Research Conference (YRC). PCCOE AIML Department.</p>
                        <div>
                            Built for PCCOE AIML • Apple Design System Architecture
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function FAQItem({ question, answer, index }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            className={`faq-item ${isOpen ? 'open' : ''}`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.06 }}
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
                    transition={{ duration: 0.2 }}
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
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
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
