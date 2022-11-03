const expressFunction = require('express');
const mongoose = require('mongoose');
var expressApp = expressFunction();

const url = 'mongodb://localhost:27017/product';
const config ={
    autoIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology:true
};

expressApp.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin','http://localhost:4200')
    res.setHeader('Access-Control-Allow-Methods','POST, GET, PUT, PATCH, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers','Content-Type, Option, Authorization')
    return next()
});
expressApp.use(expressFunction.json());
expressApp.use((req,res,next) => {
    mongoose.connect(url,config)
    .then(() => {
        console.log('Connected to MongoDB');
        next();
    })
    .catch(err => {
        console.log('Cannot connect to MongoDB');
        res.status(501).send('Cannot connect to MongoDB')
    });
});
// **********--------------- path ------------------**********
// expressApp.use('/flavour', require('./routes/flavour'))
// expressApp.use('/topping', require('./routes/topping'))
// expressApp.use('/container', require('./routes/container'))
// expressApp.use('/sauce', require('./routes/sauce'))
expressApp.use('/set', require('./routes/icream'))
expressApp.use('/saleshistory', require('./routes/saleshistory.js'))
expressApp.use('/signin', require('./routes/signin'))

expressApp.listen(3000,function(){
    console.log('Listening on port 3000');
});