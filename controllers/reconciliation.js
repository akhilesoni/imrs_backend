const { pool } = require("../db_config")
const { getDateTime } = require("./issue")

const createReconciliation = (req,res) => {
    const {reconciliation} = req.body
    pool.query('insert into reconciliation (clientid,invoiceid, date, amount, paymentid, paymentmethod,accepted) values($1,$2,$3,$4, $5,$6,$7)',
        [reconciliation.clientid,reconciliation.invoiceid,getDateTime(),reconciliation.amount, reconciliation.paymentid, reconciliation.paymentmethod,false],(err,data)=>{
        if(err){
            throw err
        }
        return res.json({
            isValid:true
        })
    })

}

const getAllRequests = (req, res) => {

    const { filter } = req.body
    if(filter === "admin"){
        pool.query('select * from reconciliation',(err,data) => {
            if(err){
                throw err
            }
            return res.json({
                isValid:true,
                requests:data.rows
            })
        })
    }else{
        pool.query('select * from reconciliation where clientid = $1 ',[filter],(err,data) => {
            if(err){
                throw err
            }
            return res.json({
                isValid:true,
                requests:data.rows
            })
        })
    }

  
}

const deleteRequest = (req,res) => {
    const { id } = req.body
    pool.query('delete from reconciliation where id = $1 ',[id], (err,data)=>{
        if(err){
            throw err
        }
        return res.json({
            isValid:true
        })
    })

}


const acceptRequest = (req,res) => {
    const { request } = req.body
    pool.query('select * from invoices where id = $1',[request.invoiceid], (err,data)=>{
        if(err){
            throw err
        }
        const invoice = data.rows[0]
        var newAmount = parseInt(invoice.paidamount) + parseInt(request.amount)
        var newStatus = 'unpaid'
        if(parseInt(invoice.amount) <= parseInt(newAmount)){
            newStatus = 'paid'
        }else{
            newStatus = 'partial'
        }
        pool.query('update invoices set paidamount = $1 , paymentstatus = $2, paymentmethod = $3, paymentid = $4 where id = $5 ',[newAmount,newStatus,request.paymentmethod,request.paymentid,invoice.id],(err1,data1)=>{
            if(err1){
                throw err1
            }
            pool.query('update reconciliation set accepted = $1  where id = $2',[true,request.id],(err2,data2)=>{
                if(err2){
                    throw err2
                }
                res.json({
                    isValid:true
                })
            })
        })
    } )
}
module.exports = {
    createReconciliation,
    getAllRequests,
    deleteRequest,
    acceptRequest
}