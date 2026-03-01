// Generate Website Function
function generateWebsite() {
    const websiteName = document.getElementById('websiteName').value.trim();
    
    if (!websiteName) {
        alert('⚠️ Please enter a website name!');
        return;
    }
    
    // Show loading animation
    const btn = document.querySelector('.generate-btn');
    const originalText = btn.textContent;
    btn.textContent = 'Generating...';
    btn.style.background = '#999';
    btn.disabled = true;
    
    // Simulate website generation (replace with actual API call)
    setTimeout(() => {
        // Redirect to builder page with website name
        const builderURL = `builder.html?name=${encodeURIComponent(websiteName)}`;
        window.location.href = builderURL;
        
        // Reset button
        btn.textContent = originalText;
        btn.style.background = '#ff5722';
        btn.disabled = false;
    }, 1500);
}

// Enter key support for input
document.getElementById('websiteName')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        generateWebsite();
    }
});

// Domain card click handlers
document.querySelectorAll('.domain-card').forEach(card => {
    card.addEventListener('click', function() {
        // Remove active class from all cards
        document.querySelectorAll('.domain-card').forEach(c => {
            c.style.border = 'none';
        });
        
        // Add active state to clicked card
        this.style.border = '3px solid #2c5282';
        
        // Store selected domain
        const domain = this.querySelector('.domain-ext').textContent;
        localStorage.setItem('selectedDomain', domain);
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Pricing plan buttons
document.querySelectorAll('.plan-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const planName = this.closest('.pricing-card').querySelector('h3').textContent;
        alert(`✅ You selected the ${planName} plan! \n\nRedirecting to checkout...`);
        // Here you can redirect to payment/checkout page
    });
});

// Animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply animation to cards
document.addEventListener('DOMContentLoaded', function() {
    const animateElements = document.querySelectorAll('.feature-card, .step-card, .pricing-card');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Add particle effect to hero section (optional)
function createParticles() {
    const hero = document.querySelector('.hero-section');
    if (!hero) return;
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '2px';
        particle.style.height = '2px';
        particle.style.background = 'rgba(255,255,255,0.5)';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `float ${5 + Math.random() * 10}s infinite ease-in-out`;
        hero.appendChild(particle);
    }
}

// CSS animation for particles
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% {
            transform: translateY(0) translateX(0);
        }
        50% {
            transform: translateY(-20px) translateX(10px);
        }
    }
`;
document.head.appendChild(style);

// Create particles on page load
window.addEventListener('load', createParticles);
