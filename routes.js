const express = require('express')
const router = express.Router()
const apiGateway = require('./controllers/api-gateway')

router.get('/',apiGateway.index)


module.exports = router