
import {SET_CREDENTIALS, SET_DOMAIN} from "./LoginAction"

const InitialStates ={
    TokenData:null,
    data:[],
    domainSetting: null
}

export default (state = InitialStates, action) =>{
    switch(action.type){
        case SET_CREDENTIALS:
            return{
                ...state,
                TokenData:action.TokenData
            }
        case SET_DOMAIN:
            return{
                ...state,
                domainSetting:action.domain
            }
        default :
            return{
                ...state
            }
    }
    return state
}