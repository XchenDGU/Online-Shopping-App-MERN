import React,{useState} from 'react'
import {Input} from 'antd';

const {Search} = Input;

export default function SearchFeature(props) {
    const [SearchTerm, setSearchTerm] = useState('');
    const handleInputChange = (e)=>{
        setSearchTerm(e.target.value);
        props.updateSearchTerm(e.target.value);
    }
    return (
        <div>
            <Search
                value = {SearchTerm}
                onChange = {handleInputChange}
                placeholder="Search by Typing..."
            />
        </div>
    )
}
