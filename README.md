# Backup

1. Start the app

```bash
docker-compose up -d
```

2. Backup Volumes

```bash
sh backup.sh ./docker-compose.yml media_pi /path/to/your/backups
```

3. Restore Volumes

```bash
sh restore_volumes.sh plex-config /path/to/your/backups/media_pi_plex-config.tar
sh restore_volumes.sh plex-config /path/to/your/backups/media_pi_plex-transcode.tar
sh restore_volumes.sh prowlarr-config /path/to/your/backups/media_pi_prowlarr-config.tar
sh restore_volumes.sh qflood-config /path/to/your/backups/media_pi_qflood-config.tar
sh restore_volumes.sh radarr-config /path/to/your/backups/media_pi_radarr-config.tar
sh restore_volumes.sh sonarr-config /path/to/your/backups/media_pi_sonarr-config.tar
```
