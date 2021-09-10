import {APP_URL} from "../../config/AppConfig"

export const SET_CREDENTIALS = 'SET_CREDENTIALS';
export const SET_DOMAIN = 'SET_DOMAIN';

export const login = (username, password, domainSetting) =>{

    var details = {
        'username': username,
        'password': password,
        'grant_type': 'password'
    };

    var formBody = [];

    for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }

    formBody = formBody.join("&");

    return async (dispatch) =>{
        const response = await fetch(domainSetting + "token", {
            method : 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: formBody
        })

        const responseData = await response.json();
       
        if(Object.keys(responseData).length == 3){
            
            dispatch({
                type: SET_CREDENTIALS, 
                TokenData: responseData.access_token
            });

        }else if(Object.keys(responseData).length < 3){

            throw new Error(false)

        }
    }
}

export const changeDomain = (domain) =>{
    return async (dispatch) =>{
        dispatch({
            type: SET_DOMAIN, 
            domain: domain
        });
    }
}