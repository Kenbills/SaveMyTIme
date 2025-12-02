# SaveMyTime

**SaveMyTime** is a lightweight, AI-powered productivity accelerator designed to help professionals stop planning and start building. By simply describing a project idea, the application uses Google's Gemini AI to instantly generate a curated stack of modern tools and a specific, actionable workflow to execute the vision efficiently.

This web app focuses on speed, simplicity, and a dependency-free frontend architecture.

## 🚀 Features

- **AI-Powered Analysis**: Instantly breaks down vague ideas into concrete project summaries.
- **Curated Tool Stacks**: Suggests 4-8 high-utility, modern tools categorized by function (e.g., Design, Automation, Development).
- **Actionable Workflows**: Provides specific setup and usage instructions for every recommended tool tailored to the specific project.
- **Modern UI**: A sleek, responsive interface with Dark/Light mode support.
- **Zero-Bundle Frontend**: Built with vanilla ES6 JavaScript and Tailwind CSS (CDN) for maximum performance and no build steps.

## 🛠️ Tech Stack & Tools

### Frontend
- **HTML5 & CSS3**: Semantic markup and modern styling.
- **JavaScript (ES6+)**: Pure vanilla JS using ES Modules; no framework overhead (React/Vue/Angular).
- **Tailwind CSS**: Utility-first styling loaded via CDN for rapid UI development.
- **Fonts**: Plus Jakarta Sans via Google Fonts.

### Backend & AI
- **Runtime**: Node.js (Vercel Serverless Functions).
- **AI Model**: **Google Gemini 2.5 Flash** (via `@google/genai` SDK).
- **Infrastructure**: Serverless architecture for on-demand scalability.

## 📦 Setup & Installation

### Prerequisites
- Node.js (v18 or higher)
- A Google Gemini API Key ([Get one here](https://aistudio.google.com/))
- Vercel CLI (optional, for local backend testing)

### Local Development

1. **Navigate to the directory**:
   ```bash
   cd V2
   ```

2. **Install Backend Dependencies**:
   ```bash
   npm install
   ```

3. **Environment Configuration**:
   Create a `.env` file in the `V2` directory:
   ```env
   API_KEY=your_google_gemini_api_key_here
   ```

4. **Run Locally (Recommended way with Vercel CLI)**:
   Since the backend uses Serverless Functions, the easiest way to run the full stack locally is via Vercel CLI:
   ```bash
   npm i -g vercel
   vercel dev
   ```
   *Note: If you don't use Vercel CLI, you can open `index.html` in a browser, but the API calls will fail unless you set up a separate local Node server proxying the `api/generate.js` logic.*

## ☁️ Deployment Instructions (Vercel)

This project is optimized for deployment on Vercel.

1. **Push to GitHub/GitLab/Bitbucket**:
   Ensure this folder (`V2`) is in your repository.

2. **Create New Project on Vercel**:
   - Import your repository.

3. **Configure Project Settings (CRITICAL)**:
   - **Root Directory**: Click "Edit" next to Root Directory and select `V2`.
   - **Framework Preset**: Vercel should auto-detect this, or select "Other".

4. **Add Environment Variables**:
   - Key: `API_KEY`
   - Value: `Your Actual Gemini API Key`

5. **Deploy**:
   Click "Deploy". Your app will be live in seconds.

## 👤 Credits

**Created by Tobi Adara**  
Builder | Designer | Automation Addict 😛
[Twitter / X](https://x.com/tobiadara1) | [LinkedIn](https://linkedin.com/in/tobiadara/)
