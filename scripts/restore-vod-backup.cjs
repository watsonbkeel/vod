#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const {
  createCos,
  downloadFile,
  extractConfigArchive,
  getBackupWorkRoot,
  getCosSettings,
  listManifestKeys,
  loadEnv,
  normalizeBackupPrefix,
  restoreDatabase,
  trimSlashes,
} = require("./vod-backup-lib.cjs");

function parseArgs(argv) {
  const args = {
    backup: "",
    confirm: false,
    restoreConfig: false,
    downloadOnly: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--backup") args.backup = argv[++index] || "";
    else if (arg === "--latest") args.backup = "latest";
    else if (arg === "--confirm") args.confirm = true;
    else if (arg === "--restore-config") args.restoreConfig = true;
    else if (arg === "--download-only") args.downloadOnly = true;
    else if (arg === "--help" || arg === "-h") args.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }

  return args;
}

function printHelp() {
  console.log(`Usage:
  node scripts/restore-vod-backup.cjs --latest --confirm
  node scripts/restore-vod-backup.cjs --backup vod/2026-05-29T00-15-00-000Z --confirm
  node scripts/restore-vod-backup.cjs --latest --download-only

Options:
  --latest          Restore/download the newest manifest under the configured COS prefix.
  --backup <key>    Backup prefix or cos://bucket/prefix. May include /manifest.json.
  --confirm         Required before database restore runs.
  --restore-config  Extract config archive to .backups/restores/<backup-id>/config.
  --download-only   Download backup files without restoring the database.
`);
}

async function resolveBackupPrefix(cos, settings, requested) {
  if (!requested || requested === "latest") {
    const manifests = await listManifestKeys(cos, settings);
    const latest = manifests.at(-1);
    if (!latest) throw new Error(`No backup manifests found under cos://${settings.Bucket}/${settings.Prefix}/`);
    return normalizeBackupPrefix(latest, settings);
  }

  return normalizeBackupPrefix(requested, settings);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  loadEnv();

  const settings = getCosSettings();
  const cos = createCos(settings);
  const backupPrefix = await resolveBackupPrefix(cos, settings, args.backup || "latest");
  const backupId = path.basename(trimSlashes(backupPrefix));
  const restoreDir = path.join(getBackupWorkRoot(), "restores", backupId);
  const dbDump = path.join(restoreDir, "database.dump");
  const configArchive = path.join(restoreDir, "config.tar.gz");
  const manifestPath = path.join(restoreDir, "manifest.json");

  fs.mkdirSync(restoreDir, { recursive: true });
  console.log(`[restore] downloading cos://${settings.Bucket}/${backupPrefix}`);

  await downloadFile(cos, settings, `${backupPrefix}/manifest.json`, manifestPath);
  await downloadFile(cos, settings, `${backupPrefix}/database.dump`, dbDump);
  await downloadFile(cos, settings, `${backupPrefix}/config.tar.gz`, configArchive);

  if (args.restoreConfig) {
    const configDir = path.join(restoreDir, "config");
    await extractConfigArchive(configArchive, configDir);
    console.log(`[restore] extracted config archive to ${configDir}`);
  }

  if (args.downloadOnly) {
    console.log(`[restore] downloaded backup files to ${restoreDir}`);
    return;
  }

  if (!args.confirm) {
    throw new Error("Refusing to restore database without --confirm. Use --download-only to inspect files first.");
  }

  await restoreDatabase(dbDump);
  console.log("[restore] database restore completed");
}

main().catch((error) => {
  console.error(`[restore] failed: ${error instanceof Error ? error.message : error}`);
  process.exit(1);
});
