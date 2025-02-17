FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY llm-server/package*.json ./
COPY llm-server/tsconfig.json ./
RUN npm install

# Copy source code
COPY llm-server/src ./src

# Build TypeScript code
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/server.js"]
