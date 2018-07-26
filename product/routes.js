const express = require('express')
const Product = require('./model')
const router = express.Router()
const { isPurchaser, isOwner, belongsToCompany } = require('../middleware/authorisation')
const { requireJwt } = require('../middleware/authentication')
// Setting up CRUD routes for Products

// CREATE a Product
router.post('/', requireJwt, isPurchaser, (req, res) => {
    Product.create(req.body).then(
        (product) => res.status(200).json(product)
    ).catch(
        error => res.status(500).json({
            error: error.message
        })
    )
})

// READ all Products
router.get('/', requireJwt, (req, res) => {
    console.log(req.headers.supplier_id)
    Product.find().then(
        products => {
            const filteredOrders = products.filter(product => req.headers.supplier_id == product.companyId)
            res.status(200).json(filteredOrders)
        }
    ).catch(
        error => res.status(500).json({
            error: error.message
        })
    )
})

// UPDATE a Product
router.put('/:id', requireJwt, belongsToCompany, (req, res) => {
    Product.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }).then(
        product => res.status(200).json(product)
    ).catch(
        error => res.status(500).json({
            error: error.message
        })
    )
})

// DESTROY a Product
router.delete('/:id', requireJwt, belongsToCompany, (req, res) => {
    Product.findByIdAndRemove(req.params.id).then(
        () => res.sendStatus(204)
    ).catch(
        error => res.status(500).json({
            error: error.message
        })
    )
})

module.exports = router