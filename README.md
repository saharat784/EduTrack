# EduTrack: Student Performance & Evaluation Tracking System

> **Skill Test for Fullstack Developer Trainee**  
> **Applicant**: Saharath Wiangkaew (นายสหรัฐ เวียงแก้ว)  
> **Company**: Vanness Plus Consulting Co., Ltd.

---

## Clean Fullstack Architecture (แยก Frontend และ Backend ชัดเจน)

โปรเจกต์นี้ได้รับการออกแบบและจัดโครงสร้างแยกฝั่ง **Frontend (Client)** และ **Backend (Server)** ออกจากกันอย่างเป็นระเบียบตามมาตรฐาน Fullstack Application Development:

```
d:\vanness-test\
├── backend/                         # Node.js + Express REST API Server
│   ├── package.json
│   ├── tsconfig.json
│   ├── data/
│   │   └── db.json                  # Persistent JSON Database Engine
│   └── src/
│       ├── server.ts                # Express App & Middleware (CORS, Logger, Port 5000)
│       ├── routes/
│       │   └── api.ts               # RESTful Endpoints (Students, Assignments, Submissions, Grades)
│       ├── data/
│       │   ├── db.ts                # Data Access Layer & CRUD Engine
│       │   └── initialData.ts       # Realistic Seed Data for Saharath Wiangkaew
│       └── types/
│           └── index.ts             # Backend Type Definitions
│
├── frontend/                        # React 18 + Vite + TypeScript Client
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts               # Vite Config with /api Reverse Proxy to Port 5000
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── types/                   # Frontend Data Contracts
│       ├── services/
│       │   ├── api.ts               # REST API Client with Offline/Storage Fallback
│       │   └── storageService.ts    # Client-side Cache & LocalStorage
│       ├── context/
│       │   └── AppContext.tsx       # Global State, Real-time Sync & Dual-Role Engine
│       ├── components/
│       │   ├── common/              # Navbar (with Backend Status Pill), Badges, Modals
│       │   ├── student/             # Student Profile, Assignment List, Submit Work Modal
│       │   ├── instructor/          # Grading Center, Grade Report, Assignment Manager
│       │   └── analytics/           # Category Progress, On-time Rate & GPA Analytics
│       ├── App.tsx
│       └── main.tsx
│
├── docs/
│   ├── PRESENTATION_OUTLINE.md      # โครงสร้างสไลด์นำเสนอ (PDF/PPTX)
│   └── VIDEO_DEMO_SCRIPT.md         # สคริปต์พูดคลิปวิดีโอเดโม (3-5 นาที)
│
├── README.md                        # เอกสารสถาปัตยกรรมและคู่มือการรัน
└── package.json                     # Root Orchestrator (รันทั้งคู่พร้อมกันด้วยคำสั่งเดียว)
```

---

## Quick Start (วิธีรันระบบ)

### 1. ติดตั้ง Dependencies ทั้งหมด
```bash
npm run install:all
```

### 2. สั่งรันทั้ง Backend และ Frontend พร้อมกัน (1 คำสั่งจบ)
```bash
npm run dev
```
- **Backend API**: รันที่ `http://localhost:5000` (Health check: `http://localhost:5000/api/health`)
- **Frontend App**: รันที่ `http://localhost:5173`

*(หรือหากต้องการรันแยกหน้าต่าง)*:
- ฝั่ง Backend: `npm run dev:backend`
- ฝั่ง Frontend: `npm run dev:frontend`

### 3. Build สำหรับ Production
```bash
npm run build
```

### 4. รัน Production Server (Fullstack Monolith)
```bash
npm start
```

---

## Deployment Guide (แนวทางการ Deploy ขึ้น Cloud)

โปรเจกต์นี้รองรับการ Deploy ทั้งแบบ **แยก Frontend / Backend** และแบบ **รวมบริการเดี่ยว (Fullstack Container/Monolith)**:

### ตัวเลือกที่ 1: Deploy บน Vercel (Frontend) + Render / Railway (Backend)
1. **Backend (Render / Railway / Fly.io)**:
   - Root Directory: `.`
   - Build Command: `npm install && npm run build:backend`
   - Start Command: `npm run start:backend`
   - ได้ URL เช่น `https://edutrack-api.onrender.com`
2. **Frontend (Vercel)**:
   - Framework Preset: `Vite`
   - Root Directory: `frontend` (หรือตั้งที่ root โดยไฟล์ `vercel.json` จัดการให้เรียบร้อย)
   - Environment Variables:
     - `VITE_API_BASE`: `https://edutrack-api.onrender.com/api`

### ตัวเลือกที่ 2: Deploy เป็น Fullstack Monolith บน Render / Railway / Cloud VPS
- เนื่องจาก Backend ในโหมด Production ถูกตั้งค่าให้ Serve Static Assets จาก `frontend/dist` อัตโนมัติ:
- Build Command: `npm install && npm run build`
- Start Command: `npm start`
- รันได้ครบทั้งหน้าเว็บ React SPA และ Express REST API บนพอร์ตและ Domain เดียวกัน

### ตัวเลือกที่ 3: Docker & Docker Compose
```bash
# รันผ่าน Docker Compose
docker compose up -d --build
```
ระบบจะรันบนพอร์ต `5000` พร้อมผูก Volume ข้อมูล `backend/data/db.json` ป้องกันข้อมูลสูญหายเมื่อรีสตาร์ท

---

## RESTful API Endpoints Specification (Backend)

| Method | Endpoint | คำอธิบาย |
|---|---|---|
| `GET` | `/api/health` | ตรวจสอบสถานะความพร้อมของ Backend Service |
| `GET` | `/api/student` | ดึงข้อมูลโปรไฟล์นักศึกษา (นายสหรัฐ เวียงแก้ว) |
| `GET` | `/api/instructor` | ดึงข้อมูลโปรไฟล์อาจารย์ผู้ประเมิน |
| `GET` | `/api/course` | ดึงข้อมูลรายวิชาและรายละเอียดภาคเรียน |
| `GET` | `/api/assignments` | ดึงรายการงานและการสอบทั้งหมด |
| `POST` | `/api/assignments` | อาจารย์สร้างงาน/การสอบใหม่ |
| `DELETE` | `/api/assignments/:id` | อาจารย์ลบงานมอบหมาย |
| `GET` | `/api/submissions` | ดึงประวัติการส่งงาน คะแนน และโน้ตทั้งหมด |
| `POST` | `/api/submissions/:assignmentId/submit` | นักศึกษาส่งงานพร้อมบันทึก **"โน้ตฝั่งนักศึกษา (Student Note)"** |
| `POST` | `/api/submissions/:assignmentId/grade` | อาจารย์ประเมินคะแนนพร้อมบันทึก **"โน้ต/Feedback จากอาจารย์"** |
| `POST` | `/api/reset` | รีเซ็ตข้อมูลทั้งหมดกลับสู่ค่าเริ่มต้น |

---

## Key Features & Business Logic

1. **Dual-Role Interaction (สลับบทบาทใน 1 คลิก)**:
   - ผู้ประเมินสามารถสลับระหว่าง **"มุมมองนักศึกษา"** และ **"มุมมองอาจารย์"** ได้ทันทีโดยไม่ต้อง Sign In ซ้ำ
2. **Bilateral Evaluation Notes (โน้ต 2 ฝั่ง ตามโจทย์)**:
   - **โน้ตฝั่งนักศึกษา**: บันทึกแนวคิด อุปสรรค และสิ่งที่ได้เรียนรู้ประกอบการส่งงาน
   - **โน้ตฝั่งอาจารย์**: ข้อเสนอแนะและจุดเด่นของงานเพื่อให้นักศึกษานำไปพัฒนาต่อ
3. **Automated Grade Projection**:
   - คำนวณตัดเกรดอิงเกณฑ์มาตรฐาน (A, B+, B, C+, C, D+, D, F) และ GPA คาดการณ์อัตโนมัติ
4. **Resilient Architecture**:
   - Frontend มีระบบตรวจจับสถานะ Backend อัตโนมัติ (แสดงป้าย Online/Offline บน Navbar) และมี Graceful Fallback ช่วยให้ระบบยังคงทำงานได้อย่างสมบูรณ์แบบไม่ว่าผู้ตรวจจะเปิดผ่าน Local Server หรือ Static Edge Deployment

---

## โครงสร้างไฟล์สำหรับส่งมอบ (Submission Package Structure)

```
Skill Test for Fullstack Developer Trainee_Saharath Wiangkaew/
├── Video/                           # คลิปนำเสนอเดโมระบบ (3-5 นาที)
├── Presentation/                    # สไลด์นำเสนอโครงสร้างและฟีเจอร์ระบบ (PDF/PPTX)
├── Copied of ID Card/               # สำเนาบัตรประชาชน
├── Transcript/                      # ใบแสดงผลการศึกษา
├── Source Code & Deployment Link    # ลิงก์ GitHub Repo และลิงก์ Vercel Deployed Web App
```

---
*จัดทำโดย นายสหรัฐ เวียงแก้ว (Saharath Wiangkaew) สำหรับการคัดเลือกตำแหน่ง Fullstack Developer Trainee ที่ บริษัท แวนเนส พลัส คอนซัลติ้ง จำกัด (Vanness Plus Consulting Co., Ltd.)*
