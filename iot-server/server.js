const SerialPort = require("serialport");
const Readline   = require("@serialport/parser-readline");
const axios      = require("axios");
const express    = require("express");
const bodyParser = require("body-parser");
const cors       = require("cors");

const API_URL     = "http://localhost:8080/api/serial-data";
const SERVER_PORT = 8888;

const app = express();
app.use(cors({ origin: ["http://localhost:8080", "https://backend.acessgym.cv"] }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let serial;                 
let serialConnected = false;
let currentPortName = null;

app.get("/", (req, res) => {
  res.json({
    iot: "UP",
    serialConnected,
    port: currentPortName,
  });
});

app.post("/api/write-serial", (req, res) => {
  if (!serialConnected) {
    return res.status(503).json({ error: "Serial port not connected" });
  }
  const led = req.body.led;
  serial.write(led, (err) => {
    if (err) {
      console.error("Erro ao escrever na porta serial:", err);
      return res.status(500).json({ error: "write error" });
    }
    res.json({ led });
  });
});

app.listen(SERVER_PORT, () =>
  console.log(`App listening on http://localhost:${SERVER_PORT}`)
);

async function findArduinoPort() {
  const ports = await SerialPort.list();
  const arduino = ports.find(
    (p) => p.manufacturer && p.manufacturer.toLowerCase().includes("arduino")
  );
  if (!arduino) throw new Error("Nenhuma porta Arduino encontrada");
  return arduino.path;
}

(async () => {
  try {
    currentPortName = await findArduinoPort();

    serial = new SerialPort(currentPortName, { baudRate: 9600 });
    serialConnected = true;
    console.log(`Conexão com a porta ${currentPortName} aberta.`);

    const parser = serial.pipe(new Readline());

    const sendSerialData = async (data) => {
      try {
        await axios.post(API_URL, { data });
      } catch (err) {
        console.error("Erro ao enviar dados para API:", err.message);
      }
    };

    parser.on("data", (data) => {
      if (data !== "0" && data !== "1" && data.trim()) {
        sendSerialData(data.trim());
      }
    });

    serial.on("error", (err) => {
      console.error("Erro na porta serial:", err);
    });

    serial.on("close", () => {
      console.log(`Conexão com a porta ${currentPortName} fechada.`);
      serialConnected = false;
      currentPortName = null;
      serial = undefined;
    });
  } catch (err) {
    console.error(err.message);
  }
})();
