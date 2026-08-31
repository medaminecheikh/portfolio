
    /* ==========================================================================
       MODULE 03 JS — HERO INTRO TYPEWRITER
       Prefix: ph-intro / phIntro
       Remove this IIFE if you remove the intro module.
       ========================================================================== */
    (function () {
        "use strict";

        var el = document.getElementById("phIntroDynamic");
        if (!el) return;

        var phrases = [
            "Full Stack Development",
            "AI Integrations",
            "App Architecture",
            "Modern UI / UX"
        ];

        var phraseIndex = 0;
        var charIndex   = 0;
        var deleting    = false;
        var TYPE_MS     = 70;
        var DELETE_MS   = 40;
        var HOLD_MS     = 1800;
        var GAP_MS      = 400;

        function tick() {
            var current = phrases[phraseIndex];

            if (!deleting) {
                el.textContent = current.slice(0, charIndex + 1);
                charIndex++;

                if (charIndex === current.length) {
                    deleting = true;
                    setTimeout(tick, HOLD_MS);
                    return;
                }
                setTimeout(tick, TYPE_MS);
            } else {
                el.textContent = current.slice(0, charIndex - 1);
                charIndex--;

                if (charIndex === 0) {
                    deleting = false;
                    phraseIndex = (phraseIndex + 1) % phrases.length;
                    setTimeout(tick, GAP_MS);
                    return;
                }
                setTimeout(tick, DELETE_MS);
            }
        }

        /* Start after a short delay so the page paints first */
        setTimeout(tick, 600);
    })();
