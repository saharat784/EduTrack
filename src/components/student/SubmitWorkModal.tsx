import React, { useState, useEffect } from 'react';
import { Assignment, Submission } from '../../types';
import { Modal } from '../common/Modal';
import { StatusBadge, CategoryBadge } from '../common/StatusBadge';
import { useApp } from '../../context/AppContext';
import { Link2, MessageSquare, AlertCircle, CheckCircle, Clock, ExternalLink, Award, FileText } from 'lucide-react';

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
  const dueDate = new Date(assignment.dueDate);
  const isPastDue = new Date() > dueDate;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workContent.trim()) {
      setError('กรุณาระบุลิงก์ผลงาน หรือเนื้อหาที่ต้องการส่งมอบ');
      return;
    }
    if (!studentNote.trim()) {
      setError('กรุณาระบุโน้ตจากนักศึกษา (เช่น แนวทางการทำงาน, สิ่งที่ได้เรียนรู้ หรือปัญหาที่พบ)');
      return;
    }

    submitWork(assignment.id, {
      workType,
      workContent: workContent.trim(),
      studentNote: studentNote.trim(),
    });

    setSuccessMsg('บันทึกการส่งงานและโน้ตเรียบร้อยแล้ว!');
    setTimeout(() => {
      onClose();
    }, 900);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isGraded ? 'รายละเอียดผลงานและผลการตรวจ' : 'ส่งงานและบันทึกโน้ตประกอบการประเมิน'}
      subtitle={`${assignment.courseCode} • กำหนดส่ง: ${dueDate.toLocaleString('th-TH')}`}
      maxWidth="xl"
    >
      <div className="space-y-6">
        {/* Assignment Overview */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <CategoryBadge category={assignment.category} />
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">
                คะแนนเต็ม: <strong className="text-slate-900">{assignment.maxScore} คะแนน</strong>
              </span>
              {currentSubmission && <StatusBadge status={currentSubmission.status} size="sm" />}
            </div>
          </div>
          <h4 className="font-bold text-slate-900 text-base">{assignment.title}</h4>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{assignment.description}</p>
        </div>

        {/* If Graded: Show Instructor Evaluation Section */}
        {isGraded && currentSubmission && (
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600" />
                <h5 className="font-bold text-emerald-900 text-sm">ผลการตรวจจากอาจารย์ผู้ประเมิน</h5>
              </div>
              <div className="px-3 py-1 bg-white rounded-lg border border-emerald-300 font-extrabold text-emerald-700 text-base">
                {currentSubmission.score} / {assignment.maxScore} คะแนน
              </div>
            </div>

            <div className="bg-white/80 rounded-lg p-3 border border-emerald-100">
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 mb-1">
                <MessageSquare className="w-3.5 h-3.5" />
                โน้ต/ข้อเสนอแนะจากอาจารย์ (Instructor Note):
              </span>
              <p className="text-xs text-slate-700 leading-relaxed italic">
                "{currentSubmission.instructorNote || 'ไม่มีบันทึกข้อเสนอแนะเพิ่มเติม'}"
              </p>
              <div className="text-[10px] text-slate-400 mt-2">
                ตรวจโดย: {currentSubmission.gradedBy || 'อาจารย์ผู้สอน'} • วันที่ตรวจ:{' '}
                {currentSubmission.gradedAt
                  ? new Date(currentSubmission.gradedAt).toLocaleString('th-TH')
                  : '-'}
              </div>
            </div>
          </div>
        )}

        {/* Form Submission */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Work Type Toggle */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              รูปแบบการส่งผลงาน
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setWorkType('link')}
                disabled={isGraded}
                className={`flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                  workType === 'link'
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Link2 className="w-4 h-4" />
                <span>แนบลิงก์ (GitHub / Drive / Demo)</span>
              </button>
              <button
                type="button"
                onClick={() => setWorkType('text')}
                disabled={isGraded}
                className={`flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                  workType === 'text'
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>กรอกคำตอบ / รายงานสรุป (Text)</span>
              </button>
            </div>
          </div>

          {/* Work Content Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {workType === 'link' ? 'ลิงก์ผลงาน (URL)' : 'เนื้อหาการส่งงาน'}
              <span className="text-rose-500 ml-1">*</span>
            </label>
            {workType === 'link' ? (
              <div className="relative">
                <input
                  type="url"
                  placeholder="https://github.com/..."
                  value={workContent}
                  onChange={(e) => setWorkContent(e.target.value)}
                  disabled={isGraded}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-slate-100"
                />
                {workContent && (
                  <a
                    href={workContent}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute right-2 top-2 p-1 text-slate-400 hover:text-indigo-600"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            ) : (
              <textarea
                rows={3}
                placeholder="พิมพ์เนื้อหาการส่งงาน รหัสการสอบ หรือสรุปผลงานที่นี่..."
                value={workContent}
                onChange={(e) => setWorkContent(e.target.value)}
                disabled={isGraded}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-slate-100"
              />
            )}
          </div>

          {/* Student Reflection Note (โน้ตฝั่งนักศึกษา) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">
                โน้ตจากนักศึกษาประกอบการประเมิน (Student Reflection & Notes)
                <span className="text-rose-500 ml-1">*</span>
              </label>
              <span className="text-[10px] text-indigo-600 font-medium">บังคับตามเกณฑ์การประเมิน</span>
            </div>
            <textarea
              rows={3}
              placeholder="ระบุสิ่งที่ได้เรียนรู้ อุปสรรคที่พบ วิธีการแก้ปัญหา หรือข้อความที่ต้องการแจ้งอาจารย์ผู้ตรวจ..."
              value={studentNote}
              onChange={(e) => setStudentNote(e.target.value)}
              disabled={isGraded}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-slate-100"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              💡 โน้ตนี้จะปรากฏให้อาจารย์เห็นในระบบตรวจงาน เพื่อประกอบการพิจารณาให้คะแนน
            </p>
          </div>

          {/* Timing alert */}
          {isPastDue && !isGraded && (
            <div className="flex items-center gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-600" />
              <span>
                <strong>คำเตือน:</strong> เกินกำหนดเวลาส่งแล้ว ({dueDate.toLocaleString('th-TH')}) การส่งครั้งนี้จะถูกบันทึกสถานะเป็น <strong>"ส่งล่าช้า (Late)"</strong>
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

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
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
                className="px-5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm shadow-indigo-200 transition-colors"
              >
                {currentSubmission?.status === 'submitted' ? 'อัปเดตการส่งงาน' : 'ยืนยันการส่งงาน'}
              </button>
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
};
