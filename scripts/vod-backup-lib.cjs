/* eslint-disable @typescript-eslint/no-require-imports */
const crypto = require("crypto");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { Readable } = require("stream");
const { pipeline } = require("stream/promises");
const { spawn, spawnSync } = require("child_process");
const COS = require("cos-nodejs-sdk-v5");
const dotenv = require("dotenv");

const ROOT = path.resolve(__dirname, "..");
const DEFAULT_BUCKET = "backup-1251741609";
const DEFAULT_REGION = "ap-hongkong";
const DEFAULT_PREFIX = "vod";
const DEFAULT_CONTAINER = "vod-local-postgres";

function loadEnv() {
  dotenv.config({ path: process.env.BACKUP_ENV_FILE || path.join(ROOT, ".env"), quiet: true });
}

function getBackupWorkRoot() {
  return process.env.BACKUP_WORK_DIR || path.join(ROOT, ".backups");
}

function trimSlashes(value) {
  return String(value || "").replace(/^\/+|\/+$/g, "");
}

function getCosSettings() {
  const secretId = process.env.BACKUP_COS_SECRET_ID || process.env.TENCENT_SECRET_ID;
  const secretKey = process.env.BACKUP_COS_SECRET_KEY || process.env.TENCENT_SECRET_KEY;

  if (!secretId || !secretKey) {
    throw new Error("Missing COS credentials. Set BACKUP_COS_SECRET_ID/BACKUP_COS_SECRET_KEY or TENCENT_SECRET_ID/TENCENT_SECRET_KEY.");
  }

  return {
    SecretId: secretId,
    SecretKey: secretKey,
    Bucket: process.env.BACKUP_COS_BUCKET || DEFAULT_BUCKET,
    Region: process.env.BACKUP_COS_REGION || DEFAULT_REGION,
    Prefix: trimSlashes(process.env.BACKUP_COS_PREFIX || DEFAULT_PREFIX),
  };
}

function createCos(settings) {
  return new COS({ SecretId: settings.SecretId, SecretKey: settings.SecretKey });
}

function cosCall(cos, method, params) {
  return new Promise((resolve, reject) => {
    cos[method](params, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

async function uploadFile(cos, settings, key, filePath, contentType) {
  const stat = fs.statSync(filePath);

  await cosCall(cos, "putObject", {
    Bucket: settings.Bucket,
    Region: settings.Region,
    Key: key,
    Body: fs.createReadStream(filePath),
    ContentLength: stat.size,
    ContentType: contentType,
  });
}

async function getSignedObjectUrl(cos, settings, key) {
  const data = await cosCall(cos, "getObjectUrl", {
    Bucket: settings.Bucket,
    Region: settings.Region,
    Key: key,
    Sign: true,
    Expires: 600,
  });

  return data.Url;
}

async function downloadFile(cos, settings, key, filePath) {
  const url = await getSignedObjectUrl(cos, settings, key);
  const response = await fetch(url);

  if (!response.ok || !response.body) {
    throw new Error(`Failed to download ${key}: HTTP ${response.status}`);
  }

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  await pipeline(Readable.fromWeb(response.body), fs.createWriteStream(filePath, { mode: 0o600 }));
}

async function listManifestKeys(cos, settings) {
  const prefix = `${settings.Prefix}/`;
  const keys = [];
  let marker;

  do {
    const data = await cosCall(cos, "getBucket", {
      Bucket: settings.Bucket,
      Region: settings.Region,
      Prefix: prefix,
      Marker: marker,
      MaxKeys: 1000,
    });
    const contents = Array.isArray(data.Contents) ? data.Contents : [];

    for (const item of contents) {
      if (item.Key?.endsWith("/manifest.json")) keys.push(item.Key);
    }

    marker = data.NextMarker;
    if (data.IsTruncated !== "true" && data.IsTruncated !== true) break;
  } while (marker);

  return keys.sort();
}

function hasCommand(command) {
  const result = spawnSync("bash", ["-lc", `command -v ${command}`], { stdio: "ignore" });
  return result.status === 0;
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd || ROOT,
      env: process.env,
      stdio: options.stdio || "inherit",
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(" ")} exited with ${code}`));
    });
  });
}

function runToFile(command, args, filePath) {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    const out = fs.createWriteStream(filePath, { mode: 0o600 });
    const child = spawn(command, args, {
      cwd: ROOT,
      env: process.env,
      stdio: ["ignore", "pipe", "inherit"],
    });

    child.stdout.pipe(out);
    child.on("error", reject);
    child.on("close", (code) => {
      out.close(() => {
        if (code === 0) resolve();
        else reject(new Error(`${command} ${args.join(" ")} exited with ${code}`));
      });
    });
  });
}

function runFromFile(command, args, filePath) {
  return new Promise((resolve, reject) => {
    const input = fs.createReadStream(filePath);
    const child = spawn(command, args, {
      cwd: ROOT,
      env: process.env,
      stdio: ["pipe", "inherit", "inherit"],
    });

    input.pipe(child.stdin);
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(" ")} exited with ${code}`));
    });
  });
}

function readCommand(command, args) {
  const result = spawnSync(command, args, { cwd: ROOT, env: process.env, encoding: "utf8" });
  return result.status === 0 ? result.stdout.trim() : "";
}

function dockerContainerExists(container) {
  if (!container || !hasCommand("docker")) return false;
  const result = spawnSync("docker", ["inspect", container], { stdio: "ignore" });
  return result.status === 0;
}

function getDockerEnv(container, key) {
  return readCommand("docker", ["exec", container, "printenv", key]);
}

function getPostgresIdentity(container) {
  return {
    user: process.env.POSTGRES_USER || (container ? getDockerEnv(container, "POSTGRES_USER") : "") || "vod",
    database: process.env.POSTGRES_DB || (container ? getDockerEnv(container, "POSTGRES_DB") : "") || "vod",
  };
}

function resolveDatabaseTarget(tool) {
  const mode = process.env.BACKUP_DB_MODE || "auto";

  if ((mode === "auto" || mode === "host") && process.env.DATABASE_URL && hasCommand(tool)) {
    return { mode: "host", databaseUrl: process.env.DATABASE_URL };
  }

  const container = process.env.BACKUP_POSTGRES_CONTAINER || (dockerContainerExists(DEFAULT_CONTAINER) ? DEFAULT_CONTAINER : "");

  if ((mode === "auto" || mode === "container") && container && dockerContainerExists(container)) {
    return { mode: "container", container, ...getPostgresIdentity(container) };
  }

  const composeFile = process.env.BACKUP_COMPOSE_FILE || (fs.existsSync(path.join(ROOT, "docker-compose.prod.yml")) ? "docker-compose.prod.yml" : "docker-compose.yml");

  if ((mode === "auto" || mode === "compose") && hasCommand("docker") && fs.existsSync(path.join(ROOT, composeFile))) {
    return {
      mode: "compose",
      composeFile,
      user: process.env.POSTGRES_USER || "vod",
      database: process.env.POSTGRES_DB || "vod",
    };
  }

  throw new Error(`No database backup target available. Install ${tool}, set DATABASE_URL, or set BACKUP_POSTGRES_CONTAINER.`);
}

async function dumpDatabase(filePath) {
  const target = resolveDatabaseTarget("pg_dump");

  if (target.mode === "host") {
    await runToFile("pg_dump", ["--format=custom", "--no-owner", "--no-privileges", `--dbname=${target.databaseUrl}`], filePath);
  } else if (target.mode === "container") {
    await runToFile("docker", ["exec", target.container, "pg_dump", "-U", target.user, "-d", target.database, "-Fc", "--no-owner", "--no-privileges"], filePath);
  } else {
    await runToFile("docker", ["compose", "-f", target.composeFile, "exec", "-T", "postgres", "pg_dump", "-U", target.user, "-d", target.database, "-Fc", "--no-owner", "--no-privileges"], filePath);
  }

  return target;
}

async function restoreDatabase(filePath) {
  const target = resolveDatabaseTarget("pg_restore");

  if (target.mode === "host") {
    await run("pg_restore", ["--clean", "--if-exists", "--no-owner", "--no-privileges", `--dbname=${target.databaseUrl}`, filePath]);
  } else if (target.mode === "container") {
    await runFromFile("docker", ["exec", "-i", target.container, "pg_restore", "-U", target.user, "-d", target.database, "--clean", "--if-exists", "--no-owner", "--no-privileges"], filePath);
  } else {
    await runFromFile("docker", ["compose", "-f", target.composeFile, "exec", "-T", "postgres", "pg_restore", "-U", target.user, "-d", target.database, "--clean", "--if-exists", "--no-owner", "--no-privileges"], filePath);
  }

  return target;
}

function getConfigFiles() {
  const candidates = [
    ".env",
    ".env.production",
    ".next/standalone/.env",
    "Caddyfile",
    "docker-compose.yml",
    "docker-compose.prod.yml",
    "package.json",
    "package-lock.json",
    "prisma.config.ts",
    "prisma/schema.prisma",
    "prisma/migrations",
    "scripts/deploy-standalone.sh",
  ];

  return candidates.filter((item) => fs.existsSync(path.join(ROOT, item)));
}

async function archiveConfig(filePath) {
  const files = getConfigFiles();
  if (files.length === 0) throw new Error("No config files found to archive.");

  await run("tar", ["-czf", filePath, "--", ...files], { cwd: ROOT });
  fs.chmodSync(filePath, 0o600);
  return files;
}

async function extractConfigArchive(archivePath, outputDir) {
  fs.mkdirSync(outputDir, { recursive: true });
  await run("tar", ["-xzf", archivePath, "-C", outputDir]);
}

function checksumFile(filePath) {
  const hash = crypto.createHash("sha256");
  hash.update(fs.readFileSync(filePath));
  return hash.digest("hex");
}

function getGitInfo() {
  return {
    commit: readCommand("git", ["rev-parse", "HEAD"]),
    branch: readCommand("git", ["branch", "--show-current"]),
    dirty: readCommand("git", ["status", "--short"]),
  };
}

function backupTimestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, { mode: 0o600 });
}

function normalizeBackupPrefix(value, settings) {
  let input = trimSlashes(value);
  const cosPrefix = `cos://${settings.Bucket}/`;

  if (input.startsWith(cosPrefix)) input = input.slice(cosPrefix.length);
  if (input.endsWith("/manifest.json")) input = input.slice(0, -"/manifest.json".length);
  return trimSlashes(input);
}

module.exports = {
  ROOT,
  archiveConfig,
  backupTimestamp,
  checksumFile,
  createCos,
  downloadFile,
  dumpDatabase,
  extractConfigArchive,
  getBackupWorkRoot,
  getCosSettings,
  getGitInfo,
  listManifestKeys,
  loadEnv,
  normalizeBackupPrefix,
  os,
  restoreDatabase,
  trimSlashes,
  uploadFile,
  writeJson,
};
