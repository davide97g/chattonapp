FROM node:20

WORKDIR /app

COPY package.json yarn.lock turbo.json ./
COPY apps/frontend/package.json apps/frontend/
COPY packages/types/package.json packages/types/

RUN yarn

COPY . .

RUN yarn build

# Expose the port Vite preview typically runs on
EXPOSE 8080

RUN yarn add serve -W --dev

# Serve the built project
CMD ["serve", "-s", "apps/frontend/dist", "-l", "8080"]
