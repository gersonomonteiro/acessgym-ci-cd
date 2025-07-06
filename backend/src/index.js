const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const socketIO = require("socket.io");
const ioClient = require("socket.io-client");
const morgan = require('morgan');
const axios = require("axios");

app = express();

// Criar token personalizado para Morgan
morgan.token('user-id', (req) => extractUserIdFromToken(req));
const logFileName = `${new Date().getDate().toString().padStart(2, '0')}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${new Date().getFullYear()}-access.log`;
const accessLogStream = fs.createWriteStream(path.join(__dirname, '/log', logFileName), { flags: 'a' })
const customFormat = `:remote-addr - [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent - :user-id "`;
app.use(morgan(customFormat, { stream: accessLogStream }))

const http = require("http");
const server = http.Server(app);
const io = socketIO(server);

const authRouter = require("./routes/auth.routes");
const userRouter = require("./routes/user.routes");
const clientRouter = require("./routes/client.routes");
const roleRouter = require("./routes/role.routes");
const permissionRouter = require("./routes/permission.routes");
const accessRouter = require("./routes/access.routes");
const receiptRouter = require("./routes/receipt.routes");
const helper = require("./helper/helper");
const { extractUserIdFromToken} = require('./helper/authHelper');

const constants = require("./config/constants.config");
const { authJwt } = require("./middleware");

require("./database");
helper.setup();
helper.disableInspiredClient();
helper.sendClientNotificationByEmail();

const corsOptions = [
  "http://localhost:4200",
  "https://acessgym.cv"
];

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.use("/api", authRouter);
app.use("/api", userRouter);
app.use("/api", roleRouter);
app.use("/api", permissionRouter);
app.use("/api", clientRouter);
app.use("/api/uploads", express.static(path.join(__dirname, "..", "/uploads")));
app.use("/api", accessRouter);
app.use("/api", receiptRouter);

const sendSerialData = async (data) => {  
  const iot_url = constants.URL_IOT + "/api/write-serial"
  try {
    const response = await axios.post(iot_url, data);
  } catch (err) {
    console.error("Erro ao enviar dados para API:", err.message);
  }  
};

app.post("/api/arduinoled", [authJwt.verifyToken], (req, res) => {
  let data = {led: req.body.code}
  sendSerialData(data)  
});

app.post("/api/serial-data", (req, res) => {
  const data = { data: req.body.data };  
  io.emit("arduino:data", {
    value: req.body.data,
  });
  res.send(data);
});

app.get("/", (req, res) => {
  res.send({ message: "AcessGym UP and Running" });
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`); 
});

module.exports = server;
