import React, { useState } from 'react';
import DropZone from 'react-dropzone';
import {Icon} from 'antd';
import Axios from 'axios';


export default function FileUpload(props) {
    const [Images, setImages] = useState([]);

    const onDrop = (file)=>{
        let formData = new FormData();
        const config = {
            header:{'content-type':'multipart/form-data'}
        };
        formData.append("file",file[0]);

        //Save the Image we chose inside the Node Server
        Axios.post('/api/product/uploadImage',formData,config)
        .then(res=>{
            if(res.data.success){
                setImages([
                    ...Images,
                    res.data.image,
                ]);
                props.refreshFunction([...Images,res.data.image]);
            }else{
                alert('Failed to save the Image in Server')
            }
        })
    }

    const onDelete = (image)=>{
        const currentIndex = Images.indexOf(image);

        let newImages = [...Images]
        newImages.splice(currentIndex,1);
        setImages(newImages);
        props.refreshFunction(newImages);
    }

    return (
        <div style={{display:'flex',justifyContent:'space-between'}}>
            <DropZone
                onDrop = {onDrop}
                multiple={false}
                maxSize ={80000000}
            >
                {({getRootProps,getInputProps})=>(
                    <div style={{
                            width:'300px',height:'240px',border:'1px solid lightgray',
                            display:'flex',alignItems:'center',justifyContent:'center'}}
                        {...getRootProps()}
                    >
                        <input {...getInputProps()}/>
                        <Icon type="plus" style={{fontSize:'3rem'}} />
                    </div>

                )}
            </DropZone>
            
            <div style={{display:'flex',width:'350px',height:'240px',overflowX:'auto',}}>

                {Images.map((image,index) => (
                    <div key={image} onClick = {()=>onDelete(image)}>
                        <img style={{minWidth:'300px',width:'300px',height:'240px'}}
                            src={`http://localhost:5000/${image}`} alt={`productImg-${index}`}/>
                    </div>   
                ))}
                     
            </div>

        </div>
    )
}
