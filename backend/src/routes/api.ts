import { Router, Request, Response } from 'express';
import { db } from '../data/db.js';

const router = Router();

// 1. Health check
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'EduTrack API Service is healthy',
    timestamp: new Date().toISOString(),
  });
});

// 2. Student Endpoints
router.get('/student', (_req: Request, res: Response) => {
  res.json({ success: true, data: db.getStudent() });
});

router.put('/student', (req: Request, res: Response) => {
  const updated = db.updateStudent(req.body);
  res.json({ success: true, data: updated });
});

// 3. Instructor Endpoints
router.get('/instructor', (_req: Request, res: Response) => {
  res.json({ success: true, data: db.getInstructor() });
});

// 4. Course Endpoints
router.get('/course', (_req: Request, res: Response) => {
  res.json({ success: true, data: db.getCourse() });
});

// 5. Assignment Endpoints
router.get('/assignments', (_req: Request, res: Response) => {
  res.json({ success: true, data: db.getAssignments() });
});

router.post('/assignments', (req: Request, res: Response) => {
  const { title, description, category, dueDate, maxScore, weightPercentage, courseCode, courseName } = req.body;
  if (!title || !dueDate || !maxScore) {
    res.status(400).json({ success: false, error: 'Missing required assignment fields' });
    return;
  }
  const created = db.createAssignment({
    title,
    description: description || '',
    category: category || 'assignment',
    dueDate,
    maxScore: Number(maxScore),
    weightPercentage: Number(weightPercentage) || Number(maxScore),
    courseCode: courseCode || 'CPE342',
    courseName: courseName || 'Fullstack Web Application Architecture',
  });
  res.status(201).json({ success: true, data: created });
});

router.delete('/assignments/:id', (req: Request, res: Response) => {
  const deleted = db.deleteAssignment(req.params.id);
  if (!deleted) {
    res.status(404).json({ success: false, error: 'Assignment not found' });
    return;
  }
  res.json({ success: true, message: 'Assignment deleted successfully' });
});

// 6. Submissions & Grading Endpoints
router.get('/submissions', (_req: Request, res: Response) => {
  res.json({ success: true, data: db.getSubmissions() });
});

// Student submits work with student note
router.post('/submissions/:assignmentId/submit', (req: Request, res: Response) => {
  const { assignmentId } = req.params;
  const { workType, workContent, workFileName, studentNote } = req.body;

  if (!workContent || !studentNote) {
    res.status(400).json({
      success: false,
      error: 'workContent and studentNote are required fields',
    });
    return;
  }

  const submission = db.submitWork(assignmentId, {
    workType: workType || 'link',
    workContent,
    workFileName,
    studentNote,
  });

  res.json({ success: true, data: submission });
});

// Instructor grades submission with score & instructor feedback note
router.post('/submissions/:assignmentId/grade', (req: Request, res: Response) => {
  const { assignmentId } = req.params;
  const { score, instructorNote } = req.body;

  if (score === undefined || score === null || !instructorNote) {
    res.status(400).json({
      success: false,
      error: 'score and instructorNote are required fields',
    });
    return;
  }

  const submission = db.gradeSubmission(assignmentId, Number(score), instructorNote);
  if (!submission) {
    res.status(404).json({ success: false, error: 'Submission not found' });
    return;
  }

  res.json({ success: true, data: submission });
});

// 7. Reset to default demo data
router.post('/reset', (_req: Request, res: Response) => {
  const resetData = db.resetToDefault();
  res.json({ success: true, message: 'All demo data reset successfully', data: resetData });
});

export default router;
