

'use strict';

(function ($) {

    /*------------------
        Preloader
    --------------------*/
    $(window).on('load', function () {
        $(".loader").fadeOut();
        $("#preloder").delay(200).fadeOut("slow");

        /*------------------
            Portfolio filter
        --------------------*/
        $('.portfolio__filter li').on('click', function () {
            $('.portfolio__filter li').removeClass('active');
            $(this).addClass('active');
        });
        if ($('.portfolio__gallery').length > 0) {
            var containerEl = document.querySelector('.portfolio__gallery');
            var mixer = mixitup(containerEl);
        }
    });

    /*------------------
        Background Set
    --------------------*/
    $('.set-bg').each(function () {
        var bg = $(this).data('setbg');
        $(this).css('background-image', 'url(' + bg + ')');
    });

    //Masonary
    $('.work__gallery').masonry({
        itemSelector: '.work__item',
        columnWidth: '.grid-sizer',
        gutter: 10
    });

    /*------------------
        Navigation
    --------------------*/
    $(".mobile-menu").slicknav({
        prependTo: '#mobile-menu-wrap',
        allowParentLinks: true
    });

    /*------------------
        Hero Slider
    --------------------*/
    $('.hero__slider').owlCarousel({
        loop: true,
        dots: true,
        mouseDrag: false,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        items: 1,
        margin: 0,
        smartSpeed: 1500,
        autoplayTimeout: 6000,   // slide stays 6 seconds
        autoplayHoverPause: true,
        autoHeight: false,
        autoplay: true,
    });

    var dot = $('.hero__slider .owl-dot');
    dot.each(function () {
        var index = $(this).index() + 1;
        if (index < 10) {
            $(this).html('0').append(index);
        } else {
            $(this).html(index);
        }
    });

    /*------------------
        Testimonial Slider
    --------------------*/
    $(".testimonial__slider").owlCarousel({
        loop: true,
        margin: 0,
        items: 3,
        dots: true,
        dotsEach: 2,
        smartSpeed: 1200,
        autoHeight: false,
        autoplay: true,
        responsive: {
            992: {
                items: 3
            },
            768: {
                items: 2
            },
            320: {
                items: 1
            }
        }
    });

    /*------------------
        Latest Slider
    --------------------*/
    $(".latest__slider").owlCarousel({
        loop: true,
        margin: 0,
        items: 3,
        dots: true,
        dotsEach: 2,
        smartSpeed: 1200,
        autoHeight: false,
        autoplay: true,
        responsive: {
            992: {
                items: 3
            },
            768: {
                items: 2
            },
            320: {
                items: 1
            }
        }
    });

    /*------------------
        Logo Slider
    --------------------*/
    $(".logo__carousel").owlCarousel({
        loop: true,
        margin: 100,
        items: 6,
        dots: false,
        smartSpeed: 1200,
        autoHeight: false,
        autoplay: true,
        responsive: {
            992: {
                items: 5
            },
            768: {
                items: 4
            },
            480: {
                items: 3
            },
            320: {
                items: 2
            }
        }
    });

    /*------------------
        Video Popup
    --------------------*/
    $('.video-popup').magnificPopup({
        type: 'image',   // or 'iframe' if it’s a PDF or HTML page
        mainClass: 'mfp-fade',
        removalDelay: 300,
        fixedContentPos: false
    });


    /*------------------
        Counter
    --------------------*/
    $('.counter_num').each(function () {
        $(this).prop('Counter', 0).animate({
            Counter: $(this).text()
        }, {
            duration: 4000,
            easing: 'swing',
            step: function (now) {
                $(this).text(Math.ceil(now));
            }
        });
    });

})(jQuery);



// Copy-to-clipboard + tooltip
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("copyEmail");
    const tooltip = btn.querySelector(".tooltip");
    const email = btn.getAttribute("data-email");

    function showTooltip(text) {
        tooltip.textContent = text;
        btn.classList.add("show");

        clearTimeout(btn._timer);
        btn._timer = setTimeout(() => {
            btn.classList.remove("show");
            tooltip.textContent = "Copy email"; // reset
        }, 1500);
    }

    async function copyEmail(e) {
        e.preventDefault();
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(email);
            } else {
                const ta = document.createElement("textarea");
                ta.value = email;
                document.body.appendChild(ta);
                ta.select();
                document.execCommand("copy");
                document.body.removeChild(ta);
            }
            showTooltip("Copied!");
        } catch (err) {
            showTooltip("Failed");
        }
    }

    btn.addEventListener("click", copyEmail);
});
// scroll adjust
document.addEventListener('click', function (e) {
    const btn = e.target.closest('a.scroll-btn');
    if (!btn) return;

    e.preventDefault();

    const isMobile = window.innerWidth <= 768;
    const ds = btn.dataset;

    // Decide which attribute to use
    let pos = isMobile ? Number(ds.mobile ?? ds.pos) : Number(ds.desktop ?? ds.pos);

    // If NaN or missing → default to 0
    if (!Number.isFinite(pos)) pos = 0;

    // Clamp to valid range
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (pos > maxScroll) pos = maxScroll;


    window.scrollTo({ top: pos, behavior: 'smooth' });
});

/*------------------
     horizontal scroll panels
 --------------------*/

document.addEventListener("DOMContentLoaded", () => {


    // Register the plugin
    gsap.registerPlugin(ScrollTrigger);

    // Select all panels
    let sections = gsap.utils.toArray(".panel");

    // Calculate the total width of movement (Number of sections - 1)
    let scrollTween = gsap.to(sections, {
        xPercent: -100 * (sections.length - 1), // Move panels to the left
        ease: "none", // Linear movement (important for scroll mapping)
        scrollTrigger: {
            trigger: ".portfolio-wrapper",
            pin: true, // Pin the container while scrolling
            scrub: 1, // Smooth scrubbing effect (1 second delay)
            snap: {
                snapTo: 1 / (sections.length - 1), // Snap to each panel (1/2 = 0.5)
                duration: 0.4, // Snap animation duration
                delay: 0.1, // Wait 0.1s before snapping
                ease: "power1.inOut" // Smooth snap casing
            },
            // "end" determines how long the scroll distance is. 
            // "+=3000" means you have to scroll 3000px down to get through all slides.
            end: "+=3000"
        }
    });
});