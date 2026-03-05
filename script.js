document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('bookmark-form');
  const titleInput = document.getElementById('bookmark-title');
  const urlInput = document.getElementById('bookmark-url');
  const categorySelect = document.getElementById('bookmark-category');
  const listContainer = document.getElementById('bookmarks-list');
  const clearBtn = document.getElementById('clear-all');

  let bookmarks = [];

  function saveBookmarks() {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
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
    switch (cat) {
      case 'primary': return 'var(--primary-color)';
      case 'secondary': return 'var(--secondary-color)';
      case 'tertiary': return '#f59e0b'; // amber
      case 'work': return '#10b981'; // emerald
      case 'personal': return '#8b5cf6'; // purple
      case 'other': return '#9ca3af'; // gray
      default: return 'var(--primary-color)';
    }
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

    // sort categories alphabetically for consistent order
    Object.keys(groups).sort().forEach(category => {
      const section = document.createElement('section');
      const heading = document.createElement('h2');
      heading.textContent = `${category.charAt(0).toUpperCase() + category.slice(1)} Bookmarks`;
      section.appendChild(heading);

      const ul = document.createElement('ul');
      ul.className = 'bookmark-list';

      groups[category].forEach(book => {
        const li = document.createElement('li');

        // give a colored border depending on category
        li.style.borderLeftColor = getColorForCategory(book.category);

        const link = document.createElement('a');
        link.href = book.url;
        link.target = '_blank';
        link.textContent = book.title;
        li.appendChild(link);

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
    const category = categorySelect.value;
    if (!title || !url) return;
    const newBookmark = { id: Date.now(), title, url, category };
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

  loadBookmarks();
  renderBookmarks();
});
