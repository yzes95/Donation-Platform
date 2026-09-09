import { useState, useEffect } from 'react';
import { AlertTriangle, Info, ShieldAlert } from 'lucide-react';

const ANNOTATIONS = {
  'main.py': [
    { match: 'allow_origins', type: 'warning', msg: 'CORS: ensure origins are restrictive in production — never use ["*"]' },
    { match: 'DEBUG', type: 'info', msg: 'DEBUG setting should be forced False in production builds' },
  ],
  'settings.py': [
    { match: 'DEBUG: bool = True', type: 'critical', msg: '🔴 CRITICAL: DEBUG=True exposes full stack traces to anyone who triggers a 500 error' },
    { match: 'DATABASE_URL', type: 'warning', msg: '🟡 Store database credentials in AWS Secrets Manager, not environment variables' },
    { match: 'SECRET_KEY', type: 'critical', msg: '🔴 Hardcoded fallback secret key — rotate and store in Secrets Manager in production' },
    { match: 'change-this', type: 'critical', msg: '🔴 This plaintext fallback key is visible in your public GitHub repo!' },
  ],
  'admin.py': [
    { match: 'async def admin_test', type: 'critical', msg: '🔴 NO AUTHENTICATION: This endpoint is fully public — anyone can call GET /api/v1/admin/test' },
    { match: 'GET /api/v1/admin', type: 'critical', msg: '🔴 Admin endpoints must require authentication dependency (get_current_admin)' },
  ],
  'connection.py': [
    { match: 'echo=settings.DEBUG', type: 'warning', msg: '🟡 SQLAlchemy echo=True logs every SQL query — disable in production to avoid leaking schema details' },
  ],
  'service.py': [
    { match: 'Float', type: 'info', msg: 'ℹ️ Use Numeric/Decimal for financial amounts — Float has precision errors (e.g., 3500.01 stored as 3499.999...)' },
  ],
};

const FILES = [
  { name: 'main.py', url: 'https://raw.githubusercontent.com/yzes95/Donation-Platform-Backend/main/main.py' },
  { name: 'settings.py', url: 'https://raw.githubusercontent.com/yzes95/Donation-Platform-Backend/main/config/settings.py' },
  { name: 'admin.py', url: 'https://raw.githubusercontent.com/yzes95/Donation-Platform-Backend/main/routes/admin.py' },
  { name: 'connection.py', url: 'https://raw.githubusercontent.com/yzes95/Donation-Platform-Backend/main/database/connection.py' },
  { name: 'service.py', url: 'https://raw.githubusercontent.com/yzes95/Donation-Platform-Backend/main/models/service.py' }
];

export const CodePanel = ({ simulationStep }) => {
  const [activeTab, setActiveTab] = useState('main.py');
  const [fileData, setFileData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const results = await Promise.all(
          FILES.map(async (file) => {
            const res = await fetch(file.url);
            if (!res.ok) throw new Error(`Failed to fetch ${file.name}`);
            const text = await res.text();
            return { name: file.name, content: text };
          })
        );
        const dataMap = {};
        results.forEach(r => { dataMap[r.name] = r.content; });
        setFileData(dataMap);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, []);

  useEffect(() => {
    if (simulationStep === 'submitting') setActiveTab('main.py');
    else if (simulationStep === 'ec2') setActiveTab('admin.py');
    else if (simulationStep === 'rds') setActiveTab('connection.py');
    else if (simulationStep === 's3') setActiveTab('service.py');
  }, [simulationStep]);

  const syntaxHighlight = (line) => {
    const keywords = ['from ', 'import ', 'class ', 'def ', 'async ', 'return ', 'if ', 'else:', 'try:', 'except ', 'await ', 'pass'];
    let html = line.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    if (html.trim().startsWith('#')) {
      return `<span class="text-gray-500 italic">${html}</span>`;
    }

    keywords.forEach(kw => {
      const regex = new RegExp(`\\b${kw.trim()}\\b`, 'g');
      html = html.replace(regex, `<span class="text-emerald-400">$&</span>`);
    });

    html = html.replace(/(['"])(.*?)\1/g, '<span class="text-amber-300">$&</span>');

    return html;
  };

  const getStepHighlights = (filename) => {
    if (simulationStep === 'submitting' && filename === 'main.py') return ['include_router'];
    if (simulationStep === 'ec2' && filename === 'admin.py') return ['admin_test'];
    if (simulationStep === 'rds' && filename === 'connection.py') return ['get_db'];
    if (simulationStep === 's3' && filename === 'service.py') return ['Float', 'target_amount'];
    return [];
  };

  if (loading) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl h-96 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          <span className="text-gray-500 text-sm">Fetching source from GitHub...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl h-96 flex items-center justify-center text-red-400">
        <ShieldAlert className="w-6 h-6 mr-2" />
        Failed to fetch code from GitHub
      </div>
    );
  }

  const activeContent = fileData[activeTab] || '';
  const lines = activeContent.split('\n');
  const fileAnnos = ANNOTATIONS[activeTab] || [];
  const highlights = getStepHighlights(activeTab);

  return (
    <div className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden flex flex-col h-[500px]">
      <div className="flex items-center justify-between bg-gray-900 border-b border-gray-800 px-4 pt-2 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {FILES.map(f => (
            <button
              key={f.name}
              onClick={() => setActiveTab(f.name)}
              className={`px-4 py-2 text-sm font-mono rounded-t-lg transition-colors ${activeTab === f.name ? 'bg-gray-800 text-emerald-400 border-b-2 border-emerald-500' : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'}`}
            >
              {f.name}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-xs bg-emerald-900/20 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20 ml-4 shrink-0 mb-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Live from GitHub
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-gray-950 p-4 font-mono text-sm">
        {lines.map((line, i) => {
          const anno = fileAnnos.find(a => line.includes(a.match));
          const isHighlighted = highlights.some(h => line.includes(h));
          
          return (
            <div key={i} className={`flex group relative ${isHighlighted ? 'bg-emerald-900/40' : 'hover:bg-gray-900/50'} ${anno ? (anno.type === 'critical' ? 'border-l-2 border-red-500 bg-red-950/20' : 'border-l-2 border-yellow-500 bg-yellow-950/10') : 'border-l-2 border-transparent'}`}>
              <div className="w-10 shrink-0 text-right pr-4 text-gray-600 select-none">{i + 1}</div>
              <div className="flex-1 whitespace-pre text-gray-200" dangerouslySetInnerHTML={{ __html: syntaxHighlight(line) }} />
              
              {anno && (
                <div className="relative flex items-center pr-2">
                  {anno.type === 'critical' ? (
                    <ShieldAlert className="w-4 h-4 text-red-500 cursor-help" />
                  ) : anno.type === 'warning' ? (
                    <AlertTriangle className="w-4 h-4 text-yellow-500 cursor-help" />
                  ) : (
                    <Info className="w-4 h-4 text-blue-400 cursor-help" />
                  )}
                  
                  <div className="absolute right-8 top-1/2 -translate-y-1/2 w-64 bg-gray-800 border border-gray-700 p-2 rounded shadow-xl text-xs text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 font-sans">
                    {anno.msg}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
