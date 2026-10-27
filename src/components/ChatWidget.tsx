import React, { useEffect, useRef, useState } from 'react';
import { Bot, Send, X, Loader2, MessageCircle } from 'lucide-react';
import { MASTER_INFO } from '../data/massageData';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

const GREETING: ChatMessage = {
  role: 'model',
  text: 'Здравствуйте! Я помощник мастера Анары. Подскажу, какой массаж подойдёт, сколько стоит сеанс и как к нам добраться. Что вас беспокоит?',
};

const QUICK_QUESTIONS = [
  'Какой массаж подойдёт при боли в спине?',
  'Сколько стоит сеанс?',
  'Где находится кабинет?',
];

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading, isOpen]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const history = [...messages, { role: 'user' as const, text: trimmed }];
    setMessages(history);
    setInput('');
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // The greeting is UI-only, the model doesn't need it
        body: JSON.stringify({ messages: history.slice(1) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.reply) throw new Error(data.error || 'request_failed');
      setMessages((prev) => [...prev, { role: 'model', text: data.reply }]);
    } catch {
      setError('Помощник сейчас недоступен. Напишите мастеру напрямую — она ответит в течение 10–15 минут.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed z-40 right-4 bottom-20 sm:bottom-6 sm:right-6 flex items-center gap-2 pl-3.5 pr-4 py-3 rounded-full bg-[#466352] hover:bg-[#385142] text-white text-xs font-semibold shadow-lg transition-colors"
          aria-label="Открыть чат с помощником"
        >
          <Bot className="w-5 h-5" />
          <span className="hidden sm:inline">Задать вопрос</span>
        </button>
      )}

      {isOpen && (
        <div className="fixed z-50 inset-x-3 bottom-3 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[380px] h-[min(560px,calc(100dvh-1.5rem))] flex flex-col bg-white rounded-2xl border border-[#E3DCD2] shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[#ECE5DB] bg-[#F8F5F0] rounded-t-2xl">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#466352] text-white flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-[#182B1F]">Помощник Анары</div>
                <div className="text-[11px] text-[#5C6E61]">ИИ-ассистент · отвечает сразу</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full text-[#738377] hover:bg-[#ECE6DC] hover:text-[#182B1F] transition-colors"
              aria-label="Закрыть чат"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] px-3.5 py-2 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                    m.role === 'user'
                      ? 'bg-[#466352] text-white rounded-br-md'
                      : 'bg-[#F2EDE5] text-[#242A26] rounded-bl-md'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {messages.length === 1 && !isLoading && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="px-3 py-1.5 rounded-full border border-[#D5CDC2] text-[11px] text-[#38483D] hover:bg-[#EDE7DE] transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-[#5C6E61]">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Печатает…</span>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-[#FDF3F2] border border-[#F2D3CF] text-xs text-[#7A2E26] space-y-2">
                <p>{error}</p>
                <a
                  href={MASTER_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-semibold text-[#1E7B45] hover:underline"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Написать в WhatsApp
                </a>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3 border-t border-[#ECE5DB]">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Напишите вопрос…"
              maxLength={1000}
              className="flex-1 text-xs p-2.5 rounded-xl border border-[#D5CDC2] focus:outline-hidden focus:ring-2 focus:ring-[#466352]"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 rounded-xl bg-[#466352] hover:bg-[#385142] text-white disabled:opacity-40 transition-colors"
              aria-label="Отправить"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
