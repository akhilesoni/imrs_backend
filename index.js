const express = require('express');
const app = express();

//dotenv
require('dotenv').config()

//router
const routes = require('./routes')

//dependencies
const bodyParser = require('body-parser')
const cors = require('cors')
app.use(express.urlencoded({limit:'50mb',extended:true}))
app.use(express.json({limit:'50mb'}))
//app.use(bodyParser.json()); 
//app.use(bodyParser.urlencoded({ extended: true })); 

//cors
app.use(cors())


//routes
app.use(routes)


const port = process.env.PORT || 8000
app.listen(port,()=>{
    console.log('server is up running ;)')
})