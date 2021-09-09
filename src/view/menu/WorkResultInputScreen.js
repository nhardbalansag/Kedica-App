import React,
{
    useState,
    useEffect
} from "react";

import { 
    View,
    Text,
    ScrollView,
    KeyboardAvoidingView,
    Image,
    TouchableOpacity,
    Switch,
    FlatList,
} from "react-native";

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

    const { isOpen, onOpen, onClose } = useDisclose()

    const travelSheetNumber = props.route.params.dataContent.number;

    const [datetime, setDaytimes] =  useState();
    const [currDate, setCurrDate] =  useState();

    const realtime = () =>{
        setInterval(() => {
            var dt = new Date().toLocaleTimeString();
            var d = new Date().toDateString();
            setDaytimes(dt);
            setCurrDate(d);
        }, 1000)
    }

    useEffect(() =>{
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
                    2021-09-08 11:28:23 AM
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
                    1000
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