import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge, CategoryBadge } from '../common/StatusBadge';
import { Printer, MessageSquare, CheckCircle } from 'lucide-react';

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
            ใบบันทึกผลการประเมินเกรด
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
          <span>พิมพ์รายงานหรือบันทึก PDF</span>
        </button>
      </div>

      {/* Main Report Card Container */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-6 print:border-none print:shadow-none print:p-0">
        {/* Report Header */}
        <div className="border-b border-slate-200 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold tracking-wider uppercase text-blue-600 block">
                ใบบันทึกผลการเรียนรู้
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                ใบบันทึกผลการเรียนและการประเมินเกรด
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                รายวิชา <strong>{course.courseCode} {course.courseName}</strong> • {course.academicYear}
              </p>
            </div>

            {/* Final Calculated Grade Box */}
            <div className="bg-blue-600 text-white p-4 rounded-xl text-center min-w-[140px] shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block">
                เกรดรวมสุทธิ
              </span>
              <span className="text-3xl font-black text-white">
                {stats.predictedGrade.grade}
              </span>
              <span className="text-xs text-slate-300 block mt-0.5">
                {stats.totalEarnedScore.toFixed(1)} / {stats.totalPossibleScore} คะแนน
              </span>
            </div>
          </div>

          {/* Student Profile Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-4 border-t border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">ชื่อนักศึกษา:</span>
              <strong className="text-slate-800 text-sm font-bold">{student.fullName}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">รหัสนักศึกษา:</span>
              <strong className="text-slate-800 text-sm font-bold">{student.studentCode}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">ระดับชั้นปี:</span>
              <strong className="text-blue-600 text-sm font-bold">{student.academicYear}</strong>
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
                <th className="py-2.5 px-3">รายการงาน</th>
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
                          <span className="text-slate-400">รอตรวจ</span>
                        )}
                      </td>
                    </tr>
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
                <td className="py-3 px-3 text-right text-base text-black font-black">
                  {stats.totalEarnedScore.toFixed(1)} คะแนน ({stats.currentAveragePercentage.toFixed(1)}%)
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Grading Scale Criteria Summary */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
          <h5 className="font-bold text-slate-800 mb-2">เกณฑ์การตัดเกรดมาตรฐาน</h5>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 text-center text-[11px]">
            <div className="p-1.5 rounded bg-emerald-500 border font-bold text-white">A 80-100</div>
            <div className="p-1.5 rounded bg-teal-400 border font-bold text-white">B+ 75-79</div>
            <div className="p-1.5 rounded bg-sky-500 border font-bold text-white">B 70-74</div>
            <div className="p-1.5 rounded bg-sky-400 border font-bold text-white">C+ 65-69</div>
            <div className="p-1.5 rounded bg-yellow-500 border font-bold text-white">C 60-64</div>
            <div className="p-1.5 rounded bg-yellow-400 border font-bold text-white">D+ 55-59</div>
            <div className="p-1.5 rounded bg-red-500 border font-bold text-white">D 50-54</div>
            <div className="p-1.5 rounded bg-red-600 border font-bold text-white">F ต่ำกว่า 50</div>
          </div>
        </div>

        {/* Signatures for Print */}
        <div className="pt-8 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 print:flex">
          <div>
            <div className="border-b border-slate-400 w-44 mb-1"></div>
            <div>ลงชื่อนักศึกษา: {student.fullName}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">วันที่ {new Date().toLocaleDateString('th-TH')}</div>
          </div>

          <div>
            <div className="border-b border-slate-400 w-44 mb-1"></div>
            <div>ลงชื่ออาจารย์ผู้ประเมิน: {instructor.fullName}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{instructor.title}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
