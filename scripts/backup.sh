#!/bin/bash
DATE=$(date +"%Y%m%d%H%M")
docker exec postgres pg_dumpall -U postgres | gzip > /backups/backup_$DATE.sql.gz 