import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { SplashScreen } from './screens/SplashScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { LoginScreen } from './screens/LoginScreen';
import { SignupScreen } from './screens/SignupScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { UploadScreen } from './screens/UploadScreen';
import { AnalyzingScreen } from './screens/AnalyzingScreen';
import { ResultScreen } from './screens/ResultScreen';
import { ReportScreen } from './screens/ReportScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';
import { PremiumScreen } from './screens/PremiumScreen';
import { BatchUploadScreen } from './screens/BatchUploadScreen';
import { ScanQueueScreen } from './screens/ScanQueueScreen';
import { CameraScreen } from './screens/CameraScreen';
import { ComparisonScreen } from './screens/ComparisonScreen';
import { StatisticsScreen } from './screens/StatisticsScreen';
import { HelpScreen } from './screens/HelpScreen';
import { TutorialScreen } from './screens/TutorialScreen';
import { ShareScreen } from './screens/ShareScreen';
import { AboutScreen } from './screens/AboutScreen';
import { FeedbackScreen } from './screens/FeedbackScreen';
import { AIModelScreen } from './screens/AIModelScreen';
import { MenuScreen } from './screens/MenuScreen';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen w-full max-w-md mx-auto bg-[#0a0118] relative overflow-x-hidden dark">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.08),transparent_50%),radial-gradient(circle_at_70%_60%,rgba(59,130,246,0.08),transparent_50%)] pointer-events-none" />
        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<Navigate to="/splash" replace />} />
            <Route path="/splash" element={<SplashScreen />} />
            <Route path="/onboarding" element={<OnboardingScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/signup" element={<SignupScreen />} />
            <Route path="/dashboard" element={<DashboardScreen />} />
            <Route path="/upload" element={<UploadScreen />} />
            <Route path="/analyzing" element={<AnalyzingScreen />} />
            <Route path="/result" element={<ResultScreen />} />
            <Route path="/report" element={<ReportScreen />} />
            <Route path="/history" element={<HistoryScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/settings" element={<SettingsScreen />} />
            <Route path="/notifications" element={<NotificationsScreen />} />
            <Route path="/premium" element={<PremiumScreen />} />
            <Route path="/batch-upload" element={<BatchUploadScreen />} />
            <Route path="/scan-queue" element={<ScanQueueScreen />} />
            <Route path="/camera" element={<CameraScreen />} />
            <Route path="/comparison" element={<ComparisonScreen />} />
            <Route path="/statistics" element={<StatisticsScreen />} />
            <Route path="/help" element={<HelpScreen />} />
            <Route path="/tutorial" element={<TutorialScreen />} />
            <Route path="/share" element={<ShareScreen />} />
            <Route path="/about" element={<AboutScreen />} />
            <Route path="/feedback" element={<FeedbackScreen />} />
            <Route path="/ai-models" element={<AIModelScreen />} />
            <Route path="/menu" element={<MenuScreen />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
