import express from "express"
import {config} from 'dotenv'

config()

const fallDownPort = 3000
const app = express()
app.listen(process.env.PORT || fallDownPort, () => {
    console.log(`Listening on port ${process.env.PORT || fallDownPort}`)
})