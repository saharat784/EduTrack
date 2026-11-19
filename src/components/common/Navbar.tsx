import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GraduationCap, RotateCcw, Download, Sparkles, Shield, User } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { role, setRole, student, instructor, resetDemoData, exportJSON } = useApp();
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-lg tracking-tight">EduTrack</span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-100 text-indigo-700 rounded-full uppercase tracking-wider">
                  Vanness Skill Test
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Student Performance & Evaluation Tracking System
              </p>
            </div>
          </div>

          {/* Center / Right controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Quick Role Switcher Pill */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setRole('student')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  role === 'student'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-4 h-4 text-indigo-500" />
                <span>มุมมองนักศึกษา (Student)</span>
              </button>

              <button
                onClick={() => setRole('instructor')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  role === 'instructor'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Shield className="w-4 h-4 text-indigo-500" />
                <span>มุมมองอาจารย์ (Instructor)</span>
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
                title="ดาวน์โหลดข้อมูลเป็น JSON"
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Role Indicator Banner */}
      <div className={`py-1.5 px-4 text-xs font-medium flex items-center justify-center gap-2 ${
        role === 'student' ? 'bg-indigo-50 text-indigo-700 border-b border-indigo-100' : 'bg-purple-50 text-purple-700 border-b border-purple-100'
      }`}>
        <Sparkles className="w-3.5 h-3.5" />
        <span>
          ขณะนี้คุณกำลังดูระบบใน: <strong>{role === 'student' ? `มุมมองนักศึกษา: ${student.fullName}` : `มุมมองอาจารย์ผู้ประเมิน: ${instructor.fullName}`}</strong>
        </span>
      </div>

      {/* Confirmation Modal for Reset */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-100">
            <h4 className="font-bold text-slate-900 text-base">ยืนยันรีเซ็ตข้อมูลตัวอย่าง?</h4>
            <p className="text-xs text-slate-600 mt-2">
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
