import React, { useEffect, useState } from 'react';
import { BellRing, Loader2, Send } from 'lucide-react';
import { adminApi, errorText, UnauthorizedError } from './api';

interface TelegramSettingsProps {
  token: string;
  onUnauthorized: () => void;
}

type Status = { tokenConfigured: boolean; chatTitle: string | null };

export const TelegramSettings: React.FC<TelegramSettingsProps> = ({ token, onUnauthorized }) => {
  const [status, setStatus] = useState<Status | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    adminApi
      .getTelegram(token)
      .then(setStatus)
      .catch((e) => (e instanceof UnauthorizedError ? onUnauthorized() : setMessage({ ok: false, text: errorText(e) })));
  }, [token, onUnauthorized]);

  const run = async (action: 'connect' | 'test' | 'disconnect') => {
    if (action === 'disconnect' && !window.confirm('Отключить уведомления о новых отзывах?')) return;
    setBusy(true);
    setMessage(null);
    try {
      const result = await adminApi.telegramAction(token, action);
      if (action === 'connect') {
        setStatus({ tokenConfigured: true, chatTitle: result.chatTitle ?? null });
        setMessage({ ok: true, text: 'Готово! В Telegram пришло сообщение о подключении.' });
      } else if (action === 'test') {
        setMessage({ ok: true, text: 'Тестовое сообщение отправлено — проверьте Telegram.' });
      } else {
        setStatus({ tokenConfigured: true, chatTitle: null });
      }
    } catch (e) {
      if (e instanceof UnauthorizedError) onUnauthorized();
      else setMessage({ ok: false, text: errorText(e) });
    } finally {
      setBusy(false);
    }
  };

  const button =
    'inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold disabled:opacity-40';

  return (
    <div className="p-4 rounded-2xl border border-[#CADEEA] bg-[#F3F8FB] space-y-3">
      <div className="flex items-center gap-2">
        <BellRing className="w-4 h-4 text-[#2AABEE]" />
        <h3 className="font-semibold text-sm text-[#182B1F]">Уведомления в Telegram</h3>
      </div>

      {status === null && !message && <Loader2 className="w-4 h-4 animate-spin text-[#466352]" />}

      {status && !status.tokenConfigured && (
        <p className="text-xs text-[#5C6E61]">Бот ещё не настроен: в Vercel нет токена TELEGRAM_BOT_TOKEN.</p>
      )}

      {status?.tokenConfigured && status.chatTitle && (
        <div className="space-y-2">
          <p className="text-xs text-[#38483D]">
            Новые отзывы приходят в чат: <b>{status.chatTitle}</b>
          </p>
          <div className="flex flex-wrap gap-2">
            <button type="button" disabled={busy} onClick={() => run('test')} className={`${button} bg-[#2AABEE] hover:bg-[#2297D4] text-white`}>
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Отправить тест
            </button>
            <button type="button" disabled={busy} onClick={() => run('connect')} className={`${button} text-[#38483D] hover:bg-[#E4EEF4]`}>
              Подключить другой чат
            </button>
            <button type="button" disabled={busy} onClick={() => run('disconnect')} className={`${button} text-[#A34236] hover:bg-[#FBEAE7]`}>
              Отключить
            </button>
          </div>
        </div>
      )}

      {status?.tokenConfigured && !status.chatTitle && (
        <div className="space-y-2">
          <ol className="text-xs text-[#38483D] list-decimal pl-4 space-y-0.5">
            <li>Откройте вашего бота в Telegram и нажмите «Старт» (или напишите ему любое сообщение).</li>
            <li>Сразу после этого нажмите кнопку ниже.</li>
          </ol>
          <button type="button" disabled={busy} onClick={() => run('connect')} className={`${button} bg-[#2AABEE] hover:bg-[#2297D4] text-white`}>
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Подключить Telegram
          </button>
        </div>
      )}

      {message && <p className={`text-xs ${message.ok ? 'text-[#245232]' : 'text-[#A34236]'}`}>{message.text}</p>}
    </div>
  );
};
