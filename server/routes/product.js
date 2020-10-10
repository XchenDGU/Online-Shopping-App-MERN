const express = require('express');
const router = express.Router();
const multer = require('multer');
const { auth } = require("../middleware/auth");
const path = require('path');
const {Product} = require('../models/Product');
const { stat } = require('fs');

var storage = multer.diskStorage({
    //Where do we want to save it
    destination:(req,file,cb)=>{
        cb(null,'uploads/');
    },

    //To name the file
    filename:(req,file,cb)=>{
        cb(null,`${Date.now()}_${file.originalname}`)
    },

    //Only take file ext that is either .jpg or .png
    fileFilter:(req,file,cb)=>{
        const ext = path.extname(file.originalname);
        if(ext !== '.jpg' || ext !== '.png'){
            return cb(res.status(400).end('only jpg, png are allowed'),false);
        }
        cb(null,true);
    }
})

var upload = multer({storage:storage}).single("file");

router.post("/uploadImage", auth, (req, res) => {
    //after getting theat image from client
    //we need to save it inside Node Server

    //Multer library
    upload(req,res,err=>{
        if(err) return res.json({success:false,err})
        return res.json({
            success: true,
            image: res.req.file.path,
            filename:res.req.file.fieldname
        })
    })
});


router.post("/uploadProduct", auth, (req, res) => {
    //save all the data we got from the client into the DB

    const newProduct = new Product(req.body);
    newProduct.save((err)=>{
        if(err) return res.status(400).json({success:false,err});
        return res.status(200).json({success:true})
        
    })

});

router.get("/getProducts", (req, res) => {
    let order = req.query.order ? req.query.order:"desc";
    let sortBy = req.query.sortBy ? req.query.sortBy:"_id";
    let limit = req.query.limit ? parseInt(req.query.limit):8;
    let skip = parseInt(req.query.skip);
    let term = req.query.searchTerm ? req.query.searchTerm:'';

    //convert filter string to json object
    let filters = req.query.filters ? JSON.parse(req.query.filters):{};
    
    let findArgs = {};
    
    for(let key in filters){
        if(filters[key].length>0){
            if(key === "price"){
                findArgs[key] = {
                    $gte:filters[key][0],
                    $lte:filters[key][1],    
                }

            }else{
                findArgs[key] = filters[key]//(filters[key].map(x=>parseInt(x)))
            }
        }
    }
    //console.log(filters);
    //console.log(findArgs);

    if(term){
        Product.find(findArgs)
        .find({$text:{$search:term}})
        .populate("writer")
        .sort([[sortBy,order]])
        .skip(skip)
        .limit(limit)
        .exec((err,products)=>{
            if(err) return res.status(400).json({success:false,err})
            res.status(200).json({success:true,products,postSize:products.length})
        })
    }else{
        Product.find(findArgs)
        .populate("writer")
        .sort([[sortBy,order]])
        .skip(skip)
        .limit(limit)
        .exec((err,products)=>{
            if(err) return res.status(400).json({success:false,err})
            res.status(200).json({success:true,products,postSize:products.length})
        })
    }
    

});

// Desc: get product detail
// Route: api/product/product_by_id
// param: id & type
router.get("/product_by_id",(req, res) => {
    let type =req.query.type;
    let productIds = req.query.id;
    
    if(type === 'array'){
        productIds = req.query.id.split(',');
        Product.find({'_id':{$in:productIds}})
        .populate('writer')
        .exec( (err,product)=>{
            if(err) return res.status(400).send(err)
            
            return res.status(200).send(product);
        })
    }else{
        Product.findOneAndUpdate(
            {'_id':{$in:productIds}},
            {$inc:{'views':1}},
            {new:true},
            (err,updatedData)=>{
                if(err) return res.status(400).send(err);
                return res.status(200).send([updatedData]);
            }
        )
    }

    
  
});
module.exports = router;