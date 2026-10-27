/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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

  const handleScrollToServices = () => {
    const el = document.getElementById('services');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#242A26] flex flex-col selection:bg-[#466352]/20 selection:text-[#182B1F]">
      
      {/* Top Navigation */}
      <Header
        onOpenBooking={() => handleOpenBooking()}
        onOpenTzModal={() => setIsTzOpen(true)}
      />

      {/* Main Page Flow */}
      <main className="flex-1">
        {/* 1. Hero Block */}
        <Hero
          onOpenBooking={() => handleOpenBooking()}
          onScrollToServices={handleScrollToServices}
        />

        {/* 2. About Master & Qualifications */}
        <AboutMaster />

        {/* 3. Services & Transparent Pricing */}
        <ServicesPricing
          onSelectService={(service, duration) => handleOpenBooking(service, duration)}
        />

        {/* Interactive Symptom Helper */}
        <SymptomFinder
          onSelectProgram={(service, duration) => handleOpenBooking(service, duration)}
        />

        {/* 4. Session Process & Objection Handling */}
        <SessionProcess />

        {/* 5. Reviews from Bezhetsk */}
        <ReviewsSection />

        {/* 6. FAQ Section */}
        <FaqSection />

        {/* Geographic Coverage in Bezhetsk */}
        <CoverageMap />
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
          <span>WhatsApp</span>
        </a>

        <button
          onClick={() => handleOpenBooking()}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 bg-[#466352] text-white text-xs font-bold rounded-xl shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Записаться</span>
        </button>

        <a
          href={`tel:${MASTER_INFO.phone.replace(/[^+\d]/g, '')}`}
          className="p-2.5 bg-[#ECE6DC] text-[#182B1F] rounded-xl border border-[#D5CDC1]"
          title="Позвонить мастеру"
          aria-label="Позвонить мастеру"
        >
          <Phone className="w-4 h-4 text-[#466352]" />
        </a>
      </div>

    </div>
  );
}
