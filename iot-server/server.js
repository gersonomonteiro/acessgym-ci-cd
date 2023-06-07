const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");
const fs = require("fs");

const portName = "COM3"; // Altere para a porta serial correta

const serial = new SerialPort(portName, { baudRate: 9600 });
const parser = serial.pipe(new Readline());

const filePath = "../backend/src/shared/dataCard.txt";
const ledFilePath = "../backend/src/shared/ledData.txt";

// Função para escrever os dados no arquivo
const writeFl = (data) => {
  clearFile(ledFilePath);
  fs.appendFile(filePath, `${data}\n`, (err) => {
    if (err) {
      console.error("Erro ao escrever no arquivo:", err);
    }
  });
};

const readFl = () => {
  fs.readFile(ledFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Erro ao ler o ficheiro:", err);
      return;
    }
    console.log(data);
  });
};

const clearFile = (path) => {
  fs.writeFile(path, "", (err) => {
    if (err) {
      console.error("Erro ao limpar o ficheiro:", err);
    }
  });
};

fs.watchFile(ledFilePath, (curr, prev) => {
  if (curr.mtime > prev.mtime && curr.size > 0) {
    fs.readFile(ledFilePath, "utf8", (err, data) => {
      if (err) {
        console.error("Erro ao ler o ficheiro:", err);
        return;
      }
      console.log(data);
      serial.write(data, (err) => {
        if (err) {
          console.error("Erro ao escrever na porta serial:", err);
        }
      });
    });
    
    setTimeout(() => {
      clearFile(ledFilePath);
    }, 1000);
  }
});

// Evento disparado quando há leitura de dados da porta serial
parser.on("data", (data) => {
  if (data !== "0" && data !== "1" && data.length > 0) {
    console.log(data);
    writeFl(data);
  }
});

serial.on("open", () => {
  console.log(`Conexão com a porta ${portName} aberta.`);
  clearFile(filePath)
});

serial.on("err", (err) => {
  console.error("Erro na porta serial:", err);
});

serial.on("close", () => {
  console.log(`Conexão com a porta ${portName} fechada.`);
});
