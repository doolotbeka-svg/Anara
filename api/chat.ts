import { GoogleGenAI } from '@google/genai';
import { resolveData, SiteData } from '../src/content/merge.js';
import { readContent } from './_lib/content.js';

// Vercel serverless function: keeps GEMINI_API_KEY on the server.

const MAX_MESSAGES = 12;
const MAX_MESSAGE_LENGTH = 1000;

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

const buildSystemPrompt = ({ master: MASTER_INFO, services: SERVICES, faq: FAQ_ITEMS, location: LOCATION_BEZHETSK }: SiteData) => {
  const services = SERVICES.map(
    (s) =>
      `- ${s.title}: ${s.durations.map((d) => `${d.minutes} мин — ${d.price} ₽`).join(', ')}. ${s.description} Показания: ${s.indication}. Курс: ${s.recommendedCourse}.`
  ).join('\n');
  const faq = FAQ_ITEMS.map((f) => `В: ${f.question}\nО: ${f.answer}`).join('\n\n');

  return `Ты — вежливый онлайн-помощник массажного кабинета мастера ${MASTER_INFO.name} в городе ${MASTER_INFO.city}.
Отвечай по-русски, коротко (2–5 предложений), тепло и по делу. Используй только факты ниже; если ответа в них нет — честно скажи и предложи связаться с мастером.
Не ставь диагнозы и не назначай лечение. При острой боли, температуре, травмах, беременности или хронических заболеваниях советуй сначала проконсультироваться с врачом.
Сам ты не записываешь клиентов: для записи предлагай кнопку «Записаться» на сайте, WhatsApp (${MASTER_INFO.phoneDisplay}), Telegram (${MASTER_INFO.telegramUser}) или звонок.

Мастер: ${MASTER_INFO.name}, ${MASTER_INFO.role}, стаж ${MASTER_INFO.experienceYears} года.
Адрес кабинета: ${MASTER_INFO.cabinetAddress}. ${LOCATION_BEZHETSK.parking}. ${LOCATION_BEZHETSK.transport}.
График: ${MASTER_INFO.schedule}.
Кабинет: ${MASTER_INFO.cabinetFeatures.join('; ')}.

Услуги и цены:
${services}

Частые вопросы:
${faq}`;
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

const isValidMessage = (m: unknown): m is ChatMessage =>
  typeof m === 'object' &&
  m !== null &&
  ((m as ChatMessage).role === 'user' || (m as ChatMessage).role === 'model') &&
  typeof (m as ChatMessage).text === 'string' &&
  (m as ChatMessage).text.trim().length > 0;

export async function POST(request: Request): Promise<Response> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return json({ error: 'not_configured' }, 503);
  }

  let messages: ChatMessage[];
  try {
    const body = await request.json();
    if (!Array.isArray(body?.messages)) throw new Error('messages must be an array');
    messages = body.messages
      .filter(isValidMessage)
      .slice(-MAX_MESSAGES)
      .map((m: ChatMessage) => ({ role: m.role, text: m.text.slice(0, MAX_MESSAGE_LENGTH) }));
  } catch {
    return json({ error: 'bad_request' }, 400);
  }

  if (messages.length === 0 || messages[messages.length - 1].role !== 'user') {
    return json({ error: 'bad_request' }, 400);
  }

  try {
    // Prices and FAQ edited in the admin panel; defaults if storage is unavailable
    const data = resolveData(await readContent().then((c) => c.data).catch(() => ({})));
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-flash-latest',
      contents: messages.map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
      config: {
        systemInstruction: buildSystemPrompt(data),
        maxOutputTokens: 600,
        temperature: 0.4,
      },
    });
    const reply = response.text?.trim();
    if (!reply) return json({ error: 'empty_reply' }, 502);
    return json({ reply });
  } catch (error) {
    console.error('Gemini request failed', error);
    return json({ error: 'upstream_error' }, 502);
  }
}
