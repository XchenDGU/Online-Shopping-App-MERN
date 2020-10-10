import React,{useState,useEffect}from 'react'
import ImageGallery from 'react-image-gallery';

const IMAGE_URL = 'http://localhost:5000/';

function ProductImage(props) {
    const [Images, setImages] = useState([])


    useEffect(() => {
        if(props.detail.images && props.detail.images.length > 0){
            let images = [];

            props.detail.images.forEach(item=>{
                images.push({
                    original:IMAGE_URL+item,
                    thumbnail:IMAGE_URL+item,

                })
            })
            setImages(images);
        }
    }, [props.detail])

    return (
        <div>
            <ImageGallery items={Images}/>
        </div>
    )
}

export default ProductImage
