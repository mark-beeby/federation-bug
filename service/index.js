const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');
const { environment, port } = require('./config');

const typeDefs = gql`
  type Customer @key(fields: "_id") {
    _id: String!
    name: String!
    somethingx: Boolean!
    # somethingy: Boolean!
  }

  type Query {
      customer: Customer
  }
  
  type Mutation {
    toggleMinimiseMe (enabled: Boolean!) : Customer!
  }
`;

const customerFixture = [{
  "_id": "xyz",
  "name": "Some Company Ltd",
  "somethingx": true,
  // "somethingy": true
}];

const resolvers = {
  Query: {
    customer: () => customerFixture[0]
  }
};

const server = new ApolloServer({ schema: buildFederatedSchema([{typeDefs, resolvers}])});

server.listen({
  port
}).then(async ({ url }) => {
  console.log(`🚀  Apollo service listening at ${url}`);
});
