import Axios from 'axios'
import React,{useEffect,useState} from 'react'

function HistoryPage() {
    const [History,setHistory] = useState([]);

    useEffect(() => {
        Axios.get('/api/users/getHistory')
        .then(res=>{
            if(res.data.success){
                setHistory(res.data.history.reverse())
            }else{
                alert('Failed to get History')
            }
        })
    }, [])

    const converToDataTime = (time)=>{
        let d = new Date(time);
        return d.toLocaleString();
    }

    return (
        <div style={{width:'80%',margin:'3rem auto'}}>
            <div style={{textAlign:'center'}}>
                <h1>History</h1>
            </div>
            <br/>
            <table style={{width:'100%'}}>
                <thead>
                    <tr>
                        <th>Payment Id</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Date of Purchase</th>
                    </tr>
                </thead>
                <tbody>
                    {History.map((item,index)=>(
                        <tr key={index}>
                            <td>{item.paymentId}</td>
                            <td>{item.price}</td>
                            <td>{item.quantity}</td>
                            <td>{converToDataTime(item.dateOfPurchase)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default HistoryPage
