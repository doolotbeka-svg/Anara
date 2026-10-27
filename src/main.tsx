import {createRoot} from 'react-dom/client';
import {loadContent, t} from './content/store';
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
  document.title = t('meta.1', 'Массаж на дому у мастера в Бежецке | Уютный домашний кабинет');
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute(
      'content',
      t('meta.2', 'Профессиональный оздоровительный и расслабляющий массаж в оборудованном домашнем кабинете мастера в Бежецке. Сниму боль в спине и усталость. Стаж 2 года, анатомический стол, натуральные масла.')
    );

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
