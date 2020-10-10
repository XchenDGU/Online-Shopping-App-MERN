const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = mongoose.Schema({
    writer:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    title:{
        type:String,
        maxlength:50
    },
    description:{
        type:String
    },
    price:{
        type:Number,
        default:0
    },
    images:{
        type:Array,
        default:[]
    },
    continent:{
        type:Number,
        required:true
    },
    sold:{
        type:Number,
        maxlength:100,
        default:0
    },
    views:{
        type:Number,
        default:0
    }

},{timestamps:true})


productSchema.index(
    //create text index
    {
        title:'text',
        description:'text',
    },
    {
        //Weight denotes the significance of the filed relative to other indexed fileds
        // in terms of the text search score.
        weights:
        {
            title:5,
            description:1
        }
    }
)

const Product = mongoose.model('Product', productSchema)
module.exports = {Product}