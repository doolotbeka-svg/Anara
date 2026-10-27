import React from 'react';
import { Phone, MessageCircle, Send, MapPin, Clock, ShieldCheck, Heart, FileText, CheckCircle2 } from 'lucide-react';
import { MASTER_INFO, LOCATION_BEZHETSK } from '../data/massageData';

interface FooterProps {
  onOpenBooking: () => void;
  onOpenTzModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBooking, onOpenTzModal }) => {
  return (
    <footer className="bg-[#1C2C21] text-[#E4EDE7] border-t border-[#2A3E31] pt-14 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Col 1: Master Brand & Status */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-full bg-[#466352] text-white flex items-center justify-center font-display font-semibold text-lg">
                М
              </span>
              <div>
                <span className="font-display text-xl font-bold text-white block">
                  {MASTER_INFO.name}
                </span>
                <span className="text-xs text-[#8DA695]">
                  Массаж на дому у мастера · г. Бежецк
                </span>
              </div>
            </div>

            <p className="text-xs text-[#A9C0B1] leading-relaxed max-w-sm">
              Профессиональный классический, оздоровительный и расслабляющий массаж в оборудованном домашнем кабинете. Анатомический стол с подогревом, тишина, чайная зона и бережная забота о вашем теле.
            </p>

            <div className="pt-2 text-xs text-[#8DA695] space-y-1">
              <div>• Официальная деятельность: Специалист самозанятый (НПД)</div>
              <div>• Предоставляется официальный электронный чек ФНС</div>
            </div>
          </div>

          {/* Col 2: Studio Comfort Features */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-display font-bold text-base text-white">
              Оснащение домашнего кабинета
            </h4>
            <div className="text-xs text-[#A9C0B1] space-y-1.5">
              <div>✓ Стационарный анатомический стол с подогревом простыни</div>
              <div>✓ 100% одноразовые простыни, шапочки и чехлы</div>
              <div>✓ Гипоаллергенные натуральные масла без отдушек</div>
              <div>✓ Увлажнитель воздуха, ароматерапия с лавандой</div>
              <div>✓ Чайная зона: травяной сбор с медом после массажа</div>
              <div>✓ Бесплатная парковка прямо у подъезда дома</div>
            </div>
          </div>

          {/* Col 3: Direct Contacts & Schedule */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-display font-bold text-base text-white">
              Контакты и адрес
            </h4>
            
            <div className="space-y-2 text-xs">
              <a
                href={`tel:${MASTER_INFO.phone.replace(/[^+\d]/g, '')}`}
                className="flex items-center gap-2 text-white hover:text-[#9FD6B1] transition-colors font-bold text-sm"
              >
                <Phone className="w-4 h-4 text-[#5AA774]" />
                <span>{MASTER_INFO.phoneDisplay}</span>
              </a>

              <div className="flex items-center gap-2 text-[#A9C0B1]">
                <Clock className="w-4 h-4 text-[#5AA774]" />
                <span>09:00 - 21:00 (ежедневно по записи)</span>
              </div>

              <div className="flex items-center gap-2 text-[#A9C0B1]">
                <MapPin className="w-4 h-4 text-[#5AA774]" />
                <span>{LOCATION_BEZHETSK.address}</span>
              </div>
            </div>

            {/* Messenger quick links */}
            <div className="flex items-center gap-2 pt-2">
              <a
                href={MASTER_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#6CE79B] text-xs font-semibold border border-[#25D366]/40 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>

              <a
                href={MASTER_INFO.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2AABEE]/20 hover:bg-[#2AABEE]/30 text-[#71C5F4] text-xs font-semibold border border-[#2AABEE]/40 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Telegram</span>
              </a>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenTzModal}
                className="inline-flex items-center gap-1.5 text-xs text-[#8DA695] hover:text-white underline transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Техническое задание и тексты</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom line */}
        <div className="pt-8 border-t border-[#2A3E31] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#799983]">
          <div>
            © {new Date().getFullYear()} Массаж на дому у мастера в Бежецке. Елена Соколова.
          </div>
          <div className="text-[11px] text-center sm:text-right">
            Не является публичной офертой. Имеются противопоказания, необходима консультация специалиста.
          </div>
        </div>

      </div>
    </footer>
  );
};
