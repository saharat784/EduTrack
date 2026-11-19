import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  StudentProfile,
  InstructorProfile,
  CourseSummary,
  Assignment,
  Submission,
  GradeScale,
} from '../types';
import { storageService } from '../services/storageService';
import { calculateGrade } from '../data/initialData';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  student: StudentProfile;
  instructor: InstructorProfile;
  course: CourseSummary;
  assignments: Assignment[];
  submissions: Record<string, Submission>;
  
  // Actions
  submitWork: (
    assignmentId: string,
    payload: {
      workType: 'link' | 'text' | 'file';
      workContent: string;
      workFileName?: string;
      studentNote: string;
    }
  ) => void;
  gradeSubmission: (
    assignmentId: string,
    score: number,
    instructorNote: string
  ) => void;
  createAssignment: (
    newAssignment: Omit<Assignment, 'id' | 'createdAt'>
  ) => void;
  deleteAssignment: (assignmentId: string) => void;
  resetDemoData: () => void;
  exportJSON: () => void;

  // Computations
  stats: {
    totalAssignments: number;
    completedCount: number;
    gradedCount: number;
    pendingGradingCount: number;
    notSubmittedCount: number;
    totalEarnedScore: number;
    totalPossibleScore: number;
    currentAveragePercentage: number;
    predictedGrade: GradeScale;
    onTimeRate: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('student');
  const [student, setStudent] = useState<StudentProfile>(() => storageService.getStudent());
  const [instructor, setInstructor] = useState<InstructorProfile>(() => storageService.getInstructor());
  const [course, setCourse] = useState<CourseSummary>(() => storageService.getCourse());
  const [assignments, setAssignments] = useState<Assignment[]>(() => storageService.getAssignments());
  const [submissions, setSubmissions] = useState<Record<string, Submission>>(() => storageService.getSubmissions());

  // Save changes to storage
  useEffect(() => {
    storageService.saveStudent(student);
  }, [student]);

  useEffect(() => {
    storageService.saveInstructor(instructor);
  }, [instructor]);

  useEffect(() => {
    storageService.saveCourse(course);
  }, [course]);

  useEffect(() => {
    storageService.saveAssignments(assignments);
  }, [assignments]);

  useEffect(() => {
    storageService.saveSubmissions(submissions);
  }, [submissions]);

  // Submit work by student
  const submitWork = (
    assignmentId: string,
    payload: {
      workType: 'link' | 'text' | 'file';
      workContent: string;
      workFileName?: string;
      studentNote: string;
    }
  ) => {
    const assignment = assignments.find((a) => a.id === assignmentId);
    const now = new Date();
    const isLate = assignment ? now > new Date(assignment.dueDate) : false;
    const newStatus = isLate ? 'late' : 'submitted';

    setSubmissions((prev) => {
      const existing = prev[assignmentId];
      const updated: Submission = {
        id: existing?.id || `sub-${Date.now()}`,
        assignmentId,
        studentId: student.id,
        submittedAt: now.toISOString(),
        status: newStatus,
        workType: payload.workType,
        workContent: payload.workContent,
        workFileName: payload.workFileName || existing?.workFileName,
        studentNote: payload.studentNote,
        score: existing?.score ?? null,
        instructorNote: existing?.instructorNote || '',
        gradedAt: existing?.gradedAt ?? null,
        gradedBy: existing?.gradedBy ?? null,
      };
      return { ...prev, [assignmentId]: updated };
    });
  };

  // Grade submission by instructor
  const gradeSubmission = (
    assignmentId: string,
    score: number,
    instructorNote: string
  ) => {
    setSubmissions((prev) => {
      const existing = prev[assignmentId];
      if (!existing) return prev;
      const updated: Submission = {
        ...existing,
        score,
        instructorNote,
        status: 'graded',
        gradedAt: new Date().toISOString(),
        gradedBy: instructor.fullName,
      };
      return { ...prev, [assignmentId]: updated };
    });
  };

  // Create assignment by instructor
  const createAssignment = (newAssignment: Omit<Assignment, 'id' | 'createdAt'>) => {
    const id = `asg-${Date.now().toString(36)}`;
    const created: Assignment = {
      ...newAssignment,
      id,
      createdAt: new Date().toISOString(),
    };

    setAssignments((prev) => [created, ...prev]);

    // Initialize blank submission record for this student
    setSubmissions((prev) => ({
      ...prev,
      [id]: {
        id: `sub-${Date.now()}`,
        assignmentId: id,
        studentId: student.id,
        submittedAt: null,
        status: 'not_submitted',
        workType: 'link',
        workContent: '',
        studentNote: '',
        score: null,
        instructorNote: '',
        gradedAt: null,
        gradedBy: null,
      },
    }));
  };

  // Delete assignment
  const deleteAssignment = (assignmentId: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== assignmentId));
    setSubmissions((prev) => {
      const clone = { ...prev };
      delete clone[assignmentId];
      return clone;
    });
  };

  // Reset to default initial state
  const resetDemoData = () => {
    const data = storageService.resetAllToDefault();
    setStudent(data.student);
    setInstructor(data.instructor);
    setCourse(data.course);
    setAssignments(data.assignments);
    setSubmissions(data.submissions);
  };

  // Export JSON file
  const exportJSON = () => {
    const jsonStr = storageService.exportFullDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Skill_Test_Student_Performance_${student.studentCode}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Computed statistics
  const totalAssignments = assignments.length;
  let completedCount = 0;
  let gradedCount = 0;
  let pendingGradingCount = 0;
  let notSubmittedCount = 0;
  let totalEarnedScore = 0;
  let totalPossibleScore = 0;
  let onTimeSubmissions = 0;
  let totalSubmitted = 0;

  assignments.forEach((asg) => {
    totalPossibleScore += asg.maxScore;
    const sub = submissions[asg.id];
    if (!sub || sub.status === 'not_submitted') {
      notSubmittedCount++;
    } else {
      totalSubmitted++;
      if (sub.status === 'graded') {
        completedCount++;
        gradedCount++;
        totalEarnedScore += sub.score || 0;
      } else if (sub.status === 'submitted' || sub.status === 'late') {
        completedCount++;
        pendingGradingCount++;
      }

      // Check on-time submission rate
      if (sub.submittedAt && asg.dueDate) {
        if (new Date(sub.submittedAt) <= new Date(asg.dueDate)) {
          onTimeSubmissions++;
        }
      }
    }
  });

  const currentAveragePercentage =
    totalPossibleScore > 0 ? (totalEarnedScore / totalPossibleScore) * 100 : 0;
  
  const predictedGrade = calculateGrade(totalEarnedScore);
  const onTimeRate =
    totalSubmitted > 0 ? Math.round((onTimeSubmissions / totalSubmitted) * 100) : 100;

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        student,
        instructor,
        course,
        assignments,
        submissions,
        submitWork,
        gradeSubmission,
        createAssignment,
        deleteAssignment,
        resetDemoData,
        exportJSON,
        stats: {
          totalAssignments,
          completedCount,
          gradedCount,
          pendingGradingCount,
          notSubmittedCount,
          totalEarnedScore,
          totalPossibleScore,
          currentAveragePercentage,
          predictedGrade,
          onTimeRate,
        },
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
