import React,{useEffect,useState} from 'react'
import Axios from 'axios';
import {Icon,Col,Card,Row} from 'antd';
import ImageSlider from '../../utils/ImageSlider';
import CheckBox from './Sections/CheckBox';
import RadioBox from './Sections/RadioBox';
import SearchFeature from './Sections/SearchFeature';

import {continents,prices} from './Sections/Data';

const {Meta} = Card;

function LandingPage() {
    
    const [Products,setProducts] = useState([]);
    const [Skip, setSkip] = useState(0);
    const [Limit, setLimit] = useState(8)
    const [PostSize, setPostSize] = useState(0)
    const [Filters, setFilters] = useState({
        continent:[],
        price:[]
    })
    const [SearchTerm, setSearchTerm] = useState('');

    const renderCards = Products.map((product,index)=>{
        return <Col key={index} lg={6} md={8} xs={24}>
            <Card
                hoverable={true}
                cover={<a href={`/product/${product._id}`}><ImageSlider images={product.images}/></a>}
            >
                <Meta
                    title={product.title}
                    description={`$${product.price}`}
                />
            </Card>
        </Col>
    })

    useEffect(() => {
        const params = {
            skip:Skip,
            limit:Limit,
        }
        getProducts(params);
    }, []);

    const getProducts = (params)=>{
        
        Axios.get('/api/product/getProducts',{params})
            .then(res=>{
                if(res.data.success){
                    //console.log(res.data.products);
                    if(params.loadMore){
                        setProducts([
                            ...Products,
                            ...res.data.products
                        ]);
                    }else{
                        setProducts(res.data.products)
                    }
                    setPostSize(res.data.postSize);
                    //console.log(res.data.postSize);
                }else{
                    alert('Failed to fetch product datas');
                }
            })
    }

    const onLoadMore = ()=>{
        let skip = Skip+Limit;
        
        const params = {
            skip:skip,
            limit:Limit,
            loadMore:true,
        }
        getProducts(params);
        setSkip(skip);
        
    }


    const showFilteredResults = (filters) =>{
        const params = {
            skip:0,
            limit:Limit,
            filters:filters,
        }
        getProducts(params);
        setSkip(0);
    }

    const handleFilters = (filters,category)=>{
        //console.log(filters,category);
        const newFilters = {...Filters}

        newFilters[category] = filters
        if(category === "price"){
            let priceRange = prices.find(x=>x._id === filters).range;
            newFilters[category] = priceRange;
        }
        //console.log(newFilters);
        showFilteredResults(newFilters);
        setFilters(newFilters)
    }

    const updateSearchTerm= (newSearchTerm)=>{
        
        const params = {
            skip:0,
            limit:Limit,
            filters:Filters,
            searchTerm:newSearchTerm,
        }
        setSkip(0);
        setSearchTerm(newSearchTerm);
        getProducts(params);
    }

    return (
        <div style={{width:'75%',margin:'3rem auto'}}>
            <div style={{textAlign:'center'}}>
                <h2> Let's Travel Anywhere <Icon type="rocket"/> </h2>
            </div>

            <Row gutter={[16,16]}>
                <Col lg={12} xs={24}>
                    <CheckBox
                        continents = {continents}
                        handleFilters ={filters=>handleFilters(filters,"continent")}
                    />
                </Col>

                <Col lg={12} xs={24}>
                    <RadioBox
                        prices = {prices}
                        handleFilters ={filters=>handleFilters(filters,"price")}
                    />  
                </Col>
            </Row>

            <div style={{display:'flex',justifyContent:'flex-end',margin:'1rem auto'}}>
                <SearchFeature
                    updateSearchTerm = {updateSearchTerm}
                />
            </div>

            {Products.length ===0 ?
                <div style={{display:'flex',height:'300px',justifyContent:'center',alignItems:'center'}}>
                    <h2>No post yet...</h2>
                </div>:
                <div>
                    <Row gutter={[16,16]}>
                        {renderCards}
                    </Row>
                </div>
            
            }
            <br/>
            
            {PostSize >= Limit && 
                <div style={{display:'flex',justifyContent:'center'}}>
                    <button onClick={onLoadMore}>Load More</button>
                </div>
            }

        </div>
    )
}

export default LandingPage
