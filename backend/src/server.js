const express = require('express')
const app = express()

const http = require('http')
const server = http.Server(app)

const socketIO = require('socket.io')
const io = socketIO(server)

const port = process.env.PORT || 3000

io.on('connection', (socket) => {
    console.log('user connected')
})

server.listen(port, () => {
    console.log(`started on port: ${port}`)
}) 

/***  
 * codigo index backup
 */

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

require('./database')

var corsOptions = {
    origin: 'http://localhost:4200',
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

const mySerial = new SerialPort('/dev/ttyACM0', {
    baudRate: 9600,
})
mySerial.on('open', function () {
    console.log('Opened Port.')
})

const parser = mySerial.pipe(new Readline())

parser.on('data', function (data) {
    console.log(data)
    /*console.log(parseInt(data));
      console.log(data.toString());*/
    io.emit('arduino:data', {
        value: data,
    })
})

mySerial.on('err', function (data) {
    console.log(err.message)
})

io.on('connection', (socket) => {
    console.log('user connected')
})

app.post('/send-notification', (req, res) => {
    const notify = { data: req.body.data }
    io.emit('notification', notify) // Updates Live Notification
    res.send(notify)
})

setInterval(function () {
    io.emit('notification', 'dados dja bem')
}, 5000)

// set port, listen for requests
const PORT = process.env.PORT || 8080
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`)
})
