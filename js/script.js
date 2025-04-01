document.addEventListener('DOMContentLoaded', function() {
    // Initialize Typed.js
    const typed = new Typed('.typed-text', {
        strings: ['a Machine Learning Engineer', 'an AI Architect', 'an LLM Engineer'],
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 2000,
        loop: true
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('.nav-link, .scroll-down a, .back-to-top a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop,
                behavior: 'smooth'
            });
        });
    });

    // Header scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const menuBtn = document.querySelector('.menu-btn');
    const navItems = document.querySelector('.nav-items');
    
    menuBtn.addEventListener('click', function() {
        menuBtn.classList.toggle('open');
        navItems.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            menuBtn.classList.remove('open');
            navItems.classList.remove('active');
        });
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

    // Project filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    // Initialize filter buttons if they exist
    if (filterBtns.length > 0) {
        setupProjectFilters();
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
});

// Function to fetch GitHub repositories
async function fetchGitHubRepos(username) {
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`);
        
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

// Function to setup project filtering
function setupProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            projectItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
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
    
    // Initialize project filtering
    setupProjectFilters();
    
    // Add GitHub profile link to CTA button
    const projectsCta = document.querySelector('.projects-cta a');
    if (projectsCta) {
        projectsCta.href = `https://github.com/${username}`;
        projectsCta.target = '_blank';
        projectsCta.textContent = 'See All Projects on GitHub';
    }
}