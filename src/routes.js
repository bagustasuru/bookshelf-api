const handler = require('./handler');

const routes = [
  {
    path: '/books',
    method: 'POST',
    handler: handler.create,
  },
  {
    path: '/books',
    method: 'GET',
    handler: handler.findAll,
  },
  {
    path: '/books/{bookId}',
    method: 'GET',
    handler: handler.findOne,
  },
  {
    path: '/books/{bookId}',
    method: 'PUT',
    handler: handler.update,
  },
  {
    path: '/books/{bookId}',
    method: 'DELETE',
    handler: handler.delete,
  },
];

module.exports = routes;
