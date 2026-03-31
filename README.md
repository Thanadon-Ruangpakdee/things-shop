# 🌬️ ThingsHub - ระบบจัดการสต็อกสินค้าและตัวแทนแชร์ (Affiliate Management)

**ThingsHub** คือระบบ Web Application สำหรับเจ้าของร้านค้าที่ต้องการจัดการสต็อกสินค้าอย่างเป็นระบบ พร้อมฟีเจอร์เด่นในการบริหารจัดการตัวแทนแชร์ (Affiliate) เพื่อเพิ่มยอดขายผ่านระบบนายหน้าอัจฉริยะ ออกแบบด้วยดีไซน์ที่ทันสมัยและใช้งานง่ายสไตล์ DashStack

---

## ✅ ฟีเจอร์ที่ทำสำเร็จแล้ว (Current Progress)
- [x] **Modern Landing Page:** หน้าแรกสไตล์ Startup พร้อมระบบตรวจเช็กสถานะ Login อัตโนมัติ
- [x] **Authentication System:** ระบบสมาชิกผ่าน **Clerk** พร้อมหน้า Login แบบ Custom Split-Screen (หรูหราและพรีเมียม)
- [x] **Professional Dashboard Layout:** โครงสร้าง Sidebar สีเข้ม (Dark) และ Header สีขาว (Light) ชิดขอบหน้าจอแบบ DashStack
- [x] **Custom User Navigation:** ระบบ Dropdown โปรไฟล์ที่มุมขวาบน ป้องกัน Runtime Error และใช้งานสมูท (UserNav Client Component)
- [x] **Database Integration:** เชื่อมต่อข้อมูลจริงจาก **Supabase** ผ่าน **Prisma ORM**
- [x] **Real-time Stats:** หน้า Overview ที่คำนวณรายได้รวม, ยอดขายจากตัวแทน และค่าคอมมิชชันจริงจากฐานข้อมูล
- [x] **Security Middleware:** ระบบป้องกันเส้นทาง (Route Protection) กันคนไม่ล็อกอินเข้าถึงหน้า Dashboard

---

## 🏗️ สิ่งที่กำลังพัฒนาต่อ (Upcoming Features)
- [ ] **Product Management CRUD:** ระบบเพิ่ม แก้ไข และลบสินค้า พร้อมอัปเดตสต็อกอัตโนมัติ
- [ ] **Affiliate Portal:** หน้าจัดการตัวแทนแชร์ (อนุมัติ/ระงับสิทธิ์) และระบบสร้าง Link ติดตามยอดขาย
- [ ] **Order Management:** ระบบจัดการรายการสั่งซื้อและประวัติการทำรายการ
- [ ] **DB Optimization:** เพิ่มฟิลด์ `createdAt` และ `updatedAt` เพื่อการดึงข้อมูลตามช่วงเวลาที่แม่นยำ

---

## 🛠️ Tech Stack (เครื่องมือที่เลือกใช้)
- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Authentication:** [Clerk Auth](https://clerk.com/)
- **Database:** PostgreSQL (Hosting by [Supabase](https://supabase.com/))
- **ORM:** [Prisma](https://www.prisma.io/)
- **Icons:** Lucide React

---

## 🚀 การติดตั้งเพื่อเริ่มใช้งาน (For Developers)

หากต้องการรันโปรเจกต์นี้ในเครื่องตัวเอง ให้ทำตามขั้นตอนดังนี้:

### 1. ติดตั้ง Dependencies
```bash
npm install

