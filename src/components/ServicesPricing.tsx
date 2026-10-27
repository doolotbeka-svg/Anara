import React, { useState } from 'react';
import { SERVICES } from '../data/massageData';
import { MassageService } from '../types';
import { Sparkles, Clock, Check, Gift, ArrowRight } from 'lucide-react';
import { getImages, t } from '../content/store';
import { PhotoSlider } from './PhotoSlider';

interface ServicesPricingProps {
  onSelectService: (service: MassageService, duration: { minutes: number; price: number }) => void;
}

export const ServicesPricing: React.FC<ServicesPricingProps> = ({ onSelectService }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDurations, setSelectedDurations] = useState<Record<string, number>>({});

  const categories = [
    { id: 'all', label: t('services.1', 'Все программы') },
    { id: 'therapeutic', label: t('services.2', 'Спина и оздоровление') },
    { id: 'express', label: t('services.3', 'Шейный отдел (ШВЗ)') },
    { id: 'relax', label: t('services.4', 'Релакс и антистресс') },
    { id: 'special', label: t('services.5', 'Лимфодренаж и моделирование') },
  ];

  const filteredServices = selectedCategory === 'all'
    ? SERVICES
    : SERVICES.filter((s) => s.category === selectedCategory);

  const getDuration = (service: MassageService) => {
    const selectedIdx = selectedDurations[service.id];
    if (selectedIdx !== undefined && service.durations[selectedIdx]) {
      return service.durations[selectedIdx];
    }
    const popularIdx = service.durations.findIndex((d) => d.popular);
    return service.durations[popularIdx !== -1 ? popularIdx : 0];
  };

  const handleDurationClick = (serviceId: string, durationIndex: number) => {
    setSelectedDurations((prev) => ({
      ...prev,
      [serviceId]: durationIndex,
    }));
  };

  return (
    <section id="services" className="py-16 lg:py-24 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-xs font-semibold text-[#466352] uppercase tracking-wider mb-2">
              {t('services.6', 'Прайс-лист и программы')}
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#182B1F] leading-tight">
              {t('services.7', 'Виды массажа и честные цены')}
            </h1>
            <p className="mt-2 text-sm text-[#4A5A4F] max-w-xl">
              {t('services.8', 'Прием в оборудованном домашнем кабинете в Бежецке. Без салонных наценок, все расходники и травяной чай включены.')}
            </p>
          </div>

          {/* Interactive Category Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#ECE6DC] rounded-xl overflow-x-auto max-w-full min-w-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-white text-[#182B1F] shadow-sm font-semibold'
                    : 'text-[#4A5A4F] hover:text-[#182B1F]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Special Course Discount Notice Banner */}
        <div className="mb-10 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#EBF3ED] via-[#F1F6F2] to-[#EBF3ED] border border-[#CFE0D4] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#466352] text-white flex items-center justify-center shrink-0">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-sm text-[#182B1F]">
                {t('services.9', 'Специальное предложение на курсовое оздоровление')}
              </div>
              <div className="text-xs text-[#4F6255] mt-0.5">
                {t('services.10', 'При покупке абонемента от 5 сеансов — скидка 10% + бесплатный сеанс массажа кистей рук в подарок!')}
              </div>
            </div>
          </div>
          <div className="text-xs font-semibold text-[#2D533A] bg-white px-3 py-1.5 rounded-lg border border-[#BED2C4] whitespace-nowrap">
            {t('services.11', 'Экономия до 2 000 ₽')}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const currentDuration = getDuration(service);
            const photos = getImages().servicePhotos[service.id] ?? [];

            return (
              <div
                key={service.id}
                className="rounded-2xl bg-white border border-[#E3DCD1] p-6 flex flex-col justify-between hover:shadow-md transition-shadow group"
              >
                <div>
                  {/* Photos from the admin panel; cards without photos look as before */}
                  {photos.length > 0 && (
                    <PhotoSlider photos={photos} alt={service.title} className="-mx-6 -mt-6 mb-5 rounded-t-2xl" />
                  )}

                  {/* Service Title */}
                  <div className="text-xs font-semibold text-[#466352] uppercase tracking-wider mb-1.5">
                    {service.category === 'therapeutic' ? t('services.12', 'Оздоровительный') : service.category === 'express' ? t('services.13', 'Экспресс-помощь') : service.category === 'relax' ? t('services.14', 'Спа и отдых') : t('services.15', 'Спецпрограмма')}
                  </div>

                  <h3 className="text-xl font-display font-bold text-[#182B1F] group-hover:text-[#324C3B] transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-xs text-[#526356] mt-2 line-clamp-2 leading-relaxed">
                    {service.subtitle}
                  </p>

                  {/* Duration Selector Tabs for This Card */}
                  <div className="mt-4 pt-3 border-t border-[#EFEAE2]">
                    <div className="text-[11px] font-semibold text-[#66776B] mb-2">
                      {t('services.16', 'Выберите длительность сеанса:')}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {service.durations.map((d, dIdx) => {
                        const isSelected = currentDuration.minutes === d.minutes;
                        return (
                          <button
                            key={d.minutes}
                            onClick={() => handleDurationClick(service.id, dIdx)}
                            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                              isSelected
                                ? 'bg-[#466352] text-white shadow-xs'
                                : 'bg-[#F2ECE3] text-[#3D4C42] hover:bg-[#E7E0D6]'
                            }`}
                          >
                            <span>{d.minutes}{' '}{t('services.17', 'мин')}</span>
                            {d.popular && <span className="ml-1 text-[10px] opacity-80">★</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Bullet points */}
                  <ul className="mt-4 space-y-2 text-xs text-[#415045]">
                    {service.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#466352] shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer with Price and Action */}
                <div className="mt-6 pt-4 border-t border-[#EFEAE2] flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] text-[#697A6D]">{t('services.18', 'Стоимость в кабинете:')}</div>
                    <div className="text-2xl font-bold font-display text-[#182B1F] tabular-nums">
                      {currentDuration.price.toLocaleString('ru-RU')} ₽
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectService(service, currentDuration)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-[#466352] hover:bg-[#385142] active:bg-[#2C4033] rounded-xl shadow-xs transition-colors whitespace-nowrap"
                  >
                    <span>{t('services.19', 'Выбрать')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Note on Location */}
        <div className="mt-10 text-center text-xs text-[#5D6F63]">
          <span className="font-semibold text-[#182B1F]">{t('services.20', 'Где проходит прием:')}</span>{' '}{t('services.21', 'г. Бежецк, ул. Мира, д. 2/50 (удобная локация, бесплатная парковка у дома).')}
        </div>

      </div>
    </section>
  );
};
