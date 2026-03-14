# TestGen: AI-Powered Testing Suite Generator

**TestGen** is a full-stack developer utility designed to eliminate the manual overhead of writing boilerplate tests. Built with **React** and **TypeScript**, it leverages **Gemini 2.5 Flash** (via a secure Node.js proxy) to convert source code or natural language user flows into production-ready **Jest** or **Playwright** test suites.

## 🚀 Key Features

* **Dual-Framework Support:** Generate unit/integration tests for **Jest** or end-to-end (E2E) flows for **Playwright** with a single toggle.
* **Intelligent Prompt Engineering:** Specifically tuned prompts to ensure the AI generates full file implementations, including imports, mocks, and edge cases.
* **Custom Syntax Highlighter:** A lightweight, regex-based highlighting engine built without heavy third-party dependencies for optimal frontend performance.
* **Secure Proxy Architecture:** Uses an Express.js backend to securely handle API keys and interface with Google’s Generative Language API.
* **Clean, Minimalist UI:** A "GitHub-Dark" inspired interface designed for maximum focus and developer productivity.

## 🛠️ Technical Stack

* **Frontend:** React 19, Vite, Lucide Icons.
* **Backend:** Node.js, Express.js (Proxy Server).
* **AI Engine:** Gemini 2.5 Flash-lite (configured for high output tokens and low latency).
* **AI Collaboration:** Developed in partnership with **Claude 3.5 Sonnet** to architect the backend infrastructure and design the polished, responsive UI styling.

## 🏗️ Architecture & Logic

### **AI Interaction Layer**
The tool uses a sophisticated communication pattern to ensure code quality:
1.  **Context Injection:** The prompt identifies the framework (Jest/Playwright) and enforces "Complete Implementation" rules to prevent truncated AI responses.
2.  **AI-Generated Backend & Styling:** The `server.js` proxy and the entire CSS-in-JS styling system were architected with the assistance of **Claude**. This collaboration ensured a robust backend with error handling for rate limits (429) alongside a production-grade, minimalist aesthetic.

### **Syntax Highlighting Engine**
Rather than bloating the bundle with massive libraries, the `CodeBlock` component uses a custom `TOKEN_REGEX` to identify:
* **Keywords:** `import`, `export`, `async`, etc.
* **Test Functions:** `describe`, `test`, `expect`, `vi`.
* **Strings & Comments:** Properly escaped and color-coded for readability.

## 📖 Getting Started

### **1. Prerequisites**
* Node.js (v18+)
* A **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/)

### **2. Installation**
```bash
git clone [https://github.com/yourusername/test-generator.git](https://github.com/yourusername/test-generator.git)
cd test-generator
npm install
```

### **3. Environment Setup**
Create a `.env` file in the root directory:

```env
GEMINI_API_KEY=your_api_key_here
```

### **4. Run the Application**
Open two terminals:

**Terminal 1 (Backend Proxy):**
```bash
npm run server
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

## 🧠 Why I Built This
As a Senior Engineering Lead, I’ve observed that "Test Debt" is often the biggest bottleneck in rapid product rollouts. This project serves as a case study in AI-augmented development, demonstrating how I use tools like Claude to rapidly build backend infrastructure and UI styling, while using Gemini to automate quality assurance. It showcases:

Increasing test coverage without sacrificing feature development speed.

Maintaining architectural consistency across large teams.

Leveraging AI to handle repetitive boilerplate and styling while focusing on high-level system design.

## 🛠️ About the Author
Sanjith K is a Senior Engineering Lead with over 11 years of experience specializing in React.js and TypeScript. Throughout his career, including key roles at Persistent Systems and Syncfusion, he has led international teams of up to 25 members and architected frontend solutions for global platforms like QuickBooks Online.

This project was inspired by the real-world challenges of managing "Test Debt" and deployment velocity in high-traffic environments. By combining his deep roots in component engineering—dating back to building complex data visualization tools from scratch—with modern AI-augmented workflows, Sanjith aims to empower engineering teams to deliver high-quality, 100% tested code at scale.