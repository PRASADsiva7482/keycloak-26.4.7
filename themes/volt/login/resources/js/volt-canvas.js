/**
 * Voltforge Keycloak Theme - volt-canvas.js
 * High-Performance Interactive Cybernetic Canvas
 * - Real-time procedural PCB traces & bus lines
 * - Dynamic electrical pulse packets traveling across circuits (Cyan & Gold)
 * - Microprocessor core (VF-MCU-G1) with breathing voltage glow
 * - Cursor proximity interaction & energetic bursts
 * - Active across all authentication pages (Login, Register, Password Reset, TOTP)
 */

(function () {
    'use strict';

    let canvas, ctx;
    let width = 0, height = 0;
    let dpr = 1;
    let mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000, active: false };
    let animId = null;

    // Circuit paths & moving electrical pulses
    const traces = [];
    const pulses = [];
    const nodes = [];
    const particles = [];

    // Chip position & geometry
    const chip = {
        x: 0,
        y: 0,
        size: 150,
        pulseAngle: 0
    };

    function initCanvas() {
        if (document.getElementById('volt-canvas')) return;

        canvas = document.createElement('canvas');
        canvas.id = 'volt-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.zIndex = '0';
        canvas.style.pointerEvents = 'none'; // Never intercept clicks
        canvas.style.opacity = '0';
        canvas.style.transition = 'opacity 0.6s ease-out';

        document.body.prepend(canvas);
        ctx = canvas.getContext('2d');

        handleResize();
        window.addEventListener('resize', handleResize);

        // Window-level mouse tracking
        window.addEventListener('mousemove', function (e) {
            mouse.targetX = e.clientX;
            mouse.targetY = e.clientY;
            mouse.active = true;
        });

        window.addEventListener('mouseleave', function () {
            mouse.active = false;
        });

        // Trigger pulse bursts on clicks
        window.addEventListener('click', function (e) {
            createBurst(e.clientX, e.clientY);
        });

        buildCircuitGeometry();

        requestAnimationFrame(function () {
            canvas.style.opacity = '1';
        });

        render();
    }

    function handleResize() {
        if (!canvas) return;
        dpr = window.devicePixelRatio || 1;
        width = window.innerWidth;
        height = window.innerHeight;

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        buildCircuitGeometry();
    }

    function buildCircuitGeometry() {
        traces.length = 0;
        pulses.length = 0;
        nodes.length = 0;
        particles.length = 0;

        const isWide = width >= 1024;
        chip.x = isWide ? Math.min(width * 0.18, 245) : width * 0.5;
        chip.y = isWide ? height * 0.5 : height * 0.25;
        chip.size = isWide ? 140 : 100;

        // Ambient floating cyber particles
        const particleCount = isWide ? 40 : 20;
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                size: Math.random() * 1.6 + 0.6,
                alpha: Math.random() * 0.35 + 0.1
            });
        }

        // Generate PCB trace paths connected to chip pins
        const pinCount = 8;
        const halfSize = chip.size / 2;

        // Left side pins
        for (let i = 0; i < pinCount; i++) {
            const py = chip.y - halfSize + 15 + i * ((chip.size - 30) / (pinCount - 1));
            const startX = chip.x - halfSize;
            createPcbTrace(startX, py, -1, 0, (i % 2 === 0));
        }

        // Right side pins (running toward form card)
        for (let i = 0; i < pinCount; i++) {
            const py = chip.y - halfSize + 15 + i * ((chip.size - 30) / (pinCount - 1));
            const startX = chip.x + halfSize;
            createPcbTrace(startX, py, 1, 0, (i % 2 === 1));
        }

        // Top pins
        for (let i = 0; i < 6; i++) {
            const px = chip.x - halfSize + 15 + i * ((chip.size - 30) / 5);
            const startY = chip.y - halfSize;
            createPcbTrace(px, startY, 0, -1, (i % 2 === 0));
        }

        // Bottom pins
        for (let i = 0; i < 6; i++) {
            const px = chip.x - halfSize + 15 + i * ((chip.size - 30) / 5);
            const startY = chip.y + halfSize;
            createPcbTrace(px, startY, 0, 1, (i % 2 === 1));
        }

        // Initial traveling electrical pulses
        traces.forEach(function (trace, idx) {
            const pulseSpeed = 1.2 + Math.random() * 1.6;
            pulses.push({
                traceIndex: idx,
                segmentIndex: 0,
                progress: Math.random(),
                speed: pulseSpeed,
                color: (idx % 4 === 0) ? '#ffb703' : '#06b6d4',
                size: 2.5 + Math.random() * 1.5
            });
        });
    }

    function createPcbTrace(startX, startY, dirX, dirY, bendFirst) {
        const points = [{ x: startX, y: startY }];
        let curX = startX;
        let curY = startY;

        const leadLen = 20 + Math.random() * 30;
        curX += dirX * leadLen;
        curY += dirY * leadLen;
        points.push({ x: curX, y: curY });

        const angleDist = 35 + Math.random() * 50;
        if (dirX !== 0) {
            const ySign = bendFirst ? -1 : 1;
            curX += dirX * angleDist;
            curY += ySign * angleDist;
        } else {
            const xSign = bendFirst ? -1 : 1;
            curX += xSign * angleDist;
            curY += dirY * angleDist;
        }
        points.push({ x: curX, y: curY });

        const highwayLen = 80 + Math.random() * 180;
        if (dirX !== 0) {
            curX += dirX * highwayLen;
            if (dirX === 1 && width >= 1024) {
                const maxRightX = (width / 2) - 270;
                if (curX > maxRightX) curX = maxRightX;
            }
        } else {
            curY += dirY * highwayLen;
        }
        points.push({ x: curX, y: curY });

        nodes.push({
            x: curX,
            y: curY,
            radius: 3.5
        });

        traces.push({
            points: points,
            color: 'rgba(6, 182, 212, 0.16)',
            highlightColor: 'rgba(6, 182, 212, 0.75)',
            glow: 0
        });
    }

    function createBurst(cx, cy) {
        for (let i = 0; i < 10; i++) {
            pulses.push({
                traceIndex: Math.floor(Math.random() * traces.length),
                segmentIndex: 0,
                progress: 0,
                speed: 3.0 + Math.random() * 2,
                color: '#22d3ee',
                size: 3
            });
        }
    }

    function render() {
        ctx.clearRect(0, 0, width, height);

        // Deep obsidian background
        ctx.fillStyle = '#080a0f';
        ctx.fillRect(0, 0, width, height);

        mouse.x += (mouse.targetX - mouse.x) * 0.15;
        mouse.y += (mouse.targetY - mouse.y) * 0.15;

        drawGrid();
        drawTraces();
        drawPulses();
        drawNodes();
        drawParticles();
        drawProcessorChip();

        animId = requestAnimationFrame(render);
    }

    function drawGrid() {
        const step = 36;
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
        ctx.lineWidth = 1;
        ctx.beginPath();

        for (let x = 0; x < width; x += step) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
        }
        for (let y = 0; y < height; y += step) {
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
        }
        ctx.stroke();

        // Crosshairs at key junctions
        ctx.fillStyle = 'rgba(6, 182, 212, 0.08)';
        for (let x = step * 2; x < width; x += step * 4) {
            for (let y = step * 2; y < height; y += step * 4) {
                ctx.fillRect(x - 3, y - 0.5, 7, 1);
                ctx.fillRect(x - 0.5, y - 3, 1, 7);
            }
        }
        ctx.restore();
    }

    function drawTraces() {
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        traces.forEach(function (trace) {
            let isNearMouse = false;
            if (mouse.active) {
                for (let i = 0; i < trace.points.length; i++) {
                    const p = trace.points[i];
                    const distSq = (p.x - mouse.x) * (p.x - mouse.x) + (p.y - mouse.y) * (p.y - mouse.y);
                    if (distSq < 16000) {
                        isNearMouse = true;
                        break;
                    }
                }
            }

            if (isNearMouse) {
                trace.glow = Math.min(trace.glow + 0.08, 1);
            } else {
                trace.glow = Math.max(trace.glow - 0.03, 0);
            }

            ctx.lineWidth = 1.4 + trace.glow * 1.2;
            if (trace.glow > 0.05) {
                ctx.shadowColor = '#06b6d4';
                ctx.shadowBlur = 10 * trace.glow;
                ctx.strokeStyle = `rgba(6, 182, 212, ${0.2 + trace.glow * 0.6})`;
            } else {
                ctx.shadowBlur = 0;
                ctx.strokeStyle = trace.color;
            }

            ctx.beginPath();
            ctx.moveTo(trace.points[0].x, trace.points[0].y);
            for (let i = 1; i < trace.points.length; i++) {
                ctx.lineTo(trace.points[i].x, trace.points[i].y);
            }
            ctx.stroke();
        });

        ctx.restore();
    }

    function drawPulses() {
        ctx.save();

        for (let i = pulses.length - 1; i >= 0; i--) {
            const pulse = pulses[i];
            const trace = traces[pulse.traceIndex];
            if (!trace) continue;

            const pts = trace.points;
            pulse.progress += (pulse.speed * 0.005);

            if (pulse.progress >= 1) {
                pulse.progress = 0;
                pulse.traceIndex = Math.floor(Math.random() * traces.length);
                continue;
            }

            const totalSegments = pts.length - 1;
            const segmentFloat = pulse.progress * totalSegments;
            const segIdx = Math.floor(segmentFloat);
            const segFrac = segmentFloat - segIdx;

            const p1 = pts[segIdx];
            const p2 = pts[Math.min(segIdx + 1, totalSegments)];

            const curX = p1.x + (p2.x - p1.x) * segFrac;
            const curY = p1.y + (p2.y - p1.y) * segFrac;

            ctx.shadowColor = pulse.color;
            ctx.shadowBlur = 12;
            ctx.fillStyle = '#ffffff';

            ctx.beginPath();
            ctx.arc(curX, curY, pulse.size, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = pulse.color;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(curX, curY, pulse.size * 2, 0, Math.PI * 2);
            ctx.stroke();
        }

        ctx.restore();
    }

    function drawNodes() {
        ctx.save();
        nodes.forEach(function (node) {
            ctx.fillStyle = 'rgba(6, 182, 212, 0.4)';
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius + 2, 0, Math.PI * 2);
            ctx.stroke();
        });
        ctx.restore();
    }

    function drawParticles() {
        ctx.save();
        particles.forEach(function (p) {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            ctx.fillStyle = `rgba(6, 182, 212, ${p.alpha})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.restore();
    }

    function drawProcessorChip() {
        if (width < 1024) return;
        ctx.save();
        chip.pulseAngle += 0.03;
        const breathGlow = (Math.sin(chip.pulseAngle) + 1) * 0.5;

        const cx = chip.x;
        const cy = chip.y;
        const s = chip.size;
        const hs = s / 2;

        const radialGrad = ctx.createRadialGradient(cx, cy, s * 0.2, cx, cy, s * 1.4);
        radialGrad.addColorStop(0, `rgba(6, 182, 212, ${0.12 + breathGlow * 0.14})`);
        radialGrad.addColorStop(0.6, 'rgba(8, 127, 131, 0.05)');
        radialGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = radialGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, s * 1.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 18 * breathGlow;
        ctx.fillStyle = '#0a0d14';
        ctx.strokeStyle = `rgba(6, 182, 212, ${0.35 + breathGlow * 0.3})`;
        ctx.lineWidth = 1.5;

        const r = 10;
        ctx.beginPath();
        ctx.roundRect(cx - hs, cy - hs, s, s, r);
        ctx.fill();
        ctx.stroke();

        ctx.shadowBlur = 0;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;
        ctx.strokeRect(cx - hs + 12, cy - hs + 12, s - 24, s - 24);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillStyle = '#f8fafc';
        ctx.font = '600 11px "JetBrains Mono", monospace';
        ctx.fillText('VOLTFORGE', cx, cy - 14);

        ctx.fillStyle = '#06b6d4';
        ctx.font = '500 9px "JetBrains Mono", monospace';
        ctx.fillText('VF-MCU-G1', cx, cy + 3);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.font = '400 7.5px "JetBrains Mono", monospace';
        ctx.fillText('256-BIT ENCLAVE', cx, cy + 18);

        const ledGlow = (Math.sin(chip.pulseAngle * 1.8) + 1) * 0.5;
        ctx.shadowColor = '#22d3ee';
        ctx.shadowBlur = 8 * ledGlow;
        ctx.fillStyle = `rgba(34, 211, 238, ${0.7 + ledGlow * 0.3})`;
        ctx.beginPath();
        ctx.arc(cx - hs + 12, cy - hs + 12, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCanvas);
    } else {
        initCanvas();
    }
})();
