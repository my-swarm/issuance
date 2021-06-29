#!/usr/bin/env bash

ETH_NETWORK=$(grep -oP '^ETH_NETWORK=\K.*' ../.env.local)
ENDPOINT_URL=$(grep -oP '^NEXT_PUBLIC_GRAPHQL_ENDPOINT=\K.*' ../.env.local)
echo "Updating for $ETH_NETWORK from $ENDPOINT_URL"

npx get-graphql-schema $ENDPOINT_URL > schema.graphql
