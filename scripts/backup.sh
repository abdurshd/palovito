#!/bin/bash
DATE=$(date +"%Y%m%d%H%M")
BACKUP_FILE="/backups/backup_$DATE.sql.gz"

# Create backup
docker exec postgres pg_dumpall -U $DB_USER -h $DB_HOST | gzip > $BACKUP_FILE

# Upload to GCS
gsutil cp $BACKUP_FILE gs://$GCS_BUCKET/backups/

# Clean up local backup
rm $BACKUP_FILE 