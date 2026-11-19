import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { StudentProfile, InstructorProfile, Assignment, Submission, CourseSummary } from '../types/index.js';
import {
  INITIAL_STUDENT,
  INITIAL_INSTRUCTOR,
  INITIAL_COURSE,
  INITIAL_ASSIGNMENTS,
  INITIAL_SUBMISSIONS,
} from './initialData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

interface Schema {
  student: StudentProfile;
  instructor: InstructorProfile;
  course: CourseSummary;
  assignments: Assignment[];
  submissions: Record<string, Submission>;
}

class Database {
  private data: Schema;

  constructor() {
    this.data = this.load();
  }

  private load(): Schema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('⚠️ Could not read db.json, creating default:', err);
    }

    const defaultData: Schema = {
      student: INITIAL_STUDENT,
      instructor: INITIAL_INSTRUCTOR,
      course: INITIAL_COURSE,
      assignments: INITIAL_ASSIGNMENTS,
      submissions: INITIAL_SUBMISSIONS,
    };
    this.save(defaultData);
    return defaultData;
  }

  private save(dataToSave?: Schema): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave || this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('❌ Failed to write to db.json:', err);
    }
  }

  public getStudent(): StudentProfile {
    return this.data.student;
  }

  public updateStudent(update: Partial<StudentProfile>): StudentProfile {
    this.data.student = { ...this.data.student, ...update };
    this.save();
    return this.data.student;
  }

  public getInstructor(): InstructorProfile {
    return this.data.instructor;
  }

  public getCourse(): CourseSummary {
    return this.data.course;
  }

  public getAssignments(): Assignment[] {
    return this.data.assignments;
  }

  public createAssignment(newAsg: Omit<Assignment, 'id' | 'createdAt'>): Assignment {
    const id = `asg-${Date.now().toString(36)}`;
    const assignment: Assignment = {
      ...newAsg,
      id,
      createdAt: new Date().toISOString(),
    };

    this.data.assignments.unshift(assignment);

    // Initialize blank submission
    this.data.submissions[id] = {
      id: `sub-${Date.now()}`,
      assignmentId: id,
      studentId: this.data.student.id,
      submittedAt: null,
      status: 'not_submitted',
      workType: 'link',
      workContent: '',
      studentNote: '',
      score: null,
      instructorNote: '',
      gradedAt: null,
      gradedBy: null,
    };

    this.save();
    return assignment;
  }

  public deleteAssignment(id: string): boolean {
    const initialLen = this.data.assignments.length;
    this.data.assignments = this.data.assignments.filter((a) => a.id !== id);
    delete this.data.submissions[id];
    this.save();
    return this.data.assignments.length < initialLen;
  }

  public getSubmissions(): Record<string, Submission> {
    return this.data.submissions;
  }

  public submitWork(
    assignmentId: string,
    payload: {
      workType: 'link' | 'text' | 'file';
      workContent: string;
      workFileName?: string;
      studentNote: string;
    }
  ): Submission {
    const assignment = this.data.assignments.find((a) => a.id === assignmentId);
    const now = new Date();
    const isLate = assignment ? now > new Date(assignment.dueDate) : false;
    const newStatus = isLate ? 'late' : 'submitted';

    const existing = this.data.submissions[assignmentId];
    const updated: Submission = {
      id: existing?.id || `sub-${Date.now()}`,
      assignmentId,
      studentId: this.data.student.id,
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

    this.data.submissions[assignmentId] = updated;
    this.save();
    return updated;
  }

  public gradeSubmission(
    assignmentId: string,
    score: number,
    instructorNote: string
  ): Submission | null {
    const existing = this.data.submissions[assignmentId];
    if (!existing) return null;

    const updated: Submission = {
      ...existing,
      score,
      instructorNote,
      status: 'graded',
      gradedAt: new Date().toISOString(),
      gradedBy: this.data.instructor.fullName,
    };

    this.data.submissions[assignmentId] = updated;
    this.save();
    return updated;
  }

  public resetToDefault(): Schema {
    this.data = {
      student: INITIAL_STUDENT,
      instructor: INITIAL_INSTRUCTOR,
      course: INITIAL_COURSE,
      assignments: INITIAL_ASSIGNMENTS,
      submissions: INITIAL_SUBMISSIONS,
    };
    this.save();
    return this.data;
  }
}

export const db = new Database();
