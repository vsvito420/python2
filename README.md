# Python Course with AI Integration

A modern Python course with AI-powered code evaluation, built with Vue.js and Cloudflare Pages/Workers.

## Features

- Interactive Python code editor
- Real-time code execution in the browser using Pyodide
- AI-powered code evaluation using requesty.ai
- Serverless architecture with Cloudflare Pages and Workers

## Project Structure

```
python-course-ai/
├── src/                  # Vue.js frontend source code
│   ├── assets/           # CSS and other assets
│   ├── components/       # Vue components
│   ├── router/           # Vue Router configuration
│   └── views/            # Vue views/pages
├── functions/            # Cloudflare Workers functions
│   └── api/              # API endpoints
├── public/               # Static assets
└── index.html            # HTML entry point
```

## Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Cloudflare account (for deployment)
- requesty.ai API key

## Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/python-course-ai.git
cd python-course-ai
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file based on `.env.example` and add your requesty.ai API key:

```
REQUESTY_API_KEY=your_requesty_api_key_here
```

4. For local development with Cloudflare Workers, create a `.dev.vars` file with the same content:

```
REQUESTY_API_KEY=your_requesty_api_key_here
```

## Development

### Run the frontend development server:

```bash
npm run dev
```

This will start the Vue.js development server at http://localhost:5173.

### Run the Cloudflare Worker locally:

```bash
npm run dev:worker
```

This will start the Cloudflare Worker at http://localhost:8787.

## Deployment

### Deploy to Cloudflare Pages:

1. Set up your Cloudflare API token in your GitHub repository secrets or use the Cloudflare Dashboard.

2. Add your requesty.ai API key as a secret:

```bash
npx wrangler secret put REQUESTY_API_KEY
```

3. Deploy the application:

```bash
npm run deploy
```

## Adding More Lessons

To add more lessons, you can:

1. Create new lesson content in the `src/views` directory
2. Update the router in `src/router/index.js`
3. Add lesson-specific evaluation logic in `functions/api/evaluate.js`

## License

MIT