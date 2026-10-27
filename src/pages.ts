import { t } from './content/store';

// The site's pages. Texts are functions so they pick up admin edits loaded at startup;
// scripts/prerender-pages.ts uses the same list (with defaults) to write one HTML file per page.

export type PageId = 'services' | 'about' | 'process' | 'reviews' | 'faq' | 'location';

export interface PageInfo {
  id: PageId;
  path: string;
  label: () => string;
  teaser: () => string;
  title: () => string;
  description: () => string;
}

export const PAGES: PageInfo[] = [
  {
    id: 'services',
    path: '/uslugi',
    label: () => t('header.1', 'Услуги и цены'),
    teaser: () => t('pages.1', 'Виды массажа, длительность и стоимость сеансов'),
    title: () => t('pages.2', 'Виды массажа и цены в Бежецке | Муратова Анара'),
    description: () =>
      t('pages.3', 'Лечебный массаж спины, шейно-воротниковой зоны, релакс, лимфодренаж и другие программы. Цены от 900 ₽, прием в домашнем кабинете в Бежецке.'),
  },
  {
    id: 'about',
    path: '/o-mastere',
    label: () => t('header.2', 'О мастере и кабинете'),
    teaser: () => t('pages.4', 'Образование, опыт и оснащение домашнего кабинета'),
    title: () => t('pages.5', 'О мастере и кабинете | Массаж в Бежецке, Муратова Анара'),
    description: () =>
      t('pages.6', 'Медицинское образование, стаж 2 года. Оборудованный домашний кабинет: анатомический стол с подогревом, одноразовые простыни, чайная зона.'),
  },
  {
    id: 'process',
    path: '/priem',
    label: () => t('header.3', 'Как проходит прием'),
    teaser: () => t('pages.7', 'От записи до чашки чая после сеанса — по шагам'),
    title: () => t('pages.8', 'Как проходит прием | Массаж в Бежецке, Муратова Анара'),
    description: () => t('pages.9', 'Запись в мессенджер, сеанс на анатомическом столе, отдых с травяным чаем. Что взять с собой и как подготовиться.'),
  },
  {
    id: 'reviews',
    path: '/otzyvy',
    label: () => t('header.4', 'Отзывы'),
    teaser: () => t('pages.10', 'Что говорят клиенты из Бежецка'),
    title: () => t('pages.11', 'Отзывы о массаже в Бежецке | Муратова Анара'),
    description: () => t('pages.12', 'Отзывы клиентов о лечебном и расслабляющем массаже в домашнем кабинете в Бежецке. Оставьте свой отзыв.'),
  },
  {
    id: 'faq',
    path: '/voprosy',
    label: () => t('header.5', 'Частые вопросы'),
    teaser: () => t('pages.13', 'Гигиена, противопоказания, запись и оплата'),
    title: () => t('pages.14', 'Частые вопросы о массаже | Муратова Анара, Бежецк'),
    description: () => t('pages.15', 'Ответы на частые вопросы: стерильность, противопоказания, нужно ли что-то брать с собой, как записаться и оплатить сеанс.'),
  },
  {
    id: 'location',
    path: '/kontakty',
    label: () => t('header.6', 'Где находится кабинет'),
    teaser: () => t('pages.16', 'Адрес на карте, парковка и как добраться'),
    title: () => t('pages.17', 'Адрес кабинета массажа в Бежецке, ул. Мира 2/50 | Муратова Анара'),
    description: () => t('pages.18', 'Кабинет массажа: Бежецк, ул. Мира, д. 2/50. Карта, бесплатная парковка у дома, время в пути из районов города.'),
  },
];

export const findPage = (path: string) => PAGES.find((p) => p.path === path) ?? null;
