import React, { useMemo, useState } from 'react';
import { ChevronDown, RotateCcw, Search } from 'lucide-react';
import { TEXT_SECTIONS, TextEntry } from './textRegistry';

interface TextsEditorProps {
  texts: Record<string, string>;
  onChange: (texts: Record<string, string>) => void;
}

const rowsFor = (text: string) => Math.min(18, Math.max(1, Math.ceil(text.length / 70) + (text.match(/\n/g)?.length ?? 0)));

const TextField: React.FC<{
  entry: TextEntry;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
}> = ({ entry, value, onChange }) => {
  const isChanged = value !== undefined;
  const current = value ?? entry.defaultText;
  return (
    <div className={`p-3 rounded-xl border ${isChanged ? 'border-[#9DB8A6] bg-[#F3F8F4]' : 'border-[#E6E0D6] bg-white'}`}>
      <textarea
        value={current}
        rows={rowsFor(current)}
        // Storing only differences keeps future default edits in the code visible on the site
        onChange={(e) => onChange(e.target.value === entry.defaultText ? undefined : e.target.value)}
        className="w-full text-sm p-2 rounded-lg border border-[#D5CDC2] bg-white focus:outline-hidden focus:ring-2 focus:ring-[#466352] resize-y"
      />
      {isChanged && (
        <div className="mt-2 flex flex-col sm:flex-row sm:items-start justify-between gap-2 text-xs text-[#5C6E61]">
          <span className="whitespace-pre-wrap">
            <span className="font-semibold">Было: </span>
            {entry.defaultText}
          </span>
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="shrink-0 inline-flex items-center gap-1 font-semibold text-[#466352] hover:text-[#182B1F]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Вернуть как было
          </button>
        </div>
      )}
    </div>
  );
};

export const TextsEditor: React.FC<TextsEditorProps> = ({ texts, onChange }) => {
  const [query, setQuery] = useState('');
  const [openSections, setOpenSections] = useState<string[]>([]);

  const normalizedQuery = query.trim().toLowerCase();
  const sections = useMemo(() => {
    if (!normalizedQuery) return TEXT_SECTIONS;
    return TEXT_SECTIONS.map((section) => ({
      ...section,
      entries: section.entries.filter((e) =>
        `${e.defaultText} ${texts[e.key] ?? ''}`.toLowerCase().includes(normalizedQuery)
      ),
    })).filter((section) => section.entries.length > 0);
  }, [normalizedQuery, texts]);

  const setText = (key: string, value: string | undefined) => {
    const next = { ...texts };
    if (value === undefined) delete next[key];
    else next[key] = value;
    onChange(next);
  };

  const toggle = (id: string) =>
    setOpenSections((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#738377]" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Найти текст на сайте, например «стаж» или «900 ₽»"
          className="w-full text-sm pl-9 pr-3 py-2.5 rounded-xl border border-[#D5CDC2] bg-white focus:outline-hidden focus:ring-2 focus:ring-[#466352]"
        />
      </div>

      <p className="text-xs text-[#5C6E61]">
        Здесь все надписи сайта по разделам, сверху вниз. Цены, услуги, отзывы, вопросы и контакты меняются на своих вкладках.
      </p>

      {sections.length === 0 && <p className="text-sm text-[#5C6E61]">Ничего не найдено.</p>}

      {sections.map((section) => {
        const isOpen = !!normalizedQuery || openSections.includes(section.id);
        const changedCount = section.entries.filter((e) => e.key in texts).length;
        return (
          <section key={section.id} className="rounded-2xl border border-[#E3DCD2] bg-[#FBFAF7]">
            <button
              type="button"
              onClick={() => toggle(section.id)}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left"
            >
              <span className="font-semibold text-sm text-[#182B1F]">
                {section.label}
                <span className="ml-2 text-xs font-normal text-[#738377]">
                  {section.entries.length} {changedCount > 0 && `· изменено ${changedCount}`}
                </span>
              </span>
              <ChevronDown className={`w-4 h-4 text-[#738377] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
              <div className="px-3 pb-3 space-y-2">
                {section.entries.map((entry) => (
                  <TextField
                    key={entry.key}
                    entry={entry}
                    value={texts[entry.key]}
                    onChange={(value) => setText(entry.key, value)}
                  />
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
};
