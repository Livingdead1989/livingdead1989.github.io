document.querySelectorAll('.post-content pre').forEach(pre => {
  const code = pre.querySelector('code');
  if (!code) return;

  const button = document.createElement('button');
  button.className = 'copy-button';
  button.type = 'button';
  button.textContent = 'Copy';

  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(code.innerText);
      button.textContent = 'Copied';
      button.classList.add('copied');

      setTimeout(() => {
        button.textContent = 'Copy';
        button.classList.remove('copied');
      }, 1600);
    } catch {
      button.textContent = 'Error';
    }
  });

  pre.appendChild(button);
});


// codeblock language detection
document.querySelectorAll('.post-content pre').forEach(pre => {
  // Avoid double-processing
  if (pre.dataset.lang) return;

  // Walk up to find a parent with language-*
  let parent = pre.parentElement;
  let lang = null;

  while (parent && parent !== document.body) {
    const langClass = [...parent.classList].find(c => c.startsWith('language-'));
    if (langClass) {
      lang = langClass.replace('language-', '');
      break;
    }
    parent = parent.parentElement;
  }

  if (lang) {
    pre.dataset.lang = lang;
  }
});


// codeblock auto-collapse long blocks
document.querySelectorAll('.post-content pre').forEach(pre => {
  const maxHeight = 352; // ~22rem in px
  if (pre.scrollHeight <= maxHeight) return;

  pre.classList.add('is-collapsed');

  const toggle = document.createElement('button');
  toggle.className = 'code-toggle';
  toggle.type = 'button';
  toggle.textContent = 'Show more';

  toggle.addEventListener('click', () => {
    const expanded = pre.classList.toggle('is-expanded');
    pre.classList.toggle('is-collapsed', !expanded);
    toggle.textContent = expanded ? 'Show less' : 'Show more';
  });

  pre.appendChild(toggle);
});
