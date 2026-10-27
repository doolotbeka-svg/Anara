import React from 'react';
import { Sparkles, MapPin, ShieldCheck, Clock, Award, CheckCircle2, MessageCircle, Send, ArrowDown, Coffee } from 'lucide-react';
import { MASTER_INFO } from '../data/massageData';

interface HeroProps {
  onOpenBooking: () => void;
  onScrollToServices: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking, onScrollToServices }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:py-20 bg-gradient-to-b from-[#FAF8F5] via-[#F4EFEA] to-[#FAF8F5]">
      {/* Subtle organic background glow */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[#466352]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Value Proposition & Copy */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Clean unboxed metadata separator */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#466352] uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#466352]" />
                г. Бежецк · ул. Мира, д. 2/50
              </span>
              <span aria-hidden="true" className="text-[#A4B3A8]">·</span>
              <span>Прием в домашнем кабинете</span>
              <span aria-hidden="true" className="text-[#A4B3A8]">·</span>
              <span>Стаж 2 года</span>
            </div>

            {/* Main Headline with balanced wrapping */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] leading-[1.12] font-display font-bold text-[#182B1F] text-balance">
              Профессиональный массаж на&nbsp;дому у&nbsp;мастера в&nbsp;Бежецке. Сниму боль в&nbsp;спине и&nbsp;усталость в&nbsp;уютном кабинете
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#3E4D43] leading-relaxed max-w-2xl">
              Оборудованный тихий спа-кабинет в&nbsp;домашней обстановке без салонного шума и&nbsp;наценок. Стационарный анатомический стол, натуральные масла, 100% стерильность и&nbsp;горячий травяной чай с&nbsp;медом после сеанса.
            </p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={onOpenBooking}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#466352] hover:bg-[#385142] active:bg-[#2C4033] rounded-xl shadow-md shadow-[#466352]/20 hover:shadow-lg transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Записаться в WhatsApp / Telegram</span>
              </button>

              <button
                onClick={onScrollToServices}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-[#2C3B30] bg-[#ECE6DC] hover:bg-[#DFD7CB] active:bg-[#D5CBBE] rounded-xl border border-[#D8CFC2] transition-colors"
              >
                <span>Виды массажа и цены</span>
                <ArrowDown className="w-4 h-4 text-[#5A6D60]" />
              </button>
            </div>

            {/* Key Trust Checkmarks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-[#E5DDD2] text-xs sm:text-sm text-[#404F44]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#466352] shrink-0" />
                <span>Уютная локация: Бежецк, ул. Кашинская, парковка</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#466352] shrink-0" />
                <span>Стерильность: простыня вскрывается при вас</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#466352] shrink-0" />
                <span>Один клиент на приеме: тишина и покой</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#466352] shrink-0" />
                <span>Без салонных переплат: цены от 900 ₽</span>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Wellness Anchor Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer decorative card frame with single elevation */}
              <div className="rounded-3xl p-6 sm:p-7 bg-white/90 backdrop-blur-sm border border-[#E4DDD2] shadow-xl shadow-[#38483D]/5 space-y-6">
                
                {/* Visual Scene Simulation: Home Studio Setup */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-[#EFEAE2] to-[#DFD6CA] border border-[#DDD3C6] flex flex-col justify-between p-5">
                  
                  {/* Subtle decorative background pattern */}
                  <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#466352_1px,transparent_1px)] [background-size:16px_16px]" />

                  {/* Top status bar inside card */}
                  <div className="relative z-10 flex items-center justify-between text-xs text-[#4E6154]">
                    <span className="font-semibold tracking-wide">Домашний спа-кабинет</span>
                    <span className="font-medium text-[#67796D]">Бежецк, ул. Мира 2/50</span>
                  </div>

                  {/* Aesthetic Wellness Illustration Graphic */}
                  <div className="relative z-10 my-auto text-center space-y-3 py-2">
                    <div className="w-16 h-16 mx-auto rounded-full bg-[#466352]/10 border border-[#466352]/20 flex items-center justify-center text-[#3D5745]">
                      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 11v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h3" />
                        <path d="M4 14h16" />
                        <path d="M21 11v8a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h3" />
                        <rect x="3" y="7" width="18" height="4" rx="2" />
                        <circle cx="12" cy="4" r="2" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-display font-semibold text-xl text-[#1E3024]">
                        Анатомический стол и зона отдыха
                      </h4>
                      <p className="text-xs text-[#5D6F63] mt-1">
                        Приглушенный свет, лаванда, тихая музыка и травяной чай
                      </p>
                    </div>
                  </div>

                  {/* Bottom features strip inside visual */}
                  <div className="relative z-10 grid grid-cols-3 gap-1 pt-3 border-t border-[#D5CBC0]/80 text-[11px] text-[#425447] text-center font-medium">
                    <div>Подогрев стола</div>
                    <div>Чайная зона</div>
                    <div>100% стерильно</div>
                  </div>

                </div>

                {/* Master quick profile & reassurance */}
                <div className="flex items-center gap-4 pt-1">
                  <div className="w-12 h-12 rounded-full bg-[#466352] text-white flex items-center justify-center font-display font-bold text-lg shrink-0">
                    АМ
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-sm text-[#1E3024] truncate">
                      {MASTER_INFO.name}
                    </div>
                    <div className="text-xs text-[#5B6E61]">
                      Сертифицированный мастер · стаж 2 года
                    </div>
                  </div>
                </div>

                {/* Direct quick message triggers */}
                <div className="space-y-2 pt-1">
                  <div className="text-xs font-semibold text-[#54675A] uppercase tracking-wider">
                    Быстрая запись на удобное время:
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`${MASTER_INFO.whatsappUrl}?text=${encodeURIComponent('Здравствуйте, Елена! Хочу записаться на массаж в ваш домашний кабинет в Бежецке.')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-[#EBF5EF] hover:bg-[#DFEEE4] text-[#1E4D2B] text-xs font-semibold border border-[#CCE4D4] transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 text-[#25D366]" />
                      <span>В WhatsApp</span>
                    </a>
                    <a
                      href={`${MASTER_INFO.telegramUrl}?start=site`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-[#EBF3F8] hover:bg-[#DEECF4] text-[#194363] text-xs font-semibold border border-[#CADEEA] transition-colors"
                    >
                      <Send className="w-4 h-4 text-[#2AABEE]" />
                      <span>В Telegram</span>
                    </a>
                  </div>
                </div>

                {/* Social proof metric strip */}
                <div className="flex items-center justify-between pt-2 border-t border-[#EFEAE2] text-xs text-[#5C6F62]">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[#1E3024] tabular-nums">4.9 / 5.0</span>
                    <span>рейтинг отзывов</span>
                  </div>
                  <div>
                    <span className="font-bold text-[#1E3024] tabular-nums">+400</span> довольных клиентов в Бежецке
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
