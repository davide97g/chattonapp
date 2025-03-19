FROM node:20

WORKDIR /app

COPY package.json yarn.lock turbo.json ./
COPY apps/frontend/package.json apps/frontend/
COPY packages/types/package.json packages/types/

RUN npm install # Or `pnpm install` if using pnpm

COPY . .

RUN npm run build

# Install a lightweight static file server
RUN npm install -g serve

# Expose the port Vite preview typically runs on
EXPOSE 8080

# Serve the built project
CMD ["serve", "-s", "dist", "-l", "8080"]
