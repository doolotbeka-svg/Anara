import React, { useState } from 'react';
import { Star, MapPin, CheckCircle, MessageSquarePlus, Quote } from 'lucide-react';
import { REVIEWS } from '../data/massageData';
import { ReviewItem } from '../types';
import { t } from '../content/store';

export const ReviewsSection: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [newReviewSent, setNewReviewSent] = useState(false);

  // Simple local state for new review form
  const [formData, setFormData] = useState({
    name: '',
    location: t('reviews.1', 'Бежецк, '),
    text: '',
    service: t('reviews.2', 'Массаж спины')
  });

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

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.text) return;
    setNewReviewSent(true);
    setTimeout(() => {
      setNewReviewSent(false);
      setIsAddingReview(false);
      setFormData({ name: '', location: t('reviews.8', 'Бежецк, '), text: '', service: t('reviews.9', 'Массаж спины') });
    }, 2500);
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
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#182B1F] leading-tight">
              {t('reviews.11', 'Отзывы жителей Бежецка')}
            </h2>
            <p className="mt-2 text-sm text-[#4E6053] max-w-xl">
              {t('reviews.12', 'Реальный опыт жителей города, которые посетили домашний спа-кабинет мастера Анары Муратовой.')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddingReview(!isAddingReview)}
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#48594E] mb-1">{t('reviews.17', 'Ваше имя')}</label>
                    <input
                      type="text"
                      required
                      placeholder={t('reviews.18', 'Мария')}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg border border-[#D5CDC1] focus:outline-hidden focus:ring-2 focus:ring-[#466352]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#48594E] mb-1">{t('reviews.19', 'Район / Улица в Бежецке')}</label>
                    <input
                      type="text"
                      placeholder={t('reviews.20', 'Бежецк, ул. Ленина')}
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg border border-[#D5CDC1] focus:outline-hidden focus:ring-2 focus:ring-[#466352]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#48594E] mb-1">{t('reviews.21', 'Вид массажа')}</label>
                    <input
                      type="text"
                      placeholder={t('reviews.22', 'Массаж спины и шеи')}
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg border border-[#D5CDC1] focus:outline-hidden focus:ring-2 focus:ring-[#466352]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#48594E] mb-1">{t('reviews.23', 'Ваш отзыв')}</label>
                  <textarea
                    rows={3}
                    required
                    placeholder={t('reviews.24', 'Расскажите о ваших ощущениях после сеанса...')}
                    value={formData.text}
                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#D5CDC1] focus:outline-hidden focus:ring-2 focus:ring-[#466352]"
                  />
                </div>
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
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#466352] hover:bg-[#385142] rounded-lg shadow-xs"
                  >
                    {t('reviews.26', 'Отправить отзыв')}
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
                    {[...Array(rev.rating)].map((_, i) => (
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
                      <span>{rev.name}, {rev.age}{' '}{t('reviews.27', 'лет')}</span>
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
