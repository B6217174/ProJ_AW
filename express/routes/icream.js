const expressFunction = require('express');
const mongoose = require('mongoose');
var expressApp = expressFunction();

const router = expressFunction.Router();
var Schema = require('mongoose').Schema;


const icreamSchema = Schema({
    flavour_id: String,
    name: String,
    price: Number,
    detail: String,
    image: String
},{
    collection: 'icream'
})

let Icream
try {
    Icream = mongoose.model('icream')
} catch(err) {
    Icream = mongoose.model('icream', icreamSchema);
}

exports.Icream;

const addIcream = (productData) =>{
    return new Promise ((resolve, reject) => {
        var new_product = new Icream(
             productData
        );
        new_product.save(
            (err, data)=>{
                if(err){
                    reject(new Error('Cannot insert ice cream to DB'));
                }else{
                    resolve({message: 'Ice cream added successfully'});
                }
            }
        );
    });
}

const getIcream = ()=> {
    return new Promise (
        (resolve, reject)=>{
            Icream.find({}, (err, data)=> {if(err){
                reject(new Error('Cannot get Ice cream!'));
            }else{
                if(data){
                    resolve(data)
                }else{
                    reject(new Error('Cannot get Ice cream!'))
                }
            }})
        }
    );
}

router.route('/add')
    .post((req, res)=>{
        console.log('add');
        addIcream(req.body)
        .then(result => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch( err => {
            console.log(err);
        })
})


// router.route('/update')
//     .put( (req,res)=>{
//         var query = {"name":req.body.name};
//             Set.findByIdAndUpdate(query, {"quantity":req.body.quantity}, {new: true}, function(err, doc) {
//                 if (err) return res.send(500, {error: err});
//                 return res.send('Succesfully saved.');
//             });

// })

router.route('/get').get((req,res)=>{
    console.log('get');
    getIcream().then( result => {
        //console.log(result);
        res.status(200).json(result);
    })
    .catch( err => {
        console.log(err);
    })
})

router.route('/getIcream/:id').get(async (req,res)=>{
    try {
        console.log("get Ice cream By ID working");
        const result = await Icream.findOne({"_id":req.params.id})
        // console.log(result);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json(error);
    }
})

const deleteSet = (productID) =>{
    return new Promise ((resolve, reject) => {
        
        Set.deleteOne({_id:productID}, (err, data)=>{

            if(err){
                reject(new Error('Cannot delete Set!'));
            }else{
                if(data){
                    resolve(data)
                }else{
                    reject(new Error('Cannot delete Set!'))
                }
            }
        }
        );
    });
}



router.route('/delete/:id')
    .delete((req,res)=>{
        console.log("express delete set");
        //console.log("backend",req.body);
        console.log(req.params.id);
        deleteSet(req.params.id).then( result => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch( err => {
            console.log(err);
        })
})



// const updateProduct = (productID) =>{
//     var new_product = new Book;
//     console.log('updateProduct by express working!!!');
//         var query = {"_id":productID.body._id};

//         Book.findByIdAndUpdate(query, {"quantity":productID.body.quantity}, {new: true}, function(err, doc) {
//             if (err) return res.send(500, {error: err});
//             return res.send('Succesfully saved.');
//         });
//     }

//     const deleteProduct2 = (productID) =>{
//         return new Promise ((resolve, reject) => {
            
//         });
//     }
router.route('/updateQuantityIcream').put( (req,res)=>{

    var query = {"_id":req.body._id};

        Book.findByIdAndUpdate(query, {"quantity":req.body.quantity}, {new: true}, function(err, doc) {
            if (err) return res.send(500, {error: err});
            return res.send('Succesfully saved.');
        });

})

module.exports = router