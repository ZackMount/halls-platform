#!/bin/sh
set -eu
cd "$(dirname "$0")"
docker build --platform linux/amd64 -t halls-koh:1.2.2 .
test "$(docker image inspect halls-koh:1.2.2 --format '{{.Architecture}}')" = amd64
