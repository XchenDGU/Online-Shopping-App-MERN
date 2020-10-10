const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const {Product} = require('../models/Product');
const { auth } = require("../middleware/auth");
const {Payment} = require('../models/Payment');
const async = require('async');

//=================================
//             User
//=================================

router.get("/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,
        cart:req.user.cart,
        history:req.user.history
    });
});

router.post("/register", (req, res) => {

    const user = new User(req.body);

    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });
});

router.post("/login", (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "Wrong password" });

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie("w_authExp", user.tokenExp);
                res
                    .cookie("w_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true, userId: user._id
                    });
            });
        });
    });
});

router.get("/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });
});

router.get("/addToCart",auth,(req,res)=>{

    User.findById(req.user._id,(err,userInfo)=>{
        if(err) return res.json({success:false,err});

        let duplicate = false;
        //console.log(userInfo)
        userInfo.cart.forEach((cartInfo)=>{
            if(cartInfo.id === req.query.productId){
                duplicate = true;
            }
        })

        if(duplicate){
            User.findOneAndUpdate(
                {_id:req.user._id,"cart.id":req.query.productId},
                {$inc:{"cart.$.quantity":1}},
                {new:true},
                (error,updatedInfo)=>{
                    if(error) return res.json({success:false,error})
                    return res.status(200).json(updatedInfo.cart)
                }
            )
        }else{
            User.findOneAndUpdate(
                {_id:req.user._id},
                {
                    $push:{
                        cart:{
                            id:req.query.productId,
                            quantity:1,
                            date:Date.now()
                        }
                    }
                },
                {new:true},
                (error,updatedInfo)=>{
                    if(error) return res.json({success:false,error});
                    //console.log(userInfo.cart)
                    return res.status(200).json(updatedInfo.cart)
                }
            )
        }



    })
})

//Remove item from user's cart
router.put('/removeFromCart',auth,(req,res)=>{
    User.findOneAndUpdate(
        {_id:req.user._id},
        {
            "$pull":{
                "cart":{"id":req.body.itemId}
            }
        },
        {new:true},
        (err,updatedInfo)=>{
            if(err) return res.status(400).json({success:false,err})
            let updatedItemIds = updatedInfo.cart.map(item=>item.id)

            Product.find({_id:{$in:updatedItemIds}})
            .populate('writer')
            .exec((err,cartDetails)=>{
                if(err) return res.status(400).json({success:false,err})
                return res.status(200).json({
                    success:true,
                    cartDetail:cartDetails,
                    cart:updatedInfo.cart
                })
            })
        }
    )
})

router.post('/successBuy',auth,(req,res)=>{
    let history = [];
    let transactionData = {};

    //1. Put brief Payment Information inside User Collection. In history field
    req.body.cartDetail.forEach((item)=>{
        history.push({
            dateOfPurchase:Date.now(),
            name:item.title,
            id:item._id,
            price:item.price,
            quantity:item.quantity,
            paymentId:req.body.paymentData.paymentID,
        })
    })


    //2. Put Payment info that comes from Paypal into Payment Collection
    transactionData.user = {
        id:req.user._id,
        name:req.user.name,
        lastname:req.user.lastname,
        email:req.user.email,
    }
    transactionData.data = req.body.paymentData;
    transactionData.product = history;

    User.findOneAndUpdate(
        {_id:req.user._id},
        {$push:{history:history}, $set:{cart:[]}},
        {new:true},
        (err,updatedUser)=>{
            if(err)return res.json({success:false,err});

            const newPayment = Payment(transactionData);
            newPayment.save((err,doc)=>{
                if(err) return res.json({success:false,err});
                
                //3. Increase the number of product sold for each purchased item.
                async.eachSeries(history,(item,callback)=>{
                    console.log(item);
                    Product.findOneAndUpdate(
                        {_id:item.id},
                        {
                            $inc:{
                                'sold':item.quantity
                            }
                        },
                        {new:false},
                        callback
                    )
                },(err)=>{
                    if(err) return res.json({success:false,err});
                    res.status(200).json({
                        success:true,
                        cart:[],
                        cartDetail:[]
                    })
                });

            })
        }
    )

    
})


router.get('/getHistory',auth,(req,res)=>{
    User.findById(req.user._id,(err,doc)=>{
        if(err) res.status(400);
        let history = doc.history;
        return res.status(200).json({success:true,history})
    })
})

module.exports = router;
