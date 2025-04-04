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
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 80, // Adjust for header height
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header scroll effect
    const header = document.querySelector('header');
    
    // Check if this is the contact page and add scrolled class immediately if it is
    if (document.body.classList.contains('contact-page')) {
        header.classList.add('scrolled');
    }
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            // Only remove the scrolled class if not on contact page
            if (!document.body.classList.contains('contact-page')) {
                header.classList.remove('scrolled');
            }
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
    
    // Add GitHub profile link to CTA button
    const projectsCta = document.querySelector('.projects-cta a');
    if (projectsCta) {
        projectsCta.href = `https://github.com/${username}`;
        projectsCta.target = '_blank';
        projectsCta.textContent = 'See All Projects on GitHub';
    }
}