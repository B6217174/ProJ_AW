const expressFunction = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const router = expressFunction.Router();

const key = 'MY_KEY';

var Schema = require("mongoose").Schema;

const userSchema = Schema({
    username: String,
    password: String,
},{
    collection: 'users'
})

let User
try {
    User = mongoose.model('users')
} catch(err) {
    User = mongoose.model('users', userSchema);
}

const makeHash = async(plainText) => {
    const result = await bcrypt.hash(plainText, 10);
    return result;
}

const compareHash = async(plainText, hashText) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(plainText, hashText, (err, data)=>{
            if(err){
                reject(new Error('Error bcrypt compare'))
            }else{
                resolve({status: data});
            }
        })
    });
}

const findUser = (username) =>{
    return new Promise((resolve, reject) =>{
        User.findOne({username: username}, (err, data)=>{
            if(err){
                reject(new Error('Cannot find username!'));
            }else{
                if(data){
                    resolve({id: data._id, username: data.username, password: data.password})
                    console.log(data.password);
                }else{
                    reject(new Error('Cannot find username!'));
                }
            }
        })
    })
}

router.route('/signin')
.post( async (req, res)=>{
    const playload = {
        username: req.body.username,
        password: req.body.password
    };

    console.log(playload);

    try {
        const result = await findUser(playload.username);
        const loginStatus =await compareHash(playload.password, result.password);
        
        const status = loginStatus.status;
        console.log(status);
        
        if(status){
            const token = jwt.sign(result, key, {expiresIn: 60*5});
            res.status(200).json({result, token, status});
            console.log(token)
        }else{
            res.status(200).json({status});
        }
    }catch (error){
        res.status(404).send(error)
    }
})


router.route('/resetPassword').put( (req,res)=>{

    var query = {"_id":req.body._id};
    makeHash(req.body.password)
    .then(hashText => {
        const playload = {
            password: hashText,
        }
        User.findByIdAndUpdate(query, playload, {new: true}, function(err, doc) {
            if (err) return res.send(500, {error: err});
            return res.send('Succesfully saved.');
        });
        //console.log(playload);  
    })
    .catch( err => {

    })
    
})


const deleteProduct = (productID) =>{
    return new Promise ((resolve, reject) => {
        
        User.deleteOne({_id:productID}, (err, data)=>{

            if(err){
                reject(new Error('Cannot delete products!'));
            }else{
                if(data){
                    resolve(data)
                }else{
                    reject(new Error('Cannot delete products!'))
                }
            }
        }
        );
    });
}



router.route('/deleteUser/:id').delete((req,res)=>{
    console.log("express delete bool");
    //console.log("backend",req.body);
    console.log("นี้ นี้",req.params.id);
    deleteProduct(req.params.id).then( result => {
        console.log(result);
        res.status(200).json(result);
    })
    .catch( err => {
        console.log(err);
    })
})


const getUser = ()=> {
    return new Promise (
        (resolve, reject)=>{
            User.find({}, (err, data)=> {if(err){
                reject(new Error('Cannot get User!'));
            }else{
                if(data){
                    resolve(data)
                }else{
                    reject(new Error('Cannot get User!'))
                }
            }})
        }
    );
}

router.route('/getUser').get((req,res)=>{
    console.log('get');
    getUser().then( result => {
        //console.log(result);
        res.status(200).json(result);
    })
    .catch( err => {
        console.log(err);
    })
})

module.exports = router