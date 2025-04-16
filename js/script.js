document.addEventListener('DOMContentLoaded', function() {
    // Initialize Typed.js
    const typed = new Typed('.typed-text', {
        strings: [
            'intelligent AI systems',
            'machine learning models',
            'NLP solutions',
            'LLM applications'
        ],
        typeSpeed: 70,
        backSpeed: 40,
        backDelay: 2000,
        loop: true,
        cursorChar: '|',
        smartBackspace: true
    });
    
    // Activate animations when elements come into view
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .fade-in');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('appear');
            }
        });
    };
    
    // Activate hero section animations immediately
    document.querySelectorAll('.hero .fade-in-up').forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('appear');
        }, index * 200); // Stagger the animations
    });

    // Smooth scrolling for navigation links
    // Select all anchor links starting with '#' but not just '#'
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            // Use try...catch for robustness if the target doesn't exist
            try {
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const headerOffset = document.querySelector('header') ? document.querySelector('header').offsetHeight : 50; // Get header height or default
                    const elementPosition = targetSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition, 
                        behavior: 'smooth'
                    });
                }
            } catch (error) {
                console.error("Error finding target element for smooth scroll:", targetId, error);
            }
        });
    });

    // Call the animation function on scroll and load
    window.addEventListener('scroll', animateOnScroll);
    window.addEventListener('load', animateOnScroll);
    
    // Header scroll effect
    const header = document.querySelector('header');
    const backToTop = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
            backToTop.classList.add('show');
        } else {
            header.classList.remove('scrolled');
            backToTop.classList.remove('show');
        }
    });
    
    // Project hover effects
    const projectItems = document.querySelectorAll('.project-item');
    
    projectItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.querySelector('.project-overlay').style.opacity = '1';
        });
        
        item.addEventListener('mouseleave', () => {
            item.querySelector('.project-overlay').style.opacity = '0';
        });
    });
    
    // Add parallax effect to hero section
    const heroSection = document.querySelector('.hero');
    
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        if (scrollPosition < window.innerHeight) {
            heroSection.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
        }
    });

    // Fetch GitHub repositories
    const username = 'brijesh24bs'; // Replace with your actual GitHub username
    const projectsGrid = document.querySelector('.projects-grid');
    const projectsLoader = document.createElement('div');
    projectsLoader.className = 'projects-loader';
    projectsLoader.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading projects...';
    
    if (projectsGrid) {
        projectsGrid.innerHTML = '';
        projectsGrid.appendChild(projectsLoader);
        
        fetchGitHubRepos(username);
    }

    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Simple form validation
            if (!name || !email || !message) {
                alert('Please fill in all required fields');
                return;
            }
            
            // In a real application, you would send this data to a server
            // For now, let's just show a success message
            alert('Thanks for your message! I will get back to you soon.');
            contactForm.reset();
        });
    }

    // Intersection Observer for scroll animations
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Optional: Stop observing once visible
                }
            });
        }, { 
            threshold: 0.1 // Trigger when 10% of the element is visible
        });

        // Make observer available globally for dynamic content
        window.projectObserver = observer;

        animatedElements.forEach(el => {
            observer.observe(el);
        });
    } else {
        // Fallback for browsers that don't support Intersection Observer
        animatedElements.forEach(el => {
            el.classList.add('visible'); 
        });
    }

    // Mobile menu toggle
    const navToggle = document.getElementById('nav-toggle');
    const navItems = document.getElementById('nav-items');
    
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navItems.classList.toggle('show');
        });
    }
    
    // Close mobile menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navItems.classList.remove('show');
            
            // Active link highlighting
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            link.classList.add('active');
        });
    });
    
    // Update active nav link based on scroll position
    const sections = document.querySelectorAll('section');
    
    function updateActiveLink() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveLink);
});

// Function to fetch GitHub repositories
async function fetchGitHubRepos(username) {
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=5`);
        
        if (!response.ok) {
            if (response.status === 403) {
                throw new Error('GitHub API rate limit exceeded. Please try again later.');
            } else if (response.status === 404) {
                throw new Error(`GitHub user "${username}" not found.`);
            } else {
                throw new Error(`GitHub API error: ${response.status}`);
            }
        }
        
        const repos = await response.json();
        displayGitHubRepos(repos, username);
    } catch (error) {
        console.error('Error fetching GitHub repositories:', error);
        const projectsGrid = document.querySelector('.projects-grid');
        if (projectsGrid) {
            projectsGrid.innerHTML = `
                <div class="github-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>${error.message || 'Failed to load GitHub repositories. Please try again later.'}</p>
                </div>
            `;
        }
    }
}

// Function to determine project category based on repo topics and language
function getProjectCategory(repo) {
    const language = repo.language ? repo.language.toLowerCase() : '';
    
    if (language === 'javascript' || language === 'typescript' || language === 'html' || language === 'css') {
        return 'web';
    } else if (language === 'figma' || repo.name.toLowerCase().includes('design') || (repo.description && repo.description.toLowerCase().includes('design'))) {
        return 'design';
    } else {
        return 'other';
    }
}

// Function to display GitHub repositories in the projects grid
function displayGitHubRepos(repos, username) {
    const projectsGrid = document.querySelector('.projects-grid');
    
    if (!projectsGrid) return;
    
    projectsGrid.innerHTML = '';
    
    if (repos.length === 0) {
        projectsGrid.innerHTML = '<div class="no-repos">No repositories found</div>';
        return;
    }
    
    repos.forEach(repo => {
        const category = getProjectCategory(repo);
        const projectDate = new Date(repo.updated_at).toLocaleDateString();
        const stars = repo.stargazers_count;
        const forks = repo.forks_count;
        
        const projectItem = document.createElement('div');
        projectItem.className = 'project-item';
        projectItem.setAttribute('data-category', category);
        
        // Add animation class initially
        projectItem.classList.add('animate-on-scroll');

        projectItem.innerHTML = `
            <div class="project-img">
                <div class="project-thumbnail">
                    <i class="fab fa-github"></i>
                    <span class="repo-language">${repo.language || 'N/A'}</span>
                </div>
                <div class="project-overlay">
                    <div class="project-info">
                        <h3>${repo.name}</h3>
                        <p>${repo.description || 'No description available'}</p>
                        <div class="repo-meta">
                            <span class="repo-stars"><i class="fas fa-star"></i> ${stars}</span>
                            <span class="repo-forks"><i class="fas fa-code-branch"></i> ${forks}</span>
                            <span class="repo-date"><i class="far fa-calendar-alt"></i> ${projectDate}</span>
                        </div>
                        <div class="project-links">
                            ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" title="Live Demo"><i class="fas fa-external-link-alt"></i></a>` : ''}
                            <a href="${repo.html_url}" target="_blank" title="View on GitHub"><i class="fab fa-github"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        projectsGrid.appendChild(projectItem);
    });
    
    // Re-observe newly added elements if Intersection Observer exists
    if ('IntersectionObserver' in window && window.projectObserver) {
        const newItems = projectsGrid.querySelectorAll('.animate-on-scroll');
        newItems.forEach(item => window.projectObserver.observe(item));
    }

    // Add GitHub profile link to CTA button
    const projectsCta = document.querySelector('.projects-cta a');
    if (projectsCta) {
        projectsCta.href = `https://github.com/${username}`;
        projectsCta.target = '_blank';
        projectsCta.textContent = 'See All Projects on GitHub';
    }
}