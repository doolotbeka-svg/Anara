import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { FAQ_ITEMS } from '../data/massageData';
import { t } from '../content/store';

export const FaqSection: React.FC = () => {
  // Store expanded FAQ item IDs (default expand first item)
  const [openIds, setOpenIds] = useState<string[]>(['faq-1', 'faq-2']);

  const toggleItem = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section id="faq" className="py-16 lg:py-24 bg-[#FAF8F5]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="text-xs font-semibold text-[#466352] uppercase tracking-wider mb-2">
            {t('faq.1', 'Ответы на частые вопросы')}
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#182B1F]">
            {t('faq.2', 'Всё, что важно знать перед первым сеансом')}
          </h2>
          <p className="mt-3 text-sm text-[#4F6255] max-w-xl mx-auto">
            {t('faq.3', 'Собрала самые частые вопросы жителей Бежецка, чтобы вы были уверены в удобстве и безопасности.')}
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openIds.includes(item.id);
            return (
              <div
                key={item.id}
                className={`rounded-2xl border transition-colors ${
                  isOpen ? 'bg-white border-[#466352]/30 shadow-xs' : 'bg-white/70 border-[#E5DDD2] hover:bg-white'
                }`}
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full py-4 sm:py-5 px-5 sm:px-6 text-left flex items-center justify-between gap-4 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-display font-bold text-base sm:text-lg text-[#182B1F] leading-snug">
                    {item.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                    isOpen ? 'bg-[#466352] text-white rotate-180' : 'bg-[#EAE5DC] text-[#466352]'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-[#48594E] leading-relaxed border-t border-[#F2ECE3]">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions prompt */}
        <div className="mt-10 text-center p-6 rounded-2xl bg-[#F4EFE9] border border-[#E0D8CC]">
          <h4 className="font-display font-bold text-base text-[#182B1F]">
            {t('faq.4', 'Остался вопрос или хотите проконсультироваться лично?')}
          </h4>
          <p className="text-xs text-[#56685B] mt-1">
            {t('faq.5', 'Напишите мастеру в мессенджер — с радостью отвечу на все вопросы и помогу подобрать массаж.')}
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <a
              href="https://wa.me/79157004822"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#184824] bg-[#E1EFE5] hover:bg-[#D5E8DA] rounded-lg border border-[#BCD9C4] transition-colors"
            >
              {t('faq.6', 'Спросить в WhatsApp')}
            </a>
            <a
              href="https://t.me/massage_bezhetsk"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#173F5E] bg-[#E1EDF5] hover:bg-[#D4E4EF] rounded-lg border border-[#BCD4E5] transition-colors"
            >
              {t('faq.7', 'Спросить в Telegram')}
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
