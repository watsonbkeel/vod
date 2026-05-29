#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const {
  archiveConfig,
  backupTimestamp,
  checksumFile,
  createCos,
  dumpDatabase,
  getBackupWorkRoot,
  getCosSettings,
  getGitInfo,
  loadEnv,
  os,
  uploadFile,
  writeJson,
} = require("./vod-backup-lib.cjs");

async function main() {
  loadEnv();

  const settings = getCosSettings();
  const cos = createCos(settings);
  const createdAt = new Date();
  const timestamp = backupTimestamp();
  const workDir = path.join(getBackupWorkRoot(), timestamp);
  const dbDump = path.join(workDir, "database.dump");
  const configArchive = path.join(workDir, "config.tar.gz");
  const manifestPath = path.join(workDir, "manifest.json");
  const objectPrefix = `${settings.Prefix}/${timestamp}`;

  fs.mkdirSync(workDir, { recursive: true });
  console.log(`[backup] writing local backup to ${workDir}`);

  const databaseTarget = await dumpDatabase(dbDump);
  const configFiles = await archiveConfig(configArchive);
  const manifest = {
    app: "vod",
    createdAt: createdAt.toISOString(),
    hostname: os.hostname(),
    objectPrefix,
    database: {
      file: "database.dump",
      format: "pg_dump custom",
      target: {
        mode: databaseTarget.mode,
        container: databaseTarget.container,
        composeFile: databaseTarget.composeFile,
        database: databaseTarget.database,
        user: databaseTarget.user,
      },
      sha256: checksumFile(dbDump),
    },
    config: {
      file: "config.tar.gz",
      files: configFiles,
      sha256: checksumFile(configArchive),
    },
    git: getGitInfo(),
  };

  writeJson(manifestPath, manifest);

  await uploadFile(cos, settings, `${objectPrefix}/database.dump`, dbDump, "application/octet-stream");
  await uploadFile(cos, settings, `${objectPrefix}/config.tar.gz`, configArchive, "application/gzip");
  await uploadFile(cos, settings, `${objectPrefix}/manifest.json`, manifestPath, "application/json");

  console.log(`[backup] uploaded to cos://${settings.Bucket}/${objectPrefix}`);
}

main().catch((error) => {
  console.error(`[backup] failed: ${error instanceof Error ? error.message : error}`);
  process.exit(1);
});
