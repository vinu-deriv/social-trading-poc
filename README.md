# Social Trading POC

## GitHub Actions CI/CD

The project uses GitHub Actions for continuous integration. On every pull request to the `main` branch, it runs build checks for all three services:

- Frontend (Vite + React)
- JSON Server
- LLM Server

### Required Secrets

The following secrets need to be configured in your GitHub repository settings:

- `ANTHROPIC_API_KEY`: Your Anthropic API key for the LLM server

### Workflow Details

The workflow `.github/workflows/build-check.yml` performs the following checks:

1. **Frontend**:
   - Installs dependencies
   - Builds the Vite application
   - Builds the Docker image with development target
   - Uses GitHub Actions cache for faster builds

2. **JSON Server**:
   - Installs dependencies
   - Builds the Docker image
   - Uses GitHub Actions cache for faster builds

3. **LLM Server**:
   - Installs dependencies
   - Builds the TypeScript application
   - Builds the Docker image
   - Uses GitHub Actions cache for faster builds

All jobs run in parallel to minimize the total workflow execution time.

### Local Development

For local development, follow these steps:

1. Install dependencies:
   ```bash
   npm install
   cd json-server && npm install
   cd llm-server && npm install
   ```

2. Set up environment variables:
   - Copy `.env.example` to `.env` in the llm-server directory
   - Set your Anthropic API key in `llm-server/.env`

3. Start the development servers:
   ```bash
   docker compose up
   ```

This will start all three services:
- Frontend at http://localhost:5173
- JSON Server at http://localhost:3001
- LLM Server at http://localhost:3000
