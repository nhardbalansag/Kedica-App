import React,
{
    useState,
    useEffect
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

import DeviceInfo from 'react-native-device-info';

import Icon from 'react-native-vector-icons/FontAwesome';

import {ProductionScreen} from "../../navigator/appData"
import BackgroundService from 'react-native-background-actions';

const MainScreen = ({navigation}) =>{

    const options = {
        taskName: 'Example',
        taskTitle: 'ExampleTask title',
        taskDesc: 'ExampleTask description',
        taskIcon: {
            name: 'ic_launcher',
            type: 'mipmap',
        },
        color: '#ff00ff',
        linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
        parameters: {
            delay: 1000,
        },
    };
    
    const veryIntensiveTask = async (taskDataArguments) => {
        // Example of an infinite loop task
        await new Promise( async (resolve) => {
            console.log(BackgroundService.isRunning())
        });
    };

    const test = async () =>{
        try {
          await BackgroundService.start(veryIntensiveTask, options);
        } catch (error) {
          console.log(error.message)
        }
      }

    const [loading, setisLoading] = useState(false)

    const getDeviceInformation = () =>{
        let uniqueId = DeviceInfo.getUniqueId();
    }

    const checkDeviceInServer = () =>{
        
    }

    const submitDeviceInformation = () =>{

    }

    const getDeviceActivity = () =>{
        DeviceInfo.isLocationEnabled().then((enabled) => {
            // true or false
            console.log("isLocationEnabled =>" + enabled)
        });
        DeviceInfo.getAvailableLocationProviders().then((providers) => {
            // {
            //   gps: true
            //   network: true
            //   passive: true
            // }
            console.log(providers)
        });
        DeviceInfo.isBatteryCharging().then((isCharging) => {
            // true or false
            console.log("isBatteryCharging =>" + isCharging)
        });
        DeviceInfo.isAirplaneMode().then((airplaneModeOn) => {
            // false
            console.log("isAirplaneMode =>" + airplaneModeOn)
        });
        DeviceInfo.getPowerState().then((state) => {
            // {
            //   batteryLevel: 0.759999,
            //   batteryState: 'unplugged',
            //   lowPowerMode: false,
            // }
            console.log(state)
        });
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
        test()
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