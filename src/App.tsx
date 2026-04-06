import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { ToastContainer } from '@/components/ui/Toast';
import { useAuth } from '@/hooks/useAuth';

// Lazy load pages
const Landing = lazy(() => import('@/pages/Landing'));
const Login = lazy(() => import('@/pages/auth/Login'));
const Register = lazy(() => import('@/pages/auth/Register'));
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'));
const OnboardingShell = lazy(() => import('@/pages/onboarding/OnboardingShell'));
const Dashboard = lazy(() => import('@/pages/dashboard/Dashboard'));
const LabsHome = lazy(() => import('@/pages/labs/LabsHome'));
const LabUpload = lazy(() => import('@/pages/labs/LabUpload'));
const LabDetail = lazy(() => import('@/pages/labs/LabDetail'));
const WellnessPlan = lazy(() => import('@/pages/wellness/WellnessPlan'));
const Medications = lazy(() => import('@/pages/medications/Medications'));
const Symptoms = lazy(() => import('@/pages/symptoms/Symptoms'));
const DoctorPrep = lazy(() => import('@/pages/doctor-prep/DoctorPrep'));
const Insurance = lazy(() => import('@/pages/insurance/Insurance'));
const Progress = lazy(() => import('@/pages/progress/Progress'));
const Settings = lazy(() => import('@/pages/settings/Settings'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-500 rounded-full animate-spin" />
    </div>
  );
}

function AuthInit({ children }: { children: React.ReactNode }) {
  useAuth();
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthInit>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/onboarding" element={<OnboardingShell />} />

            {/* Protected app routes */}
            <Route path="/app" element={<AppShell />}>
              <Route index element={<Dashboard />} />
              <Route path="labs" element={<LabsHome />} />
              <Route path="labs/upload" element={<LabUpload />} />
              <Route path="labs/:drawId" element={<LabDetail />} />
              <Route path="wellness" element={<WellnessPlan />} />
              <Route path="medications" element={<Medications />} />
              <Route path="symptoms" element={<Symptoms />} />
              <Route path="doctor-prep" element={<DoctorPrep />} />
              <Route path="insurance" element={<Insurance />} />
              <Route path="progress" element={<Progress />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        <ToastContainer />
      </AuthInit>
    </BrowserRouter>
  );
}
