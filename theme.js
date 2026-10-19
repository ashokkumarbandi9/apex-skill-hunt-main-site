(() => {
  const root = document.documentElement;
  const buttons = [...document.querySelectorAll('[data-theme-toggle]')];
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const metaTheme = document.querySelector('meta[name="theme-color"]');

  const resolvedTheme = (choice) => choice === 'system' ? (media.matches ? 'dark' : 'light') : choice;
  const render = (choice, persist = false) => {
    const theme = resolvedTheme(choice);
    root.dataset.themeChoice = choice;
    root.dataset.theme = theme;
    if (persist) {
      try {
        if (choice === 'system') localStorage.removeItem('apex-theme');
        else localStorage.setItem('apex-theme', choice);
      } catch (_) {}
    }
    if (metaTheme) metaTheme.setAttribute('content', theme === 'dark' ? '#08090b' : '#F5F7FA');
    buttons.forEach((button) => {
      const next = theme === 'dark' ? 'light' : 'dark';
      button.setAttribute('aria-label', `Switch to ${next} mode`);
      button.setAttribute('aria-pressed', String(theme === 'dark'));
      button.setAttribute('title', `Switch to ${next} mode`);
      const icon = button.querySelector('.theme-toggle-icon');
      const label = button.querySelector('.theme-toggle-label');
      if (icon) icon.textContent = theme === 'dark' ? '☼' : '☾';
      if (label) label.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
    });
  };

  let choice = root.dataset.themeChoice || 'system';
  render(choice);
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const current = root.dataset.theme || resolvedTheme(choice);
      choice = current === 'dark' ? 'light' : 'dark';
      render(choice, true);
    });
  });
  // Follow operating-system changes only while the visitor has not chosen a fixed theme.
  const onSystemChange = () => {
    if (choice === 'system') render('system');
  };
  if (media.addEventListener) media.addEventListener('change', onSystemChange);
  else if (media.addListener) media.addListener(onSystemChange);
})();
