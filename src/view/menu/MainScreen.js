import React,
{
    useState,
    useEffect,
    useRef
} from "react";

import { 
    View,
    Text,
    TouchableOpacity,
    FlatList,
    RefreshControl,
    ActivityIndicator,
    Alert
} from "react-native";

import { 
    useSelector
} from 'react-redux';

import {
    styles,
    colors,
} from "../../asset/css/BaseStyle";

import Icon from 'react-native-vector-icons/FontAwesome';

import {ProductionScreen} from "../../navigator/appData"
// import { io } from "socket.io-client";
// import { backgroundTaskInit, updateTaskfunct } from "../../background/task";
// import { AppState } from 'react-native';

const MainScreen = ({navigation}) =>{

    // const appState = useRef(AppState.currentState);
    // const [appStateVisible, setAppStateVisible] = useState(appState.current);
    // const [pageStatus, setPageStatus] = useState(null)
    const [refreshing, setRefreshing] = useState(true);

    const domainSetting = useSelector(state => state.loginCredential.domainSetting);
    const token = useSelector(state => state.loginCredential.TokenData);

    const [loading, setisLoading] = useState(false)

    const [production, setproduction] = useState(false)
    const [IQC, setIQC] = useState(false)
    const [holdlot, setholdlot] = useState(false)

    const checkDeviceInServer = () =>{
        
    }

    const submitDeviceInformation = () =>{

    }

    const alertMessage = (message) =>{
        Alert.alert(
            "Note",
            message,
            [
                { 
                  text: "OK",
                }
            ]
        );
    }

    const getUserAccess = async () =>{
        setRefreshing(true)
        setisLoading(true)
        setIQC(false)
        setholdlot(false)
        setproduction(false)

        await fetch(domainSetting + "api/login/user-access/get", {
            method:"GET",
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
            for(const key in responseData[0].dataContent){
                if(responseData[0].dataContent[key].PageName === 'OutgoingInspection' && responseData[0].dataContent[key].Status === 1){
                    setIQC(true)
                }else if(responseData[0].dataContent[key].PageName === 'HoldLotSummary' && responseData[0].dataContent[key].Status === 1){
                    setholdlot(true)
                }else if(responseData[0].dataContent[key].PageName === 'ProductionWorkEntry' && responseData[0].dataContent[key].Status === 1){
                    setproduction(true)
                }
            }
            setRefreshing(false)
            setisLoading(false)
        }).catch(error => {
            alertMessage(error.message)
            setRefreshing(false)
            setisLoading(false)
        }); 
    }

    useEffect(() =>{
        getUserAccess()
        // backgroundTaskInit()
        // const subscription = AppState.addEventListener("change", nextAppState => {
        //     if (appState.current.match(/inactive|background/) && nextAppState === "active") {
        //       console.log("App has come to the foreground!");
        //       updateTaskfunct("App is in active foreground")
        //     }else{
        //         updateTaskfunct("App is close and running in background")
        //         appState.current = nextAppState;
        //         setAppStateVisible(appState.current);
        //         console.log("AppState", appState.current);
        //     }
        // });
      
        // return () => {
        //     subscription.remove();
        // };
    }, [])

    const ButtonComponent = ({item}) => {
        return(
            <View style={[styles.w50]}>
                <TouchableOpacity
                    disabled={
                        item.title === "Production Work Entry" ? (production ? false : true) : 
                        item.title === "Outgoing Inspection" ? (IQC ? false : true) :
                        item.title === "Hold Lot Summary" ? (holdlot ? false : true) : ''
                    }
                    onPress={() => navigation.navigate(
                        item.navigationScreen,
                        {
                            url: item.api.url,
                            method: item.api.method,
                            title: item.title
                        }
                    )}
                >
                    <View 
                        style={[
                            styles.backgroundPrimary,
                            item.title === "Production Work Entry" ? (production ?  styles.backgroundPrimary :  styles.bgGray300) : 
                            item.title === "Outgoing Inspection" ? (IQC ?  styles.backgroundPrimary :  styles.bgGray300) :
                            item.title === "Hold Lot Summary" ? (holdlot ?  styles.backgroundPrimary :  styles.bgGray300) : styles.backgroundPrimary,
                            styles.pY2,
                            styles.pX1,
                            styles.mX3,
                            styles.mY1,
                            styles.justifyCenter,
                            styles.alignCenter,
                            styles.border10,
                        ]}
                    >
                        <View>
                            <View>
                                <Text style={[styles.textWhite, styles.font20]}>{item.toptitle}</Text>
                            </View>
                            <View style={[styles.flexRow, styles.justifyStart, styles.alignCenter]}>
                                <Icon name={item.iconuse} size={30} color={colors.lightColor} />
                                <Text style={[
                                    styles.textWhite, 
                                    styles.mL1, styles.font40,
                                    item.title === "Production Work Entry" ? (production ? styles.backgroundPrimary : styles.textLineThrough) : 
                                    item.title === "Outgoing Inspection" ? (IQC ? styles.backgroundPrimary : styles.textLineThrough) :
                                    item.title === "Hold Lot Summary" ? (holdlot ? styles.backgroundPrimary : styles.textLineThrough) : '',
                                ]}>{item.title}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={[ styles.alignCenter, ]} >
            {
                loading ?
                    <>
                        <View style={[ styles.alignCenter, styles.justifyCenter, ]}>
                            <ActivityIndicator  size="large" color={colors.primaryColor}/>
                            <Text style={[styles.font20]}>Checking Device Information, please wait..</Text>
                        </View>
                    </> 
                    :
                    <FlatList 
                        // keyExtractor={item => console.log(item)} 
                        data={ProductionScreen} 
                        renderItem={ButtonComponent} 
                        numColumns={2}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} size="large" onRefresh={getUserAccess} />
                        }
                    />
            }
            
        </View>
    )
}

export default  MainScreen;