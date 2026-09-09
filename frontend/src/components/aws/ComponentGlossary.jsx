import React, { useState } from 'react';

const DEEP_DIVE = [
  { id:'vpc', icon:'🌐', name:'VPC', fullName:'Virtual Private Cloud', domain:'Networking', domainColor:'blue', used:true,
    desc:'Your private isolated network on AWS. Everything — EC2, RDS — lives inside it. Think of it as your own data center in the cloud.',
    detail:'Contains public and private subnets. Public subnet exposes the ALB to the internet. Private subnets keep EC2 and RDS hidden from direct access.',
    ccp:'VPC is covered under Domain 2: Security and Domain 3: Technology in the CCP exam.' },
  { id:'subnet', icon:'🔲', name:'Subnets', fullName:'Public & Private Subnets', domain:'Networking', domainColor:'blue', used:true,
    desc:'Sub-divisions of your VPC. Public subnets have a route to the internet (via Internet Gateway). Private subnets do not.',
    detail:'ALB lives in public subnet. EC2 and RDS live in private subnets — they can only be reached from within the VPC.',
    ccp:'Subnets and routing are key CCP topics in network fundamentals.' },
  { id:'sg', icon:'🔒', name:'Security Groups', fullName:'Virtual Firewalls', domain:'Security', domainColor:'red', used:true,
    desc:'Firewall rules for your AWS resources. You define which ports and IP ranges are allowed in and out.',
    detail:'ALB SG: allows 443 from 0.0.0.0/0. EC2 SG: allows port 8000 only from ALB SG. RDS SG: allows 5432 only from EC2 SG.',
    ccp:'Security Groups are stateful firewalls — a major CCP exam topic in the Security domain.' },
  { id:'alb', icon:'⚖️', name:'ALB', fullName:'Application Load Balancer', domain:'Networking', domainColor:'blue', used:true,
    desc:'Receives HTTPS requests from the internet and routes them to your EC2 instance. Handles SSL termination.',
    detail:'You attach your ACM SSL certificate to the ALB. The ALB talks to EC2 over plain HTTP inside the VPC — safe because traffic never leaves AWS.',
    ccp:'Elastic Load Balancing is covered under Technology domain in CCP.' },
  { id:'ec2', icon:'🖥️', name:'EC2', fullName:'Elastic Compute Cloud', domain:'Compute', domainColor:'orange', used:true,
    desc:'Your virtual server on AWS. You choose the instance type (e.g., t2.micro), SSH into it, install Docker, and run your FastAPI container.',
    detail:'Unlike Fargate (serverless containers), EC2 gives you full control and visibility — ideal for learning AWS fundamentals.',
    ccp:'EC2 is the most important service in the CCP Compute domain. Covers instance types, pricing models (On-Demand, Reserved, Spot), and AMIs.' },
  { id:'docker', icon:'🐳', name:'Docker', fullName:'Containerization on EC2', domain:'Compute', domainColor:'orange', used:true,
    desc:'Docker runs your FastAPI application as an isolated container inside EC2. The container bundles Python, dependencies, and your code.',
    detail:'You run: docker build -t ataa-backend . then docker run -d -p 8000:8000 ataa-backend. EC2 serves as the host machine.',
    ccp:'Containers and Docker are part of the CCP Technology domain — understanding why they exist and how ECS/Fargate build on top of them.' },
  { id:'rds', icon:'🗄️', name:'RDS', fullName:'Relational Database Service', domain:'Database', domainColor:'purple', used:true,
    desc:'Managed PostgreSQL database. AWS handles backups, patching, and failover. Lives in a private subnet — no direct internet access.',
    detail:'Your FastAPI uses SQLAlchemy async to connect via the private RDS endpoint. You never expose port 5432 to the internet.',
    ccp:'RDS and database services are covered in the Technology domain of the CCP exam.' },
  { id:'s3', icon:'🪣', name:'S3', fullName:'Simple Storage Service', domain:'Storage', domainColor:'green', used:true,
    desc:'Object storage for family case verification documents (PDFs, images). Accessed from EC2 using an IAM role — no access keys needed.',
    detail:'Never store credentials on the EC2 instance. Instead, attach an IAM Role with S3 write permissions to the EC2 instance profile.',
    ccp:'S3 is one of the most important services in the CCP exam. Core concepts: buckets, objects, storage classes, lifecycle policies.' },
  { id:'iam', icon:'🔑', name:'IAM', fullName:'Identity and Access Management', domain:'Security', domainColor:'red', used:true,
    desc:'Controls who can do what in your AWS account. Your EC2 gets an IAM Role that allows it to write to S3 — and nothing else.',
    detail:'Principle of least privilege: the EC2 role should only have s3:PutObject permission on the specific bucket. No admin access.',
    ccp:'IAM is the #1 topic in the CCP Security domain. Covers users, groups, roles, policies, and MFA.' },
];

const MILD_INFO = [
  { id:'cw', icon:'📊', name:'CloudWatch', domain:'Management', desc:'Collects logs from your EC2 and Docker container. Set alarms for CPU > 80% or error rate spikes.' },
  { id:'igw', icon:'🌉', name:'Internet Gateway', domain:'Networking', desc:'Attaches to your VPC and allows public subnet resources (ALB) to communicate with the internet.' },
  { id:'az', icon:'🏙️', name:'Availability Zones', domain:'Infrastructure', desc:'Physically separate data centers in the same region. RDS Multi-AZ and ALB spread across AZs for fault tolerance.' },
  { id:'acm', icon:'🔐', name:'ACM', fullName:'Certificate Manager', domain:'Security', desc:'Provisions and manages SSL/TLS certificates for your ALB HTTPS listener. Free for public certificates.' },
  { id:'r53', icon:'🗺️', name:'Route 53', domain:'Networking', desc:'AWS DNS service. Maps your custom domain (e.g., api.ataa-platform.com) to the ALB DNS name.' },
  { id:'ecr', icon:'📦', name:'ECR', fullName:'Elastic Container Registry', domain:'Compute', desc:'Private Docker image registry on AWS. Store your built Docker image here, EC2 pulls from it.' },
];

const DomainBadge = ({ domain, color }) => {
  const colors = {
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    red: 'bg-red-500/10 text-red-400 border-red-500/20',
    orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    green: 'bg-green-500/10 text-green-400 border-green-500/20',
    gray: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  };
  const c = colors[color] || colors.gray;
  return (
    <span className={`text-xs px-2 py-0.5 rounded border ${c}`}>
      {domain}
    </span>
  );
};

export const ComponentGlossary = () => {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-8 text-white mt-12 mb-24">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="text-3xl font-bold mb-3">AWS Components</h2>
        <p className="text-gray-400">What each service does in this workflow — aligned with AWS CCP certification</p>
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-200 mb-4 px-2">Core Lab Components (Deep Dive)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEEP_DIVE.map(comp => (
            <div key={comp.id} className="bg-gray-900 border border-gray-700 rounded-2xl p-5 hover:border-gray-500 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{comp.icon}</span>
                  <div>
                    <h4 className="font-bold">{comp.name}</h4>
                    <p className="text-xs text-gray-500">{comp.fullName}</p>
                  </div>
                </div>
                <DomainBadge domain={comp.domain} color={comp.domainColor} />
              </div>
              <p className="text-sm text-gray-300 mb-3">{comp.desc}</p>
              
              <div className="mt-auto">
                <button 
                  onClick={() => toggleExpand(comp.id)}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold mb-2"
                >
                  {expanded[comp.id] ? 'Less ↑' : 'More ↓'}
                </button>
                
                {expanded[comp.id] && (
                  <div className="pt-2 border-t border-gray-800 space-y-2 mt-1">
                    <p className="text-sm text-gray-400">{comp.detail}</p>
                    <div className="bg-gray-950 p-2 rounded text-xs text-gray-500 border border-gray-800">
                      <strong>CCP Exam:</strong> {comp.ccp}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12">
        <h3 className="text-xl font-bold text-gray-200 mb-4 px-2">Additional Context (Mild Info)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MILD_INFO.map(comp => (
            <div key={comp.id} className="bg-gray-900/60 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span>{comp.icon}</span>
                  <h4 className="font-semibold text-sm">{comp.name}</h4>
                </div>
                <DomainBadge domain={comp.domain} color="gray" />
              </div>
              <p className="text-xs text-gray-400">{comp.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
