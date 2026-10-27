import React from 'react';
import { ArrowDown, ArrowUp, ChevronDown, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { DataKey } from '../content/merge';

const FIELD_LABELS: Record<string, string> = {
  name: 'Имя',
  role: 'Описание / роль',
  experienceYears: 'Стаж (лет)',
  city: 'Город',
  cabinetAddress: 'Адрес кабинета',
  phone: 'Телефон для звонка (только + и цифры, например +79301811886)',
  phoneDisplay: 'Телефон, как показывать на сайте',
  whatsappUrl: 'Ссылка WhatsApp (https://wa.me/7…)',
  telegramUrl: 'Ссылка Telegram (https://t.me/…)',
  telegramUser: 'Ник в Telegram',
  schedule: 'График работы',
  diplomas: 'Дипломы и курсы',
  title: 'Название',
  issuer: 'Где получен',
  year: 'Год',
  cabinetFeatures: 'Оснащение кабинета',
  subtitle: 'Подзаголовок',
  category: 'Категория',
  description: 'Описание',
  benefits: 'Чем помогает',
  durations: 'Длительность и цены',
  minutes: 'Минут',
  price: 'Цена, ₽',
  popular: 'Отметить как популярный',
  indication: 'Кому подходит',
  recommendedCourse: 'Рекомендуемый курс',
  age: 'Возраст',
  location: 'Район / улица',
  tag: 'Метка (тема отзыва)',
  text: 'Текст отзыва',
  service: 'Какая услуга',
  date: 'Дата',
  rating: 'Оценка (1–5)',
  verified: 'Проверенный клиент',
  question: 'Вопрос',
  answer: 'Ответ',
  address: 'Адрес',
  mapQuery: 'Адрес для карты (как искать в Яндекс Картах)',
  landmarks: 'Ориентиры',
  parking: 'Парковка',
  transport: 'Общественный транспорт',
  conveniences: 'Удобства',
  projectTitle: 'Название проекта',
  client: 'Заказчик',
  goal: 'Цель',
  targetAudience: 'Целевая аудитория',
  keyUsp: 'Главные преимущества',
  colorPalette: 'Цвета',
  hex: 'Код цвета',
  tone: 'Настроение',
  photoGuide: 'Советы для фото',
  shot: 'Кадр',
  recommendation: 'Рекомендация',
  seoKeywordsBezhetsk: 'Ключевые слова для поиска',
};

const FIELD_OPTIONS: Record<string, Record<string, string>> = {
  'services.category': { therapeutic: 'Лечебный', relax: 'Релакс', special: 'Специальный', express: 'Экспресс' },
  'faq.category': { hygiene: 'Гигиена', space: 'Кабинет', health: 'Здоровье', organization: 'Запись и оплата' },
};

// Components rely on at least one service and one duration per service
const NON_EMPTY_LISTS = new Set(['services', 'services.durations']);
const HIDDEN_FIELDS = new Set(['id']);

const inputClass =
  'w-full text-sm p-2 rounded-lg border border-[#D5CDC2] bg-white focus:outline-hidden focus:ring-2 focus:ring-[#466352]';

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

const isObject = (v: Json): v is { [key: string]: Json } => typeof v === 'object' && v !== null && !Array.isArray(v);

// New list item: same shape as the first one, texts emptied, nested lists reset
const blankFrom = (sample: Json, idPrefix: string): Json => {
  if (typeof sample === 'string') return '';
  if (Array.isArray(sample)) return isObject(sample[0] ?? null) ? [blankFrom(sample[0], idPrefix)] : [];
  if (isObject(sample)) {
    const result: { [key: string]: Json } = {};
    for (const [key, value] of Object.entries(sample)) {
      result[key] = key === 'id' ? `${idPrefix}-${Date.now().toString(36)}` : blankFrom(value, idPrefix);
    }
    return result;
  }
  return sample;
};

const itemTitle = (item: Json, index: number) => {
  if (isObject(item)) {
    const title = item.title ?? item.name ?? item.question ?? item.shot ?? item.minutes;
    if (title !== undefined && title !== '') return `${index + 1}. ${item.minutes !== undefined && !item.title ? `${title} мин` : title}`;
  }
  return `№ ${index + 1}`;
};

interface ValueEditorProps {
  value: Json;
  onChange: (value: Json) => void;
  path: string; // field names without indices, e.g. "services.durations"
}

const ValueEditor: React.FC<ValueEditorProps> = ({ value, onChange, path }) => {
  const field = path.split('.').pop() ?? '';
  const options = FIELD_OPTIONS[path];

  if (options && typeof value === 'string') {
    return (
      <select value={value} onChange={(e) => onChange(e.target.value)} className={inputClass}>
        {Object.entries(options).map(([v, label]) => (
          <option key={v} value={v}>
            {label}
          </option>
        ))}
      </select>
    );
  }

  if (typeof value === 'string') {
    const long = value.length > 70 || value.includes('\n') || ['description', 'text', 'answer', 'goal', 'recommendation'].includes(field);
    return long ? (
      <textarea
        value={value}
        rows={Math.min(10, Math.max(2, Math.ceil(value.length / 70)))}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} resize-y`}
      />
    ) : (
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={inputClass} />
    );
  }

  if (typeof value === 'number') {
    return (
      <input
        type="number"
        value={Number.isFinite(value) ? value : ''}
        onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))}
        className={`${inputClass} max-w-40`}
      />
    );
  }

  if (typeof value === 'boolean') {
    return (
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        className="w-5 h-5 accent-[#466352]"
      />
    );
  }

  if (Array.isArray(value)) {
    const objectItems = value.length > 0 ? isObject(value[0]) : false;
    const minItems = NON_EMPTY_LISTS.has(path) ? 1 : 0;
    const update = (index: number, item: Json) => onChange(value.map((v, i) => (i === index ? item : v)));
    const remove = (index: number) => onChange(value.filter((_, i) => i !== index));
    const move = (index: number, delta: number) => {
      const next = [...value];
      [next[index], next[index + delta]] = [next[index + delta], next[index]];
      onChange(next);
    };
    const add = () => onChange([...value, value.length > 0 ? blankFrom(value[0], field || 'item') : '']);

    const controls = (index: number) => (
      // preventDefault: these buttons sit inside <summary>, a click must not fold the card
      <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.preventDefault()}>
        <button type="button" disabled={index === 0} onClick={() => move(index, -1)} className="p-1.5 rounded-md text-[#5C6E61] hover:bg-[#ECE6DC] disabled:opacity-30" aria-label="Выше">
          <ArrowUp className="w-4 h-4" />
        </button>
        <button type="button" disabled={index === value.length - 1} onClick={() => move(index, 1)} className="p-1.5 rounded-md text-[#5C6E61] hover:bg-[#ECE6DC] disabled:opacity-30" aria-label="Ниже">
          <ArrowDown className="w-4 h-4" />
        </button>
        <button
          type="button"
          disabled={value.length <= minItems}
          onClick={() => {
            if (!objectItems || window.confirm('Удалить этот пункт?')) remove(index);
          }}
          className="p-1.5 rounded-md text-[#A34236] hover:bg-[#FBEAE7] disabled:opacity-30"
          aria-label="Удалить"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    );

    return (
      <div className="space-y-2">
        {value.map((item, index) =>
          objectItems ? (
            <details key={index} className="rounded-xl border border-[#E3DCD2] bg-[#FBFAF7]" open={value.length === 1}>
              <summary className="flex items-center justify-between gap-2 px-3 py-2 cursor-pointer list-none">
                <span className="flex items-center gap-2 text-sm font-semibold text-[#182B1F] min-w-0">
                  <ChevronDown className="w-4 h-4 text-[#738377] shrink-0" />
                  <span className="truncate">{itemTitle(item, index)}</span>
                </span>
                {controls(index)}
              </summary>
              <div className="px-3 pb-3">
                <ValueEditor value={item} onChange={(v) => update(index, v)} path={path} />
              </div>
            </details>
          ) : (
            <div key={index} className="flex items-start gap-2">
              <div className="flex-1">
                <ValueEditor value={item} onChange={(v) => update(index, v)} path={path} />
              </div>
              {controls(index)}
            </div>
          )
        )}
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-[#9DB8A6] text-xs font-semibold text-[#466352] hover:bg-[#F3F8F4]"
        >
          <Plus className="w-3.5 h-3.5" />
          Добавить
        </button>
      </div>
    );
  }

  if (isObject(value)) {
    return (
      <div className="space-y-3">
        {Object.entries(value)
          .filter(([key]) => !HIDDEN_FIELDS.has(key))
          .map(([key, fieldValue]) => {
            // <label> only around a single input: around a list it would forward
            // clicks to the list's first button (move/delete)
            const Wrapper = typeof fieldValue === 'object' && fieldValue !== null ? 'div' : 'label';
            return (
              <Wrapper key={key} className={`block ${typeof fieldValue === 'boolean' ? 'flex items-center gap-2' : ''}`}>
                <span className="block text-xs font-semibold text-[#46574C] mb-1">{FIELD_LABELS[key] ?? key}</span>
                <ValueEditor
                  value={fieldValue}
                  onChange={(v) => onChange({ ...value, [key]: v })}
                  path={path ? `${path}.${key}` : key}
                />
              </Wrapper>
            );
          })}
      </div>
    );
  }

  return null;
};

interface DataEditorProps {
  dataKey: DataKey;
  value: unknown;
  isChanged: boolean;
  description: string;
  onChange: (value: unknown) => void;
  onReset: () => void;
}

export const DataEditor: React.FC<DataEditorProps> = ({ dataKey, value, isChanged, description, onChange, onReset }) => (
  <div className="space-y-4">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
      <p className="text-xs text-[#5C6E61]">{description}</p>
      {isChanged && (
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Вернуть весь раздел к исходному варианту? Ваши изменения в нём пропадут.')) onReset();
          }}
          className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-[#466352] hover:text-[#182B1F]"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Вернуть раздел как было
        </button>
      )}
    </div>
    <ValueEditor value={value as Json} onChange={onChange} path={dataKey === 'master' || dataKey === 'location' || dataKey === 'tz' ? '' : dataKey} />
  </div>
);
