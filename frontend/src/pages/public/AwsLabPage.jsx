import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AwsLoginModal } from '../../components/aws/AwsLoginModal';
import { AwsDiagram } from '../../components/aws/AwsDiagram';
import { CodePanel } from '../../components/aws/CodePanel';
import { ServiceDemoForm } from '../../components/aws/ServiceDemoForm';
import { ComponentGlossary } from '../../components/aws/ComponentGlossary';

export const AwsLabPage = () => {
  const { i18n } = useTranslation();
  const isArabic = (i18n.language || 'ar').startsWith('ar');

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [simulationStep, setSimulationStep] = useState('idle');
  const [manualSelectedStep, setManualSelectedStep] = useState(null);
  const isLive = !!import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const authed = localStorage.getItem('ataa_aws_lab_authed');
    if (authed === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSimulate = async (formData) => {
    if (!formData) {
      setSimulationStep('idle');
      setManualSelectedStep(null);
      return;
    }

    // Reset manual inspection so live execution is highlighted by default
    setManualSelectedStep(null);

    if (isLive) {
      // Real API Call
      setSimulationStep('submitting');
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/services/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title_ar: formData.title_ar,
            title_en: formData.title_en,
            category: formData.category,
            target_amount: formData.target_amount,
            description_ar: formData.description_ar,
            family_id: formData.family_id,
          })
        });

        if (!response.ok) throw new Error('API Error');
        
        // Response stages
        setSimulationStep('alb');
        await new Promise(r => setTimeout(r, 450));
        setSimulationStep('ec2');
        await new Promise(r => setTimeout(r, 450));
        setSimulationStep('rds');
        await new Promise(r => setTimeout(r, 450));
        setSimulationStep('s3');
        await new Promise(r => setTimeout(r, 450));
        setSimulationStep('complete');
        
      } catch (err) {
        console.error(err);
        setSimulationStep('error');
      }
    } else {
      // Simulation mode
      const steps = ['submitting', 'alb', 'ec2', 'rds', 's3', 'complete'];
      let currentIdx = 0;
      
      setSimulationStep(steps[currentIdx]);
      
      const interval = setInterval(() => {
        currentIdx++;
        if (currentIdx < steps.length) {
          setSimulationStep(steps[currentIdx]);
        } else {
          clearInterval(interval);
        }
      }, 850);
    }
  };

  const handleSelectNode = (stepKey) => {
    setManualSelectedStep(stepKey);
  };

  if (!isAuthenticated) {
    return <AwsLoginModal onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  // If user manually selected a node, code panel inspects that step.
  // Otherwise, it follows the live simulation step.
  const effectiveCodeStep = manualSelectedStep || simulationStep;

  return (
    <div className="bg-gray-950 text-white min-h-screen pb-20">
      {/* Full-width container using available screen real-estate */}
      <div className="max-w-[1750px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-gray-800/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-3 mb-1.5">
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                {isArabic ? 'مختبر AWS السحابي' : 'AWS Cloud Lab'}
              </h1>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2 ${
                isLive 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
              }`}>
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isLive ? 'bg-emerald-400' : 'bg-orange-400'}`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${isLive ? 'bg-emerald-500' : 'bg-orange-500'}`}></span>
                </span>
                {isLive 
                  ? (isArabic ? 'متصل فعليًا بـ AWS' : 'Live AWS Connected') 
                  : (isArabic ? 'وضع المحاكاة التفاعلية' : 'Interactive Simulation')}
              </div>
            </div>
            <p className="text-gray-400 text-sm max-w-3xl">
              {isArabic
                ? 'بيئة تعليمية تفاعلية تحاكي مسار إضافة طلب مساعدة لأسرة متعففة عبر خدمات AWS ومطابقة الكود البرمجي مع بنية السحابة.'
                : 'Interactive educational environment demonstrating how a family assistance request travels through AWS infrastructure and maps to backend code.'}
            </p>
          </div>
        </div>

        {/* Top: Horizontal Service Control Bar */}
        <div className="mb-6">
          <ServiceDemoForm 
            onSubmit={handleSimulate} 
            simulationStep={simulationStep} 
            isLive={isLive} 
          />
        </div>

        {/* Side-by-Side: 60/40 Split between AWS Diagram & Backend Code */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-16 items-start">
          {/* Diagram: 60% width (7 cols) */}
          <div className="xl:col-span-7 flex flex-col h-full">
            <AwsDiagram 
              simulationStep={simulationStep} 
              selectedNode={manualSelectedStep}
              onSelectNode={handleSelectNode}
            />
          </div>

          {/* Code Panel: 40% width (5 cols) */}
          <div className="xl:col-span-5 flex flex-col h-full">
            <CodePanel 
              simulationStep={effectiveCodeStep}
              isManualOverride={!!manualSelectedStep}
              onFollowSimulation={() => setManualSelectedStep(null)}
            />
          </div>
        </div>

        {/* AWS Component Glossary */}
        <ComponentGlossary />
      </div>
    </div>
  );
};
