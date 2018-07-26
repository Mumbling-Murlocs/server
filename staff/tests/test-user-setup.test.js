const setJwt = require('jwt-decode')



const testStaffSetup = (chai, server, should) => {

    let adminToken = null
    let adminDetails = null
    let adminCo = null
    
    let supplierToken = null
    let supplierDetails = null
    let supplierCo = null
    
    
    let purchaserToken = null
    let purchaserDetails = null
    let purchaserCo = null

    
    

    describe('\n Creating test accounts', function() {

        
        // Sets up a test "Admin" account
        it('Admin Account created', function (done) {
            this.timeout(15000)
            chai.request(server)
                .post('/staff/register')
                .send({
                    email: 'admin@test.com',
                    password: 'password',
                    role: 'admin'
                })
                .end((err, res) => {
    
                    should.equal(err, null)
                    res.should.have.status(200)
                    

                    adminToken = res.body.token
                    adminDetails = setJwt(adminToken)
    
                    done()
                })
            })

        // Creates a company for the "admin" test staff
        it('Admin Company created', function (done) {
            this.timeout(15000)
            chai.request(server)
                .post('/company')
                .set('Authorization', `Bearer ${adminToken}`)
                .set('CurrentStaff', adminDetails)  
                .send({
                    name: 'Admin-Test-Company',
                    abn: 'fakeAbn',
                    businessType: 'Admin',
                    address: 'Blah',
                    phoneNumber: '113346178',
                    accountType: 'supplier',
                    companyOwnerId: adminDetails.sub,
                    deliveryDays: {monday:{cutoffTime: '22'}}
                })
                .end((err, res) => {

                    should.equal(err, null)
                    res.should.have.status(200)
                    adminCo = res.body
                    done()
                })
            })

        // This places the company object in the "admin" staff.company element for easy reference
        it('Company assigned to Admin account', function (done) {
            this.timeout(15000)
            chai.request(server)
                .put(`/staff/${adminDetails.sub}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .set('CurrentStaff', adminDetails)  
                .send({
                    company: adminCo
                })
                .end((err, res) => {
    
                    should.equal(err, null)
                    res.should.have.status(200)
                    res.body.company.should.be.a('object')


                    done()
                })
            })
    
    
            
        // Sets up a test "Purchaser" account
        it('Purchaser Account creation', function (done) {
            this.timeout(15000)
            chai.request(server)
                .post('/staff/register')
                .send({
                    email: 'purchaser@test.com',
                    password: 'password',
                    role: 'purchaser'
                })
                .end((err, res) => {
    
                    should.equal(err, null)
                    res.should.have.status(200)

                    purchaserToken = res.body.token
                    purchaserDetails = setJwt(res.body.token)
    
                    done()
                })
            })

        // Creates a company for the "purchaser" test staff
        it('Purchaser Company creation', function (done) {
            this.timeout(15000)
            chai.request(server)
                .post('/company')
                .set('Authorization', `Bearer ${purchaserToken}`)
                .set('CurrentStaff', purchaserDetails)  
                .send({
                    name: 'Purchaser-Test-Company',
                    abn: 'fakeAbn',
                    businessType: 'Purchaser',
                    address: 'Blah',
                    phoneNumber: '113346178',
                    accountType: 'supplier',
                    companyOwnerId: purchaserDetails.sub,
                    deliveryDays: {monday:{cutoffTime: '22'}}
                })
                .end((err, res) => {

                    should.equal(err, null)
                    res.should.have.status(200)

                    purchaserCo = res.body
                    done()
                })
            })

        // This places the company object in the "purchaser" staff.company element for easy reference
        it('Company assigned to Purchaser account', function (done) {

            this.timeout(15000)
            chai.request(server)
                .put(`/staff/${purchaserDetails.sub}`)
                .set('Authorization', `Bearer ${purchaserToken}`)
                .set('CurrentStaff', purchaserDetails) 
                .send({
                    company: purchaserCo
                })
                .end((err, res) => {

                    should.equal(err, null)
                    res.should.have.status(200)

                    res.body.company.should.be.a('object')

                    done()
                })
        })
    
    
        
    
        
        // Sets up a test "Supplier" account
        it('Supplier Account creation', function (done) {
            this.timeout(15000)
            chai.request(server)
                .post('/staff/register')
                .send({
                    email: 'supplier@test.com',
                    password: 'password',
                    role: 'supplier'
                })
                .end((err, res) => {
    
                    should.equal(err, null)
                    res.should.have.status(200)

                    supplierToken = res.body.token
                    supplierDetails = setJwt(res.body.token)
    
                    done()
                })
            })

        // Creates a company for the "supplier" test staff
        it('Supplier Company creation', function (done) {

            this.timeout(15000)
            chai.request(server)
                .post('/company')
                .set('Authorization', `Bearer ${supplierToken}`)
                .set('CurrentStaff', supplierDetails)  

                .send({
                    name: 'Supplier-Test-Company',
                    abn: 'fakeAbn',
                    businessType: 'Supplier',
                    address: 'Blah',
                    phoneNumber: '113346178',
                    accountType: 'supplier',
                    companyOwnerId: supplierDetails.sub,
                    deliveryDays: {monday:{cutoffTime: '22'}}
                })
                .end((err, res) => {

                    should.equal(err, null)
                    res.should.have.status(200)
                    supplierCo = res.body
                    done()
                })
            })

        // This places the company object in the staff.company element for easy reference
        it('Company assigned to Supplier account', function (done) {

            this.timeout(15000)
            chai.request(server)
                .put(`/staff/${supplierDetails.sub}`)
                .set('Authorization', `Bearer ${supplierToken}`)
                .set('CurrentStaff', supplierDetails)  

                .send({
                    company: supplierCo
                })
                .end((err, res) => {

                    should.equal(err, null)
                    res.should.have.status(200)
                    res.body.company.should.be.a('object')

                    done()
                })
        })
    })



    
}




module.exports = testStaffSetup
