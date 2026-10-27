import React, { useState, useEffect } from 'react';
import { X, Sparkles, MessageCircle, Send, Phone, CheckCircle, Calendar, Clock, MapPin } from 'lucide-react';
import { SERVICES, MASTER_INFO } from '../data/massageData';
import { MassageService } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: MassageService | null;
  preselectedDuration?: { minutes: number; price: number } | null;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  preselectedService,
  preselectedDuration
}) => {
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    preselectedService ? preselectedService.id : SERVICES[0].id
  );

  const currentService = SERVICES.find((s) => s.id === selectedServiceId) || SERVICES[0];

  const [selectedDurationIndex, setSelectedDurationIndex] = useState<number>(0);

  useEffect(() => {
    if (!isOpen) return;
    // Each opening starts a fresh request instead of showing the previous "success" screen
    setIsSubmitted(false);
    setPhoneError(false);
    if (preselectedService) {
      setSelectedServiceId(preselectedService.id);
      if (preselectedDuration) {
        const idx = preselectedService.durations.findIndex((d) => d.minutes === preselectedDuration.minutes);
        setSelectedDurationIndex(idx !== -1 ? idx : 0);
      } else {
        setSelectedDurationIndex(0);
      }
    } else {
      setSelectedServiceId(SERVICES[0].id);
      setSelectedDurationIndex(0);
    }
  }, [preselectedService, preselectedDuration, isOpen]);

  const currentDuration = currentService.durations[selectedDurationIndex] || currentService.durations[0];

  const [clientName, setClientName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [timePreference, setTimePreference] = useState('Утро (09:00 - 12:00)');
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [phoneError, setPhoneError] = useState(false);

  if (!isOpen) return null;

  const buildMessageText = () => {
    return `Здравствуйте, Анара! Хочу записаться на массаж в ваш домашний кабинет в Бежецке:\n` +
      `• Программа: ${currentService.title}\n` +
      `• Длительность: ${currentDuration.minutes} мин (стоимость ${currentDuration.price} ₽)\n` +
      `• Адрес кабинета: ${MASTER_INFO.cabinetAddress}\n` +
      `• Желаемая дата/время: ${date || 'Ближайшая'} (${timePreference})\n` +
      `• Клиент: ${clientName || 'Не указано'}, тел: ${phone || 'В чате'}` +
      (comment ? `\n• Примечание: ${comment}` : '');
  };

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent(buildMessageText());
    window.open(`${MASTER_INFO.whatsappUrl}?text=${text}`, '_blank');
    setIsSubmitted(true);
  };

  const handleOpenTelegram = async () => {
    // t.me profile links can't prefill a message (?start= only works for bots and
    // only with short latin payloads), so copy the text for the client to paste.
    try {
      await navigator.clipboard.writeText(buildMessageText());
    } catch {
      // Clipboard may be unavailable; the client can still type the message
    }
    window.open(MASTER_INFO.telegramUrl, '_blank');
    setIsSubmitted(true);
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.replace(/\D/g, '').length < 10) {
      setPhoneError(true);
      return;
    }
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-[#E3DCD2] p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#738377] hover:bg-[#F2EDE5] hover:text-[#182B1F] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#EAF4ED] text-[#466352] flex items-center justify-center">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-display font-bold text-[#182B1F]">
              Заявка успешно подготовлена!
            </h3>
            <p className="text-sm text-[#4E6053] max-w-md mx-auto leading-relaxed">
              Мастер Анара Муратова свяжется с вами в течение 10–15 минут для подтверждения точного времени по адресу: {MASTER_INFO.cabinetAddress}. Если вы открыли WhatsApp — просто отправьте подготовленный текст. Для Telegram текст заявки скопирован — вставьте его в чат.
            </p>
            <div className="pt-4">
              <button
                onClick={onClose}
                className="px-6 py-2.5 text-xs font-semibold text-white bg-[#466352] hover:bg-[#385142] rounded-xl shadow-xs"
              >
                Вернуться на сайт
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Header */}
            <div>
              <div className="text-xs font-semibold text-[#466352] uppercase tracking-wider mb-1">
                Запись в домашний кабинет (Бежецк)
              </div>
              <h3 className="text-2xl font-display font-bold text-[#182B1F]">
                Выберите программу и удобное время
              </h3>
              <p className="text-xs text-[#5C6E61] mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#466352]" />
                <span>Прием по адресу: {MASTER_INFO.cabinetAddress} (удобная парковка)</span>
              </p>
            </div>

            {/* Service & Duration Selection */}
            <div className="space-y-3 p-4 rounded-2xl bg-[#F8F5F0] border border-[#E6E0D6]">
              <div>
                <label className="block text-[11px] font-semibold text-[#46574C] mb-1">
                  Вид массажа:
                </label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => {
                    setSelectedServiceId(e.target.value);
                    setSelectedDurationIndex(0);
                  }}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#D5CDC2] bg-white font-medium text-[#182B1F] focus:outline-hidden focus:ring-2 focus:ring-[#466352]"
                >
                  {SERVICES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#46574C] mb-1">
                  Длительность и стоимость:
                </label>
                <div className="flex flex-wrap gap-2">
                  {currentService.durations.map((d, idx) => (
                    <button
                      key={d.minutes}
                      type="button"
                      onClick={() => setSelectedDurationIndex(idx)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        selectedDurationIndex === idx
                          ? 'bg-[#466352] text-white shadow-xs'
                          : 'bg-white text-[#38483D] border border-[#D5CDC2] hover:bg-[#EDE7DE]'
                      }`}
                    >
                      {d.minutes} мин · {d.price.toLocaleString('ru-RU')} ₽
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact details */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#46574C] mb-1">
                    Ваше имя
                  </label>
                  <input
                    type="text"
                    placeholder="Например, Анна"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#D5CDC2] focus:outline-hidden focus:ring-2 focus:ring-[#466352]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#46574C] mb-1">
                    Телефон для связи
                  </label>
                  <input
                    type="tel"
                    placeholder="+7 (9xx) xxx-xx-xx"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setPhoneError(false);
                    }}
                    className={`w-full text-xs p-2.5 rounded-xl border focus:outline-hidden focus:ring-2 focus:ring-[#466352] ${
                      phoneError ? 'border-red-400' : 'border-[#D5CDC2]'
                    }`}
                  />
                  {phoneError && (
                    <p className="mt-1 text-[11px] text-red-600">Укажите номер телефона, чтобы мастер перезвонила</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#46574C] mb-1">
                    Желаемая дата визита
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#D5CDC2] focus:outline-hidden focus:ring-2 focus:ring-[#466352]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#46574C] mb-1">
                    Удобный интервал
                  </label>
                  <select
                    value={timePreference}
                    onChange={(e) => setTimePreference(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#D5CDC2] bg-white focus:outline-hidden focus:ring-2 focus:ring-[#466352]"
                  >
                    <option value="Утро (09:00 - 12:00)">Утро (09:00 - 12:00)</option>
                    <option value="День (12:00 - 16:00)">День (12:00 - 16:00)</option>
                    <option value="Вечер (16:00 - 21:00)">Вечер (16:00 - 21:00)</option>
                    <option value="В любое удобное мастеру время">В любое удобное время</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#46574C] mb-1">
                  Что вас беспокоит? (пожелания, жалобы, противопоказания)
                </label>
                <textarea
                  rows={2}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Например: болит поясница, затекла шея, хочется снять напряжение..."
                  className="w-full text-xs p-2.5 rounded-xl border border-[#D5CDC2] focus:outline-hidden focus:ring-2 focus:ring-[#466352]"
                />
              </div>
            </div>

            {/* Quick Action Submission via Messenger */}
            <div className="pt-2 border-t border-[#ECE5DB] space-y-3">
              <div className="text-xs font-semibold text-[#46574C] text-center">
                Выберите удобный способ подтверждения записи:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleOpenWhatsApp}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20BC5A] text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Отправить в WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenTelegram}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#2AABEE] hover:bg-[#2297D4] text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>Отправить в Telegram</span>
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handlePhoneSubmit}
                  className="text-xs text-[#526457] hover:text-[#182B1F] underline transition-colors"
                >
                  или просто перезвоните мне по номеру {phone || '...'}
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
