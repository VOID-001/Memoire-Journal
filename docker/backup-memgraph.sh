#!/bin/bash
# backup-memgraph.sh — run via cron daily at 2am
DATE=$(date +%Y-%m-%d)
BACKUP_ROOT="/backups/memgraph"
BACKUP_DIR="$BACKUP_ROOT/$DATE"

mkdir -p "$BACKUP_DIR"

# Trigger snapshot inside container
docker exec memgraph-mage bash -c "echo 'CREATE SNAPSHOT;' | mgconsole --host 127.0.0.1 --port 7687"

sleep 5

# Copy snapshot and WAL files out
docker cp memgraph-mage:/var/lib/memgraph/snapshots "$BACKUP_DIR/snapshots"
docker cp memgraph-mage:/var/lib/memgraph/wal "$BACKUP_DIR/wal"

# Keep only last 7 days
find "$BACKUP_ROOT" -maxdepth 1 -type d -mtime +7 -exec rm -rf {} +

echo "[$DATE] Memgraph backup complete → $BACKUP_DIR"
