import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CheckCircle, ExternalLink, History, Loader2, LockKeyhole, LogOut, Save } from 'lucide-react';
import { DataKey, DEFAULT_DATA, emptyContent, resolveData, SiteContent } from '../content/merge';
import { adminApi, errorText, getSavedPassword, HistoryVersion, savePassword, UnauthorizedError } from './api';
import { TextsEditor } from './TextsEditor';
import { DataEditor } from './DataEditor';
import { PhotosEditor } from './PhotosEditor';

type Tab = 'texts' | 'photos' | DataKey | 'history';

const DATA_TABS: { id: DataKey; label: string; description: string }[] = [
  { id: 'services', label: 'Услуги и цены', description: 'Виды массажа, описания, длительность и цены. Порядок здесь = порядок на сайте.' },
  { id: 'master', label: 'Мастер и контакты', description: 'Имя, телефон, WhatsApp, Telegram, график, дипломы и оснащение кабинета.' },
  { id: 'reviews', label: 'Отзывы', description: 'Отзывы клиентов в блоке «Отзывы жителей Бежецка».' },
  { id: 'faq', label: 'Вопросы и ответы', description: 'Блок «Частые вопросы».' },
  { id: 'location', label: 'Адрес и карта', description: 'Адрес, метка на карте, парковка и транспорт.' },
  { id: 'tz', label: 'ТЗ', description: 'Содержимое окна «ТЗ и тексты» (техническое задание сайта).' },
];

const TABS: { id: Tab; label: string }[] = [
  { id: 'texts', label: 'Тексты' },
  { id: 'photos', label: 'Фото' },
  ...DATA_TABS.map(({ id, label }) => ({ id, label })),
  { id: 'history', label: 'История' },
];

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });

const LoginScreen: React.FC<{ onLogin: (password: string) => void }> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await adminApi.login(password);
      onLogin(password);
    } catch (err) {
      setError(err instanceof UnauthorizedError ? 'Неверный пароль.' : errorText(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#FAF8F5]">
      <form onSubmit={submit} className="w-full max-w-sm p-6 rounded-3xl bg-white border border-[#E3DCD2] shadow-xl space-y-4">
        <div className="w-12 h-12 rounded-full bg-[#466352] text-white flex items-center justify-center">
          <LockKeyhole className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold text-[#182B1F]">Админ-панель</h1>
          <p className="text-xs text-[#5C6E61] mt-1">Введите пароль, чтобы менять тексты и фото сайта.</p>
        </div>
        <input
          type="password"
          value={password}
          autoFocus
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
          className="w-full text-sm p-3 rounded-xl border border-[#D5CDC2] focus:outline-hidden focus:ring-2 focus:ring-[#466352]"
        />
        {error && <p className="text-xs text-[#A34236]">{error}</p>}
        <button
          type="submit"
          disabled={!password || loading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#466352] hover:bg-[#385142] text-white text-sm font-semibold disabled:opacity-50"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Войти
        </button>
        <a href="/" className="block text-center text-xs text-[#5C6E61] hover:text-[#182B1F] underline">
          Вернуться на сайт
        </a>
      </form>
    </div>
  );
};

const HistoryTab: React.FC<{
  password: string;
  isDirty: boolean;
  onRestored: (content: SiteContent) => void;
  onUnauthorized: () => void;
}> = ({ password, isDirty, onRestored, onUnauthorized }) => {
  const [versions, setVersions] = useState<HistoryVersion[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    adminApi
      .getHistory(password)
      .then(setVersions)
      .catch((e) => (e instanceof UnauthorizedError ? onUnauthorized() : setError(errorText(e))));
  }, [password, onUnauthorized]);

  useEffect(load, [load]);

  const restore = async (version: HistoryVersion) => {
    const warning = isDirty ? '\n\nНесохранённые изменения пропадут.' : '';
    if (!window.confirm(`Вернуть сайт к версии от ${formatDate(version.uploadedAt)}?${warning}`)) return;
    setBusy(version.pathname);
    setError(null);
    try {
      onRestored(await adminApi.restore(password, version.pathname));
      load();
    } catch (e) {
      if (e instanceof UnauthorizedError) onUnauthorized();
      else setError(errorText(e));
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-[#5C6E61]">
        Каждое сохранение запоминается (последние 30). Если что-то пошло не так — верните сайт к прошлой версии.
      </p>
      {error && <div className="p-3 rounded-xl bg-[#FDF3F2] border border-[#F2D3CF] text-xs text-[#7A2E26]">{error}</div>}
      {versions === null && !error && <Loader2 className="w-5 h-5 animate-spin text-[#466352]" />}
      {versions?.length === 0 && <p className="text-sm text-[#5C6E61]">Сохранений пока не было.</p>}
      {versions?.map((version, index) => (
        <div key={version.pathname} className="flex items-center justify-between gap-3 p-3 rounded-xl border border-[#E3DCD2] bg-white">
          <span className="text-sm text-[#182B1F]">
            {formatDate(version.uploadedAt)}
            {index === 0 && <span className="ml-2 text-xs text-[#466352] font-semibold">сейчас на сайте</span>}
          </span>
          {index > 0 && (
            <button
              type="button"
              disabled={!!busy}
              onClick={() => restore(version)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D5CDC2] text-xs font-semibold text-[#38483D] hover:bg-[#EDE7DE] disabled:opacity-50"
            >
              {busy === version.pathname ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <History className="w-3.5 h-3.5" />}
              Вернуть
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export const AdminPanel: React.FC = () => {
  const [password, setPassword] = useState(getSavedPassword);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [savedJson, setSavedJson] = useState('');
  const [tab, setTab] = useState<Tab>('texts');
  const [status, setStatus] = useState<{ type: 'saving' | 'saved' | 'error'; text?: string } | null>(null);

  const logout = useCallback(() => {
    savePassword(null);
    setPassword('');
    setContent(null);
  }, []);

  const loadContent = useCallback(
    (pwd: string) => {
      adminApi
        .getContent(pwd)
        .then((c) => {
          setContent(c);
          setSavedJson(JSON.stringify(c));
        })
        .catch((e) => {
          if (e instanceof UnauthorizedError) logout();
          else {
            setContent(emptyContent());
            setStatus({ type: 'error', text: errorText(e) });
          }
        });
    },
    [logout]
  );

  useEffect(() => {
    document.title = 'Админ-панель';
    if (password) loadContent(password);
  }, [password, loadContent]);

  const isDirty = content !== null && JSON.stringify(content) !== savedJson;

  useEffect(() => {
    if (!isDirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [isDirty]);

  const resolved = useMemo(() => (content ? resolveData(content.data) : null), [content]);

  if (!password) {
    return (
      <LoginScreen
        onLogin={(pwd) => {
          savePassword(pwd);
          setPassword(pwd);
        }}
      />
    );
  }

  if (!content || !resolved) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <Loader2 className="w-6 h-6 animate-spin text-[#466352]" />
      </div>
    );
  }

  const update = (patch: Partial<SiteContent>) => {
    setContent({ ...content, ...patch });
    setStatus(null);
  };

  const save = async () => {
    setStatus({ type: 'saving' });
    try {
      const saved = await adminApi.saveContent(password, content);
      setContent(saved);
      setSavedJson(JSON.stringify(saved));
      setStatus({ type: 'saved' });
    } catch (e) {
      if (e instanceof UnauthorizedError) logout();
      else setStatus({ type: 'error', text: errorText(e) });
    }
  };

  const dataTab = DATA_TABS.find((d) => d.id === tab);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#242A26]">
      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8E2D8]">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="font-display font-bold text-xl text-[#182B1F] leading-tight">Админ-панель</h1>
            <p className="text-[11px] text-[#5C6E61] truncate">
              {status?.type === 'saved'
                ? 'Сохранено. На сайте — через несколько секунд.'
                : isDirty
                  ? 'Есть несохранённые изменения'
                  : content.updatedAt
                    ? `Сохранено ${formatDate(content.updatedAt)}`
                    : 'Изменений пока нет'}
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#38483D] hover:bg-[#EDE7DE]"
            >
              <ExternalLink className="w-4 h-4" />
              Сайт
            </a>
            <button
              type="button"
              onClick={() => {
                if (!isDirty || window.confirm('Выйти без сохранения? Изменения пропадут.')) logout();
              }}
              className="p-2 rounded-lg text-[#5C6E61] hover:bg-[#EDE7DE]"
              aria-label="Выйти"
              title="Выйти"
            >
              <LogOut className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={save}
              disabled={!isDirty || status?.type === 'saving'}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#466352] hover:bg-[#385142] text-white text-xs font-semibold shadow-sm disabled:opacity-40"
            >
              {status?.type === 'saving' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : status?.type === 'saved' && !isDirty ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Сохранить
            </button>
          </div>
        </div>

        {/* Tabs */}
        <nav className="max-w-5xl mx-auto px-4 pb-2 flex gap-1.5 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                tab === t.id ? 'bg-[#466352] text-white' : 'text-[#38483D] hover:bg-[#EDE7DE]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-5 pb-24">
        {status?.type === 'error' && (
          <div className="mb-4 p-3 rounded-xl bg-[#FDF3F2] border border-[#F2D3CF] text-xs text-[#7A2E26]">{status.text}</div>
        )}

        {tab === 'texts' && <TextsEditor texts={content.texts} onChange={(texts) => update({ texts })} />}

        {tab === 'photos' && (
          <PhotosEditor
            images={content.images}
            password={password}
            onChange={(images) => update({ images })}
            onUnauthorized={logout}
          />
        )}

        {dataTab && (
          <DataEditor
            key={dataTab.id}
            dataKey={dataTab.id}
            description={dataTab.description}
            value={resolved[dataTab.id]}
            isChanged={dataTab.id in content.data}
            onChange={(value) => {
              const data = { ...content.data };
              // Matching the default again means "not changed"
              if (JSON.stringify(value) === JSON.stringify(DEFAULT_DATA[dataTab.id])) delete data[dataTab.id];
              else data[dataTab.id] = value;
              update({ data });
            }}
            onReset={() => {
              const data = { ...content.data };
              delete data[dataTab.id];
              update({ data });
            }}
          />
        )}

        {tab === 'history' && (
          <HistoryTab
            password={password}
            isDirty={isDirty}
            onUnauthorized={logout}
            onRestored={(restored) => {
              setContent(restored);
              setSavedJson(JSON.stringify(restored));
              setStatus({ type: 'saved' });
            }}
          />
        )}
      </main>
    </div>
  );
};
