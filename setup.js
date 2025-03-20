// check if .env files exist on apps/frontend and apps/backend

const { exec } = require("child_process");
const { existsSync, writeFileSync, mkdirSync } = require("fs");
const { join } = require("path");

const frontendEnv = join(__dirname, "apps/frontend/.env.local");
const backendEnv = join(__dirname, "apps/backend/.env.local");
const dataPath = join(__dirname, "data");
const usersPath = join(dataPath, "users.json");
const chatPath = join(dataPath, "chat.json");

if (!existsSync(frontendEnv)) {
  console.error(`File ${frontendEnv} does not exist. Creating it...`);
  // create the file with default values
  writeFileSync(frontendEnv, "VITE_SERVER_URL=http://localhost:3000");
}
if (!existsSync(backendEnv)) {
  console.error(`File ${backendEnv} does not exist. Creating it...`);
  // create the file with default values
  exec(
    `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`,
    (err, stdout, stderr) => {
      if (err) {
        console.error(`Error generating secret: ${err}`);
        return;
      }
      console.log(`Generated secret: ${stdout}`);
      writeFileSync(
        backendEnv,
        `PORT=3000\nJWT_SECRET=${stdout}DATA_PATH=../../data`
      );
    }
  );
}
if (!existsSync(dataPath)) {
  console.error(`Data path ${dataPath} does not exist. Creating it...`);
  mkdirSync(dataPath);
}
if (!existsSync(usersPath)) {
  console.error(`File ${usersPath} does not exist. Creating it...`);
  writeFileSync(join(dataPath, "users.json"), '{ "users":[] }');
}
if (!existsSync(chatPath)) {
  console.error(`File ${chatPath} does not exist. Creating it...`);
  writeFileSync(join(dataPath, "chat.json"), '{ "users":[], "messages":[] }');
}
