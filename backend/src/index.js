const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const socketIO = require("socket.io");
const ioClient = require("socket.io-client");
const morgan = require('morgan');

app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, '/log', 'access.log'), { flags: 'a' })
app.use(morgan('combined', { stream: accessLogStream }))

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
const constants = require("./config/constants.config");
const { authJwt } = require("./middleware");

require("./database");
helper.setup();
helper.disableInspiredClient();
helper.sendClientNotificationByEmail();

var corsOptions = {
  origin: "http://localhost:4200",
  origin: "https://acessgym.cv",
};

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
/*
const mySerial = new SerialPort("COM3", {
  baudRate: 9600,
});

const parser = mySerial.pipe(new Readline());

mySerial.on("open", function () {
  console.log("Opened Port.");
});
mySerial.on("err", function (data) {
  console.log(err.message);
});

parser.on("data", function (data) {
  console.log(data);
  if (data !== "0" && data !== "1") {
    io.emit("arduino:data", {
      value: data,
    });
  }
});
*/
// Função para ler o conteúdo do arquivo

const filePath = path.join(__dirname, "/shared", "dataCard.txt");
const ledFilePath = path.join(__dirname, "/shared", "ledData.txt");

const readData = () => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Erro ao ler o ficheiro:", err);
      return;
    }
    console.log(data.length);
    if (data.length > 4) {
      io.emit("arduino:data", {
        value: data,
      });
    }
    
  });
};

const limpar = (data) => {
  fs.writeFile(filePath, "", (err) => {
    if (err) {
      console.error("Erro ao limpar o ficheiro:", err);
    }
  });
};

fs.watchFile(filePath, (curr, prev) => {
  if (curr.mtime > prev.mtime && curr.size > 1 && curr.size <= 8)  {
    readData();
    setTimeout(() => {
      limpar();
    }, 1000);
  }
});

const escrever = (data, callback) => {
  fs.appendFile(ledFilePath, data, (err) => {    
    if (err) {
      console.error("Erro ao escrever no ficheiro: ", err);
      callback(err);
    }
    callback(null);
  });
};

app.post("/api/arduinoled", [authJwt.verifyToken], (req, res) => {
  console.log("data: ",req.body.code);
  escrever(req.body.code, (err) => {
    if (err) {
      console.error("Erro ao gravar os dados:", err);
    } else {
      return res.json()
    }
  })
});

app.post("/send-notification", (req, res) => {
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
