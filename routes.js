const express = require('express')
const router = express.Router()
const apiGateway = require('./controllers/api-gateway')
const auth = require('./controllers/auth')
const invoice = require('./controllers/invoice')
const withAuth = require('./middleware/auth')
const issue = require('./controllers/issue')
const reconciliation = require('./controllers/reconciliation')
const dashboard = require('./controllers/dashboard')


//test routes
router.get('/', apiGateway.index)
//dashoboard routes 
router.post('/overview_admin',dashboard.getOverviewAdmin)

//users routes
router.post('/login', auth.login)
router.post('/authUser',withAuth, auth.getUser)
router.post('/users',withAuth, auth.getAllUsers)
router.post('/customers',withAuth, auth.getCustomers)
router.post('/admins',withAuth, auth.getAdmins)
router.post('/addUser',withAuth, auth.createUser)
router.post('/users/:id',withAuth, auth.getUserById)
//invoice routes
router.post('/addInvoice',withAuth, invoice.createInvoice)
router.post('/invoices',withAuth, invoice.getAllInvoices)
router.delete('/invoice/:id',withAuth, invoice.deleteInvoice)
router.post('/invoice/:id',withAuth, invoice.getInvoice)
router.post('/approve',withAuth, invoice.approveInvoice)

//issue routes
router.post('/raiseissue', withAuth, issue.raiseIssue)
router.post('/issues',withAuth, issue.getAllIssues)
router.post('/resolve_issue',withAuth, issue.resolveIssue)
router.delete('/issue/:id', withAuth, issue.deleteIssue)

//reconciliation routes
router.post('/requestreconciliation', withAuth, reconciliation.createReconciliation)
router.post('/requests', withAuth, reconciliation.getAllRequests)
router.delete('/request',withAuth,reconciliation.deleteRequest)
router.post('/accept_request',withAuth, reconciliation.acceptRequest)
//token routes
router.post('/checkToken', withAuth,(req,res)=>{
    res.sendStatus(200)
})
//developer use only
router.get('/generate_password', auth.generatePassword)

module.exports = router