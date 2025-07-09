const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const User = require("../models/User");

exports.verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
        err,
      });
    }
    req.userId = decoded.parametro.id;
    return next();
  });
};

exports.verificarAutorizacao = (req, res, next) => {
  const tokenHeader = req.headers['authorization'];

  if (!tokenHeader || !tokenHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de autenticação ausente ou malformado.' });
  }

  const tokenRecebido = tokenHeader.trim();
  const tokenEsperado = `Bearer ${config.TOKEN_INTERNAL}`;

  if (tokenRecebido === tokenEsperado) {
    return next();
  }

  return res.status(401).json({ error: 'Acesso não autorizado.' });
};

