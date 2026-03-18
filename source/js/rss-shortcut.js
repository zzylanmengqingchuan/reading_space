(() => {
  const root = '/reading_space/';
  const path = window.location.pathname.replace(/index\.html$/, '');
  const normalizedPath = path.endsWith('/') ? path : `${path}/`;
  const isHome = normalizedPath === root || normalizedPath === '/';

  if (!isHome) return;

  const rssUrl = `${window.location.origin}${root}rss2.xml`;
  const atomUrl = `${window.location.origin}${root}atom.xml`;

  const wrapper = document.createElement('div');
  wrapper.className = 'rss-shortcut';
  wrapper.innerHTML = `
    <button class="rss-shortcut__toggle" type="button" aria-expanded="false" aria-controls="rss-shortcut-panel">
      <i class="fas fa-rss"></i>
      <span>RSS 订阅</span>
    </button>
    <div class="rss-shortcut__panel" id="rss-shortcut-panel" hidden>
      <p class="rss-shortcut__title">一键订阅博客更新</p>
      <p class="rss-shortcut__desc">推荐把 RSS 链接粘贴到 Readwise Reader 或其他阅读器。</p>
      <div class="rss-shortcut__actions">
        <button class="rss-shortcut__action rss-shortcut__copy" type="button">复制 RSS 链接</button>
        <a class="rss-shortcut__action rss-shortcut__open" href="${rssUrl}" target="_blank" rel="noopener noreferrer">打开 XML</a>
      </div>
      <p class="rss-shortcut__meta">订阅地址：<code>${rssUrl}</code></p>
      <p class="rss-shortcut__meta rss-shortcut__meta--muted">兼容地址：<a href="${atomUrl}" target="_blank" rel="noopener noreferrer">atom.xml</a></p>
    </div>
  `;

  document.body.appendChild(wrapper);

  const toggle = wrapper.querySelector('.rss-shortcut__toggle');
  const panel = wrapper.querySelector('.rss-shortcut__panel');
  const copyButton = wrapper.querySelector('.rss-shortcut__copy');

  const setOpen = open => {
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    wrapper.classList.toggle('is-open', open);
  };

  toggle.addEventListener('click', () => {
    setOpen(panel.hidden);
  });

  copyButton.addEventListener('click', async () => {
    const originalText = copyButton.textContent;

    try {
      await navigator.clipboard.writeText(rssUrl);
      copyButton.textContent = '已复制';
      wrapper.classList.add('is-copied');
    } catch (error) {
      copyButton.textContent = '复制失败';
    }

    window.setTimeout(() => {
      copyButton.textContent = originalText;
      wrapper.classList.remove('is-copied');
    }, 1600);
  });

  document.addEventListener('click', event => {
    if (!wrapper.contains(event.target)) {
      setOpen(false);
    }
  });
})();
