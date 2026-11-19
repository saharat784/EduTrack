import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Assignment, Submission } from '../../types';
import { StatusBadge, CategoryBadge } from '../common/StatusBadge';
import { GradingModal } from './GradingModal';
import { AssignmentManager } from './AssignmentManager';
import { StudentGradeReport } from './StudentGradeReport';
import {
  FileCheck,
  Layers,
  MessageSquare,
  ExternalLink,
} from 'lucide-react';

export const InstructorDashboard: React.FC = () => {
  const { student, instructor, course, assignments, submissions, stats } = useApp();
  const [activeTab, setActiveTab] = useState<'grading' | 'report' | 'manage'>('grading');
  const [gradingAssignment, setGradingAssignment] = useState<Assignment | null>(null);

  return (
    <div className="space-y-6">
      {/* Instructor Welcome Banner */}
      <div className="bg-gradient-to-r bg-blue-700 text-white rounded-2xl p-6 shadow-xs relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-500/30 text-blue-200 border border-blue-400/30 rounded-full">
                ระบบอาจารย์
              </span>
              <span className="text-xs text-blue-200">
                {course.courseCode} {course.courseName}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black mt-1">
              {instructor.fullName}
            </h2>
            <p className="text-xs text-blue-200/80 mt-1">
              กำลังประเมินนักศึกษา: <strong>{student.fullName} • {student.academicYear}</strong>
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10">
            <div className="text-center px-3 border-r border-white/10">
              <span className="text-[10px] uppercase font-bold text-white block">รอตรวจ</span>
              <span className="text-2xl font-black text-amber-500">{stats.pendingGradingCount}</span>
            </div>
            <div className="text-center px-3">
              <span className="text-[10px] uppercase font-bold  block">ตรวจแล้ว</span>
              <span className="text-2xl font-black text-green-500">{stats.gradedCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('grading')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'grading'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>ศูนย์ตรวจงานและให้คะแนน</span>
          {stats.pendingGradingCount > 0 && (
            <span className="px-1.5 py-0.2 bg-amber-400 text-slate-900 text-[10px] font-extrabold rounded-full">
              {stats.pendingGradingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('report')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'report'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>ใบบันทึกผลและตัดเกรด</span>
        </button>

        <button
          onClick={() => setActiveTab('manage')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'manage'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>จัดการงานมอบหมาย</span>
        </button>
      </div>

      {/* Tab 1: Grading Center */}
      {activeTab === 'grading' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  รายการงานของ {student.fullName}
                </h3>
                <p className="text-xs text-slate-500">
                  คลิกปุ่มตรวจงานเพื่อให้คะแนนและเขียนข้อเสนอแนะ
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {assignments.map((asg) => {
                const sub: Submission | undefined = submissions[asg.id];
                const status = sub?.status || 'not_submitted';
                const dueDate = new Date(asg.dueDate);

                return (
                  <div
                    key={asg.id}
                    className={`p-4 rounded-xl border transition-all ${
                      status === 'submitted' || status === 'late'
                        ? 'border-blue-300 bg-blue-50/20 shadow-xs'
                        : 'border-slate-200/80 bg-white'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <CategoryBadge category={asg.category} />
                          <StatusBadge status={status} size="sm" />
                          <span className="text-[11px] text-slate-400">
                            ครบกำหนด:{' '}
                            {dueDate.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                          {asg.title}
                        </h4>

                        {/* Submission Preview if available */}
                        {sub && sub.workContent && (
                          <div className="mt-2 text-xs text-slate-600 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-500">ผลงานที่ส่ง:</span>
                              {sub.workType === 'link' ? (
                                <a
                                  href={sub.workContent}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline flex items-center gap-1 font-medium"
                                >
                                  <span>{sub.workContent}</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              ) : (
                                <span className="text-slate-800">{sub.workContent}</span>
                              )}
                            </div>

                            {/* Show student reflection note snippet */}
                            {sub.studentNote && (
                              <div className="bg-blue-50/60 border border-blue-100 p-2 rounded-lg text-blue-900 text-xs flex items-start gap-1.5 mt-1">
                                <MessageSquare className="w-3.5 h-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div>
                                  <span className="font-bold text-[10px] uppercase text-blue-700">โน้ตจากนักศึกษา:</span>{' '}
                                  <span className="italic">"{sub.studentNote}"</span>
                                </div>
                              </div>
                            )}

                            {/* Show instructor note snippet if graded */}
                            {sub.instructorNote && (
                              <div className="bg-emerald-50/60 border border-emerald-100 p-2 rounded-lg text-emerald-900 text-xs flex items-start gap-1.5 mt-1">
                                <MessageSquare className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                                <div>
                                  <span className="font-bold text-[10px] uppercase text-emerald-700">ข้อเสนอแนะที่ให้ไว้:</span>{' '}
                                  <span className="italic">"{sub.instructorNote}"</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Right side: Score & Action button */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block">คะแนน</span>
                          <span className="text-base font-extrabold text-slate-900">
                            {sub?.score !== null && sub?.score !== undefined ? (
                              <span className="text-emerald-600 font-black">{sub.score}</span>
                            ) : (
                              '-'
                            )}{' '}
                            <span className="text-xs font-normal text-slate-500">/ {asg.maxScore}</span>
                          </span>
                        </div>

                        <button
                          onClick={() => setGradingAssignment(asg)}
                          disabled={status === 'not_submitted'}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors ${
                            status === 'not_submitted'
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              : status === 'graded'
                              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs'
                          }`}
                        >
                          <span>{status === 'graded' ? 'แก้ไขคะแนน' : 'ตรวจงาน'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Grade Report */}
      {activeTab === 'report' && <StudentGradeReport />}

      {/* Tab 3: Assignment Manager */}
      {activeTab === 'manage' && <AssignmentManager />}

      {/* Grading Modal */}
      <GradingModal
        isOpen={!!gradingAssignment}
        onClose={() => setGradingAssignment(null)}
        assignment={gradingAssignment}
      />
    </div>
  );
};
