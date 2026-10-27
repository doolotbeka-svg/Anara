import React, { useState } from 'react';
import { Phone, MessageCircle, Send, FileText, Menu, X, Sparkles, MapPin } from 'lucide-react';
import { MASTER_INFO } from '../data/massageData';
import { t } from '../content/store';
import { MasterAvatar } from './MasterAvatar';
import { PAGES } from '../pages';
import { Link, usePath } from '../router';

interface HeaderProps {
  onOpenBooking: () => void;
  onOpenTzModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenBooking, onOpenTzModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const path = usePath();

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E8E2D8] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-20">
          
          {/* Zone 1: Brand Wordmark (Single text element + master badge) */}
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 group whitespace-nowrap shrink-0">
            <MasterAvatar
              className="w-10 h-10 rounded-full bg-[#466352] text-white font-display font-bold text-base shadow-xs"
              initials={t('header.7', 'МА')}
            />
            <div className="flex flex-col">
              <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[#1D3325]">
                {MASTER_INFO.name}
              </span>
              <span className="text-xs text-[#526457] font-medium tracking-wide flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#466352]" />
                <span>{t('header.8', 'Бежецк, ул. Мира 2/50')}</span>
              </span>
            </div>
          </Link>

          {/* Zone 2: Navigation Links (Single-line, concise) */}
          <nav className="hidden xl:flex items-center gap-4 text-sm font-medium text-[#414E45]">
            {PAGES.map((page) => (
              <Link
                key={page.path}
                to={page.path}
                aria-current={path === page.path ? 'page' : undefined}
                className={`hover:text-[#1D3325] hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0 text-xs ${
                  path === page.path ? 'text-[#1D3325] font-semibold underline' : ''
                }`}
              >
                {page.label()}
              </Link>
            ))}
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            <a
              href={`tel:${MASTER_INFO.phone}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#1F3325] hover:text-[#466352] transition-colors whitespace-nowrap shrink-0"
            >
              <Phone className="w-3.5 h-3.5 text-[#466352]" />
              <span className="font-bold">{MASTER_INFO.phoneDisplay}</span>
            </a>

            <button
              onClick={onOpenBooking}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-white bg-[#466352] hover:bg-[#385142] active:bg-[#2C4033] rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('header.9', 'Записаться')}</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex xl:hidden items-center gap-2">
            <a
              href={`tel:${MASTER_INFO.phone}`}
              className="sm:hidden p-2 text-xs font-bold text-[#1D3325] bg-[#EAE5DC] rounded-md border border-[#D5CDC0]"
              title={t('header.10', 'Позвонить')}
            >
              <Phone className="w-4 h-4 text-[#466352]" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#2C3B30] hover:bg-[#EAE5DC] transition-colors"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-[#E8E2D8] bg-[#FAF8F5] px-4 pt-4 pb-6 space-y-3">
          
          {/* Master card in mobile menu */}
          <div className="p-3 rounded-xl bg-[#F0EBE1] border border-[#DDD5C7] space-y-1">
            <div className="font-display font-bold text-sm text-[#182B1F]">
              {t('header.11', 'Муратова Анара · Массаж на дому')}
            </div>
            <div className="text-xs text-[#526457] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#466352]" />
              <span>{t('header.12', 'Бежецк, ул. Мира, д. 2/50')}</span>
            </div>
            <div className="text-xs font-bold text-[#1D3325] pt-1">
              <a href={`tel:${MASTER_INFO.phone}`} className="flex items-center gap-1.5 text-[#35523F]">
                <Phone className="w-3.5 h-3.5 text-[#466352]" />
                <span>{MASTER_INFO.phoneDisplay}</span>
              </a>
            </div>
          </div>

          <nav className="flex flex-col space-y-1">
            {PAGES.map((page) => (
              <Link
                key={page.path}
                to={page.path}
                onClick={() => setMobileMenuOpen(false)}
                aria-current={path === page.path ? 'page' : undefined}
                className={`px-3 py-2 rounded-md text-xs font-semibold text-[#2C3B30] hover:bg-[#EAE5DC] ${
                  path === page.path ? 'bg-[#EAE5DC]' : ''
                }`}
              >
                {page.label()}
              </Link>
            ))}
          </nav>
          
          <div className="pt-2 border-t border-[#E8E2D8] space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenTzModal();
                }}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-medium bg-[#EAE5DC] text-[#2C3B30] rounded-lg border border-[#D5CDC0]"
              >
                <FileText className="w-4 h-4 text-[#466352]" />
                <span>{t('header.13', 'Открыть ТЗ')}</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-semibold bg-[#466352] text-white rounded-lg"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t('header.14', 'Записаться')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
