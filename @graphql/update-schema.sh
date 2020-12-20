ENDPOINT_URL="http://localhost:8200/subgraphs/name/my-swarm/issuance"

npx get-graphql-schema $ENDPOINT_URL > schema.graphql
