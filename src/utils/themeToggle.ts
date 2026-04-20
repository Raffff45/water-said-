export function toggleTheme(e: MouseEvent) {
  const x = `${e.clientX}px`;
  const y = `${e.clientY}px`;

  document.documentElement.style.setProperty('--x', x);
  document.documentElement.style.setProperty('--y', y);

  const toggle = () => {
    document.documentElement.classList.toggle('light');
  };

  // @ts-ignore
  if (document.startViewTransition) {
    // @ts-ignore
    document.startViewTransition(toggle);
  } else {
    toggle();
  }
}