(function () {

    gsap.registerPlugin(ScrollTrigger);


    const wrapper =
        document.querySelector("#sp-horizontal-wrapper");

    const panels =
        gsap.utils.toArray(
            "#sp-portfolio-wrapper .panel"
        );


    if (!wrapper || panels.length === 0) {
        return;
    }


    /*
       IMPORTANT:

       Do not use wrapper.scrollWidth here.

       The panels intentionally use 100vw and GSAP controls their
       horizontal movement. Using scrollWidth can become inaccurate
       when the browser includes scrollbar width.

       Calculate the movement from the actual panel count.
    */

    function getScrollAmount() {

        return window.innerWidth *
            (panels.length - 1);

    }


    const tween = gsap.to(
        panels,
        {
            xPercent: -100 * (panels.length - 1),

            ease: "none"
        }
    );


    const progressBar =
        document.querySelector(
            "#sp-progress-bar"
        );


    ScrollTrigger.create({

        trigger:
            "#sp-portfolio-container",

        pin: true,

        animation: tween,

        scrub: 1,

        snap: {

            snapTo:
                1 / (panels.length - 1),

            duration: {
                min: 0.3,
                max: 0.6
            },

            delay: 0.3,

            ease: "power2.inOut",

            directional: false,

            inertia: false

        },

        anticipatePin: 1,

        end: () =>
            `+=${getScrollAmount()}`,


        onUpdate: function (self) {

            if (progressBar) {

                progressBar.style.width =
                    `${self.progress * 100}%`;

            }

        }

    });


    /*
       Recalculate GSAP after resize/orientation change.
    */

    let resizeTimer;


    window.addEventListener(
        "resize",
        function () {

            clearTimeout(resizeTimer);

            resizeTimer =
                setTimeout(function () {

                    ScrollTrigger.refresh();

                    if (
                        typeof window.refreshSSCLayout ===
                        "function"
                    ) {
                        window.refreshSSCLayout();
                    }

                }, 200);

        }
    );


    /* ============================================================
       IMAGE CAROUSELS
       ============================================================ */

    const carousels =
        document.querySelectorAll(
            "#sp-portfolio-wrapper [data-carousel]"
        );


    carousels.forEach(function (carousel) {

        const slides =
            carousel.querySelectorAll(
                ".product-slide"
            );

        const dotsContainer =
            carousel.querySelector(
                ".carousel-dots"
            );


        if (!slides.length || !dotsContainer) {
            return;
        }


        let currentSlide = 0;

        let autoPlayInterval;


        slides.forEach(
            function (slide, index) {

                const dot =
                    document.createElement(
                        "button"
                    );

                dot.classList.add(
                    "carousel-dot"
                );

                dot.setAttribute(
                    "aria-label",
                    `Go to slide ${index + 1}`
                );


                if (index === 0) {
                    dot.classList.add("active");
                }


                dot.addEventListener(
                    "click",
                    function () {

                        goToSlide(index);

                        resetAutoPlay();

                    }
                );


                dotsContainer.appendChild(dot);

            }
        );


        const dots =
            dotsContainer.querySelectorAll(
                ".carousel-dot"
            );


        function goToSlide(index) {

            if (!slides[currentSlide] ||
                !dots[currentSlide]) {
                return;
            }


            slides[currentSlide]
                .classList.remove("active");

            dots[currentSlide]
                .classList.remove("active");


            currentSlide = index;


            slides[currentSlide]
                .classList.add("active");

            dots[currentSlide]
                .classList.add("active");

        }


        function startAutoPlay() {

            clearInterval(autoPlayInterval);


            autoPlayInterval =
                setInterval(
                    function () {

                        const nextSlide =
                            (currentSlide + 1) %
                            slides.length;

                        goToSlide(nextSlide);

                    },
                    4000
                );

        }


        function resetAutoPlay() {

            clearInterval(
                autoPlayInterval
            );

            startAutoPlay();

        }


        carousel.addEventListener(
            "mouseenter",
            function () {

                clearInterval(
                    autoPlayInterval
                );

            }
        );


        carousel.addEventListener(
            "mouseleave",
            function () {

                startAutoPlay();

            }
        );


        startAutoPlay();

    });


})();


/* ================================================================
   SOLUTIONS COMPONENT RESPONSIVE LAYOUT
   ================================================================ */

(function () {

    const stage =
        document.querySelector("#ssc-stage");

    const nav =
        document.querySelector(
            ".cyber-nav-header"
        );


    if (!stage) {
        return;
    }


    /*
       Instead of guessing the navbar height with
       margin-top/padding-top values, measure the
       REAL fixed navbar height.

       The value is exposed as a CSS variable and can
       be used by the component if needed.
    */

    function updateNavHeight() {

        if (!nav) {
            document.documentElement
                .style
                .setProperty(
                    "--cyber-nav-height",
                    "0px"
                );

            return;
        }


        const height =
            nav.getBoundingClientRect().height;


        document.documentElement
            .style
            .setProperty(
                "--cyber-nav-height",
                `${height}px`
            );

    }


    updateNavHeight();


    let timer;


    function refreshLayout() {

        clearTimeout(timer);

        timer = setTimeout(
            function () {

                updateNavHeight();

            },
            50
        );

    }


    window.refreshSSCLayout =
        refreshLayout;


    window.addEventListener(
        "resize",
        refreshLayout
    );


    window.addEventListener(
        "orientationchange",
        refreshLayout
    );


    /*
       Keep the stage centered after accounting
       for the actual navbar.

       This does NOT move the whole portfolio or
       interfere with GSAP pinning.
    */

    function positionStage() {

        const navHeight =
            parseFloat(
                getComputedStyle(
                    document.documentElement
                )
                .getPropertyValue(
                    "--cyber-nav-height"
                )
            ) || 0;


        /*
           Only the Solutions stage receives the
           visual offset.

           The portfolio panel itself remains 100vh.
        */

        if (
            window.innerWidth <= 767
        ) {

            stage.style.height =
                "100%";

            stage.style.minHeight =
                "0";

            stage.style.marginTop =
                "0";

            return;

        }


        /*
           Desktop/tablet:

           Reduce the available content area by
           the navbar height and center within it.

           This is why the wheel will no longer
           sit against the navbar.
        */

        const availableHeight =
            Math.max(
                0,
                window.innerHeight -
                navHeight
            );


        stage.style.height =
            `${availableHeight}px`;

        stage.style.marginTop =
            `${navHeight}px`;

    }


    positionStage();


    window.addEventListener(
        "resize",
        positionStage
    );


    window.addEventListener(
        "orientationchange",
        positionStage
    );


    window.refreshSSCLayout =
        function () {

            updateNavHeight();

            positionStage();

        };

})();