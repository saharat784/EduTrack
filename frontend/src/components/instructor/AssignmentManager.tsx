import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Assignment, AssignmentCategory } from '../../types';
import { CategoryBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { Plus, Trash2, Calendar, Award, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';

export const AssignmentManager: React.FC = () => {
  const { assignments, createAssignment, deleteAssignment, course } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<AssignmentCategory>('assignment');
  const [dueDate, setDueDate] = useState('');
  const [maxScore, setMaxScore] = useState('15');
  const [weightPercentage, setWeightPercentage] = useState('15');
  const [error, setError] = useState('');

  const handleOpenModal = () => {
    // Default due date: 7 days from now
    const d = new Date();
    d.setDate(d.getDate() + 7);
    d.setHours(23, 59, 0, 0);
    const tzOffset = d.getTimezoneOffset() * 60000;
    const localISOTime = new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);

    setTitle('');
    setDescription('');
    setCategory('assignment');
    setDueDate(localISOTime);
    setMaxScore('15');
    setWeightPercentage('15');
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('กรุณาระบุชื่องานมอบหมายหรือการสอบ');
      return;
    }
    if (!dueDate) {
      setError('กรุณากำหนดวันและเวลาครบกำหนดส่ง');
      return;
    }
    const scoreNum = parseFloat(maxScore);
    if (isNaN(scoreNum) || scoreNum <= 0) {
      setError('กรุณาระบุคะแนนเต็มที่มากกว่า 0');
      return;
    }

    createAssignment({
      title: title.trim(),
      description: description.trim(),
      category,
      dueDate: new Date(dueDate).toISOString(),
      maxScore: scoreNum,
      weightPercentage: parseFloat(weightPercentage) || scoreNum,
      courseCode: course.courseCode,
      courseName: course.courseName,
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            รายการงานมอบหมายและการสอบทั้งหมด ({assignments.length} รายการ)
          </h3>
          <p className="text-xs text-slate-500">
            อาจารย์สามารถเพิ่มงานใหม่ หรือแก้ไขปรับปรุงกำหนดส่งและเกณฑ์คะแนนได้
          </p>
        </div>
        <button
          onClick={handleOpenModal}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm shadow-indigo-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>มอบหมายงานใหม่ (Add Assignment)</span>
        </button>
      </div>

      {/* Assignment Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">ชื่องาน / รายละเอียด</th>
                <th className="py-3 px-4">ประเภท</th>
                <th className="py-3 px-4">คะแนนเต็ม</th>
                <th className="py-3 px-4">กำหนดส่ง (Due Date)</th>
                <th className="py-3 px-4 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assignments.map((asg) => {
                const due = new Date(asg.dueDate);
                return (
                  <tr key={asg.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 max-w-xs sm:max-w-md">
                      <div className="font-bold text-slate-900 text-sm">{asg.title}</div>
                      <p className="text-slate-500 text-[11px] truncate mt-0.5">{asg.description}</p>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <CategoryBadge category={asg.category} />
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-bold text-slate-900">{asg.maxScore}</span>{' '}
                      <span className="text-slate-500">คะแนน</span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-700">
                      <div>{due.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                      <div className="text-[10px] text-slate-400">{due.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.</div>
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => {
                          if (confirm(`คุณต้องการลบงาน "${asg.title}" ใช่หรือไม่?`)) {
                            deleteAssignment(asg.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="ลบงานนี้"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Assignment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="มอบหมายงาน / การสอบใหม่"
        subtitle={`วิชา ${course.courseCode}: ${course.courseName}`}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ชื่องานมอบหมายหรือการสอบ
              <span className="text-rose-500 ml-1">*</span>
            </label>
            <input
              type="text"
              placeholder="เช่น Lab 3: GraphQL API & Microservices Architecture"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              คำอธิบายรายละเอียดและข้อกำหนด
            </label>
            <textarea
              rows={3}
              placeholder="อธิบายวัตถุประสงค์ ขอบเขตงาน และเกณฑ์การประเมิน..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ประเภทงาน</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as AssignmentCategory)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg bg-white"
              >
                <option value="assignment">การบ้าน / งานมอบหมาย (Assignment)</option>
                <option value="quiz">แบบทดสอบย่อย (Quiz)</option>
                <option value="exam">การสอบ (Exam)</option>
                <option value="project">โครงงาน (Project)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                กำหนดส่ง (Due Date & Time)
                <span className="text-rose-500 ml-1">*</span>
              </label>
              <input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                คะแนนเต็ม (Max Score)
                <span className="text-rose-500 ml-1">*</span>
              </label>
              <input
                type="number"
                step="1"
                min="1"
                max="100"
                value={maxScore}
                onChange={(e) => setMaxScore(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ค่าน้ำหนักเกรด (%)
              </label>
              <input
                type="number"
                step="1"
                min="1"
                max="100"
                value={weightPercentage}
                onChange={(e) => setWeightPercentage(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          {error && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm"
            >
              สร้างงานมอบหมาย
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
