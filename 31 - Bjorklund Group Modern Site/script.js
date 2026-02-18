const statusEl = document.getElementById('status');
const postsEl = document.getElementById('posts');
const yearEl = document.getElementById('year');

yearEl.textContent = new Date().getFullYear();

const feedUrl = 'https://public-api.wordpress.com/rest/v1.1/sites/bjorklundgroup.wordpress.com/posts/?number=9&fields=title,URL,date,excerpt';

const stripHtml = (value) => value.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

const formatDate = (value) => new Date(value).toLocaleDateString('sv-SE', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

async function loadPosts() {
  try {
    const response = await fetch(feedUrl);
    if (!response.ok) {
      throw new Error(`Kunde inte läsa API (${response.status})`);
    }

    const data = await response.json();
    const posts = data.posts || [];

    if (!posts.length) {
      statusEl.textContent = 'Inga inlägg hittades i feeden.';
      return;
    }

    statusEl.textContent = `Visar ${posts.length} senaste inlägg.`;

    postsEl.innerHTML = posts.map((post) => {
      const title = stripHtml(post.title || 'Utan rubrik');
      const excerpt = stripHtml(post.excerpt || '').slice(0, 180);
      return `
        <a class="post-card" href="${post.URL}" target="_blank" rel="noopener noreferrer">
          <div class="post-date">${formatDate(post.date)}</div>
          <h3 class="post-title">${title}</h3>
          <p class="post-excerpt">${excerpt}${excerpt.length >= 180 ? '…' : ''}</p>
        </a>
      `;
    }).join('');
  } catch (error) {
    statusEl.classList.add('error');
    statusEl.textContent = 'Kunde inte hämta innehåll i den här miljön. Kontrollera nätverksåtkomst till WordPress API.';
    postsEl.innerHTML = '';
    console.error(error);
  }
}

loadPosts();
