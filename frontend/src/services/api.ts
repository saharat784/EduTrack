import { StudentProfile, InstructorProfile, CourseSummary, Assignment, Submission } from '../types';
import { storageService } from './storageService';

const rawBase = (import.meta.env.VITE_API_BASE as string | undefined)?.trim().replace(/\/+$/, '') || '/api';
const API_BASE = rawBase.startsWith('http') && !rawBase.endsWith('/api') ? `${rawBase}/api` : rawBase;

export const apiService = {
  // Check if backend is available
  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(1500) });
      return res.ok;
    } catch {
      return false;
    }
  },

  async getStudent(): Promise<StudentProfile> {
    try {
      const res = await fetch(`${API_BASE}/student`);
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          storageService.saveStudent(json.data);
          return json.data;
        }
      }
    } catch (e) {
      console.warn('API getStudent offline, fallback to storage:', e);
    }
    return storageService.getStudent();
  },

  async getInstructor(): Promise<InstructorProfile> {
    try {
      const res = await fetch(`${API_BASE}/instructor`);
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          storageService.saveInstructor(json.data);
          return json.data;
        }
      }
    } catch (e) {
      console.warn('API getInstructor offline, fallback to storage:', e);
    }
    return storageService.getInstructor();
  },

  async getCourse(): Promise<CourseSummary> {
    try {
      const res = await fetch(`${API_BASE}/course`);
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          storageService.saveCourse(json.data);
          return json.data;
        }
      }
    } catch (e) {
      console.warn('API getCourse offline, fallback to storage:', e);
    }
    return storageService.getCourse();
  },

  async getAssignments(): Promise<Assignment[]> {
    try {
      const res = await fetch(`${API_BASE}/assignments`);
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          storageService.saveAssignments(json.data);
          return json.data;
        }
      }
    } catch (e) {
      console.warn('API getAssignments offline, fallback to storage:', e);
    }
    return storageService.getAssignments();
  },

  async createAssignment(asg: Omit<Assignment, 'id' | 'createdAt'>): Promise<Assignment | null> {
    try {
      const res = await fetch(`${API_BASE}/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(asg),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      console.warn('API createAssignment offline, handling locally:', e);
    }
    return null;
  },

  async deleteAssignment(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/assignments/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch (e) {
      console.warn('API deleteAssignment offline, handling locally:', e);
      return false;
    }
  },

  async getSubmissions(): Promise<Record<string, Submission>> {
    try {
      const res = await fetch(`${API_BASE}/submissions`);
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          storageService.saveSubmissions(json.data);
          return json.data;
        }
      }
    } catch (e) {
      console.warn('API getSubmissions offline, fallback to storage:', e);
    }
    return storageService.getSubmissions();
  },

  async submitWork(
    assignmentId: string,
    payload: {
      workType: 'link' | 'text' | 'file';
      workContent: string;
      workFileName?: string;
      studentNote: string;
    }
  ): Promise<Submission | null> {
    try {
      const res = await fetch(`${API_BASE}/submissions/${assignmentId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      console.warn('API submitWork offline, fallback to local storage:', e);
    }
    return null;
  },

  async gradeSubmission(
    assignmentId: string,
    score: number,
    instructorNote: string
  ): Promise<Submission | null> {
    try {
      const res = await fetch(`${API_BASE}/submissions/${assignmentId}/grade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score, instructorNote }),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      console.warn('API gradeSubmission offline, fallback to local storage:', e);
    }
    return null;
  },

  async resetData(): Promise<void> {
    try {
      await fetch(`${API_BASE}/reset`, { method: 'POST' });
    } catch (e) {
      console.warn('API reset offline:', e);
    }
    storageService.resetAllToDefault();
  },
};
