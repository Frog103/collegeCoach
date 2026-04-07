(function () {
  const KEY = 'theme-preference'; // 'dark' or 'light'
  const root = document.documentElement;

  function applyTheme(theme) {
    if (theme === 'dark') root.setAttribute('data-theme', 'dark');
    else root.removeAttribute('data-theme');
  }

  function getSaved() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function systemPrefersDark() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function initTheme() {
    const saved = getSaved();
    if (saved === 'dark' || saved === 'light') applyTheme(saved);
    else applyTheme(systemPrefersDark() ? 'dark' : 'light');
  }

  window.toggleTheme = function () {
    const isDark = root.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem(KEY, next); } catch (e) {}
  };

  window.setTheme = function (theme) {
    applyTheme(theme === 'dark' ? 'dark' : 'light');
    try { localStorage.setItem(KEY, theme === 'dark' ? 'dark' : 'light'); } catch (e) {}
  };

  window.clearThemePreference = function () {
    try { localStorage.removeItem(KEY); } catch (e) {}
    applyTheme(systemPrefersDark() ? 'dark' : 'light');
  };

  // follow system changes only when user hasn't chosen a theme
  try {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const mqListener = (e) => { if (!getSaved()) applyTheme(e.matches ? 'dark' : 'light'); };
    if (mq.addEventListener) mq.addEventListener('change', mqListener);
    else if (mq.addListener) mq.addListener(mqListener);
  } catch (e) {}

  // initialize on load
  initTheme();
})();
