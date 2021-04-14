ENDPOINT_URL="http://localhost:8100/subgraphs/name/my-swarm/issuance"

npx get-graphql-schema $ENDPOINT_URL > schema.graphql
