import express from 'express';
import DataLoader from "dataloader";
import { ApolloServer } from 'apollo-server-express';
import { createServer } from 'http';
// import cors from 'cors';
// import helmet from 'helmet';
// import compression from 'compression';

import typeDefs from './schema';
import resolvers from './resolvers';
import startDB from './database';

const dataLoaders = async () => {
  const db = await startDB();

  return {
    author: new DataLoader((ids: any) => {
      console.log("database authors queried dataLoader", ids);
  
      return db('authors').whereIn('id', ids).select();
    }),
    books: new DataLoader(async (authorIds: any) => {
      console.log("database books queried dataLoader", authorIds);

      const books = await db('books').whereIn('author_id', authorIds).select();
      let allBooks = authorIds.map((authorId: any) => {
        return books.filter((item: any) => item.author_id === authorId);
      });
      
      return allBooks;
    }),
  };
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async () => {
    const knex = await startDB();
    const loaders = await dataLoaders();
    return { knex, loaders };
  },
  playground: true,
  introspection: true
});

const app = express();
// app.use(cors({}));
// app.use(helmet());
// app.use(compression());

server.applyMiddleware({ app, path: '/graphql', cors: false });
const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);
const PORT = 4000;

httpServer.listen(PORT, (): void => {
  console.log(`GraphQL endpoint and playground available at http://localhost:${PORT}${server.graphqlPath}`);
});