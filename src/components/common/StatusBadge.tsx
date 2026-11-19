import React from 'react';
import { SubmissionStatus, AssignmentCategory } from '../../types';
import { CheckCircle2, Clock, AlertCircle, Award, FileText, HelpCircle, BookOpen, Layers } from 'lucide-react';

export const StatusBadge: React.FC<{ status: SubmissionStatus; size?: 'sm' | 'md' }> = ({
  status,
  size = 'md',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs sm:text-sm';

  switch (status) {
    case 'graded':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 ${sizeClasses}`}
        >
          <Award className="w-3.5 h-3.5 text-emerald-600" />
          <span>ตรวจแล้ว (Graded)</span>
        </span>
      );
    case 'submitted':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-blue-50 text-blue-700 border border-blue-200 ${sizeClasses}`}
        >
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          <span>ส่งแล้ว รอตรวจ (Submitted)</span>
        </span>
      );
    case 'late':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-amber-50 text-amber-700 border border-amber-200 ${sizeClasses}`}
        >
          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
          <span>ส่งล่าช้า (Late Submission)</span>
        </span>
      );
    case 'not_submitted':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-slate-100 text-slate-600 border border-slate-200 ${sizeClasses}`}
        >
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>ยังไม่ส่ง (Not Submitted)</span>
        </span>
      );
  }
};

export const CategoryBadge: React.FC<{ category: AssignmentCategory }> = ({ category }) => {
  switch (category) {
    case 'assignment':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
          <FileText className="w-3 h-3 text-indigo-500" />
          <span>การบ้าน/งานมอบหมาย</span>
        </span>
      );
    case 'quiz':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
          <HelpCircle className="w-3 h-3 text-purple-500" />
          <span>แบบทดสอบย่อย (Quiz)</span>
        </span>
      );
    case 'exam':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
          <BookOpen className="w-3 h-3 text-rose-500" />
          <span>การสอบ (Exam)</span>
        </span>
      );
    case 'project':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
          <Layers className="w-3 h-3 text-amber-600" />
          <span>โครงงาน (Project)</span>
        </span>
      );
  }
};
