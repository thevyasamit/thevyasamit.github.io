let selectedTags = new Set();

function filterByTag(tag) {
    const allTagElements = document.querySelectorAll(`.tag[data-tag="${tag}"]`);
    
    if (selectedTags.has(tag)) {
        selectedTags.delete(tag);
        allTagElements.forEach(el => el.classList.remove('selected'));
    } else {
        selectedTags.add(tag);
        allTagElements.forEach(el => el.classList.add('selected'));
    }
    
    updateArticleVisibility();
    updateFilterInfo();
}

function updateArticleVisibility() {
    const articles = document.querySelectorAll('.article-card');
    let visibleCount = 0;
    
    articles.forEach(article => {
        const articleTags = Array.from(article.querySelectorAll('.tag'))
            .map(tag => tag.getAttribute('data-tag'));
        
        if (selectedTags.size === 0) {
            article.classList.remove('hidden', 'filtered');
            visibleCount++;
            return;
        }
        
        const hasAllSelectedTags = Array.from(selectedTags)
            .every(tag => articleTags.includes(tag));
        
        if (hasAllSelectedTags) {
            article.classList.remove('hidden', 'filtered');
            visibleCount++;
        } else {
            article.classList.add('hidden');
        }
    });

    // Add animation class if no results
    if (visibleCount === 0) {
        document.querySelector('.articles-grid').classList.add('no-results');
    } else {
        document.querySelector('.articles-grid').classList.remove('no-results');
    }
}

function updateFilterInfo() {
    const infoElement = document.querySelector('.selected-tags-info');
    if (!infoElement) {
        createFilterInfo();
        return;
    }

    if (selectedTags.size > 0) {
        const tagsList = Array.from(selectedTags).join(', ');
        infoElement.textContent = `Filtering by: ${tagsList}`;
        infoElement.classList.add('visible');
    } else {
        infoElement.classList.remove('visible');
    }
}

function createFilterInfo() {
    const infoDiv = document.createElement('div');
    infoDiv.className = 'selected-tags-info';
    document.querySelector('.tag-filter').insertBefore(
        infoDiv,
        document.querySelector('.clear-tags')
    );
}

function clearTagFilters() {
    selectedTags.clear();
    document.querySelectorAll('.tag.selected').forEach(tag => {
        tag.classList.remove('selected');
    });
    updateArticleVisibility();
    updateFilterInfo();
}

function expandArticle(articleId) {
    document.getElementById(articleId).style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeArticle(articleId) {
    document.getElementById(articleId).style.display = 'none';
    document.body.style.overflow = 'auto';
} 