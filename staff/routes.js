const express = require('express')
const router = express.Router()
const Staff = require('./model')
const passport = require('passport')
const { requireJwt, register, signJwtForStaff, login } = require('../middleware/authentication')
const { accountOwner } = require('../middleware/authorisation')

// Staff Registration Route
router.post('/staffRegister', register)

// Logout Route
router.get('/staffLogout', (req, res) => {
    req.logout()
    res.status(200).send('Staff signed out successfully.')
})

// Login route
router.post('/staffLogin', login, signJwtForStaff)  

// Staff account update route
router.put('/:id', requireJwt, (req, res) => {
    console.log('MADE IT THROUGH AUTHORISATION', req.body)
    Staff.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true}).then(
        staff => res.status(200).json(staff)
    ).catch(
        error => res.status(500).json({
            error: error.message
        })
    )
})

module.exports = router