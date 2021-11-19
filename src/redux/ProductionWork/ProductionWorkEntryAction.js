import {APP_URL} from "../../config/AppConfig"

export const GET_PRODUCTIONWORKENTRYLIST = 'GET_PRODUCTIONWORKENTRYLIST';
export const SET_DEVICE_INFORMATION = 'SET_DEVICE_INFORMATION';

import ProductionWorkEntry from "../../model/ProductionWork/ProductionWorkEntry";

export const getProductionWorkEntryList = (token) =>{
    
    return (dispatch) =>{
        fetch(APP_URL + "api/ProductionWork/ProductionWorkEntry/get", {
            method:'GET',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }).then(data => {
            if (!data.ok) {
                throw Error(data.status);
            }
            return data.json();
        }).then(responseData => {
            dispatch({
                type:       GET_PRODUCTIONWORKENTRYLIST,
                Data:       responseData.data,
                Message:    responseData.message,
                Total:      responseData.total
            })
        }).catch(error => {
            
        }); 
    }
}

export const getDeviceInformation = (devicename) =>{
    return async (dispatch) =>{
        dispatch({
            type: SET_DEVICE_INFORMATION, 
            DeviceName: devicename
        });
    }
}