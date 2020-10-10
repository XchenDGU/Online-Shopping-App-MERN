import React, { useState } from 'react'
import {Radio,Collapse}from 'antd';

const {Panel} = Collapse;


function RadioBox(props) {
    const [Selected, setSelected] = useState(0);

    const handleRadioChange = (e)=>{
        let selectedId = e.target.value
        setSelected(selectedId);
        props.handleFilters(selectedId);
    }

    const renderRadioBoxList = ()=>  
        props.prices.map((price)=>(
            <Radio key={price._id} value={price._id}>
                {price.name}
            </Radio>
        ))
            
    return (
        <div>
            <Collapse defaultActiveKey={['0']}>
                <Panel header="Price Range" key="1">
                    <Radio.Group onChange={handleRadioChange} value={Selected} >
                        {renderRadioBoxList()}
                    </Radio.Group>
                </Panel>
            </Collapse>
        </div>
    )
}

export default RadioBox
