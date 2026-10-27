import React from 'react';
import { ArrowRight, ChevronRight, MessageCircle, Sparkles } from 'lucide-react';
import { t } from '../content/store';
import { MASTER_INFO } from '../data/massageData';
import { PageInfo, PAGES } from '../pages';
import { Link } from '../router';

/** "Главная › Отзывы" above a page. */
export const Breadcrumbs: React.FC<{ page: PageInfo }> = ({ page }) => (
  <nav aria-label={t('nav.1', 'Навигация')} className="bg-[#FAF8F5] border-b border-[#EDE7DD]">
    <ol className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-1.5 text-xs text-[#5C6E61]">
      <li>
        <Link to="/" className="hover:text-[#182B1F] hover:underline underline-offset-4">
          {t('nav.2', 'Главная')}
        </Link>
      </li>
      <li aria-hidden="true">
        <ChevronRight className="w-3.5 h-3.5" />
      </li>
      <li aria-current="page" className="font-semibold text-[#182B1F]">
        {page.label()}
      </li>
    </ol>
  </nav>
);

/** Cards linking to the site's pages. */
export const PageLinks: React.FC<{ exclude?: string; title: string }> = ({ exclude, title }) => (
  <div className="space-y-4">
    <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#182B1F]">{title}</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {PAGES.filter((p) => p.id !== exclude).map((p) => (
        <Link
          key={p.id}
          to={p.path}
          className="group flex items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-[#E2DAD0] hover:border-[#9DB8A6] hover:shadow-sm transition-all"
        >
          <span>
            <span className="block font-semibold text-sm text-[#182B1F]">{p.label()}</span>
            <span className="block text-xs text-[#5C6E61] mt-0.5">{p.teaser()}</span>
          </span>
          <ArrowRight className="w-4 h-4 shrink-0 text-[#466352] transition-transform group-hover:translate-x-0.5" />
        </Link>
      ))}
    </div>
  </div>
);

/** Bottom of every inner page: booking call to action and the other pages. */
export const PageFooter: React.FC<{ page: PageInfo; onOpenBooking: () => void }> = ({ page, onOpenBooking }) => (
  <section className="py-14 bg-[#F2EDE5] border-t border-[#E5DDD0]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="p-6 sm:p-8 rounded-3xl bg-[#1D3325] text-white flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <h2 className="text-2xl font-display font-bold">{t('nav.3', 'Готовы записаться на сеанс?')}</h2>
          <p className="text-sm text-[#C9D8CE] mt-1">
            {t('nav.4', 'Выберите удобное время — мастер подтвердит запись в течение 10–15 минут.')}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenBooking}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-[#1D3325] text-sm font-semibold hover:bg-[#EAF3ED] transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            {t('nav.5', 'Записаться')}
          </button>
          <a
            href={MASTER_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] text-white text-sm font-semibold hover:bg-[#20BC5A] transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            {t('nav.6', 'Написать в WhatsApp')}
          </a>
        </div>
      </div>
      <PageLinks exclude={page.id} title={t('nav.7', 'Другие разделы')} />
    </div>
  </section>
);
