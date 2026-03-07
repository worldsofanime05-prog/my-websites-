 document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('bookmark-form');
  const titleInput = document.getElementById('bookmark-title');
  const urlInput = document.getElementById('bookmark-url');
  const descriptionInput = document.getElementById('bookmark-description');
  const categorySelect = document.getElementById('bookmark-category');
  const listContainer = document.getElementById('bookmarks-list');
  const clearBtn = document.getElementById('clear-all');
  const addCategoryBtn = document.getElementById('add-category-btn');
  const categoriesListContainer = document.getElementById('categories-list');
  const settingsBtn = document.getElementById('settings-btn');
  const settingsModal = document.getElementById('settings-modal');
  const closeSettingsBtn = document.getElementById('close-settings-btn');
  const settingsModalOverlay = document.querySelector('.settings-modal-overlay');

  let bookmarks = [];
  let categories = [];

  // Settings modal functions
  function openSettings() {
    settingsModal.classList.remove('hidden');
  }

  function closeSettings() {
    settingsModal.classList.add('hidden');
  }

  function saveBookmarks() {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }

  function saveCategories() {
    localStorage.setItem('categories', JSON.stringify(categories));
  }

  function loadCategories() {
    const data = localStorage.getItem('categories');
    if (data) {
      categories = JSON.parse(data);
    } else {
      categories = [
        { key: 'primary', label: 'Primary' },
        { key: 'secondary', label: 'Secondary' },
        { key: 'tertiary', label: 'Tertiary' },
        { key: 'work', label: 'Work' },
        { key: 'personal', label: 'Personal' },
        { key: 'other', label: 'Other' }
      ];
    }
  }

  function loadBookmarks() {
    const data = localStorage.getItem('bookmarks');
    if (data) {
      bookmarks = JSON.parse(data);
    } else {
      // populate with a few defaults if nothing is stored yet
      bookmarks = [
        { id: Date.now() + 1, title: 'Google', url: 'http://www.google.com', category: 'primary' },
        { id: Date.now() + 2, title: 'YouTube', url: 'https://www.youtube.com/', category: 'primary' },
        { id: Date.now() + 3, title: 'Animekai', url: 'https://animekai.to/home', category: 'primary' },
        { id: Date.now() + 4, title: 'Sigma Web Dev', url: 'https://www.youtube.com/watch?v=tVzUXW6siu0&list=PLu0W_9lII9agq5TrH9XLIKQvv0iaF2X3w', category: 'primary' },
        { id: Date.now() + 5, title: 'Cloudmoon', url: 'https://web.cloudmoonapp.com/', category: 'primary' },
        { id: Date.now() + 6, title: 'Typing Test', url: 'https://typeuniverse.com/typing-test', category: 'primary' },
        { id: Date.now() + 7, title: 'Telegram', url: 'https://web.telegram.org/a/', category: 'primary' },
        { id: Date.now() + 8, title: 'Gmail', url: 'https://mail.google.com/mail/u/0/#inbox', category: 'primary' },
        { id: Date.now() + 9, title: 'Instagram', url: 'https://www.instagram.com/', category: 'primary' },
        { id: Date.now() + 10, title: 'CineHD', url: 'https://cinehd.cc/home', category: 'primary' },
        { id: Date.now() + 11, title: 'ChatGPT', url: 'https://chatgpt.com/', category: 'secondary' },
        { id: Date.now() + 12, title: 'Gemini', url: 'https://gemini.google.com/', category: 'secondary' },
        { id: Date.now() + 13, title: 'Blackbox AI', url: 'https://app.blackbox.ai/', category: 'secondary' },
        { id: Date.now() + 14, title: 'Lovable AI', url: 'https://lovable.dev/', category: 'secondary' },
        { id: Date.now() + 15, title: 'GitHub', url: 'https://github.com/', category: 'secondary' },
        { id: Date.now() + 16, title: 'Base44', url: 'https://base44.com/', category: 'secondary' },
        { id: Date.now() + 17, title: 'Perplexity', url: 'https://www.perplexity.ai/', category: 'secondary' }
      ];
      saveBookmarks();
    }
  }

  function getColorForCategory(cat) {
    const colors = [
      'var(--primary-color)',
      'var(--secondary-color)',
      '#f59e0b',
      '#10b981',
      '#8b5cf6',
      '#9ca3af',
      '#f97316',
      '#06b6d4',
      '#84cc16',
      '#ec4899'
    ];
    const index = categories.findIndex(c => c.key === cat);
    return colors[index % colors.length] || 'var(--primary-color)';
  }

  function updateCategorySelect() {
    while (categorySelect.children.length > 1) {
      categorySelect.removeChild(categorySelect.lastChild);
    }
    categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.key;
      option.textContent = cat.label;
      categorySelect.appendChild(option);
    });
  }

  function renderCategories() {
    categoriesListContainer.innerHTML = '';
    categories.forEach((cat, index) => {
      const div = document.createElement('div');
      div.className = 'category-item';

      // Color preview badge
      const colorBadge = document.createElement('div');
      colorBadge.className = 'category-color-badge';
      colorBadge.style.backgroundColor = getColorForCategory(cat.key);
      colorBadge.title = cat.key;
      div.appendChild(colorBadge);

      // Content wrapper
      const contentWrapper = document.createElement('div');
      contentWrapper.className = 'category-content';

      // Header with key and count
      const header = document.createElement('div');
      header.className = 'category-header';
      
      const keySpan = document.createElement('span');
      keySpan.className = 'category-key';
      keySpan.textContent = cat.key;
      header.appendChild(keySpan);

      const countSpan = document.createElement('span');
      countSpan.className = 'category-count';
      const bookmarkCount = bookmarks.filter(b => b.category === cat.key).length;
      countSpan.textContent = `${bookmarkCount} bookmark${bookmarkCount !== 1 ? 's' : ''}`;
      header.appendChild(countSpan);

      contentWrapper.appendChild(header);

      // Input field
      const input = document.createElement('input');
      input.type = 'text';
      input.value = cat.label;
      input.placeholder = 'Category name';
      input.className = 'category-label-input';
      input.addEventListener('input', (e) => {
        cat.label = e.target.value.trim() || cat.key;
        saveCategories();
        updateCategorySelect();
        renderBookmarks();
      });
      contentWrapper.appendChild(input);

      div.appendChild(contentWrapper);

      // Delete button
      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.className = 'delete-category-btn';
      
      if (cat.key === 'other') {
        deleteBtn.disabled = true;
        deleteBtn.innerHTML = '🔒';
        deleteBtn.title = 'Cannot delete default category';
      } else {
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.title = 'Delete this category';
        deleteBtn.addEventListener('click', () => deleteCategory(cat.key));
      }

      div.appendChild(deleteBtn);
      categoriesListContainer.appendChild(div);
    });
  }

  function addCategory() {
    const key = prompt('Enter category key (unique identifier, e.g., shopping):');
    if (!key || key.trim() === '') return;
    const trimmedKey = key.trim().toLowerCase();
    if (categories.some(cat => cat.key === trimmedKey)) {
      alert('Category key already exists!');
      return;
    }
    const label = prompt('Enter category label (display name):') || trimmedKey;
    categories.push({ key: trimmedKey, label: label.trim() });
    saveCategories();
    renderCategories();
    updateCategorySelect();
  }

  function deleteCategory(keyToDelete) {
    if (keyToDelete === 'other') return;
    if (!confirm(`Delete category "${keyToDelete}"? Bookmarks in this category will be moved to "Other".`)) return;
    
    bookmarks.forEach(book => {
      if (book.category === keyToDelete) {
        book.category = 'other';
      }
    });
    saveBookmarks();
    
    categories = categories.filter(cat => cat.key !== keyToDelete);
    saveCategories();
    renderCategories();
    updateCategorySelect();
    renderBookmarks();
  }

  function renderBookmarks() {
    // clear container
    listContainer.innerHTML = '';

    // group bookmarks by category
    const groups = {};
    bookmarks.forEach(book => {
      if (!groups[book.category]) groups[book.category] = [];
      groups[book.category].push(book);
    });

    // sort categories by order in categories array
    categories.forEach(cat => {
      const categoryKey = cat.key;
      if (!groups[categoryKey]) return;
      
      const section = document.createElement('section');
      const heading = document.createElement('h2');
      heading.textContent = `${cat.label} Bookmarks`;
      section.appendChild(heading);

      const ul = document.createElement('ul');
      ul.className = 'bookmark-list';

      groups[categoryKey].forEach(book => {
        const li = document.createElement('li');

        // give a colored border depending on category
        li.style.borderLeftColor = getColorForCategory(book.category);

        // Create a content wrapper for link and description
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'bookmark-content';

        const link = document.createElement('a');
        link.href = book.url;
        link.target = '_blank';
        link.textContent = book.title;
        link.className = 'bookmark-title';
        contentWrapper.appendChild(link);

        // Add description if it exists
        if (book.description) {
          const descriptionEl = document.createElement('p');
          descriptionEl.className = 'bookmark-description-text';
          descriptionEl.textContent = book.description;
          contentWrapper.appendChild(descriptionEl);
        }

        li.appendChild(contentWrapper);

        const delBtn = document.createElement('button');
        delBtn.textContent = 'Delete';
        delBtn.addEventListener('click', () => deleteBookmark(book.id));
        li.appendChild(delBtn);

        ul.appendChild(li);
      });

      section.appendChild(ul);
      listContainer.appendChild(section);
    });
  }

  function addBookmark(e) {
    e.preventDefault();
    const title = titleInput.value.trim();
    const url = urlInput.value.trim();
    const description = descriptionInput.value.trim();
    const category = categorySelect.value;
    if (!title || !url) return;
    const newBookmark = { id: Date.now(), title, url, description, category };
    bookmarks.push(newBookmark);
    saveBookmarks();
    renderBookmarks();
    form.reset();
  }

  function deleteBookmark(id) {
    const book = bookmarks.find(b => b.id === id);
    if (book && !confirm(`Delete "${book.title}"?`)) return;
    bookmarks = bookmarks.filter(b => b.id !== id);
    saveBookmarks();
    renderBookmarks();
  }

  function clearAll() {
    if (confirm('Clear all bookmarks?')) {
      bookmarks = [];
      saveBookmarks();
      renderBookmarks();
    }
  }

  form.addEventListener('submit', addBookmark);
  clearBtn.addEventListener('click', clearAll);
  addCategoryBtn.addEventListener('click', addCategory);
  settingsBtn.addEventListener('click', openSettings);
  closeSettingsBtn.addEventListener('click', closeSettings);
  settingsModalOverlay.addEventListener('click', closeSettings);

  loadCategories();
  renderCategories();
  updateCategorySelect();
  loadBookmarks();
  renderBookmarks();
});
