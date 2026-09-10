import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshCw, AlertCircle, Play, Eye } from 'lucide-react';

const FILES = {
  'main.py':       'https://raw.githubusercontent.com/yzes95/Donation-Platform-Backend/main/main.py',
  'settings.py':   'https://raw.githubusercontent.com/yzes95/Donation-Platform-Backend/main/config/settings.py',
  'admin.py':      'https://raw.githubusercontent.com/yzes95/Donation-Platform-Backend/main/routes/admin.py',
  'connection.py': 'https://raw.githubusercontent.com/yzes95/Donation-Platform-Backend/main/database/connection.py',
  'service.py':    'https://raw.githubusercontent.com/yzes95/Donation-Platform-Backend/main/models/service.py',
};

const ANNOTATIONS = {
  'main.py': [
    { match: 'allow_origins', type: 'warning', msg_en: 'CORS: ensure allow_origins is a strict whitelist in production — never use ["*"]', msg_ar: 'CORS: يجب تحديد النطاقات المسموح بها بدقة في بيئة الإنتاج وعدم استخدام ["*"]' },
  ],
  'settings.py': [
    { match: 'DEBUG: bool = True', type: 'critical', msg_en: '🔴 CRITICAL — DEBUG=True exposes full Python stack traces to anyone who triggers an error in production', msg_ar: '🔴 حرج — وضع التصحيح DEBUG=True يسرب تتبع الأخطاء البرمجية بالكامل عند حدوث أي خطأ' },
    { match: 'DATABASE_URL', type: 'warning', msg_en: '🟡 Store database credentials in AWS Secrets Manager or Parameter Store — not in plaintext server files', msg_ar: '🟡 يفضل حفظ بيانات الاتصال بقاعدة البيانات في AWS Secrets Manager بدلاً من الملفات النصية' },
    { match: 'SECRET_KEY', type: 'critical', msg_en: '🔴 Hardcoded fallback secret key visible in public GitHub repo — allows forging valid JWT tokens', msg_ar: '🔴 مفتاح التشفير الاحتياطي مكشوف في مستودع GitHub العام مما يتيح تزوير توكن المصادقة' },
    { match: 'change-this', type: 'critical', msg_en: '🔴 Plaintext secret committed to git history — rotate immediately and load from Secrets Manager', msg_ar: '🔴 تم حفظ كلمة سر افتراضية في سجل Git — يجب تدويرها وتحميلها عبر Secrets Manager' },
  ],
  'admin.py': [
    { match: 'async def admin_test', type: 'critical', msg_en: '🔴 NO AUTH — This admin endpoint has no authentication dependency. Anyone on the internet can call it.', msg_ar: '🔴 ثغرة أمنية — هذا المسار الإداري غير محمي بتوكن المصادقة ويمكن لأي شخص استدعاؤه' },
  ],
  'connection.py': [
    { match: 'echo=settings.DEBUG', type: 'warning', msg_en: '🟡 SQLAlchemy echo=True logs every SQL query — leaks schema details and sensitive payloads to CloudWatch logs', msg_ar: '🟡 echo=True يسجل كل استعلام SQL مما يسرب هيكل قاعدة البيانات والبيانات إلى سجلات CloudWatch' },
  ],
  'service.py': [
    { match: 'Float', type: 'info', msg_en: 'ℹ️ Float uses binary IEEE 754 — financial amounts like 3500.00 can suffer precision rounding. Use Numeric(12,2) for money', msg_ar: 'ℹ️ نوع Float قد يتسبب في أخطاء تقريب للأموال (مثل 3499.999). الأفضل استخدام Numeric(12,2)' },
  ],
};

const STEP_HIGHLIGHTS = {
  submitting: { file: 'main.py',       term: 'allow_origins', label_en: 'Browser & CORS Policy', label_ar: 'طلب المتصفح وسياسة CORS' },
  alb:        { file: 'main.py',       term: 'include_router', label_en: 'ALB Route Forwarding', label_ar: 'توجيه مسارات ALB' },
  ec2:        { file: 'admin.py',      term: 'admin_test',    label_en: 'FastAPI Container & Route', label_ar: 'حاوية FastAPI ومعالج الطلب' },
  rds:        { file: 'connection.py', term: 'get_db',        label_en: 'PostgreSQL Session & Database', label_ar: 'جلسة قاعدة بيانات PostgreSQL' },
  s3:         { file: 'service.py',    term: 'Float',         label_en: 'Service Schema & Data Model', label_ar: 'نموذج بيانات الحالة والتخزين' },
  cloudwatch: { file: 'settings.py',   term: 'DEBUG',         label_en: 'CloudWatch & Configuration', label_ar: 'إعدادات وسجلات CloudWatch' },
};

const KEYWORDS = new Set([
  'import','from','class','def','async','await','return','if','else','elif',
  'try','except','raise','with','as','for','in','not','and','or','True','False',
  'None','pass','yield','lambda','global','nonlocal','is','del','while','break',
  'continue','finally','assert',
]);

function getLineClass(line) {
  const t = line.trim();
  if (!t) return 'text-gray-400';
  if (t.startsWith('#')) return 'text-gray-500 italic';
  const fw = t.split(/[\s(:=,]/)[0];
  if (KEYWORDS.has(fw)) return 'text-emerald-300';
  return 'text-gray-200';
}

const ANN_STYLE = {
  critical: { border: 'border-red-500/40',    bg: 'bg-red-950/20',    icon: '🔴', tip: 'bg-gray-950 border-red-700' },
  warning:  { border: 'border-yellow-500/40', bg: 'bg-yellow-950/20', icon: '🟡', tip: 'bg-gray-950 border-yellow-700' },
  info:     { border: 'border-blue-500/40',   bg: 'bg-blue-950/20',   icon: 'ℹ️', tip: 'bg-gray-950 border-blue-700' },
};

function Line({ text, num, ann, highlighted, isArabic }) {
  const [tip, setTip] = useState(false);
  const s = ann ? ANN_STYLE[ann.type] : null;
  const msg = ann ? (isArabic ? ann.msg_ar : ann.msg_en) : '';

  return (
    <div className={`relative flex border-l-2 hover:bg-white/[0.02] transition-colors ${
      highlighted ? 'bg-emerald-900/25 border-l-emerald-400' : ''
    } ${s ? `${s.border} ${s.bg}` : 'border-transparent'}`}>
      <span className="select-none w-10 text-right pr-3 py-0.5 text-gray-700 text-xs shrink-0 leading-5">{num}</span>
      <pre className={`flex-1 py-0.5 pr-2 text-xs leading-5 whitespace-pre font-mono ${getLineClass(text)}`}>{text}</pre>
      {s && (
        <div className="relative flex items-center shrink-0 pr-2">
          <button onMouseEnter={() => setTip(true)} onMouseLeave={() => setTip(false)} className="text-xs px-1">
            {s.icon}
          </button>
          {tip && (
            <div className={`absolute right-7 top-0 z-50 w-72 border text-xs p-2.5 rounded-lg shadow-2xl leading-relaxed text-gray-200 ${s.tip}`} dir={isArabic ? 'rtl' : 'ltr'}>
              {msg}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function CodePanel({ simulationStep, isManualOverride, onFollowSimulation }) {
  const { i18n } = useTranslation();
  const isArabic = (i18n.language || 'ar').startsWith('ar');

  const [files, setFiles] = useState({});
  const [active, setActive] = useState('main.py');
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(false);
  const [fetchedAt, setFetchedAt] = useState(null);

  useEffect(() => {
    const h = STEP_HIGHLIGHTS[simulationStep];
    if (h) setActive(h.file);
  }, [simulationStep]);

  const load = async () => {
    setLoading(true); setErr(false);
    try {
      const pairs = await Promise.all(
        Object.entries(FILES).map(async ([n, url]) => {
          const r = await fetch(url);
          if (!r.ok) throw new Error(n);
          return [n, await r.text()];
        })
      );
      setFiles(Object.fromEntries(pairs));
      setFetchedAt(new Date().toLocaleTimeString());
    } catch { setErr(true); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const anns = ANNOTATIONS[active] || [];
  const hl = STEP_HIGHLIGHTS[simulationStep];
  const hlTerm = hl?.file === active ? hl.term : null;
  const hlLabel = hl ? (isArabic ? hl.label_ar : hl.label_en) : null;
  const lines = (files[active] || '').split('\n');

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden flex flex-col h-full shadow-2xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-950/60 gap-2">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-bold text-white tracking-wide">
            {isArabic ? 'كود الـ Backend · الفحص الأمني' : 'Backend Code · Security Analysis'}
          </span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-[11px] text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> 
            {isArabic ? 'مباشر من GitHub' : 'Live from GitHub'}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {isManualOverride && (
            <button
              onClick={onFollowSimulation}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/40 hover:bg-sky-500/30 transition-all animate-pulse"
              title={isArabic ? 'العودة لمزامنة المحاكاة الحية' : 'Resume live simulation sync'}
            >
              <Play size={11} />
              {isArabic ? 'متابعة التدفق الحي' : 'Follow Simulation'}
            </button>
          )}

          {fetchedAt && <span className="text-xs text-gray-500 hidden sm:inline">{fetchedAt}</span>}
          <button onClick={load} disabled={loading} className="text-gray-500 hover:text-gray-300 disabled:opacity-40 p-1" title="Reload from GitHub">
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800 overflow-x-auto bg-gray-950/30">
        {Object.keys(FILES).map(name => {
          const n = (ANNOTATIONS[name] || []).length;
          return (
            <button key={name} onClick={() => setActive(name)}
              className={`px-3.5 py-2 text-xs font-mono shrink-0 border-b-2 transition-colors ${
                active === name ? 'text-emerald-400 border-emerald-500 bg-emerald-950/20 font-bold' : 'text-gray-500 border-transparent hover:text-gray-300'
              }`}>
              {name}{n > 0 && <span className="ml-1 text-red-400">({n})</span>}
            </button>
          );
        })}
      </div>

      {/* Active Inspection Bar & Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 bg-gray-950/70 border-b border-gray-800 text-xs">
        <div className="flex items-center gap-3">
          <span className="text-gray-500 font-medium">{isArabic ? 'الملاحظات:' : 'Alerts:'}</span>
          <span className="text-red-400 font-mono">🔴 {isArabic ? 'حرج' : 'Critical'}</span>
          <span className="text-yellow-400 font-mono">🟡 {isArabic ? 'تحذير' : 'Warning'}</span>
          <span className="text-blue-400 font-mono">ℹ️ {isArabic ? 'أفضل ممارسة' : 'Best Practice'}</span>
        </div>

        {hlTerm && (
          <div className="flex items-center gap-1.5 text-sky-400 font-medium">
            <Eye size={12} />
            <span>{hlLabel}:</span>
            <code className="font-mono bg-sky-950/50 text-sky-300 px-1.5 py-0.5 rounded border border-sky-800/40 text-[11px]">{hlTerm}</code>
          </div>
        )}
      </div>

      {/* Code body */}
      <div className="overflow-auto flex-1 min-h-[380px] max-h-[500px]">
        {loading && (
          <div className="flex items-center justify-center py-16 gap-2 text-gray-500">
            <RefreshCw size={15} className="animate-spin" />
            <span className="text-sm">{isArabic ? 'جاري جلب الكود المباشر من GitHub...' : 'Fetching code from GitHub...'}</span>
          </div>
        )}
        {err && (
          <div className="flex flex-col items-center py-16 gap-2 text-red-400">
            <AlertCircle size={20} />
            <span className="text-sm">{isArabic ? 'تعذر الاتصال بـ GitHub' : 'Could not reach GitHub'}</span>
            <button onClick={load} className="text-xs text-gray-500 hover:text-gray-300 underline mt-1">
              {isArabic ? 'إعادة المحاولة' : 'Retry'}
            </button>
          </div>
        )}
        {!loading && !err && lines.map((line, i) => {
          const ann = anns.find(a => line.includes(a.match)) || null;
          return (
            <Line 
              key={i} 
              text={line} 
              num={i + 1} 
              ann={ann} 
              highlighted={!!(hlTerm && line.includes(hlTerm))}
              isArabic={isArabic}
            />
          );
        })}
      </div>
    </div>
  );
}
