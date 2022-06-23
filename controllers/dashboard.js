const {pool} = require('../db_config')

const getOverviewAdmin = (req,res) => {
    pool.query('select * from invoices',(err,data) => {
        if(err){
            throw err
        }
        pool.query('select * from invoices where id = (select max(id) from invoices)',(err1,data1) => {
            if(err1){
                throw err1
            }
            res.json({
                isValid:true,
                chartData:data.rows,
                invoice:data1.rows[0]
            })
        })
    })
}

module.exports = {
    getOverviewAdmin
}