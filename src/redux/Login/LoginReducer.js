
import {SET_CREDENTIALS, SET_DOMAIN, SET_USER_INFORMATION} from "./LoginAction"

const InitialStates ={
    TokenData:null,
    data:[],
    domainSetting: null,
    FactoryId: null
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
        case SET_USER_INFORMATION:
            return{
                ...state,
                FactoryId:action.FactoryId
            }
        default :
            return{
                ...state
            }
    }
    return state
}