import {GET_PRODUCTIONWORKENTRYLIST} from "./ProductionWorkEntryAction"

const InitialStates ={
    Data:[],
    Message:null,
    Status:null,
    Total:0
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
        default :
            return{
                ...state
            }
    }
    return state
}