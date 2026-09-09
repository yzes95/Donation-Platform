import { useState } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export const ServiceDemoForm = ({ onSubmit, simulationStep, isLive }) => {
  const [refId, setRefId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setRefId(`SRV-${Math.random().toString(16).substring(2, 8).toUpperCase()}`);
    onSubmit();
  };

  const isIdle = simulationStep === 'idle' || simulationStep === 'complete' || simulationStep === 'error';

  const steps = [
    { id: 'submitting', label: 'Browser' },
    { id: 'alb', label: 'ALB' },
    { id: 'ec2', label: 'EC2' },
    { id: 'rds', label: 'RDS' },
    { id: 's3', label: 'S3' },
    { id: 'complete', label: '✅' }
  ];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Add Assistance Need</h2>
          <h3 className="text-sm text-gray-400" dir="rtl">إضافة احتياج جديد</h3>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2 ${isLive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'}`}>
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isLive ? 'bg-emerald-400' : 'bg-orange-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isLive ? 'bg-emerald-500' : 'bg-orange-500'}`}></span>
          </span>
          {isLive ? 'Live — AWS Connected' : 'Simulation Mode'}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Service Title (Arabic)</label>
            <input type="text" defaultValue="مساعدة عيد سعيد - أسرة عم إبراهيم" dir="rtl" className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none" disabled={!isIdle} />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Service Title (English)</label>
            <input type="text" defaultValue="Eid Aid - Ibrahim Family" className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none" disabled={!isIdle} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Category</label>
            <select defaultValue="seasonal" className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none appearance-none" disabled={!isIdle}>
              <option value="medical">Medical</option>
              <option value="housing">Housing</option>
              <option value="debt_relief">Debt Relief</option>
              <option value="education">Education</option>
              <option value="seasonal">Seasonal</option>
              <option value="emergencies">Emergencies</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Target Amount (EGP)</label>
            <input type="number" defaultValue="3500" className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none" disabled={!isIdle} />
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">Family</label>
          <select defaultValue="fam-02" className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none appearance-none" disabled={!isIdle} dir="rtl">
            <option value="fam-02">أسرة عم إبراهيم أبو نافع (fam-02)</option>
            <option value="fam-01">أسرة عمار أبو شويعي (fam-01)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">Description (Arabic)</label>
          <textarea defaultValue="توفير ملابس عيد وهدايا للأطفال وسداد فاتورة الكهرباء المتأخرة" dir="rtl" rows={2} className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none resize-none" disabled={!isIdle} />
        </div>

        <button 
          type="submit" 
          disabled={!isIdle}
          className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold rounded-lg px-4 py-3 transition-colors mt-4"
        >
          {simulationStep === 'idle' || simulationStep === 'complete' || simulationStep === 'error' ? 'Send to AWS Backend' : 'Processing...'}
        </button>
      </form>

      {!isIdle && simulationStep !== 'idle' && simulationStep !== 'error' && simulationStep !== 'complete' && (
        <div className="mt-6 border-t border-gray-800 pt-6">
          <div className="flex justify-between items-center text-xs font-mono text-gray-400 px-2 relative">
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gray-800 -z-10" />
            {steps.map((step) => {
              const isActive = simulationStep === step.id;
              const isPast = steps.findIndex(s => s.id === simulationStep) > steps.findIndex(s => s.id === step.id);
              return (
                <div key={step.id} className={`flex flex-col items-center gap-2 ${isActive ? 'text-emerald-400' : isPast ? 'text-gray-300' : 'text-gray-600'}`}>
                  <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-emerald-400 ring-4 ring-emerald-400/20 shadow-[0_0_10px_rgba(52,211,153,0.5)]' : isPast ? 'bg-gray-400' : 'bg-gray-800 border border-gray-700'}`} />
                  <span className={isActive ? 'font-bold' : ''}>{step.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {simulationStep === 'complete' && (
        <div className="mt-6 bg-emerald-950/40 border border-emerald-500/30 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-emerald-400 font-semibold text-sm">Successfully created in AWS</h4>
            <p className="text-emerald-200/70 text-xs mt-1">Reference ID: <span className="font-mono bg-emerald-950 px-1 rounded text-emerald-300">{refId}</span></p>
          </div>
        </div>
      )}

      {simulationStep === 'error' && (
        <div className="mt-6 bg-red-950/40 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-red-400 font-semibold text-sm">Failed to connect to AWS</h4>
            <p className="text-red-200/70 text-xs mt-1">Check network or backend status.</p>
          </div>
        </div>
      )}
    </div>
  );
};
