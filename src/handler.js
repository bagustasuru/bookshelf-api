const { nanoid } = require('nanoid');
const Book = require('./Book');

const handler = {};

handler.create = (request, h) => {
  if (!('name' in request.payload)) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    }).code(400);
  }

  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  const data = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished: pageCount === readPage,
    reading,
    insertedAt,
    updatedAt,
  };

  Book.push(data);

  const validateId = Book.filter((book) => book.id === id).length > 0;

  if (validateId) {
    return h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    }).code(201);
  }

  return h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
    data: {
      bookId: id,
    },
  }).code(500);
};

handler.findAll = (request, h) => {
  const { query } = request;

  let reading = false;
  let finished = false;
  if (query.reading === '1') {
    reading = true;
  }
  if (query.finished === '1') {
    finished = true;
  }

  // Reformat data book & filter jika ada request query
  const result = [];
  Book.forEach((val) => {
    // Jika query ada reading & tidak sama dengan null
    if ('reading' in query && query.reading !== null) {
      if (val.reading === reading) {
        console.log(`Reading: ${reading}`);
        result.push({
          id: val.id,
          name: val.name,
          publisher: val.publisher,
        });
      }
    }

    // Jika query ada finished & tidak sama dengan null
    if ('finished' in query && query.finished !== null) {
      if (val.finished === finished) {
        console.log(`Finished: ${finished}`);
        result.push({
          id: val.id,
          name: val.name,
          publisher: val.publisher,
        });
      }
    }

    // Jika query ada name & tidak sama dengan null
    if ('name' in query && query.name !== null) {
      // set tolowerCase
      const originalVame = val.name.toLowerCase();
      const queryName = query.name.toLowerCase();

      if (originalVame.includes(queryName)) {
        console.log(`Name: ${query.name}`);
        result.push({
          id: val.id,
          name: val.name,
          publisher: val.publisher,
        });
      }
    }

    // Jika tidak ada query atau query sama dengan null
    if (typeof query === 'object' && Object.keys(query).length === 0) {
      console.log('Everything else');
      result.push({
        id: val.id,
        name: val.name,
        publisher: val.publisher,
      });
    }
  });

  return h.response({
    status: 'success',
    data: {
      books: result,
    },
  });
};

handler.findOne = (request, h) => {
  const { bookId } = request.params;

  const book = Book.filter((val) => val.id === bookId);

  if (!book.length) {
    return h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    }).code(404);
  }

  return h.response({
    status: 'success',
    data: {
      book: book[0],
    },
  }).code(200);
};

handler.update = (request, h) => {
  const { bookId } = request.params;
  const { payload } = request;
  const updatedAt = new Date().toISOString();
  const index = Book.findIndex((val) => val.id === bookId);

  // Validasi
  if (!('name' in payload)) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    }).code(400);
  }

  if (index === -1) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    }).code(404);
  }

  if (payload.readPage > payload.pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = payload;

  Book[index] = {
    ...Book[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt,
  };

  return h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  }).code(200);
};

handler.delete = (request, h) => {
  const { bookId } = request.params;
  const index = Book.findIndex((val) => val.id === bookId);

  if (index !== -1) {
    Book.splice(index, 1);

    return h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    }).code(200);
  }

  return h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  }).code(404);
};

module.exports = handler;
