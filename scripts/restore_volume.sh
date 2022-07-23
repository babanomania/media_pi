#!/bin/sh
. .env

project_name=${PWD##*/}
project_name=${project_name:-/}

volume_name=$1
restore_file="${ROOT}backups/${project_name}_${volume_name}.tar"

function validateInput() {

    if [ ! -f "${restore_file}" ] ; then
        echo "> Error: Restore file not found at ${restore_file}"
        exit 1
    fi

    INSPECT_VOLUME=$(docker volume inspect ${volume_name} 2>&1)
    if [[ ! ${INSPECT_VOLUME} == *"No such volume"* ]] ; then
        echo "> Error: docker volume '${volume_name}' already exists"
        exit 1
    fi
}

validateInput $volume_name

echo "> Creating docker volume:" $(docker volume create --name ${project_name}_${volume_name})

docker run --rm	\
    -v ${project_name}_${volume_name}:/backup-dest \
    -v ${restore_file}:/restore-src.tar.gz \
    ubuntu \
    tar -xzf /restore-src.tar.gz --absolute-names -C /backup-dest

echo "> Finished! Docker volume '${volume_name}' is ready for use"
