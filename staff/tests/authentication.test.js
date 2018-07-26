const jwtDecode = require('jwt-decode')


const authentication = (chai, server, should) => {

    
    

    describe('\nAccount creation and authorization', function () {

        describe('- POST /staff/register', function() {
            it('REGISTRATION UNSUCCESSFUL - should reject account creation and show error message on /staff/register POST IF email DOES already exist.');


            it('REGISTRATION SUCCESSFUL - should create a new staff account and log them in on /staff/register POST IF email DOESNT already exist.', function(done) {
                this.timeout(15000)
                chai.request(server)
                    .post('/staff/register')
                    .send({
                        email: 'test@email.com',
                        password: 'password',
                        role: 'purchaser'
                    })
                    .end((err, res) => {
                        
                        
                        should.equal(err, null)
                        res.should.have.status(200)

                        res.body.should.have.property('token')
                        const tokenDetails = jwtDecode(res.body.token)
                        
                        tokenDetails.should.have.property('email')
                        tokenDetails.email.should.equal('test@email.com')

                        tokenDetails.should.have.property('role')
                        // tokenDetails.role.should.equal('owner-admin')

                        done()
                    })
            });
        })

        describe('- GET /staff/logout', function () {
            it('should sign the staff out and destroy their JWT session /staff/logout GET.', function (done) {
                chai.request(server)
                    .get('/staff/logout')
                    .end((err, res) => {
                        should.equal(err, null)
                        res.should.have.status(200)
                        res.text.should.equal('Staff signed out successfully.')
                        done()
                    })
            });
        })
        
        describe('- POST /staff/login', function () {
            it('should show error message and send 401 status on /staff/login POST IF credentials are WRONG.', function(done) {
                this.timeout(15000)
                chai.request(server)
                    .post('/staff/login')
                    .send({
                        email: 'test@email.com',
                        password: 'wrongpassword'
                    })
                    .end((err, res) => {
                        res.text.should.equal('Unauthorized')
                        res.body.should.not.have.property('token')
                        res.should.have.status(401)

                        done()
                    })
            });

            it('should sign staff in to their account on /staff/login POST IF credentials are CORRECT.', function(done) {
                this.timeout(15000)
                chai.request(server)
                    .post('/staff/login')
                    .send({
                        email: 'test@email.com',
                        password: 'password'
                    })
                    .end((err, res) => {
                        should.equal(err, null)
                        res.should.have.status(200)

                        res.body.should.have.property('token')
                        const tokenDetails = jwtDecode(res.body.token)

                        tokenDetails.should.have.property('email')
                        tokenDetails.email.should.equal('test@email.com')

                        tokenDetails.should.have.property('role')
                        done()
                    })
            });
        })
        

        
    });
}


module.exports = authentication