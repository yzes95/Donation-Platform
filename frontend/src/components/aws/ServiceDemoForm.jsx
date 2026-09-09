import { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const STEPS = [
  { key: 'submitting', label: 'Browser', icon: '🌐' },
  { key: 'alb',        label: 'ALB',     icon: '⚖️' },
  { key: 'ec2',        label: 'EC2',     icon: '🖥️' },
  { key: 'rds',        label: 'RDS',     icon: '🗄️' },
  { key: 's3',         label: 'S3',      icon: '🪣' },
  { key: 'complete',   label: 'Done',    icon: '✅' },
];

const CATEGORIES = [
  { value: 'medical',     label: 'Medical / طبي' },
  { value: 'housing',     label: 'Housing / سكن' },
  { value: 'debt_relief', label: 'Debt Relief / سداد ديون' },
  { value: 'education',   label: 'Education / تعليم' },
  { value: 'seasonal',    label: 'Seasonal / موسمي' },
  { value: 'emergencies', label: 'Emergencies / طوارئ' },
];

const FAMILIES = [
  { value: 'fam-02', label: 'أسرة عم إبراهيم أبو نافع' },
  { value: 'fam-01', label: 'أسرة عمار أبو شويعي' },
];

export function ServiceDemoForm({ onSubmit, simulationStep, isLive }) {
  const [form, setForm] = useState({
    title_ar: 'مساعدة عيد سعيد - أسرة عم إبراهيم',
    title_en: 'Eid Aid - Ibrahim Family',
    category: 'seasonal',
    target_amount: 3500,
    description_ar: 'توفير ملابس عيد وهدايا للأطفال وسداد فاتورة الكهرباء المتأخرة',
    family_id: 'fam-02',
  });

  const isBusy = simulationStep !== 'idle' && simulationStep !== 'complete' && simulationStep !== 'error';
  const activeStepIdx = STEPS.findIndex(s => s.key === simulationStep);
  const refId = 'SRV-' + Math.random().toString(16).slice(2, 8).toUpperCase();

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 flex flex-col gap-4 h-full">
      <div>
        <h2 className="text-base font-bold text-white">Add Assistance Need</h2>
        <p className="text-xs text-gray-500 mt-0.5">إضافة احتياج جديد</p>
      </div>

      {/* Status badge */}
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold w-fit border ${
        isLive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-orange-500/10 text-orange-400 border-orange-500/30'
      }`}>
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isLive ? 'bg-emerald-400' : 'bg-orange-400'}`} />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${isLive ? 'bg-emerald-500' : 'bg-orange-500'}`} />
        </span>
        {isLive ? 'Live — AWS Connected' : 'Simulation Mode'}
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-3">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Service Title (Arabic)</label>
          <input dir="rtl" disabled={isBusy} value={form.title_ar}
            onChange={e => setForm(f => ({ ...f, title_ar: e.target.value }))}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Service Title (English)</label>
          <input disabled={isBusy} value={form.title_en}
            onChange={e => setForm(f => ({ ...f, title_en: e.target.value }))}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Category</label>
            <select disabled={isBusy} value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors">
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Amount (EGP)</label>
            <input type="number" disabled={isBusy} value={form.target_amount}
              onChange={e => setForm(f => ({ ...f, target_amount: Number(e.target.value) }))}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors" />
          </div>
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Family</label>
          <select disabled={isBusy} value={form.family_id}
            onChange={e => setForm(f => ({ ...f, family_id: e.target.value }))}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors">
            {FAMILIES.map(fam => <option key={fam.value} value={fam.value}>{fam.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Description (Arabic)</label>
          <textarea dir="rtl" rows={2} disabled={isBusy} value={form.description_ar}
            onChange={e => setForm(f => ({ ...f, description_ar: e.target.value }))}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors resize-none" />
        </div>
      </div>

      {/* Submit */}
      <button onClick={() => onSubmit(form)} disabled={isBusy}
        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-semibold text-sm transition-all bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40 disabled:cursor-not-allowed">
        {isBusy ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
        {isBusy ? 'Processing…' : 'Send to AWS Backend'}
      </button>

      {/* Step tracker */}
      {simulationStep !== 'idle' && (
        <div>
          <p className="text-xs text-gray-600 mb-2">Request journey:</p>
          <div className="flex items-center flex-wrap gap-1">
            {STEPS.map((step, idx) => {
              const done = activeStepIdx > idx || simulationStep === 'complete';
              const active = step.key === simulationStep;
              return (
                <div key={step.key} className="flex items-center gap-1">
                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs border transition-all ${
                    active ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 scale-105'
                    : done ? 'bg-gray-800 text-gray-300 border-gray-700'
                    : 'bg-transparent text-gray-600 border-gray-800'
                  }`}>
                    {step.icon} {step.label}
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />}
                  </div>
                  {idx < STEPS.length - 1 && <span className={`text-xs ${done ? 'text-emerald-700' : 'text-gray-800'}`}>›</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Results */}
      {simulationStep === 'complete' && (
        <div className="p-3 bg-emerald-950/50 border border-emerald-800/50 rounded-xl">
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold mb-1">
            <CheckCircle2 size={14} /> Service created
          </div>
          <p className="text-xs text-gray-400">Ref: <span className="font-mono text-emerald-300">{refId}</span></p>
          <button onClick={() => onSubmit(null)} className="mt-2 text-xs text-gray-600 hover:text-gray-400 underline">Reset</button>
        </div>
      )}
      {simulationStep === 'error' && (
        <div className="p-3 bg-red-950/50 border border-red-800/50 rounded-xl flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle size={14} /> Backend unreachable — check VITE_BACKEND_URL
        </div>
      )}
    </div>
  );
}
