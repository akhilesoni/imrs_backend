const {pool} = require('../db_config')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const secret = process.env.SECRET_KEY

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds)

//developer use only
const generatePassword = (req,res) =>{
    console.log(bcrypt.hashSync('abcd1234@',salt));
}



const login = (req,res)=>{
    const {email,password} = req.body.user
    pool.query('select * from users where email=$1',[email],(err,re)=>{
        if(err){
            console.error(err.stack)
        }
        
        if(re.rowCount==0){
            res.json({
                isFound:false,
                isCorrect:false
            })
        }
        else{
            const user = re.rows[0]
            if(bcrypt.compareSync(password,user.password)){
                const payload = { email };
                jwt.sign(payload, secret, {
                expiresIn: '1h'
                },(err,token)=>{
                    if(err){
                        throw err
                    }
                    res.status(200).json({
                        isFound:true,
                        isCorrect:true,
                        user:user,
                        token:token
                    })
                });
                
            }  
            else{
                res.json({ 
                    isFound:true,
                    isCorrect:false
                })
            }
        }
        
    })
}

const getUser = (req,res) => {
    const email = req.body.email
    pool.query('select * from users where email = $1',[email],(err,data) => {
        if(err){
            throw err
        }
        res.json({
            isValid:true,
            user:data.rows[0]
        })
    })
}

const getUserById = (req,res) => {
    const {id} = req.params
    pool.query('select * from users where id = $1',[id],(err,data) => {
        if(err){
            throw err
        }
        res.json({
            isValid:true,
            user:data.rows[0]
        })
    })
}

const getAllUsers = (req,res) => {
    pool.query('select * from users ',(err,data)=>{
        if(err){
            throw err
        }
        res.json({
            isValid:true,
            users:data.rows
        })
    })
}
const getCustomers = (req,res) => {
    pool.query('select * from users where usertype = client',(err,data)=>{
        if(err){
            throw err
        }
        res.json({
            isValid:true,
            users:data.rows
        })
    })
}

const getAdmins = (req,res) => {
    pool.query('select * from users ',(err,data)=>{
        if(err){
            throw err
        }
        res.json({
            isValid:true,
            users:data.rows
        })
    })
}


const createUser = (req,res) => {
    const user = req.body.user
    const password = bcrypt.hashSync(user.password,salt)
    pool.query('insert into users (name, email, phone, company, address, usertype, status, password) values ($1,$2,$3,$4,$5,$6,$7,$8)',
    [
        user.name,
        user.email,
        user.phone,
        user.company,
        user.address,
        user.usertype,
        'online',
        password
    ],
    (err,data)=>{
        if(err){
            throw err
        }
        res.json({
            isValid:true,
            users:data.rows
        })
    })
}


module.exports = {
    login,
    generatePassword,
    getUser,
    getAllUsers,
    createUser,
    getAdmins,
    getCustomers,
    getUserById
}