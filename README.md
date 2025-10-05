# Vexor.AI

> The simplest AI sparring partner for your code.

Vexor.AI is an interactive web platform that acts as a sparring partner for your code. Paste in your functions, and our AI will generate a comprehensive test suite to challenge your logic, helping you find edge cases and improve reliability.

## 🎯 The Problem & Motivation

Writing thorough tests is crucial but time-consuming. It's easy to miss edge cases, especially when working under pressure in a hackathon or on a tight deadline. Vexor.AI was built to solve this by instantly generating a wide range of tests, allowing developers to focus on building features while ensuring their code is robust.

## ✨ Features

* **AI-Powered Test Generation**: Paste your JavaScript function and get a Jest test suite in seconds.
* **Multiple AI Personalities**: Generate tests from different perspectives (e.g., a meticulous engineer, a security expert, a performance analyst).
* **Website Performance Analyzer**: Get a quick overview of any website's performance, SEO, and accessibility scores using Google PageSpeed Insights.
* **Interactive Code Editor**: A built-in Monaco editor for a smooth coding experience.

## 🛠️ Tech Stack

* **Frontend**: HTML, Tailwind CSS, JavaScript
* **Backend**: Node.js, Express.js
* **AI**: Cerebras API
* **Testing**: Jest
* **Deployment**: Render

## 🚀 Getting Started

### Prerequisites

* Node.js (v22.x or higher recommended)
* npm

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/vexor.ai.git](https://github.com/your-username/vexor.ai.git)
    cd vexor.ai
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory and add your API keys. You can use `.env.example` as a template.
    ```
    CEREBRAS_API_KEY="your_cerebras_api_key"
    GOOGLE_PAGESPEED_API_KEY="your_google_pagespeed_api_key"
    ```

4.  **Run the application locally:**
    ```bash
    npm run dev
    ```
    The server will start on `http://localhost:3000`.

## 🚧 Current Status & Known Issues

This project was built during a hackathon and is currently a **work-in-progress**. Known issues include:
* The backend isn't fully optimized for high-traffic loads.
* The test sandbox has a 15-second timeout, which might be too short for very complex functions.
* The UI is not fully responsive on all mobile devices.
