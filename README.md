# 🏥 Hospital Management System – Masa Hospital

A full-stack hospital management system built using modern technologies like React, TypeScript, Express, Prisma, and PostgreSQL. This system streamlines patient care, appointments, diagnostics, admissions, and staff workflows through role-based access and modular UI.

---

## 📁 Project Structure
<pre> ├── client # Frontend - React + TypeScript + Tailwind CSS + shadcn 
 └── server # Backend - Express.js + Prisma + PostgreSQL  </pre>


---

## Tech Stack

### Frontend (client)
- **React** – UI framework
- **TypeScript** – Type safety for better maintainability
- **Tailwind CSS** – Utility-first styling
- **shadcn/ui** – Accessible and modern UI components
- **fetch API** – For sending RESTful API calls
- **Role-Based Pages** – Separate flows for patients, doctors, front desk, data entry, and admin

### Backend (server)
- **Express.js** – Web framework for REST APIs
- **TypeScript** – Full-stack consistency and safety
- **Prisma ORM** – Type-safe database interaction
- **PostgreSQL** – Relational database used for all medical data

### Tools & Utilities
- **Postman** – API testing and debugging
- **Supabase** – For external file storage (e.g., reports, images)

---

## ⚙️ How to Run the Project Locally

1. **Clone the repository**
```bash
git clone https://github.com/your-repo/hospital-management-system.git
cd hospital-management-system 
```

2. **Set up environment variables**

Inside the server directory, create a .env file.
Add your Supabase connection string and other necessary secrets like this:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-secret-key
DATABASE_URL=your_postgresql_connection_string
```

3. **Start the frontend**

```bash
cd client
npm install
npm run dev 
```

4. **Start the backend**

```bash
cd server
npm install
npm run dev
```

5. **Access the application**

    Once both servers are running, Ctrl + Click the link shown in the client terminal (usually http://localhost:5173) to open the app in your browser.
    You’ll land on the homepage where you can log in as a patient or staff member.
