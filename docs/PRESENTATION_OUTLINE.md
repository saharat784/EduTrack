# 📊 Presentation Outline: Student Performance Tracking System

> **หัวข้อการนำเสนอ**: EduTrack - Modern Fullstack Student Performance & Evaluation Tracking Platform  
> **ผู้นำเสนอ**: นายสหรัฐ เวียงแก้ว (Saharath Wiangkaew)  
> **ตำแหน่งที่สมัคร**: Fullstack Developer Trainee  
> **บริษัท**: Vanness Plus Consulting Co., Ltd.

---

### Slide 1: Title & Introduction (หน้าปก)
- **Title**: EduTrack: ระบบติดตามผลการเรียนรู้และประเมินเกรดนักศึกษา (Student Performance & Evaluation Tracking System)
- **Subtitle**: Vanness Plus Consulting Fullstack Developer Trainee Skill Test
- **Presenter**: นายสหรัฐ เวียงแก้ว (Saharath Wiangkaew)
- **Tech Stack Highlights**: React 18, TypeScript, Tailwind CSS, Vite, Cloud Deployed

---

### Slide 2: Problem Statement & Requirements (ความเข้าใจโจทย์และความท้าทาย)
- **Requirements จาก Vanness Plus**:
  1. เก็บและแสดงข้อมูลนักศึกษา (ชั้นปี, รหัสนักศึกษา, สาขาวิชา)
  2. จัดการงานมอบหมายและการสอบ (ชื่องาน, วันกำหนดส่ง, คะแนนเต็ม)
  3. ติดตามสถานะการส่งงาน (ยังไม่ส่ง, ส่งแล้ว, ส่งช้า, ตรวจแล้ว)
  4. อาจารย์ให้คะแนนและประเมินผล
  5. **โน้ตประกอบการประเมิน 2 ฝั่ง (Bilateral Notes)**: ทั้งโน้ตจากนักศึกษาและโน้ตจากอาจารย์
  6. รองรับการ Deploy ให้ใช้งานได้จริงทันที
- **Pain Points ในระบบเดิม**:
  - นักศึกษาไม่ทราบสถานะงานที่แน่นอน หรือส่งงานแล้วไม่สามารถอธิบายเจตนา/แนวคิดการทำงานได้
  - อาจารย์ไม่มีพื้นที่ให้ Feedback เชิงสร้างสรรค์ (ได้แค่ตัวเลขคะแนน)
  - ขาดระบบวิเคราะห์อัตราการส่งงานตรงเวลาและการตัดเกรดแบบ Real-time

---

### Slide 3: System Architecture & Data Flow (สถาปัตยกรรมระบบ)
- **Frontend Layer**:
  - React 18 with Component-Driven Architecture
  - Type-safe Contract ผ่าน TypeScript Interfaces
  - Tailwind CSS สำหรับ Enterprise-grade UI/UX ที่สะอาด ทันสมัย และ Responsive
- **State & Storage Layer**:
  - AppContext Global Reactive Store: ซิงค์ข้อมูลระหว่างโหมดนักศึกษากับอาจารย์แบบ Real-time
  - LocalStorage Engine: เก็บข้อมูลอัตโนมัติ ไม่สูญหายเมื่อรีเฟรช พร้อมฟังก์ชัน Export JSON และ Reset Data
- **Dual-Role Simulation**:
  - 1-Click Role Switcher ให้กรรมการสลับทดสอบมุมมองนักศึกษาและอาจารย์ได้ทันทีโดยไม่ต้อง Sign In ซ้ำซ้อน

---

### Slide 4: Database & Entity-Relationship Schema (โครงสร้างข้อมูล)
- **Entities**:
  - `StudentProfile`: id, studentCode, fullName, academicYear (ชั้นปี 3), major, faculty
  - `InstructorProfile`: id, fullName, title, department
  - `Assignment`: id, title, description, category (assignment/quiz/exam/project), dueDate, maxScore, weight
  - `Submission`: id, assignmentId, studentId, submittedAt, status, workType, workContent, **studentNote**, score, **instructorNote**, gradedAt, gradedBy
  - `GradeScale`: grade (A–F), minScore, gpaPoint

---

### Slide 5: Core Features - Student Portal (ฟีเจอร์ฝั่งนักศึกษา)
- **Profile & GPA Card**: ข้อมูลนักศึกษา (สหรัฐ เวียงแก้ว ชั้นปีที่ 3), เกรดคาดการณ์ (GPA 4.00), สถิติส่งงานตรงเวลา
- **Interactive Assignment List**:
  - แยกแท็บ: ทั้งหมด, ยังไม่ส่ง, รอตรวจ, ตรวจแล้ว
  - ป้ายสถานะสีชัดเจนตามหลัก UX (Badge with Icons)
- **Work Submission & Reflection Note (โน้ตฝั่งนักศึกษา)**:
  - รองรับแนบลิงก์ผลงาน (GitHub/Drive) หรือส่งรายงานแบบข้อความ
  - **ช่องบันทึกโน้ตจากนักศึกษา**: เพื่ออธิบายสิ่งที่ได้เรียนรู้ ปัญหาที่พบ หรือแจ้งอาจารย์

---

### Slide 6: Core Features - Instructor Portal (ฟีเจอร์ฝั่งอาจารย์)
- **Grading Center**: แสดงคิวงานที่นักศึกษาส่งเข้ามา พร้อมระบุการส่งตรงเวลา/ส่งล่าช้า
- **Grading & Feedback Modal**:
  - ดูผลงานและอ่าน **"โน้ตจากนักศึกษา"**
  - ใส่คะแนน (พร้อม Validation ป้องกันคะแนนเกินค่า Max)
  - พิมพ์ **"โน้ตและ Feedback จากอาจารย์"** เพื่อให้นักศึกษานำไปพัฒนาทักษะ
- **Assignment Manager**: สามารถเพิ่มงานใหม่ กำหนดประเภท วันส่ง และคะแนนเต็มได้ตลอดเวลา

---

### Slide 7: Grade Evaluation & Performance Analytics (การตัดเกรดและการวิเคราะห์)
- **Academic Evaluation Sheet**:
  - ตารางสรุปคะแนนทุกรายการแบบเป็นทางการ
  - แสดง **โน้ตฝั่งนักศึกษาและอาจารย์ควบคู่กัน** สำหรับทุกงานที่ตรวจแล้ว
  - ปุ่ม Print / Save PDF สำหรับพิมพ์ใบประเมินผลการเรียน
- **Performance Analytics Dashboard**:
  - กราฟแท่งสัดส่วนคะแนนสะสมแยกตามหมวดหมู่ (Assignments, Quizzes, Exams, Project)
  - วิเคราะห์ On-time Submission Rate และระยะห่างสู่เป้าหมายเกรด A

---

### Slide 8: Live Demonstration Highlights (สรุปภาพรวมการเดโม)
- ลำดับการเดโม (Demo Flow):
  1. แสดงมุมมองนักศึกษาและดูรายการงาน
  2. นักศึกษาทำการส่งงานชิ้นใหม่พร้อมใส่โน้ตสะท้อนคิด
  3. สลับไปมุมมองอาจารย์ แสดงงานรอตรวจ
  4. อาจารย์ตรวจผลงาน อ่านโน้ตนักศึกษา ให้คะแนน และพิมพ์ Feedback
  5. เปิดใบบันทึกผลการเรียนแสดงเกรดรวมและโน้ตทั้งสองฝ่าย

---

### Slide 9: Conclusion & Self-Evaluation (สรุปและสิ่งที่ได้รับ)
- **ความสำเร็จของโปรเจกต์**:
  - บรรลุข้อกำหนดของโจทย์ Option 4 ครบถ้วน 100%
  - สถาปัตยกรรม Clean Code, Type-safe และ Modular ง่ายต่อการต่อยอดเป็น Backend API จริง (Node/PostgreSQL)
  - รองรับการ Deploy พร้อมใช้งานทันทีบน Edge Cloud
- **ความพร้อมสำหรับตำแหน่ง Fullstack Developer Trainee**:
  - มีความกระตือรือร้นในการเรียนรู้เทคโนโลยีใหม่ๆ
  - ใส่ใจรายละเอียดทั้งฝั่ง Business Logic, Database Relations และ User Experience
- **ช่องทางติดต่อและลิงก์ผลงาน**:
  - Deployed App URL: `https://...`
  - GitHub Repository: `https://github.com/...`
  - Email & โทรศัพท์: `saharath.w@...`

---
*จัดทำขึ้นเพื่อนำไปใช้ประกอบสไลด์ Presentation สำหรับส่งมอบงาน Skill Test*
