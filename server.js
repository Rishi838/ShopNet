// Importing required modules
const express = require('express')
const path = require('path')
require('dotenv').config();

// Importing all utilities that need to be use
const authRoutes = require('./routes/authroutes')

const app = express()

// Using this middleware to parse req.body in json format
app.use(express.json())

// setting views and view engine

// Setting view engine tp ejs files
app.set("view engine", "ejs")
// setting path for ejs files
app.set("views", path.join("./Frontend/views"))
// Setting path to render css
app.use(express.static(__dirname));


const port = process.env.PORT || 8080


// Using auth routes in our server files which take access from routes folder
app.use(authRoutes)

// Listening on port defined in .env files else on port 8080
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})