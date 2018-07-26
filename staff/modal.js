const mongoose = require('mongoose')
const Schema = mongoose.Schema

const passportLocalMongoose = require('passport-local-mongoose')


// Creates a new 'Staff' schema for the database
const Staff = new Schema({
    firstName: String,
    lastName: String,
    role: String,
    phoneNumber: String,
    company: Schema.Types.Mixed
})


// Plugs in the 'local' strategy for passport authentication in the database and conmfigures the username credential to be the Staff email
Staff.plugin(passportLocalMongoose, {usernameField: 'email'})

module.exports = mongoose.model('Staff', Staff)
