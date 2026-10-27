import React, { useState } from 'react';
import { HelpCircle, CheckCircle, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { SERVICES } from '../data/massageData';
import { MassageService } from '../types';
import { t } from '../content/store';

interface SymptomFinderProps {
  onSelectProgram: (service: MassageService, duration: { minutes: number; price: number }) => void;
}

interface SymptomOption {
  id: string;
  iconName: string;
  title: string;
  description: string;
  targetServiceId: string;
  recommendedDuration: number;
  reason: string;
}

export const SymptomFinder: React.FC<SymptomFinderProps> = ({ onSelectProgram }) => {
  const [selectedSymptomId, setSelectedSymptomId] = useState<string>('back');

  const symptoms: SymptomOption[] = [
    {
      id: 'back',
      iconName: 'spine',
      title: t('symptoms.1', 'Болит поясница или ноет между лопатками'),
      description: t('symptoms.2', 'Много сидите за компьютером или поднимаете тяжести, к вечеру спина «каменеет»'),
      targetServiceId: 'back-neck',
      recommendedDuration: 45,
      reason: t('symptoms.3', 'Сфокусируемся на глубокой проработке мышц вдоль позвоночника и снятии миофасциальных триггеров.')
    },
    {
      id: 'neck',
      iconName: 'head',
      title: t('symptoms.4', 'Затекает шея, тяжесть в затылке, головные боли'),
      description: t('symptoms.5', 'Долгое сидение в телефоне или за рулем, тянущее ощущение в плечах'),
      targetServiceId: 'shvz',
      recommendedDuration: 30,
      reason: t('symptoms.6', 'Прицельный массаж шейно-воротниковой зоны снимет спазм трапеций и нормализует приток кислорода к мозгу.')
    },
    {
      id: 'stress',
      iconName: 'heart',
      title: t('symptoms.7', 'Хронический стресс, выгорание, бессонница'),
      description: t('symptoms.8', 'Молодые мамы, тревожные мысли, постоянный недосып и мышечная скованность'),
      targetServiceId: 'relax-antistress',
      recommendedDuration: 90,
      reason: t('symptoms.9', 'Плавный седативный спа-массаж с теплыми маслами успокоит нервную систему. После сеанса вы сразу уснете дома.')
    },
    {
      id: 'swelling',
      iconName: 'legs',
      title: t('symptoms.10', 'Отеки, тяжесть в ногах, застой жидкости'),
      description: t('symptoms.11', 'К вечеру обувь давит, чувствуется застой в голенях и бедрах, мало движения'),
      targetServiceId: 'lymphatic',
      recommendedDuration: 60,
      reason: t('symptoms.12', 'Мягкий дренажный массаж по ходу лимфотока выведет лишнюю межклеточную жидкость и вернет легкость.')
    },
    {
      id: 'fatigue',
      iconName: 'body',
      title: t('symptoms.13', 'Общая скованность во всем теле'),
      description: t('symptoms.14', 'Хочется полного перезапуска и обновления всех мышц от стоп до шеи'),
      targetServiceId: 'full-body-classic',
      recommendedDuration: 75,
      reason: t('symptoms.15', 'Классический массаж всего тела повысит общий тонус, гибкость и снимет накопленные зажимы.')
    }
  ];

  const currentSymptom = symptoms.find((s) => s.id === selectedSymptomId) || symptoms[0];
  const targetService = SERVICES.find((s) => s.id === currentSymptom.targetServiceId) || SERVICES[0];
  const durationOption = targetService.durations.find((d) => d.minutes === currentSymptom.recommendedDuration) || targetService.durations[0];

  return (
    <section className="py-14 bg-[#F2EDE5] border-b border-[#E5DDD0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-xs font-semibold text-[#466352] uppercase tracking-wider mb-2">
            {t('symptoms.16', 'Экспресс-подбор программы')}
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#182B1F]">
            {t('symptoms.17', 'Что вас беспокоит сейчас сильнее всего?')}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#4E6053]">
            {t('symptoms.18', 'Выберите вашу основную жалобу, чтобы узнать оптимальный вид массажа и длительность для первого визита')}
          </p>
        </div>

        {/* Interactive Symptom Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-8">
          {symptoms.map((item) => {
            const isSelected = item.id === selectedSymptomId;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedSymptomId(item.id)}
                className={`p-4 rounded-xl text-left transition-all flex flex-col justify-between border ${
                  isSelected
                    ? 'bg-white border-[#466352] shadow-sm ring-2 ring-[#466352]/20'
                    : 'bg-[#F9F7F4] border-[#E2DAD0] hover:bg-white text-[#4A5A4F]'
                }`}
              >
                <div>
                  <div className={`font-semibold text-xs leading-snug ${isSelected ? 'text-[#182B1F]' : 'text-[#303E34]'}`}>
                    {item.title}
                  </div>
                  <div className="text-[11px] text-[#617366] mt-1.5 line-clamp-2">
                    {item.description}
                  </div>
                </div>
                <div className="mt-3 text-[10px] font-semibold text-[#466352]">
                  {isSelected ? t('symptoms.19', '✓ Выбрано') : t('symptoms.20', 'Нажмите для расчета')}
                </div>
              </button>
            );
          })}
        </div>

        {/* Recommendation Panel */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E0D8CE] shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="text-xs font-semibold text-[#466352] uppercase tracking-wider">
              {t('symptoms.21', 'Рекомендация мастера для вашего случая:')}
            </div>
            <h3 className="text-xl sm:text-2xl font-display font-bold text-[#182B1F]">
              {targetService.title} · {durationOption.minutes}{' '}{t('symptoms.22', 'минут')}
            </h3>
            <p className="text-xs sm:text-sm text-[#48594E] leading-relaxed">
              {currentSymptom.reason}
            </p>
            <div className="text-xs text-[#5D6F63] pt-1">
              {t('symptoms.23', 'Стоимость сеанса в домашнем кабинете:')}{' '}<span className="font-bold text-[#182B1F] text-base">{durationOption.price} ₽</span>{' '}{t('symptoms.24', '(чай и расходники включены)')}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button
              onClick={() => onSelectProgram(targetService, durationOption)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-semibold text-white bg-[#466352] hover:bg-[#385142] active:bg-[#2C4033] rounded-xl shadow-xs transition-colors whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t('symptoms.25', 'Записаться на этот сеанс')}</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
