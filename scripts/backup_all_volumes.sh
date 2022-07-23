#!/bin/bash
. .env

project_name=${PWD##*/}
project_name=${project_name:-/} 

function backup_volume {
  volume_name=$1
  backup_destination=$2

  echo "Doing backup for volume ${volume_name} to ${backup_destination}/${volume_name}.tar"
  
  docker run --rm \
      -v $volume_name:/data \
      -v $backup_destination:/backup \
      ubuntu \
      tar -zcf /backup/$volume_name.tar --absolute-names /data
}

echo "Stopping running containers"
docker-compose -f docker-compose.yml stop

echo "Mounting volumes and performing backup..."
volumes=($(docker volume ls -f name=$project_name | awk '{if (NR > 1) print $2}'))
for v in "${volumes[@]}"
do
  backup_volume $v ${ROOT}backups
done

echo "Restarting containers"
docker-compose -f docker-compose.yml start