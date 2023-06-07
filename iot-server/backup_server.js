/*const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');*/
const socketIO = require("socket.io");
const express = require("express");
const http = require("http");



app = express();
const server = http.Server(app);
const io = socketIO(server);



const authToken = 'jzrCyntxXVOfPymC1qBHhauvQamHPDpV';

// Middleware para autenticar o cliente com base no token
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (token !== authToken) {
    return next(new Error('Token de autenticação inválido.'));
  }
  next();
});

app.get("/", (req, res) => {
    res.send({ message: "IOT Server AcessGym UP and Running" });
  });
// Emita um evento a cada segundo
setInterval(() => {
  io.emit('data', 'Algum dado autenticado');
}, 1000);

server.listen(3000, () => {
  console.log('App1 escutando em http://localhost:3000');
});
