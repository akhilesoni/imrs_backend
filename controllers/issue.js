const { pool } = require("../db_config")


const getAllIssues = (req,res) => {
    const {filter} = req.body
    if(filter === 'admin'){
        pool.query('select * from issues',(err,data)=>{
            if(err){
                throw err
                return
            }
        
            return res.json({
                isValid:true,
                issues:data.rows
            })
        })
    }else{
        pool.query('select * from issues where clientid = $1',[filter],(err,data)=>{
            if(err){
                throw err
                return
            }
            return res.json({
                isValid:true,
                issues:data.rows
            })
            
        })
    }
}

const getDateTime = () => {
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return date+' '+time;
}


const raiseIssue = (req,res) => {
    const {issue} = req.body
    pool.query('insert into issues (message,invoiceid, date, resolved, clientid) values($1,$2,$3,$4, $5)',[issue.message,issue.invoiceid,getDateTime(),false, issue.clientid],(err,data)=>{
        if(err){
            throw err
        }
        return res.json({
            isValid:true
        })
    })
}

const deleteIssue = (req,res) => {
    const {id} = req.params 
    pool.query('delete from issues where id = $1',[id],(err,data) => {
        if(err){
            throw err
        }
        return res.json({
            isValid:true
        })
    })
}

const resolveIssue = (req,res) => {
    const {id} = req.body 
    pool.query('update issues set  resolved = $1 where id = $2',[true,id],(err,data) => {
        if(err){
            throw err
        }
        
        res.json({
            isValid:true
        })
    })
}

module.exports = {
    getAllIssues,
    raiseIssue,
    deleteIssue,
    getDateTime,
    resolveIssue
}