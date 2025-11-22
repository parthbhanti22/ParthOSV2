<div align="center">

# 🖥️ Parth OS
### The Interactive AI Portfolio

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Gemini API](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)

<br />

**A fully functional web-based Operating System designed to showcase Full-Stack Engineering & AI integration skills.**

[View Live Demo](#) · [Report Bug](https://github.com/Parth-Bhanti/parth-portfolio-os/issues) · [Request Feature](https://github.com/Parth-Bhanti/parth-portfolio-os/issues)

</div>

---

## 🚀 Overview

**Parth OS** reimagines the traditional portfolio. Instead of a static scrolling page, it offers an immersive **Windows 7-inspired desktop environment** running entirely in the browser. 

Under the hood, it is powered by **Google's Gemini 2.5 Flash** and **Imagen 3**, enabling real-time AI interactions that range from chatting with a witty assistant to generating art on the fly.

## ✨ Key Features

### 🧠 AI & Generative Capabilities
Powered by the `@google/genai` SDK:

*   **🤖 "Harvey Specter" Chatbot**: A RAG-enabled AI assistant that knows my resume by heart. It adopts a sharp, confident persona to answer recruiter questions.
*   **🎨 Imagen AI Art Studio**: A native app that generates high-quality images from text prompts using the `imagen-4.0-generate-001` model.
*   **🌐 Smart Terminal**: Features a custom command `parth getfromweb "<query>"` that uses **Gemini Search Grounding** to fetch real-time, cited answers from the internet.
*   **🧮 AI Math Solver**: A scientific calculator capable of explaining complex calculus and physics problems step-by-step.
*   **🌌 Dynamic Wallpapers**: Uses GenAI prompts to generate a unique, cinematic sci-fi wallpaper every time the OS boots.

### 🖥️ Desktop Environment
*   **Window Manager**: Custom hook-based system for dragging, resizing, minimizing, and z-index stacking.
*   **File System**: Simulated in-memory file system supporting directory navigation (`cd`, `ls`), file creation (`mkdir`, `nano`), and permissions.
*   **Taskbar & Start Menu**: Fully interactive navigation components with real-time clock and state management.

### 🕹️ Native Apps & Games
| Productivity | Entertainment | Utilities |
| :--- | :--- | :--- |
| 📄 **PDF Viewer** (w/ Sticky Notes) | 💣 **Minesweeper** | 💻 **Terminal** (Bash-like) |
| 📝 **Notepad** | 🐍 **Snake** | 🏃 **C++ Runner** (Simulated) |
| 🎨 **Paint** (Canvas API) | 🃏 **Solitaire** | 📷 **Camera** |
| | 🔢 **2048** | |

## 🛠️ Tech Stack

*   **Core**: React 19, TypeScript, Vite
*   **Styling**: Tailwind CSS
*   **AI Integration**: Google Gemini SDK (`@google/genai`)
*   **State Management**: React Hooks (`useState`, `useReducer`, `useCallback`)
*   **Assets**: Heroicons, Custom Base64 Audio

## 📦 Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Parth-Bhanti/parth-portfolio-os.git
    cd parth-portfolio-os
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Setup Environment Variables**
    Create a `.env` file in the root directory:
    ```env
    # Get your key at https://aistudio.google.com/app/apikey
    API_KEY=your_actual_api_key_here
    ```

4.  **Run Locally**
    ```bash
    npm run dev
    ```

## 🚀 Deployment (Vercel)

This project is optimized for Vercel deployment.

1.  Push your code to a GitHub repository.
2.  Import the project into Vercel.
3.  **Crucial Step:** In Vercel's "Environment Variables" settings, add:
    *   **Key:** `API_KEY`
    *   **Value:** `Your_Gemini_API_Key`
4.  Deploy! The `vite.config.ts` automatically injects the key during the build process.

## 👨‍💻 Author

**Parth Bhanti**

*   [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white)](https://linkedin.com/in/parth-bhanti)
*   [![GitHub](https://img.shields.io/badge/GitHub-100000?style=flat&logo=github&logoColor=white)](https://github.com/Parth-Bhanti)

---

<div align="center">
<i>Built with ❤️ and a lot of <code>&lt;div&gt;</code>s.</i>
</div>
