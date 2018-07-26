const setJwt = require('jwt-decode')

let adminToken = null
let adminDetails = null

let supplierToken = null
let supplierDetails = null

let purchaserToken = null
let purchaserDetails = null


let testCompany = null

const authorization = (chai, server, should) => {

    describe('Setting Admin account', function () {
        it('Admin Login - Authorisation', function (done) {
            // ADMIN LOGIN
            this.timeout(15000)
            chai.request(server)
                .post('/staff/login')
                .send({
                    email: 'admin@test.com',
                    password: 'password'
                })
                .end((err, res) => {
                    res.should.have.status(200)
                    adminToken = res.body.token
                    adminDetails = setJwt(res.body.token)
                    done()
                })
        })
    })

    describe('Setting Supplier account', function () {

        it('Supplier Login - Authorisation', function (done) {
            // SUPPLIER LOGIN
            this.timeout(15000)
            chai.request(server)
                .post('/staff/login')
                .send({
                    email: 'supplier@test.com',
                    password: 'password'
                })
                .end((err, res) => {
                    res.should.have.status(200)
                    supplierToken = res.body.token
                    supplierDetails = setJwt(res.body.token)
                    done()
                })

        })
    })

    describe('Setting staff account', function () {
        it('Purchaser Login - Authorisation', function (done) {
            // PURCHASER LOGIN
            this.timeout(15000)
            chai.request(server)
                .post('/staff/login')
                .send({
                    email: 'purchaser@test.com',
                    password: 'password'
                })
                .end((err, res) => {
                    res.should.have.status(200)
                    purchaserToken = res.body.token
                    purchaserDetails = setJwt(res.body.token)
                    done()
                })

        })
    })

    describe('Setting Supplier Company', function () {
        it('Company setup - Authorisation', function (done) {
            // Assign company from supplier LOGIN
            chai.request(server)
                // console.log(supplierDetails)
                .get(`/company/${supplierDetails.company._id}`)
                .set('Authorization', `Bearer ${supplierToken}`)
                .set('staff', supplierDetails)

                .end((err, res) => {
                    res.should.have.status(200)
                    testCompany = res.body
                    done()
                })

        })

    })


    // STAFF SETUP

    
    describe('\nAuthorisation test for isOwner "ownership" of company', function() {

        it('Admin should be able to update any company they like', function(done) {
            chai.request(server)
                .put(`/company/${testCompany._id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .set('staff', adminDetails)

                .send({
                    companyOwnerId: testCompany.companyOwnerId,
                    name: 'Admin changed name'
                })

                .end((err, res) => {
                    should.equal(err, null)
                    res.should.have.status(200)

                    res.body.should.be.a('object')

                    res.body.should.have.property('_id')
                    res.body._id.should.equal(testCompany._id)

                    res.body.should.have.property('name')
                    res.body.name.should.equal('Admin changed name')


                    done()
                })
        })

        it('Staff should be able to update their own company', function(done) {
            chai.request(server)
                .put(`/company/${testCompany._id}`)

                .set('Authorization', `Bearer ${supplierToken}`)
                .set('staff', supplierDetails)
                .send({
                    companyOwnerId: testCompany.companyOwnerId,
                    name: 'Owner changed name'
                })

                .end((err, res) => {
                    should.equal(err, null)
                    res.should.have.status(200)

                    res.body.should.be.a('object')

                    res.body.should.have.property('_id')
                    res.body._id.should.equal(testCompany._id)

                    res.body.should.have.property('name')
                    res.body.name.should.equal('Owner changed name')


                    done()
                })
        })

        it("Staff CANNOT update company that is not their own", function(done) {
            chai.request(server)
                .put(`/company/${testCompany._id}`)

                .set('Authorization', `Bearer ${purchaserToken}`)
                .set('staff', purchaserDetails)

                .send({
                    companyOwnerId: testCompany.companyOwnerId,
                    name: 'Owner changed name'
                })

                .end((err, res) => {
                    should.equal(err, null)
                    res.should.have.status(403)

                    done()
                })
        })
    })

    describe('\nCRUD authorization test for products', function() {

        it('Admin should be able to create products.', function(done) {
            chai.request(server)
                .post('/products')
                .set('Authorization', `Bearer ${adminToken}`)
                .set('staff', adminDetails)
                .send({
                    companyId: adminDetails.company._id,
                    price: 4.50,
                    name: 'Flour',
                })
                .end((err, res) => {

                    should.equal(err, null)
                    res.should.have.status(200)

                    res.body.should.have.property('companyId')
                    res.body.companyId.should.equal(adminDetails.company._id)

                    res.body.should.have.property('name')
                    res.body.name.should.equal('Flour')
                    
                    done()
                })
        })

        it('Supplier should be able to create products.', function(done) {
            chai.request(server)
                .post('/products')
                .set('Authorization', `Bearer ${supplierToken}`)
                .set('staff', supplierDetails)
                .send({
                    companyId: supplierDetails.company._id,
                    price: 4.50,
                    name: 'Oats',
                })
                .end((err, res) => {

                    should.equal(err, null)
                    res.should.have.status(200)

                    res.body.should.have.property('companyId')
                    res.body.companyId.should.equal(supplierDetails.company._id)

                    res.body.should.have.property('name')
                    res.body.name.should.equal('Oats')

                    done()
                })
        })

        it('Purchaser should NOT be able to create products.', function(done) {
            chai.request(server)
                .post('/products')
                .set('Authorization', `Bearer ${purchaserToken}`)
                .set('staff', purchaserDetails)
                .send({
                    companyId: purchaserDetails.company._id,
                    price: 4.50,
                    name: 'Oats',
                })
                .end((err, res) => {

                    should.equal(err, null)
                    res.should.have.status(403)
                    done()
                })
        })
    })
}



module.exports = authorization
