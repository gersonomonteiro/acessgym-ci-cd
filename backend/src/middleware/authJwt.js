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
  let token = req.headers["authorization"];
  let tokenEsperado = `Bearer ${config.TOKEN_INTERNAL}`
  if (token === tokenEsperado) {
    return next();    
  }else{
    return res.status(401).json({ error: 'Unauthorized!' });
  }
  
};

