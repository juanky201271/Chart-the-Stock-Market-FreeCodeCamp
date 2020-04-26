require("dotenv").config()
//const cookieSession = require("cookie-session")
const path = require("path")
const express = require("express")
const app = express()
const PORT = process.env.PORT || 8000 // express
//const passport = require("passport")
const bodyParser = require('body-parser')
const mongoose = require("mongoose")
const cors = require("cors")
const http = require("http")
const socketIo = require("socket.io")
//const cookieParser = require("cookie-parser")
//const session = require("express-session")

//const passportSetup = require("./config/passport-setup")
//const authRouter = require("./routes/auth-router-ctrl")
const stockRouter = require('./routes/stock-router')
const indexRouter = require("./routes/index")
//const userRouter = require('./routes/user-router')
const db = require('./db')

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

//app.use(
//  cookieSession({
//    name: "session",
//    keys: [process.env.COOKIE_KEY],
//    maxAge: 30 * 24 * 60 * 60 * 10000
//  })
//)

//app.use(cookieParser())
//app.use(passport.initialize())
//app.use(passport.session())

app.use(
  cors(
    //{
    //origin: ["https://bva-jccc-fcc.herokuapp.com", "https://api.twitter.com", "http://localhost:3000", "http://localhost:8000"], // "http://localhost:3000",  // allow to server to accept request from different origin (React)
    //methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    //credentials: true // allow session cookie from browser to pass through
    //}
  )
)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/api', stockRouter)
//app.use('/api', userRouter)
//app.use('/api', authRouter)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, "client/build")))

  app.use(function(req, res) {
  	res.sendFile(path.join(__dirname, '../client/build/index.html'))
  })
} else {
  app.use(indexRouter)
}

const server = app.listen(PORT, () => console.log(`Server on Port ${PORT}`))
//const server = http.createServer(app)
const io = socketIo(server)

let interval

io.on("connection", (socket) => {
  console.log("New client connected")
  if (interval) {
    clearInterval(interval)
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000)
  socket.on("disconnect", () => {
    console.log("Client disconnected")
    clearInterval(interval)
  })
})

const getApiAndEmit = socket => {
  const response = new Date()
  // Emitting a new message. Will be consumed by the client
  socket.emit("FromAPI", response)
}
