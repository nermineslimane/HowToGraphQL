const { ApolloServer } = require('apollo-server');
const fs = require('fs');
const path = require('path');
//import the prisma client
const { PrismaClient } = require('@prisma/client');
//The links variable is used to store the links at runtime.
//For now, everything is stored only in-memory rather than being persisted in a database.
//
const { getUserId } = require('./utils');
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const User = require('./resolvers/User');
const Link = require('./resolvers/Link');
const Subscription = require('./resolvers/Subscription');
const Vote = require('./resolvers/Vote');

const { PubSub } = require('apollo-server');

const pubsub = new PubSub();

const resolvers = {
    Query,
    Mutation,
    Subscription,
    User,
    Link,
    Vote,
};
const prisma = new PrismaClient();

const server = new ApolloServer({
    typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8'),
    resolvers,
    context: ({ req }) => {
        return {
            ...req,
            prisma,
            userId: req && req.headers.authorization ? getUserId(req) : null,
            pubsub,
        };
    },
});

server.listen().then(({ url }) =>
    console.log(`
Server is running on ${url}
`)
);