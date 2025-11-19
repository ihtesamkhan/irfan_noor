// Mobile Detection and Viewport Fixes
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// Fix viewport height on mobile browsers
function setViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

setViewportHeight();
window.addEventListener('resize', setViewportHeight);
window.addEventListener('orientationchange', () => {
    setTimeout(setViewportHeight, 100);
});

// Custom Cursor (Desktop only)
if (!isMobile && !isTouch && window.innerWidth > 768) {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    if (cursor && cursorFollower) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            setTimeout(() => {
                cursorFollower.style.left = e.clientX - 20 + 'px';
                cursorFollower.style.top = e.clientY - 20 + 'px';
            }, 100);
        });
        
        document.body.style.cursor = 'none';
    }
}

// Touch-friendly interactions
if (isTouch) {
    // Add touch feedback to buttons
    document.querySelectorAll('.btn-primary, .btn-secondary, .btn-download').forEach(btn => {
        btn.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        btn.addEventListener('touchend', function() {
            this.style.transform = '';
        });
    });
    
    // Prevent zoom on double tap for buttons
    document.querySelectorAll('button, .btn-primary, .btn-secondary, .btn-download').forEach(element => {
        element.addEventListener('touchend', function(e) {
            e.preventDefault();
        });
    });
}

// Mobile Navigation with Enhanced Touch Support
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
    navToggle.addEventListener('click', (e) => {
        e.preventDefault();
        navLinks.classList.toggle('active');
        navToggle.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navLinks.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Close menu when clicking on links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

// Hero Animations
const tl = gsap.timeline({ delay: 0.5 });

tl.to('.title-line', {
    y: 0,
    opacity: 1,
    duration: 1,
    stagger: 0.2,
    ease: 'power3.out'
})
.to('.hero-subtitle', {
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: 'power3.out'
}, '-=0.5')
.to('.hero-cta', {
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: 'power3.out'
}, '-=0.6')
.to('.visual-card', {
    y: 0,
    opacity: 1,
    rotation: 5,
    duration: 1,
    ease: 'back.out(1.7)'
}, '-=0.8');

// Scroll Animations
gsap.utils.toArray('.skill-item').forEach((item, i) => {
    gsap.fromTo(item, 
        { y: 50, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: i * 0.1,
            scrollTrigger: {
                trigger: item,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        }
    );
});

gsap.utils.toArray('.work-item').forEach((item, i) => {
    gsap.fromTo(item,
        { y: 60, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 1,
            delay: i * 0.2,
            scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        }
    );
});

// Stats Counter (Simplified)
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const stat = entry.target;
            const target = stat.textContent;
            const number = parseInt(target.replace(/\D/g, ''));
            const suffix = target.replace(/\d/g, '');
            
            let current = 0;
            const increment = number / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= number) {
                    stat.textContent = number + suffix;
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.ceil(current) + suffix;
                }
            }, 40);
            
            statsObserver.unobserve(stat);
        }
    });
}, observerOptions);

document.querySelectorAll('.stat-number').forEach(stat => {
    statsObserver.observe(stat);
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});



// Simple fade-in animations
const fadeElements = document.querySelectorAll('.skill-item, .work-item');
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

fadeElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    fadeObserver.observe(el);
});

// Dark Mode Toggle
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;
const icon = themeToggle.querySelector('i');

// Check for saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark');
    icon.classList.replace('fa-moon', 'fa-sun');
}

function toggleTheme() {
    body.classList.toggle('dark');
    
    if (body.classList.contains('dark')) {
        icon.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('theme', 'dark');
    } else {
        icon.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('theme', 'light');
    }
}

themeToggle.addEventListener('click', toggleTheme);
themeToggle.addEventListener('touchend', (e) => {
    e.preventDefault();
    toggleTheme();
});

// Enhanced Contact Form with EmailJS
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn = contactForm.querySelector('.btn-primary');
        const originalText = btn.textContent;
        const formData = new FormData(contactForm);
        
        // Basic validation
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const message = contactForm.querySelector('textarea').value;
        
        if (!name || !email || !message) {
            alert('Please fill in all fields');
            return;
        }
        
        btn.textContent = 'Sending...';
        btn.disabled = true;
        
        // Simulate sending (replace with actual backend)
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            btn.textContent = 'Message Sent!';
            btn.style.background = '#28a745';
            contactForm.reset();
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.disabled = false;
            }, 3000);
        } catch (error) {
            btn.textContent = 'Error - Try Again';
            btn.style.background = '#dc3545';
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.disabled = false;
            }, 3000);
        }
    });
}

// Loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Scroll Progress Indicator
const scrollProgress = document.createElement('div');
scrollProgress.className = 'scroll-progress';
scrollProgress.innerHTML = '<div class="progress-bar"></div>';
document.body.appendChild(scrollProgress);

// Scroll progress is now handled in the optimized scroll function above

// Back to Top Click
const backToTop = document.querySelector('.back-to-top');
backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// PDF Download Functionality
const downloadBtn = document.getElementById('downloadResume');
if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
        try {
            generatePDF();
        } catch (error) {
            console.error('PDF generation failed:', error);
            // Fallback: create simple text-based resume
            downloadTextResume();
        }
    });
}

function generatePDF() {
    // Check if jsPDF is loaded
    if (typeof window.jspdf === 'undefined') {
        console.error('jsPDF not loaded, using fallback');
        downloadTextResume();
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Set colors
    const primaryColor = [255, 107, 53]; // Orange
    const darkColor = [26, 26, 26];
    const grayColor = [102, 102, 102];
    
    // Header
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 40, 'F');
    
    // Name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('IRFAN NOOR', 20, 25);
    
    // Title
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Digital Creator & Social Media Influencer', 20, 32);
    
    // Contact Info
    doc.setTextColor(...darkColor);
    doc.setFontSize(10);
    let yPos = 55;
    
    doc.text('📧 isatisfy82@gmail.com', 20, yPos);
    doc.text('📱 +92 302 9156540', 20, yPos + 7);
    doc.text('🌍 Pakistan', 20, yPos + 14);
    doc.text('💼 LinkedIn: linkedin.com/in/irfan-ul-haq-6797b72b1', 20, yPos + 21);
    
    // About Section
    yPos += 35;
    doc.setTextColor(...primaryColor);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('ABOUT ME', 20, yPos);
    
    doc.setTextColor(...darkColor);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    yPos += 10;
    
    const aboutText = "I'm a digital creator who believes in the power of authentic storytelling. Based in Pakistan, I specialize in creating content that not only entertains but also educates and inspires positive change.";
    const splitAbout = doc.splitTextToSize(aboutText, 170);
    doc.text(splitAbout, 20, yPos);
    
    // Skills Section
    yPos += 25;
    doc.setTextColor(...primaryColor);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('CORE SKILLS', 20, yPos);
    
    doc.setTextColor(...darkColor);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    yPos += 10;
    
    const skills = [
        '• Video Production & Editing',
        '• Social Media Strategy & Management',
        '• Public Speaking & Presentations',
        '• Content Writing & Storytelling',
        '• Community Building & Engagement'
    ];
    
    skills.forEach(skill => {
        doc.text(skill, 25, yPos);
        yPos += 7;
    });
    
    // Experience Section
    yPos += 10;
    doc.setTextColor(...primaryColor);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('KEY ACHIEVEMENTS', 20, yPos);
    
    doc.setTextColor(...darkColor);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    yPos += 10;
    
    const achievements = [
        '• Youth Empowerment Campaign - Inspired 50,000+ young Pakistanis',
        '• Content Creation Masterclass - Trained 500+ aspiring creators',
        '• Community Leadership Initiative - Led digital transformation workshops',
        '• Brand Collaborations - Strategic partnerships with 20+ brands',
        '• Built engaged community of 15K+ followers across platforms'
    ];
    
    achievements.forEach(achievement => {
        const splitAchievement = doc.splitTextToSize(achievement, 165);
        doc.text(splitAchievement, 25, yPos);
        yPos += splitAchievement.length * 7;
    });
    
    // Footer
    doc.setTextColor(...grayColor);
    doc.setFontSize(8);
    doc.text('Generated from irfannoor.com', 20, 280);
    doc.text('© 2025 Irfan Noor. All rights reserved.', 20, 285);
    
    // Save the PDF
    doc.save('Irfan_Noor_Resume.pdf');
    
    // Show success message
    const originalText = downloadBtn.innerHTML;
    downloadBtn.innerHTML = '<i class="fas fa-check"></i> Downloaded!';
    downloadBtn.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
    
    setTimeout(() => {
        downloadBtn.innerHTML = originalText;
        downloadBtn.style.background = '';
    }, 3000);
}

// Fallback text resume download
function downloadTextResume() {
    const resumeContent = `
IRFAN NOOR
Digital Creator & Social Media Influencer

📧 Email: isatisfy82@gmail.com
📱 Phone: +92 302 9156540
🌍 Location: Pakistan
💼 LinkedIn: linkedin.com/in/irfan-ul-haq-6797b72b1

ABOUT ME
========
I'm a digital creator who believes in the power of authentic storytelling. Based in Pakistan, I specialize in creating content that not only entertains but also educates and inspires positive change.

CORE SKILLS
===========
• Video Production & Editing
• Social Media Strategy & Management
• Public Speaking & Presentations
• Content Writing & Storytelling
• Community Building & Engagement

KEY ACHIEVEMENTS
================
• Youth Empowerment Campaign - Inspired 50,000+ young Pakistanis
• Content Creation Masterclass - Trained 500+ aspiring creators
• Community Leadership Initiative - Led digital transformation workshops
• Brand Collaborations - Strategic partnerships with 20+ brands
• Built engaged community of 15K+ followers across platforms

STATISTICS
==========
• 15K+ Followers
• 200+ Projects Completed
• 50+ Successful Collaborations

---
Generated from irfannoor.com
© 2025 Irfan Noor. All rights reserved.
    `;
    
    const blob = new Blob([resumeContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Irfan_Noor_Resume.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    // Show success message
    const originalText = downloadBtn.innerHTML;
    downloadBtn.innerHTML = '<i class="fas fa-check"></i> Downloaded!';
    downloadBtn.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
    
    setTimeout(() => {
        downloadBtn.innerHTML = originalText;
        downloadBtn.style.background = '';
    }, 3000);
}

// Performance optimizations for mobile
if (isMobile) {
    // Reduce animation complexity on mobile
    document.documentElement.style.setProperty('--animation-duration', '0.3s');
    
    // Lazy load images
    const images = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Optimize scroll performance
let ticking = false;

function updateScrollProgress() {
    const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.style.width = scrolled + '%';
    }
    
    // Back to Top Button
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }
    
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateScrollProgress);
        ticking = true;
    }
}, { passive: true });

console.log('🚀 Portfolio V2 Enhanced - Mobile Optimized - Loaded Successfully!');
console.log('📱 Mobile Device:', isMobile);
console.log('👆 Touch Support:', isTouch);