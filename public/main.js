// Nav: solid background on scroll
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// Hamburger menu
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  const open = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!open));
  navLinks.classList.toggle('open', !open);
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navToggle.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('open');
  });
});

// Fade-in on scroll
const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.project-card, .skill-category, .contact-link').forEach(el => {
  el.classList.add('fade-up');
  fadeObserver.observe(el);
});

// GitHub repos
const LANG_COLORS = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Python:  '#3572A5',
  Java:       '#b07219', HTML:       '#e34c26', CSS:     '#563d7c',
  'C++':      '#f34b7d', C:          '#555555', Go:      '#00ADD8',
  Rust:       '#dea584', Ruby:       '#701516', PHP:     '#4F5D95',
  Shell:      '#89e051', Swift:      '#ffac45', Kotlin:  '#F18E33',
};

function esc(s) {
  return String(s).replace(/[&<>"']/g, c =>
    ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c])
  );
}

function buildRepoCard(repo) {
  const color  = LANG_COLORS[repo.language] ?? '#555';
  const lang   = repo.language
    ? `<span class="repo-lang"><span class="lang-dot" style="background:${color}"></span>${esc(repo.language)}</span>`
    : '';
  const stars  = repo.stargazers_count > 0
    ? `<span>★ ${repo.stargazers_count}</span>`
    : '';
  const desc   = repo.description
    ? `<p class="repo-desc">${esc(repo.description)}</p>`
    : `<p class="repo-desc repo-nodesc">No description provided</p>`;

  return `<a class="repo-card fade-up"
     href="${esc(repo.html_url)}"
     target="_blank"
     rel="noopener noreferrer"
     aria-label="View ${esc(repo.name)} on GitHub">
  <span class="repo-name">${esc(repo.name)}</span>
  ${desc}
  <div class="repo-meta">${lang}${stars}</div>
</a>`;
}

async function loadRepos() {
  const grid = document.getElementById('repos-grid');
  try {
    const res = await fetch(
      'https://api.github.com/users/kcinimod/repos?sort=updated&per_page=12'
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const repos = await res.json();

    if (!repos.length) {
      grid.innerHTML = '<p class="repos-message">No public repositories yet.</p>';
      return;
    }

    grid.innerHTML = repos.map(buildRepoCard).join('');
    grid.querySelectorAll('.repo-card').forEach((el, i) => {
      setTimeout(() => fadeObserver.observe(el), i * 45);
    });
  } catch {
    grid.innerHTML = `<p class="repos-message">
      Couldn't load repositories right now. &nbsp;
      <a href="https://github.com/kcinimod" target="_blank" rel="noopener noreferrer">View on GitHub →</a>
    </p>`;
  }
}

loadRepos();
