import React,
{
    useState,
    useEffect,
    useRef
} from "react";

import { 
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    FlatList,
    RefreshControl,
    ActivityIndicator
} from "react-native";

import {
    styles,
    colors,
} from "../../asset/css/BaseStyle";

import {
    NativeBaseProvider, 
    usePropsResolution,
} from 'native-base';

import Icon from 'react-native-vector-icons/FontAwesome';

import {ProductionScreen} from "../../navigator/appData"
import { backgroundTaskInit, updateTaskfunct } from "../../background/task";
import { AppState } from 'react-native';

const MainScreen = ({navigation}) =>{

    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);

    const [loading, setisLoading] = useState(false)

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

    useEffect(() =>{
        backgroundTaskInit()
        const subscription = AppState.addEventListener("change", nextAppState => {
            if (appState.current.match(/inactive|background/) && nextAppState === "active") {
              console.log("App has come to the foreground!");
              updateTaskfunct("App is in active foreground")
            }else{
                updateTaskfunct("App is close and running in background")
                appState.current = nextAppState;
                setAppStateVisible(appState.current);
                console.log("AppState", appState.current);
            }
        });
      
        return () => {
            subscription.remove();
        };
    }, [])

    const ButtonComponent = ({item}) => {
        return(
            <View style={[styles.w50]}>
                <TouchableOpacity
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
                                <Text style={[styles.textWhite, styles.mL1, styles.font40]}>{item.title}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View
            style={[
                styles.alignCenter,
            ]}
        >
            {
                loading ?
                    <>
                        <View style={[
                                styles.alignCenter,
                                styles.justifyCenter,
                            ]}>
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
                    />
            }
            
        </View>
    )
}

export default  MainScreen;