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
    TouchableOpacity,
    Alert
} from "react-native";

import {
    styles,
    colors,
} from "../../asset/css/BaseStyle";

import Moment from 'react-moment';

import CustomStyle from "../../asset/css/CustomStyle";

import {
    NativeBaseProvider,
    Actionsheet,
    useDisclose,
} from 'native-base';

import Icon from 'react-native-vector-icons/FontAwesome';

const WorkResultInputScreen = (props) =>{

    const domainSetting = useSelector(state => state.loginCredential.domainSetting);

    const { isOpen, onOpen, onClose } = useDisclose()

    const travelSheetNumber = props.route.params.dataContent.number;

    const token = useSelector(state => state.loginCredential.TokenData);

    const [datetime, setDaytimes] =  useState();
    const [boolStartProcess, setBoolStartProcess] =  useState(false);
    const [currDate, setCurrDate] =  useState();
    const [factoryId, setfactoryId] =  useState(0);
    const [TravelSheetID, setTravelSheetID] =  useState(null);
    const [lineId, setLineID] =  useState(null);
    const [productionLine, setProductionLine] =  useState(null);
    const [Qty, setQty] =  useState(0);
    const [FromDate, setFromDate] =  useState("");
    const [ToDate, setToDate] =  useState("");

    const startProcess = async () =>{
        setBoolStartProcess(true)
        try{
            const response = await fetch(domainSetting + "api/production-work/production-work-entry/save-production", {
                method:'POST',
                headers:{
                    'Content-type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({
                    TravelSheetID: TravelSheetID,
                    LineID: lineId,
                    DateFrom: FromDate,
                    DateTo : ToDate
                })
            })

            const responseData = await response.json();
            console.warn(responseData)

        }catch(error){
            alertMessage(error.message);
        }
    }
    
    const endProcess = async () =>{
        try{
            const response = await fetch(domainSetting + "api/production-work/production-work-entry/update-production-work-date-to", {
                method:'POST',
                headers:{
                    'Content-type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({
                    TravelSheetID: TravelSheetID,
                    DateTo : ToDate
                })
            })
            setBoolStartProcess(false)
            props.navigation.navigate('ProductionWorkEntryScreen')
            const responseData = await response.json();
            console.warn(responseData)
            
        }catch(error){
            alertMessage(error.message);
        }
    }

    const getProductLine = async () =>{
        try{
            const response = await fetch(domainSetting + "api/production-work/production-work-entry/linel-list/get/" + factoryId, {
                method:'GET',
                headers:{
                    'Content-type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            })

            const responseData = await response.json();
            
            setProductionLine(responseData[0].dataContent)
        }catch(error){
            alertMessage(error.message);
        }
    }

    const search = async (tokendata, param, domainSetting) =>{
        try{
            const response = await fetch(domainSetting + "api/production-work/production-work-entry/search-travelsheet-details/" + param, {
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
               setTravelSheetID(tempvar.TravelSheetID)
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
            setFromDate(currDate + " " + datetime)
            setToDate(currDate + " " + datetime)
        }, 1000)
    }

    useEffect(() =>{
        getProductLine()
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
                    {/* {currDate} {datetime} */}
                    <Moment format="YYYY-MM-DD HH:mm:ss A">
                        1976-04-19T12:59-0500
                    </Moment>
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
                    {
                        productionLine != null?
                        productionLine.map((data, index)=>
                            <Actionsheet.Item key={index}>
                                <View>
                                    <TouchableOpacity onPress={() => setLineID(data.LineID)}>
                                        <View style={[
                                            styles.flexRow,
                                            styles.justifySpaceBetween,
                                            styles.alignCenter,
                                        ]}>
                                            <Icon name="circle" size={20} color={lineId == data.LineID ? colors.primaryColor : colors.gray200} />
                                            <Text style={[styles.font40, styles.mL2]}>{data.Line}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </Actionsheet.Item>
                        )
                        :
                        <></>
                    }
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
                        disabled={boolStartProcess}
                        onPress={() => startProcess()}
                    >
                        <View style={[
                            boolStartProcess ? styles.bgGray200 :styles.bgSuccess ,
                            styles.justifyCenter,
                            styles.alignCenter,
                            styles.flexRow,
                            styles.border10,
                            styles.pY100,
                            styles.pX2
                        ]}>
                            <Icon name="hourglass-start" size={70} color={colors.lightColor} />
                            <Text style={[styles.font60, styles.mL2, styles.textWhite]}> 
                                {boolStartProcess ? "Starting Process..." : "START PROCESS"}</Text>
                        </View>
                    </TouchableOpacity>
                </View> 
                <View>
                    <TouchableOpacity
                        onPress={() => endProcess()}
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