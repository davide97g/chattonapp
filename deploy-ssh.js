const { NodeSSH } = require("node-ssh");
const path = require("path");
const fs = require("fs");

const ssh = new NodeSSH();

async function deploy() {
  const remotePath = "~/Desktop/chattonapp";
  const frontendDist = path.resolve(__dirname, "apps/frontend/dist");
  const backendDist = path.resolve(__dirname, "apps/backend/dist");

  try {
    console.log("Connecting to SSH...");
    await ssh.connect({
      host: "raspberrypi",
      username: "davide",
      password: "ghiotto",
    });

    console.log("Uploading frontend dist...");
    await ssh.putDirectory(frontendDist, `${remotePath}/apps/frontend`, {
      recursive: true,
      concurrency: 10,
      validate: (itemPath) =>
        fs.statSync(itemPath).isFile() || fs.statSync(itemPath).isDirectory(),
    });

    console.log("Uploading backend dist...");
    await ssh.putDirectory(backendDist, `${remotePath}/apps/backend`, {
      recursive: true,
      concurrency: 10,
      validate: (itemPath) =>
        fs.statSync(itemPath).isFile() || fs.statSync(itemPath).isDirectory(),
    });

    console.log("Deployment completed successfully!");

    // await ssh.execCommand("yarn serve", { cwd: `${remotePath}` });
  } catch (error) {
    console.error("Error during deployment:", error);
  } finally {
    ssh.dispose();
  }
}

deploy();
