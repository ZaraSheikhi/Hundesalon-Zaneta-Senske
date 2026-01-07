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

    // Modernes Hamburger-Menü
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    if(menuToggle && navLinks) {
        // Erstelle Hamburger-Icon
        menuToggle.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;

        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Schließe Menü bei Klick außerhalb
        document.addEventListener('click', function(e) {
            if (!menuToggle.contains(e.target) && !navLinks.contains(e.target) && navLinks.classList.contains('active')) {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                body.style.overflow = '';
            }
        });

        // Schließe Menü bei Klick auf Link
        const navItems = document.querySelectorAll('.nav-links a');
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                body.style.overflow = '';
            });
        });
    }

    // Lightbox Funktionalität
    const lightbox = document.getElementById('lightbox');
    if(lightbox) {
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxCaption = document.querySelector('.lightbox-caption');
        const closeBtn = document.querySelector('.lightbox-close');
        const prevBtn = document.querySelector('.lightbox-prev');
        const nextBtn = document.querySelector('.lightbox-next');
        let currentIndex = 0;
        const galleryItems = document.querySelectorAll('.gallery-item');
        const images = Array.from(galleryItems).map(item => ({
            src: item.querySelector('img').src,
            caption: item.querySelector('.gallery-overlay p').textContent
        }));

        // Öffne Lightbox
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                currentIndex = index;
                updateLightbox();
                lightbox.classList.add('active');
                body.style.overflow = 'hidden';
            });
        });

        // Schließe Lightbox
        closeBtn.addEventListener('click', () => {
            lightbox.classList.remove('active');
            body.style.overflow = '';
        });

        // Vorheriges Bild
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateLightbox();
        });

        // Nächstes Bild
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % images.length;
            updateLightbox();
        });

        // Pfeiltasten-Navigation
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') {
                lightbox.classList.remove('active');
                body.style.overflow = '';
            } else if (e.key === 'ArrowLeft') {
                currentIndex = (currentIndex - 1 + images.length) % images.length;
                updateLightbox();
            } else if (e.key === 'ArrowRight') {
                currentIndex = (currentIndex + 1) % images.length;
                updateLightbox();
            }
        });

        // Klicke außerhalb des Bildes zum Schließen
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
                body.style.overflow = '';
            }
        });

        function updateLightbox() {
            lightboxImg.src = images[currentIndex].src;
            lightboxCaption.textContent = images[currentIndex].caption;
        }
    }

    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    if(faqQuestions.length > 0) {
        faqQuestions.forEach(btn => {
            btn.addEventListener('click', function() {
                const item = this.parentElement;
                const isActive = item.classList.contains('active');
                
                // Schließe alle anderen Items
                document.querySelectorAll('.faq-item.active').forEach(activeItem => {
                    if (activeItem !== item) {
                        activeItem.classList.remove('active');
                    }
                });
                
                // Toggle aktuelles Item
                item.classList.toggle('active');
            });
        });
    }

    // Cookie Banner
    const cookieBanner = document.getElementById('cookie-banner');
    if(cookieBanner) {
        const acceptButton = document.getElementById('accept-cookies');
        const declineButton = document.getElementById('decline-cookies');
        
        // Prüfe, ob der Benutzer bereits eine Auswahl getroffen hat
        if (!localStorage.getItem('cookieChoice')) {
            setTimeout(() => {
                cookieBanner.classList.add('show');
            }, 1000);
        }

        acceptButton.addEventListener('click', function() {
            localStorage.setItem('cookieChoice', 'accepted');
            cookieBanner.classList.remove('show');
        });

        declineButton.addEventListener('click', function() {
            localStorage.setItem('cookieChoice', 'declined');
            cookieBanner.classList.remove('show');
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
