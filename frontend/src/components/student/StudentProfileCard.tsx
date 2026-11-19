import React from 'react';
import { useApp } from '../../context/AppContext';
import { Award, BookOpen, Calendar, CheckCircle2, TrendingUp, UserCheck } from 'lucide-react';

export const StudentProfileCard: React.FC = () => {
  const { student, course, stats } = useApp();

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-50/60 via-purple-50/40 to-transparent rounded-full blur-2xl -mr-20 -mt-20 pointer-events-none" />

      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left: Avatar & Bio */}
        <div className="flex items-start sm:items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-indigo-100 ring-4 ring-white">
              SW
            </div>
            <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full ring-2 ring-white">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {student.fullName}
              </h2>
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full">
                รหัสนักศึกษา: {student.studentCode}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-2 text-xs sm:text-sm text-slate-600">
              <span className="flex items-center gap-1 font-semibold text-indigo-600">
                <Award className="w-4 h-4 text-indigo-500" />
                {student.academicYear}
              </span>
              <span>•</span>
              <span>{student.major}</span>
              <span>•</span>
              <span className="text-slate-500">{student.faculty}</span>
            </div>

            <div className="flex items-center gap-2 mt-3 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 w-fit">
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              <span>
                วิชา: <strong className="text-slate-700">{course.courseCode} {course.courseName}</strong> ({course.academicYear})
              </span>
            </div>
          </div>
        </div>

        {/* Right: Academic Performance Score & Predicted Grade */}
        <div className="flex items-center gap-3 bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100">
          <div className="text-center px-3 border-r border-indigo-200/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block">
              เกรดคาดการณ์
            </span>
            <span className="text-3xl font-black text-indigo-900">
              {stats.predictedGrade.grade}
            </span>
            <span className="text-[10px] text-indigo-600 font-semibold block mt-0.5">
              (GPA {stats.predictedGrade.gpaPoint.toFixed(1)})
            </span>
          </div>

          <div className="px-2 space-y-1 text-xs">
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-500">คะแนนสะสม:</span>
              <span className="font-bold text-slate-800">
                {stats.totalEarnedScore.toFixed(1)} / {stats.totalPossibleScore}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-500">ส่งงานตรงเวลา:</span>
              <span className="font-bold text-emerald-600">{stats.onTimeRate}%</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-500">สถานะการตรวจ:</span>
              <span className="font-bold text-indigo-600">
                {stats.gradedCount}/{stats.totalAssignments} งาน
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
