import { gql } from 'apollo-server-express';

export default gql`
  type Book {
    id: ID!
    title: String!
    author: Author
  }

  type Author {
    id: ID!
    name: String!
    books: [Book]
  }

  type Library {
    id: ID!
    name: String!
    description: String
    books: [Book]
  }

  type Query {
    books: [Book]
    library(id: ID!): Library
  }
`;