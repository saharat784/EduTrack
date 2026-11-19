import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GraduationCap, RotateCcw, Download, Sparkles, Shield, User, Server } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { role, setRole, student, instructor, resetDemoData, exportJSON, backendConnected } = useApp();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleReset = () => {
    resetDemoData();
    setShowResetConfirm(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-100">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-lg tracking-tight">EduTrack</span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-700 rounded-full border border-blue-100">
                  ระบบติดตามการเรียนรู้
                </span>
                <span
                  className={`hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                    backendConnected
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${backendConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                  <span>{backendConnected ? 'Backend เชื่อมต่อแล้ว' : 'โหมดออฟไลน์'}</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                ระบบติดตามและประเมินผลการเรียนรู้ของนักศึกษา
              </p>
            </div>
          </div>

          {/* Center / Right controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Role Switcher Pill */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setRole('student')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  role === 'student'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-4 h-4 text-blue-600" />
                <span>มุมมองนักศึกษา</span>
              </button>

              <button
                onClick={() => setRole('instructor')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  role === 'instructor'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Shield className="w-4 h-4 text-blue-600" />
                <span>มุมมองอาจารย์</span>
              </button>
            </div>

            {/* Actions: Reset & Export */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowResetConfirm(true)}
                title="รีเซ็ตข้อมูลตัวอย่างเป็นค่าเริ่มต้น"
                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={exportJSON}
                title="ดาวน์โหลดข้อมูลเป็นไฟล์ JSON"
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ส่งออกข้อมูล</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Role Indicator Banner */}
      <div className="py-1.5 px-4 text-xs font-medium flex items-center justify-center gap-2 bg-blue-50/70 text-blue-800 border-b border-blue-100">
        <Sparkles className="w-3.5 h-3.5" />
        <span>
          มุมมองปัจจุบัน: <strong>{role === 'student' ? student.fullName : instructor.fullName}</strong>
        </span>
      </div>

      {/* Confirmation Modal for Reset */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-100">
            <h4 className="font-bold text-slate-900 text-base">รีเซ็ตข้อมูลตัวอย่าง</h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              ระบบจะรีเซ็ตข้อมูลการส่งงาน คะแนน และโน้ตการประเมินทั้งหมดกลับไปเป็นค่าเริ่มต้นของนายสหรัฐ เวียงแก้ว
            </p>
            <div className="flex items-center justify-end gap-2 mt-5">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors"
              >
                รีเซ็ตข้อมูล
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
