# Backup

1. Start the app

```bash
docker-compose up -d
```

2. Auto Configure the Setup

```bash
docker-compose run auto-configure npm test
docker-compose rm -f
```

3. Backup Volumes

```bash
sh scripts/backup_all_volumes.sh
```

4. Restore Volumes

```bash
sh scripts/restore_volume.sh jellyfin-config
sh scripts/restore_volume.sh prowlarr-config
sh scripts/restore_volume.sh qflood-config
sh scripts/restore_volume.sh radarr-config
sh scripts/restore_volume.sh sonarr-config
```
