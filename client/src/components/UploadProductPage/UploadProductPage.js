import React, { useState } from 'react'
import {Typography, Button,Form,message,Input,Icon} from 'antd';
import FileUpload from '../utils/FileUpload';
import Axios from 'axios';
const {Title} = Typography;
const {TextArea} = Input;

const initialForm = {
    title :'',
    description : '',
    price:0,
    continent:'',
};

const Continents=[
    {key:1,value:'Africa'},
    {key:2,value:'Europe'},
    {key:3,value:'Asia'},
    {key:4,value:'North America'},
    {key:5,value:'South America'},
    {key:6,value:'Australia'},
    {key:7,value:'Antarctica'},
]

export default function UploadProductPage(props) {
    const [formValues,setFormValues] = useState(initialForm);
    const [Images, setImages] = useState([]);

    const handleInputChange = e=>{
        const {name,value} = e.target;
        setFormValues({
            ...formValues,
            [name]:value,
        })
    }

    const updateImages = (newImage)=>{
        //console.log(newImage);
        setImages(newImage);
    }

    const onSubmit = (event)=>{
        event.preventDefault();

        if(!Object.values(formValues).every(x=>x) || !Images){
            return alert('Please fill all the fileds first');
        }

        var formData = {
            writer:props.user.userData._id,
            ...formValues,
            images:Images,
        }

        Axios.post('/api/product/uploadProduct',formData)
            .then(res=>{
                if(res.data.success){
                    alert('Product Successfully Uploaded');
                    props.history.push('/')
                }else{
                    alert('Failed to upload Product')
                }
            })
    }
    return (
        <div style={{maxWidth:'700px',margin:'2rem auto'}}>
            <div style={{textAlign:'center',marginBottom:'2rem'}}>
                <Title level={2}>Upload Travel Product</Title>
            </div>

            <Form onSubmit={onSubmit}>
                {/*Drop Zone */}
                <FileUpload refreshFunction={updateImages}/>
                <br/>
                <br/>
                <label>Title</label>
                <Input
                    onChange = {handleInputChange}
                    value = {formValues.title}
                    name = "title"
                />
                <br/>
                <br/>
                <label>Description</label>
                <TextArea
                    onChange = {handleInputChange}
                    value = {formValues.description}
                    name ="description"
                />
                <br/>
                <br/>
                <label >Price($)</label>
                <Input
                    onChange = {handleInputChange}
                    value = {formValues.price}
                    type="number"
                    name="price"
                />
                <select name="continent" 
                    onChange={handleInputChange}
                    value = {formValues.continent}
                >
                    <option value={0}>None</option>
                    {Continents.map(item=>(
                        <option key={item.key} value={item.key}>{item.value}</option>
                    ))}

                </select>
                <br/>
                <br/>
                <Button
                    onClick ={onSubmit}   
                >
                    Submit
                </Button>
            </Form>

        </div>
    )
}
