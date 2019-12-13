/*
used to send ajax require  --> ajax connect front and back end
return: promise object --> async await
axios used to send require eventually
* */
import axios from 'axios';

export default function ajax(url, data={}, type='GET') {
    if(type === 'GET'){
        // data is {username: xxxx, password: xxx} changed to a string like ?username=xxx&password=xxx
        let paramStr = '';
        Object.keys(data).forEach(key => {
            paramStr += key + '=' + data[key] + '&';
        })
        if(paramStr) {
            paramStr = paramStr.substring(0, paramStr.length-1);
        }
        return axios.get(url + '?' + paramStr)
    }else{
        return axios.post(url, data)
    }
}
