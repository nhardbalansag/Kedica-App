
import {SET_CREDENTIALS} from "./LoginAction"

const InitialStates ={
    TokenData:null,
    data:[],
}

export default (state = InitialStates, action) =>{
    switch(action.type){
        case SET_CREDENTIALS:
            return{
                ...state,
                TokenData:action.TokenData
            }
        default :
            return{
                ...state
            }
    }
    return state
}