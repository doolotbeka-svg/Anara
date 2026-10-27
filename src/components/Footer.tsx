import React from 'react';
import { Phone, MessageCircle, Send, MapPin, Clock, ShieldCheck, Heart, FileText, CheckCircle2 } from 'lucide-react';
import { MASTER_INFO, LOCATION_BEZHETSK } from '../data/massageData';
import { t } from '../content/store';

interface FooterProps {
  onOpenBooking: () => void;
  onOpenTzModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBooking, onOpenTzModal }) => {
  return (
    <footer className="bg-[#1C2C21] text-[#E4EDE7] border-t border-[#2A3E31] pt-14 pb-24 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Col 1: Master Brand & Status */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-full bg-[#466352] text-white flex items-center justify-center font-display font-semibold text-lg">
                {t('footer.1', 'М')}
              </span>
              <div>
                <span className="font-display text-xl font-bold text-white block">
                  {MASTER_INFO.name}
                </span>
                <span className="text-xs text-[#8DA695]">
                  {t('footer.2', 'Массаж на дому у мастера · г. Бежецк')}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#A9C0B1] leading-relaxed max-w-sm">
              {t('footer.3', 'Профессиональный классический, оздоровительный и расслабляющий массаж в оборудованном домашнем кабинете. Анатомический стол с подогревом, тишина, чайная зона и бережная забота о вашем теле.')}
            </p>

            <div className="pt-2 text-xs text-[#8DA695] space-y-1">
              <div>{t('footer.4', '• Официальная деятельность: Специалист самозанятый (НПД)')}</div>
              <div>{t('footer.5', '• Предоставляется официальный электронный чек ФНС')}</div>
            </div>
          </div>

          {/* Col 2: Studio Comfort Features */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-display font-bold text-base text-white">
              {t('footer.6', 'Оснащение домашнего кабинета')}
            </h4>
            <div className="text-xs text-[#A9C0B1] space-y-1.5">
              <div>{t('footer.7', '✓ Стационарный анатомический стол с подогревом простыни')}</div>
              <div>{t('footer.8', '✓ 100% одноразовые простыни, шапочки и чехлы')}</div>
              <div>{t('footer.9', '✓ Гипоаллергенные натуральные масла без отдушек')}</div>
              <div>{t('footer.10', '✓ Увлажнитель воздуха, ароматерапия с лавандой')}</div>
              <div>{t('footer.11', '✓ Чайная зона: травяной сбор с медом после массажа')}</div>
              <div>{t('footer.12', '✓ Бесплатная парковка прямо у подъезда дома')}</div>
            </div>
          </div>

          {/* Col 3: Direct Contacts & Schedule */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-display font-bold text-base text-white">
              {t('footer.13', 'Контакты и адрес')}
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
                <span>{t('footer.14', '09:00 - 21:00 (ежедневно по записи)')}</span>
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
                <span>{t('footer.15', 'WhatsApp')}</span>
              </a>

              <a
                href={MASTER_INFO.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2AABEE]/20 hover:bg-[#2AABEE]/30 text-[#71C5F4] text-xs font-semibold border border-[#2AABEE]/40 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t('footer.16', 'Telegram')}</span>
              </a>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenTzModal}
                className="inline-flex items-center gap-1.5 text-xs text-[#8DA695] hover:text-white underline transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{t('footer.17', 'Техническое задание и тексты')}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom line */}
        <div className="pt-8 border-t border-[#2A3E31] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#799983]">
          <div>
            © {new Date().getFullYear()}{' '}{t('footer.18', 'Массаж на дому у мастера в Бежецке. Анара Муратова.')}
          </div>
          <div className="text-[11px] text-center sm:text-right">
            {t('footer.19', 'Не является публичной офертой. Имеются противопоказания, необходима консультация специалиста.')}
          </div>
        </div>

      </div>
    </footer>
  );
};
