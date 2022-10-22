const { nanoid } = require('nanoid');
// const _ = require('lodash');
// const fs = require('fs');
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

  // const stringify = JSON.stringify(data, null, 2);
  // fs.writeFileSync('./src/books.json', stringify);

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
  const result = [];
  Book.forEach((val) => {
    result.push({
      id: val.id,
      name: val.name,
      publisher: val.publisher,
    });
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
  const index = Book.filter((val) => val.id === bookId);

  // Validasi
  if (!('name' in payload)) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    }).code(400);
  }

  if (!index.length) {
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
    statu: 'success',
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
