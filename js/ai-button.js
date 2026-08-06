let isActive = false;

// Create quantum particles
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 4 + 's';
        particlesContainer.appendChild(particle);
    }
}

// Scroll smoothly to assistant section
function scrollToPosition() {
    const assistantSection = document.getElementById('assistant');
    if (!assistantSection) return;
    
    const headerHeight = document.getElementById('cyberNavHeader')?.offsetHeight || 0;
    const targetPos = assistantSection.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
    
    window.scrollTo({
        top: targetPos,
        behavior: 'smooth'
    });
}

// Check if user is at assistant section
function checkPosition() {
    const assistantSection = document.getElementById('assistant');
    if (!assistantSection) return false;
    
    const headerHeight = document.getElementById('cyberNavHeader')?.offsetHeight || 0;
    const sectionTop = assistantSection.getBoundingClientRect().top + window.pageYOffset;
    const sectionBottom = sectionTop + assistantSection.offsetHeight;
    const currentPos = window.scrollY;
    const range = 150; // tolerance range
    
    return currentPos >= (sectionTop - headerHeight - range) && 
           currentPos <= (sectionBottom + range);
}

// Update button state based on position
function updateButton() {
    const holographicText = document.querySelector('.holographic-text');
    
    if (checkPosition()) {
        // At assistant section - show AI Active
        if (!isActive) {
            isActive = true;
            holographicText.textContent = 'AI Active';
        }
    } else {
        // Not at section - show Let's Travel
        if (isActive) {
            isActive = false;
            holographicText.textContent = "Let's Travel";
        }
    }
}

// AI activation function
function activateAI() {
    const holographicText = document.querySelector('.holographic-text');
    const aiIcon = document.getElementById('aiIcon');
    const thinkingDots = document.getElementById('thinkingDots');
    
    // Show processing mode
    aiIcon.style.display = 'none';
    thinkingDots.style.display = 'flex';
    holographicText.textContent = 'Processing...';
    
    // Scroll to assistant section
    scrollToPosition();
    
    // After 1.5 seconds, update based on position
    setTimeout(() => {
        thinkingDots.style.display = 'none';
        aiIcon.style.display = 'block';
        updateButton();
    }, 1500);
}

// Create energy burst effect
function createEnergyBurst() {
    const container = document.querySelector('.chatbot-container');
    for (let i = 0; i < 12; i++) {
        const burst = document.createElement('div');
        burst.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: linear-gradient(45deg, #8e44ad, #c39bd3);
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            animation: energyBurst 1s ease-out forwards;
        `;
        
        const angle = (360 / 12) * i;
        burst.style.setProperty('--angle', angle + 'deg');
        
        container.appendChild(burst);
        
        setTimeout(() => burst.remove(), 1000);
    }
}

// Initialize particles
createParticles();

// Monitor scroll and update button
window.addEventListener('scroll', updateButton);

// Initial check
setTimeout(updateButton, 500);

// Continuous neural activity simulation
setInterval(() => {
    if (isActive) {
        const particles = document.querySelectorAll('.particle');
        particles.forEach(particle => {
            if (Math.random() > 0.7) {
                particle.style.background = `radial-gradient(circle, #${Math.random() > 0.5 ? '8e44ad' : 'c39bd3'} 0%, transparent 70%)`;
            }
        });
    }
}, 1000);