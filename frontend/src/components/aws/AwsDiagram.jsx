import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const AwsDiagram = ({ simulationStep }) => {
  const [hoveredNode, setHoveredNode] = useState(null);

  const nodes = {
    browser: { cx: 60, cy: 240, label: 'Browser', icon: '🌐', id: 'submitting' },
    alb: { cx: 220, cy: 240, label: 'ALB', sublabel: 'Load Balancer', id: 'alb' },
    ec2: { cx: 420, cy: 160, label: 'EC2', sublabel: 't2.micro', id: 'ec2' },
    rds: { cx: 640, cy: 100, label: 'RDS', sublabel: 'PostgreSQL', id: 'rds' },
    s3: { cx: 640, cy: 300, label: 'S3', sublabel: 'Documents', id: 's3' },
    cw: { cx: 780, cy: 420, label: 'CloudWatch', sublabel: 'Logs', id: 'cw', dim: true },
  };

  const tooltips = {
    browser: "The React frontend hosted on GitHub Pages. Makes HTTPS requests to the ALB.",
    alb: "Application Load Balancer — Receives HTTPS traffic, terminates SSL, forwards to EC2 on port 8000. Lives in the public subnet.",
    ec2: "t2.micro EC2 instance running Docker. You SSH in, install Docker, run your FastAPI container manually. CCP Domain: Compute.",
    rds: "Amazon RDS with PostgreSQL engine. Lives in private subnet — no direct internet access. CCP Domain: Database.",
    s3: "Simple Storage Service — stores family verification documents. Accessed via IAM role (no access keys needed). CCP Domain: Storage.",
    cw: "Collects logs from your Docker container and EC2. Set up alarms for errors or high CPU. CCP Domain: Management.",
  };

  const isActive = (nodeId) => {
    if (simulationStep === 'complete') return true;
    if (simulationStep === 'error') return false;
    
    const steps = ['idle', 'submitting', 'alb', 'ec2', 'rds', 's3', 'complete'];
    const currentIdx = steps.indexOf(simulationStep);
    const nodeIdx = steps.indexOf(nodeId);
    
    return nodeIdx <= currentIdx && currentIdx > 0;
  };

  const isCurrentStep = (nodeId) => simulationStep === nodeId;

  // Paths for connection lines
  const paths = {
    submitting: `M ${nodes.browser.cx + 35} ${nodes.browser.cy} L ${nodes.alb.cx - 35} ${nodes.alb.cy}`,
    alb: `M ${nodes.alb.cx + 35} ${nodes.alb.cy} L ${nodes.ec2.cx - 35} ${nodes.ec2.cy}`,
    ec2: `M ${nodes.ec2.cx + 35} ${nodes.ec2.cy} L ${nodes.rds.cx - 35} ${nodes.rds.cy}`,
    s3: `M ${nodes.ec2.cx + 35} ${nodes.ec2.cy} L ${nodes.s3.cx - 35} ${nodes.s3.cy}`,
  };

  return (
    <div className="bg-[#030712] border border-gray-800 rounded-xl overflow-hidden relative">
      <svg viewBox="0 0 860 480" className="w-full h-auto">
        {/* VPC Boundary */}
        <rect x="170" y="50" width="670" height="390" rx="8" fill="#4ade80" fillOpacity="0.02" stroke="#4ade80" strokeWidth="2" strokeDasharray="5,5" />
        <text x="180" y="70" fill="#4ade80" fontSize="12" fontFamily="monospace">VPC — 10.0.0.0/16</text>

        {/* Public Subnet */}
        <rect x="180" y="60" width="130" height="370" rx="8" fill="#60a5fa" fillOpacity="0.03" stroke="#60a5fa" strokeWidth="1" strokeDasharray="3,3" />
        <text x="190" y="80" fill="#60a5fa" fontSize="10" fontFamily="monospace">Public Subnet</text>

        {/* Private Subnet 1 */}
        <rect x="320" y="60" width="160" height="270" rx="8" fill="#a78bfa" fillOpacity="0.03" stroke="#a78bfa" strokeWidth="1" strokeDasharray="3,3" />
        <text x="330" y="80" fill="#a78bfa" fontSize="10" fontFamily="monospace">Private Subnet</text>

        {/* Private Subnet 2 */}
        <rect x="490" y="60" width="330" height="370" rx="8" fill="#f59e0b" fillOpacity="0.03" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3,3" />
        
        {/* Connection Lines */}
        <path d={paths.submitting} stroke="#374151" strokeWidth="2" fill="none" />
        <path d={paths.alb} stroke="#374151" strokeWidth="2" fill="none" />
        <path d={paths.ec2} stroke="#374151" strokeWidth="2" fill="none" />
        <path d={paths.s3} stroke="#374151" strokeWidth="2" fill="none" />
        <path d={`M ${nodes.ec2.cx + 20} ${nodes.ec2.cy + 35} L ${nodes.cw.cx - 20} ${nodes.cw.cy - 20}`} stroke="#374151" strokeWidth="2" strokeDasharray="4,4" fill="none" />

        {/* Animated Dots */}
        {['submitting', 'alb', 'ec2', 'rds'].includes(simulationStep) && paths[simulationStep] && (
          <motion.circle
            r="6"
            fill="#34d399"
            style={{ filter: 'drop-shadow(0 0 4px #34d399)' }}
            initial={{ offsetDistance: "0%" }}
            animate={{ offsetDistance: "100%" }}
            transition={{ duration: 0.8, ease: "linear", repeat: Infinity }}
            style={{ offsetPath: `path('${paths[simulationStep === 'rds' ? 'ec2' : simulationStep]}')` }}
          />
        )}
        
        {/* Special case for S3 step animating from EC2 to S3 */}
        {simulationStep === 's3' && (
          <motion.circle
            r="6"
            fill="#34d399"
            style={{ filter: 'drop-shadow(0 0 4px #34d399)' }}
            initial={{ offsetDistance: "0%" }}
            animate={{ offsetDistance: "100%" }}
            transition={{ duration: 0.8, ease: "linear", repeat: Infinity }}
            style={{ offsetPath: `path('${paths.s3}')` }}
          />
        )}

        {/* Nodes */}
        {Object.entries(nodes).map(([key, node]) => {
          const active = isActive(node.id);
          const current = isCurrentStep(node.id);
          const boxW = 80;
          const boxH = node.sublabel ? 70 : 60;
          
          return (
            <g 
              key={key} 
              onMouseEnter={() => setHoveredNode(key)} 
              onMouseLeave={() => setHoveredNode(null)}
              className="cursor-pointer transition-all duration-300"
            >
              <rect 
                x={node.cx - boxW/2} 
                y={node.cy - boxH/2} 
                width={boxW} 
                height={boxH} 
                rx="8" 
                fill="#1f2937" 
                stroke={active ? '#34d399' : '#4b5563'} 
                strokeWidth={active ? 3 : 2}
                filter={current ? 'drop-shadow(0 0 10px rgba(52, 211, 153, 0.4))' : ''}
              />
              
              {/* Docker box inside EC2 */}
              {key === 'ec2' && (
                <rect 
                  x={node.cx - 30} 
                  y={node.cy + 10} 
                  width={60} 
                  height={18} 
                  rx="4" 
                  fill="#0ea5e9" 
                  fillOpacity="0.2" 
                  stroke="#0ea5e9" 
                  strokeWidth="1" 
                />
              )}
              {key === 'ec2' && (
                <text x={node.cx} y={node.cy + 22} textAnchor="middle" fill="#7dd3fc" fontSize="9" fontWeight="bold">🐳 FastAPI</text>
              )}

              <text x={node.cx} y={node.cy - (node.sublabel ? 5 : -5)} textAnchor="middle" fill={node.dim ? '#9ca3af' : '#ffffff'} fontSize="14" fontWeight="bold">
                {node.icon && `${node.icon} `}{node.label}
              </text>
              
              {node.sublabel && (
                <text x={node.cx} y={key === 'ec2' ? node.cy + 5 : node.cy + 15} textAnchor="middle" fill="#9ca3af" fontSize="10">{node.sublabel}</text>
              )}
            </g>
          );
        })}
      </svg>

      <AnimatePresence>
        {hoveredNode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute bottom-4 left-4 right-4 bg-gray-800 border border-gray-700 text-gray-200 text-sm p-3 rounded-lg shadow-xl pointer-events-none"
          >
            <span className="font-bold text-emerald-400 mr-2">{nodes[hoveredNode].label}:</span>
            {tooltips[hoveredNode]}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
