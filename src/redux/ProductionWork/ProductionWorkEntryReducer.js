import {GET_PRODUCTIONWORKENTRYLIST, SET_DEVICE_INFORMATION} from "./ProductionWorkEntryAction"

const InitialStates ={
    Data:[],
    Message:null,
    Status:null,
    Total:0,
    DeviceName:null
}

export default (state = InitialStates, action) =>{
    switch(action.type){
        case GET_PRODUCTIONWORKENTRYLIST:
            return{
                ...state,
                Data:       action.Data,
                Message:    action.Message,
                Total:      action.Total
            }
        case SET_DEVICE_INFORMATION:
            return{
                ...state,
                DeviceName:       action.DeviceName
            }
        default :
            return{
                ...state
            }
    }
    return state
}