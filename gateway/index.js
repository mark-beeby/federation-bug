const { ApolloServer } = require('apollo-server');
const { ApolloGateway } = require("@apollo/gateway");
const { api, port, environment } = require('./config');

const gateway = new ApolloGateway({
  serviceList: api.apollo.endpoints,
  debug: true,
  experimental_pollInterval: 3000
});

const server = new ApolloServer({
  gateway,
  subscriptions: false,
  playground: true,
  introspection: true
});

server.listen({
  port
}).then(({ url }) => {
  console.info(`🚀  Server running at ${url}`);
});
