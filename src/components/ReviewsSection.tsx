import React, { useState } from 'react';
import { Star, MapPin, CheckCircle, MessageSquarePlus, Quote } from 'lucide-react';
import { REVIEWS, SERVICES } from '../data/massageData';
import { t } from '../content/store';

export const ReviewsSection: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [newReviewSent, setNewReviewSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const emptyForm = () => ({
    name: '',
    age: '',
    location: t('reviews.1', 'Бежецк, '),
    serviceId: SERVICES[0]?.id ?? '',
    text: '',
    rating: 5,
    website: '', // honeypot: hidden from people, bots fill it in
  });
  const [formData, setFormData] = useState(emptyForm);

  const tags = [
    { id: 'all', label: t('reviews.3', 'Все отзывы') },
    { id: 'back', label: t('reviews.4', 'Боль в спине и офисная работа') },
    { id: 'neck', label: t('reviews.5', 'Шея и остеохондроз') },
    { id: 'mom', label: t('reviews.6', 'Молодые мамы и релакс') },
    { id: 'edema', label: t('reviews.7', 'Отеки и легкость') },
  ];

  const filteredReviews = selectedTag === 'all'
    ? REVIEWS
    : REVIEWS.filter((r) => {
        if (selectedTag === 'back') return r.tag.includes('пояснице') || r.tag.includes('Спина');
        if (selectedTag === 'neck') return r.tag.includes('шея') || r.tag.includes('Остеохондроз');
        if (selectedTag === 'mom') return r.tag.includes('мама') || r.tag.includes('Релакс');
        if (selectedTag === 'edema') return r.tag.includes('Отеки');
        return true;
      });

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.text.trim().length < 10) {
      setSendError(t('reviews.30', 'Напишите, пожалуйста, хотя бы пару предложений.'));
      return;
    }
    setIsSending(true);
    setSendError(null);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, age: Number(formData.age) || 0 }),
      });
      if (res.status === 429) throw new Error(t('reviews.31', 'Вы уже отправили несколько отзывов. Попробуйте позже.'));
      if (!res.ok) throw new Error(t('reviews.32', 'Не удалось отправить отзыв. Попробуйте ещё раз или напишите мастеру в WhatsApp.'));
      setNewReviewSent(true);
      setFormData(emptyForm());
    } catch (err) {
      setSendError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section id="reviews" className="py-16 lg:py-24 bg-[#F5F1EB] border-t border-[#E6DFD4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs font-semibold text-[#466352] uppercase tracking-wider mb-2">
              {t('reviews.10', 'Честные истории клиентов')}
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#182B1F] leading-tight">
              {t('reviews.11', 'Отзывы жителей Бежецка')}
            </h1>
            <p className="mt-2 text-sm text-[#4E6053] max-w-xl">
              {t('reviews.12', 'Реальный опыт жителей города, которые посетили домашний спа-кабинет мастера Муратовой Анары.')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setIsAddingReview(!isAddingReview);
                setNewReviewSent(false);
                setSendError(null);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#375240] bg-white hover:bg-[#F9F7F4] rounded-lg border border-[#D5CDC1] shadow-xs transition-colors"
            >
              <MessageSquarePlus className="w-4 h-4 text-[#466352]" />
              <span>{t('reviews.13', 'Оставить свой отзыв')}</span>
            </button>
          </div>
        </div>

        {/* Interactive Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-[#E8E2D7] rounded-xl overflow-x-auto max-w-full mb-8">
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => setSelectedTag(tag.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedTag === tag.id
                  ? 'bg-white text-[#182B1F] shadow-sm font-semibold'
                  : 'text-[#48594E] hover:text-[#182B1F]'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>

        {/* Modal/Form for Submitting New Review */}
        {isAddingReview && (
          <div className="mb-10 p-6 rounded-2xl bg-white border border-[#DED6CB] shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
            <h3 className="text-lg font-display font-bold text-[#182B1F] mb-1">
              {t('reviews.14', 'Поделитесь вашим впечатлением от сеанса')}
            </h3>
            <p className="text-xs text-[#5D6F63] mb-4">
              {t('reviews.15', 'Ваш отзыв помогает жителям Бежецка сделать правильный выбор')}
            </p>

            {newReviewSent ? (
              <div className="p-4 rounded-xl bg-[#EAF4ED] text-[#245232] text-xs font-medium flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#466352]" />
                <span>{t('reviews.16', 'Спасибо! Ваш отзыв отправлен на модерацию и появится на сайте в ближайшее время.')}</span>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                {/* Star rating */}
                <div>
                  <div className="block text-[11px] font-semibold text-[#48594E] mb-1">{t('reviews.33', 'Ваша оценка')}</div>
                  <div className="flex items-center gap-1" role="radiogroup" aria-label={t('reviews.33', 'Ваша оценка')}>
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        role="radio"
                        aria-checked={formData.rating === value}
                        aria-label={`${value} из 5`}
                        onClick={() => setFormData({ ...formData, rating: value })}
                        className="p-0.5 rounded focus:outline-hidden focus:ring-2 focus:ring-[#466352]"
                      >
                        <Star className={`w-7 h-7 transition-colors ${value <= formData.rating ? 'fill-[#F59E0B] text-[#F59E0B]' : 'text-[#D5CDC1]'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#48594E] mb-1">{t('reviews.17', 'Ваше имя')}</label>
                    <input
                      type="text"
                      required
                      minLength={2}
                      maxLength={60}
                      placeholder={t('reviews.18', 'Мария')}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg border border-[#D5CDC1] focus:outline-hidden focus:ring-2 focus:ring-[#466352]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#48594E] mb-1">{t('reviews.34', 'Возраст (необязательно)')}</label>
                    <input
                      type="number"
                      min={14}
                      max={110}
                      inputMode="numeric"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg border border-[#D5CDC1] focus:outline-hidden focus:ring-2 focus:ring-[#466352]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#48594E] mb-1">{t('reviews.19', 'Район / Улица в Бежецке')}</label>
                    <input
                      type="text"
                      maxLength={80}
                      placeholder={t('reviews.20', 'Бежецк, ул. Ленина')}
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg border border-[#D5CDC1] focus:outline-hidden focus:ring-2 focus:ring-[#466352]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#48594E] mb-1">{t('reviews.21', 'Вид массажа')}</label>
                  <select
                    value={formData.serviceId}
                    onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#D5CDC1] bg-white focus:outline-hidden focus:ring-2 focus:ring-[#466352]"
                  >
                    {SERVICES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Honeypot: invisible to people, not reachable with Tab */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="absolute -left-[9999px] w-px h-px opacity-0"
                />
                <div>
                  <label className="block text-[11px] font-semibold text-[#48594E] mb-1">{t('reviews.23', 'Ваш отзыв')}</label>
                  <textarea
                    rows={3}
                    required
                    maxLength={2000}
                    placeholder={t('reviews.24', 'Расскажите о ваших ощущениях после сеанса...')}
                    value={formData.text}
                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#D5CDC1] focus:outline-hidden focus:ring-2 focus:ring-[#466352]"
                  />
                </div>
                {sendError && <p className="text-xs text-[#A34236]">{sendError}</p>}
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingReview(false)}
                    className="px-3 py-1.5 text-xs text-[#5D6F63] hover:text-[#182B1F]"
                  >
                    {t('reviews.25', 'Отмена')}
                  </button>
                  <button
                    type="submit"
                    disabled={isSending}
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#466352] hover:bg-[#385142] rounded-lg shadow-xs disabled:opacity-50"
                  >
                    {isSending ? t('reviews.35', 'Отправляем…') : t('reviews.26', 'Отправить отзыв')}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="rounded-2xl bg-white border border-[#E2DAD0] p-6 flex flex-col justify-between shadow-xs hover:shadow-sm transition-shadow"
            >
              <div>
                {/* Top: Stars and Date */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    {/* Clamped: a rating typed as 0, 4.5 or 7 in the admin must not break the page */}
                    {Array.from({ length: Math.max(0, Math.min(5, Math.round(Number(rev.rating) || 0))) }, (_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#738478] tabular-nums">{rev.date}</span>
                </div>

                {/* Problem category tag */}
                <div className="text-[11px] font-semibold text-[#466352] uppercase tracking-wider mb-2">
                  {rev.tag}
                </div>

                {/* Review body */}
                <p className="text-xs sm:text-sm text-[#3E4E43] leading-relaxed italic">
                  «{rev.text}»
                </p>
              </div>

              {/* Author footer */}
              <div className="mt-6 pt-4 border-t border-[#EFEAE2]">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-xs text-[#182B1F] flex items-center gap-1.5">
                      <span>
                        {rev.name}
                        {rev.age > 0 && (
                          <>
                            , {rev.age}{' '}{t('reviews.27', 'лет')}
                          </>
                        )}
                      </span>
                      {rev.verified && (
                        <span title={t('reviews.28', 'Подтвержденный клиент')} className="inline-flex">
                          <CheckCircle className="w-3.5 h-3.5 text-[#466352]" />
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#637669] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#7B8F81]" />
                      <span>{rev.location}</span>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-[#788A7D] mt-2 bg-[#F7F4F0] px-2 py-1 rounded">
                  {t('reviews.29', 'Услуга:')}{' '}{rev.service}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
