type Context = {
  knex: any;
}

const resolvers = {
  Book: {
    author: async (parent: any, {}: any, { knex, loaders }: any): Promise<any> =>  {
      // console.log('database called', parent.author_id);
      // const author = await knex('authors').where('id', parent.author_id).select().first();

      // with dataloader
      const author = await loaders.author.load(parent.author_id);

      return { ...author, name: `${author.last_name} ${author.first_name}`};
    }
  },
  Library: {
    books: async (parent: any, {}: any, { knex }: Context): Promise<any> => {
      const books = await knex('libraries_books').where('library_id', parent.id).join('books', 'libraries_books.book_id', 'books.id').select('books.*');
      return books;
    }
  },
  Author: {
    books: async (parent: any, {}: any, { knex, loaders }: any): Promise<any> =>  {
      // const books = await knex('books').where('author_id', parent.id);

      // with dataloader
      const books = await loaders.books.load(parent.id);
      return books;
    }
  },
  Query: {
    books: async (_: any, {}, { knex }: Context): Promise<any> => {
      if (!knex) {
        throw new Error("Not connected to the database");
      }

      const books = await knex('books').select();
      return books;
    },
    library: async (_: any, { id }: any, { knex }: Context): Promise<any> => {
      if (!knex) {
        throw new Error("Not connected to the database");
      }

      const library = await knex('libraries').where('id', id).select();
      if (!library.length) {
        throw new Error("Library not found");
      }

      return library[0];
    }
  }
};

export default resolvers;