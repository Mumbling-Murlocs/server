const User = require('../user/model.js')

const isAdmin = (user) => {
    if (user.role === "admin") {
        return true
    } 
}

const isOwner = (req, res, next) => {
    const {user, params} = req
    const {company} = req.user
    
    if (isAdmin(user) || user._id == req.body.companyOwnerId ) {
        next ()
    } else {
        res.sendStatus(403)
    }
}

const accountOwner = (req, res, next) => {
    const { user, params } = req
    const { company } = req.user

    if (isAdmin(user) || user._id == req.params.id) {
        next()
    } else {
        res.sendStatus(403)
    }
}


const belongsToCompany = (req, res, next) => {
    const {user, body} = req
  
    if (isAdmin(user) || user.company._id == body.ownerId) {
        next()
    } else {
        res.sendStatus(403)
    }
}
const belongsToPurchaserOrSupplier = (req, res, next) => {
    const {user, body} = req
  
    if (isAdmin(user) || user.company._id == body.supplierId || body.companyId) {
        next()
    } else {
        res.sendStatus(403)
    }
}

const isPurchaser = (req, res, next) => {
    const {role} = req.user
    if (role === "purchaser") {
        res.sendStatus(403)
    } else {
        next()        
    }

}

module.exports = {
    isAdmin, 
    isOwner,
    isPurchaser,
    belongsToCompany,
    belongsToPurchaserOrSupplier,
    accountOwner
}