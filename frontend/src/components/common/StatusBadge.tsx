import React from 'react';
import { SubmissionStatus, AssignmentCategory } from '../../types';
import { Award, Clock, AlertCircle, FileText, HelpCircle, BookOpen, Layers } from 'lucide-react';

export const StatusBadge: React.FC<{ status: SubmissionStatus; size?: 'sm' | 'md' }> = ({
  status,
  size = 'md',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  switch (status) {
    case 'graded':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80 ${sizeClasses}`}
        >
          <Award className="w-3.5 h-3.5 text-emerald-600" />
          <span>ตรวจแล้ว</span>
        </span>
      );
    case 'submitted':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-blue-50 text-blue-700 border border-blue-200/80 ${sizeClasses}`}
        >
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          <span>รอตรวจ</span>
        </span>
      );
    case 'late':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-amber-50 text-amber-700 border border-amber-200/80 ${sizeClasses}`}
        >
          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
          <span>ส่งล่าช้า</span>
        </span>
      );
    case 'not_submitted':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-slate-100 text-slate-600 border border-slate-200/80 ${sizeClasses}`}
        >
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>ยังไม่ส่ง</span>
        </span>
      );
  }
};

export const CategoryBadge: React.FC<{ category: AssignmentCategory }> = ({ category }) => {
  switch (category) {
    case 'assignment':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200/80">
          <FileText className="w-3 h-3 text-indigo-500" />
          <span>งานมอบหมาย</span>
        </span>
      );
    case 'quiz':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200/80">
          <HelpCircle className="w-3 h-3 text-blue-500" />
          <span>แบบทดสอบ</span>
        </span>
      );
    case 'exam':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200/80">
          <BookOpen className="w-3 h-3 text-rose-500" />
          <span>การสอบ</span>
        </span>
      );
    case 'project':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200/80">
          <Layers className="w-3 h-3 text-amber-600" />
          <span>โครงงาน</span>
        </span>
      );
  }
};
