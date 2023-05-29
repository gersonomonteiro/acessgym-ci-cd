const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')

app = express()
const http = require('http')
const server = http.Server(app)

const socketIO = require('socket.io')
const io = socketIO(server)
const Readline = require('@serialport/parser-readline')
const SerialPort = require('serialport')

const authRouter = require('./routes/auth.routes')
const userRouter = require('./routes/user.routes')
const clientRouter = require('./routes/client.routes')
const roleRouter = require('./routes/role.routes')
const permissionRouter = require('./routes/permission.routes')
const accessRouter = require('./routes/access.routes')
const receiptRouter = require('./routes/receipt.routes')
const helper = require('./helper/helper')

const { authJwt } = require('./middleware')

require('./database')
helper.setup()
helper.disableInspiredClient()
helper.sendClientNotificationByEmail()

var corsOptions = {
    origin: 'http://localhost:4200',
    origin: 'https://acessgym.cv',
}

app.use(cors(corsOptions))

// parse requests of content-type - application/json
app.use(bodyParser.json())

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// database
// const db = require("./models");
// const Role = db.role;

//db.sequelize.sync();
// force: true will drop the table if it already exists
/*db.sequelize.sync({ force: true }).then(() => {
    console.log('Drop and Resync Database with { force: true }');
    initial();
});*/

// routes
app.use('/api', authRouter)
app.use('/api', userRouter)
app.use('/api', roleRouter)
app.use('/api', permissionRouter)
app.use('/api', clientRouter)
app.use('/api/uploads', express.static(path.join(__dirname, '..', '/uploads')))
app.use('/api', accessRouter)
app.use('/api', receiptRouter)
/*
const mySerial = new SerialPort('COM3', {
    baudRate: 9600,
})
const parser = mySerial.pipe(new Readline())

mySerial.on('open', function () {
    console.log('Opened Port.')
})
mySerial.on('err', function (data) {
    console.log(err.message)
})

parser.on('data', function (data) {
    console.log(data)
    if (data !== '0' && data !== '1') {
        io.emit('arduino:data', {
            value: data,
        })
    }
    
})

app.post('/api/arduinoled', [authJwt.verifyToken], (req, res) => {
    mySerial.write(req.body.code, (err) => {
        if (err) {
          console.error('Erro ao escrever na porta serial:', err);
        } else {
            res.send()
        }

    });
}) 
*/ 
app.post('/send-notification', (req, res) => {
    const data = { data: req.body.data }
    console.log(data)
    io.emit('arduino:data', {
        value: req.body.data,
    }) // Updates Live Notification
    res.send(data)
})
app.get('/', (req, res) => {    
    res.send({message:'AcessGym UP and Running'})
})

// set port, listen for requests
const PORT = process.env.PORT || 8080
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`)
})

module.exports = server
