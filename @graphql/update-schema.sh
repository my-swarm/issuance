#!/usr/bin/env bash

ENDPOINT_URL=$(grep -oP '^NEXT_PUBLIC_GRAPHQL_ENDPOINT=\K.*' ../.env.local)
echo "Updating from $ENDPOINT_URL"

if [ ENDPOINT_URL == "http://localhost:8100/subgraphs/name/my-swarm/issuance" ]
then
  npx get-graphql-schema $ENDPOINT_URL > schema.graphql
fi
