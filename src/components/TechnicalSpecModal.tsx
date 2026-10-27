import React, { useState } from 'react';
import { X, Copy, Check, FileText, Palette, Camera, Search, Layers } from 'lucide-react';
import { TZ_SPECIFICATION, MASTER_INFO, SERVICES } from '../data/massageData';
import { t } from '../content/store';

interface TechnicalSpecModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TechnicalSpecModal: React.FC<TechnicalSpecModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'tz' | 'texts' | 'palette' | 'photos' | 'seo'>('tz');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getFullMarkdown = () => {
    return t('tz.1', '# ТЕХНИЧЕСКОЕ ЗАДАНИЕ (ТЗ) НА РАЗРАБОТКУ САЙТА-ЛЕНДИНГА\n## Проект: Частный массаж на дому у мастера в г. Бежецк (Тверская область)\n\n### 1. ОБЩИЕ СВЕДЕНИЯ И ЦЕЛИ ПРОЕКТА\n- **Тип сайта:** Одностраничный продающий сайт (Landing Page) с мобильной адаптивностью.\n- **Специалист:** Анара Муратова, дипломированный мастер (стаж 2 года).\n- **Телефон:** +7 (930) 181-18-86.\n- **Основная услуга:** Профессиональный лечебный, классический и расслабляющий массаж в оборудованном домашнем кабинете мастера (г. Бежецк, ул. Мира, д. 2/50).\n- **Формат приема:** Отдельная изолированная спа-комната дома у мастера со стационарным анатомическим столом, подогревом простыни, ароматерапией, музыкой и чайной зоной.\n- **Географическая привязка:** Город Бежецк, ул. Мира, д. 2/50. Удобный подъезд, бесплатная парковка, тихий двор.\n- **Целевая аудитория:** Женщины и мужчины 25–65 лет, офисные сотрудники (боли в спине и шее), молодые мамы (отдых от быта в тишине), пожилые люди (артрозы, скованность), спортсмены.\n- **Ключевые боли клиента:** Салонный конвейер и шум; высокие наценки за коммерческую аренду; нежелание убираться в своей квартире для выездного массажиста; страх непрофессионализма.\n- **Главные УТП:** Оборудованный домашний кабинет с анатомическим столом; 100% стерильность; цены на 25–40% доступнее салонных; чайная зона и отдых без спешки; 2 года практики и базовое медицинское образование.\n- **Целевые действия (CTA):** Запись через WhatsApp, Telegram или телефонный звонок.\n\n---\n\n### 2. СТРУКТУРА СТРАНИЦЫ (ПО БЛОКАМ)\n1. **Первый экран (Hero):**\n   - УТП: Профессиональный массаж на дому у мастера в Бежецке. Сниму боль в спине и усталость в уютном кабинете.\n   - Подзаголовок: Оборудованный тихий спа-кабинет в домашней обстановке без салонного шума и наценок. Стационарный анатомический стол, натуральные масла, 100% стерильность и горячий травяной чай с медом.\n   - Кнопки: «Записаться в WhatsApp / Telegram», «Виды массажа и цены».\n   - Буллеты: Бежецк (ул. Мира 2/50, парковка), один клиент на приеме, дипломированный специалист (стаж 2 года).\n\n2. **Блок «О мастере и кабинете»:**\n   - Мастер: Анара Муратова, стаж 2 года.\n   - Образование: Тверской медицинский колледж, Институт восстановительной медицины.\n   - 4 преимущества домашнего кабинета мастера (почему это лучше салона и удобнее, чем массаж у клиента).\n\n3. **Блок «Виды массажа и прайс-лист»:**\n   - Прайс с переключателем длительности (30/45/60/75/90 мин).\n   - Скидка 10% на абонемент от 5 сеансов + подарок.\n\n4. **Интерактивный помощник «Что вас беспокоит?»:**\n   - Экспресс-выбор симптома (поясница, шея, стресс, отеки) и мгновенный расчет программы.\n\n5. **Блок «Как проходит сеанс» (снятие возражений):**\n   - Шаг 1: Заявка в мессенджер и согласование времени.\n   - Шаг 2: Приезд в уютный кабинет на ул. Мира (парковка у дома, свежий воздух, чистота).\n   - Шаг 3: Сеанс массажа на анатомическом столе с подогревом.\n   - Шаг 4: Отдых в чайной зоне с чашкой травяного сбора с медом.\n   - Памятка: что взять с собой (ничего, в кабинете всё готово).\n\n6. **Блок «Отзывы клиентов из Бежецка»:**\n   - Реальные отзывы жителей города о посещении домашнего кабинета на ул. Мира.\n\n7. **Блок «Частые вопросы (FAQ)»:**\n   - 7 подробных ответов (где находится, нужно ли что-то брать, нет ли посторонних, прием мужчин, противопоказания).\n\n8. **Локация кабинета и транспортная доступность:**\n   - Бежецк, ул. Мира, ориентиры, время в пути из районов города.\n\n9. **Футер:**\n   - Контакты, время приема (09:00 - 21:00), статус самозанятого (чеки).\n\n---\n\n### 3. РЕКОМЕНДУЕМАЯ ЦВЕТОВАЯ ГАММА\n- Шалфейный зеленый (#466352) — акцентные кнопки, маркеры доверия, природа, здоровье.\n- Теплый лен (#FAF8F5) — основной фон (60%), домашний уют без холодной резкости.\n- Песочно-минеральный (#EBE6DE) — поверхности карточек (30%), спа-эстетика.\n- Хвойный глубокий (#1D3325) — солидные контрастные заголовки.\n- Мягкий графит (#242A26) — комфортный текст для глаз.\n\n---\n\n### 4. ТРЕБОВАНИЯ К ФОТОСЕССИИ (ТЗ ДЛЯ ФОТОГРАФА)\n1. Портрет мастера: в чистой оливково-шалфейной форме, с теплой улыбкой, ухоженными руками.\n2. Кабинет в целом: стационарный массажный стол, застеленный белоснежной простыней, мягкий свет бра, валики, увлажнитель с паром.\n3. Чайный столик: прозрачный чайник с травяным чаем, чашка, баночка меда.\n4. Гигиена: запечатанные одноразовые простыни, антисептик, масла.\n');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white rounded-3xl shadow-2xl border border-[#DED7CD] overflow-hidden">
        
        {/* Modal Topbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E2D8] bg-[#FAF8F5]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#466352] text-white flex items-center justify-center font-bold text-sm">
              {t('tz.2', 'ТЗ')}
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-[#182B1F]">
                {t('tz.3', 'Техническое задание, тексты и брендбук')}
              </h3>
              <p className="text-[11px] text-[#5D6F63]">
                {t('tz.4', 'Массаж на дому у мастера в Бежецке (домашний спа-кабинет)')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy('all-tz', getFullMarkdown())}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#182B1F] bg-[#EAE5DC] hover:bg-[#DDD6CA] rounded-lg transition-colors border border-[#D2C9BB]"
            >
              {copiedId === 'all-tz' ? <Check className="w-3.5 h-3.5 text-[#466352]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedId === 'all-tz' ? t('tz.5', 'Скопировано!') : t('tz.6', 'Копировать всё ТЗ')}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[#6D7D71] hover:bg-[#EAE5DC] hover:text-[#182B1F] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 pt-3 pb-2 bg-[#F6F2EC] border-b border-[#E8E2D8] overflow-x-auto">
          {[
            { id: 'tz', label: t('tz.7', '1. Паспорт ТЗ'), icon: Layers },
            { id: 'texts', label: t('tz.8', '2. Тексты по блокам'), icon: FileText },
            { id: 'palette', label: t('tz.9', '3. Цветовая палитра'), icon: Palette },
            { id: 'photos', label: t('tz.10', '4. ТЗ для фотографа'), icon: Camera },
            { id: 'seo', label: t('tz.11', '5. Локальное SEO (Бежецк)'), icon: Search },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-white text-[#182B1F] shadow-xs border border-[#DDD6CA]'
                    : 'text-[#586A5E] hover:text-[#182B1F]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-[#38483D]">
          
          {/* TAB 1: Main Project Passport */}
          {activeTab === 'tz' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-[#F8F5F0] border border-[#E4DDD2] space-y-2">
                <div className="text-xs font-semibold text-[#466352] uppercase tracking-wider">
                  {t('tz.12', 'Цель проекта')}
                </div>
                <h4 className="font-display font-bold text-lg text-[#182B1F]">
                  {TZ_SPECIFICATION.projectTitle}
                </h4>
                <p className="text-xs text-[#4F6154] leading-relaxed">
                  {TZ_SPECIFICATION.goal}
                </p>
              </div>

              <div>
                <h4 className="font-display font-bold text-base text-[#182B1F] mb-3">
                  {t('tz.13', 'Целевая аудитория и клиентские боли:')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {TZ_SPECIFICATION.targetAudience.map((aud, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-white border border-[#E2DAD0] text-xs space-y-1">
                      <div className="font-bold text-[#466352]">{t('tz.14', 'Сегмент')}{' '}{i + 1}</div>
                      <div className="text-[#3F4F44]">{aud}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-display font-bold text-base text-[#182B1F] mb-3">
                  {t('tz.15', 'Ключевые УТП и факторы доверия:')}
                </h4>
                <ul className="space-y-2 text-xs">
                  {TZ_SPECIFICATION.keyUsp.map((usp, i) => (
                    <li key={i} className="p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E9E3D8] flex items-center justify-between">
                      <span>✓ {usp}</span>
                      <button
                        onClick={() => handleCopy(`usp-${i}`, usp)}
                        className="text-[11px] text-[#466352] hover:underline"
                      >
                        {copiedId === `usp-${i}` ? t('tz.16', 'Скопировано') : t('tz.17', 'Копировать')}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: Ready-to-use Copy by Block */}
          {activeTab === 'texts' && (
            <div className="space-y-6">
              
              {/* Hero Block Copy */}
              <div className="p-4 rounded-xl bg-white border border-[#E2DAD0] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#466352] uppercase">{t('tz.18', 'Блок 1: Первый экран (Hero)')}</span>
                  <button
                    onClick={() => handleCopy('hero-copy', 'Заголовок: Профессиональный массаж на дому у мастера в Бежецке. Сниму боль в спине и усталость в уютном кабинете.\nПодзаголовок: Оборудованный тихий спа-кабинет в домашней обстановке без салонного шума и наценок. Стационарный анатомический стол, натуральные масла, 100% стерильность и горячий травяной чай с медом.\nCTA: Записаться в WhatsApp / Telegram')}
                    className="text-xs text-[#466352] hover:underline flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedId === 'hero-copy' ? t('tz.19', 'Скопировано!') : t('tz.20', 'Копировать')}</span>
                  </button>
                </div>
                <div className="text-xs space-y-1 text-[#2B3B30]">
                  <p><strong>{t('tz.21', 'Заголовок (H1):')}</strong>{' '}{t('tz.22', 'Профессиональный массаж на дому у мастера в Бежецке. Сниму боль в спине и усталость в уютном кабинете.')}</p>
                  <p><strong>{t('tz.23', 'Подзаголовок:')}</strong>{' '}{t('tz.24', 'Оборудованный тихий спа-кабинет в домашней обстановке без салонного шума и наценок. Стационарный анатомический стол, натуральные масла, 100% стерильность и горячий травяной чай с медом.')}</p>
                  <p><strong>{t('tz.25', 'Кнопки призыва:')}</strong>{' '}{t('tz.26', '«Записаться в WhatsApp / Telegram», «Виды массажа и цены».')}</p>
                  <p><strong>{t('tz.27', 'Триггеры доверия:')}</strong>{' '}{t('tz.28', 'Бежецк (ул. Мира 2/50, парковка), один клиент на приеме, без салонных наценок.')}</p>
                </div>
              </div>

              {/* About Block Copy */}
              <div className="p-4 rounded-xl bg-white border border-[#E2DAD0] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#466352] uppercase">{t('tz.29', 'Блок 2: О мастере и домашнем кабинете')}</span>
                  <button
                    onClick={() => handleCopy('about-copy', 'Анара Муратова — сертифицированный мастер массажа, стаж 2 года. Прием в домашнем кабинете: г. Бежецк, ул. Мира, д. 2/50, тел. +7 (930) 181-18-86. Преимущества домашнего кабинета: не нужно готовить квартиру к приходу мастера; профессиональный анатомический стол с подогревом; полная тишина и конфиденциальность; горячий травяной чай и отдых без спешки.')}
                    className="text-xs text-[#466352] hover:underline flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedId === 'about-copy' ? t('tz.30', 'Скопировано!') : t('tz.31', 'Копировать')}</span>
                  </button>
                </div>
                <div className="text-xs space-y-1 text-[#2B3B30]">
                  <p><strong>{t('tz.32', 'Мастер:')}</strong>{' '}{t('tz.33', 'Анара Муратова (тел. +7 (930) 181-18-86).')}</p>
                  <p><strong>{t('tz.34', 'Адрес кабинета:')}</strong>{' '}{t('tz.35', 'г. Бежецк, ул. Мира, д. 2/50.')}</p>
                  <p><strong>{t('tz.36', 'Позиционирование:')}</strong>{' '}{t('tz.37', 'Дипломированный специалист с пониманием анатомии, принимающий в уютной домашней спа-комнате.')}</p>
                  <p><strong>{t('tz.38', 'Почему кабинет у мастера лучше:')}</strong>{' '}{t('tz.39', 'Клиенту не нужно убирать квартиру, прятать питомцев или двигать мебель. В кабинете уже тепло, чистейшее белье, правильный свет и тишина.')}</p>
                </div>
              </div>

              {/* Services & Prices */}
              <div className="p-4 rounded-xl bg-white border border-[#E2DAD0] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#466352] uppercase">{t('tz.40', 'Блок 3: Услуги и цены')}</span>
                  <button
                    onClick={() => handleCopy('services-copy', SERVICES.map(s => `${s.title}: ${s.durations.map(d => `${d.minutes} мин — ${d.price} ₽`).join(', ')}`).join('\n'))}
                    className="text-xs text-[#466352] hover:underline flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedId === 'services-copy' ? t('tz.41', 'Скопировано!') : t('tz.42', 'Копировать весь прайс')}</span>
                  </button>
                </div>
                <div className="text-xs space-y-1.5 text-[#2B3B30]">
                  {SERVICES.map((s) => (
                    <div key={s.id} className="flex justify-between border-b border-[#F0EBE2] pb-1">
                      <span>• {s.title}</span>
                      <span className="font-bold text-[#182B1F]">{s.durations.map(d => `${d.minutes}м / ${d.price}₽`).join(' · ')}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Process */}
              <div className="p-4 rounded-xl bg-white border border-[#E2DAD0] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#466352] uppercase">{t('tz.43', 'Блок 4: Как проходит визит')}</span>
                  <button
                    onClick={() => handleCopy('process-copy', 'Шаг 1: Заявка в мессенджер и согласование времени.\nШаг 2: Приезд в уютный кабинет на ул. Мира (парковка у дома, чистота и тепло).\nШаг 3: Сеанс массажа на анатомическом столе с подогревом.\nШаг 4: Отдых в чайной зоне с чашкой травяного сбора с медом.\nС собой ничего брать не нужно: в кабинете есть одноразовые простыни, тапочки и полотенца.')}
                    className="text-xs text-[#466352] hover:underline flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedId === 'process-copy' ? t('tz.44', 'Скопировано!') : t('tz.45', 'Копировать')}</span>
                  </button>
                </div>
                <div className="text-xs text-[#2B3B30]">
                  {t('tz.46', '4 шага: Запись → Приезд в кабинет → Сеанс массажа → Отдых с чаем.')}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: Color Palette & Brand Book */}
          {activeTab === 'palette' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-display font-bold text-base text-[#182B1F] mb-1">
                  {t('tz.47', 'Гармоничная палитра (Wellness & Home Spa):')}
                </h4>
                <p className="text-xs text-[#526356] mb-4">
                  {t('tz.48', 'Природные тона шалфея, песка и теплого льна создают ощущение душевного покоя, тепла и безопасности.')}
                </p>

                <div className="space-y-3">
                  {TZ_SPECIFICATION.colorPalette.map((col, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-white border border-[#E2DAD0] flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-xl shadow-inner border border-black/10 shrink-0"
                          style={{ backgroundColor: col.hex }}
                        />
                        <div>
                          <div className="font-bold text-xs text-[#182B1F]">{col.name}</div>
                          <div className="text-[11px] text-[#55675B]">{col.role}</div>
                          <div className="text-[10px] text-[#788A7D] italic mt-0.5">{col.tone}</div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleCopy(`hex-${idx}`, col.hex)}
                        className="px-2.5 py-1 text-xs font-mono font-semibold bg-[#F5F1EB] hover:bg-[#EAE4DB] text-[#182B1F] rounded-md border border-[#D5CDC1] transition-colors"
                      >
                        {copiedId === `hex-${idx}` ? t('tz.49', 'Скопирован!') : col.hex}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Photo Recommendations */}
          {activeTab === 'photos' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-display font-bold text-base text-[#182B1F] mb-1">
                  {t('tz.50', 'Техническое задание для фотосессии домашнего кабинета:')}
                </h4>
                <p className="text-xs text-[#526356] mb-4">
                  {t('tz.51', 'Фотографии должны показывать безупречную чистоту, уют и профессиональное оснащение комнаты, чтобы снять любые сомнения у новых клиентов.')}
                </p>
              </div>

              <div className="space-y-3">
                {TZ_SPECIFICATION.photoGuide.map((photo, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white border border-[#E2DAD0] space-y-1">
                    <div className="font-bold text-xs text-[#466352] flex items-center gap-2">
                      <Camera className="w-3.5 h-3.5" />
                      <span>{t('tz.52', 'Кадр')}{' '}{i + 1}: {photo.shot}</span>
                    </div>
                    <p className="text-xs text-[#3E4F43] leading-relaxed">
                      {photo.recommendation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Local SEO & Bezhetsk Promotion */}
          {activeTab === 'seo' && (
            <div className="space-y-5">
              <div>
                <h4 className="font-display font-bold text-base text-[#182B1F] mb-1">
                  {t('tz.53', 'Продвижение домашнего кабинета в Бежецке:')}
                </h4>
                <p className="text-xs text-[#526356]">
                  {t('tz.54', 'Локальные каналы привлечения клиентов в Бежецке:')}
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-white border border-[#E2DAD0] text-xs space-y-1">
                  <div className="font-bold text-[#182B1F]">{t('tz.55', '1. Яндекс Карты / Яндекс Бизнес')}</div>
                  <p className="text-[#506255]">
                    {t('tz.56', 'Точка «Кабинет массажа Анары Муратовой» на ул. Мира. Фотографии чистого кабинета, дипломов и чайной зоны.')}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#E2DAD0] text-xs space-y-1">
                  <div className="font-bold text-[#182B1F]">{t('tz.57', '2. Авито Бежецк (Услуги)')}</div>
                  <p className="text-[#506255]">
                    {t('tz.58', 'Объявление: «Массаж в уютном домашнем кабинете на ул. Мира». Акцент на медицинском дипломе, подогреве стола, отсутствии очередей и доступных ценах без салонных наценок.')}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#E2DAD0] text-xs space-y-1">
                  <div className="font-bold text-[#182B1F]">{t('tz.59', '3. ВКонтакте (Сообщества Бежецка)')}</div>
                  <p className="text-[#506255]">
                    {t('tz.60', 'Публикации в группах «Подслушано Бежецк», «Бежецк Инфо» с отзывами реальных жителей и фото интерьера.')}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#E2DAD0] text-xs space-y-2">
                  <div className="font-bold text-[#182B1F]">{t('tz.61', 'Семантическое ядро (поисковые запросы):')}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {TZ_SPECIFICATION.seoKeywordsBezhetsk.map((kw, i) => (
                      <span key={i} className="text-[11px] bg-[#F5F1EB] text-[#34463A] px-2.5 py-1 rounded-md border border-[#E0D8CC]">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-[#FAF8F5] border-t border-[#E8E2D8] flex items-center justify-between">
          <div className="text-xs text-[#637669]">
            {t('tz.62', 'Готово к передаче веб-мастеру, дизайнеру и фотографу')}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#466352] hover:bg-[#385142] rounded-lg transition-colors"
          >
            {t('tz.63', 'Закрыть ТЗ')}
          </button>
        </div>

      </div>
    </div>
  );
};
