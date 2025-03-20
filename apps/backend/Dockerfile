FROM node:20

WORKDIR /app

# Copy only the package manager files to leverage caching
COPY package.json yarn.lock turbo.json ./
COPY apps/backend/package.json apps/backend/
COPY packages/types/package.json packages/types/

# Install dependencies for all workspaces
RUN yarn

# Copy all project files
COPY . .

# Build the project (if needed)
RUN cd apps/backend && yarn build

# Run the server
CMD ["node", "apps/backend/dist/src/app.js"]