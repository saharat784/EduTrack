import React, { useState, useEffect } from 'react';
import { Assignment, Submission } from '../../types';
import { Modal } from '../common/Modal';
import { StatusBadge, CategoryBadge } from '../common/StatusBadge';
import { useApp } from '../../context/AppContext';
import {
  Link2,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  FileText,
  Calendar,
  Send,
  Info,
} from 'lucide-react';

interface SubmitWorkModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: Assignment | null;
}

export const SubmitWorkModal: React.FC<SubmitWorkModalProps> = ({
  isOpen,
  onClose,
  assignment,
}) => {
  const { submissions, submitWork } = useApp();

  const [workType, setWorkType] = useState<'link' | 'text'>('link');
  const [workContent, setWorkContent] = useState('');
  const [studentNote, setStudentNote] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const currentSubmission: Submission | undefined = assignment
    ? submissions[assignment.id]
    : undefined;

  useEffect(() => {
    if (currentSubmission) {
      setWorkType(currentSubmission.workType === 'text' ? 'text' : 'link');
      setWorkContent(currentSubmission.workContent || '');
      setStudentNote(currentSubmission.studentNote || '');
    } else {
      setWorkContent('');
      setStudentNote('');
    }
    setError('');
    setSuccessMsg('');
  }, [currentSubmission, isOpen]);

  if (!assignment) return null;

  const isGraded = currentSubmission?.status === 'graded';
  const isSubmitted = currentSubmission?.status === 'submitted' || currentSubmission?.status === 'late';
  const dueDate = new Date(assignment.dueDate);
  const isPastDue = new Date() > dueDate;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workContent.trim()) {
      setError('กรุณาระบุลิงก์ผลงาน หรือเนื้อหาที่ต้องการส่ง');
      return;
    }
    if (!studentNote.trim()) {
      setError('กรุณาระบุโน้ตจากนักศึกษา เช่น แนวทางการทำงาน หรือสิ่งที่ได้เรียนรู้');
      return;
    }

    submitWork(assignment.id, {
      workType,
      workContent: workContent.trim(),
      studentNote: studentNote.trim(),
    });

    setSuccessMsg('บันทึกการส่งงานและโน้ตเรียบร้อยแล้ว');
    setTimeout(() => {
      onClose();
    }, 900);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={assignment.title}
      subtitle={`${assignment.courseCode} ${assignment.courseName}`}
      maxWidth="xl"
    >
      <div className="space-y-5">
        {/* Top Metadata Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <div className="flex items-center gap-2">
            <CategoryBadge category={assignment.category} />
            <StatusBadge status={currentSubmission?.status || 'not_submitted'} size="sm" />
          </div>

          <div className="flex items-center gap-4 text-slate-600">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>
                กำหนดส่ง:{' '}
                <strong className={isPastDue && !isGraded ? 'text-rose-600' : 'text-slate-800'}>
                  {dueDate.toLocaleString('th-TH', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </strong>
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span>
                คะแนนเต็ม: <strong className="text-slate-900">{assignment.maxScore}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* 1. Assignment Description */}
        <div className="space-y-1.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-blue-500" />
            <span>คำอธิบายและรายละเอียดงาน</span>
          </h4>
          <div className="p-3.5 bg-blue-50/20 rounded-xl border border-blue-100/70 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {assignment.description}
          </div>
        </div>

        {/* 2. Instructor Evaluation & Note */}
        {isGraded && currentSubmission && (
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>ผลการตรวจและคำแนะนำจากอาจารย์</span>
            </h4>
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-900">คะแนนที่ได้รับ</span>
                <span className="px-3 py-1 bg-white rounded-lg border border-emerald-300 font-extrabold text-emerald-700 text-sm sm:text-base">
                  {currentSubmission.score} / {assignment.maxScore} คะแนน
                </span>
              </div>

              <div className="bg-white/90 rounded-lg p-3.5 border border-emerald-100">
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 mb-1">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  ข้อเสนอแนะจากอาจารย์
                </span>
                <p className="text-xs text-slate-800 leading-relaxed italic bg-emerald-50/30 p-2.5 rounded-md border border-emerald-100/50">
                  "{currentSubmission.instructorNote || 'ไม่มีบันทึกข้อเสนอแนะเพิ่มเติม'}"
                </p>
                <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
                  <span>ผู้ตรวจ: {currentSubmission.gradedBy || 'อาจารย์ผู้ประเมิน'}</span>
                  <span>
                    วันที่ตรวจ:{' '}
                    {currentSubmission.gradedAt
                      ? new Date(currentSubmission.gradedAt).toLocaleDateString('th-TH')
                      : '-'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Current Submission Preview */}
        {isSubmitted && currentSubmission && !isGraded && (
          <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-xl text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-900 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
                ส่งงานแล้ว รออาจารย์ตรวจ
              </span>
              <span className="text-blue-700 text-[11px]">
                {currentSubmission.submittedAt
                  ? new Date(currentSubmission.submittedAt).toLocaleString('th-TH')
                  : '-'}
              </span>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-blue-100 flex items-center justify-between">
              <div className="truncate max-w-sm">
                <span className="font-semibold text-slate-500 mr-2">ผลงาน:</span>
                <span className="text-slate-800">{currentSubmission.workContent}</span>
              </div>
              {currentSubmission.workType === 'link' && (
                <a
                  href={currentSubmission.workContent}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 p-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* 4. Submission Form & Action Button */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-slate-200">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Send className="w-3.5 h-3.5 text-blue-600" />
            <span>
              {isGraded
                ? 'ข้อมูลการส่งผลงาน'
                : isSubmitted
                ? 'แก้ไขการส่งผลงาน'
                : 'ส่งงานและบันทึกโน้ต'}
            </span>
          </h4>

          {/* Work Type Selection */}
          {!isGraded && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                รูปแบบการส่งผลงาน
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setWorkType('link')}
                  className={`flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                    workType === 'link'
                      ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Link2 className="w-4 h-4" />
                  <span>แนบลิงก์ผลงาน</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWorkType('text')}
                  className={`flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                    workType === 'text'
                      ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>กรอกข้อความสรุปงาน</span>
                </button>
              </div>
            </div>
          )}

          {/* Work Content Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {workType === 'link' ? 'ลิงก์ผลงาน' : 'เนื้อหาการส่งงาน'}
              {!isGraded && <span className="text-rose-500 ml-1">*</span>}
            </label>
            {workType === 'link' ? (
              <div className="relative">
                <input
                  type="url"
                  placeholder="https://..."
                  value={workContent}
                  onChange={(e) => setWorkContent(e.target.value)}
                  disabled={isGraded}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-600"
                />
                {workContent && (
                  <a
                    href={workContent}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute right-2 top-2 p-1 text-slate-400 hover:text-blue-600"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            ) : (
              <textarea
                rows={3}
                placeholder="พิมพ์เนื้อหาการส่งงานหรือสรุปผลงานที่นี่..."
                value={workContent}
                onChange={(e) => setWorkContent(e.target.value)}
                disabled={isGraded}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-600"
              />
            )}
          </div>

          {/* Student Reflection Note */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">
                โน้ตจากนักศึกษาประกอบการประเมิน
                {!isGraded && <span className="text-rose-500 ml-1">*</span>}
              </label>
            </div>
            <textarea
              rows={3}
              placeholder="ระบุสิ่งที่ได้เรียนรู้ ปัญหาที่พบ หรือข้อความที่ต้องการแจ้งอาจารย์..."
              value={studentNote}
              onChange={(e) => setStudentNote(e.target.value)}
              disabled={isGraded}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-600"
            />
          </div>

          {/* Timing alert */}
          {isPastDue && !isGraded && (
            <div className="flex items-center gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-600" />
              <span>
                เกินกำหนดเวลาส่งแล้ว การส่งนี้จะถูกบันทึกสถานะเป็น <strong>ส่งล่าช้า</strong>
              </span>
            </div>
          )}

          {error && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Actions Button */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              ปิดหน้าต่าง
            </button>
            {!isGraded && (
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitted ? 'อัปเดตการส่งงาน' : 'ยืนยันการส่งงาน'}</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
};
