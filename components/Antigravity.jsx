'use client';

import React, { useRef, useEffect } from 'react';

const Antigravity = ({
    count = 240,
    magnetRadius = 6,
    ringRadius = 7,
    waveSpeed = 0.8,
    waveAmplitude = 1,
    particleSize = 1.5,
    lerpSpeed = 0.05,
    color = "#FFDE59",
    autoAnimate = true,
    particleVariance = 1,
    rotationSpeed = 1,
    depthFactor = 1,
    pulseSpeed = 3,
    particleShape = "capsule",
    fieldStrength = 10
}) => {
    const canvasRef = useRef(null);
    const mouseRef = useRef({ x: 0, y: 0, active: false });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];
        let time = 0;

        const resize = () => {
            if (!canvas.parentElement) return;
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
            initParticles();
        };

        class Particle {
            constructor(index) {
                this.index = index;
                this.baseX = Math.random() * canvas.width;
                this.baseY = Math.random() * canvas.height;
                this.x = this.baseX;
                this.y = this.baseY;
                this.z = Math.random() * depthFactor;
                this.size = particleSize * (0.5 + Math.random() * particleVariance);
                this.vx = 0;
                this.vy = 0;
                this.angle = Math.random() * Math.PI * 2;
            }

            update(time) {
                const waveX = Math.sin(time * waveSpeed + this.index) * waveAmplitude * 10;
                const waveY = Math.cos(time * waveSpeed * 0.8 + this.index) * waveAmplitude * 10;

                const targetX = this.baseX + waveX;
                const targetY = this.baseY + waveY;

                if (mouseRef.current.active) {
                    const dx = mouseRef.current.x - this.x;
                    const dy = mouseRef.current.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const maxDist = magnetRadius * 50;

                    if (distance < maxDist) {
                        const force = (maxDist - distance) / maxDist;
                        this.vx += (dx / distance) * force * fieldStrength * 0.2;
                        this.vy += (dy / distance) * force * fieldStrength * 0.2;
                    }
                }

                this.x += this.vx;
                this.y += this.vy;

                this.x += (targetX - this.x) * lerpSpeed;
                this.y += (targetY - this.y) * lerpSpeed;

                this.vx *= 0.95;
                this.vy *= 0.95;
            }

            draw() {
                ctx.beginPath();
                const alpha = 0.2 + (this.z / depthFactor) * 0.8;
                ctx.fillStyle = color;
                ctx.globalAlpha = alpha;

                if (particleShape === "capsule") {
                    const length = this.size * 4;
                    const angle = Math.atan2(this.vy, this.vx) + time * rotationSpeed;
                    ctx.save();
                    ctx.translate(this.x, this.y);
                    ctx.rotate(angle);
                    ctx.roundRect(-length / 2, -this.size / 2, length, this.size, this.size / 2);
                    ctx.fill();
                    ctx.restore();
                } else {
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }

        const initParticles = () => {
            particles = [];
            for (let i = 0; i < count; i++) {
                particles.push(new Particle(i));
            }
        };

        const animate = () => {
            time += 0.01;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.update(time);
                p.draw();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current.x = e.clientX - rect.left;
            mouseRef.current.y = e.clientY - rect.top;
            mouseRef.current.active = true;
        };

        const handleMouseLeave = () => {
            mouseRef.current.active = false;
        };

        window.addEventListener('resize', resize);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);

        resize();
        if (autoAnimate) animate();

        return () => {
            window.removeEventListener('resize', resize);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, [count, magnetRadius, waveSpeed, waveAmplitude, particleSize, lerpSpeed, color, autoAnimate, particleVariance, rotationSpeed, depthFactor, pulseSpeed, particleShape, fieldStrength]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                width: '100%',
                height: '100%',
                display: 'block',
                position: 'absolute',
                top: 0,
                left: 0,
                pointerEvents: 'auto'
            }}
        />
    );
};

export default Antigravity;
