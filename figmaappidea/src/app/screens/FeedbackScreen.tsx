import { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { GradientButton } from '../components/GradientButton';
import { useNavigate } from 'react-router';
import { ArrowLeft, MessageSquare, Star } from 'lucide-react';

export function FeedbackScreen() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [category, setCategory] = useState('general');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/profile');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0a0118] via-[#1a0a30] to-[#0a0118] p-6">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/profile')} className="text-[var(--neon-purple)]">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl text-white">Feedback</h1>
            <p className="text-gray-400 text-sm">Help us improve</p>
          </div>
        </div>

        <GlassCard className="p-6 bg-gradient-to-br from-[var(--neon-purple)]/10 to-[var(--neon-blue)]/10">
          <div className="flex items-center gap-3 mb-3">
            <MessageSquare size={24} className="text-[var(--neon-purple)]" />
            <h3 className="text-white">We Value Your Opinion</h3>
          </div>
          <p className="text-sm text-gray-400">
            Your feedback helps us build better features and improve the accuracy of our AI models.
          </p>
        </GlassCard>

        <GlassCard className="p-5">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm text-gray-300 mb-3 block">Rate Your Experience</label>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      size={40}
                      className={star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-300 mb-2 block">Feedback Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[var(--neon-purple)] transition-all"
              >
                <option value="general">General Feedback</option>
                <option value="bug">Bug Report</option>
                <option value="feature">Feature Request</option>
                <option value="accuracy">Detection Accuracy</option>
                <option value="ui">UI/UX Improvement</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-300 mb-2 block">Your Feedback</label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tell us what you think..."
                rows={6}
                className="w-full px-4 py-3 bg-[var(--input-background)] border border-[var(--border)] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--neon-purple)] transition-all resize-none"
              />
            </div>

            <GradientButton type="submit" className="w-full">
              Submit Feedback
            </GradientButton>
          </form>
        </GlassCard>

        <GlassCard className="p-4">
          <h4 className="text-white text-sm mb-2">Need Immediate Help?</h4>
          <button className="text-sm text-[var(--neon-purple)] hover:underline">
            Contact Support Team →
          </button>
        </GlassCard>
      </div>
    </div>
  );
}
