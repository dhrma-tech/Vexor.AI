# Vexor.AI 🤖 sparring partner 🥊

> The simplest AI sparring partner for your code.

Vexor.AI is an interactive web platform designed to act as your coding sparring partner. Paste your JavaScript functions, choose an AI personality, and instantly generate a comprehensive test suite using Jest. It helps challenge your logic, uncover edge cases, and improve code reliability – without complex setup.

---

## 🎯 The Problem & Motivation

Writing thorough unit tests is essential for robust software, but it's often tedious and time-consuming. Developers, especially under pressure (like during hackathons or tight deadlines), can easily miss edge cases. Vexor.AI aims to automate the initial test creation process, providing instant feedback and diverse test scenarios, allowing developers to focus more on building features while still ensuring code quality.

---

## ✨ Features

* **AI-Powered Test Generation**: Paste your JavaScript function and specify its name to get a Jest test suite in seconds.
* **Multiple AI Personalities**: Generate tests from different perspectives (e.g., Senior Engineer, QA Lead, Beginner Tutor, Security Expert, Performance Analyst) to cover various angles.
* **Secure Code Execution**: User code and generated tests are run in a secure, isolated sandbox environment using `isolated-vm`.
* **Website Performance Analyzer**: Get a quick overview of any website's performance, accessibility, best practices, and SEO scores using the Google PageSpeed Insights API.
* **Interactive Code Editor**: Uses the Monaco Editor (the engine behind VS Code) for a familiar coding experience.
* **Dark Mode**: Toggle between light and dark themes.

---

## 🛠️ Tech Stack

* **Frontend**: HTML, Tailwind CSS, JavaScript, Monaco Editor
* **Backend**: Node.js, Express.js
* **AI**: Google AI Gemini API (`gemini-1.5-flash-latest`) via `@google/generative-ai` library
* **Code Sandbox**: `isolated-vm`
* **Other APIs**: Google PageSpeed Insights
* **Code Formatting**: Prettier
* **Deployment**: Render (Backend), GitHub Pages (Frontend Example)

---

## 🚀 Getting Started

### Prerequisites

* Node.js (v22.x or higher recommended)
* npm (comes with Node.js)

### Installation & Local Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/dhrma-tech/vexor.ai.git](https://github.com/dhrma-tech/vexor.ai.git) # Replace with your actual repo URL if different
    cd vexor.ai
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    * Create a file named `.env` in the root directory.
    * Copy the contents of `.env.example` into `.env`.
    * Replace the placeholder values with your actual API keys:
        * `GEMINI_API_KEY`: Get from [Google AI Studio](https://aistudio.google.com/).
        * `GOOGLE_PAGESPEED_API_KEY`: Get from [Google Cloud Console](https://console.cloud.google.com/apis/credentials) (enable the PageSpeed Insights API).

4.  **Run the application locally:**
    ```bash
    npm run dev
    ```
    This uses `nodemon` to automatically restart the server on changes. The server will start on `http://localhost:3000`. Open `index.html` in your browser to interact with the frontend.

---

## ☁️ Deployment

This project is configured for easy deployment to **Render** for the backend.

1.  **Create a new "Web Service"** on Render.
2.  **Connect your GitHub repository.**
3.  **Configure the service:**
    * **Runtime:** Node
    * **Build Command:** `npm install`
    * **Start Command:** `node server.js`
    * **Node Version:** 22 (or match your local version)
4.  **Add Environment Variables:** Under the "Environment" tab, add your `GEMINI_API_KEY` and `GOOGLE_PAGESPEED_API_KEY`.
5.  **Deploy.**
6.  **(Frontend)** Deploy your static frontend files (`index.html`, `app.js`, `style.css`) to a static host like GitHub Pages, Netlify, or Render Static Sites. Make sure the `RENDER_URL` constant in `app.js` points to your deployed backend URL.

---

## 🚧 Current Status & Known Issues

This project was initially built during a hackathon and serves as a functional prototype.

* The backend isn't optimized for high concurrent loads.
* The `isolated-vm` sandbox has a 10-second timeout.
* The UI responsiveness might need further refinement on smaller devices.
* Error handling for API calls could be more granular.

---

## Future Ideas

* Support for more languages (Python, Java, etc.).
* Integration with GitHub Actions for automated testing on push.
* VS Code Extension.
* User accounts and saved history.
* More sophisticated test generation strategies.