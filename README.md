<div align="center">

# 🚀 CollabAI - Collaborative AI-Powered Platform

### *Next-Generation Team Collaboration & Project Management*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-brightgreen.svg)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-black.svg)](https://socket.io/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

[Features](#-key-features) • [Demo](#-live-demo) • [Installation](#-installation) • [Tech Stack](#-tech-stack) • [Documentation](#-documentation) • [Contributing](#-contributing)

<img src="https://user-images.githubusercontent.com/placeholder/dashboard-preview.png" alt="CollabAI Dashboard" width="800px">

---

### *Empowering teams to ideate, collaborate, and deliver - all in one intelligent workspace*

</div>

---

## 📋 Table of Contents

- [About](#-about-the-project)
- [Key Features](#-key-features)
- [Live Demo](#-live-demo)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)
- [Acknowledgments](#-acknowledgments)

---

## 🎯 About The Project

**CollabAI** is a cutting-edge, full-stack collaborative platform that revolutionizes how teams work together. Built with the MERN stack and powered by AI, it combines real-time collaboration, intelligent ideation, and comprehensive project management into a seamless experience.

### 💡 Why CollabAI?

- **🤖 AI-Powered Ideation**: Generate creative ideas instantly with integrated AI assistance
- **⚡ Real-Time Everything**: Live whiteboard, chat, and updates across your entire team
- **📊 Smart Project Management**: Intuitive Kanban boards with drag-and-drop simplicity
- **🔒 Enterprise-Grade Security**: Role-based access control with JWT authentication
- **📈 Data-Driven Insights**: Analytics dashboard with AI-powered recommendations
- **🎨 Beautiful UI/UX**: Modern, responsive design built with Tailwind CSS

---

## ✨ Key Features

### 🧠 **AI-Powered Features**

<table>
<tr>
<td width="50%">

#### 🎨 Idea Generation
- Integrated OpenAI/Google Gemini API
- Context-aware suggestions
- Category-based organization
- Collaborative refinement tools

</td>
<td width="50%">

#### 📊 Smart Analytics
- AI-driven insights
- Performance predictions
- Bottleneck detection
- Team productivity analysis

</td>
</tr>
</table>

### 🎯 **Core Collaboration Tools**

<details>
<summary><b>🖼️ Real-Time Whiteboard</b></summary>

- Multi-user collaborative canvas
- Drawing, shapes, and sticky notes
- Mind mapping capabilities
- Auto-save and version history
- Socket.IO powered real-time sync

</details>

<details>
<summary><b>📋 Dynamic Kanban Boards</b></summary>

- Drag-and-drop task management
- Customizable columns and workflows
- Task assignments and priorities
- Due dates and reminders
- Progress tracking

</details>

<details>
<summary><b>💬 Integrated Communication</b></summary>

- Real-time project chat
- Threaded task comments
- @mentions and notifications
- File sharing support
- Message history and search

</details>

<details>
<summary><b>📝 Collaborative Documents</b></summary>

- Rich text editor (Quill.js)
- Version control system
- Change tracking
- Restore previous versions
- Real-time co-editing

</details>

### 🔐 **Security & Administration**

- **Role-Based Access Control (RBAC)**
  - Admin
  - Project Manager
  - Team Member
  - Guest (View-only)
  
- **JWT Authentication**
  - Secure token-based auth
  - Refresh token support
  - Session management
  - Password encryption (bcrypt)

- **Admin Dashboard**
  - User management
  - Project oversight
  - Activity logs
  - System analytics

---

## 🌐 Live Demo

> **Note**: Demo deployment coming soon!

```bash
# For now, run locally with:
npm run dev
```

**Demo Credentials:**
- **Admin**: admin@collabai.com / admin123
- **User**: user@collabai.com / user123

---

## 🛠️ Tech Stack

### **Frontend**

<p align="left">
<img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
<img src="https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white" />
<img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
<img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white" />
<img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" />
</p>

- **React 18.x** - UI Library
- **Redux Toolkit** - State Management
- **Tailwind CSS** - Styling Framework
- **Socket.IO Client** - Real-time Communication
- **React Beautiful DnD** - Drag and Drop
- **Quill.js** - Rich Text Editor
- **Konva.js** - Canvas Drawing
- **Chart.js** - Data Visualization
- **Axios** - HTTP Client

### **Backend**

<p align="left">
<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
<img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
<img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" />
<img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white" />
<img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" />
</p>

- **Node.js** - Runtime Environment
- **Express.js** - Web Framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Socket.IO** - WebSocket Library
- **JWT** - Authentication
- **Bcrypt** - Password Hashing
- **OpenAI/Gemini API** - AI Integration

### **DevOps & Tools**

- **Git** - Version Control
- **npm** - Package Manager
- **Postman** - API Testing
- **VS Code** - IDE

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │   UI     │  │  Redux   │  │ Socket.IO│  │  Axios   │  │
│  │Components│  │  Store   │  │  Client  │  │  Client  │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js)                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Express  │  │   Auth   │  │ Socket.IO│  │    AI    │  │
│  │ Routing  │  │Middleware│  │  Server  │  │ Services │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     DATABASE (MongoDB)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Users   │  │ Projects │  │  Tasks   │  │Documents │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              EXTERNAL SERVICES                              │
│        OpenAI/Gemini API  •  Email Service                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

```bash
node --version  # v18.x or higher
npm --version   # v9.x or higher
mongod --version # v6.x or higher
```

- **Node.js** (v18+)
- **MongoDB** (v6+)
- **npm** or **yarn**
- **Git**

---

## 📥 Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/pqrs-2534/collaborative-ai-platform2.git
cd collaborative-ai-platform2
```

### 2️⃣ Install Dependencies

#### Backend Setup

```bash
cd backend
npm install
```

#### Frontend Setup

```bash
cd ../frontend
npm install
```

---

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/collabai
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/collabai

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=30d

# AI API Keys (Choose one or both)
OPENAI_API_KEY=your_openai_api_key_here
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here

# Email Service (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Frontend URL
CLIENT_URL=http://localhost:3000

# Socket.IO
SOCKET_PORT=5000
```

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```

---

## 🎮 Usage

### Development Mode

Run both frontend and backend concurrently:

#### Terminal 1 - Backend Server

```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:5000`

#### Terminal 2 - Frontend Server

```bash
cd frontend
npm start
```

The frontend will start on `http://localhost:3000`

### Production Build

```bash
# Build frontend
cd frontend
npm run build

# Start backend in production
cd ../backend
npm start
```

---

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | User login | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |

### Project Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/projects` | Create project | ✅ |
| GET | `/api/projects` | Get all projects | ✅ |
| GET | `/api/projects/:id` | Get project details | ✅ |
| PUT | `/api/projects/:id` | Update project | ✅ |
| DELETE | `/api/projects/:id` | Delete project | ✅ Admin |

### Task Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/projects/:projectId/tasks` | Create task | ✅ |
| GET | `/api/projects/:projectId/tasks` | Get all tasks | ✅ |
| PUT | `/api/tasks/:id` | Update task | ✅ |
| DELETE | `/api/tasks/:id` | Delete task | ✅ |

### AI Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/ai/generate-ideas` | Generate AI ideas | ✅ |
| GET | `/api/projects/:projectId/ideas` | Get project ideas | ✅ |

### Socket.IO Events

#### Whiteboard Events

```javascript
// Client → Server
socket.emit('joinRoom', { roomId: 'project_123' });
socket.emit('drawing', { roomId, drawData });
socket.emit('addShape', { roomId, shapeData });

// Server → Client
socket.on('drawing', (data) => { /* Update canvas */ });
socket.on('addShape', (data) => { /* Add shape */ });
```

#### Chat Events

```javascript
// Client → Server
socket.emit('sendMessage', { roomId, message });

// Server → Client
socket.on('receiveMessage', (message) => { /* Display message */ });
```

<details>
<summary><b>📖 View Complete API Documentation</b></summary>

For detailed API documentation with request/response examples, see [API_DOCS.md](./docs/API_DOCS.md)

</details>

---

## 📸 Screenshots

<div align="center">

### Dashboard
<img src="https://user-images.githubusercontent.com/placeholder/dashboard.png" width="800px" alt="Dashboard">

### Kanban Board
<img src="https://user-images.githubusercontent.com/placeholder/kanban.png" width="800px" alt="Kanban Board">

### AI Idea Generator
<img src="https://user-images.githubusercontent.com/placeholder/ai-ideas.png" width="800px" alt="AI Ideas">

### Real-Time Whiteboard
<img src="https://user-images.githubusercontent.com/placeholder/whiteboard.png" width="800px" alt="Whiteboard">

### Analytics Dashboard
<img src="https://user-images.githubusercontent.com/placeholder/analytics.png" width="800px" alt="Analytics">

### Team Chat
<img src="https://user-images.githubusercontent.com/placeholder/chat.png" width="800px" alt="Chat">

</div>

---

## 🗺️ Roadmap

### ✅ Phase 1 - Core Features (Completed)
- [x] User Authentication & Authorization
- [x] Project & Task Management
- [x] Real-time Whiteboard
- [x] AI Idea Generation
- [x] Kanban Boards
- [x] Team Chat

### 🚧 Phase 2 - Enhanced Features (In Progress)
- [ ] Mobile App (React Native)
- [ ] Video Conferencing Integration
- [ ] Advanced AI Features (Auto-summarization)
- [ ] Calendar & Timeline View
- [ ] File Storage & Management
- [ ] Email Notifications

### 📅 Phase 3 - Enterprise Features (Planned)
- [ ] SSO Integration
- [ ] Advanced Analytics & Reporting
- [ ] Custom Workflows
- [ ] API Rate Limiting
- [ ] Multi-language Support
- [ ] White-label Solution

See the [open issues](https://github.com/pqrs-2534/collaborative-ai-platform2/issues) for a full list of proposed features and known issues.

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create! Any contributions you make are **greatly appreciated**.

### How to Contribute

1. **Fork the Project**
   ```bash
   # Click the 'Fork' button on GitHub
   ```

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/collaborative-ai-platform2.git
   ```

3. **Create a Feature Branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```

4. **Make Your Changes**
   ```bash
   # Write your code, add tests
   ```

5. **Commit Your Changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```

6. **Push to the Branch**
   ```bash
   git push origin feature/AmazingFeature
   ```

7. **Open a Pull Request**
   - Go to your fork on GitHub
   - Click 'Compare & pull request'
   - Describe your changes

### Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

### Development Guidelines

- Write clean, maintainable code
- Follow existing code style
- Add tests for new features
- Update documentation
- Keep commits atomic and descriptive

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

```
MIT License

Copyright (c) 2026 CollabAI Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files...
```

---

## 📞 Contact

**Project Maintainer**: Sarthak Nagpure

- GitHub: [@pqrs-2534](https://github.com/pqrs-2534)
- Email: your.email@example.com
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Twitter: [@yourhandle](https://twitter.com/yourhandle)

**Project Link**: [https://github.com/pqrs-2534/collaborative-ai-platform2](https://github.com/pqrs-2534/collaborative-ai-platform2)

---

## 🙏 Acknowledgments

Special thanks to:

* [OpenAI](https://openai.com/) - AI API Integration
* [Google Gemini](https://deepmind.google/technologies/gemini/) - Alternative AI Provider
* [Socket.IO](https://socket.io/) - Real-time Communication
* [MongoDB](https://www.mongodb.com/) - Database Solution
* [Tailwind CSS](https://tailwindcss.com/) - Styling Framework
* [React Beautiful DnD](https://github.com/atlassian/react-beautiful-dnd) - Drag and Drop
* [Chart.js](https://www.chartjs.org/) - Data Visualization
* [Font Awesome](https://fontawesome.com) - Icons
* [Shields.io](https://shields.io/) - Badges

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/pqrs-2534/collaborative-ai-platform2?style=social)
![GitHub forks](https://img.shields.io/github/forks/pqrs-2534/collaborative-ai-platform2?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/pqrs-2534/collaborative-ai-platform2?style=social)
![GitHub issues](https://img.shields.io/github/issues/pqrs-2534/collaborative-ai-platform2)
![GitHub pull requests](https://img.shields.io/github/issues-pr/pqrs-2534/collaborative-ai-platform2)
![GitHub last commit](https://img.shields.io/github/last-commit/pqrs-2534/collaborative-ai-platform2)

---

## 🌟 Show Your Support

Give a ⭐️ if this project helped you!

<div align="center">

### Made with ❤️ by the CollabAI Team

**[⬆ Back to Top](#-collabai---collaborative-ai-powered-platform)**

</div>
