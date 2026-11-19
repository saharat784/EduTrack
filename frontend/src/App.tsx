import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { StudentDashboard } from './components/student/StudentDashboard';
import { InstructorDashboard } from './components/instructor/InstructorDashboard';
import { PerformanceAnalytics } from './components/analytics/PerformanceAnalytics';
import { GraduationCap } from 'lucide-react';

export const AppContent: React.FC = () => {
  const { role } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans','Sarabun',sans-serif]">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Render View Based on Role */}
        {role === 'student' ? (
          <div className="space-y-8">
            <StudentDashboard />
            <PerformanceAnalytics />
          </div>
        ) : (
          <div className="space-y-8">
            <InstructorDashboard />
            <PerformanceAnalytics />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            <span className="font-bold text-slate-700">EduTrack Performance System</span>
            <span>•</span>
            <span>Skill Test for Fullstack Developer Trainee</span>
          </div>

          <div className="flex items-center gap-3">
            <span>ผู้สมัคร: <strong>นายสหรัฐ เวียงแก้ว</strong></span>
            <span>•</span>
            <span className="text-blue-600 font-semibold">Vanness Plus Consulting Co., Ltd.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return <AppContent />;
};

export default App;
