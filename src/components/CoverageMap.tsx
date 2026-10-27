import React from 'react';
import { MapPin, Navigation, Clock, Check, Car, Bus, ShieldCheck, Coffee } from 'lucide-react';
import { LOCATION_BEZHETSK, MASTER_INFO } from '../data/massageData';

export const CoverageMap: React.FC = () => {
  const travelEstimates = [
    { from: 'Центральный район (ул. Ленина, пл. Советская)', time: '4–7 мин на авто / 12 мин пешком' },
    { from: 'Микрорайон «Восток»', time: '6–8 мин на авто / прямой автобус' },
    { from: 'Район «Штаб»', time: '5–8 мин на авто' },
    { from: 'Район «Сельмаш»', time: '8–10 мин на авто' },
    { from: 'Район ж/д Вокзала', time: '8–12 мин на авто' },
    { from: 'Заречье (за р. Молога / Остречина)', time: '10–14 мин на авто' },
  ];

  return (
    <section id="location" className="py-16 lg:py-20 bg-[#F4EFEA] border-t border-[#E5DED4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <div className="text-xs font-semibold text-[#466352] uppercase tracking-wider mb-2">
            Локация и удобство
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#182B1F]">
            Где находится домашний кабинет и как добраться
          </h2>
          <p className="mt-2 text-sm text-[#4F6154]">
            Кабинет расположен в Бежецке на улице Мира, д. 2/50 с комфортным подъездом и бесплатной парковкой.
          </p>
        </div>

        {/* 2-Column Layout: Studio Features & District Arrival Times */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Studio info card */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-6 sm:p-8 border border-[#DFD7CD] shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#EAF3ED] text-[#3A5644] flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-[#182B1F]">
                  {LOCATION_BEZHETSK.address}
                </h3>
                <p className="text-xs text-[#5D6F63]">
                  {LOCATION_BEZHETSK.landmarks}
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2 text-xs sm:text-sm text-[#415045]">
              <div className="flex items-start gap-3">
                <Car className="w-4 h-4 text-[#466352] shrink-0 mt-0.5" />
                <span><strong>Для автомобилистов:</strong> {LOCATION_BEZHETSK.parking}</span>
              </div>
              <div className="flex items-start gap-3">
                <Bus className="w-4 h-4 text-[#466352] shrink-0 mt-0.5" />
                <span><strong>Общественный транспорт:</strong> {LOCATION_BEZHETSK.transport}</span>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-[#466352] shrink-0 mt-0.5" />
                <span><strong>Конфиденциальность:</strong> отдельная тихая комната, где во время сеанса нет посторонних.</span>
              </div>
              <div className="flex items-start gap-3">
                <Coffee className="w-4 h-4 text-[#466352] shrink-0 mt-0.5" />
                <span><strong>Чайная зона:</strong> после сеанса можно не спеша посидеть в кресле с чашкой горячего чая.</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E9E2D8] text-xs text-[#5E7164]">
              * Точный номер дома и подъезда высылается личным сообщением в WhatsApp или Telegram сразу после согласования даты и времени сеанса.
            </div>
          </div>

          {/* Travel time from Bezhetsk neighborhoods */}
          <div className="lg:col-span-6 space-y-4">
            <div className="text-xs font-semibold text-[#466352] uppercase tracking-wider">
              Время в пути из районов города:
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {travelEstimates.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-3.5 sm:p-4 border border-[#DFD7CD] flex items-center justify-between gap-3 text-xs"
                >
                  <span className="font-semibold text-[#182B1F] flex items-center gap-2">
                    <Navigation className="w-3.5 h-3.5 text-[#466352] shrink-0" />
                    <span>{item.from}</span>
                  </span>
                  <span className="text-[#596B5E] text-right font-medium shrink-0">
                    {item.time}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#DDD5CA] flex items-center justify-between text-xs text-[#526457]">
              <span>Записаться или задать вопрос по проезду:</span>
              <a
                href={`tel:${MASTER_INFO.phone.replace(/[^+\d]/g, '')}`}
                className="font-bold text-[#182B1F] hover:text-[#466352] whitespace-nowrap transition-colors"
              >
                {MASTER_INFO.phoneDisplay}
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
