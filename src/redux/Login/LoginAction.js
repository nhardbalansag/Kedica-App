import {APP_URL} from "../../config/AppConfig"

export const SET_CREDENTIALS = 'SET_CREDENTIALS';
export const SET_DOMAIN = 'SET_DOMAIN';
export const SET_USER_INFORMATION = 'SET_USER_INFORMATION';
export const SET_TRAVELSHEET = 'SET_TRAVELSHEET';
export const SET_LOGOUT = 'SET_LOGOUT';

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
        await fetch(domainSetting + "token", {
            method : 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: formBody
        }).then(data => {
            if (!data.ok) {
                throw Error(data.status);
            }
            return data.json();
        }).then(responseData => {
            if(Object.keys(responseData).length == 3){
                dispatch({
                    type: SET_CREDENTIALS, 
                    TokenData: responseData.access_token
                });
            }else if(Object.keys(responseData).length < 3){
                throw new Error(false)
            }
        }).catch(error => {
            throw new Error("Invalid username and password or check your ip configuration")
        }); 
    }
}

export const getUserDetails = (username, password, domainSetting) =>{
    return async (dispatch) =>{
        await fetch(domainSetting + "api/login/user-information/get", {
            method : 'POST',
            headers:{
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                Username: username,
                Password : password
            })
        }).then(data => {
            if (!data.ok) {
                throw Error(data.status);
            }
            return data.json();
        }).then(responseData => {
            dispatch({
                type: SET_USER_INFORMATION, 
                FactoryId: responseData[0].FactoryID,
                UserName: responseData[0].UserName,
                FirstName: responseData[0].FirstName,
                MiddleName: responseData[0].MiddleName,
                LastName: responseData[0].LastName
            });
        }).catch(error => {
            throw new Error("Invalid username and password or check your ip configuration")
        }); 
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

export const logoutUser = () =>{
    return async (dispatch) =>{
        dispatch({
            type: SET_LOGOUT
        });
    }
}

export const travelSheetRedux = (travelSheetdata) =>{
    return async (dispatch) =>{
        dispatch({
            type: SET_TRAVELSHEET, 
            travelSheet: travelSheetdata
        });
    }
}