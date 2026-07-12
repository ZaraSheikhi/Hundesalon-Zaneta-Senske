document.addEventListener('DOMContentLoaded', function() {
    // AOS Initialisierung (nur wenn vorhanden)
    if (window.AOS) {
        AOS.init({
            duration: 800,
            easing: 'ease-out',
            once: true,
            offset: 100
        });
    }

    // Hamburger-Menü
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    if(menuToggle && navLinks) {
        if (!menuToggle.querySelector('span')) {
            menuToggle.innerHTML = '<span></span><span></span><span></span>';
        }

        if (menuToggle.tagName !== 'BUTTON') {
            menuToggle.setAttribute('role', 'button');
            menuToggle.setAttribute('tabindex', '0');
        }

        menuToggle.setAttribute('aria-expanded', 'false');
        if (!menuToggle.hasAttribute('aria-label')) {
            menuToggle.setAttribute('aria-label', 'Menü öffnen');
        }

        const setMenuState = (open) => {
            menuToggle.classList.toggle('active', open);
            navLinks.classList.toggle('active', open);
            menuToggle.setAttribute('aria-expanded', String(open));
            menuToggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
            body.style.overflow = open ? 'hidden' : '';
        };

        menuToggle.addEventListener('click', function() {
            setMenuState(!navLinks.classList.contains('active'));
        });

        menuToggle.addEventListener('keydown', function(e) {
            if (menuToggle.tagName === 'BUTTON') return;
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setMenuState(!navLinks.classList.contains('active'));
            }
        });

        // Schließe Menü bei Klick außerhalb
        document.addEventListener('click', function(e) {
            if (!menuToggle.contains(e.target) && !navLinks.contains(e.target) && navLinks.classList.contains('active')) {
                setMenuState(false);
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                setMenuState(false);
                menuToggle.focus();
            }
        });

        // Schließe Menü bei Klick auf Link
        const navItems = document.querySelectorAll('.nav-links a');
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                setMenuState(false);
            });
        });
    }

    // Lightbox Funktionalität
    const lightbox = document.getElementById('lightbox');
    if(lightbox) {
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxCaption = lightbox.querySelector('.lightbox-caption');
        const dialog = lightbox.querySelector('.lightbox-dialog');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        let currentIndex = 0;
        let lastTrigger = null;
        const galleryItems = document.querySelectorAll('.gallery-item');
        const getPreferredImageSource = (image) => {
            if (!image) return '';

            const source = image.closest('picture')?.querySelector('source[srcset]');
            const largestCandidate = source?.srcset
                .split(',')
                .at(-1)
                ?.trim()
                .split(/\s+/)[0];

            return largestCandidate
                ? new URL(largestCandidate, document.baseURI).href
                : image.currentSrc || image.src;
        };
        const images = Array.from(galleryItems).map(item => {
            const image = item.querySelector('img');
            const captionElement = item.closest('.gallery-figure')?.querySelector('.gallery-caption');

            return {
                image,
                caption: item.dataset.caption || captionElement?.textContent.trim() || image?.alt || ''
            };
        });

        const updateLightbox = () => {
            const selectedImage = images[currentIndex];
            if (!selectedImage || !lightboxImg || !lightboxCaption) return;

            lightboxImg.src = getPreferredImageSource(selectedImage.image);
            lightboxImg.alt = selectedImage.caption;
            lightboxCaption.textContent = selectedImage.caption;
        };

        const openLightbox = (index, trigger) => {
            currentIndex = index;
            lastTrigger = trigger;
            updateLightbox();
            lightbox.classList.add('active');
            lightbox.setAttribute('aria-hidden', 'false');
            body.style.overflow = 'hidden';
            closeBtn?.focus();
        };

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            lightbox.setAttribute('aria-hidden', 'true');
            body.style.overflow = '';
            lastTrigger?.focus();
        };

        // Öffne Lightbox
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                openLightbox(index, item);
            });
        });

        // Schließe Lightbox
        closeBtn?.addEventListener('click', closeLightbox);

        // Vorheriges Bild
        prevBtn?.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateLightbox();
        });

        // Nächstes Bild
        nextBtn?.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % images.length;
            updateLightbox();
        });

        // Pfeiltasten-Navigation
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                currentIndex = (currentIndex - 1 + images.length) % images.length;
                updateLightbox();
            } else if (e.key === 'ArrowRight') {
                currentIndex = (currentIndex + 1) % images.length;
                updateLightbox();
            } else if (e.key === 'Tab' && dialog) {
                const focusable = Array.from(dialog.querySelectorAll('button:not([disabled]), a[href]'))
                    .filter(element => element.offsetParent !== null);
                const first = focusable[0];
                const last = focusable[focusable.length - 1];

                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last?.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first?.focus();
                }
            }
        });

        // Klicke außerhalb des Bildes zum Schließen
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    if(faqQuestions.length > 0) {
        const setFaqState = (item, expanded) => {
            const button = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');

            item.classList.toggle('active', expanded);
            if (button) button.setAttribute('aria-expanded', String(expanded));
            if (answer) answer.hidden = !expanded;
        };

        faqQuestions.forEach(btn => {
            const item = btn.parentElement;
            setFaqState(item, item.classList.contains('active'));

            btn.addEventListener('click', function() {
                const item = this.parentElement;
                const isActive = item.classList.contains('active');
                
                // Schließe alle anderen Items
                document.querySelectorAll('.faq-item.active').forEach(activeItem => {
                    if (activeItem !== item) {
                        setFaqState(activeItem, false);
                    }
                });
                
                // Toggle aktuelles Item
                setFaqState(item, !isActive);
            });
        });
    }

    // Cookie Banner
    const cookieBanner = document.getElementById('cookie-banner');
    if(cookieBanner) {
        const acceptButton = document.getElementById('accept-cookies');
        const declineButton = document.getElementById('decline-cookies');
        const analyticsId = body.dataset.analyticsId;

        const loadAnalytics = () => {
            if (!analyticsId || document.querySelector('script[data-google-analytics]')) return;

            window.dataLayer = window.dataLayer || [];
            window.gtag = window.gtag || function() {
                window.dataLayer.push(arguments);
            };
            window.gtag('js', new Date());
            window.gtag('config', analyticsId, { anonymize_ip: true });

            const analyticsScript = document.createElement('script');
            analyticsScript.async = true;
            analyticsScript.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(analyticsId)}`;
            analyticsScript.dataset.googleAnalytics = 'true';
            document.head.appendChild(analyticsScript);
        };

        const updateCookieClearance = () => {
            if (!cookieBanner.classList.contains('show')) return;

            const bannerBottom = Number.parseFloat(getComputedStyle(cookieBanner).bottom) || 16;
            const clearance = cookieBanner.offsetHeight + bannerBottom + 16;
            document.documentElement.style.setProperty('--cookie-clearance', `${clearance}px`);
        };

        const hideCookieBanner = () => {
            cookieBanner.classList.remove('show');
            cookieBanner.setAttribute('aria-hidden', 'true');
            document.documentElement.style.removeProperty('--cookie-clearance');
        };

        if (window.ResizeObserver) {
            const cookieObserver = new ResizeObserver(updateCookieClearance);
            cookieObserver.observe(cookieBanner);
        }
        
        // Prüfe, ob der Benutzer bereits eine Auswahl getroffen hat
        const cookieChoice = localStorage.getItem('cookieChoice');
        if (cookieChoice === 'accepted') {
            loadAnalytics();
        } else if (!cookieChoice) {
            setTimeout(() => {
                cookieBanner.classList.add('show');
                cookieBanner.setAttribute('aria-hidden', 'false');
                requestAnimationFrame(updateCookieClearance);
            }, 1000);
        }

        acceptButton?.addEventListener('click', function() {
            localStorage.setItem('cookieChoice', 'accepted');
            hideCookieBanner();
            loadAnalytics();
        });

        declineButton?.addEventListener('click', function() {
            localStorage.setItem('cookieChoice', 'declined');
            hideCookieBanner();
        });
    }

    // Footer-Jahr automatisch setzen
    const currentYear = new Date().getFullYear();
    document.querySelectorAll('.current-year').forEach(el => {
        el.textContent = String(currentYear);
    });

    // Hinweis-Bild auf der Startseite (bis 13. Januar)
    const promoOverlay = document.getElementById('promo-overlay');
    if (promoOverlay) {
        const promoExpiry = new Date(2026, 0, 13, 23, 59, 59);
        const now = new Date();
        const dismissed = localStorage.getItem('promoDismissedJan13') === '1';
        const closeBtn = promoOverlay.querySelector('.promo-close');

        const closePromo = () => {
            promoOverlay.classList.remove('is-visible');
            promoOverlay.setAttribute('aria-hidden', 'true');
            body.style.overflow = '';
            localStorage.setItem('promoDismissedJan13', '1');
        };

        if (now <= promoExpiry && !dismissed) {
            promoOverlay.classList.add('is-visible');
            promoOverlay.setAttribute('aria-hidden', 'false');
            body.style.overflow = 'hidden';
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', closePromo);
        }

        promoOverlay.addEventListener('click', (e) => {
            if (e.target === promoOverlay) {
                closePromo();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && promoOverlay.classList.contains('is-visible')) {
                closePromo();
            }
        });
    }

    // Accordion/Toggle für Leistungen-Grid
    const leistungToggles = document.querySelectorAll('.leistung-toggle');
    leistungToggles.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = btn.closest('.leistung-card');
            const text = card.querySelector('.leistung-text');
            const expanded = btn.getAttribute('aria-expanded') === 'true';

            // Alle anderen schließen
            document.querySelectorAll('.leistung-card').forEach(c => {
                if (c !== card) {
                    c.classList.remove('active');
                    const t = c.querySelector('.leistung-text');
                    const b = c.querySelector('.leistung-toggle');
                    if (t) t.hidden = true;
                    if (b) b.setAttribute('aria-expanded', 'false');
                }
            });

            // Aktuelle Karte toggeln
            if (!expanded) {
                card.classList.add('active');
                text.hidden = false;
                btn.setAttribute('aria-expanded', 'true');
            } else {
                card.classList.remove('active');
                text.hidden = true;
                btn.setAttribute('aria-expanded', 'false');
            }
        });
    });
});

// Ladebildschirm
window.addEventListener('load', function() {
    const loader = document.getElementById('loader');
    if(loader) {
        setTimeout(() => {
            loader.classList.add('fade-out');
        }, 1000);
    }
}); 
