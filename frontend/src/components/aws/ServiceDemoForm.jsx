import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, CheckCircle2, AlertCircle, Loader2, RotateCcw, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

const STEPS = [
  { key: 'submitting', label: 'Browser', icon: '🌐' },
  { key: 'alb',        label: 'ALB',     icon: '⚖️' },
  { key: 'ec2',        label: 'EC2',     icon: '🖥️' },
  { key: 'rds',        label: 'RDS',     icon: '🗄️' },
  { key: 's3',         label: 'S3',      icon: '🪣' },
  { key: 'complete',   label: 'Success', icon: '✅' },
];

const PRESETS = [
  {
    id: 'eid',
    title_ar: 'مساعدة عيد سعيد لأسرة عم إبراهيم',
    title_en: 'Eid Aid for Ibrahim Family',
    category: 'seasonal',
    category_label_ar: 'موسمي — كسوة عيد وهدايا أطفال',
    category_label_en: 'Seasonal — Eid clothing & gifts',
    target_amount: 3500,
    family_id: 'fam-02',
    family_name_ar: 'أسرة عم إبراهيم أبو نافع',
    family_name_en: 'Ibrahim Abu Nafe Family',
    description_ar: 'توفير ملابس عيد وهدايا للأطفال الخمسة وسداد فاتورة كهرباء متأخرة',
    description_en: 'Providing Eid clothing and gifts for 5 children plus paying overdue electricity bills',
  },
  {
    id: 'shelter',
    title_ar: 'ترميم سكن وعلاج عاجل لأسرة عمار',
    title_en: 'Shelter Repair & Medical Aid for Ammar Family',
    category: 'housing',
    category_label_ar: 'سكن وصحة — ترميم وأدوية شهرية',
    category_label_en: 'Housing & Health — Roof repair & monthly medicine',
    target_amount: 8500,
    family_id: 'fam-01',
    family_name_ar: 'أسرة عمار أبو شويعي',
    family_name_en: 'Ammar Abu Shwaie Family',
    description_ar: 'ترميم سقف المنزل وتوفير أدوية علاجية شهرية للأم والأطفال',
    description_en: 'Repairing the leaking home ceiling and securing vital monthly prescriptions for mother and children',
  },
  {
    id: 'debt',
    title_ar: 'سداد ديون متأخرة وفك كرب',
    title_en: 'Debt Relief for Insolvent Family',
    category: 'debt_relief',
    category_label_ar: 'سداد ديون — كمبيالات وفواتير متراكمة',
    category_label_en: 'Debt Relief — Accumulated rent and bills',
    target_amount: 4200,
    family_id: 'fam-02',
    family_name_ar: 'أسرة عم إبراهيم أبو نافع',
    family_name_en: 'Ibrahim Abu Nafe Family',
    description_ar: 'سداد كمبيالات تجارية متأخرة لصاحب السكن والكهرباء',
    description_en: 'Settling overdue rental promissory notes and utility debt to prevent eviction',
  }
];

export function ServiceDemoForm({ onSubmit, simulationStep, isLive }) {
  const { i18n } = useTranslation();
  const isArabic = (i18n.language || 'ar').startsWith('ar');

  const [selectedPreset, setSelectedPreset] = useState(PRESETS[0]);
  const [amount, setAmount] = useState(PRESETS[0].target_amount);
  const [showDetails, setShowDetails] = useState(false);

  const isBusy = simulationStep !== 'idle' && simulationStep !== 'complete' && simulationStep !== 'error';
  const activeStepIdx = STEPS.findIndex(s => s.key === simulationStep);
  const refId = 'SRV-' + Math.random().toString(16).slice(2, 8).toUpperCase();

  const handlePresetChange = (presetId) => {
    const found = PRESETS.find(p => p.id === presetId) || PRESETS[0];
    setSelectedPreset(found);
    setAmount(found.target_amount);
  };

  const handleFormSubmit = () => {
    onSubmit({
      ...selectedPreset,
      target_amount: Number(amount),
    });
  };

  return (
    <div className="bg-gray-900/90 border border-gray-800 backdrop-blur rounded-2xl p-4 shadow-xl flex flex-col gap-3">
      {/* Top Single-Line Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Title & Subtitle */}
        <div className="flex items-center gap-2.5 min-w-fit">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Sparkles size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white tracking-wide">
                {isArabic ? 'إضافة طلب مساعدة لأسرة' : 'Add Family Support Request'}
              </h2>
              <span className="text-xs text-gray-500 font-normal hidden sm:inline">
                {isArabic ? '(Add Family Support Request)' : '(إضافة طلب مساعدة لأسرة)'}
              </span>
            </div>
            <div className="text-[11px] text-gray-400">
              {isArabic 
                ? 'اختر حالة الدعم وانقر لإرسالها عبر مسار بنية AWS'
                : 'Select a support case and send it through the AWS architecture flow'}
            </div>
          </div>
        </div>

        {/* Action Controls in a compact row */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1 justify-end">
          {/* Preset Selector */}
          <div className="flex items-center gap-1.5 bg-gray-800/80 border border-gray-700/80 rounded-xl px-2.5 py-1.5">
            <span className="text-xs text-gray-400 shrink-0">
              {isArabic ? 'الحالة:' : 'Case:'}
            </span>
            <select
              disabled={isBusy}
              value={selectedPreset.id}
              onChange={(e) => handlePresetChange(e.target.value)}
              className="bg-transparent text-xs text-emerald-300 font-medium focus:outline-none cursor-pointer max-w-[220px] truncate"
            >
              {PRESETS.map(p => (
                <option key={p.id} value={p.id} className="bg-gray-900 text-gray-200">
                  {isArabic ? p.title_ar : p.title_en}
                </option>
              ))}
            </select>
          </div>

          {/* Amount input */}
          <div className="flex items-center gap-1 bg-gray-800/80 border border-gray-700/80 rounded-xl px-2.5 py-1.5">
            <span className="text-xs text-gray-400 shrink-0">
              {isArabic ? 'المبلغ:' : 'Amount:'}
            </span>
            <input
              type="number"
              disabled={isBusy}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="bg-transparent text-xs text-white font-mono w-16 focus:outline-none text-right font-semibold"
            />
            <span className="text-[11px] text-gray-400 font-mono">
              {isArabic ? 'ج.م' : 'EGP'}
            </span>
          </div>

          {/* Mode Badge */}
          <div className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium border ${
            isLive
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : 'bg-orange-500/10 text-orange-400 border-orange-500/30'
          }`}>
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isLive ? 'bg-emerald-400' : 'bg-orange-400'}`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isLive ? 'bg-emerald-500' : 'bg-orange-500'}`} />
            </span>
            {isLive ? (isArabic ? 'خادم AWS متصل' : 'Live AWS') : (isArabic ? 'محاكاة' : 'Simulation')}
          </div>

          {/* Details toggle */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-gray-400 hover:text-gray-200 p-2 rounded-xl bg-gray-800/50 hover:bg-gray-800 border border-gray-700/60 transition-colors flex items-center gap-1"
            title={isArabic ? 'عرض التفاصيل' : 'Toggle details'}
          >
            {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            <span className="hidden lg:inline">
              {showDetails 
                ? (isArabic ? 'إخفاء' : 'Hide') 
                : (isArabic ? 'تفاصيل' : 'Details')}
            </span>
          </button>

          {/* Trigger Button */}
          {simulationStep === 'complete' ? (
            <button
              onClick={() => onSubmit(null)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 transition-all"
            >
              <RotateCcw size={13} />
              {isArabic ? 'إعادة تجربة (Reset)' : 'Reset Simulation'}
            </button>
          ) : (
            <button
              onClick={handleFormSubmit}
              disabled={isBusy}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isBusy ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              <span>
                {isBusy 
                  ? (isArabic ? 'جاري التنفيذ...' : 'Processing...') 
                  : (isArabic ? 'إرسال عبر خادم AWS' : 'Send to AWS Backend')}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Expandable Details Box if toggled */}
      {showDetails && (
        <div className="pt-2 border-t border-gray-800/80 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-gray-950/60 border border-gray-800/70 p-2.5 rounded-xl">
            <span className="text-gray-500 block mb-0.5">
              {isArabic ? 'الأسرة المستفيدة:' : 'Beneficiary Family:'}
            </span>
            <span className="text-gray-200 font-medium">
              {isArabic ? selectedPreset.family_name_ar : selectedPreset.family_name_en}
            </span>
          </div>
          <div className="bg-gray-950/60 border border-gray-800/70 p-2.5 rounded-xl">
            <span className="text-gray-500 block mb-0.5">
              {isArabic ? 'التصنيف والهدف:' : 'Category & Goal:'}
            </span>
            <span className="text-gray-200 font-medium">
              {isArabic ? selectedPreset.category_label_ar : selectedPreset.category_label_en}
            </span>
          </div>
          <div className="bg-gray-950/60 border border-gray-800/70 p-2.5 rounded-xl">
            <span className="text-gray-500 block mb-0.5">
              {isArabic ? 'الوصف:' : 'Description:'}
            </span>
            <span className="text-gray-300 leading-relaxed" dir={isArabic ? 'rtl' : 'ltr'}>
              {isArabic ? selectedPreset.description_ar : selectedPreset.description_en}
            </span>
          </div>
        </div>
      )}

      {/* Progress Ribbon during execution */}
      {simulationStep !== 'idle' && (
        <div className="pt-2 border-t border-gray-800/80 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-xs text-gray-500 font-mono">
            <span>{isArabic ? 'مسار طلب AWS المباشر:' : 'Live AWS Request Flow:'}</span>
          </div>

          <div className="flex items-center flex-wrap gap-1">
            {STEPS.map((step, idx) => {
              const done = activeStepIdx > idx || simulationStep === 'complete';
              const active = step.key === simulationStep;
              return (
                <div key={step.key} className="flex items-center gap-1">
                  <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                    active
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold scale-105 shadow-sm shadow-emerald-500/20'
                      : done
                      ? 'bg-gray-800/90 text-emerald-300 border border-emerald-800/30'
                      : 'bg-gray-950/50 text-gray-600 border border-gray-800/60'
                  }`}>
                    <span>{step.icon}</span>
                    <span>{step.label}</span>
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />}
                  </div>
                  {idx < STEPS.length - 1 && (
                    <span className={`text-xs ${done ? 'text-emerald-500/70' : 'text-gray-700'}`}>›</span>
                  )}
                </div>
              );
            })}
          </div>

          {simulationStep === 'complete' && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <CheckCircle2 size={14} />
              <span>{isArabic ? 'معرّف السجل:' : 'Created ID:'} <code className="font-mono text-emerald-300 font-bold">{refId}</code></span>
            </div>
          )}

          {simulationStep === 'error' && (
            <div className="flex items-center gap-1.5 text-xs text-red-400 font-medium">
              <AlertCircle size={14} />
              <span>{isArabic ? 'تعذر الاتصال بالخادم — تحقق من VITE_BACKEND_URL' : 'Backend unreachable — check VITE_BACKEND_URL'}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
