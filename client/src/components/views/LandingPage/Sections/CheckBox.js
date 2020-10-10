import React,{useState} from 'react'
import{Checkbox,Collapse} from 'antd'

const {Panel} = Collapse;


export default function CheckBox(props) {
    const [Checked, setChecked] = useState([]);

    const handleToggle = (id)=>{
        const currentIndex = Checked.indexOf(id);
        const newChecked = [...Checked];

        if(currentIndex ===-1){
            newChecked.push(id);
        }else{
            newChecked.splice(currentIndex,1);
        }

        setChecked(newChecked);
        props.handleFilters(newChecked);
    };

    const renderCheckBoxList = ()=>
        props.continents.map((cont,index)=>(
            <React.Fragment key={index}>
                <Checkbox
                    onChange = {()=>handleToggle(cont._id)}
                    type="checkbox"
                    checked ={Checked.indexOf(cont._id) ===-1?false:true}
                />
                <span>{cont.name}</span>
            </React.Fragment>

        ))
    

    return (
        <div>   
            <Collapse defaultActiveKey={['0']}>
                <Panel header="Continents" key="1">
                    {renderCheckBoxList()}
                </Panel>
            </Collapse>
        </div>
    )
}
