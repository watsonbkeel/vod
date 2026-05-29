#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
NODE_BIN="${NODE_BIN:-$(command -v node)}"
LOG_DIR="${BACKUP_LOG_DIR:-/var/log/vod-backup}"
CRON_TIME="${BACKUP_CRON_TIME:-10 0 * * *}"
CRON_LINE="${CRON_TIME} cd ${APP_DIR} && BACKUP_ENV_FILE=${APP_DIR}/.env ${NODE_BIN} ${APP_DIR}/scripts/backup-vod.cjs >> ${LOG_DIR}/backup.log 2>&1"

mkdir -p "${LOG_DIR}"

{
  crontab -l 2>/dev/null | sed '/# vod-backup:start/,/# vod-backup:end/d'
  echo "# vod-backup:start"
  echo "${CRON_LINE}"
  echo "# vod-backup:end"
} | crontab -

echo "Installed vod backup cron:"
echo "${CRON_LINE}"
