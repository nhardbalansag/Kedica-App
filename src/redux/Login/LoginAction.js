import APP_URL from "../../config/AppConfig"

export const SET_CREDENTIALS = 'SET_CREDENTIALS';

export const login = (username, password) =>{

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
        const response = await fetch("http://192.168.200.100:1993/token", {
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

            throw new Error(true)

        }else if(Object.keys(responseData).length < 3){

            throw new Error(false)

        }
    }
}