import {createRoot} from 'react-dom/client';
import {loadContent} from './content/store';
import './index.css';

const root = createRoot(document.getElementById('root')!);
const isAdminRoute = () => window.location.hash === '#admin';

async function start() {
  if (isAdminRoute()) {
    const {AdminPanel} = await import('./admin/AdminPanel');
    root.render(<AdminPanel />);
    return;
  }

  // Texts, data and photos from the admin panel must be in place before components
  // are imported: some of them read texts at module level.
  await loadContent();

  const {default: App} = await import('./App.tsx');
  root.render(<App />);
}

// Switching between the site and #admin needs a fresh start (the site shows saved content only)
let wasAdmin = isAdminRoute();
window.addEventListener('hashchange', () => {
  if (isAdminRoute() !== wasAdmin) {
    wasAdmin = isAdminRoute();
    window.location.reload();
  }
});

start();
