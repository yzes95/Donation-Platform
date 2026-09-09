import { useState, useEffect } from 'react';
import { AwsLoginModal } from '../../components/aws/AwsLoginModal';
import { AwsDiagram } from '../../components/aws/AwsDiagram';
import { CodePanel } from '../../components/aws/CodePanel';
import { ServiceDemoForm } from '../../components/aws/ServiceDemoForm';
import { ComponentGlossary } from '../../components/aws/ComponentGlossary';

export const AwsLabPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [simulationStep, setSimulationStep] = useState('idle');
  const isLive = !!import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const authed = localStorage.getItem('ataa_aws_lab_authed');
    if (authed === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSimulate = async () => {
    if (isLive) {
      // Real API Call
      setSimulationStep('submitting');
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/services/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title_ar: 'مساعدة عيد سعيد - أسرة عم إبراهيم',
            title_en: 'Eid Aid - Ibrahim Family',
            category: 'seasonal',
            target_amount: 3500,
            description_ar: 'توفير ملابس عيد وهدايا للأطفال وسداد فاتورة الكهرباء المتأخرة',
            family_id: 'fam-02'
          })
        });

        if (!response.ok) throw new Error('API Error');
        
        // Fast-forward animation for real response
        setSimulationStep('alb');
        await new Promise(r => setTimeout(r, 400));
        setSimulationStep('ec2');
        await new Promise(r => setTimeout(r, 400));
        setSimulationStep('rds');
        await new Promise(r => setTimeout(r, 400));
        setSimulationStep('s3');
        await new Promise(r => setTimeout(r, 400));
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
      }, 800);
    }
  };

  if (!isAuthenticated) {
    return <AwsLoginModal onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="bg-gray-950 text-white min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <h1 className="text-4xl font-bold text-white">AWS Lab</h1>
            <div className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 ${isLive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'}`}>
              <span className="relative flex h-2.5 w-2.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isLive ? 'bg-emerald-400' : 'bg-orange-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isLive ? 'bg-emerald-500' : 'bg-orange-500'}`}></span>
              </span>
              {isLive ? 'Live Connection' : 'Simulation'}
            </div>
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto">Interactive educational environment to explore how the Ataa platform operates on Amazon Web Services.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          <div className="lg:col-span-5">
            <ServiceDemoForm 
              onSubmit={handleSimulate} 
              simulationStep={simulationStep} 
              isLive={isLive} 
            />
          </div>
          <div className="lg:col-span-7">
            <AwsDiagram simulationStep={simulationStep} />
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-gray-200">Backend Code Security Analysis</h2>
          <CodePanel simulationStep={simulationStep} />
        </div>

        <ComponentGlossary />
      </div>
    </div>
  );
};
