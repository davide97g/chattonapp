FROM node:20

WORKDIR /app

COPY package.json yarn.lock turbo.json ./
COPY apps/backend/package.json apps/backend/
COPY packages/types/package.json packages/types/

RUN npm install # Or `pnpm install` if using pnpm

COPY . .

CMD ["node", "apps/backend/dist/src/app.js"]

EXPOSE 3000
