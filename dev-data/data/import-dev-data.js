const fs = require('fs')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Tour = require('./../../models/tourModel')
dotenv.config({ path: './config.env' })


const DB = process.env.DATABASE_URI.replace('<password>', process.env.DATABASE_PASSWORD)

// console.log(process.env)
mongoose.connect(DB)
    .then(() => console.log("Connection to database is successfull...."))

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'))

const importData = async () => {
    try {
        await Tour.create(tours)
        console.log('Data Succesfully loaded!')
        process.exit()
    } catch (error) {
        console.log(error)
    }
}
if (process.argv[2] === '--import') {
    importData()
}
console.log(process.argv)