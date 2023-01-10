const express = require('express')
const mongoose = require('mongoose')
mongoose.set('strictQuery', true)
const multer = require('multer')
const route = require('./routes/route.js')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(multer({dest:'./uploads/'}).single('file'))

mongoose.connect('mongodb+srv://ajit07:zsSSEqn97gvLXrGS@cluster0.d3veclf.mongodb.net/Assignment-sfi').then(() => {
    console.log(`DB connected successfully..`)
}).catch((error) => {
    console.log(error)
})

app.use('/', route)

app.use((req, res) => res.status(400).send({ status: false, message: `Invalid URL` }))

app.listen(3000, () => {
    console.log(`Express server running on port 3000`)
})
