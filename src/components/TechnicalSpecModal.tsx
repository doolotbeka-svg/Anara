import React, { useState } from 'react';
import { X, Copy, Check, FileText, Palette, Camera, Search, Layers } from 'lucide-react';
import { TZ_SPECIFICATION, MASTER_INFO, SERVICES } from '../data/massageData';

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
    return `# ТЕХНИЧЕСКОЕ ЗАДАНИЕ (ТЗ) НА РАЗРАБОТКУ САЙТА-ЛЕНДИНГА
## Проект: Частный массаж на дому у мастера в г. Бежецк (Тверская область)

### 1. ОБЩИЕ СВЕДЕНИЯ И ЦЕЛИ ПРОЕКТА
- **Тип сайта:** Одностраничный продающий сайт (Landing Page) с мобильной адаптивностью.
- **Специалист:** Анара Муратова, дипломированный мастер (стаж 2 года).
- **Телефон:** +7 (930) 181-18-86.
- **Основная услуга:** Профессиональный лечебный, классический и расслабляющий массаж в оборудованном домашнем кабинете мастера (г. Бежецк, ул. Мира, д. 2/50).
- **Формат приема:** Отдельная изолированная спа-комната дома у мастера со стационарным анатомическим столом, подогревом простыни, ароматерапией, музыкой и чайной зоной.
- **Географическая привязка:** Город Бежецк, ул. Мира, д. 2/50. Удобный подъезд, бесплатная парковка, тихий двор.
- **Целевая аудитория:** Женщины и мужчины 25–65 лет, офисные сотрудники (боли в спине и шее), молодые мамы (отдых от быта в тишине), пожилые люди (артрозы, скованность), спортсмены.
- **Ключевые боли клиента:** Салонный конвейер и шум; высокие наценки за коммерческую аренду; нежелание убираться в своей квартире для выездного массажиста; страх непрофессионализма.
- **Главные УТП:** Оборудованный домашний кабинет с анатомическим столом; 100% стерильность; цены на 25–40% доступнее салонных; чайная зона и отдых без спешки; 2 года практики и базовое медицинское образование.
- **Целевые действия (CTA):** Запись через WhatsApp, Telegram или телефонный звонок.

---

### 2. СТРУКТУРА СТРАНИЦЫ (ПО БЛОКАМ)
1. **Первый экран (Hero):**
   - УТП: Профессиональный массаж на дому у мастера в Бежецке. Сниму боль в спине и усталость в уютном кабинете.
   - Подзаголовок: Оборудованный тихий спа-кабинет в домашней обстановке без салонного шума и наценок. Стационарный анатомический стол, натуральные масла, 100% стерильность и горячий травяной чай с медом.
   - Кнопки: «Записаться в WhatsApp / Telegram», «Виды массажа и цены».
   - Буллеты: Бежецк (ул. Мира 2/50, парковка), один клиент на приеме, дипломированный специалист (стаж 2 года).

2. **Блок «О мастере и кабинете»:**
   - Мастер: Анара Муратова, стаж 2 года.
   - Образование: Тверской медицинский колледж, Институт восстановительной медицины.
   - 4 преимущества домашнего кабинета мастера (почему это лучше салона и удобнее, чем массаж у клиента).

3. **Блок «Виды массажа и прайс-лист»:**
   - Прайс с переключателем длительности (30/45/60/75/90 мин).
   - Скидка 10% на абонемент от 5 сеансов + подарок.

4. **Интерактивный помощник «Что вас беспокоит?»:**
   - Экспресс-выбор симптома (поясница, шея, стресс, отеки) и мгновенный расчет программы.

5. **Блок «Как проходит сеанс» (снятие возражений):**
   - Шаг 1: Заявка в мессенджер и согласование времени.
   - Шаг 2: Приезд в уютный кабинет на Кашинской (парковка у дома, свежий воздух, чистота).
   - Шаг 3: Сеанс массажа на анатомическом столе с подогревом.
   - Шаг 4: Отдых в чайной зоне с чашкой травяного сбора с медом.
   - Памятка: что взять с собой (ничего, в кабинете всё готово).

6. **Блок «Отзывы клиентов из Бежецка»:**
   - Реальные отзывы жителей города о посещении домашнего кабинета на Кашинской.

7. **Блок «Частые вопросы (FAQ)»:**
   - 7 подробных ответов (где находится, нужно ли что-то брать, нет ли посторонних, прием мужчин, противопоказания).

8. **Локация кабинета и транспортная доступность:**
   - Бежецк, ул. Кашинская, ориентиры, время в пути из районов города.

9. **Футер:**
   - Контакты, время приема (09:00 - 21:00), статус самозанятого (чеки).

---

### 3. РЕКОМЕНДУЕМАЯ ЦВЕТОВАЯ ГАММА
- Шалфейный зеленый (#466352) — акцентные кнопки, маркеры доверия, природа, здоровье.
- Теплый лен (#FAF8F5) — основной фон (60%), домашний уют без холодной резкости.
- Песочно-минеральный (#EBE6DE) — поверхности карточек (30%), спа-эстетика.
- Хвойный глубокий (#1D3325) — солидные контрастные заголовки.
- Мягкий графит (#242A26) — комфортный текст для глаз.

---

### 4. ТРЕБОВАНИЯ К ФОТОСЕССИИ (ТЗ ДЛЯ ФОТОГРАФА)
1. Портрет мастера: в чистой оливково-шалфейной форме, с теплой улыбкой, ухоженными руками.
2. Кабинет в целом: стационарный массажный стол, застеленный белоснежной простыней, мягкий свет бра, валики, увлажнитель с паром.
3. Чайный столик: прозрачный чайник с травяным чаем, чашка, баночка меда.
4. Гигиена: запечатанные одноразовые простыни, антисептик, масла.
`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white rounded-3xl shadow-2xl border border-[#DED7CD] overflow-hidden">
        
        {/* Modal Topbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E2D8] bg-[#FAF8F5]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#466352] text-white flex items-center justify-center font-bold text-sm">
              ТЗ
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-[#182B1F]">
                Техническое задание, тексты и брендбук
              </h3>
              <p className="text-[11px] text-[#5D6F63]">
                Массаж на дому у мастера в Бежецке (домашний спа-кабинет)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy('all-tz', getFullMarkdown())}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#182B1F] bg-[#EAE5DC] hover:bg-[#DDD6CA] rounded-lg transition-colors border border-[#D2C9BB]"
            >
              {copiedId === 'all-tz' ? <Check className="w-3.5 h-3.5 text-[#466352]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedId === 'all-tz' ? 'Скопировано!' : 'Копировать всё ТЗ'}</span>
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
            { id: 'tz', label: '1. Паспорт ТЗ', icon: Layers },
            { id: 'texts', label: '2. Тексты по блокам', icon: FileText },
            { id: 'palette', label: '3. Цветовая палитра', icon: Palette },
            { id: 'photos', label: '4. ТЗ для фотографа', icon: Camera },
            { id: 'seo', label: '5. Локальное SEO (Бежецк)', icon: Search },
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
                  Цель проекта
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
                  Целевая аудитория и клиентские боли:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {TZ_SPECIFICATION.targetAudience.map((aud, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-white border border-[#E2DAD0] text-xs space-y-1">
                      <div className="font-bold text-[#466352]">Сегмент {i + 1}</div>
                      <div className="text-[#3F4F44]">{aud}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-display font-bold text-base text-[#182B1F] mb-3">
                  Ключевые УТП и факторы доверия:
                </h4>
                <ul className="space-y-2 text-xs">
                  {TZ_SPECIFICATION.keyUsp.map((usp, i) => (
                    <li key={i} className="p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E9E3D8] flex items-center justify-between">
                      <span>✓ {usp}</span>
                      <button
                        onClick={() => handleCopy(`usp-${i}`, usp)}
                        className="text-[11px] text-[#466352] hover:underline"
                      >
                        {copiedId === `usp-${i}` ? 'Скопировано' : 'Копировать'}
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
                  <span className="font-bold text-xs text-[#466352] uppercase">Блок 1: Первый экран (Hero)</span>
                  <button
                    onClick={() => handleCopy('hero-copy', 'Заголовок: Профессиональный массаж на дому у мастера в Бежецке. Сниму боль в спине и усталость в уютном кабинете.\nПодзаголовок: Оборудованный тихий спа-кабинет в домашней обстановке без салонного шума и наценок. Стационарный анатомический стол, натуральные масла, 100% стерильность и горячий травяной чай с медом.\nCTA: Записаться в WhatsApp / Telegram')}
                    className="text-xs text-[#466352] hover:underline flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedId === 'hero-copy' ? 'Скопировано!' : 'Копировать'}</span>
                  </button>
                </div>
                <div className="text-xs space-y-1 text-[#2B3B30]">
                  <p><strong>Заголовок (H1):</strong> Профессиональный массаж на дому у мастера в Бежецке. Сниму боль в спине и усталость в уютном кабинете.</p>
                  <p><strong>Подзаголовок:</strong> Оборудованный тихий спа-кабинет в домашней обстановке без салонного шума и наценок. Стационарный анатомический стол, натуральные масла, 100% стерильность и горячий травяной чай с медом.</p>
                  <p><strong>Кнопки призыва:</strong> «Записаться в WhatsApp / Telegram», «Виды массажа и цены».</p>
                  <p><strong>Триггеры доверия:</strong> Бежецк (ул. Мира 2/50, парковка), один клиент на приеме, без салонных наценок.</p>
                </div>
              </div>

              {/* About Block Copy */}
              <div className="p-4 rounded-xl bg-white border border-[#E2DAD0] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#466352] uppercase">Блок 2: О мастере и домашнем кабинете</span>
                  <button
                    onClick={() => handleCopy('about-copy', 'Анара Муратова — сертифицированный мастер массажа, стаж 2 года. Прием в домашнем кабинете: г. Бежецк, ул. Мира, д. 2/50, тел. +7 (930) 181-18-86. Преимущества домашнего кабинета: не нужно готовить квартиру к приходу мастера; профессиональный анатомический стол с подогревом; полная тишина и конфиденциальность; горячий травяной чай и отдых без спешки.')}
                    className="text-xs text-[#466352] hover:underline flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedId === 'about-copy' ? 'Скопировано!' : 'Копировать'}</span>
                  </button>
                </div>
                <div className="text-xs space-y-1 text-[#2B3B30]">
                  <p><strong>Мастер:</strong> Анара Муратова (тел. +7 (930) 181-18-86).</p>
                  <p><strong>Адрес кабинета:</strong> г. Бежецк, ул. Мира, д. 2/50.</p>
                  <p><strong>Позиционирование:</strong> Дипломированный специалист с пониманием анатомии, принимающий в уютной домашней спа-комнате.</p>
                  <p><strong>Почему кабинет у мастера лучше:</strong> Клиенту не нужно убирать квартиру, прятать питомцев или двигать мебель. В кабинете уже тепло, чистейшее белье, правильный свет и тишина.</p>
                </div>
              </div>

              {/* Services & Prices */}
              <div className="p-4 rounded-xl bg-white border border-[#E2DAD0] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#466352] uppercase">Блок 3: Услуги и цены</span>
                  <button
                    onClick={() => handleCopy('services-copy', SERVICES.map(s => `${s.title}: ${s.durations.map(d => `${d.minutes} мин — ${d.price} ₽`).join(', ')}`).join('\n'))}
                    className="text-xs text-[#466352] hover:underline flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedId === 'services-copy' ? 'Скопировано!' : 'Копировать весь прайс'}</span>
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
                  <span className="font-bold text-xs text-[#466352] uppercase">Блок 4: Как проходит визит</span>
                  <button
                    onClick={() => handleCopy('process-copy', 'Шаг 1: Заявка в мессенджер и согласование времени.\nШаг 2: Приезд в уютный кабинет на Кашинской (парковка у дома, чистота и тепло).\nШаг 3: Сеанс массажа на анатомическом столе с подогревом.\nШаг 4: Отдых в чайной зоне с чашкой травяного сбора с медом.\nС собой ничего брать не нужно: в кабинете есть одноразовые простыни, тапочки и полотенца.')}
                    className="text-xs text-[#466352] hover:underline flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedId === 'process-copy' ? 'Скопировано!' : 'Копировать'}</span>
                  </button>
                </div>
                <div className="text-xs text-[#2B3B30]">
                  4 шага: Запись → Приезд в кабинет → Сеанс массажа → Отдых с чаем.
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: Color Palette & Brand Book */}
          {activeTab === 'palette' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-display font-bold text-base text-[#182B1F] mb-1">
                  Гармоничная палитра (Wellness & Home Spa):
                </h4>
                <p className="text-xs text-[#526356] mb-4">
                  Природные тона шалфея, песка и теплого льна создают ощущение душевного покоя, тепла и безопасности.
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
                        {copiedId === `hex-${idx}` ? 'Скопирован!' : col.hex}
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
                  Техническое задание для фотосессии домашнего кабинета:
                </h4>
                <p className="text-xs text-[#526356] mb-4">
                  Фотографии должны показывать безупречную чистоту, уют и профессиональное оснащение комнаты, чтобы снять любые сомнения у новых клиентов.
                </p>
              </div>

              <div className="space-y-3">
                {TZ_SPECIFICATION.photoGuide.map((photo, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white border border-[#E2DAD0] space-y-1">
                    <div className="font-bold text-xs text-[#466352] flex items-center gap-2">
                      <Camera className="w-3.5 h-3.5" />
                      <span>Кадр {i + 1}: {photo.shot}</span>
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
                  Продвижение домашнего кабинета в Бежецке:
                </h4>
                <p className="text-xs text-[#526356]">
                  Локальные каналы привлечения клиентов в Бежецке:
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-white border border-[#E2DAD0] text-xs space-y-1">
                  <div className="font-bold text-[#182B1F]">1. Яндекс Карты / Яндекс Бизнес</div>
                  <p className="text-[#506255]">
                    Точка «Кабинет массажа Елены Соколовой» на ул. Кашинская. Фотографии чистого кабинета, дипломов и чайной зоны.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#E2DAD0] text-xs space-y-1">
                  <div className="font-bold text-[#182B1F]">2. Авито Бежецк (Услуги)</div>
                  <p className="text-[#506255]">
                    Объявление: «Массаж в уютном домашнем кабинете на Кашинской». Акцент на медицинском дипломе, подогреве стола, отсутствии очередей и доступных ценах без салонных наценок.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#E2DAD0] text-xs space-y-1">
                  <div className="font-bold text-[#182B1F]">3. ВКонтакте (Сообщества Бежецка)</div>
                  <p className="text-[#506255]">
                    Публикации в группах «Подслушано Бежецк», «Бежецк Инфо» с отзывами реальных жителей и фото интерьера.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-[#E2DAD0] text-xs space-y-2">
                  <div className="font-bold text-[#182B1F]">Семантическое ядро (поисковые запросы):</div>
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
            Готово к передаче веб-мастеру, дизайнеру и фотографу
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#466352] hover:bg-[#385142] rounded-lg transition-colors"
          >
            Закрыть ТЗ
          </button>
        </div>

      </div>
    </div>
  );
};
