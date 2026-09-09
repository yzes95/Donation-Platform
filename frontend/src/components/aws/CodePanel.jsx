import { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';

const FILES = {
  'main.py':       'https://raw.githubusercontent.com/yzes95/Donation-Platform-Backend/main/main.py',
  'settings.py':   'https://raw.githubusercontent.com/yzes95/Donation-Platform-Backend/main/config/settings.py',
  'admin.py':      'https://raw.githubusercontent.com/yzes95/Donation-Platform-Backend/main/routes/admin.py',
  'connection.py': 'https://raw.githubusercontent.com/yzes95/Donation-Platform-Backend/main/database/connection.py',
  'service.py':    'https://raw.githubusercontent.com/yzes95/Donation-Platform-Backend/main/models/service.py',
};

const ANNOTATIONS = {
  'main.py': [
    { match: 'allow_origins', type: 'warning', msg: 'CORS: ensure allow_origins is a strict whitelist in production — never use ["*"]' },
  ],
  'settings.py': [
    { match: 'DEBUG: bool = True', type: 'critical', msg: '🔴 CRITICAL — DEBUG=True exposes the full Python stack trace to anyone who triggers a 500 error in production' },
    { match: 'DATABASE_URL', type: 'warning', msg: '🟡 Database credentials should live in AWS Secrets Manager or Parameter Store — not a .env file on the server' },
    { match: 'SECRET_KEY', type: 'critical', msg: '🔴 This fallback secret is hardcoded and visible in your public GitHub repo — an attacker can forge valid JWT tokens using it' },
    { match: 'change-this', type: 'critical', msg: '🔴 Plaintext secret committed to git history — rotate immediately and load from Secrets Manager instead' },
  ],
  'admin.py': [
    { match: 'async def admin_test', type: 'critical', msg: '🔴 NO AUTH — This admin endpoint has no authentication dependency. Anyone on the internet can call it freely.' },
  ],
  'connection.py': [
    { match: 'echo=settings.DEBUG', type: 'warning', msg: '🟡 SQLAlchemy echo=True writes every SQL query to stdout — in production this leaks your schema structure to CloudWatch logs' },
  ],
  'service.py': [
    { match: 'Float', type: 'info', msg: 'ℹ️ Float uses IEEE 754 — financial amounts like 3500.00 can be stored as 3499.99999... Use Numeric(12,2) for money fields' },
  ],
};

const STEP_HIGHLIGHTS = {
  submitting: { file: 'main.py',       term: 'include_router' },
  ec2:        { file: 'admin.py',      term: 'admin_test' },
  rds:        { file: 'connection.py', term: 'get_db' },
  s3:         { file: 'service.py',    term: 'Float' },
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

function Line({ text, num, ann, highlighted }) {
  const [tip, setTip] = useState(false);
  const s = ann ? ANN_STYLE[ann.type] : null;

  return (
    <div className={`relative flex border-l-2 hover:bg-white/[0.02] transition-colors ${
      highlighted ? 'bg-emerald-900/15' : ''
    } ${s ? `${s.border} ${s.bg}` : 'border-transparent'}`}>
      <span className="select-none w-10 text-right pr-3 py-0.5 text-gray-700 text-xs shrink-0 leading-5">{num}</span>
      <pre className={`flex-1 py-0.5 pr-2 text-xs leading-5 whitespace-pre ${getLineClass(text)}`}>{text}</pre>
      {s && (
        <div className="relative flex items-center shrink-0 pr-2">
          <button onMouseEnter={() => setTip(true)} onMouseLeave={() => setTip(false)} className="text-xs px-1">
            {s.icon}
          </button>
          {tip && (
            <div className={`absolute right-7 top-0 z-50 w-72 border text-xs p-2.5 rounded-lg shadow-2xl leading-relaxed text-gray-200 ${s.tip}`}>
              {ann.msg}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function CodePanel({ simulationStep }) {
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
  const lines = (files[active] || '').split('\n');

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-white">Backend Code · Security Analysis</span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-xs text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live from GitHub
          </span>
        </div>
        <div className="flex items-center gap-3">
          {fetchedAt && <span className="text-xs text-gray-600">at {fetchedAt}</span>}
          <button onClick={load} disabled={loading} className="text-gray-500 hover:text-gray-300 disabled:opacity-40">
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800 overflow-x-auto">
        {Object.keys(FILES).map(name => {
          const n = (ANNOTATIONS[name] || []).length;
          return (
            <button key={name} onClick={() => setActive(name)}
              className={`px-4 py-2 text-xs font-mono shrink-0 border-b-2 transition-colors ${
                active === name ? 'text-emerald-400 border-emerald-500 bg-emerald-950/10' : 'text-gray-500 border-transparent hover:text-gray-300'
              }`}>
              {name}{n > 0 && <span className="ml-1.5 text-red-400">({n})</span>}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 px-4 py-1.5 bg-gray-950/40 border-b border-gray-800 text-xs">
        <span className="text-gray-600">Annotations:</span>
        <span className="text-red-400">🔴 Critical</span>
        <span className="text-yellow-400">🟡 Warning</span>
        <span className="text-blue-400">ℹ️ Best practice</span>
        {hlTerm && <span className="ml-auto text-emerald-500">▶ Step highlight: <code className="font-mono">{hlTerm}</code></span>}
      </div>

      {/* Code body */}
      <div className="overflow-auto" style={{ maxHeight: '420px' }}>
        {loading && (
          <div className="flex items-center justify-center py-14 gap-2 text-gray-500">
            <RefreshCw size={14} className="animate-spin" />
            <span className="text-sm">Fetching from GitHub…</span>
          </div>
        )}
        {err && (
          <div className="flex flex-col items-center py-14 gap-2 text-red-400">
            <AlertCircle size={18} />
            <span className="text-sm">Could not reach GitHub — check connection.</span>
            <button onClick={load} className="text-xs text-gray-500 hover:text-gray-300 underline mt-1">Retry</button>
          </div>
        )}
        {!loading && !err && lines.map((line, i) => {
          const ann = anns.find(a => line.includes(a.match)) || null;
          return <Line key={i} text={line} num={i + 1} ann={ann} highlighted={!!(hlTerm && line.includes(hlTerm))} />;
        })}
      </div>
    </div>
  );
}
