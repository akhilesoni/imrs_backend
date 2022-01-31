const { cloudinary } = require('../cloudinary')
const {pool} = require('../db_config')

const createInvoice = async (req,res) => {
   try {
        const invoice = req.body.invoice
        const image = req.body.image
        const uploadResponse = await cloudinary.uploader.upload(image,{
            upload_preset:'ml_default'
        })

        
        pool.query('insert into invoices (invoiceId, clientId, clientName, amount, paidAmount, date, dueDate, approved, paymentStatus, paymentMethod, imageUrl, paymentId) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)',
        [invoice.invoiceId, invoice.clientId, invoice.clientName, invoice.amount, invoice.paidAmount, invoice.date, invoice.dueDate, invoice.approved, invoice.paymentStatus, invoice.paymentMethod, uploadResponse.url, invoice.paymentId],
        (err,data) => {
            if(err){
                throw err
            }
            res.json({
                isValid:true
            })
        })
   } catch (error) {
       console.error(error)
   }
}


const getAllInvoices = (req,res) => {
    pool.query('select * from invoices',(err,data)=>{
        if(err){
            throw err
        }
        res.json({
            isValid:true,
            invoices:data.rows
        })
    })
}

const deleteInvoice = (req,res) => {
    const {id} = req.params 
    pool.query('delete from invoices where id = $1',[id],(err,data) => {
        if(err){
            throw err
        }
        res.json({
            isValid:true
        })
    })
}

const getInvoice = (req,res) => {
    const {id} = req.params
    pool.query('select * from invoices where id = $1',[id],(err1,data1)=>{
        if(err1){
            throw err1
        }
        pool.query('select * from users where id = $1',[data1.rows[0].clientid],(err2,data2)=>{
            if(err2){
                throw err2
            }
            res.json({
                isValid:true,
                user:data2.rows[0],
                invoice:data1.rows[0]
            })
        })
    })
}

const approveInvoice = (req,res) => {
    const {id} = req.body
    pool.query('update invoices set approved = $1 where id = $2 ',[true,id],(err,data)=> {
        if(err){
            throw err
        }
        res.json({
            isValid:true
        })
    })
}





module.exports = {
    createInvoice,
    getAllInvoices,
    deleteInvoice,
    getInvoice,
    approveInvoice,
    
}