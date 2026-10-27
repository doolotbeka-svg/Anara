import React, { useState } from 'react';
import { Award, GraduationCap, ShieldCheck, CheckCircle2, ChevronDown, ChevronUp, Sparkles, Home, Clock, Coffee, HeartHandshake } from 'lucide-react';
import { MASTER_INFO } from '../data/massageData';
import { getImages, t } from '../content/store';
import { MasterAvatar } from './MasterAvatar';

export const AboutMaster: React.FC = () => {
  const { gallery } = getImages();
  const [showDiplomas, setShowDiplomas] = useState(false);

  return (
    <section id="about" className="py-16 lg:py-24 bg-[#F5F1EB] border-y border-[#E6DFD4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 lg:mb-16">
          <div className="text-xs font-semibold text-[#466352] uppercase tracking-wider mb-2">
            {t('about.1', 'О мастере и кабинете')}
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#182B1F] leading-tight">
            {t('about.2', '«Моя цель — избавить вас от боли и спазмов в обстановке полного покоя, душевного тепла и уюта»')}
          </h1>
          <p className="mt-4 text-base text-[#4A594F] leading-relaxed">
            {t('about.3', 'Здравствуйте! Меня зовут Муратова Анара. Я дипломированный специалист по медицинскому и оздоровительному массажу со стажем 2 года. Принимаю клиентов в оборудованном домашнем кабинете в Бежецке на ул. Мира 2/50.')}
          </p>
        </div>

        {/* 2-Column Split: Master Credentials & Home Cabinet Benefits */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Column 1: Master Profile & Education */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2DAD0] shadow-sm space-y-6">
              
              <div className="flex items-center gap-4">
                <MasterAvatar
                  className="w-16 h-16 rounded-full bg-[#3F5B49] text-white font-display font-bold text-2xl shadow-inner shrink-0"
                  initials={t('about.4', 'МА')}
                />
                <div>
                  <h3 className="text-xl font-display font-bold text-[#1B2F22]">
                    {MASTER_INFO.name}
                  </h3>
                  <div className="text-xs text-[#5D6F63]">
                    {MASTER_INFO.role}{' '}{t('about.5', '· Практика с 2024 года')}
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm text-[#415046] leading-relaxed">
                <p>
                  {t('about.6', 'Я получила медицинское образование в Тверском медицинском колледже, после чего прошла фундаментальную подготовку в Институте восстановительной медицины по курсу классического и лечебного массажа.')}
                </p>
                <p>
                  {t('about.7', 'Я намеренно оборудовала уютный спа-кабинет у себя дома, чтобы клиенты не сталкивались с холодным «салонным конвейером». Перед сеансом мы обязательно обсуждаем самочувствие и триггерные зоны, а после процедуры вы можете не спеша выпить чай и по-настоящему отдохнуть.')}
                </p>
              </div>

              {/* Key numbers strip */}
              <div className="grid grid-cols-3 gap-3 py-4 border-y border-[#ECE5DC] text-center">
                <div>
                  <div className="text-2xl font-bold font-display text-[#1C3224] tabular-nums">{t('about.8', '2')}</div>
                  <div className="text-xs text-[#627568] mt-0.5">{t('about.9', 'года практики')}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-display text-[#1C3224] tabular-nums">{t('about.10', '400+')}</div>
                  <div className="text-xs text-[#627568] mt-0.5">{t('about.11', 'клиентов в Бежецке')}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-display text-[#1C3224] tabular-nums">{t('about.12', '100%')}</div>
                  <div className="text-xs text-[#627568] mt-0.5">{t('about.13', 'одноразовые расходники')}</div>
                </div>
              </div>

              {/* Diplomas Toggle Accordion */}
              <div>
                <button
                  onClick={() => setShowDiplomas(!showDiplomas)}
                  className="w-full flex items-center justify-between py-2 text-xs font-semibold text-[#3C5544] hover:text-[#1F3325] transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-[#466352]" />
                    <span>{t('about.14', 'Образование и сертификаты специалиста (')}{MASTER_INFO.diplomas.length})</span>
                  </span>
                  {showDiplomas ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showDiplomas && (
                  <div className="mt-3 space-y-2.5 pt-2 border-t border-[#EFEAE2]">
                    {MASTER_INFO.diplomas.map((item, index) => (
                      <div key={index} className="text-xs bg-[#FBF9F6] p-3 rounded-lg border border-[#E9E3D8]">
                        <div className="font-semibold text-[#1F3225]">{item.title}</div>
                        <div className="text-[#596B5F] mt-0.5 flex items-center justify-between">
                          <span>{item.issuer}</span>
                          <span className="tabular-nums font-medium text-[#466352]">{item.year}{' '}{t('about.15', 'г.')}</span>
                        </div>
                      </div>
                    ))}
                    <div className="text-[11px] text-[#697B6F] italic pt-1">
                      {t('about.16', '* Дипломы и медицинская книжка размещены в кабинете и открыты для ознакомления.')}
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Column 2: Why Massage in Master's Home Studio is Better */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2DAD0] shadow-sm space-y-6">
              
              <div>
                <h3 className="text-xl font-display font-bold text-[#1B2F22]">
                  {t('about.17', 'Почему сеанс в домашнем кабинете мастера — это идеальный комфорт?')}
                </h3>
                <p className="text-xs text-[#5D6F63] mt-1">
                  {t('about.18', 'Преимущества перед поездками в коммерческие салоны и массажем у вас дома')}
                </p>
              </div>

              <div className="space-y-4">
                
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-[#EBF3ED] text-[#3B5443] flex items-center justify-center shrink-0 mt-0.5">
                    <Home className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#1C3124]">
                      {t('about.19', 'Вам не нужно готовить квартиру к приходу мастера')}
                    </h4>
                    <p className="text-xs text-[#526357] mt-1 leading-relaxed">
                      {t('about.20', 'Не нужно убираться, переставлять мебель, просить домашних уйти из дома или запирать питомцев в другой комнате. Вы просто приходите в готовый, проветренный и чистый спа-кабинет.')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-[#EBF3ED] text-[#3B5443] flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#1C3124]">
                      {t('about.21', 'Профессиональное стационарное оборудование')}
                    </h4>
                    <p className="text-xs text-[#526357] mt-1 leading-relaxed">
                      {t('about.22', 'Устойчивый стол с мягким наполнителем, подогрев простыни в холодную погоду, анатомический вырез для лица, приглушенный теплый свет и ароматерапия с натуральными эфирными маслами.')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-[#EBF3ED] text-[#3B5443] flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#1C3124]">
                      {t('about.23', 'Полная конфиденциальность: только вы и мастер')}
                    </h4>
                    <p className="text-xs text-[#526357] mt-1 leading-relaxed">
                      {t('about.24', 'Никаких очередей в коридоре, звонящих кассовых аппаратов, администраторов и посторонних звуков. Время вашего сеанса полностью принадлежит вашему здоровью и спокойствию.')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-[#EBF3ED] text-[#3B5443] flex items-center justify-center shrink-0 mt-0.5">
                    <Coffee className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#1C3124]">
                      {t('about.25', 'Чайная зона и отдых без спешки')}
                    </h4>
                    <p className="text-xs text-[#526357] mt-1 leading-relaxed">
                      {t('about.26', 'После массажа никто не выгоняет вас «освободить кушетку следующему клиенту». Вы можете спокойно одеться, выпить чашку свежезаваренного травяного чая с медом и плавно вернуться в тонус.')}
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>

        {/* Cabinet photo gallery from the admin panel */}
        {gallery.length > 0 && (
          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {gallery.map((photo) => (
              <figure key={photo.url} className="rounded-2xl overflow-hidden bg-white border border-[#E2DAD0] shadow-sm">
                <img src={photo.url} alt={photo.caption || MASTER_INFO.name} loading="lazy" className="w-full aspect-[4/3] object-cover" />
                {photo.caption && (
                  <figcaption className="px-3 py-2 text-xs text-[#4A594F]">{photo.caption}</figcaption>
                )}
              </figure>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
