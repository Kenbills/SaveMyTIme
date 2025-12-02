# SaveMyTime V2

A lightweight, high-performance vanilla JS version of SaveMyTime.

## Deployment on Vercel

1. **Push to GitHub**: Commit this folder to a GitHub repository.
2. **Import to Vercel**: 
   - Go to Vercel Dashboard -> Add New Project.
   - Select your repository.
3. **Configure Settings**:
   - **Root Directory**: `V2` (This is critical since the app lives in this subfolder).
   - **Framework Preset**: Other (it should auto-detect, but pure HTML/Node works fine).
4. **Environment Variables**:
   - Add `API_KEY` with your Google Gemini API key.
5. **Deploy**: Click Deploy.

## Architecture

- **Frontend**: Pure HTML5, Tailwind CSS (via CDN), ES Modules.
- **Backend**: Vercel Serverless Function (`api/generate.js`) handling the Gemini AI communication.
- **Security**: API Key is never exposed to the client; calls are proxied through the serverless function.
