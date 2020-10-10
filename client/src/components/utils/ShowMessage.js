import {message} from 'antd';

export const INFO = 'info';
export const SUCCESS = 'success';
export const ERROR = 'error';
export const WARNING = 'warning';

export default function displayMessage(type,msg){
    switch(type){
        case INFO:
            message.info(msg);
            break;
        case SUCCESS:
            message.success(msg);
            break;
        case ERROR:
            message.error(msg);
            break;
        case WARNING:
            message.warning(msg);
            break;
        default:
            break;
    }
}

