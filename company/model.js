const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Creates the schema for the "Company" database object
const Company = new Schema({
   name: String,
   abn: String,
   companyType: String,
   address: Schema.Types.Mixed,
   phoneNumber: String,
   accountType: String,
   supplierListID: String,
   customerListID: String,
   companyOwnerId: String,
   deliveryDays: Schema.Types.Mixed
})

module.exports = mongoose.model('Company', Company)
