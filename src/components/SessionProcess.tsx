import React from 'react';
import { MessageSquareText, MapPin, Sparkles, Coffee, ShieldCheck, Check } from 'lucide-react';
import { t } from '../content/store';

export const SessionProcess: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: t('process.1', 'Быстрая запись на удобный час'),
      time: t('process.2', '1–2 минуты'),
      description: t('process.3', 'Вы пишете в WhatsApp/Telegram или звоните. Согласуем удобный день и время приема, уточняем ваши жалобы и отсутствие противопоказаний.'),
      icon: MessageSquareText
    },
    {
      step: '02',
      title: t('process.4', 'Приезд в уютный домашний кабинет'),
      time: t('process.5', 'Точно к назначенному времени'),
      description: t('process.6', 'Приезжаете по адресу: г. Бежецк, ул. Мира, д. 2/50 (парковка прямо у дома). Мастер встречает вас, провожает в подготовленную теплую комнату со свежим воздухом.'),
      icon: MapPin
    },
    {
      step: '03',
      title: t('process.7', 'Сеанс массажа и бережная забота'),
      time: t('process.8', '30–90 минут'),
      description: t('process.9', 'Располагаетесь на устойчивом анатомическом столе с подогревом простыни. Прорабатываем спазмированные зоны с контролем комфорта, под расслабляющую музыку.'),
      icon: Sparkles
    },
    {
      step: '04',
      title: t('process.10', 'Отдых в чайной зоне без спешки'),
      time: t('process.11', '15 минут покоя'),
      description: t('process.12', 'Никто не торопит освободить место. Вы спокойно одеваетесь, выпиваете чашку свежезаваренного травяного чая с медом и получаете рекомендации по осанке.'),
      icon: Coffee
    }
  ];

  return (
    <section id="process" className="py-16 lg:py-24 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs font-semibold text-[#466352] uppercase tracking-wider mb-2">
            {t('process.13', 'Прозрачность и комфорт')}
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#182B1F]">
            {t('process.14', 'Как проходит ваш визит в домашний кабинет')}
          </h1>
          <p className="mt-3 text-sm text-[#4E6053] leading-relaxed">
            {t('process.15', 'Всё организовано так, чтобы вы почувствовали себя желанным гостем, расслабились и забыли о городской суете с первой же минуты.')}
          </p>
        </div>

        {/* 4 Steps Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative rounded-2xl bg-white border border-[#E3DCD2] p-6 flex flex-col justify-between hover:border-[#466352]/40 transition-colors"
              >
                <div>
                  {/* Step Editorial Index */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-display text-2xl font-bold text-[#466352] opacity-80 tabular-nums">
                      {item.step}
                    </span>
                    <span className="text-[11px] font-medium text-[#738478] bg-[#F2EDE5] px-2.5 py-0.5 rounded-md">
                      {item.time}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-[#EBF3ED] text-[#3D5745] flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="font-display font-bold text-lg text-[#182B1F] mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#526357] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Preparation Box: "Что взять с собой?" */}
        <div className="mt-12 rounded-2xl bg-[#F4EFE9] border border-[#E0D8CD] p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            <div className="lg:col-span-5 space-y-2">
              <div className="text-xs font-semibold text-[#466352] uppercase tracking-wider">
                {t('process.16', 'Памятка гостю')}
              </div>
              <h3 className="text-2xl font-display font-bold text-[#182B1F]">
                {t('process.17', 'Что нужно взять с собой на сеанс?')}
              </h3>
              <p className="text-xs text-[#55675A] leading-relaxed">
                {t('process.18', 'Абсолютно ничего! В кабинете уже приготовлено всё для вашей гигиены и уюта.')}
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <div className="bg-white rounded-xl p-4 border border-[#E4DDD3]">
                <div className="font-semibold text-xs text-[#182B1F] flex items-center gap-1.5 mb-1">
                  <Check className="w-3.5 h-3.5 text-[#466352]" />
                  <span>{t('process.19', 'Одноразовое белье')}</span>
                </div>
                <p className="text-[11px] text-[#5A6D60]">
                  {t('process.20', 'Индивидуальные простыни, чехлы для подголовника, шапочки и тапочки вскрываются при вас.')}
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 border border-[#E4DDD3]">
                <div className="font-semibold text-xs text-[#182B1F] flex items-center gap-1.5 mb-1">
                  <Check className="w-3.5 h-3.5 text-[#466352]" />
                  <span>{t('process.21', 'Мягкие полотенца')}</span>
                </div>
                <p className="text-[11px] text-[#5A6D60]">
                  {t('process.22', 'Свежие мягкие полотенца, чтобы укрыться во время массажа и чувствовать себя в тепле.')}
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 border border-[#E4DDD3]">
                <div className="font-semibold text-xs text-[#182B1F] flex items-center gap-1.5 mb-1">
                  <Check className="w-3.5 h-3.5 text-[#466352]" />
                  <span>{t('process.23', 'Травяной сбор с мёдом')}</span>
                </div>
                <p className="text-[11px] text-[#5A6D60]">
                  {t('process.24', 'Ароматный натуральный чай с мелиссой, мятой и ромашкой ждет вас после каждого сеанса.')}
                </p>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
