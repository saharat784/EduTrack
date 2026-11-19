import React, { useState, useEffect } from 'react';
import { Assignment, Submission } from '../../types';
import { Modal } from '../common/Modal';
import { StatusBadge, CategoryBadge } from '../common/StatusBadge';
import { useApp } from '../../context/AppContext';
import { Award, MessageSquare, ExternalLink, Calendar, AlertCircle, CheckCircle, User, FileText } from 'lucide-react';

interface GradingModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: Assignment | null;
}

export const GradingModal: React.FC<GradingModalProps> = ({
  isOpen,
  onClose,
  assignment,
}) => {
  const { student, submissions, gradeSubmission } = useApp();

  const [score, setScore] = useState<string>('');
  const [instructorNote, setInstructorNote] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const currentSubmission: Submission | undefined = assignment
    ? submissions[assignment.id]
    : undefined;

  useEffect(() => {
    if (currentSubmission) {
      setScore(currentSubmission.score !== null ? currentSubmission.score.toString() : '');
      setInstructorNote(currentSubmission.instructorNote || '');
    } else {
      setScore('');
      setInstructorNote('');
    }
    setError('');
    setSuccess('');
  }, [currentSubmission, isOpen]);

  if (!assignment) return null;

  const dueDate = new Date(assignment.dueDate);
  const submittedDate = currentSubmission?.submittedAt
    ? new Date(currentSubmission.submittedAt)
    : null;
  const isLate = submittedDate ? submittedDate > dueDate : false;

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    const numScore = parseFloat(score);

    if (isNaN(numScore) || numScore < 0) {
      setError('กรุณากรอกคะแนนที่ถูกต้อง (ต้องไม่เป็นค่าติดลบ)');
      return;
    }

    if (numScore > assignment.maxScore) {
      setError(`คะแนนที่ให้เกินคะแนนเต็ม (${assignment.maxScore} คะแนน)`);
      return;
    }

    if (!instructorNote.trim()) {
      setError('กรุณาระบุโน้ต/ข้อเสนอแนะจากอาจารย์ เพื่อให้นักศึกษานำไปปรับปรุง');
      return;
    }

    gradeSubmission(assignment.id, numScore, instructorNote.trim());
    setSuccess('บันทึกผลการประเมินและโน้ตอาจารย์สำเร็จ!');
    setTimeout(() => {
      onClose();
    }, 800);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="ประเมินผลการเรียนและให้คะแนน (Evaluation & Grading)"
      subtitle={`นักศึกษา: ${student.fullName} (${student.studentCode})`}
      maxWidth="xl"
    >
      <div className="space-y-6">
        {/* Student & Assignment Header */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <CategoryBadge category={assignment.category} />
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">
                คะแนนเต็ม: <strong className="text-slate-900">{assignment.maxScore}</strong>
              </span>
              {currentSubmission && <StatusBadge status={currentSubmission.status} size="sm" />}
            </div>
          </div>
          <h4 className="font-bold text-slate-900 text-base">{assignment.title}</h4>
          <p className="text-xs text-slate-600 mt-1">{assignment.description}</p>
        </div>

        {/* Student Submission Payload */}
        <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-500" />
              ผลงานที่นักศึกษาส่งมอบ
            </span>
            <span className="text-slate-500">
              วันที่ส่ง:{' '}
              {submittedDate ? (
                <strong className={isLate ? 'text-amber-600' : 'text-slate-700'}>
                  {submittedDate.toLocaleString('th-TH')} {isLate && '(ส่งล่าช้า)'}
                </strong>
              ) : (
                'ยังไม่มีการส่งงาน'
              )}
            </span>
          </div>

          {currentSubmission && currentSubmission.workContent ? (
            <div className="space-y-2">
              <div className="p-3 bg-slate-50 rounded-lg text-xs break-all">
                {currentSubmission.workType === 'link' ? (
                  <a
                    href={currentSubmission.workContent}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>{currentSubmission.workContent}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <p className="whitespace-pre-wrap text-slate-800">{currentSubmission.workContent}</p>
                )}
              </div>

              {/* Bilateral Notes: Student's Note */}
              <div className="bg-indigo-50/60 border border-indigo-100 rounded-lg p-3">
                <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5 mb-1">
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                  โน้ตจากนักศึกษา (Student Reflection Note):
                </span>
                <p className="text-xs text-indigo-950 italic leading-relaxed">
                  "{currentSubmission.studentNote || 'นักศึกษาไม่ได้ระบุข้อความเพิ่มเติม'}"
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-xs text-slate-400">
              ยังไม่มีข้อมูลการส่งงานจากนักศึกษา
            </div>
          )}
        </div>

        {/* Instructor Evaluation Form */}
        <form onSubmit={handleSaveGrade} className="space-y-4">
          <div className="bg-purple-50/50 border border-purple-200 rounded-xl p-4 space-y-4">
            <h5 className="font-bold text-purple-900 text-sm flex items-center gap-1.5">
              <Award className="w-4 h-4 text-purple-600" />
              การประเมินและให้คะแนนโดยอาจารย์ (Instructor Grading)
            </h5>

            {/* Score Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                คะแนนที่ได้ (เต็ม {assignment.maxScore} คะแนน)
                <span className="text-rose-500 ml-1">*</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max={assignment.maxScore}
                  placeholder={`0 - ${assignment.maxScore}`}
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  className="w-36 px-3 py-2 text-sm font-bold text-purple-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
                  required
                />
                <span className="text-xs text-slate-500">
                  / {assignment.maxScore} คะแนน ({((parseFloat(score) || 0) / assignment.maxScore * 100).toFixed(0)}%)
                </span>
              </div>
            </div>

            {/* Instructor Feedback Note */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  โน้ต/ข้อเสนอแนะจากอาจารย์ (Instructor Feedback & Note)
                  <span className="text-rose-500 ml-1">*</span>
                </label>
                <span className="text-[10px] text-purple-600 font-medium">บันทึกประกอบการตัดเกรด</span>
              </div>
              <textarea
                rows={3}
                placeholder="ระบุข้อดี จุดเด่นของผลงาน สิ่งที่ต้องปรับปรุงแก้ไข หรือคำแนะนำเพิ่มเติมเพื่อให้นักศึกษาพัฒนาทักษะ..."
                value={instructorNote}
                onChange={(e) => setInstructorNote(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
                required
              />
              <p className="text-[11px] text-slate-500 mt-1">
                💡 โน้ตนี้จะแสดงให้นักศึกษาเห็นในหน้ารายงานผลการประเมิน
              </p>
            </div>
          </div>

          {error && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-sm shadow-purple-200 transition-colors"
            >
              บันทึกผลการตรวจและคะแนน
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
