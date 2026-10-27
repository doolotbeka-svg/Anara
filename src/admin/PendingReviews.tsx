import React, { useState } from 'react';
import { Check, Loader2, MapPin, Star, Trash2 } from 'lucide-react';
import { SiteContent } from '../content/merge';
import { adminApi, errorText, PendingReview, UnauthorizedError } from './api';
import { TelegramSettings } from './TelegramSettings';

interface PendingReviewsProps {
  token: string;
  reviews: PendingReview[] | null;
  isDirty: boolean;
  onChanged: (reviews: PendingReview[]) => void;
  onPublished: (content: SiteContent) => void;
  onUnauthorized: () => void;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });

export const PendingReviews: React.FC<PendingReviewsProps> = ({
  token,
  reviews,
  isDirty,
  onChanged,
  onPublished,
  onUnauthorized,
}) => {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const act = async (item: PendingReview, action: 'publish' | 'delete') => {
    if (action === 'delete' && !window.confirm(`Удалить отзыв от «${item.review.name}»? Его нельзя будет вернуть.`)) return;
    setBusy(item.pathname);
    setError(null);
    try {
      if (action === 'publish') onPublished(await adminApi.publishReview(token, item.pathname));
      else await adminApi.deleteReview(token, item.pathname);
      onChanged((reviews ?? []).filter((r) => r.pathname !== item.pathname));
    } catch (e) {
      if (e instanceof UnauthorizedError) onUnauthorized();
      else setError(errorText(e));
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-3">
      <TelegramSettings token={token} onUnauthorized={onUnauthorized} />

      <p className="text-xs text-[#5C6E61]">
        Отзывы, которые клиенты оставили на сайте. На сайте они появятся только после того, как вы нажмёте «Опубликовать»
        — сверху списка отзывов. Потом их можно поправить на вкладке «Отзывы».
      </p>

      {isDirty && (
        <div className="p-3 rounded-xl bg-[#FFF8E6] border border-[#F0DDA8] text-xs text-[#6B5414]">
          Сначала нажмите «Сохранить» — публикация отзыва сохраняет сайт, и несохранённые правки могли бы потеряться.
        </div>
      )}
      {error && <div className="p-3 rounded-xl bg-[#FDF3F2] border border-[#F2D3CF] text-xs text-[#7A2E26]">{error}</div>}
      {reviews === null && <Loader2 className="w-5 h-5 animate-spin text-[#466352]" />}
      {reviews?.length === 0 && <p className="text-sm text-[#5C6E61]">Новых отзывов нет.</p>}

      {reviews?.map((item) => {
        const { review } = item;
        return (
          <div key={item.pathname} className="p-4 rounded-2xl border border-[#E3DCD2] bg-white space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-0.5" aria-label={`${review.rating} из 5`}>
                {[1, 2, 3, 4, 5].map((v) => (
                  <Star key={v} className={`w-4 h-4 ${v <= review.rating ? 'fill-[#F59E0B] text-[#F59E0B]' : 'text-[#D5CDC1]'}`} />
                ))}
              </div>
              <span className="text-[11px] text-[#738377]">{formatDate(review.createdAt)}</span>
            </div>
            <p className="text-sm text-[#242A26] whitespace-pre-wrap">{review.text}</p>
            <div className="text-xs text-[#5C6E61] space-y-0.5">
              <div className="font-semibold text-[#182B1F]">
                {review.name}
                {review.age > 0 && `, ${review.age} лет`}
              </div>
              {review.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {review.location}
                </div>
              )}
              {review.service && <div>Услуга: {review.service}</div>}
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                disabled={!!busy || isDirty}
                onClick={() => act(item, 'publish')}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#466352] hover:bg-[#385142] text-white text-xs font-semibold disabled:opacity-40"
              >
                {busy === item.pathname ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Опубликовать
              </button>
              <button
                type="button"
                disabled={!!busy}
                onClick={() => act(item, 'delete')}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#A34236] hover:bg-[#FBEAE7] disabled:opacity-40"
              >
                <Trash2 className="w-4 h-4" />
                Удалить
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
