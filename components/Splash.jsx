'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Splash({ onComplete }) {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
            setTimeout(onComplete, 600);
        }, 2000);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <motion.div
            className="splash-screen"
            initial={{ opacity: 1 }}
            animate={{ opacity: isExiting ? 0 : 1 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
        >
            <div className="splash-content">
                <motion.div
                    className="splash-logo-container"
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <motion.h1 className="splash-title">
                        YRC PORTAL 2026
                    </motion.h1>
                    <motion.div
                        className="splash-underline"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    />
                    <motion.p
                        className="splash-subtitle"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                    >
                        PCCOE AIML • YOUNG'S RESEARCH CONFERENCE
                    </motion.p>
                </motion.div>
            </div>
        </motion.div>
    );
}
