import { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { GradientButton } from '../components/GradientButton';
import { useNavigate } from 'react-router';
import { Download, ArrowLeft, FileText, AlertCircle, CheckCircle } from 'lucide-react';

export function ReportScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'indicators' | 'metadata'>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'indicators', label: 'Indicators' },
    { id: 'metadata', label: 'Metadata' },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0a0118] via-[#1a0a30] to-[#0a0118] p-6">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/result')} className="text-[var(--neon-purple)]">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl text-white">Detailed Report</h1>
            <p className="text-gray-400 text-sm">Analysis breakdown</p>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] text-white'
                  : 'bg-[var(--glass-bg)] text-gray-400 border border-[var(--glass-border)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-4">
            <GlassCard className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <FileText size={24} className="text-[var(--neon-purple)]" />
                <h3 className="text-white text-lg">Analysis Summary</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                This image shows a 92% probability of being authentic. The compression artifacts are
                consistent with natural camera processing, and metadata indicates the file was captured
                using a standard digital camera.
              </p>
            </GlassCard>

            <GlassCard className="p-5">
              <h4 className="text-white mb-3">Confidence Breakdown</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Visual Analysis</span>
                    <span className="text-white">95%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full w-[95%] bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Metadata Check</span>
                    <span className="text-white">88%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full w-[88%] bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Pattern Recognition</span>
                    <span className="text-white">93%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full w-[93%] bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)]" />
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {activeTab === 'indicators' && (
          <div className="space-y-4">
            <GlassCard className="p-5">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white text-sm">Face Anomaly Detection</p>
                    <p className="text-gray-400 text-xs mt-1">No anomalies detected in facial features</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white text-sm">Compression Analysis</p>
                    <p className="text-gray-400 text-xs mt-1">Natural JPEG compression patterns found</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white text-sm">Texture Consistency</p>
                    <p className="text-gray-400 text-xs mt-1">Textures are naturally distributed</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle size={20} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white text-sm">Color Grading</p>
                    <p className="text-gray-400 text-xs mt-1">Slight post-processing detected</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {activeTab === 'metadata' && (
          <div className="space-y-4">
            <GlassCard className="p-5">
              <h4 className="text-white mb-3">File Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">File Name</span>
                  <span className="text-white">beach_sunset.jpg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">File Size</span>
                  <span className="text-white">2.4 MB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Dimensions</span>
                  <span className="text-white">4032 × 3024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Format</span>
                  <span className="text-white">JPEG</span>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-5">
              <h4 className="text-white mb-3">Camera Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Device</span>
                  <span className="text-white">iPhone 13 Pro</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Date Taken</span>
                  <span className="text-white">May 10, 2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">GPS Location</span>
                  <span className="text-white">Available</span>
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        <GradientButton onClick={() => {}} className="w-full flex items-center justify-center gap-2">
          <Download size={20} />
          Download PDF Report
        </GradientButton>
      </div>
    </div>
  );
}
