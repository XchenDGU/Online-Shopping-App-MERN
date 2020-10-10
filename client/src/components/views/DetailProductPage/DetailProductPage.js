import React,{useEffect,useState} from 'react'
import Axios from 'axios';
import ProductImage from './Sections/ProductImage';
import ProductInfo from './Sections/ProductInfo';
import {Row,Col, message} from 'antd';
import {addToCart} from '../../../_actions/user_actions';
import {useDispatch} from 'react-redux';


function DetailProductPage(props) {
    const productId = props.match.params.productId;
    const [Product, setProduct] = useState([]);

    const dispatch = useDispatch();
    //console.log('props:',props)
    useEffect(() => {
        Axios.get(`/api/product/product_by_id?id=${productId}&type=single`)
            .then(res=>{
                setProduct(res.data[0])
            })
    }, [productId]);
    
    const addToCartHandler = (productId)=>{
        
        dispatch(addToCart(productId));
    }

    return (
        <div className="postPage" style={{width:'100%',padding:'3rem 4rem'}}>
            <div style={{display:'flex',justifyContent:'center'}}>
                <h1>{Product.title}</h1>
            </div>
            <br/>

            <Row gutter={[16,16]}>
                <Col lg={12} xs={24}>
                    <ProductImage detail={Product}/>
                </Col>
                <Col lg={12} xs={24}>
                    <ProductInfo 
                        detail={Product}
                        addToCart={addToCartHandler}    
                    />
                </Col>
            </Row>

        </div>
    )
}

export default DetailProductPage
