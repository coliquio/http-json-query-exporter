#!/bin/bash
docker build --build-arg GIT_REF=$(git rev-parse --short HEAD) -t coliquiode/http-json-query-exporter .
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
docker push coliquiode/http-json-query-exporter
