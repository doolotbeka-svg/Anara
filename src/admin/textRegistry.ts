// Every editable text is a t('section.N', 'default') call in the site's source.
// The admin panel reads those sources (only this lazy-loaded chunk includes them)
// to list all texts in page order, so the list can't drift from the code.

const sources = import.meta.glob(['../main.tsx', '../App.tsx', '../pages.ts', '../components/*.tsx'], {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export interface TextEntry {
  key: string;
  defaultText: string;
}

export interface TextSection {
  id: string;
  label: string;
  entries: TextEntry[];
}

// Page order; keys missing here go to the end
const SECTION_LABELS: [string, string][] = [
  ['meta', 'Заголовок страницы в браузере и поиске'],
  ['header', 'Шапка и меню (названия страниц)'],
  ['pages', 'Страницы: описания, заголовки для поиска'],
  ['nav', 'Переходы между страницами и запись внизу страниц'],
  ['hero', 'Первый экран'],
  ['about', 'О мастере и кабинете'],
  ['services', 'Услуги и цены'],
  ['symptoms', 'Помощник «Что вас беспокоит?»'],
  ['process', 'Как проходит сеанс'],
  ['reviews', 'Отзывы'],
  ['faq', 'Частые вопросы'],
  ['location', 'Адрес и карта'],
  ['footer', 'Подвал сайта'],
  ['booking', 'Окно записи'],
  ['chat', 'Чат-помощник'],
  ['app', 'Нижняя панель на телефоне'],
  ['tz', 'Окно «ТЗ и тексты»'],
  ['slider', 'Кнопки слайдера фото'],
];

const T_CALL = /\bt\(\s*'([a-z]+\.\d+)',\s*'((?:[^'\\]|\\.)*)'\s*\)/g;

const unescape = (s: string) =>
  s.replace(/\\(u00A0|n|'|\\)/g, (_, c: string) => (c === 'u00A0' ? ' ' : c === 'n' ? '\n' : c));

const byNumber = (a: TextEntry, b: TextEntry) =>
  Number(a.key.split('.')[1]) - Number(b.key.split('.')[1]);

export const TEXT_SECTIONS: TextSection[] = (() => {
  const entries = new Map<string, TextEntry>();
  for (const source of Object.values(sources)) {
    for (const [, key, raw] of source.matchAll(T_CALL)) {
      if (!entries.has(key)) entries.set(key, { key, defaultText: unescape(raw) });
    }
  }

  const sections = new Map<string, TextEntry[]>();
  for (const entry of entries.values()) {
    const id = entry.key.split('.')[0];
    sections.set(id, [...(sections.get(id) ?? []), entry]);
  }

  const order = SECTION_LABELS.map(([id]) => id);
  return [...sections.entries()]
    .sort(([a], [b]) => (order.indexOf(a) + 1 || 99) - (order.indexOf(b) + 1 || 99))
    .map(([id, list]) => ({
      id,
      label: SECTION_LABELS.find(([s]) => s === id)?.[1] ?? id,
      entries: list.sort(byNumber),
    }));
})();
