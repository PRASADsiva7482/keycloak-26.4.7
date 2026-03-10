/**
 * V-App Login Theme JavaScript
 * Handles password visibility toggle, input enhancements, and branding.
 */
document.addEventListener("DOMContentLoaded", function () {

    // ============================================
    // 1. Replace any remaining "Keycloak" text in visible elements
    // ============================================
    function rebrand() {
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        while (walker.nextNode()) {
            const node = walker.currentNode;
            if (node.nodeValue && /keycloak/i.test(node.nodeValue)) {
                node.nodeValue = node.nodeValue
                    .replace(/Keycloak\s+Account\s+Management/gi, 'V-App Account Management')
                    .replace(/Keycloak\s+Administration\s+Console/gi, 'V-App Administration Console')
                    .replace(/Keycloak/gi, 'V-App');
            }
        }

        // Also replace in title
        if (document.title && /keycloak/i.test(document.title)) {
            document.title = document.title.replace(/Keycloak/gi, 'V-App');
        }
    }

    rebrand();

    // ============================================
    // 2. Enhanced password visibility toggle
    // ============================================
    function setupPasswordToggles() {
        const passwordFields = document.querySelectorAll('input[type="password"]');

        passwordFields.forEach(function (field) {
            const parent = field.parentElement;

            // Skip if already handled
            if (parent.querySelector('.v-pwd-toggle')) return;

            // Ensure parent is relatively positioned
            parent.style.position = 'relative';

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'v-pwd-toggle';
            btn.setAttribute('aria-label', 'Toggle password visibility');
            btn.style.cssText = `
                position: absolute;
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
                background: none;
                border: none;
                cursor: pointer;
                color: #94a3b8;
                padding: 6px;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10;
                transition: color 0.2s ease;
                outline: none;
            `;

            const eyeOpen = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
            const eyeClosed = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>';

            btn.innerHTML = eyeOpen;

            btn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                if (field.type === 'password') {
                    field.type = 'text';
                    btn.innerHTML = eyeClosed;
                    btn.style.color = '#a78bfa';
                } else {
                    field.type = 'password';
                    btn.innerHTML = eyeOpen;
                    btn.style.color = '#94a3b8';
                }
            });

            btn.addEventListener('mouseenter', function () {
                this.style.color = '#a78bfa';
            });
            btn.addEventListener('mouseleave', function () {
                this.style.color = field.type === 'text' ? '#a78bfa' : '#94a3b8';
            });

            parent.appendChild(btn);

            // Add right padding for the icon
            field.style.paddingRight = '44px';
        });
    }

    // Hide default keycloak password toggles
    const defaultToggles = document.querySelectorAll('.pf-c-button.pf-m-control');
    defaultToggles.forEach(function (toggle) {
        toggle.style.display = 'none';
    });

    setupPasswordToggles();

    // ============================================
    // 3. Add floating particle background
    // ============================================
    function createParticles() {
        const canvas = document.createElement('canvas');
        canvas.id = 'v-particles';
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
        `;
        document.body.insertBefore(canvas, document.body.firstChild);

        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 40;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        function Particle() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.4 + 0.1;
            this.color = Math.random() > 0.5 ? '124, 58, 237' : '6, 182, 212';
        }

        Particle.prototype.update = function () {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        };

        Particle.prototype.draw = function () {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
            ctx.fill();
        };

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function connectParticles() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 150) {
                        const opacity = (1 - dist / 150) * 0.12;
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(124, 58, 237, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(function (p) {
                p.update();
                p.draw();
            });
            connectParticles();
            requestAnimationFrame(animate);
        }

        animate();
    }

    createParticles();

    // ============================================
    // 4. Add V-App footer
    // ============================================
    function addFooter() {
        const existing = document.querySelector('.v-app-footer');
        if (existing) return;

        const footer = document.createElement('div');
        footer.className = 'v-app-footer';
        footer.innerHTML = 'Powered by <span class="v-highlight">V-App</span> &bull; Secure Authentication Platform';

        const card = document.querySelector('.card-pf');
        if (card && card.parentNode) {
            card.parentNode.insertBefore(footer, card.nextSibling);
        }
    }

    addFooter();

    // ============================================
    // 5. Input focus animation
    // ============================================
    function enhanceInputs() {
        const inputs = document.querySelectorAll('input[type="text"], input[type="password"], input[type="email"]');
        inputs.forEach(function (input) {
            input.addEventListener('focus', function () {
                this.parentElement.style.transform = 'scale(1.01)';
                this.parentElement.style.transition = 'transform 0.2s ease';
            });
            input.addEventListener('blur', function () {
                this.parentElement.style.transform = 'scale(1)';
            });
        });
    }

    enhanceInputs();

    // ============================================
    // 6. Monitor for dynamic changes
    // ============================================
    const observer = new MutationObserver(function (mutations) {
        let shouldRebrand = false;
        mutations.forEach(function (mutation) {
            if (mutation.addedNodes.length) {
                shouldRebrand = true;
            }
        });
        if (shouldRebrand) {
            setupPasswordToggles();
            rebrand();
            addFooter();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
});
