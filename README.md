<div align="center">

<br/>

```
███╗   ███╗███████╗███╗   ███╗ ██████╗ ██████╗ ██╗   ██╗     ██████╗ ███████╗
████╗ ████║██╔════╝████╗ ████║██╔═══██╗██╔══██╗╚██╗ ██╔╝    ██╔═══██╗██╔════╝
██╔████╔██║█████╗  ██╔████╔██║██║   ██║██████╔╝ ╚████╔╝     ██║   ██║███████╗
██║╚██╔╝██║██╔══╝  ██║╚██╔╝██║██║   ██║██╔══██╗  ╚██╔╝      ██║   ██║╚════██║
██║ ╚═╝ ██║███████╗██║ ╚═╝ ██║╚██████╔╝██║  ██║   ██║       ╚██████╔╝███████║
╚═╝     ╚═╝╚══════╝╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝        ╚═════╝ ╚══════╝
```

### *Your personal operating system for memory*

> Capture, categorize, and surface everything that shapes you.

<br/>

[![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript_5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Express](https://img.shields.io/badge/Express_5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org)
[![Tailwind](https://img.shields.io/badge/Tailwind_4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

<br/>

[![GSAP](https://img.shields.io/badge/GSAP_3-88CE02?style=flat-square&logo=greensock&logoColor=black)](https://gsap.com)
[![Zustand](https://img.shields.io/badge/Zustand_5-FF6B35?style=flat-square)](https://zustand-demo.pmnd.rs)
[![React Router](https://img.shields.io/badge/React_Router_v7-CA4245?style=flat-square&logo=reactrouter&logoColor=white)](https://reactrouter.com)
[![Radix UI](https://img.shields.io/badge/Radix_UI-161618?style=flat-square)](https://www.radix-ui.com)
[![OGL](https://img.shields.io/badge/OGL_WebGL-5C5CFF?style=flat-square)](https://github.com/oframe/ogl)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

<br/>

[**🚀 Live Demo**](https://verge-eosin.vercel.app/) · [**🐛 Report a Bug**](https://github.com/harshwardhan1507/Hackathon-verge/issues) · [**✨ Request a Feature**](https://github.com/harshwardhan1507/Hackathon-verge/issues)

<br/>

---

</div>

## 📖 Table of Contents

- [🧠 About the Project](#-about-the-project)
- [✨ Features](#-features)
- [🛠️ Tech Stack](#%EF%B8%8F-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [📁 Project Structure](#-project-structure)
- [🎨 Memory Types](#-memory-types)
- [📜 Scripts Reference](#-scripts-reference)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🧠 About the Project

Our brains are poor at organizing lived experiences. **MemoryOS** acts as an external brain — a structured, searchable, and visually rich interface for everything that matters to you.

Memories are not just *"notes."* They are typed and color-coded across **seven meaningful dimensions**:

| | Type | What it captures |
|---|---|---|
| 🟡 | **Commitment** | Promises made to yourself or others |
| 🔵 | **Person** | Memories tied to people in your life |
| 🔴 | **Emotion** | Felt experiences and emotional states |
| 🟣 | **Pattern** | Recurring themes and behavioral loops |
| 🟢 | **Event** | Significant moments and milestones |
| 🟠 | **Unresolved** | Open threads and things left undone |
| 🩵 | **Insight** | Realizations, learnings, and clarity |

Built in **under 36 hours** as a hackathon project, MemoryOS combines a high-performance React frontend with a lightweight Node.js/SQLite backend — easy to self-host with zero external database dependencies.

---

## ✨ Features

<table>
<tr>
<td width="50%">

**🧠 Typed Memory System**
Seven semantic memory categories, each with its own visual identity and color token.

</td>
<td width="50%">

**💾 Zero-config Persistence**
All data stored in a local SQLite database via `better-sqlite3` — no cloud, no setup.

</td>
</tr>
<tr>
<td>

**✨ Smooth Animations**
Fluid UI transitions and micro-interactions powered by GSAP 3.

</td>
<td>

**🌐 WebGL Canvas**
Immersive visual background rendered with OGL, the lightweight WebGL library.

</td>
</tr>
<tr>
<td>

**⚡ React Compiler**
Automatic memoization eliminates unnecessary renders — no manual `useMemo` needed.

</td>
<td>

**🎨 Dark-first Design**
Custom Tailwind theme with deep dark base and vibrant, semantic accent colors.

</td>
</tr>
<tr>
<td>

**🔒 Accessible Components**
Built on Radix UI primitives — dialogs, tooltips, scroll areas, and more.

</td>
<td>

**📦 Monorepo Structure**
Express API and Vite frontend co-exist and run concurrently from one repository.

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| [React](https://react.dev) | `19` | UI framework |
| [TypeScript](https://www.typescriptlang.org) | `5.9` | Type safety |
| [Vite](https://vitejs.dev) | `8` | Dev server & bundler |
| [React Router](https://reactrouter.com) | `v7` | Client-side routing |
| [Zustand](https://zustand-demo.pmnd.rs) | `5` | Global state management |
| [Tailwind CSS](https://tailwindcss.com) | `v4` | Utility-first styling |
| [Radix UI](https://www.radix-ui.com) | latest | Accessible headless components |
| [GSAP](https://gsap.com) | `3` | Animations & transitions |
| [OGL](https://github.com/oframe/ogl) | `1` | Lightweight WebGL renderer |
| [Lucide React](https://lucide.dev) | latest | Icon library |
| [React Compiler](https://react.dev/learn/react-compiler) | latest | Automatic memoization |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| [Node.js](https://nodejs.org) | `v18+` | Runtime environment |
| [Express](https://expressjs.com) | `v5` | REST API server |
| [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) | `12` | Synchronous SQLite database |
| [CORS](https://github.com/expressjs/cors) | latest | Cross-origin request handling |
| [concurrently](https://github.com/open-cli-tools/concurrently) | latest | Run multiple scripts together |

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** `v18.0.0` or higher → [Download](https://nodejs.org)
- **npm** `v9+`

```bash
node --version   # must be v18+
npm --version    # must be v9+
```

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/harshwardhan1507/Hackathon-verge.git
cd Hackathon-verge
```

**2. Install dependencies**

```bash
npm install
```

**3. Start the app**

> **Recommended — Full stack** (Express API + Vite dev server together):

```bash
npm run dev:full
```

```
  Frontend  →  http://localhost:5173
  Backend   →  http://localhost:3000
```

> Frontend only:

```bash
npm run dev
```

> Backend only:

```bash
npm run server
```

**4. Build for production**

```bash
npm run build     # Type-check + bundle
npm run preview   # Preview production build locally
```

---

## 📁 Project Structure

```
Hackathon-verge/
│
├── server/
│   └── index.js              # Express API — routes & DB setup
│
├── src/
│   ├── components/           # Reusable UI components
│   ├── pages/                # Route-level page components
│   ├── store/                # Zustand global state slices
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utilities & API client helpers
│   ├── types/                # Shared TypeScript interfaces & enums
│   ├── App.tsx               # Root component with router setup
│   └── main.tsx              # Application entry point
│
├── index.html                # HTML shell
├── vite.config.ts            # Vite + React Compiler config
├── tailwind.config.js        # Custom design tokens & theme
├── tsconfig.app.json         # TS config for app source
├── tsconfig.node.json        # TS config for Node/tooling
└── package.json
```

---

## 🎨 Memory Types

MemoryOS uses a **semantic color system** to visually distinguish memory categories at a glance. Each type maps to a dedicated color token in `tailwind.config.js`:

```js
colors: {
  commitment:  '#f59e0b',   // 🟡 Amber   — Promises made
  person:      '#0ea5e9',   // 🔵 Sky     — People in your life
  emotion:     '#f43f5e',   // 🔴 Rose    — Felt experiences
  pattern:     '#a855f7',   // 🟣 Purple  — Recurring themes
  event:       '#22c55e',   // 🟢 Green   — Key milestones
  unresolved:  '#f97316',   // 🟠 Orange  — Open threads
  insight:     '#14b8a6',   // 🩵 Teal    — Realizations
}
```

| Type | Hex | Description |
|---|---|---|
| 🟡 **Commitment** | `#f59e0b` | Promises made to yourself or others |
| 🔵 **Person** | `#0ea5e9` | Memories tied to people in your life |
| 🔴 **Emotion** | `#f43f5e` | Felt experiences and emotional states |
| 🟣 **Pattern** | `#a855f7` | Recurring themes and behavioral loops |
| 🟢 **Event** | `#22c55e` | Significant moments and milestones |
| 🟠 **Unresolved** | `#f97316` | Open threads and things left undone |
| 🩵 **Insight** | `#14b8a6` | Realizations and learnings |

---

## 📜 Scripts Reference

| Script | Command | Description |
|---|---|---|
| Dev — frontend | `npm run dev` | Start Vite dev server with HMR |
| Dev — full stack | `npm run dev:full` | Start Express + Vite concurrently |
| Backend only | `npm run server` | Start Express API server |
| Build | `npm run build` | Type-check and bundle for production |
| Preview | `npm run preview` | Preview production build locally |
| Lint | `npm run lint` | Run ESLint across all source files |

---

## 🤝 Contributing

Contributions are very welcome! Here's how to get started:

**1.** **Fork** the repository

**2.** **Create** your feature branch
```bash
git checkout -b feature/your-feature-name
```

**3.** **Commit** your changes using conventional commits
```bash
git commit -m "feat: add some feature"
```

**4.** **Push** to the branch
```bash
git push origin feature/your-feature-name
```

**5.** **Open** a Pull Request

> ⚠️ Please ensure `npm run lint` passes before submitting your PR.

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">

<br/>

**Built with ❤️ for [Hackathon Verge](https://github.com/harshwardhan1507/Hackathon-verge)**

<br/>

[⬆ Back to top](#)

</div>
