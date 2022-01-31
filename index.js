const express = require('express');
const app = express();
const cors = require('cors')

require('dotenv').config()

const routes = require('./routes')
const bodyParser = require('body-parser')

app.use(express.urlencoded({limit:'50mb',extended:true}))
app.use(express.json({limit:'50mb'}))

app.use(cors())

app.use(routes)

const port = process.env.PORT || 8000
app.listen(port,()=>{
    console.log('server is up running ;)')
})