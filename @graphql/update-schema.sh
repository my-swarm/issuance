#!/usr/bin/env bash

HOST="http://localhost"
ETH_NETWORK=$(grep -oP '^ETH_NETWORK=\K.*' ../.env.local)
echo "Updating for $ETH_NETWORK"
if [ "$ETH_NETWORK" == "local" ]; then
	PORT=8100
elif [ "$ETH_NETWORK" == "kovan" ]; then
	PORT=8200
elif [ "$ETH_NETWORK" == "kovan_remote" ]; then
  HOST="https://graphql.kovan.myswarm.app"
	PORT=443
elif [ "$ETH_NETWORK" == "mainnet" ]; then
	PORT=8300
elif [ "$ETH_NETWORK" == "mainnet_remote" ]; then
  HOST="https://graphql.myswarm.app"
	PORT=443
else
  echo "Setup ETH_NETWORK network in .env.local: kovan, mainnet, local"
  exit 1
fi
ENDPOINT_URL="$HOST:$PORT/subgraphs/name/my-swarm/issuance"
echo $ENDPOINT_URL

npx get-graphql-schema $ENDPOINT_URL > schema.graphql
