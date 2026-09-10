import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// The correct sequential request flow:
// Browser -> ALB -> EC2/Docker -> RDS (save) -> S3 (upload) -> Response back
// CloudWatch is passive monitoring, NOT a request step.

const STEPS_ORDER = ['idle', 'submitting', 'alb', 'ec2', 'rds', 's3', 'complete'];

const TOOLTIPS = {
  browser: {
    title: 'Browser (GitHub Pages)',
    desc: 'The React frontend hosted on GitHub Pages. Sends an HTTPS POST request to the ALB with the new service data.',
    domain: 'Client',
  },
  igw: {
    title: 'Internet Gateway',
    desc: 'Connects the VPC to the internet. Routes inbound HTTPS traffic from the browser to the ALB in the public subnet.',
    domain: 'Networking',
  },
  alb: {
    title: 'Application Load Balancer',
    desc: 'Receives HTTPS traffic on port 443, terminates SSL (using ACM certificate), then forwards the request as HTTP to the EC2 target group on port 8000.',
    domain: 'Networking',
  },
  ec2: {
    title: 'EC2 Instance (t2.micro)',
    desc: 'Your virtual server running Amazon Linux. You SSH in, install Docker, and manually run your FastAPI container. Handles the API request logic.',
    domain: 'Compute',
  },
  docker: {
    title: 'Docker Container — FastAPI',
    desc: 'Your FastAPI application packaged in a Docker container. Receives the request from ALB, validates it, then talks to RDS and S3.',
    domain: 'Compute',
  },
  rds: {
    title: 'RDS PostgreSQL',
    desc: 'Managed database in a private subnet. FastAPI inserts the new AssistanceNeed record here via SQLAlchemy. No direct internet access — only reachable from EC2 security group.',
    domain: 'Database',
  },
  s3: {
    title: 'S3 Bucket',
    desc: 'After saving to RDS, FastAPI uploads any attached verification documents to S3 using the EC2 instance IAM role — no hardcoded credentials.',
    domain: 'Storage',
  },
  cloudwatch: {
    title: 'CloudWatch Logs',
    desc: 'Passively collects stdout/stderr from the Docker container via the CloudWatch agent. Not part of the request flow — runs in the background continuously.',
    domain: 'Management',
  },
};

const DOMAIN_COLORS = {
  Client: '#9ca3af',
  Networking: '#60a5fa',
  Compute: '#f97316',
  Database: '#a78bfa',
  Storage: '#34d399',
  Management: '#6b7280',
};

export function AwsDiagram({ simulationStep }) {
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

  // Animate a dot along the current active path
  useEffect(() => {
    if (simulationStep === 'idle' || simulationStep === 'complete' || simulationStep === 'error') {
      setDotPos(null);
      return;
    }

    const pathKey = simulationStep; // submitting, alb, ec2, rds, s3
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
      else { start = null; raf = requestAnimationFrame(tick); } // loop
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [simulationStep]);

  // --- Layout constants ---
  // Proper AWS architecture: left-to-right flow with clear boundaries
  const vw = 900, vh = 520;

  // Node positions following proper L->R architecture
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

  // Sequential flow paths (the actual request journey)
  const flowPaths = [
    { key: 'submitting', from: N.browser,  to: N.igw,    label: 'HTTPS' },
    { key: 'alb',        from: N.igw,      to: N.alb,    label: '' },
    { key: 'ec2',        from: N.alb,      to: N.docker, label: 'HTTP :8000' },
    { key: 'rds',        from: N.docker,   to: N.rds,    label: 'SQL' },
    { key: 's3',         from: N.rds,      to: N.s3,     label: 'then uploads' },
  ];

  const nodeStroke = (step) => isNodeCurrent(step) ? '#34d399' : isNodeReached(step) ? '#22c55e' : '#374151';
  const nodeGlow = (step) => isNodeCurrent(step) ? 'drop-shadow(0 0 12px rgba(52,211,153,0.5))' : '';

  return (
    <div className="bg-[#0a0f1a] border border-gray-800 rounded-2xl overflow-hidden relative">
      {/* Title bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-800/60">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">AWS Architecture — Request Flow</span>
        <div className="flex items-center gap-3 text-xs text-gray-600">
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-emerald-500 inline-block rounded" /> Request path</span>
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-gray-600 inline-block rounded border-dashed" style={{borderTop:'1px dashed #4b5563',height:0}} /> Monitoring</span>
        </div>
      </div>

      <svg viewBox={`0 0 ${vw} ${vh}`} className="w-full h-auto" style={{ minHeight: 360 }}>
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
        <text x="145" y="22" fill="#475569" fontSize="11" fontFamily="monospace" fontWeight="bold">☁ AWS Cloud — us-east-1</text>

        {/* ═══ VPC boundary ═══ */}
        <rect x="150" y="55" width="710" height="390" rx="10" fill="#22c55e" fillOpacity="0.02" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="6,3" />
        <text x="165" y="75" fill="#22c55e" fontSize="10" fontFamily="monospace">VPC — 10.0.0.0/16</text>

        {/* ═══ Public Subnet ═══ */}
        <rect x="165" y="90" width="195" height="290" rx="8" fill="#3b82f6" fillOpacity="0.04" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4,3" />
        <text x="180" y="108" fill="#60a5fa" fontSize="9" fontFamily="monospace">Public Subnet — 10.0.1.0/24</text>
        <text x="180" y="120" fill="#3b82f6" fontSize="8" fontFamily="monospace" opacity="0.5">AZ: us-east-1a</text>

        {/* ═══ Private Subnet (Compute) ═══ */}
        <rect x="380" y="90" width="200" height="290" rx="8" fill="#f97316" fillOpacity="0.03" stroke="#f97316" strokeWidth="1" strokeDasharray="4,3" />
        <text x="395" y="108" fill="#f97316" fontSize="9" fontFamily="monospace">Private Subnet — 10.0.2.0/24</text>
        <text x="395" y="120" fill="#f97316" fontSize="8" fontFamily="monospace" opacity="0.5">AZ: us-east-1a</text>

        {/* ═══ Private Subnet (Data) ═══ */}
        <rect x="600" y="90" width="240" height="290" rx="8" fill="#a78bfa" fillOpacity="0.03" stroke="#a78bfa" strokeWidth="1" strokeDasharray="4,3" />
        <text x="615" y="108" fill="#a78bfa" fontSize="9" fontFamily="monospace">Private Subnet — 10.0.3.0/24</text>
        <text x="615" y="120" fill="#a78bfa" fontSize="8" fontFamily="monospace" opacity="0.5">AZ: us-east-1b</text>

        {/* ═══ Connection lines (draw BEFORE nodes so nodes render on top) ═══ */}

        {/* Sequential flow paths */}
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

        {/* EC2 box encloses Docker — draw a bigger rect */}
        <rect x={N.ec2.x - 55} y={N.ec2.y - 45} width="110" height="140" rx="8"
          fill="#1e1e2e" stroke={nodeStroke('ec2')} strokeWidth={isNodeCurrent('ec2') ? 2.5 : 1.5}
          style={{ filter: nodeGlow('ec2') }}
        />
        {/* EC2 header bar */}
        <rect x={N.ec2.x - 55} y={N.ec2.y - 45} width="110" height="22" rx="8" fill={isNodeReached('ec2') ? '#22c55e' : '#374151'} fillOpacity="0.15" />
        <text x={N.ec2.x} y={N.ec2.y - 30} textAnchor="middle" fill={isNodeReached('ec2') ? '#86efac' : '#9ca3af'} fontSize="10" fontWeight="bold">🖥️ EC2 t2.micro</text>

        {/* Docker container inside EC2 */}
        <rect x={N.docker.x - 42} y={N.docker.y - 22} width="84" height="44" rx="6"
          fill="#0c4a6e" fillOpacity="0.3" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="3,2"
        />
        <text x={N.docker.x} y={N.docker.y - 5} textAnchor="middle" fill="#7dd3fc" fontSize="9" fontWeight="bold">🐳 Docker</text>
        <text x={N.docker.x} y={N.docker.y + 12} textAnchor="middle" fill="#38bdf8" fontSize="8">FastAPI :8000</text>

        {/* CloudWatch — passive, below EC2 */}
        <line x1={N.ec2.x} y1={N.ec2.y + 95} x2={N.cloudwatch.x} y2={N.cloudwatch.y - 25}
          stroke="#374151" strokeWidth="1" strokeDasharray="4,3" />
        <text x={N.cloudwatch.x + 30} y={(N.ec2.y + 95 + N.cloudwatch.y - 25) / 2} fill="#4b5563" fontSize="7" fontFamily="monospace">logs (passive)</text>

        {/* ═══ Individual nodes ═══ */}

        {/* Browser — outside VPC */}
        <g onMouseEnter={() => setHovered('browser')} onMouseLeave={() => setHovered(null)} className="cursor-pointer">
          <rect x={N.browser.x - 40} y={N.browser.y - 30} width="80" height="60" rx="8"
            fill="#1e1e2e" stroke={nodeStroke('submitting')} strokeWidth={isNodeCurrent('submitting') ? 2.5 : 1.5}
            style={{ filter: nodeGlow('submitting') }}
          />
          <text x={N.browser.x} y={N.browser.y - 8} textAnchor="middle" fill="#e2e8f0" fontSize="18">🌐</text>
          <text x={N.browser.x} y={N.browser.y + 12} textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="bold">Browser</text>
          <text x={N.browser.x} y={N.browser.y + 24} textAnchor="middle" fill="#64748b" fontSize="7">GitHub Pages</text>
        </g>

        {/* Internet Gateway */}
        <g onMouseEnter={() => setHovered('igw')} onMouseLeave={() => setHovered(null)} className="cursor-pointer">
          <rect x={N.igw.x - 30} y={N.igw.y - 25} width="60" height="50" rx="6"
            fill="#1e1e2e" stroke={isNodeReached('submitting') ? '#22c55e' : '#374151'} strokeWidth="1.5"
          />
          <text x={N.igw.x} y={N.igw.y - 5} textAnchor="middle" fill="#60a5fa" fontSize="14">🌉</text>
          <text x={N.igw.x} y={N.igw.y + 12} textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">IGW</text>
        </g>

        {/* ALB */}
        <g onMouseEnter={() => setHovered('alb')} onMouseLeave={() => setHovered(null)} className="cursor-pointer">
          <rect x={N.alb.x - 45} y={N.alb.y - 30} width="90" height="60" rx="8"
            fill="#1e1e2e" stroke={nodeStroke('alb')} strokeWidth={isNodeCurrent('alb') ? 2.5 : 1.5}
            style={{ filter: nodeGlow('alb') }}
          />
          <text x={N.alb.x} y={N.alb.y - 8} textAnchor="middle" fill="#60a5fa" fontSize="16">⚖️</text>
          <text x={N.alb.x} y={N.alb.y + 8} textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="bold">ALB</text>
          <text x={N.alb.x} y={N.alb.y + 20} textAnchor="middle" fill="#64748b" fontSize="7">HTTPS → HTTP</text>
        </g>

        {/* EC2 node hover target (invisible overlay on the whole EC2+Docker group) */}
        <rect x={N.ec2.x - 55} y={N.ec2.y - 45} width="110" height="140" rx="8" fill="transparent"
          onMouseEnter={() => setHovered('ec2')} onMouseLeave={() => setHovered(null)} className="cursor-pointer"
        />

        {/* RDS */}
        <g onMouseEnter={() => setHovered('rds')} onMouseLeave={() => setHovered(null)} className="cursor-pointer">
          <rect x={N.rds.x - 50} y={N.rds.y - 30} width="100" height="60" rx="8"
            fill="#1e1e2e" stroke={nodeStroke('rds')} strokeWidth={isNodeCurrent('rds') ? 2.5 : 1.5}
            style={{ filter: nodeGlow('rds') }}
          />
          <text x={N.rds.x} y={N.rds.y - 8} textAnchor="middle" fill="#a78bfa" fontSize="16">🗄️</text>
          <text x={N.rds.x} y={N.rds.y + 8} textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="bold">RDS</text>
          <text x={N.rds.x} y={N.rds.y + 20} textAnchor="middle" fill="#64748b" fontSize="7">PostgreSQL</text>
        </g>

        {/* S3 */}
        <g onMouseEnter={() => setHovered('s3')} onMouseLeave={() => setHovered(null)} className="cursor-pointer">
          <rect x={N.s3.x - 50} y={N.s3.y - 30} width="100" height="60" rx="8"
            fill="#1e1e2e" stroke={nodeStroke('s3')} strokeWidth={isNodeCurrent('s3') ? 2.5 : 1.5}
            style={{ filter: nodeGlow('s3') }}
          />
          <text x={N.s3.x} y={N.s3.y - 8} textAnchor="middle" fill="#34d399" fontSize="16">🪣</text>
          <text x={N.s3.x} y={N.s3.y + 8} textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="bold">S3</text>
          <text x={N.s3.x} y={N.s3.y + 20} textAnchor="middle" fill="#64748b" fontSize="7">Documents</text>
        </g>

        {/* CloudWatch */}
        <g onMouseEnter={() => setHovered('cloudwatch')} onMouseLeave={() => setHovered(null)} className="cursor-pointer">
          <rect x={N.cloudwatch.x - 50} y={N.cloudwatch.y - 20} width="100" height="40" rx="6"
            fill="#1e1e2e" stroke="#374151" strokeWidth="1" strokeDasharray="3,2"
          />
          <text x={N.cloudwatch.x} y={N.cloudwatch.y + 2} textAnchor="middle" fill="#6b7280" fontSize="9">📊 CloudWatch</text>
          <text x={N.cloudwatch.x} y={N.cloudwatch.y + 14} textAnchor="middle" fill="#4b5563" fontSize="7">Logs & Metrics</text>
        </g>

        {/* Security Group labels */}
        <text x={N.alb.x} y={N.alb.y + 40} textAnchor="middle" fill="#3b82f6" fontSize="7" fontFamily="monospace" opacity="0.6">SG: 443 from 0.0.0.0/0</text>
        <text x={N.ec2.x} y={N.ec2.y + 105} textAnchor="middle" fill="#f97316" fontSize="7" fontFamily="monospace" opacity="0.6">SG: 8000 from ALB-SG only</text>
        <text x={N.rds.x} y={N.rds.y + 40} textAnchor="middle" fill="#a78bfa" fontSize="7" fontFamily="monospace" opacity="0.6">SG: 5432 from EC2-SG only</text>

        {/* IAM Role annotation */}
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

      {/* Tooltip */}
      <AnimatePresence>
        {hovered && TOOLTIPS[hovered] && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-3 left-3 right-3 bg-gray-900/95 backdrop-blur border border-gray-700 text-gray-200 text-sm p-3.5 rounded-xl shadow-2xl pointer-events-none"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-bold text-white">{TOOLTIPS[hovered].title}</span>
              <span className="text-xs px-1.5 py-0.5 rounded border" style={{
                color: DOMAIN_COLORS[TOOLTIPS[hovered].domain],
                borderColor: DOMAIN_COLORS[TOOLTIPS[hovered].domain] + '40',
                backgroundColor: DOMAIN_COLORS[TOOLTIPS[hovered].domain] + '15',
              }}>
                {TOOLTIPS[hovered].domain}
              </span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">{TOOLTIPS[hovered].desc}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
