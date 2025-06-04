document.addEventListener('DOMContentLoaded', function() {
    // AOS Initialisierung
    AOS.init({
        duration: 800,
        easing: 'ease-out',
        once: true,
        offset: 100
    });

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