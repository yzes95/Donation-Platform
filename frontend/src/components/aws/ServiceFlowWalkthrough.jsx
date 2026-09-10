import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Lock, 
  Database, 
  Server, 
  Cloud, 
  FileCode, 
  Layers, 
  Activity,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const FLOW_STEPS = [
  {
    id: 'submitting',
    stepNumber: 1,
    title_ar: 'الخطوة 1: إرسال الطلب من المتصفح إلى بوابة الإنترنت',
    title_en: 'Step 1: Request Ingress from Client to Internet Gateway',
    services: ['Route 53', 'Internet Gateway (IGW)', 'Public Subnet'],
    summary_ar: 'يرسل ممثل الأسرة أو المسؤول بيانات الحالة الإنسانية عبر اتصال HTTPS مشفر يمر عبر الإنترنت إلى بوابة VPC الخارجية.',
    summary_en: 'The representative submits the assistance request. The browser dispatches a secure HTTPS POST payload destined for the AWS Cloud boundary.',
    description_ar: 'يقوم المتصفح (المستضاف على GitHub Pages) بتجميع بيانات الحالة (العنوان، المبلغ، تصنيف المساعدة، ومعرف الأسرة) وإرسال طلب HTTP POST مشفر عبر المنفذ 443. يقوم نظام أسماء النطاقات Route 53 بتوجيه الطلب نحو بوابة الإنترنت (IGW) الخاصة بـ VPC في منطقة us-east-1.',
    description_en: 'The browser (client app hosted on GitHub Pages) packages the assistance need payload (title, amount, category, family ID) into an HTTPS POST request on port 443. Route 53 resolves the API domain, directing traffic through the VPC Internet Gateway (IGW) in us-east-1.',
    code_file: 'main.py',
    code_focus: 'allow_origins (CORS Policy)',
    security_ar: 'يتحقق خادم الويب أولاً من ترويسات CORS المحددة في main.py لمنع طلبات المواقع غير المصرح بها (Cross-Origin Resource Sharing).',
    security_en: 'The application validates CORS origin headers configured in main.py to prevent unauthorized cross-origin requests from foreign domains.',
    ccp_tip_ar: '💡 بوابة الإنترنت (IGW) مكوّن VPC يتيح الاتصال ثنائي الاتجاه بالإنترنت العام للشبكات الفرعية العامة فقط.',
    ccp_tip_en: '💡 Internet Gateway (IGW) is a horizontally scaled, redundant VPC component that enables communication between public subnets and the internet.',
  },
  {
    id: 'alb',
    stepNumber: 2,
    title_ar: 'الخطوة 2: استقبال موازن الأحمال (ALB) وإنهاء تشفير SSL',
    title_en: 'Step 2: ALB Ingress & SSL/TLS Termination',
    services: ['Application Load Balancer (ALB)', 'ACM (Certificate Manager)', 'Security Group'],
    summary_ar: 'يستقبل موازن الأحمال الاتصال المشفر، ويفك تشفيره بشهادة SSL المجانية، ثم يمرر الطلب داخليًا إلى حاوية التطبيق.',
    summary_en: 'The Application Load Balancer terminates SSL on port 443, checks target health, and forwards HTTP traffic to the private compute subnet.',
    description_ar: 'يعمل موازن أحمال التطبيقات (ALB) داخل الشبكة الفرعية العامة (Public Subnet: 10.0.1.0/24). يستقبل اتصال TLS على المنفذ 443 وينهي التشفير باستخدام شهادة صادرة تلقائيًا من AWS Certificate Manager (ACM). يقوم ALB بفحص صحة الخوادم ثم يمرر الطلب عبر بروتوكول HTTP العادي على المنفذ 8000 إلى الخادم الداخلي.',
    description_en: 'Operating in the public subnet (10.0.1.0/24), the Application Load Balancer receives the TLS handshake on port 443, terminates SSL using a free certificate managed by ACM, evaluates listener routing rules, and forwards the HTTP request on port 8000 into the private subnet.',
    code_file: 'main.py',
    code_focus: 'include_router (API Routing)',
    security_ar: 'جدار حماية ALB يسمح باستقبال المنفذ 443 من 0.0.0.0/0، بينما يتم التواصل مع الخادم الداخلي ببروتوكول HTTP بأمان تام لأن حركة المرور لا تغادر شبكة AWS.',
    security_en: 'The ALB Security Group allows inbound 443 from anywhere. Inside the VPC, communication to EC2 uses internal HTTP safely within AWS network borders.',
    ccp_tip_ar: '💡 موازن ALB يعمل في الطبقة السابعة (Layer 7: HTTP/HTTPS) ويدعم توجيه الطلبات حسب المسارات (Path-based Routing).',
    ccp_tip_en: '💡 ALB operates at Layer 7 (Application Layer), supporting advanced request routing (URL paths, host headers) and native SSL offloading.',
  },
  {
    id: 'ec2',
    stepNumber: 3,
    title_ar: 'الخطوة 3: معالجة الطلب في حاوية Docker على خادم EC2',
    title_en: 'Step 3: FastAPI Container Execution on EC2',
    services: ['Amazon EC2 (t2.micro)', 'Docker Container', 'FastAPI Runtime'],
    summary_ar: 'تستقبل حاوية Docker داخل خادم EC2 الخاص الطلب، وتتحقق من صحة المدخلات وصلاحيات ممثل الأسرة.',
    summary_en: 'The Docker container hosted on the private EC2 instance receives the request, validates the schema with Pydantic, and handles business logic.',
    description_ar: 'يعمل خادم EC2 داخل شبكة فرعية خاصة (Private Subnet: 10.0.2.0/24) بدون عنوان IP عام. تستقبل حاوية Docker الطلب على المنفذ 8000، ويقوم إطار FastAPI بالتحقق من هيكل البيانات عبر نموذج Pydantic (العنوان، المبلغ، الحساب البنكي) والتأكد من عدم وجود قيم فارغة أو حقن برمجي خبيث.',
    description_en: 'The EC2 t2.micro instance resides inside a private subnet (10.0.2.0/24) with no public IP. The isolated Docker container receives traffic on port 8000. FastAPI validates the incoming JSON against Pydantic schemas (validating amount, string length, and family reference).',
    code_file: 'routes/admin.py',
    code_focus: 'admin_test & Route Handler',
    security_ar: 'جدار حماية خادم EC2 يرفض أي اتصال مباشر من الإنترنت! يسمح بالمنفذ 8000 فقط إذا كان المصدر هو موازن الأحمال (ALB Security Group).',
    security_en: 'The EC2 Security Group drops all direct internet traffic. It only allows inbound TCP on port 8000 when originating from the ALB Security Group.',
    ccp_tip_ar: '💡 نموذج المسؤولية المشتركة في EC2: شركة AWS مسؤولة عن أمان الأجهزة الافتراضية والفيزيائية، وأنت مسؤول عن نظام التشغيل والتطبيقات وجدار الحماية.',
    ccp_tip_en: '💡 Shared Responsibility Model for IaaS (EC2): AWS manages physical host hardware and hypervisors; you are responsible for guest OS, patching, and firewall rules.',
  },
  {
    id: 'rds',
    stepNumber: 4,
    title_ar: 'الخطوة 4: حفظ سجل المساعدة في قاعدة بيانات RDS PostgreSQL',
    title_en: 'Step 4: Database Persistence in Amazon RDS',
    services: ['Amazon RDS', 'PostgreSQL Engine', 'SQLAlchemy Async'],
    summary_ar: 'يفتح التطبيق جلسة آمنة مع قاعدة بيانات RDS المعزولة ويسجل الحالة في جدول المساعدات services.',
    summary_en: 'FastAPI establishes an asynchronous SQLAlchemy session with the private RDS PostgreSQL instance to commit the new assistance record.',
    description_ar: 'يتصل تطبيق FastAPI بقاعدة بيانات Amazon RDS PostgreSQL المقامة في شبكة فرعية خاصة معزولة (10.0.3.0/24). ينفذ التطبيق استعلام INSERT غير متزامن (Async) لحفظ الحالة المستحدثة ومبلغ الدعم وتاريخ التسجيل، مما يضمن تكامل المعاملة المالية (ACID Compliance).',
    description_en: 'FastAPI connects to the managed Amazon RDS PostgreSQL database residing in a dedicated private data subnet (10.0.3.0/24). Using asyncpg and SQLAlchemy, it commits an ACID-compliant INSERT transaction recording the need, target amount, and timestamp.',
    code_file: 'database/connection.py',
    code_focus: 'get_db & Async Session Dependency',
    security_ar: 'المنفذ 5432 الخاص بقاعدة البيانات مغلق بالكامل عن الإنترنت، ولا يمكن الوصول إليه سوى من خلال خادم EC2 المعتمد.',
    security_en: 'Port 5432 is completely sealed from external access. The RDS Security Group strictly whitelists traffic originating from the EC2 Security Group.',
    ccp_tip_ar: '💡 ميزة Multi-AZ في RDS تنشئ نسخة احتياطية متزامنة في منطقة توفر أخرى (Availability Zone) للتحويل التلقائي في حال تعطل الخادم الأساسي.',
    ccp_tip_en: '💡 RDS Multi-AZ synchronously replicates data to a standby instance in another Availability Zone for automatic failover and high availability.',
  },
  {
    id: 's3',
    stepNumber: 5,
    title_ar: 'الخطوة 5: حفظ المستندات والتقارير في مستودع S3 بأمان',
    title_en: 'Step 5: Case Document Storage in Amazon S3',
    services: ['Amazon S3', 'IAM Roles & Instance Profiles', 'Pre-signed URLs'],
    summary_ar: 'يتم رفع المستندات الثبوتية والتقارير الطبية الخاصة بالحالة إلى S3 بدون حفظ أي مفاتيح تشفير داخل الخادم.',
    summary_en: 'Verification documents and family health records are archived to S3 securely using the EC2 instance IAM role without hardcoded keys.',
    description_ar: 'إذا تضمنت حالة الدعم تقارير بحث اجتماعي أو فواتير علاج، يرفع التطبيق الملفات مباشرة إلى مستودع S3 Bucket. لا يحتوي الكود على أي مفاتيح سرية (AWS Secret Keys)، بل يستخدم خادم EC2 دور IAM Role ممنوحًا عبر Instance Profile بصلاحية s3:PutObject المحددة بدقة.',
    description_en: 'When social investigation reports or medical receipts are attached, the application streams files directly to an Amazon S3 bucket. No static credentials exist in code; the EC2 instance uses an attached IAM Instance Profile granting scoped s3:PutObject privileges.',
    code_file: 'models/service.py',
    code_focus: 'AssistanceNeed Schema & Storage Model',
    security_ar: 'مبدأ الامتياز الأقل (Least Privilege): يملك الخادم صلاحية الكتابة فقط على هذا المستودع، ولا يستطيع حذف الملفات أو الوصول لحسابات AWS الأخرى.',
    security_en: 'Principle of Least Privilege: The IAM role only grants write permissions to the specific donation bucket, with zero access to delete objects or administer AWS.',
    ccp_tip_ar: '💡 يوفر Amazon S3 متانة استثنائية للبيانات تصل إلى 11 تسعة (99.999999999% Durability) من خلال توزيع الملفات على مرافق متعددة.',
    ccp_tip_en: '💡 Amazon S3 delivers 99.999999999% (11 9s) durability by automatically redundantly storing objects across multiple physical facilities.',
  },
  {
    id: 'complete',
    stepNumber: 6,
    title_ar: 'الخطوة 6: تسجيل السجلات في CloudWatch وإرجاع النتيجة للعميل',
    title_en: 'Step 6: Telemetry in CloudWatch & Response Delivery',
    services: ['Amazon CloudWatch', 'HTTP 201 Created Response', 'Client UI'],
    summary_ar: 'تسجيل زمن الاستجابة وسجلات التطبيق في CloudWatch، وإرجاع رد بنجاح العملية (201 Created) للمتصفح.',
    summary_en: 'FastAPI emits access and audit metrics to CloudWatch Logs, while returning an HTTP 201 Created response back to the user interface.',
    description_ar: 'بعد نجاح تسجيل الحالة في قاعدة البيانات ورفع المستندات، يُرسل خادم FastAPI استجابة JSON برمز الحالة 201 Created متضمنةً رقم المرجع (SRV-XXXX). بالتوازي، يُسجل مجمع سجلات CloudWatch Logs زمن معالجة الطلب في الخلفية دون تعطيل المستخدم.',
    description_en: 'Upon successful database commit and S3 upload, FastAPI generates a JSON response with HTTP 201 Created and the unique case reference ID (SRV-XXXX). Asynchronously, the CloudWatch daemon collects execution logs and CPU/latency metrics.',
    code_file: 'config/settings.py',
    code_focus: 'DEBUG Mode & Production Alarms',
    security_ar: 'يجب ضبط DEBUG=False في بيئة الإنتاج لمنع ظهور أي رسائل أخطاء داخلية للمستخدمين، والاعتماد فقط على تنبيهات CloudWatch Alarms.',
    security_en: 'Setting DEBUG=False in production prevents accidental leakage of internal code paths to users, delegating error monitoring to CloudWatch Alarms.',
    ccp_tip_ar: '💡 تتيح خدمة CloudWatch Alarms مراقبة معدل استخدام الموارد وإطلاق إجراءات تلقائية مثل التوسع التلقائي (Auto Scaling) عند زيادة الحمل.',
    ccp_tip_en: '💡 CloudWatch Alarms monitor metric thresholds (e.g., CPU > 80%) to trigger automated notifications via SNS or execute Auto Scaling policies.',
  },
];

export function ServiceFlowWalkthrough({ simulationStep, selectedStep, onSelectStep }) {
  const { i18n } = useTranslation();
  const isArabic = (i18n.language || 'ar').startsWith('ar');
  const [expandedStep, setExpandedStep] = useState(null);

  const activeStepId = selectedStep || (simulationStep !== 'idle' ? simulationStep : 'submitting');

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl mb-16">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 border-b border-gray-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Layers size={18} />
            </span>
            <h2 className="text-xl font-bold text-white tracking-wide">
              {isArabic ? 'مسار معالجة الطلب عبر بنية AWS — خطوة بخطوة' : 'End-to-End Service Flow Walkthrough'}
            </h2>
          </div>
          <p className="text-xs text-gray-400">
            {isArabic
              ? 'شرح تفصيلي لما يحدث في الكواليس داخل خدمات AWS أثناء تنفيذ عملية «إضافة طلب مساعدة لأسرة»'
              : 'Deep-dive walkthrough of what happens under the hood across AWS services during the "Add Assistance Need" transaction'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-mono">
            {isArabic ? 'انقر على أي خطوة لمزامنة الكود والمخطط:' : 'Click any step to sync diagram & code:'}
          </span>
        </div>
      </div>

      {/* Step Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {FLOW_STEPS.map((step) => {
          const isCurrentSim = simulationStep === step.id;
          const isSelected = activeStepId === step.id;
          const isExpanded = expandedStep === step.id;

          return (
            <div
              key={step.id}
              onClick={() => onSelectStep?.(step.id)}
              className={`rounded-2xl p-5 border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-gray-900/95 border-sky-500/70 shadow-lg shadow-sky-950/40 ring-1 ring-sky-500/40'
                  : isCurrentSim
                  ? 'bg-gray-900/90 border-emerald-500/60 shadow-lg shadow-emerald-950/30'
                  : 'bg-gray-950/50 border-gray-800/80 hover:border-gray-700 hover:bg-gray-900/40'
              }`}
            >
              <div>
                {/* Top badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold font-mono ${
                      isSelected
                        ? 'bg-sky-500 text-gray-950'
                        : isCurrentSim
                        ? 'bg-emerald-500 text-gray-950'
                        : 'bg-gray-800 text-gray-300'
                    }`}>
                      {step.stepNumber}
                    </span>
                    <span className="text-xs font-semibold text-gray-200">
                      {isArabic ? step.title_ar : step.title_en}
                    </span>
                  </div>

                  {isSelected && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                      {isArabic ? 'قيد المعاينة' : 'Active Inspect'}
                    </span>
                  )}
                </div>

                {/* Services pill list */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {step.services.map((srv, idx) => (
                    <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-800/70 text-gray-300 border border-gray-700/60">
                      {srv}
                    </span>
                  ))}
                </div>

                {/* Summary */}
                <p className="text-xs text-gray-300 leading-relaxed mb-3">
                  {isArabic ? step.summary_ar : step.summary_en}
                </p>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="space-y-3 pt-3 border-t border-gray-800/80 text-xs">
                    {/* Detailed narrative */}
                    <div className="text-gray-400 leading-relaxed bg-gray-950/60 p-3 rounded-xl border border-gray-800/60">
                      <span className="font-semibold text-gray-200 block mb-1">
                        {isArabic ? 'ماذا يحدث فعليًا في السحابة؟' : 'What actually happens in AWS?'}
                      </span>
                      {isArabic ? step.description_ar : step.description_en}
                    </div>

                    {/* Code & Security */}
                    <div className="bg-gray-950/60 p-3 rounded-xl border border-gray-800/60 flex flex-col gap-1.5">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
                        <FileCode size={13} />
                        <span>{step.code_file} &rarr; <code className="text-emerald-300">{step.code_focus}</code></span>
                      </div>
                      <p className="text-[11px] text-gray-400 leading-relaxed">
                        {isArabic ? step.security_ar : step.security_en}
                      </p>
                    </div>

                    {/* CCP Exam Tip */}
                    <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-[11px] text-emerald-300 leading-relaxed">
                      {isArabic ? step.ccp_tip_ar : step.ccp_tip_en}
                    </div>
                  </div>
                )}
              </div>

              {/* Toggle expand button */}
              <div className="pt-3 mt-3 border-t border-gray-800/50 flex items-center justify-between">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedStep(isExpanded ? null : step.id);
                  }}
                  className="inline-flex items-center gap-1 text-[11px] text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {isExpanded 
                    ? <><ChevronUp size={12} /><span>{isArabic ? 'إخفاء التفاصيل' : 'Hide details'}</span></>
                    : <><ChevronDown size={12} /><span>{isArabic ? 'تفاصيل المعالجة وامتحان CCP' : 'Full details & CCP notes'}</span></>}
                </button>

                <button
                  type="button"
                  onClick={() => onSelectStep?.(step.id)}
                  className={`text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                    isSelected ? 'text-sky-400' : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <span>{isArabic ? 'فحص الكود' : 'Inspect Code'}</span>
                  {isArabic ? <ArrowLeft size={11} /> : <ArrowRight size={11} />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
