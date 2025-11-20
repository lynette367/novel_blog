// ========================================
// Main JavaScript - Cross The Line
// ========================================

// View toggle functionality
function initViewToggle() {
    const viewBtns = document.querySelectorAll('.view-btn');
    const articlesGrid = document.querySelector('.articles-grid, .novels-grid');
    
    if (viewBtns.length > 0 && articlesGrid) {
        viewBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                viewBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Toggle grid/list view
                if (this.textContent.includes('≡')) {
                    articlesGrid.style.gridTemplateColumns = '1fr';
                } else {
                    articlesGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(320px, 1fr))';
                }
            });
        });
    }
}

// Category tabs filtering
function initCategoryFilter() {
    const tabs = document.querySelectorAll('.tab');
    const items = document.querySelectorAll('.article-card, .novel-card');
    
    if (tabs.length > 0 && items.length > 0) {
        tabs.forEach(tab => {
            tab.addEventListener('click', function(e) {
                e.preventDefault();
                tabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                const category = this.getAttribute('data-category');
                
                items.forEach(item => {
                    if (category === 'all' || item.getAttribute('data-category') === category) {
                        item.style.display = 'flex';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 10);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.9)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
}

// Smooth scroll for anchor links
function initSmoothScroll() {
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
}

// Initialize all functions when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initViewToggle();
    initCategoryFilter();
    initSmoothScroll();
});

// Chapter sorting
function sortChapters(order) {
    const chapterList = document.getElementById('chapterList');
    if (!chapterList) return;
    
    const chapters = Array.from(chapterList.children);
    
    // Update button states
    document.querySelectorAll('.sort-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    chapters.sort((a, b) => {
        const numA = parseInt(a.getAttribute('data-chapter'));
        const numB = parseInt(b.getAttribute('data-chapter'));
        return order === 'asc' ? numA - numB : numB - numA;
    });
    
    chapters.forEach(chapter => chapterList.appendChild(chapter));
}

// Reading progress tracking
function trackReadingProgress(novelId, chapterNumber, totalChapters) {
    const progress = {
        chapter: chapterNumber,
        total: totalChapters,
        percentage: Math.round((chapterNumber / totalChapters) * 100)
    };
    
    localStorage.setItem(`${novelId}_progress`, JSON.stringify(progress));
    
    // Update progress bar if exists
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    
    if (progressBar) {
        progressBar.style.width = progress.percentage + '%';
    }
    
    if (progressText) {
        progressText.textContent = `Chapter ${chapterNumber} of ${totalChapters} completed (${progress.percentage}%)`;
    }
}

// Load saved progress
function loadReadingProgress(novelId, totalChapters) {
    const savedProgress = localStorage.getItem(`${novelId}_progress`);
    if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        
        if (progressBar) {
            progressBar.style.width = progress.percentage + '%';
        }
        
        if (progressText) {
            progressText.textContent = `Chapter ${progress.chapter} of ${totalChapters} completed (${progress.percentage}%)`;
        }
    }
}

// Mark chapter as read
function markChapterRead(chapterElement, novelId) {
    const status = chapterElement.querySelector('.chapter-status');
    if (status && status.textContent !== 'Locked' && !status.classList.contains('status-read')) {
        status.textContent = 'Read';
        status.className = 'chapter-status status-read';
        status.classList.remove('status-new');
    }
}

