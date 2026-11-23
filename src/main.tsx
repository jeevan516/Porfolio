import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Apply a stored theme choice before the first render (no flash). Without one, jd.css follows the OS.
try {
  const stored = localStorage.getItem('jeevan_portfolio_theme');
  if (stored === 'light' || stored === 'dark') document.documentElement.setAttribute('data-theme', stored);
} catch {
  /* storage blocked */
}

// Guard against benign browser ResizeObserver notification loop events
window.addEventListener('error', (event: ErrorEvent) => {
  if (
    typeof event?.message === 'string' &&
    (event.message.includes('ResizeObserver loop completed with undelivered notifications') ||
      event.message.includes('ResizeObserver loop limit exceeded'))
  ) {
    event.stopImmediatePropagation();
    event.preventDefault();
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
