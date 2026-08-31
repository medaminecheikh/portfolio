
   (function() {
       // 1. HORIZONTAL SCROLL LOGIC WITH CONTROLLED SNAP
       gsap.registerPlugin(ScrollTrigger);
   
       const wrapper = document.querySelector("#sp-horizontal-wrapper");
       const panels = gsap.utils.toArray("#sp-portfolio-wrapper .panel");
   
       if (!wrapper || panels.length === 0) return;
   
       function getScrollAmount() {
           let wrapperWidth = wrapper.scrollWidth;
           return -(wrapperWidth - window.innerWidth);
       }
   
       const tween = gsap.to(panels, {
           xPercent: -100 * (panels.length - 1),
           ease: "none",
       });
   
       const progressBar = document.querySelector("#sp-progress-bar");
   
       ScrollTrigger.create({
           trigger: "#sp-portfolio-container",
           pin: true,
           animation: tween,
           scrub: 1, // Smoother scrubbing
           
           // MODIFIED SNAP - Only snaps when you stop scrolling, more forgiving
           snap: {
               snapTo: 1 / (panels.length - 1),
               duration: {min: 0.3, max: 0.6}, // Slower snap
               delay: 0.3, // Wait longer before snapping
               ease: "power2.inOut", // Smoother easing
               directional: false, // Don't force direction
               inertia: false // Disable momentum-based snapping
           },
           
           anticipatePin: 1,
           end: () => `+=${getScrollAmount() * -1}`,
           
           // Only enable snap when actually in the portfolio section
           onEnter: () => {
               
           },
           onLeave: () => {
              
           },
           
           onUpdate: (self) => {
               if (progressBar) {
                   progressBar.style.width = `${self.progress * 100}%`;
               }
           }
       });
   
       let resizeTimer;
       window.addEventListener('resize', () => {
           clearTimeout(resizeTimer);
           resizeTimer = setTimeout(() => {
               ScrollTrigger.refresh();
           }, 250);
       });
   
       // 2. IMAGE CAROUSEL LOGIC
       const carousels = document.querySelectorAll('#sp-portfolio-wrapper [data-carousel]');
   
       carousels.forEach(carousel => {
           const slides = carousel.querySelectorAll('.product-slide');
           const dotsContainer = carousel.querySelector('.carousel-dots');
           let currentSlide = 0;
           let autoPlayInterval;
   
           slides.forEach((slide, index) => {
               const dot = document.createElement('button');
               dot.classList.add('carousel-dot');
               dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
               if (index === 0) dot.classList.add('active');
               
               dot.addEventListener('click', () => {
                   goToSlide(index);
                   resetAutoPlay();
               });
               
               dotsContainer.appendChild(dot);
           });
   
           const dots = dotsContainer.querySelectorAll('.carousel-dot');
   
           function goToSlide(index) {
               slides[currentSlide].classList.remove('active');
               dots[currentSlide].classList.remove('active');
               currentSlide = index;
               slides[currentSlide].classList.add('active');
               dots[currentSlide].classList.add('active');
           }
   
           function startAutoPlay() {
               autoPlayInterval = setInterval(() => {
                   let nextSlide = (currentSlide + 1) % slides.length;
                   goToSlide(nextSlide);
               }, 4000);
           }
   
           function resetAutoPlay() {
               clearInterval(autoPlayInterval);
               startAutoPlay();
           }
   
           carousel.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
           carousel.addEventListener('mouseleave', () => startAutoPlay());
   
           startAutoPlay();
       });
   
   })();
