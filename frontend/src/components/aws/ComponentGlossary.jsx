import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const DEEP = [
  { id:'vpc',    icon:'🌐', name:'VPC',       full:'Virtual Private Cloud',    domain:'Networking', dc:'blue',
    desc:'Your private isolated network on AWS. Everything — EC2, RDS — lives inside it. Think of it as your own data center in the cloud.',
    detail:'Contains public and private subnets. Public subnet exposes the ALB to the internet. Private subnets keep EC2 and RDS hidden from direct internet access.',
    ccp:'Covered in CCP Domain 2: Security and Domain 3: Technology. Know: subnets, route tables, internet gateways, and NAT gateways.' },
  { id:'subnet', icon:'🔲', name:'Subnets',   full:'Public & Private Subnets', domain:'Networking', dc:'blue',
    desc:'Sub-divisions of your VPC. Public subnets have a route to the internet via Internet Gateway. Private subnets have no direct internet route.',
    detail:'ALB lives in the public subnet. EC2 and RDS live in private subnets — reachable only from within the VPC. This limits the blast radius of any compromise.',
    ccp:'Subnets and routing tables are key CCP exam topics. Understand: public vs private, CIDR blocks, and how route tables define traffic flow.' },
  { id:'sg',     icon:'🔒', name:'Security Groups', full:'Virtual Firewalls', domain:'Security', dc:'red',
    desc:'Stateful firewall rules applied to your AWS resources. You define which ports and IP ranges are allowed in (inbound) and out (outbound).',
    detail:'ALB SG: allows 443 from 0.0.0.0/0. EC2 SG: allows port 8000 only from the ALB security group — not from the internet. RDS SG: allows 5432 only from EC2 SG.',
    ccp:'Major CCP Security domain topic. Key distinction: Security Groups are stateful (response traffic is automatically allowed). NACLs are stateless and apply to subnets.' },
  { id:'alb',    icon:'⚖️', name:'ALB',       full:'Application Load Balancer', domain:'Networking', dc:'blue',
    desc:'Receives HTTPS requests from the internet, terminates SSL, and routes them to your EC2 instance on port 8000.',
    detail:'You attach an ACM SSL certificate to the ALB. The ALB talks to EC2 over plain HTTP inside the VPC — safe because traffic never leaves the AWS network boundary.',
    ccp:'Covered in CCP Technology domain. Know the difference: ALB operates at Layer 7 (HTTP/HTTPS), NLB at Layer 4 (TCP/UDP). ALB supports path-based and host-based routing.' },
  { id:'ec2',    icon:'🖥️', name:'EC2',       full:'Elastic Compute Cloud',     domain:'Compute',   dc:'orange',
    desc:'Your virtual server on AWS. You SSH in, install Docker, and run your FastAPI container. You manage the OS and runtime yourself.',
    detail:'Unlike Fargate (serverless containers), EC2 gives you full control and visibility — ideal for learning AWS fundamentals hands-on. You manage patching, scaling, and the container runtime.',
    ccp:'Most important service in CCP Compute domain. Study: instance types (t, m, c families), pricing models (On-Demand, Reserved, Spot, Savings Plans), AMIs, and instance lifecycle.' },
  { id:'docker', icon:'🐳', name:'Docker',    full:'Containerization on EC2',   domain:'Compute',   dc:'orange',
    desc:'Packages your FastAPI app — Python runtime, libraries, and code — into a portable container that runs identically everywhere.',
    detail:'You run: docker build -t ataa-backend . then docker run -d -p 8000:8000 ataa-backend. The EC2 instance is the host. This is the foundation before moving to ECS or Fargate.',
    ccp:'Containers are in the CCP Technology domain. Understand why they exist (dependency isolation, portability) and how AWS ECS/Fargate build on top of Docker.' },
  { id:'rds',    icon:'🗄️', name:'RDS',       full:'Relational Database Service', domain:'Database', dc:'purple',
    desc:'Managed PostgreSQL database. AWS handles automated backups, patching, and failover. Lives in a private subnet — no direct internet access.',
    detail:'FastAPI connects via the private RDS endpoint URL using SQLAlchemy async. Port 5432 is never exposed to the internet — accessible only from the EC2 security group.',
    ccp:'Covered in CCP Technology domain. Know: managed vs self-managed on EC2, automated backups, Multi-AZ deployments, and Read Replicas.' },
  { id:'s3',     icon:'🪣', name:'S3',        full:'Simple Storage Service',     domain:'Storage',   dc:'green',
    desc:'Object storage for family verification documents (PDFs, images). Accessed from EC2 using an IAM Role — no hardcoded access keys needed.',
    detail:'Never store AWS credentials on the EC2 instance. Attach an IAM Instance Profile (Role) with s3:PutObject permission scoped to the specific bucket. AWS SDK auto-discovers the role.',
    ccp:'One of the most important CCP services. Study: buckets, objects, storage classes (Standard, IA, Glacier), versioning, lifecycle policies, access control (bucket policies vs ACLs).' },
  { id:'iam',    icon:'🔑', name:'IAM',       full:'Identity and Access Management', domain:'Security', dc:'red',
    desc:'Controls who and what can do what in your AWS account. The EC2 instance gets an IAM Role allowing it to write to S3 — and nothing else.',
    detail:'Principle of Least Privilege: the EC2 role should only have s3:PutObject on your specific bucket ARN. No admin access. No other service permissions. Review permissions regularly.',
    ccp:'The #1 topic in the CCP Security domain. Master: users, groups, roles, policies (managed vs inline), the shared responsibility model, and MFA.' },
];

const MILD = [
  { id:'cw',  icon:'📊', name:'CloudWatch', domain:'Management',    desc:'Collects logs from your EC2 and Docker container stdout. Set alarms for CPU > 80% or error rate spikes. Essential for debugging production issues.' },
  { id:'igw', icon:'🌉', name:'Internet Gateway', domain:'Networking', desc:'Attached to the VPC to allow public subnet resources (the ALB) to communicate with the internet. Private subnets do not have a route to the IGW.' },
  { id:'az',  icon:'🏙️', name:'Availability Zones', domain:'Infrastructure', desc:'Physically separate data centers in the same AWS Region. Spreading resources across AZs protects against hardware failures. ALB and RDS Multi-AZ use multiple AZs.' },
  { id:'acm', icon:'🔐', name:'ACM', full:'Certificate Manager', domain:'Security', desc:'Issues and auto-renews free public SSL/TLS certificates for your ALB HTTPS listener. Eliminates manual certificate purchases and rotation.' },
  { id:'r53', icon:'🗺️', name:'Route 53', domain:'Networking', desc:'AWS DNS service. Maps a custom domain (e.g., api.ataa-platform.com) to the ALB DNS name. Supports health checks and failover routing policies.' },
  { id:'ecr', icon:'📦', name:'ECR', full:'Elastic Container Registry', domain:'Compute', desc:'Private Docker image registry inside AWS. Store your built image here so EC2 can pull it without hitting Docker Hub rate limits.' },
];

const DC = {
  blue:   'bg-blue-900/40 text-blue-300 border-blue-700/50',
  red:    'bg-red-900/40 text-red-300 border-red-700/50',
  orange: 'bg-orange-900/40 text-orange-300 border-orange-700/50',
  purple: 'bg-purple-900/40 text-purple-300 border-purple-700/50',
  green:  'bg-emerald-900/40 text-emerald-300 border-emerald-700/50',
  gray:   'bg-gray-800 text-gray-400 border-gray-700',
};

function DeepCard({ c }) {
  const [open, setOpen] = useState(false);
  const dc = DC[c.dc] || DC.gray;
  return (
    <div className="bg-gray-900 border border-gray-700 hover:border-gray-600 rounded-2xl p-5 flex flex-col gap-3 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{c.icon}</span>
          <div>
            <div className="font-bold text-white">{c.name}</div>
            {c.full && <div className="text-xs text-gray-500">{c.full}</div>}
          </div>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded border shrink-0 ${dc}`}>{c.domain}</span>
      </div>
      <p className="text-sm text-gray-300 leading-relaxed">{c.desc}</p>
      {open && (
        <div className="space-y-2">
          <p className="text-sm text-gray-400 leading-relaxed border-l-2 border-emerald-800 pl-3">{c.detail}</p>
          <p className="text-xs text-emerald-700/80 leading-relaxed">{c.ccp}</p>
        </div>
      )}
      <button onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-400 transition-colors mt-auto">
        {open ? <><ChevronUp size={12} />Show less</> : <><ChevronDown size={12} />Detail + CCP note</>}
      </button>
    </div>
  );
}

function MildCard({ c }) {
  return (
    <div className="bg-gray-900/50 border border-gray-800 hover:border-gray-700 rounded-xl p-4 flex flex-col gap-2 transition-colors">
      <div className="flex items-center gap-2">
        <span className="text-xl">{c.icon}</span>
        <div>
          <div className="font-semibold text-gray-300 text-sm">{c.name}</div>
          {c.full && <div className="text-xs text-gray-600">{c.full}</div>}
        </div>
        <span className="ml-auto text-xs px-2 py-0.5 rounded border bg-gray-800 text-gray-500 border-gray-700 shrink-0">{c.domain}</span>
      </div>
      <p className="text-xs text-gray-500 leading-relaxed">{c.desc}</p>
    </div>
  );
}

export function ComponentGlossary() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-1">AWS Components</h2>
        <p className="text-gray-400 text-sm">What each service does in this workflow — aligned with the AWS Cloud Practitioner (CCP) certification domains</p>
      </div>
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-emerald-500">Deep Dive</span>
          <span className="text-xs text-gray-600">— directly used in this workflow</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {DEEP.map(c => <DeepCard key={c.id} c={c} />)}
        </div>
      </section>
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">Mild Info</span>
          <span className="text-xs text-gray-600">— good to know for CCP</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {MILD.map(c => <MildCard key={c.id} c={c} />)}
        </div>
      </section>
    </div>
  );
}
