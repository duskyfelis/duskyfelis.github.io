// scripts/main.js
// Consolidated script for duskyfelis website

(function() {
    // ==================== UTILITY FUNCTIONS ====================
    
    function elementExists(selector) {
        return document.querySelector(selector) !== null;
    }
    
    function getCurrentPage() {
        return window.location.pathname.split('/').pop() || 'index.html';
    }
    
    // ==================== NAVIGATION ====================
    
    function initNavigation() {
        if (elementExists('.nav')) return;
        
        const currentPage = getCurrentPage();
        
        const isActive = (href) => {
            if (href === '/') {
                return currentPage === '' || currentPage === 'index.html' || currentPage === '/' ? 'active' : '';
            }
            if (href.startsWith('mailto:')) return '';
            return currentPage === href ? 'active' : '';
        };
        
        const navHTML = `
            <nav class="nav">
                <div class="nav-container">
                    <a href="/" class="logo">duskyfelis</a>
                    <div class="nav-links">
                        <a href="/" class="${isActive('/')}">Home</a>
                        <a href="about.html" class="${isActive('about.html')}">About</a>
                        <a href="mailto:duskyfelis@tuta.io">Contact</a>
                    </div>
                </div>
            </nav>
        `;

        document.body.insertAdjacentHTML('afterbegin', navHTML);
    }
    
// ==================== FOOTER ====================
    
function initFooter() {
    // Check if footer already exists
    if (document.querySelector('footer')) return;
    
    // Get current page filename
    const pathname = window.location.pathname;
    let currentPage = pathname.split('/').pop() || 'index.html';
    currentPage = currentPage.split('?')[0].split('#')[0];
    
    // Find the main container - try multiple selectors
    const container = document.querySelector('.container') || 
                      document.querySelector('main') || 
                      document.querySelector('body > div:first-child');
    
    if (!container) {
        console.warn('No container found for footer');
        return;
    }
    
    // Footer configurations for different pages
    const footerConfig = {
        'qr-now.html': {
            note: '📱 Generate QR codes instantly • No tracking • Open source • Works offline',
            links: [
                { text: 'Home', url: '/' },
                { text: 'GitHub', url: 'https://github.com/duskyfelis/QR-Now' },
                { text: 'About', url: 'about.html' },
            ]
        },
        'api-playground.html': {
            note: '🔧 Test REST APIs • Free • No login required • Built with Fetch API',
            links: [
                { text: 'Home', url: '/' },
                { text: 'GitHub', url: 'https://github.com/duskyfelis/duskyfelis.github.io/raw/refs/heads/main/scripts/api-playground.js' },
                { text: 'About', url: 'about.html' },
            ]
        },
        'json-tool.html': {
            note: '📊 Format • Validate • Minify • JSON.parse/stringify • 100% client-side',
            links: [
                { text: 'Home', url: '/' },
                { text: 'GitHub', url: 'https://github.com/duskyfelis/duskyfelis.github.io/raw/refs/heads/main/scripts/json-tool.js' },
                { text: 'About', url: 'about.html' },
            ]
        },
        'colour-palette.html': {
            note: '🎨 Colour schemes • Contrast testing • CSS/Tailwind/SCSS export • WCAG',
            links: [
                { text: 'Home', url: '/' },
                { text: 'GitHub', url: 'https://github.com/duskyfelis/duskyfelis.github.io/raw/refs/heads/main/scripts/colour-palette.js' },
                { text: 'About', url: 'about.html' },
            ]
        },
        'about.html': {
            note: 'Built with JavaScript • Works offline • No tracking • Open source',
            links: [
                { text: 'Home', url: '/' },
                { text: 'GitHub', url: 'https://github.com/duskyfelis' },
                { text: 'Projects', url: '/#projects' },
            ]
        },
        'index.html': {
            note: 'Building tools that make life easier • Open source • Privacy first',
            links: [
                { text: 'About', url: 'about.html' },
                { text: 'GitHub', url: 'https://github.com/duskyfelis' },
                { text: 'Contact', url: 'mailto:duskyfelis@tuta.io' },
            ]
        },
        'default': {
            note: 'Built with JavaScript • Works offline • No tracking',
            links: [
                { text: 'Home', url: '/' },
                { text: 'GitHub', url: 'https://github.com/duskyfelis' },
                { text: 'About', url: 'about.html' }
            ]
        },

        '404.html': {
            note: "You've met with a terrible fate, haven't you?",
            links: [
                { text: 'Home', url: '/' },
                { text: 'GitHub', url: 'https://github.com/duskyfelis' },
                { text: 'About', url: 'about.html' }
            ]
        }
    };


    
    // Get config for current page or use default
    const config = footerConfig[currentPage] || footerConfig.default;
    
    // Generate footer links HTML
    const footerLinksHTML = config.links.map(link => 
        `<a href="${link.url}">${link.text}</a>`
    ).join('');
    
    const footerHTML = `
        <footer>
            <div class="status-note">
                ${config.note}
            </div>
            <div class="footer-content">
                <div>© 2026 duskyfelis</div>
                <div class="footer-links">
                    ${footerLinksHTML}
                </div>
            </div>
        </footer>
    `;

    // Insert after the container
    if (container.parentNode) {
        container.insertAdjacentHTML('afterend', footerHTML);
        console.log(`Footer loaded for page: ${currentPage}`);
    } else {
        // Fallback: append to body
        document.body.insertAdjacentHTML('beforeend', footerHTML);
        console.log(`Footer loaded (fallback) for page: ${currentPage}`);
    }
}
    // ==================== PROJECTS DATA ====================
    
    const projectsData = {
        featured: [
            {
                preview: "📱",
                title: "QR-Now",
                url: "qr-now.html",
                githubUrl: "https://github.com/duskyfelis/QR-Now",
                description: "Instant QR codes from any webpage. Click, scan, go. No tracking, open source.",
                type: "📦 Browser extension",
                category: "🌐 Everyday use",
                badge: "NEW",
                color: "#10b981"
            },
            {
                preview: "🔧",
                title: "API Playground",
                url: "api-playground.html",
                githubUrl: "https://raw.githubusercontent.com/duskyfelis/duskyfelis.github.io/refs/heads/main/scripts/api-playground.js",
                description: "Send custom REST API calls from a handy terminal.",
                type: "📦 Web based",
                category: "🌐 Developer tool",
                badge: "NEW",
                color: "#a855f7"
            },
            {
                preview: "📊",
                title: "JSON Tool",
                url: "json-tool.html",
                githubUrl: "https://raw.githubusercontent.com/duskyfelis/duskyfelis.github.io/refs/heads/main/scripts/json-tool.js",
                description: "JSON validation, formatting, and minifying.",
                type: "📦 Web based",
                category: "🌐 Developer tool",
                badge: "NEW",
                color: "#3b82f6"
            }
        ],
        
        repository: [
            {
                preview: "📊",
                title: "QR-Now",
                description: "Instant QR codes from any webpage. Click, scan, go. No tracking, open ",
                meta: ["📦 Browser extension", "🌐 Everyday use"],
                links: [
                    { text: "Try out →", url: "qr-now.html", isPrimary: true }
                ],
                color: "#10b981"
            },
            {
                preview: "🔧",
                title: "API Playground",
                description: "Test public APIs in your browser.",
                meta: ["📦 Web based", "🌐 Developer tool"],
                links: [
                    { text: "Try out →", url: "api-playground.html", isPrimary: true },
                                ],
                color: "#a855f7"
            },
            {
                preview: "📊",
                title: "JSON Tools",
                description: "JSON validation, formatting, and minifying.",
                meta: ["📦 Web based", "🌐 Developer tool"],
                links: [
                    { text: "Try out →", url: "json-tool.html", isPrimary: true }
                ],
                color: "#3b82f6"
            },
            {
                preview: "🎨",
                title: "Colour Palette Generator",
                description: "Create beautiful colour schemes.",
                meta: ["📦 Web based", "🌐 Everyday use"],
                links: [
                    { text: "Try out →", url: "colour-palette.html", isPrimary: true }
                ],
                color: "#ec4899"
            }
        ],
        
        random: [
            { name: 'QR-Now', url: 'qr-now.html', emoji: '📱', color: '#10b981' },
            { name: 'Colour Palette Generator', url: 'colour-palette.html', emoji: '🎨', color: '#ec4899' },
            { name: 'API Playground', url: 'api-playground.html', emoji: '🔧', color: '#a855f7' },
            { name: 'JSON Tool', url: 'json-tool.html', emoji: '📊', color: '#3b82f6' }
        ]
    };
    
    // ==================== FEATURED PROJECTS LOADER ====================
    
    function loadFeaturedProjects() {
        const featuredSection = document.querySelector('#projects + .projects-grid');
        if (!featuredSection) return;

        featuredSection.innerHTML = '';

        projectsData.featured.forEach(project => {
            const card = document.createElement('div');
            card.className = 'project-card';

            const preview = document.createElement('div');
            preview.className = 'project-preview qr-preview';
            preview.style.fontSize = '5rem';
            preview.textContent = project.preview;
            card.appendChild(preview);

            const content = document.createElement('div');
            content.className = 'project-content';
            
            const header = document.createElement('div');
            header.className = 'project-header';
            
            const titleLink = document.createElement('a');
            titleLink.href = project.url;
            titleLink.className = 'project-title';
            titleLink.textContent = project.title;
            
            const badge = document.createElement('span');
            badge.className = 'project-badge';
            badge.textContent = project.badge;
            
            header.appendChild(titleLink);
            header.appendChild(badge);
            
            const desc = document.createElement('div');
            desc.className = 'project-desc';
            desc.textContent = project.description;
            
            const meta = document.createElement('div');
            meta.className = 'project-meta';
            
            const typeSpan = document.createElement('span');
            typeSpan.textContent = project.type;
            
            const categorySpan = document.createElement('span');
            categorySpan.textContent = project.category;
            
            meta.appendChild(typeSpan);
            meta.appendChild(categorySpan);
            
            const links = document.createElement('div');
            links.className = 'project-links';
            
            const detailsLink = document.createElement('a');
            detailsLink.href = project.url;
            detailsLink.className = 'project-link';
            detailsLink.textContent = 'Details →';
            
            const githubLink = document.createElement('a');
            githubLink.href = project.githubUrl;
            githubLink.className = 'project-link';
            githubLink.textContent = 'View on GitHub →';
            githubLink.target = '_blank';
            
            links.appendChild(detailsLink);
            links.appendChild(githubLink);
            
            content.appendChild(header);
            content.appendChild(desc);
            content.appendChild(meta);
            content.appendChild(links);
            card.appendChild(content);
            
            featuredSection.appendChild(card);
        });
        
        console.log('Featured projects loaded');
    }
    
    // ==================== PROJECT REPOSITORY LOADER ====================
    
    function loadProjectRepository() {
        const projectsGrid = document.querySelector('.projects-grid');
        if (!projectsGrid) return;

        projectsGrid.innerHTML = '';

        projectsData.repository.forEach(project => {
            const card = document.createElement('div');
            card.className = 'project-card';

            const preview = document.createElement('div');
            preview.className = 'project-preview';
            preview.textContent = project.preview;
            card.appendChild(preview);

            const content = document.createElement('div');
            content.className = 'project-content';
            
            const header = document.createElement('div');
            header.className = 'project-header';
            
            const title = document.createElement('span');
            title.className = 'project-title';
            title.textContent = project.title;
            header.appendChild(title);
            content.appendChild(header);
            
            const desc = document.createElement('div');
            desc.className = 'project-desc';
            desc.textContent = project.description;
            content.appendChild(desc);
            
            const meta = document.createElement('div');
            meta.className = 'project-meta';
            project.meta.forEach(metaItem => {
                const span = document.createElement('span');
                span.textContent = metaItem;
                meta.appendChild(span);
            });
            content.appendChild(meta);
            
            const links = document.createElement('div');
            links.className = 'project-links';
            project.links.forEach(link => {
                const a = document.createElement('a');
                a.href = link.url;
                a.className = 'project-link';
                a.textContent = link.text;
                links.appendChild(a);
            });
            content.appendChild(links);
            
            card.appendChild(content);
            projectsGrid.appendChild(card);
        });
        
        console.log('Project repository loaded');
    }
    // ==================== RANDOM PROJECT BUTTON ====================

function initRandomProjectButton() {
    // Get current page filename
    const pathname = window.location.pathname;
    let currentPage = pathname.split('/').pop() || 'index.html';
    currentPage = currentPage.split('?')[0].split('#')[0];
    
    // ONLY initialize on homepage (index.html)
    if (currentPage !== 'index.html' && currentPage !== '') {
        return; // Don't initialize on other pages
    }
    
    const randomButton = document.querySelector('.hero-button-primary');
    if (!randomButton) return;
    
    const projects = [
        { name: 'QR-Now', url: 'qr-now.html', emoji: '📱', color: '#10b981' },
        { name: 'Colour Palette Generator', url: 'colour-palette.html', emoji: '🎨', color: '#ec4899' },
        { name: 'API Playground', url: 'api-playground.html', emoji: '🔧', color: '#a855f7' },
        { name: 'JSON Tool', url: 'json-tool.html', emoji: '📊', color: '#3b82f6' }
    ];
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'toast-notification';
    document.body.appendChild(notification);
    
    randomButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Disable button temporarily
        randomButton.style.pointerEvents = 'none';
        randomButton.style.opacity = '0.7';
        
        // Pick random project
        const randomIndex = Math.floor(Math.random() * projects.length);
        const selected = projects[randomIndex];
        
        // Animate button
        randomButton.style.transform = 'scale(0.95)';
        setTimeout(() => {
            randomButton.style.transform = 'scale(1)';
        }, 100);
        
        // Show notification
        notification.innerHTML = `
            <span style="font-size: 1.5rem;">${selected.emoji}</span>
            <div>
                <div style="font-weight: 600;">Taking you to...</div>
                <div style="color: ${selected.color};">${selected.name}</div>
            </div>
        `;
        notification.style.transform = 'translateY(0)';
        
        // Navigate
        setTimeout(() => {
            window.location.href = selected.url;
        }, 800);
        
        // Hide notification if navigation fails
        setTimeout(() => {
            notification.style.transform = 'translateY(400px)';
            randomButton.style.pointerEvents = 'auto';
            randomButton.style.opacity = '1';
        }, 5000);
    });
    
    // Add random emoji on hover
    randomButton.addEventListener('mouseenter', function() {
        const emojis = ['🎲', '✨', '🎯', '🎰', '🔀'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        this.innerHTML = `${randomEmoji} Random project`;
    });
    
    randomButton.addEventListener('mouseleave', function() {
        this.innerHTML = '🎲 Random project';
    });
}
    // ==================== RANDOM PROJECT FOR ABOUT PAGE ====================
    
    function initRandomProject() {
        const randomProjectContainer = document.getElementById('random-project');
        if (!randomProjectContainer) return;
        
        const elements = {
            loading: document.getElementById('project-loading'),
            content: document.getElementById('project-content'),
            emoji: document.getElementById('project-emoji'),
            name: document.getElementById('project-name'),
            description: document.getElementById('project-description'),
            link: document.getElementById('project-link'),
            github: document.getElementById('project-github')
        };
        
        const refreshBtn = document.getElementById('refresh-project');
        
        const projectHTML = projectsData.repository.map(project => {
            const primaryLink = project.links.find(l => l.isPrimary);
            const githubLink = project.links.find(l => l.url.includes('github'));
            
            return {
                title: project.title,
                html: `
                    <div class="project-content-flex">
                        <div id="project-emoji" class="project-emoji-large">${project.preview}</div>
                        <div class="project-info-container">
                            <div class="project-header-flex">
                                <h4 id="project-name" class="project-name-heading">${project.title}</h4>
                                <span class="project-random-badge">random pick</span>
                            </div>
                            <p id="project-description" class="project-description-text">${project.description}</p>
                            <div class="project-buttons-flex">
                                <a id="project-link" href="${primaryLink ? primaryLink.url : '#'}" class="project-link-primary" target="">View project →</a>
                                ${githubLink ? 
                                    `<a id="project-github" href="${githubLink.url}" class="project-link-secondary" target="_blank">GitHub →</a>` : 
                                    ''}
                            </div>
                        </div>
                    </div>
                `
            };
        });
        
        let currentIndex = -1;
        
        function getRandomIndex() {
            if (projectsData.repository.length === 1) return 0;
            
            let newIndex;
            do {
                newIndex = Math.floor(Math.random() * projectsData.repository.length);
            } while (newIndex === currentIndex);
            
            currentIndex = newIndex;
            return newIndex;
        }
        
        function showRandomProject() {
            const index = getRandomIndex();
            
            if (elements.loading) elements.loading.style.display = 'none';
            if (elements.content) {
                elements.content.classList.remove('project-content-hidden');
                elements.content.classList.add('project-content-visible');
                elements.content.innerHTML = projectHTML[index].html;
            }
        }
        
        showRandomProject();
        
        if (refreshBtn) {
            refreshBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                if (elements.loading) elements.loading.style.display = 'flex';
                if (elements.content) elements.content.classList.add('project-content-hidden');
                
                setTimeout(showRandomProject, 150);
            });
        }
    }
    
// ==================== PAGE-SPECIFIC GITHUB & FEEDBACK BUTTONS ====================

function initPageCTA() {
    // Get current page filename
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Only load on specific pages
    const targetPages = [
        'qr-now.html',
        'api-playground.html', 
        'json-tool.html',
        'colour-palette.html'
    ];
    
    // If not on a target page, don't load anything
    if (!targetPages.includes(currentPage)) return;
    
    // Find where to insert the buttons
    const container = document.querySelector('.container');
    if (!container) return;
    
    // Remove any existing github sections to prevent duplicates
    const existingGithub = document.querySelector('.github-section');
    if (existingGithub) existingGithub.remove();
    
    // GitHub SVG icon
    const githubSVG = `
        <svg aria-hidden="true" focusable="false" class="octicon octicon-mark-github" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style="vertical-align: middle; margin-right: 8px;">
            <path d="M10.303 16.652c-2.837-.344-4.835-2.385-4.835-5.028 0-1.074.387-2.235 1.031-3.008-.279-.709-.236-2.214.086-2.837.86-.107 2.02.344 2.708.967.816-.258 1.676-.386 2.728-.386 1.053 0 1.913.128 2.686.365.666-.602 1.848-1.053 2.708-.946.3.581.344 2.085.064 2.815.688.817 1.053 1.913 1.053 3.03 0 2.643-1.998 4.641-4.877 5.006.73.473 1.224 1.504 1.224 2.686v2.235c0 .644.537 1.01 1.182.752 3.889-1.483 6.94-5.372 6.94-10.185 0-6.081-4.942-11.044-11.022-11.044-6.081 0-10.98 4.963-10.98 11.044a10.84 10.84 0 0 0 7.112 10.206c.58.215 1.139-.172 1.139-.752v-1.719a2.768 2.768 0 0 1-1.032.215c-1.418 0-2.256-.773-2.857-2.213-.237-.58-.495-.924-.989-.988-.258-.022-.344-.129-.344-.258 0-.258.43-.451.86-.451.623 0 1.16.386 1.719 1.181.43.623.881.903 1.418.903.537 0 .881-.194 1.375-.688.365-.365.645-.687.903-.902Z"></path>
        </svg>
    `;
    
    // Star SVG icon
    const starSVG = `
        <svg aria-hidden="true" focusable="false" class="octicon octicon-star" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style="vertical-align: middle; margin-right: 8px;">
            <path d="M12 .25a.75.75 0 0 1 .673.418l3.058 6.197 6.839.994a.75.75 0 0 1 .416 1.279l-4.948 4.823 1.168 6.811a.75.75 0 0 1-1.088.791L12 18.347l-6.118 3.216a.75.75 0 0 1-1.088-.79l1.168-6.812-4.948-4.823a.75.75 0 0 1 .416-1.28l6.839-.994L11.327.668A.75.75 0 0 1 12 .25zm0 2.445L9.44 7.882a.75.75 0 0 1-.565.41l-5.725.832 4.143 4.038a.75.75 0 0 1 .215.664l-.978 5.702 5.121-2.692a.75.75 0 0 1 .698 0l5.121 2.692-.978-5.702a.75.75 0 0 1 .215-.664l4.143-4.038-5.725-.832a.75.75 0 0 1-.565-.41L12 2.695z"></path>
        </svg>
    `;
    
    // Email SVG icon
    const emailSVG = `
        <svg aria-hidden="true" focusable="false" class="octicon octicon-mail" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style="vertical-align: middle; margin-right: 8px;">
            <path d="M1.75 2h20.5c.966 0 1.75.784 1.75 1.75v16.5c0 .966-.784 1.75-1.75 1.75H1.75A1.75 1.75 0 0 1 0 20.25V3.75C0 2.784.784 2 1.75 2zM22 7.233V4.5H2v2.733l10 5.556 10-5.556zm0 2.512l-9.523 5.29a.75.75 0 0 1-.708 0L2 9.745v10.505h20V9.745z"></path>
        </svg>
    `;
    
    // Define button content based on page
    let buttonContent = {};
    
    switch(currentPage) {
        case 'qr-now.html':
            buttonContent = {
                githubText: `${starSVG} Star on GitHub`,
                githubUrl: "https://github.com/duskyfelis/QR-Now",
                feedbackText: `${emailSVG} Suggest improvement`,
                feedbackUrl: "mailto:duskyfelis@tuta.io?subject=QR-Now%20issue"
            };
            break;
            
        case 'api-playground.html':
            buttonContent = {
                githubText: `${githubSVG} View code on GitHub`,
                githubUrl: "https://github.com/duskyfelis/duskyfelis.github.io/raw/refs/heads/main/scripts/api-playground.js",
                feedbackText: `${emailSVG} Suggest improvement`,
                feedbackUrl: "mailto:duskyfelis@tuta.io?subject=API%20Playground%20feedback"
            };
            break;
            
        case 'json-tool.html':
            buttonContent = {
                githubText: `${githubSVG} View code on GitHub`,
                githubUrl: "https://raw.githubusercontent.com/duskyfelis/duskyfelis.github.io/refs/heads/main/scripts/json-tool.js",
                feedbackText: `${emailSVG} Suggest improvement`,
                feedbackUrl: "mailto:duskyfelis@tuta.io?subject=JSON%20Tools%20feedback"
            };
            break;
            
        case 'colour-palette.html':
            buttonContent = {
                githubText: `${githubSVG} View code on GitHub`,
                githubUrl: "https://github.com/duskyfelis/duskyfelis.github.io/raw/refs/heads/main/scripts/colour-palette.js",
                feedbackText: `${emailSVG} Suggest improvement`,
                feedbackUrl: "mailto:duskyfelis@tuta.io?subject=Colour%20Palette%20feedback"
            };
            break;
    }
    
// Generate GitHub and Feedback buttons HTML only
const buttonsHTML = `
    <!-- GitHub and Feedback Section -->
    <div class="github-section" style="text-align: center; margin: 3rem 0;">
        <a href="${buttonContent.githubUrl}" class="github-button" target="_blank">
            ${buttonContent.githubText}
        </a>
        <a href="${buttonContent.feedbackUrl}" class="feedback-button">
            ${buttonContent.feedbackText}
        </a>
    </div>
`;

    // Insert at the end of container
    container.insertAdjacentHTML('beforeend', buttonsHTML);
    
    console.log(`GitHub & Feedback buttons loaded for page: ${currentPage}`);
}

// ==================== SKILLS LOADER (DETAILED VERSION) ====================

function initSkills() {
    // Get current page filename
    const pathname = window.location.pathname;
    let currentPage = pathname.split('/').pop() || 'index.html';
    currentPage = currentPage.split('?')[0].split('#')[0];
    
    const container = document.querySelector('.container');
    if (!container) return;
    
    // Remove any existing skills section
    const existingSkills = document.querySelector('.skills-section');
    if (existingSkills) existingSkills.remove();
    
    // Detailed skills with categories
    const skillsConfig = {
        'qr-now.html': {
            title: 'Technologies Used',
            categories: [
                {
                    name: 'Core',
                    skills: ['JavaScript', 'HTML/CSS', 'Browser Extensions API']
                },
                {
                    name: 'Features',
                    skills: ['QR Code Generation', 'Manifest V3', 'Context Menus']
                }
            ]
        },
        
        'api-playground.html': {
            title: 'Technologies Used',
            categories: [
                {
                    name: 'Core',
                    skills: ['JavaScript', 'HTML/CSS', 'Fetch API']
                },
                {
                    name: 'Features',
                    skills: ['REST APIs', 'Async/Await', 'JSON Parsing']
                }
            ]
        },
        
        'json-tool.html': {
            title: 'Technologies Used',
            categories: [
                {
                    name: 'Core',
                    skills: ['JavaScript', 'HTML/CSS', 'JSON.parse/stringify']
                },
                {
                    name: 'Features',
                    skills: ['Regular Expressions', 'Local Storage', 'Syntax Highlighting']
                }
            ]
        },
        
        'colour-palette.html': {
            title: 'Technologies Used',
            categories: [
                {
                    name: 'Core',
                    skills: ['JavaScript', 'HTML/CSS', 'HSL/HSV Conversion']
                },
                {
                    name: 'Features',
                    skills: ['Colour Theory', 'WCAG Contrast', 'Local Storage', 'Export Functions']
                }
            ]
        },
        
        'about.html': {
            title: 'Currently Using',
            categories: [
                {
                    name: 'Languages',
                    skills: ['JavaScript', 'TypeScript', 'Python', 'HTML/CSS']
                },
                {
                    name: 'Frameworks & Tools',
                    skills: ['React', 'Node.js', 'Git', 'Browser Extensions']
                },
                {
                    name: 'Technologies',
                    skills: ['REST APIs', 'JSON', 'Colour Theory', 'Fetch API', 'Manifest V3']
                }
            ]
        },
        
        'index.html': {
            title: 'Skills & Technologies',
            categories: [
                {
                    name: 'Languages',
                    skills: ['JavaScript', 'TypeScript', 'Python', 'HTML/CSS']
                },
                {
                    name: 'Frameworks & Tools',
                    skills: ['React', 'Node.js', 'Git', 'Browser Extensions']
                }
            ]
        }
    };
    
    const config = skillsConfig[currentPage];
    if (!config) return; // Don't load skills on pages without config
    
    // Generate categories HTML
    let categoriesHTML = '';
    
    if (config.categories) {
        // Multiple categories
        categoriesHTML = config.categories.map(category => `
            <div class="skill-category">
                <h4 class="skill-category-title">${category.name}</h4>
                <div class="skills">
                    ${category.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            </div>
        `).join('');
    } else {
        // Single flat list (backward compatibility)
        categoriesHTML = `
            <div class="skills">
                ${config.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
        `;
    }
    
    // Create skills section
    const skillsSectionHTML = `
        <div class="skills-section">
            <h2 class="section-title">${config.title}</h2>
            ${categoriesHTML}
        </div>
    `;
    
    // Insert at appropriate location
    const aboutSection = document.querySelector('.about-section');
    const contactSection = document.querySelector('.contact-section');
    
    if (aboutSection && currentPage === 'about.html') {
        aboutSection.insertAdjacentHTML('beforeend', skillsSectionHTML);
    } else if (contactSection) {
        contactSection.insertAdjacentHTML('beforebegin', skillsSectionHTML);
    } else {
        container.insertAdjacentHTML('beforeend', skillsSectionHTML);
    }
    
    console.log(`Skills loaded for page: ${currentPage}`);
}

// ==================== BACK LINK LOADER ====================

function initBackLink() {
    // Get current page filename
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Don't load on index.html (homepage)
    if (currentPage === 'index.html' || currentPage === '' || currentPage === '/') {
        return;
    }
    
    // Find the container
    const container = document.querySelector('.container');
    if (!container) return;
    
    // Check if back link already exists
    if (document.querySelector('.back-link')) return;
    
    // Different back link text for different pages
    let backText = '← Back';
    
    switch(currentPage) {
        case 'qr-now.html':
            backText = 'Back to Home';
            break;
        case 'api-playground.html':
            backText = 'Back to Home';
            break;
        case 'json-tool.html':
            backText = 'Back to Home';
            break;
        case 'colour-palette.html':
            backText = 'Back to Home';
            break;
        case 'about.html':
            backText = 'Back to Home';
            break;
    }
    
    // Insert back link at the beginning of container
    const backLinkHTML = `<a href="/" class="back-link">${backText}</a>`;
    container.insertAdjacentHTML('afterbegin', backLinkHTML);
    
    console.log(`Back link loaded for page: ${currentPage}`);
}
    // ==================== INITIALIZATION ====================
    
    function init() {
        // Always load navigation and footer
        initNavigation();
        initFooter();
        
        // Load page-specific components
        loadFeaturedProjects();
        initSkills();
        initBackLink(); 
        loadProjectRepository();
        initRandomProject();
        initRandomProjectButton();
        initPageCTA();
    }
    
    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();