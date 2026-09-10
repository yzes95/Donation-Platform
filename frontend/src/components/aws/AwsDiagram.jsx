import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { MousePointerClick } from 'lucide-react';

const STEPS_ORDER = ['idle', 'submitting', 'alb', 'ec2', 'rds', 's3', 'complete'];

const TOOLTIPS_EN = {
  browser: {
    title: 'Browser (GitHub Pages)',
    desc: 'The React frontend hosted on GitHub Pages. Sends an HTTPS POST request to the ALB with the new service payload.',
    domain: 'Client',
  },
  igw: {
    title: 'Internet Gateway',
    desc: 'Connects the VPC to the internet. Routes inbound HTTPS traffic from the browser to the ALB in the public subnet.',
    domain: 'Networking',
  },
  alb: {
    title: 'Application Load Balancer',
    desc: 'Receives HTTPS traffic on port 443, terminates SSL (using ACM certificate), then forwards request as HTTP to EC2 target group on port 8000.',
    domain: 'Networking',
  },
  ec2: {
    title: 'EC2 Instance (t2.micro)',
    desc: 'Your virtual server running Amazon Linux. You SSH in, install Docker, and manually run your FastAPI container. Handles API request logic.',
    domain: 'Compute',
  },
  docker: {
    title: 'Docker Container — FastAPI',
    desc: 'Your FastAPI application packaged in a Docker container. Receives request from ALB, validates with Pydantic, talks to RDS and S3.',
    domain: 'Compute',
  },
  rds: {
    title: 'RDS PostgreSQL',
    desc: 'Managed database in a private subnet. FastAPI inserts the new AssistanceNeed record here via SQLAlchemy. Only reachable from EC2 security group.',
    domain: 'Database',
  },
  s3: {
    title: 'S3 Bucket',
    desc: 'After saving to RDS, FastAPI uploads attached verification documents to S3 using the EC2 IAM role — no hardcoded secrets.',
    domain: 'Storage',
  },
  cloudwatch: {
    title: 'CloudWatch Logs',
    desc: 'Passively collects container logs and EC2 metrics via the CloudWatch agent. Not blocking request flow.',
    domain: 'Management',
  },
};

const TOOLTIPS_AR = {
  browser: {
    title: 'المتصفح (GitHub Pages)',
    desc: 'واجهة React المستضافة على GitHub Pages. ترسل طلب HTTPS POST ببيانات حالة الدعم إلى موازن الأحمال ALB.',
    domain: 'العميل',
  },
  igw: {
    title: 'بوابة الإنترنت (Internet Gateway)',
    desc: 'تربط شبكة VPC الافتراضية بالإنترنت العام، وتوجّه حركة HTTPS الواردة إلى موازن ALB في الشبكة الفرعية العامة.',
    domain: 'الشبكات',
  },
  alb: {
    title: 'موازن أحمال التطبيق (ALB)',
    desc: 'يستقبل الاتصال المشفر عبر المنفذ 443، وينهي تشفير SSL بشهادة ACM، ثم يمرر الطلب عبر HTTP إلى حاوية Docker في EC2 على المنفذ 8000.',
    domain: 'الشبكات',
  },
  ec2: {
    title: 'خادم EC2 (t2.micro)',
    desc: 'الخادم الافتراضي الذي تديره يدويًا. تقوم بتثبيت Docker وتشغيل تطبيق FastAPI داخله لمعالجة منطق الطلب البرمجي.',
    domain: 'الحوسبة',
  },
  docker: {
    title: 'حاوية Docker — تطبيق FastAPI',
    desc: 'حاوية معزولة تحتوي كود الـ Backend والمكتبات. تتحقق من صحة البيانات وتسجلها في قاعدة البيانات RDS وتخزن المستندات في S3.',
    domain: 'الحوسبة',
  },
  rds: {
    title: 'قاعدة بيانات RDS PostgreSQL',
    desc: 'قاعدة بيانات مدارة بالكامل داخل شبكة فرعية خاصة معزولة عن الإنترنت، تستقبل تسجيل الحالة وتضمن سلامة المعاملة المالية.',
    domain: 'قواعد البيانات',
  },
  s3: {
    title: 'مستودع التخزين S3 Bucket',
    desc: 'تخزين سحابي للمستندات والتقارير الطبية/الإنسانية لحالة الأسرة، وتتم المصادقة عبر دور IAM الخاص بـ EC2 بدون مفاتيح مكشوفة.',
    domain: 'التخزين',
  },
  cloudwatch: {
    title: 'سجلات CloudWatch Logs',
    desc: 'تجميع ومراقبة سجلات الأخطاء والأداء في الخلفية بدون التأثير على سرعة مسار الطلب.',
    domain: 'الإدارة والمراقبة',
  },
};

const DOMAIN_COLORS = {
  Client: '#9ca3af',
  العميل: '#9ca3af',
  Networking: '#60a5fa',
  الشبكات: '#60a5fa',
  Compute: '#f97316',
  الحوسبة: '#f97316',
  Database: '#a78bfa',
  'قواعد البيانات': '#a78bfa',
  Storage: '#34d399',
  التخزين: '#34d399',
  Management: '#6b7280',
  'الإدارة والمراقبة': '#6b7280',
};

export function AwsDiagram({ simulationStep, selectedNode, onSelectNode }) {
  const { i18n } = useTranslation();
  const isArabic = (i18n.language || 'ar').startsWith('ar');
  const tooltips = isArabic ? TOOLTIPS_AR : TOOLTIPS_EN;

  const [hovered, setHovered] = useState(null);
  const [dotPos, setDotPos] = useState(null);
  const pathRefs = useRef({});

  const stepIdx = STEPS_ORDER.indexOf(simulationStep);

  const isNodeReached = (nodeStep) => {
    if (simulationStep === 'complete') return true;
    const ni = STEPS_ORDER.indexOf(nodeStep);
    return ni <= stepIdx && stepIdx > 0;
  };
  const isNodeCurrent = (nodeStep) => simulationStep === nodeStep;
  const isNodeSelected = (nodeStep) => selectedNode === nodeStep;

  // Animate a dot along the current active path
  useEffect(() => {
    if (simulationStep === 'idle' || simulationStep === 'complete' || simulationStep === 'error') {
      setDotPos(null);
      return;
    }

    const pathKey = simulationStep;
    const pathEl = pathRefs.current[pathKey];
    if (!pathEl) { setDotPos(null); return; }

    const len = pathEl.getTotalLength();
    let raf;
    let start = null;
    const duration = 700;

    const tick = (ts) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      const t = Math.min(elapsed / duration, 1);
      const pt = pathEl.getPointAtLength(t * len);
      setDotPos({ x: pt.x, y: pt.y });
      if (t < 1) raf = requestAnimationFrame(tick);
      else { start = null; raf = requestAnimationFrame(tick); }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [simulationStep]);

  const vw = 900, vh = 520;

  const N = {
    browser:    { x: 50,  y: 240 },
    igw:        { x: 175, y: 240 },
    alb:        { x: 310, y: 240 },
    ec2:        { x: 500, y: 200 },
    docker:     { x: 500, y: 270 },
    rds:        { x: 690, y: 170 },
    s3:         { x: 690, y: 330 },
    cloudwatch: { x: 500, y: 440 },
  };

  const flowPaths = [
    { key: 'submitting', from: N.browser,  to: N.igw,    label: 'HTTPS' },
    { key: 'alb',        from: N.igw,      to: N.alb,    label: '' },
    { key: 'ec2',        from: N.alb,      to: N.docker, label: 'HTTP :8000' },
    { key: 'rds',        from: N.docker,   to: N.rds,    label: 'SQL' },
    { key: 's3',         from: N.rds,      to: N.s3,     label: isArabic ? 'ثم التخزين' : 'then uploads' },
  ];

  const getNodeStroke = (step) => {
    if (isNodeSelected(step)) return '#38bdf8'; // Sky/cyan for user click
    if (isNodeCurrent(step)) return '#34d399'; // Emerald for running step
    if (isNodeReached(step)) return '#22c55e'; // Green for reached
    return '#374151';
  };

  const getNodeGlow = (step) => {
    if (isNodeSelected(step)) return 'drop-shadow(0 0 14px rgba(56,189,248,0.7))';
    if (isNodeCurrent(step)) return 'drop-shadow(0 0 12px rgba(52,211,153,0.5))';
    return '';
  };

  return (
    <div className="bg-[#0a0f1a] border border-gray-800 rounded-2xl overflow-hidden relative shadow-2xl flex flex-col h-full">
      {/* Title bar with click instruction */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 border-b border-gray-800/80 bg-gray-950/60 gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-200 tracking-wide">
            {isArabic ? 'بنية AWS — مسار تدفق الطلب' : 'AWS Architecture — Request Flow'}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <MousePointerClick size={11} />
            {isArabic ? 'انقر على أي مكوّن لفحص كوده المقابل' : 'Click any node to inspect code'}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
            <span className="text-[11px]">{isArabic ? 'المسار النشط' : 'Active Flow'}</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block" />
            <span className="text-[11px]">{isArabic ? 'محدد للفحص' : 'Selected Node'}</span>
          </span>
        </div>
      </div>

      <div className="p-2 flex-1 flex items-center justify-center">
        <svg viewBox={`0 0 ${vw} ${vh}`} className="w-full h-auto max-h-[560px]">
          <defs>
            <marker id="arrowGreen" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <path d="M0,0 L8,3 L0,6" fill="#34d399" />
            </marker>
            <marker id="arrowGray" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <path d="M0,0 L8,3 L0,6" fill="#4b5563" />
            </marker>
          </defs>

          {/* ═══ AWS Cloud boundary ═══ */}
          <rect x="130" y="30" width="750" height="470" rx="12" fill="none" stroke="#1e293b" strokeWidth="2" strokeDasharray="8,4" />
          <text x="145" y="22" fill="#64748b" fontSize="11" fontFamily="monospace" fontWeight="bold">☁ AWS Cloud — us-east-1</text>

          {/* ═══ VPC boundary ═══ */}
          <rect x="150" y="55" width="710" height="390" rx="10" fill="#22c55e" fillOpacity="0.02" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="6,3" />
          <text x="165" y="75" fill="#22c55e" fontSize="10" fontFamily="monospace">VPC — 10.0.0.0/16</text>

          {/* ═══ Public Subnet ═══ */}
          <rect x="165" y="90" width="195" height="290" rx="8" fill="#3b82f6" fillOpacity="0.04" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4,3" />
          <text x="180" y="108" fill="#60a5fa" fontSize="9" fontFamily="monospace">Public Subnet — 10.0.1.0/24</text>
          <text x="180" y="120" fill="#3b82f6" fontSize="8" fontFamily="monospace" opacity="0.6">AZ: us-east-1a</text>

          {/* ═══ Private Subnet (Compute) ═══ */}
          <rect x="380" y="90" width="200" height="290" rx="8" fill="#f97316" fillOpacity="0.03" stroke="#f97316" strokeWidth="1" strokeDasharray="4,3" />
          <text x="395" y="108" fill="#f97316" fontSize="9" fontFamily="monospace">Private Subnet — 10.0.2.0/24</text>
          <text x="395" y="120" fill="#f97316" fontSize="8" fontFamily="monospace" opacity="0.6">AZ: us-east-1a</text>

          {/* ═══ Private Subnet (Data) ═══ */}
          <rect x="600" y="90" width="240" height="290" rx="8" fill="#a78bfa" fillOpacity="0.03" stroke="#a78bfa" strokeWidth="1" strokeDasharray="4,3" />
          <text x="615" y="108" fill="#a78bfa" fontSize="9" fontFamily="monospace">Private Subnet — 10.0.3.0/24</text>
          <text x="615" y="120" fill="#a78bfa" fontSize="8" fontFamily="monospace" opacity="0.6">AZ: us-east-1b</text>

          {/* ═══ Sequential flow paths ═══ */}
          {flowPaths.map((fp) => {
            const reached = isNodeReached(fp.key) || (fp.key === 's3' && isNodeReached('s3'));
            const strokeC = reached ? '#22c55e' : '#374151';
            const mx = (fp.from.x + fp.to.x) / 2;
            const my = (fp.from.y + fp.to.y) / 2;
            return (
              <g key={fp.key}>
                <line
                  x1={fp.from.x + 40} y1={fp.from.y}
                  x2={fp.to.x - 40} y2={fp.to.y}
                  stroke={strokeC} strokeWidth="2"
                  markerEnd={reached ? 'url(#arrowGreen)' : 'url(#arrowGray)'}
                  ref={el => { if (el) pathRefs.current[fp.key] = el; }}
                />
                {fp.label && (
                  <text x={mx} y={my - 8} textAnchor="middle" fill="#6b7280" fontSize="8" fontFamily="monospace">
                    {fp.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* ═══ EC2 / Docker Node (Clickable) ═══ */}
          <g 
            onClick={() => onSelectNode?.('ec2')}
            onMouseEnter={() => setHovered('ec2')}
            onMouseLeave={() => setHovered(null)}
            className="cursor-pointer group"
          >
            {/* Outer EC2 Box */}
            <rect 
              x={N.ec2.x - 55} y={N.ec2.y - 45} width="110" height="140" rx="8"
              fill="#1e1e2e" 
              stroke={getNodeStroke('ec2')} 
              strokeWidth={isNodeSelected('ec2') ? 3 : isNodeCurrent('ec2') ? 2.5 : 1.5}
              style={{ filter: getNodeGlow('ec2') }}
            />
            {/* Header */}
            <rect 
              x={N.ec2.x - 55} y={N.ec2.y - 45} width="110" height="22" rx="8" 
              fill={isNodeSelected('ec2') ? '#0284c7' : isNodeReached('ec2') ? '#22c55e' : '#374151'} 
              fillOpacity="0.2" 
            />
            <text x={N.ec2.x} y={N.ec2.y - 30} textAnchor="middle" fill={isNodeSelected('ec2') ? '#38bdf8' : isNodeReached('ec2') ? '#86efac' : '#9ca3af'} fontSize="10" fontWeight="bold">
              🖥️ EC2 t2.micro
            </text>

            {/* Docker container inside EC2 */}
            <rect 
              x={N.docker.x - 42} y={N.docker.y - 22} width="84" height="44" rx="6"
              fill="#0c4a6e" fillOpacity="0.35" stroke={isNodeSelected('ec2') ? '#38bdf8' : '#0ea5e9'} strokeWidth="1" strokeDasharray="3,2"
            />
            <text x={N.docker.x} y={N.docker.y - 5} textAnchor="middle" fill="#7dd3fc" fontSize="9" fontWeight="bold">🐳 Docker</text>
            <text x={N.docker.x} y={N.docker.y + 12} textAnchor="middle" fill="#38bdf8" fontSize="8">FastAPI :8000</text>

            {isNodeSelected('ec2') && (
              <text x={N.ec2.x} y={N.ec2.y - 52} textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="bold">
                ✓ {isArabic ? 'كود قيد الفحص' : 'Inspecting'}
              </text>
            )}
          </g>

          {/* CloudWatch — passive, below EC2 */}
          <line x1={N.ec2.x} y1={N.ec2.y + 95} x2={N.cloudwatch.x} y2={N.cloudwatch.y - 25}
            stroke="#374151" strokeWidth="1" strokeDasharray="4,3" />
          <text x={N.cloudwatch.x + 30} y={(N.ec2.y + 95 + N.cloudwatch.y - 25) / 2} fill="#4b5563" fontSize="7" fontFamily="monospace">logs (passive)</text>

          {/* ═══ Browser Node (Clickable) ═══ */}
          <g 
            onClick={() => onSelectNode?.('submitting')}
            onMouseEnter={() => setHovered('browser')} 
            onMouseLeave={() => setHovered(null)} 
            className="cursor-pointer group"
          >
            <rect 
              x={N.browser.x - 40} y={N.browser.y - 30} width="80" height="60" rx="8"
              fill="#1e1e2e" 
              stroke={getNodeStroke('submitting')} 
              strokeWidth={isNodeSelected('submitting') ? 3 : isNodeCurrent('submitting') ? 2.5 : 1.5}
              style={{ filter: getNodeGlow('submitting') }}
            />
            <text x={N.browser.x} y={N.browser.y - 8} textAnchor="middle" fill="#e2e8f0" fontSize="18">🌐</text>
            <text x={N.browser.x} y={N.browser.y + 12} textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="bold">Browser</text>
            <text x={N.browser.x} y={N.browser.y + 24} textAnchor="middle" fill="#64748b" fontSize="7">GitHub Pages</text>

            {isNodeSelected('submitting') && (
              <text x={N.browser.x} y={N.browser.y - 36} textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="bold">
                ✓ {isArabic ? 'فحص' : 'Active'}
              </text>
            )}
          </g>

          {/* ═══ Internet Gateway (Clickable) ═══ */}
          <g 
            onClick={() => onSelectNode?.('alb')}
            onMouseEnter={() => setHovered('igw')} 
            onMouseLeave={() => setHovered(null)} 
            className="cursor-pointer group"
          >
            <rect 
              x={N.igw.x - 30} y={N.igw.y - 25} width="60" height="50" rx="6"
              fill="#1e1e2e" 
              stroke={isNodeSelected('alb') ? '#38bdf8' : isNodeReached('submitting') ? '#22c55e' : '#374151'} 
              strokeWidth={isNodeSelected('alb') ? 2.5 : 1.5}
            />
            <text x={N.igw.x} y={N.igw.y - 5} textAnchor="middle" fill="#60a5fa" fontSize="14">🌉</text>
            <text x={N.igw.x} y={N.igw.y + 12} textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">IGW</text>
          </g>

          {/* ═══ ALB (Clickable) ═══ */}
          <g 
            onClick={() => onSelectNode?.('alb')}
            onMouseEnter={() => setHovered('alb')} 
            onMouseLeave={() => setHovered(null)} 
            className="cursor-pointer group"
          >
            <rect 
              x={N.alb.x - 45} y={N.alb.y - 30} width="90" height="60" rx="8"
              fill="#1e1e2e" 
              stroke={getNodeStroke('alb')} 
              strokeWidth={isNodeSelected('alb') ? 3 : isNodeCurrent('alb') ? 2.5 : 1.5}
              style={{ filter: getNodeGlow('alb') }}
            />
            <text x={N.alb.x} y={N.alb.y - 8} textAnchor="middle" fill="#60a5fa" fontSize="16">⚖️</text>
            <text x={N.alb.x} y={N.alb.y + 8} textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="bold">ALB</text>
            <text x={N.alb.x} y={N.alb.y + 20} textAnchor="middle" fill="#64748b" fontSize="7">HTTPS → HTTP</text>

            {isNodeSelected('alb') && (
              <text x={N.alb.x} y={N.alb.y - 36} textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="bold">
                ✓ {isArabic ? 'فحص' : 'Active'}
              </text>
            )}
          </g>

          {/* ═══ RDS (Clickable) ═══ */}
          <g 
            onClick={() => onSelectNode?.('rds')}
            onMouseEnter={() => setHovered('rds')} 
            onMouseLeave={() => setHovered(null)} 
            className="cursor-pointer group"
          >
            <rect 
              x={N.rds.x - 50} y={N.rds.y - 30} width="100" height="60" rx="8"
              fill="#1e1e2e" 
              stroke={getNodeStroke('rds')} 
              strokeWidth={isNodeSelected('rds') ? 3 : isNodeCurrent('rds') ? 2.5 : 1.5}
              style={{ filter: getNodeGlow('rds') }}
            />
            <text x={N.rds.x} y={N.rds.y - 8} textAnchor="middle" fill="#a78bfa" fontSize="16">🗄️</text>
            <text x={N.rds.x} y={N.rds.y + 8} textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="bold">RDS</text>
            <text x={N.rds.x} y={N.rds.y + 20} textAnchor="middle" fill="#64748b" fontSize="7">PostgreSQL</text>

            {isNodeSelected('rds') && (
              <text x={N.rds.x} y={N.rds.y - 36} textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="bold">
                ✓ {isArabic ? 'فحص' : 'Active'}
              </text>
            )}
          </g>

          {/* ═══ S3 (Clickable) ═══ */}
          <g 
            onClick={() => onSelectNode?.('s3')}
            onMouseEnter={() => setHovered('s3')} 
            onMouseLeave={() => setHovered(null)} 
            className="cursor-pointer group"
          >
            <rect 
              x={N.s3.x - 50} y={N.s3.y - 30} width="100" height="60" rx="8"
              fill="#1e1e2e" 
              stroke={getNodeStroke('s3')} 
              strokeWidth={isNodeSelected('s3') ? 3 : isNodeCurrent('s3') ? 2.5 : 1.5}
              style={{ filter: getNodeGlow('s3') }}
            />
            <text x={N.s3.x} y={N.s3.y - 8} textAnchor="middle" fill="#34d399" fontSize="16">🪣</text>
            <text x={N.s3.x} y={N.s3.y + 8} textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="bold">S3</text>
            <text x={N.s3.x} y={N.s3.y + 20} textAnchor="middle" fill="#64748b" fontSize="7">Documents</text>

            {isNodeSelected('s3') && (
              <text x={N.s3.x} y={N.s3.y - 36} textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="bold">
                ✓ {isArabic ? 'فحص' : 'Active'}
              </text>
            )}
          </g>

          {/* ═══ CloudWatch (Clickable) ═══ */}
          <g 
            onClick={() => onSelectNode?.('cloudwatch')}
            onMouseEnter={() => setHovered('cloudwatch')} 
            onMouseLeave={() => setHovered(null)} 
            className="cursor-pointer group"
          >
            <rect 
              x={N.cloudwatch.x - 50} y={N.cloudwatch.y - 20} width="100" height="40" rx="6"
              fill="#1e1e2e" 
              stroke={isNodeSelected('cloudwatch') ? '#38bdf8' : '#374151'} 
              strokeWidth={isNodeSelected('cloudwatch') ? 2.5 : 1} 
              strokeDasharray={isNodeSelected('cloudwatch') ? 'none' : '3,2'}
            />
            <text x={N.cloudwatch.x} y={N.cloudwatch.y + 2} textAnchor="middle" fill="#9ca3af" fontSize="9">📊 CloudWatch</text>
            <text x={N.cloudwatch.x} y={N.cloudwatch.y + 14} textAnchor="middle" fill="#64748b" fontSize="7">Logs & Metrics</text>
          </g>

          {/* Security Group & IAM Role labels */}
          <text x={N.alb.x} y={N.alb.y + 40} textAnchor="middle" fill="#3b82f6" fontSize="7" fontFamily="monospace" opacity="0.6">SG: 443 from 0.0.0.0/0</text>
          <text x={N.ec2.x} y={N.ec2.y + 105} textAnchor="middle" fill="#f97316" fontSize="7" fontFamily="monospace" opacity="0.6">SG: 8000 from ALB-SG only</text>
          <text x={N.rds.x} y={N.rds.y + 40} textAnchor="middle" fill="#a78bfa" fontSize="7" fontFamily="monospace" opacity="0.6">SG: 5432 from EC2-SG only</text>
          <text x={N.s3.x} y={N.s3.y + 40} textAnchor="middle" fill="#34d399" fontSize="7" fontFamily="monospace" opacity="0.6">IAM Role: s3:PutObject</text>

          {/* Step number indicators for the flow */}
          {flowPaths.map((fp, i) => {
            const reached = isNodeReached(fp.key);
            return (
              <g key={'step-' + i}>
                <circle cx={fp.from.x + 40 + 12} cy={fp.from.y - 14} r="8" fill={reached ? '#22c55e' : '#1f2937'} stroke={reached ? '#22c55e' : '#374151'} strokeWidth="1" />
                <text x={fp.from.x + 40 + 12} y={fp.from.y - 11} textAnchor="middle" fill={reached ? '#fff' : '#6b7280'} fontSize="8" fontWeight="bold">{i + 1}</text>
              </g>
            );
          })}

          {/* Animated traveling dot */}
          {dotPos && (
            <circle cx={dotPos.x} cy={dotPos.y} r="5" fill="#34d399" style={{ filter: 'drop-shadow(0 0 6px #34d399)' }}>
              <animate attributeName="r" values="4;6;4" dur="0.6s" repeatCount="indefinite" />
            </circle>
          )}
        </svg>
      </div>

      {/* Floating Tooltip */}
      <AnimatePresence>
        {hovered && tooltips[hovered] && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-3 left-3 right-3 bg-gray-900/95 backdrop-blur border border-gray-700 text-gray-200 text-sm p-3.5 rounded-xl shadow-2xl pointer-events-none z-10"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-bold text-white">{tooltips[hovered].title}</span>
              <span className="text-xs px-1.5 py-0.5 rounded border" style={{
                color: DOMAIN_COLORS[tooltips[hovered].domain],
                borderColor: DOMAIN_COLORS[tooltips[hovered].domain] + '40',
                backgroundColor: DOMAIN_COLORS[tooltips[hovered].domain] + '15',
              }}>
                {tooltips[hovered].domain}
              </span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">{tooltips[hovered].desc}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
