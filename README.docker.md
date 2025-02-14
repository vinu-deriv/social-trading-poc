# Docker Setup Instructions

This project uses Docker to run three services:
1. Frontend (React/Vite)
2. LLM Server
3. JSON Server (with data persistence)

## Prerequisites

- Docker Desktop (or Docker Engine + Docker Compose)
- Docker daemon must be running

### Docker Daemon Check

Before starting, ensure Docker daemon is running:

1. For Docker Desktop users:
   - Open Docker Desktop application
   - Wait for the engine to start (green circle in taskbar/menu bar)

2. For Docker Engine users:
   ```bash
   # Check Docker daemon status
   sudo systemctl status docker

   # Start Docker daemon if not running
   sudo systemctl start docker
   ```

3. Verify Docker is running:
   ```bash
   docker info
   ```

## Environment Setup

The project supports three environments:
- Development
- Staging
- Production

Environment-specific configurations are stored in:
- `.env.development`
- `.env.staging`
- `.env.production`

### Secrets Management in Render

For staging and production environments in Render:

1. Environment Variables:
   - Go to Render Dashboard > Your Service > Environment
   - Add each secret as a new environment variable:
     ```
     ANTHROPIC_API_KEY=your-api-key
     NODE_ENV=production
     ```

2. Using Environment Groups:
   - Create an Environment Group in Render:
     - Dashboard > Environment Groups > New Environment Group
     - Name it (e.g., "social-trading-prod")
     - Add your secrets
   
   - Link to Your Services:
     - Go to each service settings
     - Under "Environment Groups", select your group
     - This ensures consistent secrets across services

3. Service-Specific Configuration:
   - Frontend:
     ```
     VITE_API_URL=https://your-llm-server.onrender.com
     VITE_JSON_SERVER_URL=https://your-json-server.onrender.com
     ```
   
   - LLM Server:
     ```
     PORT=3000
     ANTHROPIC_API_KEY=your-api-key
     NODE_ENV=production
     ```
   
   - JSON Server:
     ```
     NODE_ENV=production
     ```

4. Deployment:
   - Render automatically injects these environment variables
   - No need to include sensitive data in Docker images
   - Environment variables override any values in .env files

5. Security Best Practices:
   - Never commit sensitive values to version control
   - Rotate secrets periodically
   - Use different secrets for staging and production
   - Limit access to environment settings in Render dashboard

## Running the Application

### Development Environment

```bash
# Start all services in development mode
docker compose --env-file .env.development up

# Start in detached mode
docker compose --env-file .env.development up -d

# Stop all services
docker compose down
```

### Staging Environment

```bash
# Start all services in staging mode
docker compose --env-file .env.staging up -d
```

### Production Environment

```bash
# Start all services in production mode
docker compose --env-file .env.production up -d
```

## Service URLs

In development:
- Frontend: http://localhost:5173
- LLM Server: http://localhost:3000
- JSON Server: http://localhost:3001

## Data Persistence

The JSON server data is persisted using Docker volumes. Note: the initial db.json file is copied into the container (not mounted as a live link) to ensure data persistence across container restarts.
- The db.json file is mounted from the host system
- A named volume 'data' is used for additional persistence

## Logs

View logs for all services:
```bash
docker compose logs -f
```

View logs for a specific service:
```bash
docker compose logs -f [service-name]
# Example: docker compose logs -f frontend
```

## Rebuilding Services

After making changes to the code:
```bash
docker compose build
docker compose up -d
```

## Troubleshooting

1. If services fail to start, check logs:
```bash
docker compose logs
```

2. To reset all containers and volumes:
```bash
docker compose down -v
```

3. To check running containers:
```bash
docker compose ps
```

4. DNS Resolution Issues:
   If you encounter DNS-related errors (e.g., "failed to resolve source metadata"), try these steps:
   
   a. Update Docker's DNS settings:
   ```json
   # Edit ~/.docker/daemon.json
   {
       "dns": ["8.8.8.8", "8.8.4.4"]
   }
   ```
   
   b. Restart Docker Desktop
   
   c. Verify connectivity:
   ```bash
   docker info
   docker pull hello-world
   ```
