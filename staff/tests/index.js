const authentication = require('./authentication.test')
const authorization = require('./authorization.test')
const crud = require('./crud-ops.test')
const testStaffSetup = require('./test-staff-setup.test')


module.exports = {
    authentication,
    crud,
    testStaffSetup,
    authorization
}
