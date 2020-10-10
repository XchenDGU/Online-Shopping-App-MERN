import React, { useEffect, useState } from 'react';
import {useDispatch} from 'react-redux';
import {
    getCartItems,
    removeCartItem,
    onSuccessBuy,
} from '../../../_actions/user_actions'
import UserCartBlock from './Sections/UserCartBlock'
import {Result, Empty} from 'antd';
import Paypal from '../../utils/Paypal';
import Axios from 'axios';
import displayMesage,* as msgType from '../../utils/ShowMessage';

function CartPage(props) {
    const dispatch = useDispatch();
    const [Total,setTotal] = useState(0);
    const [ShowTotal,setShowTotal] = useState(false);
    const [ShowSuccess,setShowSuccess] = useState(false);

    useEffect(()=>{
        if(props.user.userData && props.user.userData.cart && props.user.userData.cart.length>0){
            dispatch(getCartItems(props.user.userData.cart))
        }
        
    },[props.user.userData]) //when there is change to userData

    useEffect(()=>{
        if(props.user.cartDetail && props.user.cartDetail.length>0){
            calculateTotal(props.user.cartDetail);
            setShowTotal(true);
        }else{
            setTotal(0);
            setShowTotal(false);
        }
    },[props.user.cartDetail]) //Change to cart,e.g. item added, deleted..

    const calculateTotal=(cartDetail)=>{
        let total = 0;
        cartDetail.forEach(item=>
            total += (parseFloat(item.price)*item.quantity)
        )
        setTotal(total);
    }

    //remove item from the cart
    const removeFromCart = (itemId)=>{
        const onSuccess = ()=>{
            displayMesage(msgType.WARNING,"Item removed.")
        }
        dispatch(removeCartItem(itemId,onSuccess))
    }

    const transactionSuccess = (paymentData)=>{
        let data = {
            cartDetail:props.user.cartDetail,
            paymentData,
        }
        Axios.post('/api/users/successBuy',data)
        .then(res=>{
            if(res.data.success){
                setShowTotal(false);
                setShowSuccess(true);
                dispatch(onSuccessBuy({cart:res.data.cart,cartDetail:res.data.cartDetail}));
                displayMesage(msgType.SUCCESS,"Transaction Success. Thank you !")
            }else{
                displayMesage(msgType.ERROR,"Something went wrong. Try it again later");
            }
        });
    }

    const transactionError = () =>{
        displayMesage(msgType.ERROR,"Transaction using PayPal failed..")
        console.log('Paypal error');
    }
    const transactionCanceled = () =>{
        displayMesage(msgType.INFO,"Transaction Canceled");
        console.log('Trasaction canceled');
    }
    return (
        <div style={{width:'85%',margin:'3rem auto'}}>
            <h1>My Cart</h1>
            <div>
                <UserCartBlock
                    cartItems = {props.user.cartDetail}
                    removeItemHandler = {removeFromCart}
                />

                
                {ShowTotal?
                    <div style={{marginTop:'3rem'}}>
                        <h2>Total Amount: ${Total}</h2>
                    </div>:
                    ShowSuccess ? 
                    <Result
                        status="success"
                        title="Successfully Purchased Items"
                    />:
                    <div style={{
                    width:'100%',display:'flext',flexDirection:'column',
                    justifyContent:'center',
                    }}>
                        <br/>
                        <Empty description={false}/>
                        <p>No Items in the Cart</p>
                    </div>
                }
                
            </div>

            {
                ShowTotal &&
                <Paypal
                    toPay ={Total}
                    onSuccess={transactionSuccess}
                    transactionError = {transactionError}
                    transactionCanceled = {transactionCanceled}
                />
            }

        </div>
        
    )
}

export default CartPage
