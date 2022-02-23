#!/usr/bin/env bash

ENDPOINT_URL="http://localhost:8100/subgraphs/name/my-swarm/issuance";
echo "Updating from $ENDPOINT_URL"
npx get-graphql-schema $ENDPOINT_URL > schema.graphql
