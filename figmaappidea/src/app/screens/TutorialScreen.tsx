import { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { GradientButton } from '../components/GradientButton';
import { useNavigate } from 'react-router';
import { Upload, Scan, FileText, CheckCircle, Play } from 'lucide-react';

export function TutorialScreen() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: Upload,
      title: 'Upload Your Media',
      description: 'Select an image or video file from your device, or use the camera to capture directly.',
      tips: ['Supported formats: JPG, PNG, MP4', 'Max file size: 50MB', 'Better quality = Better results'],
    },
    {
      icon: Scan,
      title: 'AI Analysis Starts',
      description: 'Our advanced AI examines compression, metadata, textures, and visual artifacts.',
      tips: ['Usually takes 10-30 seconds', 'Premium users get priority', 'Multiple AI models working together'],
    },
    {
      icon: FileText,
      title: 'Review Results',
      description: 'Get your trust score and detailed breakdown of authenticity indicators.',
      tips: ['70%+ = Likely Real', '30-70% = Uncertain', 'Below 30% = Likely AI'],
    },
    {
      icon: CheckCircle,
      title: 'Take Action',
      description: 'Download reports, share results, or save to your history for future reference.',
      tips: ['Export PDF reports', 'Compare multiple scans', 'Track trends over time'],
    },
  ];

  const currentStepData = steps[currentStep];
  const StepIcon = currentStepData.icon;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0a0118] via-[#1a0a30] to-[#0a0118] p-6 flex flex-col">
      <div className="flex-1 flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl text-white mb-2">How It Works</h1>
          <p className="text-gray-400 text-sm">Step {currentStep + 1} of {steps.length}</p>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <GlassCard className="p-8 mb-6">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] blur-2xl opacity-40" />
                <div className="relative w-20 h-20 bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-blue)] rounded-2xl flex items-center justify-center">
                  <StepIcon size={40} className="text-white" />
                </div>
              </div>
            </div>

            <h2 className="text-2xl text-white text-center mb-3">
              {currentStepData.title}
            </h2>
            <p className="text-gray-400 text-center mb-6 leading-relaxed">
              {currentStepData.description}
            </p>

            <div className="space-y-2">
              {currentStepData.tips.map((tip, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-[var(--neon-purple)] rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm text-gray-400">{tip}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          <div className="flex gap-2 justify-center mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'w-8 bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)]'
                    : 'w-2 bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {currentStep < steps.length - 1 ? (
          <GradientButton onClick={() => setCurrentStep(currentStep + 1)} className="w-full">
            Next Step
          </GradientButton>
        ) : (
          <GradientButton onClick={() => navigate('/upload')} className="w-full">
            Start Analyzing
          </GradientButton>
        )}

        {currentStep > 0 && (
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            className="w-full py-3 text-gray-400 hover:text-white transition-colors"
          >
            Previous
          </button>
        )}

        <button
          onClick={() => navigate('/dashboard')}
          className="w-full py-3 text-gray-400 hover:text-white transition-colors"
        >
          Skip Tutorial
        </button>
      </div>
    </div>
  );
}
