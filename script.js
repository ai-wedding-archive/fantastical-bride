// ══════════════════════════════════════════════════════════
// AI Wedding Dress Book — Shared Script
// Requires: window.dressData to be defined BEFORE this script loads
// ══════════════════════════════════════════════════════════

(function () {
    'use strict';

    // ══════════════════════════════════════
    // Sidebar Toggle (mobile hamburger)
    // ══════════════════════════════════════
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('is-open');
            sidebarOverlay.classList.toggle('is-visible');
            document.body.classList.toggle('sidebar-open');
        });
    }
    if (sidebarOverlay && sidebar) {
        sidebarOverlay.addEventListener('click', () => {
            sidebar.classList.remove('is-open');
            sidebarOverlay.classList.remove('is-visible');
            document.body.classList.remove('sidebar-open');
        });
    }

    // ══════════════════════════════════════
    // Sticky Header
    // ══════════════════════════════════════
    const header = document.getElementById('siteHeader');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('is-scrolled', window.scrollY > 60);
        }, { passive: true });
    }

    // ══════════════════════════════════════
    // Guard: portal pages have no dress cards
    // ══════════════════════════════════════
    const allCards = document.querySelectorAll('.dress-card');
    if (!allCards.length || typeof dressData === 'undefined') return;

    // ══════════════════════════════════════
    // IntersectionObserver — Fade-in cards
    // ══════════════════════════════════════
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    });

    allCards.forEach((card, i) => {
        card.style.transitionDelay = `${(i % 4) * 0.08}s`;
        fadeObserver.observe(card);
    });

    // ══════════════════════════════════════
    // Build index map: data-index → dressData index
    // ══════════════════════════════════════
    function getDataIndex(card) {
        return parseInt(card.dataset.index, 10) - 1;
    }

    // ══════════════════════════════════════
    // Detail Modal
    // ══════════════════════════════════════
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modalImage');
    const modalVol = document.getElementById('modalVol');
    const modalTitle = document.getElementById('modalTitle');
    const modalDate = document.getElementById('modalDate');
    const modalPoints = document.getElementById('modalPoints');
    const modalInspo = document.getElementById('modalInspiration');
    const modalClose = document.getElementById('modalClose');

    function openModal(index) {
        const d = dressData[index];
        if (!d) return;
        modalImage.src = d.image;
        modalImage.alt = d.title;
        modalVol.textContent = d.vol;
        modalTitle.textContent = d.title;
        modalDate.textContent = d.date;
        modalPoints.innerHTML = d.points.map(p => `
            <div class="point-card">
                <span class="point-tag">${p.tag}</span>
                <h4 class="point-title">${p.title}</h4>
                <p class="point-body">${p.body}</p>
            </div>
        `).join('');
        modalInspo.textContent = d.inspiration;
        modal.classList.add('is-active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('is-active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    allCards.forEach(card => {
        card.addEventListener('click', () => {
            openModal(getDataIndex(card));
        });
    });

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // ══════════════════════════════════════
    // Lightbox with Amazon-style Pan & Zoom
    // ══════════════════════════════════════
    const lightbox = document.getElementById('lightbox');
    const lbImage = document.getElementById('lbImage');
    const lbPanzoomEl = document.getElementById('lbPanzoom');
    const lbVol = document.getElementById('lbVol');
    const lbTitle = document.getElementById('lbTitle');
    const lbClose = document.getElementById('lbClose');
    const lbPrev = document.getElementById('lbPrev');
    const lbNext = document.getElementById('lbNext');
    let currentLbIndex = 0;

    // ── Panzoom State ──
    let pzScale = 1;
    let pzX = 0;
    let pzY = 0;
    let pzDragging = false;
    let pzStartX = 0;
    let pzStartY = 0;
    let pzStartPanX = 0;
    let pzStartPanY = 0;
    const PZ_MIN = 1;
    const PZ_MAX = 5;
    const PZ_STEP = 0.15;

    function pzApply() {
        lbImage.style.transform = `translate(${pzX}px, ${pzY}px) scale(${pzScale})`;
    }

    function pzReset() {
        pzScale = 1;
        pzX = 0;
        pzY = 0;
        pzDragging = false;
        lbImage.style.transition = 'transform 0.3s ease';
        pzApply();
        setTimeout(() => { lbImage.style.transition = 'none'; }, 300);
        lbPanzoomEl.classList.remove('is-zoomed');
    }

    function pzIsZoomed() {
        return pzScale > 1.05;
    }

    // Mouse wheel zoom
    lbPanzoomEl.addEventListener('wheel', (e) => {
        if (!lightbox.classList.contains('is-active')) return;
        e.preventDefault();
        const delta = e.deltaY > 0 ? -PZ_STEP : PZ_STEP;
        const newScale = Math.min(PZ_MAX, Math.max(PZ_MIN, pzScale + delta));
        const rect = lbPanzoomEl.getBoundingClientRect();
        const cx = e.clientX - rect.left - rect.width / 2;
        const cy = e.clientY - rect.top - rect.height / 2;
        const ratio = 1 - newScale / pzScale;
        pzX += (cx - pzX) * ratio;
        pzY += (cy - pzY) * ratio;
        pzScale = newScale;
        if (pzScale <= PZ_MIN) { pzReset(); return; }
        lbPanzoomEl.classList.add('is-zoomed');
        lbImage.style.transition = 'none';
        pzApply();
    }, { passive: false });

    // Mouse drag to pan
    lbPanzoomEl.addEventListener('mousedown', (e) => {
        if (!pzIsZoomed()) return;
        e.preventDefault();
        pzDragging = true;
        pzStartX = e.clientX;
        pzStartY = e.clientY;
        pzStartPanX = pzX;
        pzStartPanY = pzY;
        lbPanzoomEl.classList.add('is-grabbing');
    });

    window.addEventListener('mousemove', (e) => {
        if (!pzDragging) return;
        pzX = pzStartPanX + (e.clientX - pzStartX);
        pzY = pzStartPanY + (e.clientY - pzStartY);
        lbImage.style.transition = 'none';
        pzApply();
    });

    window.addEventListener('mouseup', () => {
        pzDragging = false;
        lbPanzoomEl.classList.remove('is-grabbing');
    });

    // Double-click to reset / toggle zoom
    lbPanzoomEl.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        if (pzIsZoomed()) {
            pzReset();
        } else {
            pzScale = 2.5;
            const rect = lbPanzoomEl.getBoundingClientRect();
            pzX = (rect.width / 2 - (e.clientX - rect.left)) * (pzScale - 1) / pzScale;
            pzY = (rect.height / 2 - (e.clientY - rect.top)) * (pzScale - 1) / pzScale;
            lbImage.style.transition = 'transform 0.3s ease';
            pzApply();
            setTimeout(() => { lbImage.style.transition = 'none'; }, 300);
            lbPanzoomEl.classList.add('is-zoomed');
        }
    });

    // ── Touch: pinch-to-zoom + drag pan ──
    let pzPinchStartDist = 0;
    let pzPinchStartScale = 1;

    function pzGetPinchDist(touches) {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.hypot(dx, dy);
    }

    lbPanzoomEl.addEventListener('touchstart', (e) => {
        if (!lightbox.classList.contains('is-active')) return;
        if (e.touches.length === 2) {
            e.preventDefault();
            pzPinchStartDist = pzGetPinchDist(e.touches);
            pzPinchStartScale = pzScale;
        } else if (e.touches.length === 1 && pzIsZoomed()) {
            e.preventDefault();
            pzDragging = true;
            pzStartX = e.touches[0].clientX;
            pzStartY = e.touches[0].clientY;
            pzStartPanX = pzX;
            pzStartPanY = pzY;
        }
    }, { passive: false });

    lbPanzoomEl.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            const dist = pzGetPinchDist(e.touches);
            pzScale = Math.min(PZ_MAX, Math.max(PZ_MIN, pzPinchStartScale * (dist / pzPinchStartDist)));
            if (pzScale > PZ_MIN) lbPanzoomEl.classList.add('is-zoomed');
            lbImage.style.transition = 'none';
            pzApply();
        } else if (e.touches.length === 1 && pzDragging) {
            e.preventDefault();
            pzX = pzStartPanX + (e.touches[0].clientX - pzStartX);
            pzY = pzStartPanY + (e.touches[0].clientY - pzStartY);
            lbImage.style.transition = 'none';
            pzApply();
        }
    }, { passive: false });

    lbPanzoomEl.addEventListener('touchend', () => {
        pzDragging = false;
        if (pzScale <= PZ_MIN) pzReset();
    });

    // ── Lightbox open / close / nav ──
    function openLightbox(index) {
        currentLbIndex = index;
        const d = dressData[index];
        if (!d) return;
        lbImage.src = d.image;
        lbImage.alt = d.title;
        lbVol.textContent = d.vol;
        lbTitle.textContent = d.title;
        pzReset();
        lightbox.classList.add('is-active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        closeModal();
    }

    function closeLightbox() {
        pzReset();
        lightbox.classList.remove('is-active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function lightboxNav(direction) {
        pzReset();
        currentLbIndex = (currentLbIndex + direction + dressData.length) % dressData.length;
        const d = dressData[currentLbIndex];
        lbImage.src = d.image;
        lbImage.alt = d.title;
        lbVol.textContent = d.vol;
        lbTitle.textContent = d.title;
    }

    // Double-click image → lightbox
    document.querySelectorAll('.card-image-wrap').forEach((wrap) => {
        const card = wrap.closest('.dress-card');
        wrap.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            openLightbox(getDataIndex(card));
        });
    });

    // Modal image click → lightbox
    modalImage.addEventListener('click', () => {
        const idx = dressData.findIndex(d => {
            const src = modalImage.src;
            return src.endsWith(d.image) || src.includes(d.image);
        });
        openLightbox(idx >= 0 ? idx : 0);
    });

    lbClose.addEventListener('click', closeLightbox);
    lbPrev.addEventListener('click', (e) => { e.stopPropagation(); lightboxNav(-1); });
    lbNext.addEventListener('click', (e) => { e.stopPropagation(); lightboxNav(1); });
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Keyboard
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('is-active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') lightboxNav(-1);
            if (e.key === 'ArrowRight') lightboxNav(1);
            if (e.key === '+' || e.key === '=') {
                pzScale = Math.min(PZ_MAX, pzScale + PZ_STEP * 2);
                lbPanzoomEl.classList.add('is-zoomed');
                lbImage.style.transition = 'transform 0.15s ease';
                pzApply();
                setTimeout(() => { lbImage.style.transition = 'none'; }, 150);
            }
            if (e.key === '-') {
                pzScale = Math.max(PZ_MIN, pzScale - PZ_STEP * 2);
                if (pzScale <= PZ_MIN) pzReset();
                else { lbImage.style.transition = 'transform 0.15s ease'; pzApply(); setTimeout(() => { lbImage.style.transition = 'none'; }, 150); }
            }
        } else if (modal.classList.contains('is-active')) {
            if (e.key === 'Escape') closeModal();
        }
    });

    // Touch swipe for lightbox navigation (only when NOT zoomed)
    let touchStartX = 0;
    lightbox.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1 && !pzIsZoomed()) {
            touchStartX = e.touches[0].clientX;
        }
    }, { passive: true });
    lightbox.addEventListener('touchend', (e) => {
        if (pzIsZoomed()) return;
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) lightboxNav(diff > 0 ? 1 : -1);
    }, { passive: true });

})();
