
const crud = (chai, server, should) => {



    describe('\n Staff CRUD ops', function () {

        
        describe('- POST /staff/staff ', function () {
            it('should CREATE a new staff account for a company on POST IF staff is admin or owns company. Staff should have a default role of "staff" ');
        })

        describe('- GET /staff/profile ', function () {
            it('should list staff profile page IF staff is signed in and owns the account.');
        })

        describe('- GET /staff/staff ', function () {
            it('should list all members of a company IF staff is admin or owns company.');
        })

        describe('- PUT /staff/:id ', function () {
            it('should UPDATE the staff account on IF staff is signed in and owns the account.');
        })

        describe('- DELETE /staff/:id ', function () {
            it('should delete staff account on IF staff owns the account or is ADMIN.');
        })

    });
}


module.exports = crud
