document.addEventListener("DOMContentLoaded", () => {
gsap.registerPlugin(TextPlugin);
        const textElement = document.getElementById('dynamicText');
        const texts = [
            'Full Stack Developer',
            'DevOps Engineer',
            'AI Engineer',
            
        ];
        
        let currentIndex = 0;

        function animateText() {
            const currentText = texts[currentIndex];
            const nextIndex = (currentIndex + 1) % texts.length;
            const nextText = texts[nextIndex];

            const tl = gsap.timeline({
                onComplete: () => {
                    currentIndex = nextIndex;
                    animateText();
                }
            });

            // Show full text (already visible)
            tl.to({}, { duration: 2 }); // Pause to read
              
            // Erase text character by character from right to left
            for (let i = currentText.length; i >= 0; i--) {
                tl.to(textElement, {
                    duration: 0.07,
                    text: currentText.substring(0, i),
                    ease: "none"
                });
            }
              
            // Small pause when empty
            tl.to({}, { duration: 0.3 });
              
            // Type new text character by character from left to right
            for (let i = 1; i <= nextText.length; i++) {
                tl.to(textElement, {
                    duration: 0.08,
                    text: nextText.substring(0, i),
                    ease: "none"
                });
            }
        }

        // Start the animation after a brief delay
        gsap.delayedCall(1, animateText);   });

        document.addEventListener("DOMContentLoaded", () => {
            gsap.registerPlugin(SplitText);
        
            // Grab all elements with the class
            const elements = document.querySelectorAll(".revealtext");
        
            elements.forEach((el) => {
                // Split into words
                const split = new SplitText(el, { type: "words" });
        
                // Animate each word from bottom
                gsap.from(split.words, {
                    duration: 0.9,
                    y: 50,          // rise up
                    opacity: 0,     // fade in
                    ease: "power3.out",
                    stagger: 0.15   // delay between words
                });
            });
        });
        
        

        document.addEventListener("DOMContentLoaded", () => {
            gsap.registerPlugin(ScrollTrigger);
        
            function animateRotatingWord(containerSelector = ".animated-text") {
                const containers = document.querySelectorAll(containerSelector);
        
                containers.forEach((animatedText) => {
                    const rotatingWord = animatedText.querySelector(".rotating-word");
                  
        
                    gsap.fromTo(rotatingWord,
                        { rotation: -75, y: -80, opacity: 0 },
                        {
                            rotation: 0,
                            y: 0,
                            opacity: 1,
                            ease: "bounce.out",
                            duration: 1.5,
                            scrollTrigger: {
                                trigger: animatedText,
                                start: "top 85%",
                                toggleActions: "play none none none", // play once on scroll
                            }
                        }
                    );
                });
            }
        
            // Call it for all elements with .animated-text
            animateRotatingWord();
        });
  
        // Wait until DOM is ready AND GSAP/ScrollTrigger are loaded
  document.addEventListener("DOMContentLoaded", () => {
    // register plugin
    gsap.registerPlugin(ScrollTrigger);

    const bounceWords = gsap.utils.toArray(".bounce-word");

    if (bounceWords.length === 0) {
      console.warn("No .bounce-word elements found");
      return;
    }

    bounceWords.forEach((word) => {
      const delay = parseFloat(word.dataset.delay) || 0;

      gsap.fromTo(
        word,
        { rotation: -75, y: -80, opacity: 0 },
        {
          rotation: 0,
          y: 0,
          opacity: 1,
          ease: "bounce.out",
          duration: 1.2,
          delay: delay,
          scrollTrigger: {
            trigger: word,
            start: "top 90%",              // adjust if you want earlier/later
            toggleActions: "play none none none",
             once: false,                 // uncomment if you want it to play only once
            // markers: true,              // uncomment to visualize trigger start/end (debug)
          }
        }
      );
    });

    // optional: refresh ScrollTrigger after setup
    ScrollTrigger.refresh();
  });