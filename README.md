# 🚀 DailyTask - Personal Daily Task Logging & Team Overview Dashboard

ระบบบันทึกงานประจำวันส่วนตัวและแดชบอร์ดภาพรวมทีม พัฒนาด้วยสถาปัตยกรรม **Full-Stack Monorepo + Microservices** ความเร็วสูง พร้อมรองรับ Docker 100%

---

## 🏛️ System Architecture

```text
                               [ ผู้ใช้งาน / Web Browser ]
                                            │
                                            ▼ (Port 8080)
                         ┌─────────────────────────────────────┐
                         │      1. Central Nginx Gateway       │
                         └──────────┬──────────────────┬───────┘
                                    │ (ถ้ามา / )       │ (ถ้ามา /api/ )
                                    ▼                  ▼
                    ┌─────────────────────────┐  ┌─────────────────────────┐
                    │ 2. Frontend (React 19)  │  │ 3. NestJS API Gateway   │
                    │    • MUI v9 + Tailwind  │  │    • Port 3000 + Swagger│
                    │    • Redux Toolkit      │  └────────────┬────────────┘
                    └─────────────────────────┘               │ (Redis Transport)
                                                              ▼
                                              ┌─────────────────────────────────┐
                                              │ 4. Redis Microservices          │
                                              │    • auth-user-service          │
                                              │    • task-service               │
                                              │    • dashboard-service          │
                                              └───────────────┬─────────────────┘
                                                              │
                                                              ▼
                                              ┌─────────────────────────────────┐
                                              │ 5. Database & In-Memory Cache   │
                                              │    • Microsoft SQL Server 2022  │
                                              │    • Redis 7 RAM Cache          │
                                              └─────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### **Frontend**
* **Framework**: React 19 + TypeScript + Vite
* **UI Components**: Material UI (MUI) v9 + Tailwind CSS v4
* **State Management**: Redux Toolkit (Async Thunks)
* **Form & Validation**: React Hook Form + Zod
* **Charts & Analytics**: Recharts
* **Web Server**: Nginx (Alpine) with SPA Client-side Routing

### **Backend (Microservices)**
* **Framework**: NestJS (Monorepo with `apps/` and `libs/`)
* **Transport**: Redis Pub/Sub Message Broker
* **Database & ORM**: Microsoft SQL Server 2022 + Prisma 7 ORM (`@prisma/adapter-mssql`)
* **Caching Layer**: Redis In-Memory Data Caching (RAM Cache)
* **Authentication**: JWT Token (`Bearer Token`) + bcryptjs
* **API Documentation**: OpenAPI / Swagger UI

---

## 🚀 Getting Started with Docker (Recommended)

### 1. Clone the repository
```bash
git clone <your-repository-url>
cd DailyTask
```

### 2. Start all 8 containers
```bash
docker compose up --build -d
```

### 3. Initialize the Database Schema (First Time Only)
```bash
cd backend
npx prisma db push
```

### 4. Access the Application
* 🌐 **Frontend Web App**: [http://localhost:8080](http://localhost:8080)
* 📚 **Swagger API Documentation**: [http://localhost:8080/api/docs](http://localhost:8080/api/docs)
* ⚙️ **Direct Backend API Gateway**: [http://localhost:3000/api/v1](http://localhost:3000/api/v1)

---

## 📄 License
MIT
