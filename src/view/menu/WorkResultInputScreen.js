import React,
{
    useState,
    useEffect
} from "react";

import { 
    useSelector
} from 'react-redux';

import { 
    View,
    Text,
    ScrollView,
    KeyboardAvoidingView,
    Image,
    TouchableOpacity,
    Switch,
    FlatList,
    Alert
} from "react-native";

import { APP_URL } from "../../config/AppConfig";

import {
    styles,
    colors,
} from "../../asset/css/BaseStyle";

import CustomStyle from "../../asset/css/CustomStyle";

import {
    NativeBaseProvider,
    FormControl,
    Input,
    Actionsheet,
    useDisclose,
    Button
} from 'native-base';

import Icon from 'react-native-vector-icons/FontAwesome';
import { style } from "styled-system";
import { devToolsEnhancer } from "@reduxjs/toolkit/dist/devtoolsExtension";

const WorkResultInputScreen = (props) =>{

    const domainSetting = useSelector(state => state.loginCredential.domainSetting);

    const { isOpen, onOpen, onClose } = useDisclose()

    const travelSheetNumber = props.route.params.dataContent.number;

    const token = useSelector(state => state.loginCredential.TokenData);

    const [datetime, setDaytimes] =  useState();
    const [currDate, setCurrDate] =  useState();
    const [Qty, setQty] =  useState(0);

    const search = async (tokendata, param, domainSetting) =>{
        try{
            const response = await fetch(domainSetting + "api/ProductionWork/ProductionWorkEntry/travelsheet/" + param, {
                method:'GET',
                headers:{
                    'Content-type': 'application/json',
                    'Authorization': 'Bearer ' + tokendata
                }
            })

            const responseData = await response.json();
            if(responseData[0].total > 0){
                var tempvar = {
                    ID:             responseData[0].dataContent[0].ID,
                    TravelSheetID:  responseData[0].dataContent[0].TravelSheetID,
                    TravelSheetNo:  responseData[0].dataContent[0].TravelSheetNo,
                    ItemCode:       responseData[0].dataContent[0].ItemCode,
                    ItemName:       responseData[0].dataContent[0].ItemName,
                    Qty:            responseData[0].dataContent[0].Qty,
                    DateFrom:       responseData[0].dataContent[0].DateFrom,
                    DateTo:         responseData[0].dataContent[0].DateTo
               }
   
               setQty(tempvar.Qty)
            }else{
                    
                alertMessage("No Data Available");
                
            }
            
        }catch(error){
            alertMessage(error.message);
        }
    }

    const alertMessage = (message) =>{
        Alert.alert(
            "Note",
            message,
            [
              { text: "OK", onPress: () => props.navigation.navigate('ProductionWorkEntryScreen')}
            ]
        );
    }

    const realtime = () =>{
        setInterval(() => {
            var dt = new Date().toLocaleTimeString();
            var d = new Date().toDateString();
            setDaytimes(dt);
            setCurrDate(d);
        }, 1000)
    }

    useEffect(() =>{
        search(token, travelSheetNumber, domainSetting)
        realtime();
    },[])

    return(
        <NativeBaseProvider>
            <View style={[
                styles.flexRow,
                styles.alignCenter,
                styles.mL2
            ]}>
                <Text style={[
                    styles.font30,
                    styles.textBold,
                    styles.mR1
                ]}>
                    Travel Sheet No. :
                </Text>
                <Text style={[
                    styles.font40
                ]}>
                    {travelSheetNumber}
                </Text>
            </View>
            <View style={[
                styles.flexRow,
                styles.alignCenter,
                styles.mL2
            ]}>
                <Text style={[
                    styles.font30,
                    styles.textBold,
                    styles.mR1
                ]}>
                    From(Datetime) :
                </Text>
                <Text style={[
                    styles.font40
                ]}>
                    {currDate} {datetime}
                </Text>
            </View>
            <View style={[
                styles.flexRow,
                styles.alignCenter,
                styles.mL2
            ]}>
                <Text style={[
                    styles.font30,
                    styles.textBold,
                    styles.mR1
                ]}>
                    To(Datetime) :
                </Text>
                <Text style={[
                    styles.font40
                ]}>
                    {currDate} {datetime}
                </Text>
            </View>
            <View style={[
                styles.flexRow,
                styles.alignCenter,
                styles.mL2
            ]}>
                <Text style={[
                    styles.font30,
                    styles.textBold,
                    styles.mR1
                ]}>
                    Prod. Line :
                </Text>
                <View>
                    <TouchableOpacity onPress={onOpen}>
                        <View style={[
                            styles.backgroundPrimary,
                            styles.justifyCenter,
                            styles.alignCenter,
                            styles.flexRow,
                            styles.border10,
                            styles.pY1,
                            styles.pX2
                        ]}>
                            <Icon name="search" size={30} color={colors.lightColor} />
                            <Text style={[styles.font30, styles.textWhite, styles.mL1]}>Select Prod. Line</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={[
                styles.flexRow,
                styles.alignCenter,
                styles.mL2
            ]}>
                <Text style={[
                    styles.font30,
                    styles.textBold,
                    styles.mR1
                ]}>
                    Total Qty :
                </Text>
                <Text style={[
                    styles.font40
                ]}>
                    {Qty}
                </Text>
            </View>
            <Actionsheet isOpen={isOpen} onClose={onClose}>
                <Actionsheet.Content>
                    <Actionsheet.Item>
                        <View>
                            <TouchableOpacity>
                                <View style={[
                                    styles.flexRow,
                                    styles.justifySpaceBetween,
                                    styles.alignCenter,
                                ]}>
                                    <Icon name="circle" size={20} color={colors.primaryColor} />
                                    <Text style={[styles.font40, styles.mL2]}>data 1</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </Actionsheet.Item>
                    <Actionsheet.Item>
                        <View>
                            <TouchableOpacity>
                                <View style={[
                                    styles.flexRow,
                                    styles.justifySpaceBetween,
                                    styles.alignCenter,
                                ]}>
                                    <Icon name="circle" size={20} color={colors.disableColor} />
                                    <Text style={[styles.font40, styles.mL2]}>data 1</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </Actionsheet.Item>
                    <Actionsheet.Item>
                        <View>
                            <TouchableOpacity>
                                <View style={[
                                    styles.flexRow,
                                    styles.justifySpaceBetween,
                                    styles.alignCenter,
                                ]}>
                                    <Icon name="circle" size={20} color={colors.disableColor} />
                                    <Text style={[styles.font40, styles.mL2]}>data 1</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </Actionsheet.Item>
                </Actionsheet.Content>
            </Actionsheet>

            <View style={[
                styles.mX2,
                styles.flexRow,
                styles.alignCenter,
                styles.justifySpaceAround
            ]}>
                <View style={[
                    styles.mY1
                ]}>
                    <TouchableOpacity
                    >
                        <View style={[
                            styles.bgSuccess,
                            styles.justifyCenter,
                            styles.alignCenter,
                            styles.flexRow,
                            styles.border10,
                            styles.pY100,
                            styles.pX2
                        ]}>
                            <Icon name="hourglass-start" size={70} color={colors.lightColor} />
                            <Text style={[styles.font60, styles.mL2, styles.textWhite]}>START PROCESS</Text>
                        </View>
                    </TouchableOpacity>
                </View> 
                <View>
                    <TouchableOpacity
                    >
                        <View style={[
                            styles.backgroundPrimary,
                            styles.justifyCenter,
                            styles.alignCenter,
                            styles.flexRow,
                            styles.border10,
                            styles.pY100,
                            styles.pX2
                        ]}>
                            <Icon name="hourglass-end" size={70} color={colors.lightColor} />
                            <Text style={[styles.font60, styles.mL2, styles.textWhite]}>END PROCESS</Text>
                        </View>
                    </TouchableOpacity>
                </View> 
            </View>
        </NativeBaseProvider>
    )
}

export default WorkResultInputScreen;