import express from 'express'
import { disconnectDb } from './db.js'
import configure from './app.js'

const port = process.env.PORT || 3000
const app = express()

configure(app)

const server = app.listen(port, () => {
    console.log('Server listening on port ' + port)
})

server.on('close',() => {
    console.log('Closing mongo connection')
    disconnectDb()
})
