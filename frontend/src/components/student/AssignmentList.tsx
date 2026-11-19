import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Assignment, SubmissionStatus } from '../../types';
import { StatusBadge, CategoryBadge } from '../common/StatusBadge';
import { SubmitWorkModal } from './SubmitWorkModal';
import { Search, Calendar, Award, ChevronRight } from 'lucide-react';

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
      <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาชื่องาน การสอบ หรือรหัสวิชา..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status buttons */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                statusFilter === 'all' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              ทั้งหมด
            </button>
            <button
              onClick={() => setStatusFilter('not_submitted')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                statusFilter === 'not_submitted' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              ยังไม่ส่ง
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                statusFilter === 'pending' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              รอตรวจ
            </button>
            <button
              onClick={() => setStatusFilter('graded')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                statusFilter === 'graded' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              ตรวจแล้ว
            </button>
          </div>

          {/* Category Select */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">ทุกประเภท</option>
            <option value="assignment">งานมอบหมาย</option>
            <option value="quiz">แบบทดสอบ</option>
            <option value="exam">การสอบ</option>
            <option value="project">โครงงาน</option>
          </select>
        </div>
      </div>

      {/* Assignment Cards Grid (Clean, Clickable Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAssignments.length === 0 ? (
          <div className="col-span-full bg-white p-8 rounded-xl border border-dashed border-slate-300 text-center text-slate-500">
            <p className="text-sm font-semibold">ไม่พบรายการงานที่ตรงกับคำค้นหา</p>
            <p className="text-xs text-slate-400 mt-1">ลองเปลี่ยนตัวกรอง หรือรีเซ็ตคำค้นหา</p>
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
                onClick={() => setSelectedAssignment(asg)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedAssignment(asg);
                  }
                }}
                className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-blue-400 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between gap-4 group"
              >
                {/* Header: Badges & Course Code */}
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      <CategoryBadge category={asg.category} />
                      <span className="text-xs font-bold text-slate-400">{asg.courseCode}</span>
                    </div>
                    <StatusBadge status={status} size="sm" />
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {asg.title}
                  </h3>
                </div>

                {/* Footer with Due Date, Score & Click Indication */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>
                        ส่งภายใน:{' '}
                        <strong
                          className={
                            isPastDue && status === 'not_submitted'
                              ? 'text-rose-600 font-bold'
                              : 'text-slate-700'
                          }
                        >
                          {dueDate.toLocaleDateString('th-TH', {
                            day: 'numeric',
                            month: 'short',
                            year: '2-digit',
                          })}
                        </strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Award className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                      <span>
                        คะแนน:{' '}
                        {status === 'graded' ? (
                          <strong className="text-emerald-600 font-extrabold">
                            {sub?.score} / {asg.maxScore}
                          </strong>
                        ) : (
                          <span className="font-semibold text-slate-700">{asg.maxScore}</span>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                    <span>
                      {status === 'graded'
                        ? 'ดูผลคะแนน'
                        : status === 'submitted' || status === 'late'
                        ? 'ดูผลงาน'
                        : 'ส่งงาน'}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Detail & Submission Modal */}
      <SubmitWorkModal
        isOpen={!!selectedAssignment}
        onClose={() => setSelectedAssignment(null)}
        assignment={selectedAssignment}
      />
    </div>
  );
};
