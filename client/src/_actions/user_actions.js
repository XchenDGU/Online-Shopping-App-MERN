import axios from 'axios';
import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER,
    LOGOUT_USER,
    ADD_TO_CART_USER,
    GET_CART_ITEMS_USER,
    REMOVE_CART_ITEM_USER,
    ON_SUCCESS_BUY_USER,

} from './types';
import { USER_SERVER } from '../components/Config.js';
import displayMesage,* as msgType from '../components/utils/ShowMessage';


export function registerUser(dataToSubmit){
    const request = axios.post(`${USER_SERVER}/register`,dataToSubmit)
        .then(response => response.data);
    
    return {
        type: REGISTER_USER,
        payload: request
    }
}

export function loginUser(dataToSubmit){
    const request = axios.post(`${USER_SERVER}/login`,dataToSubmit)
                .then(response => response.data);

    return {
        type: LOGIN_USER,
        payload: request
    }
}

export function auth(){
    const request = axios.get(`${USER_SERVER}/auth`)
    .then(response => response.data);

    return {
        type: AUTH_USER,
        payload: request
    }
}

export function logoutUser(){
    const request = axios.get(`${USER_SERVER}/logout`)
    .then(response => response.data);

    return {
        type: LOGOUT_USER,
        payload: request
    }
}




export function addToCart(_id){
    const request = axios.get(`${USER_SERVER}/addToCart?productId=${_id}`)
    .then(response =>{
        //console.log("addToCart response: ",response.data);
        displayMesage(msgType.SUCCESS,"Item added to cart successfully"); 
        return response.data;
    })
    .catch(err=>{
        console.log(err);
        if(err.response && !err.response.data.isAuth){
            displayMesage(msgType.ERROR,"You need to login first!")
        }else{
            displayMesage(msgType.ERROR,"Add to cart failed..")
        }
        
    });

    return {
        type: ADD_TO_CART_USER,
        payload: request
    }
}


export function getCartItems(userCart){
    let cartItemIds = [];
    userCart.forEach(item=>{
        cartItemIds.push(item.id);
    });
    //console.log(cartItemIds);
    const request = axios.get(`/api/product/product_by_id?id=${cartItemIds}&type=array`)
        .then(res=>{
            //Make CartDeail inside Reux store
            // We need to add quantity data to Product infomration that come from product collection
            
            res.data.forEach((productDetail,i)=>{
                userCart.forEach(cartItem=>{
                    if(productDetail._id === cartItem.id){
                        res.data[i].quantity = cartItem.quantity;
                    }
                })
            })

            return res.data;
        });

    //console.log(request);

    return {
        type:GET_CART_ITEMS_USER,
        payload:request
    }


}

export function removeCartItem(itemId,onSuccess){
    const request = axios.put('/api/users/removeFromCart',{itemId})
        .then(res=>{
            res.data.cart.forEach(item=>{
                res.data.cartDetail.forEach((itemDetail,i)=>{
                    if(item.id === itemDetail._d){
                        res.data.cartDetail[i].quantity = item.quantity;
                    }
                })
            })
            onSuccess();
            return res.data;
        })
        .catch(err=>console.log(err))
    
    return {
        type:REMOVE_CART_ITEM_USER,
        payload:request,
    } 
}

export function onSuccessBuy(data){
    return {
        type:ON_SUCCESS_BUY_USER,
        payload:data
    }
}