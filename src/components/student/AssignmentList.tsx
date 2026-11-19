import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Assignment, SubmissionStatus, AssignmentCategory } from '../../types';
import { StatusBadge, CategoryBadge } from '../common/StatusBadge';
import { SubmitWorkModal } from './SubmitWorkModal';
import { Search, Filter, Calendar, Clock, Award, ArrowRight, MessageSquare, AlertTriangle } from 'lucide-react';

export const AssignmentList: React.FC = () => {
  const { assignments, submissions } = useApp();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  // Filter assignments
  const filteredAssignments = assignments.filter((asg) => {
    const sub = submissions[asg.id];
    const status: SubmissionStatus = sub ? sub.status : 'not_submitted';

    // Status filter
    if (statusFilter === 'not_submitted' && status !== 'not_submitted') return false;
    if (statusFilter === 'pending' && status !== 'submitted' && status !== 'late') return false;
    if (statusFilter === 'graded' && status !== 'graded') return false;

    // Category filter
    if (categoryFilter !== 'all' && asg.category !== categoryFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = asg.title.toLowerCase().includes(q);
      const matchDesc = asg.description.toLowerCase().includes(q);
      const matchCode = asg.courseCode.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchCode) return false;
    }

    return true;
  });

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาชื่อการบ้าน, ข้อสอบ, หรือวิชา..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status buttons */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                statusFilter === 'all' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              ทั้งหมด ({assignments.length})
            </button>
            <button
              onClick={() => setStatusFilter('not_submitted')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                statusFilter === 'not_submitted' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              ยังไม่ส่ง
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                statusFilter === 'pending' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              รอตรวจ
            </button>
            <button
              onClick={() => setStatusFilter('graded')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                statusFilter === 'graded' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              ตรวจแล้ว
            </button>
          </div>

          {/* Category Select */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">ทุกประเภทงาน</option>
            <option value="assignment">การบ้าน / งานมอบหมาย</option>
            <option value="quiz">แบบทดสอบย่อย (Quiz)</option>
            <option value="exam">การสอบ (Exam)</option>
            <option value="project">โครงงาน (Project)</option>
          </select>
        </div>
      </div>

      {/* Assignment Cards Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredAssignments.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-dashed border-slate-300 text-center text-slate-500">
            <p className="text-sm font-semibold">ไม่พบรายการงานที่ตรงกับเงื่อนไขการค้นหา</p>
            <p className="text-xs text-slate-400 mt-1">ลองเปลี่ยนตัวกรอง หรือรีเซ็ตคำค้นหาดูครับ</p>
          </div>
        ) : (
          filteredAssignments.map((asg) => {
            const sub = submissions[asg.id];
            const status: SubmissionStatus = sub ? sub.status : 'not_submitted';
            const dueDate = new Date(asg.dueDate);
            const isPastDue = new Date() > dueDate;

            return (
              <div
                key={asg.id}
                className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm hover:border-indigo-300 transition-all duration-200 flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <CategoryBadge category={asg.category} />
                      <span className="text-xs font-semibold text-slate-400">{asg.courseCode}</span>
                    </div>
                    <StatusBadge status={status} />
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {asg.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {asg.description}
                  </p>
                </div>

                {/* Submissions & Note Highlight */}
                {sub && sub.status === 'graded' && sub.instructorNote && (
                  <div className="bg-emerald-50/60 border border-emerald-100 rounded-lg p-2.5 text-xs text-emerald-800 flex items-start gap-2">
                    <MessageSquare className="w-3.5 h-3.5 flex-shrink-0 text-emerald-600 mt-0.5" />
                    <div className="flex-1">
                      <span className="font-bold text-[11px] block">คำแนะนำจากอาจารย์:</span>
                      <p className="line-clamp-2 italic">"{sub.instructorNote}"</p>
                    </div>
                  </div>
                )}

                {/* Footer with Due Date, Score & Action Button */}
                <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-100 gap-3">
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        กำหนดส่ง: <strong className={isPastDue && status === 'not_submitted' ? 'text-rose-600 font-bold' : 'text-slate-700'}>
                          {dueDate.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })} ({dueDate.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })})
                        </strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-indigo-500" />
                      <span>
                        คะแนน:{' '}
                        {status === 'graded' ? (
                          <strong className="text-emerald-600 font-extrabold text-sm">
                            {sub?.score} / {asg.maxScore}
                          </strong>
                        ) : (
                          <span className="font-semibold text-slate-700">{asg.maxScore} คะแนน</span>
                        )}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedAssignment(asg)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      status === 'graded'
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        : status === 'submitted' || status === 'late'
                        ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs'
                    }`}
                  >
                    <span>
                      {status === 'graded'
                        ? 'ดูผลคะแนน & โน้ต'
                        : status === 'submitted' || status === 'late'
                        ? 'แก้ไขการส่งงาน'
                        : 'ส่งงาน (Submit)'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Submit Work Modal */}
      <SubmitWorkModal
        isOpen={!!selectedAssignment}
        onClose={() => setSelectedAssignment(null)}
        assignment={selectedAssignment}
      />
    </div>
  );
};
