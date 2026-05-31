import { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { useNavigate } from 'react-router';
import { ArrowLeft, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export function HelpScreen() {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const faqs = [
    {
      id: 1,
      question: 'How does TruthPulse detect AI-generated content?',
      answer: 'TruthPulse uses advanced machine learning algorithms to analyze visual artifacts, compression patterns, metadata, and texture inconsistencies that are typical of AI-generated images and videos.',
    },
    {
      id: 2,
      question: 'What file formats are supported?',
      answer: 'We support JPG, PNG, WebP for images and MP4, MOV, AVI for videos. Maximum file size is 50MB for images and 500MB for videos.',
    },
    {
      id: 3,
      question: 'How accurate is the detection?',
      answer: 'TruthPulse achieves 98% accuracy in controlled tests. However, results depend on image quality, compression, and the AI generation method used.',
    },
    {
      id: 4,
      question: 'Can I analyze multiple files at once?',
      answer: 'Yes! Premium users can use batch upload to analyze up to 50 files simultaneously with priority processing.',
    },
    {
      id: 5,
      question: 'How do I read the trust score?',
      answer: 'Trust scores range from 0-100%. Scores above 70% indicate likely real content, 30-70% is uncertain, and below 30% suggests AI generation.',
    },
    {
      id: 6,
      question: 'Is my data secure?',
      answer: 'Yes. All uploads are encrypted, processed securely, and automatically deleted after 30 days. We never share your data with third parties.',
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0a0118] via-[#1a0a30] to-[#0a0118] p-6">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/profile')} className="text-[var(--neon-purple)]">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl text-white">Help & FAQ</h1>
            <p className="text-gray-400 text-sm">Common questions</p>
          </div>
        </div>

        <GlassCard className="p-5 bg-gradient-to-br from-[var(--neon-purple)]/10 to-[var(--neon-blue)]/10">
          <div className="flex items-start gap-3">
            <HelpCircle size={24} className="text-[var(--neon-purple)] flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-white mb-2">Need More Help?</h3>
              <p className="text-sm text-gray-400 mb-3">
                Can't find what you're looking for? Contact our support team.
              </p>
              <button className="text-sm text-[var(--neon-purple)] hover:underline">
                Contact Support →
              </button>
            </div>
          </div>
        </GlassCard>

        <div className="space-y-3">
          {faqs.map((faq) => (
            <GlassCard key={faq.id} className="p-4">
              <button
                onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                className="w-full flex items-start justify-between gap-3 text-left"
              >
                <h3 className="text-white flex-1">{faq.question}</h3>
                {expandedId === faq.id ? (
                  <ChevronUp size={20} className="text-[var(--neon-purple)] flex-shrink-0 mt-0.5" />
                ) : (
                  <ChevronDown size={20} className="text-gray-400 flex-shrink-0 mt-0.5" />
                )}
              </button>
              {expandedId === faq.id && (
                <p className="text-sm text-gray-400 mt-3 leading-relaxed">
                  {faq.answer}
                </p>
              )}
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
