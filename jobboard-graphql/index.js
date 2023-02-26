require('./env');
const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { typeDefs } = require('./typeDefs');
const { resolvers } = require('./resolvers');
const { JobsAPI } = require('./data/JobsAPI');
const { UsersAPI } = require('./data/UsersAPI');
const { getUserFromToken } = require('./auth');

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
startStandaloneServer(server, {
  context: async ({req}) => {
    const { cache } = server;
    const token = req.headers["authorization"]?.split('Bearer ')[1];
    const user = getUserFromToken(token);
    return {
      dataSources: {
        JobsAPI: new JobsAPI({cache, token}),
        UsersAPI: new UsersAPI({cache, token}),
      },
      user,
      token
    }
  }, 
  listen: { port: 4000 },
}).then((server) => {
  console.log(`🚀  Server ready at: ${server.url}`);
});
