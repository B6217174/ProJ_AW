const expressFunction = require('express');
const mongoose = require('mongoose');
var expressApp = expressFunction();

const router = expressFunction.Router();
var Schema = require('mongoose').Schema;

const saleshistorySchema = Schema({
    userID:String,
    list: [
        {idIcream: String,quantity:Number,
        name: String,
        price: Number,
        detail: String,
        image: String}
    ]
},{
    collection: 'saleshistory'
})

let SalesHistory
try {
    SalesHistory = mongoose.model('saleshistory')
} catch(err) {
    SalesHistory = mongoose.model('saleshistory', saleshistorySchema);
}

const orderSchema = Schema({
    user: mongoose.ObjectId,
    product: [
        
    ]
}, {
    collection: 'order'
});

let Order
try {
    Order = mongoose.model('order')
}catch(error){
    Order = mongoose.model('order',orderSchema);
}

const addSalesHistory = (productData) =>{
    return new Promise ((resolve, reject) => {
        var new_product = new SalesHistory(
             productData
        );
        
        let listSH = productData.list.map((element)=>{
            return {item:element.idIcream, quantity:element.quantity, 
                name: element.name,
                price: element.price,
                detail: element.detail,
                image: element.image
            }
        })
        
        
        console.log(listSH);
        Order.updateOne(
            { user:productData.userID, product:listSH },
            { $unset: { product : listSH }},()=>{

            }
        )

        new_product.save(
            (err, data)=>{
                if(err){
                    reject(new Error('Cannot insert saleshistory to DB'));
                }else{

                    resolve({message: 'Saleshistory added successfully'});
                }
            }
        );
    });
}


const getSalesHistory = ()=> {
    return new Promise (
        (resolve, reject)=>{
            SalesHistory.find({}, (err, data)=> {if(err){
                reject(new Error('Cannot get SalesHistory!'));
            }else{
                if(data){
                    resolve(data)
                }else{
                    reject(new Error('Cannot get SalesHistory!'))
                }
            }})
        }
    );
}

const deleteSalesHistory = (productID) =>{
    return new Promise ((resolve, reject) => {
        var new_product = new SalesHistory(
             productID
        );
        new_product.deleteOne(productID, (err, data)=>{

            if(err){
                reject(new Error('Cannot delete SalesHistory!'));
            }else{
                if(data){
                    resolve(data)
                }else{
                    reject(new Error('Cannot delete SalesHistory!'))
                }
            }
        }
        );
    });
}


router.route('/add').post((req, res)=>{
    console.log('add SalesHistory');
    // console.log(req.body);
    addSalesHistory(req.body)
    .then(result => {
        console.log(result);
        res.status(200).json(result);
    })
    .catch( err => {
        console.log(err);
        res.status(400).json(err);
    })
})


router.route('/get').get((req,res)=>{
    console.log('get');
    getSalesHistory().then( result => {
        //console.log(result);
        res.status(200).json(result);
    })
    .catch( err => {
        console.log(err);
    })
})

router.route('/delete').post((req,res)=>{
    console.log("express delete SalesHistory");
    console.log(req.body._id);

    deleteSalesHistory({_id:req.body._id}).then( result => {
        console.log(result);
        res.status(200).json(result);
    })
    .catch( err => {
        console.log(err);
    })
})


router.route('/update').put( (req,res)=>{

    var query = {"_id":req.body._id};

    SalesHistory.findByIdAndUpdate(query, {send:true}, {new: true}, function(err, doc) {
            if (err) return res.status(400).json({msg:err});
            return res.status(200).json({msg:doc});
        });

})

module.exports = router