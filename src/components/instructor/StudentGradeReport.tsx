import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge, CategoryBadge } from '../common/StatusBadge';
import { Award, Printer, Download, CheckCircle, AlertCircle, MessageSquare, BookOpen, UserCheck } from 'lucide-react';

export const StudentGradeReport: React.FC = () => {
  const { student, course, assignments, submissions, stats, instructor } = useApp();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex items-center justify-between no-print">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            ใบรายงานสรุปผลการประเมินเกรด (Academic Evaluation & Performance Report)
          </h3>
          <p className="text-xs text-slate-500">
            คำนวณเกรดรวมจากคะแนนการบ้าน การสอบ และโครงงาน พร้อมบันทึกโน้ตจากทั้งสองฝ่าย
          </p>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg shadow-xs"
        >
          <Printer className="w-3.5 h-3.5 text-slate-500" />
          <span>พิมพ์รายงาน (Print / Save PDF)</span>
        </button>
      </div>

      {/* Main Report Card Container */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-6 print:border-none print:shadow-none print:p-0">
        {/* Report Header */}
        <div className="border-b border-slate-200 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold tracking-wider uppercase text-indigo-600 block">
                Vanness Plus Consulting Skill Test • Trainee Evaluation
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                ใบบันทึกผลการเรียนและการส่งงาน (Grade Evaluation Sheet)
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                รายวิชา: <strong>{course.courseCode} {course.courseName}</strong> ({course.academicYear})
              </p>
            </div>

            {/* Final Calculated Grade Box */}
            <div className="bg-slate-900 text-white p-4 rounded-xl text-center min-w-[140px] shadow-md">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                เกรดรวมสุทธิ
              </span>
              <span className="text-3xl font-black text-amber-400">
                {stats.predictedGrade.grade}
              </span>
              <span className="text-xs text-slate-300 block mt-0.5">
                คะแนนรวม: {stats.totalEarnedScore.toFixed(1)} / {stats.totalPossibleScore}
              </span>
            </div>
          </div>

          {/* Student Profile Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-4 border-t border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">ชื่อ-สกุลนักศึกษา:</span>
              <strong className="text-slate-800 text-sm font-bold">{student.fullName}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">รหัสนักศึกษา:</span>
              <strong className="text-slate-800 text-sm font-bold">{student.studentCode}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">ระดับชั้นปี:</span>
              <strong className="text-indigo-600 text-sm font-bold">{student.academicYear}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">สาขาวิชา:</span>
              <strong className="text-slate-800 text-sm font-bold">{student.major}</strong>
            </div>
          </div>
        </div>

        {/* Detailed Assignment & Bilateral Notes Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200 bg-slate-50/70 text-slate-700 font-bold uppercase text-[11px]">
                <th className="py-2.5 px-3">รายการงาน / การสอบ</th>
                <th className="py-2.5 px-3">ประเภท</th>
                <th className="py-2.5 px-3">กำหนดส่ง</th>
                <th className="py-2.5 px-3">สถานะ</th>
                <th className="py-2.5 px-3 text-right">คะแนนเต็ม</th>
                <th className="py-2.5 px-3 text-right">คะแนนที่ได้</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assignments.map((asg) => {
                const sub = submissions[asg.id];
                const due = new Date(asg.dueDate);
                return (
                  <React.Fragment key={asg.id}>
                    <tr className="hover:bg-slate-50/60 font-medium">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{asg.title}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{asg.description}</div>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <CategoryBadge category={asg.category} />
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap text-slate-600">
                        {due.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}{' '}
                        {due.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <StatusBadge status={sub?.status || 'not_submitted'} size="sm" />
                      </td>
                      <td className="py-3 px-3 text-right text-slate-700 font-bold">
                        {asg.maxScore}
                      </td>
                      <td className="py-3 px-3 text-right">
                        {sub?.status === 'graded' && sub.score !== null ? (
                          <span className="font-extrabold text-emerald-600 text-sm">
                            {sub.score}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">รอตรวจ</span>
                        )}
                      </td>
                    </tr>

                    {/* Bilateral Notes Row (ทั้งโน้ตฝั่งนักศึกษา และ โน้ตฝั่งอาจารย์) */}
                    {(sub?.studentNote || sub?.instructorNote) && (
                      <tr className="bg-slate-50/50 text-[11px]">
                        <td colSpan={6} className="px-4 py-2.5 space-y-2 border-b border-slate-200">
                          {sub.studentNote && (
                            <div className="flex items-start gap-2 text-indigo-900 bg-indigo-50/80 p-2 rounded-md border border-indigo-100">
                              <MessageSquare className="w-3.5 h-3.5 text-indigo-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="font-bold text-[10px] uppercase tracking-wide text-indigo-700">
                                  โน้ตฝั่งนักศึกษา:
                                </span>{' '}
                                <span className="italic">"{sub.studentNote}"</span>
                              </div>
                            </div>
                          )}

                          {sub.instructorNote && (
                            <div className="flex items-start gap-2 text-emerald-900 bg-emerald-50/80 p-2 rounded-md border border-emerald-100">
                              <Award className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="font-bold text-[10px] uppercase tracking-wide text-emerald-700">
                                  โน้ตและ Feedback จากอาจารย์:
                                </span>{' '}
                                <span className="italic">"{sub.instructorNote}"</span>
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
            {/* Table Footer with Totals */}
            <tfoot>
              <tr className="border-t-2 border-slate-300 bg-slate-50 font-bold text-slate-900">
                <td colSpan={4} className="py-3 px-3 text-right">
                  สรุปผลคะแนนรวมสุทธิ:
                </td>
                <td className="py-3 px-3 text-right">{stats.totalPossibleScore}</td>
                <td className="py-3 px-3 text-right text-base text-indigo-700 font-black">
                  {stats.totalEarnedScore.toFixed(1)} คะแนน ({stats.currentAveragePercentage.toFixed(1)}%)
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Grading Scale Criteria Summary */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
          <h5 className="font-bold text-slate-800 mb-2">เกณฑ์การตัดเกรดมาตรฐาน (Standard Grade Brackets):</h5>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 text-center text-[11px]">
            <div className="p-1.5 rounded bg-emerald-100 border border-emerald-300 font-bold text-emerald-800">A (80-100)</div>
            <div className="p-1.5 rounded bg-teal-100 border border-teal-300 font-bold text-teal-800">B+ (75-79)</div>
            <div className="p-1.5 rounded bg-blue-100 border border-blue-300 font-bold text-blue-800">B (70-74)</div>
            <div className="p-1.5 rounded bg-indigo-100 border border-indigo-300 font-bold text-indigo-800">C+ (65-69)</div>
            <div className="p-1.5 rounded bg-yellow-100 border border-yellow-300 font-bold text-yellow-800">C (60-64)</div>
            <div className="p-1.5 rounded bg-amber-100 border border-amber-300 font-bold text-amber-800">D+ (55-59)</div>
            <div className="p-1.5 rounded bg-orange-100 border border-orange-300 font-bold text-orange-800">D (50-54)</div>
            <div className="p-1.5 rounded bg-rose-100 border border-rose-300 font-bold text-rose-800">F (&lt; 50)</div>
          </div>
        </div>

        {/* Signatures for Print */}
        <div className="pt-8 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 print:flex">
          <div>
            <div className="border-b border-slate-400 w-48 mb-1"></div>
            <div>ลงชื่อนักศึกษา: ({student.fullName})</div>
            <div className="text-[10px] text-slate-400">วันที่: {new Date().toLocaleDateString('th-TH')}</div>
          </div>

          <div>
            <div className="border-b border-slate-400 w-48 mb-1"></div>
            <div>ลงชื่ออาจารย์ผู้ประเมิน: ({instructor.fullName})</div>
            <div className="text-[10px] text-slate-400">ตำแหน่ง: {instructor.title}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
