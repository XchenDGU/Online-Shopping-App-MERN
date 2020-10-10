import React from 'react'

function UserCartBlock(props) {
    //console.log('props.cartItems:',props.cartItems);
    
    const renderCartImage = (images)=>{
        if(images.length >0){
            return `http://localhost:5000/${images[0]}`;
        }
    }
    const renderItems = ()=>(
        props.cartItems && props.cartItems.map(item=>(
            <tr key={item._id}>
                <td>
                    <img style={{width:'70px'}} alt="Item image" 
                    src={renderCartImage(item.images)}/>
                </td>
                <td>{item.quantity}</td>
                <td>$ {item.price}</td>
                <td>
                    <button onClick = {()=>props.removeItemHandler(item._id)}>Remove 
                    </button>
                </td>
            </tr>
        ))
    )
    
    return (
        <div>
            <table style={{width:'100%'}}>
                <thead>
                    <tr>
                        <th>Product Image</th>
                        <th>Product Quantity</th>
                        <th>Product Price</th>
                        <th>Remove from Cart</th>
                    </tr>
                </thead>
                <tbody>
                    {renderItems()}
                </tbody>
            </table>
        </div>
    )
}

export default UserCartBlock
