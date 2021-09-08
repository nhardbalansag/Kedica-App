
import SET_CREDENTIALS from "./LoginAction"

const InitialStates ={
    tokenData: null,
    data:[],
}

export default (state = InitialStates, action) =>{
    switch(action.type){
        case SET_CREDENTIALS:
            return{
                ...state,
                tokenData:action.TokenData
            }
        default :
            return{
                ...state
            }
    }
    return 
}