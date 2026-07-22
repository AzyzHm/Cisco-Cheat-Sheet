  // Theme toggle
  const html = document.documentElement;
  const themeBtn = document.getElementById('themeToggle');
  const moonIcon = document.getElementById('iconMoon');
  const sunIcon = document.getElementById('iconSun');
  let isDark = true;
  themeBtn.addEventListener('click', () => {
    isDark = !isDark;
    html.setAttribute('data-theme', isDark ? 'dark' : 'light');
    moonIcon.style.display = isDark ? 'block' : 'none';
    sunIcon.style.display = isDark ? 'none' : 'block';
  });

  // Copy to clipboard
  let toastTimer;
  const toast = document.getElementById('toast');
  function copyCmd(btn, text) {
    navigator.clipboard.writeText(text).then(() => {
      btn.classList.add('copied');
      toast.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        toast.classList.remove('show');
        btn.classList.remove('copied');
      }, 1600);
    });
  }

  // Search
  const searchEl = document.getElementById('search');
  const sections = document.querySelectorAll('.section');
  const noResults = document.getElementById('noResults');

  searchEl.addEventListener('input', () => {
    const q = searchEl.value.trim().toLowerCase();
    if (!q) {
      sections.forEach(s => { s.classList.remove('hidden'); resetHighlight(s); });
      noResults.classList.remove('visible');
      return;
    }
    let anyVisible = false;
    sections.forEach(sec => {
      const text = sec.textContent.toLowerCase();
      if (text.includes(q)) {
        sec.classList.remove('hidden');
        highlightText(sec, q);
        anyVisible = true;
      } else {
        sec.classList.add('hidden');
        resetHighlight(sec);
      }
    });
    noResults.classList.toggle('visible', !anyVisible);
  });

  function highlightText(el, q) {
    resetHighlight(el);
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      if (!node.parentElement || ['SCRIPT','STYLE','MARK'].includes(node.parentElement.tagName)) return;
      const idx = node.nodeValue.toLowerCase().indexOf(q);
      if (idx === -1) return;
      const span = document.createElement('span');
      span.innerHTML = node.nodeValue.substring(0, idx) +
        '<mark>' + node.nodeValue.substring(idx, idx + q.length) + '</mark>' +
        node.nodeValue.substring(idx + q.length);
      node.parentNode.replaceChild(span, node);
    });
  }
  function resetHighlight(el) {
    el.querySelectorAll('mark').forEach(m => {
      const span = m.closest('span');
      if (span) {
        span.replaceWith(document.createTextNode(span.textContent));
      } else {
        m.replaceWith(m.textContent);
      }
    });
  }

  // Active nav highlight on scroll
  const navLinks = document.querySelectorAll('#navLinks a');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const link = document.querySelector(`#navLinks a[href="#${e.target.id}"]`);
        if (link) { link.classList.add('active'); link.scrollIntoView({ block: 'nearest', inline: 'nearest' }); }
      }
    });
  }, { rootMargin: '-60px 0px -60% 0px' });
  sections.forEach(s => observer.observe(s));