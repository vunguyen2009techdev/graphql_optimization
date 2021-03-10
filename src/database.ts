import { Knex, knex } from 'knex';

let knexInstance: any = null;

async function startDB() {
  if (!knexInstance) {
    const config: Knex.Config = {
      client: 'sqlite3',
      connection: {
        filename: ':memory:'
      },
      useNullAsDefault: true
    }
    knexInstance = knex(config);

    await createDatabaseSchema(knexInstance);
    // console.log('database initialized');
  }

  return knexInstance;
};

async function createDatabaseSchema(knex: any) {
  await knex.schema.createTable('authors', (table: any) => {
    table.increments('id');
    table.string('first_name');
    table.string('last_name');
  }).createTable('books', (table: any) => {
    table.increments('id');
    table.string('title');
    table.integer('author_id').unsigned().references('authors.id');
  }).createTable('libraries', (table: any) => {
    table.increments('id');
    table.string('name');
    table.string('description');
  }).createTable('libraries_books', (table: any) => {
    table.increments('id');
    table.integer('library_id').unsigned().references('libraries.id');
    table.integer('book_id').unsigned().references('books.id');
  });

  const insertedUsers = await knex('authors').insert([
    { id: 1, first_name: 'anh vu', last_name: 'nguyen' },
    { id: 2, first_name: 'minh tu', last_name: 'nguyen' },
    { id: 3, first_name: 'phuong nghi', last_name: 'tran' }
  ]);

  const insertedBooks = await knex('books').insert([
    { title: 'Awesome tunes', author_id: 1 },
    { title: 'Starry Window', author_id: 2 },
    { title: 'Upbeat vocals', author_id: 2 },
    { title: 'Rotten', author_id: 3 },
  ]);

  const insertedLibraries = await knex('libraries').insert({
    id: 1,
    name: 'My favorite songs',
    description: 'Lorem ipsum',
  });

  const insertedLibrariesBooks = await knex('libraries_books').insert([
    { library_id: 1, book_id: 3 }
  ]);

  return true;
}

export default startDB;