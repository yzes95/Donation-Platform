import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp } from 'lucide-react';

const DEEP = [
  { 
    id:'vpc', icon:'🌐', name:'VPC', full:'Virtual Private Cloud', domain:'Networking', domain_ar:'الشبكات', dc:'blue',
    desc_en:'Your private isolated network on AWS. Everything — EC2, RDS — lives inside it. Think of it as your own data center in the cloud.',
    desc_ar:'شبكتك الخاصة المعزولة سحابياً. كل شيء — خوادم EC2 وقواعد بيانات RDS — يعمل داخلها كمركز بيانات خاص بك في السحابة.',
    detail_en:'Contains public and private subnets. Public subnet exposes ALB to the internet. Private subnets keep EC2 and RDS hidden from direct access.',
    detail_ar:'تضم شبكات فرعية عامة وخاصة. العامة تستقبل حركة المرور الخارجية عبر ALB، والخاصة تحمي EC2 وRDS بعيدًا عن متناول الإنترنت المباشر.',
    ccp_en:'Covered in CCP Domain 2: Security and Domain 3: Technology. Core topics: subnets, CIDR blocks, route tables, and gateways.',
    ccp_ar:'مغطاة في مجالي الأمان والتقنية باختبار CCP. المفاهيم الأساسية: الشبكات الفرعية وجداول التوجيه وبوابات الإنترنت.'
  },
  { 
    id:'subnet', icon:'🔲', name:'Subnets', full:'Public & Private Subnets', domain:'Networking', domain_ar:'الشبكات', dc:'blue',
    desc_en:'Sub-divisions of your VPC. Public subnets have a route to the internet via Internet Gateway. Private subnets do not.',
    desc_ar:'تقسيمات داخلية لشبكة VPC. الشبكات العامة لها مسار إلى الإنترنت عبر بوابة IGW، بينما الخاصة معزولة تماماً.',
    detail_en:'ALB lives in the public subnet. EC2 and RDS live in private subnets — reachable only from within the VPC network boundary.',
    detail_ar:'يعمل ALB في الشبكة العامة، بينما يعمل تطبيق EC2 وقاعدة بيانات RDS داخل الشبكة الخاصة لتقليص نطاق الهجوم المحتمل.',
    ccp_en:'Subnets and routing tables are key CCP exam topics. Understand: public vs private, CIDR blocks, and route tables.',
    ccp_ar:'مفهوم رئيسي في CCP: الفرق بين الشبكات العامة والخاصة، وبوابات NAT وجداول التوجيه.'
  },
  { 
    id:'sg', icon:'🔒', name:'Security Groups', full:'Virtual Firewalls', domain:'Security', domain_ar:'الأمان والحماية', dc:'red',
    desc_en:'Stateful firewall rules applied to your AWS resources. You define allowed inbound and outbound ports and IP ranges.',
    desc_ar:'جدران حماية افتراضية (Stateful) تتحكم في المنافذ وعناوين IP المسموح بدخولها وخروجها لكل مكوّن.',
    detail_en:'ALB SG: allows 443 from 0.0.0.0/0. EC2 SG: allows port 8000 only from ALB-SG. RDS SG: allows 5432 only from EC2-SG.',
    detail_ar:'جدار ALB يسمح بالمنفذ 443 للجميع، بينما جدار EC2 يسمح بالمنفذ 8000 فقط من موازن ALB، وجدار RDS يسمح فقط من خادم EC2.',
    ccp_en:'Major CCP Security topic. Key distinction: Security Groups are stateful (inbound allows response). NACLs are stateless at subnet level.',
    ccp_ar:'سؤال متكرر في CCP: مجموعات الأمان Stateful (تسمح بالرد تلقائياً)، بينما قوائم NACL تكون Stateless على مستوى الشبكة الفرعية.'
  },
  { 
    id:'alb', icon:'⚖️', name:'ALB', full:'Application Load Balancer', domain:'Networking', domain_ar:'الشبكات', dc:'blue',
    desc_en:'Receives HTTPS requests from the internet, terminates SSL, and routes them to your EC2 instance on port 8000.',
    desc_ar:'يستقبل طلبات HTTPS وينهي تشفير SSL بشهادة مجانية من ACM، ثم يوزع الحمل إلى تطبيق FastAPI الداخلي.',
    detail_en:'ALB speaks HTTP to EC2 inside the VPC — completely safe because traffic never leaves AWS network boundaries.',
    detail_ar:'يتواصل ALB مع خادم EC2 عبر شبكة VPC الداخلية مما يوفر أداءً عاليًا وحماية تامة للبيانات دون الحاجة لشهادة على كل خادم.',
    ccp_en:'Covered in Technology domain. Operates at Layer 7 (HTTP/HTTPS). Supports host and path-based routing.',
    ccp_ar:'يعمل في الطبقة السابعة Layer 7 ويتميز بالتوجيه القائم على المسارات وقابلية التوسع التلقائي.'
  },
  { 
    id:'ec2', icon:'🖥️', name:'EC2', full:'Elastic Compute Cloud', domain:'Compute', domain_ar:'الحوسبة', dc:'orange',
    desc_en:'Your virtual server on AWS. You SSH in, install Docker, and run your FastAPI container. You manage the OS and runtime yourself.',
    desc_ar:'خادمك الافتراضي السحابي. تتصل به عبر SSH وتثبت بيئة Docker وتشغل التطبيق بنفسك للتحكم الكامل.',
    detail_en:'Unlike Fargate (serverless containers), EC2 gives you hands-on OS control — ideal for learning cloud fundamentals.',
    detail_ar:'يمنحك تجربة عملية حقيقية في إدارة الخوادم وصلاحيات الأمان ونظام الملفات قبل الانتقال للحوسبة اللامركزية.',
    ccp_en:'Most important Compute service in CCP. Study: instance types, pricing (On-Demand, Reserved, Spot), and AMIs.',
    ccp_ar:'الخدمة الأهم في قسم الحوسبة: نماذج التسعير (On-Demand وSpot وReserved) وأنواع المثيلات ولقطات AMI.'
  },
  { 
    id:'docker', icon:'🐳', name:'Docker', full:'Containerization on EC2', domain:'Compute', domain_ar:'الحوسبة', dc:'orange',
    desc_en:'Packages your FastAPI app — Python runtime, libraries, and code — into a portable container running identically everywhere.',
    detail_en:'Command: docker run -d -p 8000:8000 ataa-backend. Isolates dependencies and simplifies future migration to ECS.',
    desc_ar:'تغليف تطبيق FastAPI مع بايثون والمكتبات داخل حاوية تعمل بنفس الدقة والموثوقية على أي بيئة.',
    detail_ar:'الأمر: docker run -d -p 8000:8000 ataa-backend. يعزل بيئة التطبيق ويسهل نقله مستقبلاً إلى ECS.',
    ccp_en:'Containers are covered in Technology domain — understanding how Docker forms the base for ECS and EKS.',
    ccp_ar:'مفهوم الحاويات في CCP وفائدتها في سرعة النشر وسهولة التوسع كأساس لخدمات مثل ECS وFargate.'
  },
  { 
    id:'rds', icon:'🗄️', name:'RDS', full:'Relational Database Service', domain:'Database', domain_ar:'قواعد البيانات', dc:'purple',
    desc_en:'Managed PostgreSQL database. AWS handles automated backups, patching, and failover in a private subnet.',
    desc_ar:'قاعدة بيانات PostgreSQL مدارة سحابياً. تتولى AWS النسخ الاحتياطي التلقائي والتحديثات بدون انقطاع.',
    detail_en:'FastAPI connects via private RDS endpoint using SQLAlchemy async. Port 5432 is never exposed to the public internet.',
    detail_ar:'يتصل التطبيق بقاعدة البيانات من خلال الرابط الداخلي المعزول عبر المنفذ 5432 دون تعريضها للإنترنت.',
    ccp_en:'Know: managed vs self-managed on EC2, automated backups, Multi-AZ for high availability, Read Replicas for scaling.',
    ccp_ar:'نقاط امتحان CCP: ميزة Multi-AZ للجاهزية العالية، والنسخ الاحتياطي الآلي، ومقارنة RDS بتثبيت قاعدة على EC2.'
  },
  { 
    id:'s3', icon:'🪣', name:'S3', full:'Simple Storage Service', domain:'Storage', domain_ar:'التخزين', dc:'green',
    desc_en:'Object storage for family verification documents (PDFs, images). Accessed via EC2 IAM Role — no stored credentials.',
    desc_ar:'تخزين كائني غير محدود للمستندات والتقارير الطبية. يتم الوصول إليه بأمان عبر دور IAM المرتبط بـ EC2.',
    detail_en:'Never store AWS keys in code. Attach an IAM Instance Profile to EC2 with s3:PutObject scoped to your bucket.',
    detail_ar:'لا تقم أبداً بوضع مفاتيح AWS في الكود، بل امنح الخادم دور IAM بصلاحية الكتابة فقط على هذا المستودع.',
    ccp_en:'Core CCP storage service. Topics: 99.999999999% durability, storage tiers (Standard, IA, Glacier), lifecycle policies.',
    ccp_ar:'ركيزة أساسية في CCP: متانة 11 تسعة، فئات التخزين مثل Glacier للأرشفة، وسياسات دورة حياة الملفات.'
  },
  { 
    id:'iam', icon:'🔑', name:'IAM', full:'Identity and Access Management', domain:'Security', domain_ar:'الأمان والحماية', dc:'red',
    desc_en:'Controls who and what can do what in your AWS account. Grants EC2 permission to write to S3 — and nothing else.',
    desc_ar:'إدارة الهويات والصلاحيات. تمنح خادم EC2 الإذن بالكتابة في S3 فقط وفق مبدأ أقل الصلاحيات الممكنة.',
    detail_en:'Principle of Least Privilege: only grant s3:PutObject on the specific bucket ARN. No root keys or admin access.',
    detail_ar:'مبدأ الامتياز الأقل (Least Privilege): منح صلاحية محددة فقط وعدم استخدام مفاتيح حساب Root مطلقاً.',
    ccp_en:'#1 topic in CCP Security. Covers users, groups, roles, policies, MFA, and the AWS Shared Responsibility Model.',
    ccp_ar:'الموضوع الأهم في أمان CCP: الفرق بين الأدوار والسياسات، والمصادقة الثنائية MFA، ونموذج المسؤولية المشتركة.'
  },
];

const MILD = [
  { id:'cw', icon:'📊', name:'CloudWatch', domain:'Management', domain_ar:'المراقبة', desc_en:'Collects logs and metrics from Docker and EC2. Alarms notify you if CPU > 80% or errors spike.', desc_ar:'تجميع السجلات ومراقبة استهلاك المعالج ومعدل الأخطاء مع إرسال تنبيهات تلقائية.' },
  { id:'igw', icon:'🌉', name:'Internet Gateway', domain:'Networking', domain_ar:'الشبكات', desc_en:'Attaches to VPC to allow public subnet resources (ALB) to talk to the internet.', desc_ar:'بوابة ربط شبكة VPC بالإنترنت الخارجي لتمكين الزوار من الوصول لموازن الأحمال ALB.' },
  { id:'az', icon:'🏙️', name:'Availability Zones', domain:'Infrastructure', domain_ar:'البنية التحتية', desc_en:'Distinct physical data centers within a region. Spreading resources across AZs provides high fault tolerance.', desc_ar:'مراكز بيانات منفصلة جغرافياً داخل نفس المنطقة السحابية لضمان استمرار الخدمة عند تعطل مركز.' },
  { id:'acm', icon:'🔐', name:'ACM', full:'Certificate Manager', domain:'Security', domain_ar:'الأمان', desc_en:'Issues and auto-renews free SSL/TLS certificates for your ALB HTTPS endpoint.', desc_ar:'إصدار وتجديد شهادات الأمان والتشفير SSL/TLS مجاناً وتثبيتها مباشرة على ALB.' },
  { id:'r53', icon:'🗺️', name:'Route 53', domain:'Networking', domain_ar:'الشبكات', desc_en:'AWS DNS service mapping custom domain names to the ALB DNS endpoint.', desc_ar:'خدمة DNS السحابية لربط اسم النطاق الخاص بك بعنوان موازن الأحمال ALB.' },
  { id:'ecr', icon:'📦', name:'ECR', full:'Elastic Container Registry', domain:'Compute', domain_ar:'الحوسبة', desc_en:'Private Docker image registry inside AWS to securely store and pull container images.', desc_ar:'مستودع خاص لتخزين صور Docker داخل AWS وسحبها بسرعة وأمان إلى خوادم EC2.' },
];

const DC = {
  blue:   'bg-blue-900/40 text-blue-300 border-blue-700/50',
  red:    'bg-red-900/40 text-red-300 border-red-700/50',
  orange: 'bg-orange-900/40 text-orange-300 border-orange-700/50',
  purple: 'bg-purple-900/40 text-purple-300 border-purple-700/50',
  green:  'bg-emerald-900/40 text-emerald-300 border-emerald-700/50',
  gray:   'bg-gray-800 text-gray-400 border-gray-700',
};

function DeepCard({ c, isArabic }) {
  const [open, setOpen] = useState(false);
  const dc = DC[c.dc] || DC.gray;
  return (
    <div className="bg-gray-900 border border-gray-700/80 hover:border-gray-600 rounded-2xl p-5 flex flex-col gap-3 transition-colors shadow-lg">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{c.icon}</span>
          <div>
            <div className="font-bold text-white text-base">{c.name}</div>
            {c.full && <div className="text-xs text-gray-400">{c.full}</div>}
          </div>
        </div>
        <span className={`text-xs px-2.5 py-0.5 rounded-full border shrink-0 font-medium ${dc}`}>
          {isArabic ? c.domain_ar : c.domain}
        </span>
      </div>
      <p className="text-sm text-gray-300 leading-relaxed">
        {isArabic ? c.desc_ar : c.desc_en}
      </p>
      {open && (
        <div className="space-y-2.5 pt-2 border-t border-gray-800">
          <p className="text-xs text-gray-400 leading-relaxed border-l-2 border-emerald-500/60 pl-3">
            {isArabic ? c.detail_ar : c.detail_en}
          </p>
          <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-[11px] text-emerald-300 leading-relaxed">
            <span className="font-bold text-emerald-400 block mb-0.5">
              {isArabic ? '💡 ملاحظة امتحان AWS CCP:' : '💡 AWS CCP Exam Tip:'}
            </span>
            {isArabic ? c.ccp_ar : c.ccp_en}
          </div>
        </div>
      )}
      <button onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors mt-auto pt-1">
        {open 
          ? <><ChevronUp size={13} /><span>{isArabic ? 'عرض أقل' : 'Show less'}</span></> 
          : <><ChevronDown size={13} /><span>{isArabic ? 'التفاصيل وملاحظات CCP' : 'Detail + CCP note'}</span></>}
      </button>
    </div>
  );
}

function MildCard({ c, isArabic }) {
  return (
    <div className="bg-gray-900/60 border border-gray-800 hover:border-gray-700 rounded-xl p-4 flex flex-col gap-2 transition-colors">
      <div className="flex items-center gap-2">
        <span className="text-xl">{c.icon}</span>
        <div>
          <div className="font-semibold text-gray-300 text-sm">{c.name}</div>
          {c.full && <div className="text-[11px] text-gray-500">{c.full}</div>}
        </div>
        <span className="ml-auto text-[11px] px-2 py-0.5 rounded border bg-gray-800 text-gray-400 border-gray-700 shrink-0">
          {isArabic ? c.domain_ar : c.domain}
        </span>
      </div>
      <p className="text-xs text-gray-400 leading-relaxed">
        {isArabic ? c.desc_ar : c.desc_en}
      </p>
    </div>
  );
}

export function ComponentGlossary() {
  const { i18n } = useTranslation();
  const isArabic = (i18n.language || 'ar').startsWith('ar');

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-1.5">
          {isArabic ? 'دليل مكونات بنية AWS السحابية' : 'AWS Components Glossary'}
        </h2>
        <p className="text-gray-400 text-sm">
          {isArabic
            ? 'شرح عملي لكل خدمة من خدمات AWS المستخدمة في هذا المسار وربطها بمفاهيم شهادة Cloud Practitioner (CCP)'
            : 'Detailed explanation of each AWS service in this workflow, aligned with AWS Certified Cloud Practitioner (CCP) domains'}
        </p>
      </div>

      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            {isArabic ? 'الخدمات الأساسية في هذا المسار' : 'Deep Dive — Primary Services'}
          </span>
          <span className="text-xs text-gray-500">
            {isArabic ? '(المستخدمة فعليًا في تنفيذ الطلب)' : '(Directly used in request execution)'}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {DEEP.map(c => <DeepCard key={c.id} c={c} isArabic={isArabic} />)}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
            {isArabic ? 'خدمات مساندة ومعلومات إضافية' : 'Supporting Infrastructure'}
          </span>
          <span className="text-xs text-gray-500">
            {isArabic ? '(معلومات مطلوبة في اختبار CCP)' : '(Essential concepts for CCP)'}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {MILD.map(c => <MildCard key={c.id} c={c} isArabic={isArabic} />)}
        </div>
      </section>
    </div>
  );
}
