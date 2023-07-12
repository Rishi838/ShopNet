// Importing required modules
const express = require('express')
const path = require('path')
require('dotenv').config();

// Importing all utilities that need to be use
const authRoutes = require('./routes/authroutes')
const protectedRoutes = require('./routes/cartRoutes')
const addproduct = require('./routes/add_product_routes')
const cartRoutes = require('./routes/cartRoutes')
const orderRoutes = require('./routes/orderRoutes')
const app = express()

// Using this middleware to parse req.body in json format
app.use(express.json())

// setting views and view engine

// Setting view engine tp ejs files
app.set("view engine", "ejs")
// setting path for ejs files
app.set("views", path.join("./Frontend/views"))
// Setting path to render css
app.use(express.static(path.join(__dirname)));

const port = process.env.PORT || 8080

app.get('/',(req,res)=>{
  res.render('home')
})


// Using auth routes in our server files which take access from routes folder
app.use(authRoutes)
// Exposing protected End points
app.use(protectedRoutes)
// Exposing end points to add product in the product database,this can only be used the people with admin perms
app.use(addproduct)
// Exposing cart API
app.use(cartRoutes)
// Exposing apis required to place and track order
app.use(orderRoutes)

// Listening on port defined in .env files else on port 8080
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})