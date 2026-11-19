import React from 'react';
import { useApp } from '../../context/AppContext';
import { AssignmentCategory } from '../../types';
import { TrendingUp, CheckCircle, Award, Target } from 'lucide-react';

export const PerformanceAnalytics: React.FC = () => {
  const { assignments, submissions, stats } = useApp();

  // Calculate scores per category
  const categories: { key: AssignmentCategory; label: string; maxScore: number; earnedScore: number }[] = [
    { key: 'assignment', label: 'งานมอบหมาย', maxScore: 0, earnedScore: 0 },
    { key: 'quiz', label: 'แบบทดสอบย่อย', maxScore: 0, earnedScore: 0 },
    { key: 'exam', label: 'การสอบกลางภาคและปลายภาค', maxScore: 0, earnedScore: 0 },
    { key: 'project', label: 'โครงงานพัฒนาซอฟต์แวร์', maxScore: 0, earnedScore: 0 },
  ];

  assignments.forEach((asg) => {
    const cat = categories.find((c) => c.key === asg.category);
    if (cat) {
      cat.maxScore += asg.maxScore;
      const sub = submissions[asg.id];
      if (sub && sub.status === 'graded' && sub.score !== null) {
        cat.earnedScore += sub.score;
      }
    }
  });

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            การวิเคราะห์ผลการเรียนรู้และสถิติคะแนน
          </h3>
          <p className="text-xs text-slate-500">
            สัดส่วนคะแนนสะสมแยกตามหมวดหมู่งาน และการคาดการณ์เกรดเฉลี่ย
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">เป้าหมายเกรด A: 80 คะแนนขึ้นไป</span>
        </div>
      </div>

      {/* Progress Bars for Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => {
          const pct = cat.maxScore > 0 ? (cat.earnedScore / cat.maxScore) * 100 : 0;
          return (
            <div key={cat.key} className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/60">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-slate-800">{cat.label}</span>
                <span className="font-extrabold text-blue-700">
                  {cat.earnedScore.toFixed(1)} / {cat.maxScore} ({pct.toFixed(0)}%)
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Highlights Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-emerald-800 block">ส่งงานตรงเวลา</span>
            <span className="text-lg font-black text-emerald-900">{stats.onTimeRate}%</span>
          </div>
        </div>

        <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-blue-800 block">คะแนนสะสมปัจจุบัน</span>
            <span className="text-lg font-black text-blue-900">
              {stats.totalEarnedScore.toFixed(1)} <span className="text-xs font-normal text-slate-500">/ 100</span>
            </span>
          </div>
        </div>

        <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-blue-800 block">เกรดเฉลี่ยสะสมคาดการณ์</span>
            <span className="text-lg font-black text-blue-900">
              เกรด {stats.predictedGrade.grade} | GPA {stats.predictedGrade.gpaPoint.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
