FROM node:20

WORKDIR /app

COPY package.json yarn.lock turbo.json ./
COPY apps/frontend/package.json apps/frontend/
COPY packages/types/package.json packages/types/

RUN npm install # Or `pnpm install` if using pnpm

COPY . .

RUN npm run build

CMD ["npx", "serve", "-s", "apps/frontend/build"]

EXPOSE 8080