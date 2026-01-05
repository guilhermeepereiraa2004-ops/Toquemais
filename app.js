// Page Navigation
let isLoginMode = true;

function showPage(pageName) {
    console.log('showPage called with:', pageName);

    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
        console.log('Hiding page:', page.id);
    });

    // Show selected page
    const targetPage = document.getElementById(`${pageName}-page`);
    console.log('Looking for page with ID:', `${pageName}-page`);
    console.log('Found page:', targetPage);

    if (targetPage) {
        targetPage.classList.add('active');
        console.log('Activated page:', targetPage.id);
    } else {
        console.error('Page not found!', `${pageName}-page`);
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Prevent default link behavior
    return false;
}

// Login/Signup Toggle - REMOVED (only admin can create accounts)
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');

    // Handle form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const userType = document.getElementById('userType').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Simple validation
            if (!email || !password) {
                alert('Por favor, preencha todos os campos!');
                return;
            }

            // Simulate login - in production, this would connect to a backend
            if (userType === 'admin') {
                showPage('admin-dashboard');
            } else {
                showPage('student-dashboard');
            }
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});

// Logout function
function logout() {
    showPage('login');
}

// Prevent default behavior for navigation links
document.addEventListener('click', function (e) {
    const target = e.target.closest('a');
    if (target && target.hasAttribute('onclick')) {
        e.preventDefault();
    }
});

// Add loading animation on page load
window.addEventListener('load', function () {
    document.body.style.opacity = '0';
    setTimeout(function () {
        document.body.style.transition = 'opacity 0.5s ease-in-out';
        document.body.style.opacity = '1';
    }, 100);
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', function () {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
        navbar.style.boxShadow = 'none';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
    }

    lastScroll = currentScroll;
});

// Add intersection observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections
document.addEventListener('DOMContentLoaded', function () {
    const elements = document.querySelectorAll('.card, .section');
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
});

console.log('Toque+ Platform Loaded Successfully! 🎵');
