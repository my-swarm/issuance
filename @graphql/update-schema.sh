#!/usr/bin/env bash

ENDPOINT_URL=$(grep -oP '^NEXT_PUBLIC_GRAPHQL_ENDPOINT=\K.*' ../.env.local)
echo "Updating from $ENDPOINT_URL"

npx get-graphql-schema $ENDPOINT_URL > schema.graphql
