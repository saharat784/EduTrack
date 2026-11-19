import React from 'react';
import { StudentProfileCard } from './StudentProfileCard';
import { AssignmentList } from './AssignmentList';
import { useApp } from '../../context/AppContext';
import { Clock, FileCheck, AlertCircle, BookCheck } from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { stats } = useApp();

  return (
    <div className="space-y-6">
      {/* Student Profile Card */}
      <StudentProfileCard />

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <BookCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-500 block">งานทั้งหมด</span>
            <span className="text-xl font-bold text-slate-900">{stats.totalAssignments}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-500 block">ตรวจแล้ว</span>
            <span className="text-xl font-bold text-emerald-600">{stats.gradedCount}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-500 block">รออาจารย์ตรวจ</span>
            <span className="text-xl font-bold text-blue-600">{stats.pendingGradingCount}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-500 block">ยังไม่ส่ง</span>
            <span className="text-xl font-bold text-rose-600">{stats.notSubmittedCount}</span>
          </div>
        </div>
      </div>

      {/* Main Section Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h3 className="text-base font-bold text-slate-900">รายการงานมอบหมายและการสอบ</h3>
          <p className="text-xs text-slate-500">
            คลิกที่การ์ดเพื่อดูรายละเอียดงาน ผลการตรวจ และส่งงาน
          </p>
        </div>
      </div>

      {/* Assignment List */}
      <AssignmentList />
    </div>
  );
};
