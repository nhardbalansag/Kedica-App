
import {SET_CREDENTIALS, SET_DOMAIN, SET_USER_INFORMATION, SET_TRAVELSHEET} from "./LoginAction"

const InitialStates ={
    TokenData:null,
    data:[],
    domainSetting: null,
    travelSheet: null,
    FactoryId: null,
    UserName: null,
    FirstName: null,
    MiddleName: null,
    LastName: null
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
                FactoryId: action.FactoryId,
                UserName: action.UserName,
                FirstName: action.FirstName,
                MiddleName: action.MiddleName,
                LastName: action.LastName
            }
        case SET_TRAVELSHEET:
            return{
                ...state,
                travelSheet:action.travelSheet
            }
        default :
            return{
                ...state
            }
    }
    return state
}