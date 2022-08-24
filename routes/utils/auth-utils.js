const jwt = require('jsonwebtoken');

const extractToken = (authorization) => authorization.split(' ')[1];
const verify = (token) => jwt.verify(token, process.env.SECRET);

module.exports = {
  extractToken,
  verify,
};
