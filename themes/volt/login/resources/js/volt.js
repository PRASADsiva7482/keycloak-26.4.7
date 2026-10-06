/**
 * Voltforge Keycloak Theme - volt.js
 * Advanced Capsule Component System & UX Enhancer
 * - Segmented Capsule Navigation Switcher (Sign In ⇋ Register)
 * - Capsule Inputs with integrated SVG micro-icons
 * - Dynamic 4-Segment Password Strength Pill Meter
 * - Smooth Eye Toggle for Password Visibility
 * - Autofill Guardian (100% dark mode preservation)
 * - Zero-Scroll Viewport Layout Enforcement
 */

(function () {
    'use strict';

    // 1. Instant Favicon
    (function applyFavicon() {
        const svgData = `<svg viewBox="0 0 48 48" width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="narayanaGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#FFD700"/><stop offset="30%" stop-color="#FF9933"/><stop offset="70%" stop-color="#1DA1F2"/><stop offset="100%" stop-color="#0A4D8C"/></linearGradient><filter id="glow"><feGaussianBlur stdDeviation="0.8" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><g filter="url(#glow)"><path d="M10 8 L24 40 L38 8" stroke="url(#narayanaGrad)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></g><circle cx="24" cy="5" r="2.5" fill="#FFD700" opacity="0.9" filter="url(#glow)"/></svg>`;
        const faviconUrl = 'data:image/svg+xml,' + encodeURIComponent(svgData);

        function updateIcons() {
            document.querySelectorAll("link[rel*='icon']").forEach(el => el.remove());
            const svgLink = document.createElement('link');
            svgLink.rel = 'icon';
            svgLink.type = 'image/svg+xml';
            svgLink.href = faviconUrl;
            document.head.appendChild(svgLink);
        }

        if (document.head) updateIcons();
        else document.addEventListener("DOMContentLoaded", updateIcons);
    })();

    document.addEventListener("DOMContentLoaded", function () {

        // 2. Voltforge Rebranding
        function applyRebranding() {
            const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
            while (walker.nextNode()) {
                const node = walker.currentNode;
                if (node.parentElement && ['INPUT', 'TEXTAREA', 'SCRIPT', 'STYLE'].includes(node.parentElement.tagName)) {
                    continue;
                }
                if (node.nodeValue && /keycloak|v-app/i.test(node.nodeValue)) {
                    node.nodeValue = node.nodeValue
                        .replace(/Keycloak\s+Account\s+Management/gi, 'Voltforge Account Management')
                        .replace(/Keycloak\s+Administration\s+Console/gi, 'Voltforge Administration Console')
                        .replace(/Keycloak/gi, 'Voltforge')
                        .replace(/\bV-App\b/g, 'Voltforge');
                }
            }
            if (document.title && /keycloak|v-app/i.test(document.title)) {
                document.title = document.title.replace(/Keycloak/gi, 'Voltforge').replace(/V-App/gi, 'Voltforge');
            }
        }

        // 3. Segmented Capsule Switcher (Sign In <-> Register)
        function injectCapsuleSwitcher() {
            if (document.querySelector('.vf-capsule-switcher')) return;

            const isRegisterPage = !!document.getElementById('kc-register-form');
            const isLoginPage = !!document.getElementById('kc-form-login');

            if (!isLoginPage && !isRegisterPage) return;

            let loginUrl = '#';
            let registerUrl = '#';

            if (isLoginPage) {
                const regLink = document.querySelector('#kc-registration a, #kc-registration-container a');
                if (regLink && regLink.getAttribute('href')) {
                    registerUrl = regLink.getAttribute('href');
                } else if (window.location.href.includes('/authenticate')) {
                    registerUrl = window.location.href.replace('/authenticate', '/registration');
                }
                loginUrl = '#';
            } else if (isRegisterPage) {
                const backLink = document.querySelector('#kc-form-options a') || document.querySelector('#kc-back-to-login a');
                if (backLink && backLink.getAttribute('href')) {
                    loginUrl = backLink.getAttribute('href');
                } else if (window.location.href.includes('/registration')) {
                    loginUrl = window.location.href.replace('/registration', '/authenticate');
                }
                registerUrl = '#';
            }

            const switcher = document.createElement('div');
            switcher.className = 'vf-capsule-switcher';
            switcher.innerHTML = `
                <div class="vf-capsule-track" role="tablist" aria-label="Authentication Options">
                    <button type="button" role="tab" class="vf-capsule-tab ${!isRegisterPage ? 'active' : ''}" id="vf-tab-signin" aria-selected="${!isRegisterPage}">
                        Sign In
                    </button>
                    <button type="button" role="tab" class="vf-capsule-tab ${isRegisterPage ? 'active' : ''}" id="vf-tab-register" aria-selected="${isRegisterPage}">
                        Create Account
                    </button>
                </div>
            `;

            const signinBtn = switcher.querySelector('#vf-tab-signin');
            const registerBtn = switcher.querySelector('#vf-tab-register');

            if (signinBtn) {
                signinBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    if (isRegisterPage && loginUrl && loginUrl !== '#') {
                        window.location.href = loginUrl;
                    }
                });
            }

            if (registerBtn) {
                registerBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    if (!isRegisterPage && registerUrl && registerUrl !== '#') {
                        window.location.href = registerUrl;
                    }
                });
            }

            // Insert switcher into header or card top
            const header = document.querySelector('.login-pf-header') || document.querySelector('.card-pf');
            if (header) {
                header.parentNode.insertBefore(switcher, header);
            }
        }        // 4. Capsule Input Standardization & Icons
        function enhanceCapsuleInputs() {
            const iconMap = {
                'username': '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
                'firstName': '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
                'lastName': '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
                'email': '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>',
                'password': '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>',
                'password-new': '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>',
                'password-confirm': '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
                'totp': '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4"></path></svg>',
                'otp': '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4"></path></svg>',
                'userLabel': '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>'
            };

            const inputs = document.querySelectorAll('input[type="text"], input[type="password"], input[type="email"]');
            inputs.forEach(function (input) {
                // Ensure a dedicated input box wraps ONLY the input (preventing label height interference)
                let box = input.closest('.vf-input-box');
                if (!box) {
                    if (input.parentElement && input.parentElement.classList.contains('pf-c-input-group')) {
                        box = input.parentElement;
                        box.classList.add('vf-input-box');
                    } else {
                        box = document.createElement('div');
                        box.className = 'vf-input-box';
                        input.parentNode.insertBefore(box, input);
                        box.appendChild(input);
                    }
                }

                const id = input.id || input.name;
                if (!box.querySelector('.vf-input-icon')) {
                    const iconSvg = iconMap[id] || iconMap['username'];
                    const iconWrapper = document.createElement('div');
                    iconWrapper.className = 'vf-input-icon';
                    iconWrapper.innerHTML = iconSvg;
                    box.appendChild(iconWrapper);
                }

                input.classList.add('vf-capsule-input');

                const group = input.closest('.form-group');
                if (group) {
                    if (id === 'firstName') group.classList.add('vf-col-1');
                    else if (id === 'lastName') group.classList.add('vf-col-2');
                    else if (id === 'email') group.classList.add('vf-col-email');
                    else if (id === 'username') group.classList.add('vf-col-username');
                    else if (id === 'password') group.classList.add('vf-col-pwd');
                    else if (id === 'password-confirm') group.classList.add('vf-col-pwd-confirm');
                }
            });
        }

        // 5. Password Eye Visibility Toggle
        function setupPasswordToggles() {
            const passwordInputs = document.querySelectorAll('input[type="password"]');

            passwordInputs.forEach(function (input) {
                const box = input.closest('.vf-input-box') || input.parentElement;
                if (!box || box.querySelector('.vf-pwd-toggle')) return;

                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'vf-pwd-toggle';
                btn.setAttribute('aria-label', 'Toggle password visibility');
                btn.setAttribute('tabindex', '-1');

                const eyeIcon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="7" r="4"></circle></svg>';
                const eyeSlashIcon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>';

                btn.innerHTML = eyeIcon;

                btn.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (input.type === 'password') {
                        input.type = 'text';
                        btn.innerHTML = eyeSlashIcon;
                        btn.classList.add('active');
                    } else {
                        input.type = 'password';
                        btn.innerHTML = eyeIcon;
                        btn.classList.remove('active');
                    }
                });

                box.appendChild(btn);
            });
        }

        // 6. Dynamic 4-Segment Password Strength Capsule Meter
        function setupPasswordStrengthMeter() {
            const targets = [
                { formId: 'kc-register-form', inputId: 'password', altInputId: 'reg-password' },
                { formId: 'kc-passwd-update-form', inputId: 'password-new', altInputId: 'password' }
            ];

            targets.forEach(function (target) {
                const form = document.getElementById(target.formId);
                if (!form || form.querySelector('.vf-strength-meter')) return;

                const pwdInput = form.querySelector(`#${target.inputId}`) || form.querySelector(`#${target.altInputId}`) || form.querySelector('input[type="password"]');
                if (!pwdInput) return;

                const meter = document.createElement('div');
                meter.className = 'vf-strength-meter';
                meter.innerHTML = `
                    <div class="vf-strength-bars">
                        <span class="vf-strength-pill" data-idx="1"></span>
                        <span class="vf-strength-pill" data-idx="2"></span>
                        <span class="vf-strength-pill" data-idx="3"></span>
                        <span class="vf-strength-pill" data-idx="4"></span>
                    </div>
                    <div class="vf-strength-label">Security: <span class="vf-strength-status">Awaiting Input</span></div>
                `;

                if (target.formId === 'kc-passwd-update-form') {
                    // Place directly after "New Password" group
                    const targetGroup = pwdInput.closest('.form-group');
                    if (targetGroup) {
                        targetGroup.parentNode.insertBefore(meter, targetGroup.nextSibling);
                    }
                } else {
                    // Registration: place after "Confirm Password" group
                    const pwdConfirmInput = form.querySelector('#password-confirm, #reg-password-confirm');
                    const targetGroup = pwdConfirmInput ? pwdConfirmInput.closest('.form-group') : pwdInput.closest('.form-group');
                    if (targetGroup) {
                        targetGroup.parentNode.insertBefore(meter, targetGroup.nextSibling);
                    }
                }

                const pills = meter.querySelectorAll('.vf-strength-pill');
                const statusText = meter.querySelector('.vf-strength-status');

                function updateMeter() {
                    const val = pwdInput.value || '';
                    let score = 0;
                    if (val.length >= 8) score++;
                    if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
                    if (/[0-9]/.test(val)) score++;
                    if (/[^A-Za-z0-9]/.test(val)) score++;

                    pills.forEach((pill, idx) => {
                        pill.className = 'vf-strength-pill';
                        if (idx < score) {
                            if (score === 1) pill.classList.add('weak');
                            else if (score === 2) pill.classList.add('fair');
                            else if (score === 3) pill.classList.add('strong');
                            else if (score === 4) pill.classList.add('maximum');
                        }
                    });

                    if (val.length === 0) {
                        statusText.textContent = 'Awaiting Input';
                        statusText.style.color = '#71717a';
                    } else if (score <= 1) {
                        statusText.textContent = 'Weak';
                        statusText.style.color = '#f87171';
                    } else if (score === 2) {
                        statusText.textContent = 'Moderate';
                        statusText.style.color = '#fbbf24';
                    } else if (score === 3) {
                        statusText.textContent = 'Strong';
                        statusText.style.color = '#22d3ee';
                    } else {
                        statusText.textContent = 'Maximum Enclave';
                        statusText.style.color = '#34d399';
                    }
                }

                pwdInput.addEventListener('input', updateMeter);
                pwdInput.addEventListener('keyup', updateMeter);
                pwdInput.addEventListener('change', updateMeter);
            });
        }

        // 7. Guaranteed 2-Column Registration Field Alignment
        function reorderRegistrationFields() {
            const form = document.getElementById('kc-register-form');
            if (!form || form.dataset.vfOrdered === 'true') return;

            const findGroup = (selector) => {
                const input = form.querySelector(selector);
                return input ? input.closest('.form-group') : null;
            };

            const firstGroup = findGroup('#firstName, input[name="firstName"]');
            const lastGroup = findGroup('#lastName, input[name="lastName"]');
            const emailGroup = findGroup('#email, input[name="email"]');
            const userGroup = findGroup('#username, input[name="username"]');
            const pwdGroup = findGroup('#password, input[name="password"]');
            const pwdConfirmGroup = findGroup('#password-confirm, input[name="password-confirm"]');
            const meter = form.querySelector('.vf-strength-meter');
            const submitGroup = form.querySelector('.form-group:has(#kc-form-buttons), .form-group:has(#kc-register), .form-group:has(input[type="submit"])') || form.querySelector('#kc-form-buttons');

            const ordered = [
                firstGroup,
                lastGroup,
                emailGroup,
                userGroup,
                pwdGroup,
                pwdConfirmGroup,
                meter,
                submitGroup
            ];

            ordered.forEach(item => {
                if (item && item.parentElement === form) {
                    form.appendChild(item);
                }
            });

            form.dataset.vfOrdered = 'true';
        }

        // 8. Telemetry HUD Pill & Footer
        function injectTelemetry() {
            if (document.querySelector('.vf-hud-telemetry')) return;

            // Top Status Pill
            const hud = document.createElement('div');
            hud.className = 'vf-hud-telemetry';
            hud.innerHTML = `
                <div class="vf-hud-pill">
                    <span class="vf-hud-dot"></span>
                    <span>VOLT-ENCLAVE // SECURE</span>
                </div>
            `;
            document.body.prepend(hud);

            // Sleek Footer Capsule
            if (!document.querySelector('.vf-footer')) {
                const footer = document.createElement('div');
                footer.className = 'vf-footer';
                footer.innerHTML = `&copy; ${new Date().getFullYear()} <span class="vf-highlight">Voltforge Inc.</span> &bull; Hardware Identity System`;
                const container = document.getElementById('kc-container');
                if (container) container.appendChild(footer);
            }
        }

        // 9. Page Classification & Enclave Detection
        function detectPageType() {
            if (document.querySelector('.vf-totp-enclave-grid') || document.getElementById('kc-totp-settings-form')) {
                document.body.setAttribute('data-page-id', 'login-config-totp');
                const card = document.querySelector('.card-pf');
                if (card) card.classList.add('vf-card-totp');
            } else if (document.getElementById('kc-register-form')) {
                document.body.setAttribute('data-page-id', 'login-register');
            } else if (document.getElementById('kc-passwd-update-form')) {
                document.body.setAttribute('data-page-id', 'login-update-password');
                const card = document.querySelector('.card-pf');
                if (card) card.classList.add('vf-card-update-password');
            } else if (document.getElementById('kc-reset-password-form')) {
                document.body.setAttribute('data-page-id', 'login-reset-password');
                const card = document.querySelector('.card-pf');
                if (card) card.classList.add('vf-card-reset-password');
            } else if (document.getElementById('kc-otp-login-form')) {
                document.body.setAttribute('data-page-id', 'login-otp');
                const card = document.querySelector('.card-pf');
                if (card) card.classList.add('vf-card-otp');
            } else if (document.getElementById('kc-form-login')) {
                document.body.setAttribute('data-page-id', 'login');
            }
        }

        // Execute all modules
        detectPageType();
        applyRebranding();
        injectCapsuleSwitcher();
        enhanceCapsuleInputs();
        setupPasswordToggles();
        setupPasswordStrengthMeter();
        reorderRegistrationFields();
        injectTelemetry();

        // Dynamic Mutation Observer with loop prevention
        let isProcessingMutations = false;
        const observer = new MutationObserver(function () {
            if (isProcessingMutations) return;
            isProcessingMutations = true;
            try {
                detectPageType();
                applyRebranding();
                injectCapsuleSwitcher();
                enhanceCapsuleInputs();
                setupPasswordToggles();
                setupPasswordStrengthMeter();
                reorderRegistrationFields();
            } finally {
                setTimeout(function () {
                    isProcessingMutations = false;
                }, 60);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    });

})();
