/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AboutMaster } from './components/AboutMaster';
import { ServicesPricing } from './components/ServicesPricing';
import { SymptomFinder } from './components/SymptomFinder';
import { SessionProcess } from './components/SessionProcess';
import { ReviewsSection } from './components/ReviewsSection';
import { FaqSection } from './components/FaqSection';
import { CoverageMap } from './components/CoverageMap';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { TechnicalSpecModal } from './components/TechnicalSpecModal';
import { ChatWidget } from './components/ChatWidget';
import { MassageService } from './types';
import { MessageCircle, Phone, Sparkles, FileText } from 'lucide-react';
import { MASTER_INFO } from './data/massageData';
import { t } from './content/store';
import { findPage, PageId } from './pages';
import { navigate, usePath } from './router';
import { Breadcrumbs, PageFooter, PageLinks } from './components/PageNav';

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isTzOpen, setIsTzOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<MassageService | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<{ minutes: number; price: number } | null>(null);

  const handleOpenBooking = (service?: MassageService, duration?: { minutes: number; price: number }) => {
    if (service && duration) {
      setSelectedService(service);
      setSelectedDuration(duration);
    } else {
      setSelectedService(null);
      setSelectedDuration(null);
    }
    setIsBookingOpen(true);
  };

  const path = usePath();
  const page = findPage(path);
  const isHome = path === '/';

  // Title and description of the current page (texts editable in the admin panel)
  useEffect(() => {
    document.title = page
      ? page.title()
      : t('meta.1', 'Массаж на дому у мастера в Бежецке | Уютный домашний кабинет');
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        page
          ? page.description()
          : t('meta.2', 'Профессиональный оздоровительный и расслабляющий массаж в оборудованном домашнем кабинете мастера в Бежецке. Сниму боль в спине и усталость. Стаж 2 года, анатомический стол, натуральные масла.')
      );
  }, [page]);

  const bookService = (service: MassageService, duration: { minutes: number; price: number }) =>
    handleOpenBooking(service, duration);

  const pageContent: Record<PageId, React.ReactNode> = {
    services: <ServicesPricing onSelectService={bookService} />,
    about: <AboutMaster />,
    process: <SessionProcess />,
    reviews: <ReviewsSection />,
    faq: <FaqSection />,
    location: <CoverageMap />,
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#242A26] flex flex-col selection:bg-[#466352]/20 selection:text-[#182B1F]">
      
      {/* Top Navigation */}
      <Header
        onOpenBooking={() => handleOpenBooking()}
        onOpenTzModal={() => setIsTzOpen(true)}
      />

      <main className="flex-1">
        {isHome ? (
          <>
            <Hero onOpenBooking={() => handleOpenBooking()} onScrollToServices={() => navigate('/uslugi')} />

            {/* Entry points to the inner pages */}
            <section className="py-14 bg-[#FAF8F5] border-t border-[#E8E2D8]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <PageLinks title={t('nav.8', 'Всё о массаже в домашнем кабинете')} />
              </div>
            </section>

            <SymptomFinder onSelectProgram={bookService} />
          </>
        ) : page ? (
          <>
            <Breadcrumbs page={page} />
            {pageContent[page.id]}
            <PageFooter onOpenBooking={() => handleOpenBooking()} />
          </>
        ) : (
          // Unknown address
          <section className="py-20 bg-[#FAF8F5]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div>
                <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#182B1F]">{t('nav.9', 'Такой страницы нет')}</h1>
                <p className="mt-2 text-sm text-[#4F6154]">{t('nav.10', 'Возможно, ссылка устарела. Выберите нужный раздел:')}</p>
              </div>
              <PageLinks title={t('nav.11', 'Разделы сайта')} />
            </div>
          </section>
        )}
      </main>

      {/* 7. Footer */}
      <Footer
        onOpenBooking={() => handleOpenBooking()}
        onOpenTzModal={() => setIsTzOpen(true)}
      />

      {/* Interactive Booking Modal with WhatsApp / Telegram deep linking */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        preselectedService={selectedService}
        preselectedDuration={selectedDuration}
      />

      {/* Interactive Technical Specification, Ready Copy & Brandbook Modal */}
      <TechnicalSpecModal
        isOpen={isTzOpen}
        onClose={() => setIsTzOpen(false)}
      />

      {/* AI assistant chat (answers via /api/chat) */}
      <ChatWidget />

      {/* Mobile Sticky Action Bar (Strictly capped < 15% mobile viewport height) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-t border-[#DFD7CC] p-2.5 px-4 flex items-center justify-between gap-2 shadow-lg">
        <a
          href={MASTER_INFO.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 bg-[#25D366] text-white text-xs font-bold rounded-xl shadow-xs"
        >
          <MessageCircle className="w-4 h-4" />
          <span>{t('app.1', 'WhatsApp')}</span>
        </a>

        <button
          onClick={() => handleOpenBooking()}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 bg-[#466352] text-white text-xs font-bold rounded-xl shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t('app.2', 'Записаться')}</span>
        </button>

        <a
          href={`tel:${MASTER_INFO.phone.replace(/[^+\d]/g, '')}`}
          className="p-2.5 bg-[#ECE6DC] text-[#182B1F] rounded-xl border border-[#D5CDC1]"
          title={t('app.3', 'Позвонить мастеру')}
          aria-label={t('app.4', 'Позвонить мастеру')}
        >
          <Phone className="w-4 h-4 text-[#466352]" />
        </a>
      </div>

    </div>
  );
}
