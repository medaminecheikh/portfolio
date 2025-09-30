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
        gsap.delayedCall(1, animateText);