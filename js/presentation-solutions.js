(function () {
    'use strict';

    /* ── config ── */
    var DURATION = 6000;
    var TITLES   = ['Microservices', 'Security & APIs', 'Databases'];
    var ACCENTS  = ['#818cf8', '#22d3ee', '#34d399'];
    var GLOWS    = [
        'radial-gradient(ellipse 65% 55% at 65% 50%, rgba(129,140,248,0.17) 0%, transparent 70%)',
        'radial-gradient(ellipse 65% 55% at 65% 50%, rgba(34,211,238,0.15)  0%, transparent 70%)',
        'radial-gradient(ellipse 65% 55% at 65% 50%, rgba(52,211,153,0.14)  0%, transparent 70%)'
    ];

    var root = document.getElementById('ssc-stage');
    if (!root) return;

    function q(sel)  { return root.querySelector(sel); }
    function qa(sel) { return [].slice.call(root.querySelectorAll(sel)); }

    var glow        = q('#ssc-glow');
    var panels      = qa('.ssc-panel');
    var svgPanels   = qa('.ssc-svg-panel');
    var dots        = qa('.ssc-dot');
    var wheelBtns   = qa('.ssc-wheel-btn');
    var wheelLabels = qa('.ssc-wheel-label');
    var wheelFills  = qa('.ssc-wheel-fill');

    var current    = 0;
    var busy       = false;
    var rafId      = null;
    var startTs    = 0;
    var paused     = false;
    var pauseStart = 0;

    /* ── accent + glow update ── */
    function applyAccent(i) {
        var a = ACCENTS[i];
        root.style.setProperty('--ssc-accent', a);
        glow.style.background = GLOWS[i];
        dots.forEach(function (d, idx) {
            d.classList.toggle('ssc-active', idx === i);
            d.style.background = idx === i ? a : '';
            d.style.boxShadow  = idx === i ? '0 0 10px ' + a : '';
        });
    }

    /* ── wheel sync ── */
    function syncWheel(i) {
        var n    = TITLES.length;
        var prev = (i - 1 + n) % n;
        var next = (i + 1) % n;
        var map  = [prev, i, next];
        var slots = ['ssc-wh-prev', 'ssc-wh-active', 'ssc-wh-next'];

        wheelBtns.forEach(function (btn, slot) {
            var idx = map[slot];
            btn.classList.remove('ssc-wh-prev', 'ssc-wh-active', 'ssc-wh-next');
            btn.classList.add(slots[slot]);
            btn.setAttribute('data-ssc-i', idx);
            btn.setAttribute('aria-label', TITLES[idx]);
            btn.setAttribute('aria-current', slot === 1 ? 'true' : 'false');
            wheelLabels[slot].textContent = TITLES[idx];
            if (slot === 1) {
                wheelFills[slot].style.width   = '0%';
                wheelFills[slot].style.opacity = '1';
            } else {
                wheelFills[slot].style.width   = '22%';
                wheelFills[slot].style.opacity = '0.2';
            }
        });
    }

    /* ── progress bar ── */
    function runProgress() {
        cancelAnimationFrame(rafId);
        wheelFills[1].style.width = '0%';
        startTs    = performance.now();
        pauseStart = 0;

        (function tick(now) {
            if (paused) {
                if (!pauseStart) pauseStart = now;
                rafId = requestAnimationFrame(tick);
                return;
            }
            if (pauseStart) { startTs += now - pauseStart; pauseStart = 0; }

            var pct = Math.min(((now - startTs) / DURATION) * 100, 100);
            wheelFills[1].style.width = pct + '%';
            if (pct >= 100) { go((current + 1) % panels.length); return; }
            rafId = requestAnimationFrame(tick);
        })(startTs);
    }

    /* ── slide transition ── */
    function go(next) {
        if (busy || next === current) return;
        busy = true;
        cancelAnimationFrame(rafId);

        var prev = current;
        applyAccent(next);
        syncWheel(next);

        panels[prev].classList.remove('ssc-active');
        svgPanels[prev].classList.remove('ssc-active');

        setTimeout(function () {
            current = next;
            panels[next].classList.add('ssc-active');
            svgPanels[next].classList.add('ssc-active');
            busy = false;
            runProgress();
        }, 280);
    }

    /* ── wheel button clicks ── */
    wheelBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var i = parseInt(btn.getAttribute('data-ssc-i'), 10);
            if (!isNaN(i)) go(i);
        });
    });

    /* ── dot clicks ── */
    dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            go(parseInt(dot.getAttribute('data-ssc-i'), 10));
        });
    });

    /* ── keyboard ── */
    root.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown')
            go((current + 1) % panels.length);
        if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')
            go((current - 1 + panels.length) % panels.length);
    });

    /* ── pause ONLY when hovering over the wheel label text elements ── */
    wheelLabels.forEach(function (lbl) {
        lbl.addEventListener('mouseenter', function () { paused = true; });
        lbl.addEventListener('mouseleave', function () { paused = false; });
    });

    /* ── swipe ── */
    var tx = null;
    root.addEventListener('touchstart', function (e) {
        tx = e.touches[0].clientX;
    }, { passive: true });
    root.addEventListener('touchend', function (e) {
        if (tx === null) return;
        var dx = e.changedTouches[0].clientX - tx;
        tx = null;
        if (Math.abs(dx) < 44) return;
        go(dx < 0
            ? (current + 1) % panels.length
            : (current - 1 + panels.length) % panels.length);
    }, { passive: true });

    /* ── boot ── */
    function boot() {
        applyAccent(0);
        syncWheel(0);
        panels[0].classList.add('ssc-active');
        svgPanels[0].classList.add('ssc-active');
        runProgress();
    }

    document.readyState === 'loading'
        ? document.addEventListener('DOMContentLoaded', boot)
        : boot();

})();