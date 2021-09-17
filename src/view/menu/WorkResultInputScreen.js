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
    Alert,
    ActivityIndicator
} from "react-native";

import {
    styles,
    colors,
} from "../../asset/css/BaseStyle";

import {
    NativeBaseProvider,
    Actionsheet,
    useDisclose,
    Modal
} from 'native-base';

import Icon from 'react-native-vector-icons/FontAwesome';

const WorkResultInputScreen = (props) =>{

    const domainSetting = useSelector(state => state.loginCredential.domainSetting);

    const { isOpen, onOpen, onClose } = useDisclose()

    const travelSheetNumber = props.route.params.dataContent.number;

    const token = useSelector(state => state.loginCredential.TokenData);

    const [boolStartProcess, setBoolStartProcess] =  useState(false);
    const [boolEndProcess, setBoolEndProcess] =  useState(false);
    const [startProcessDateTime, setstartProcessDateTime] =  useState("");
    const [DisplayTime, setDisplayTime] =  useState();
    const [factoryId, setfactoryId] =  useState(0);
    const [TravelSheetID, setTravelSheetID] =  useState(null);
    const [lineId, setLineID] =  useState(null);
    const [productionLine, setProductionLine] =  useState(null);
    const [Qty, setQty] =  useState(0);
    const [AMPM, setAMPM] =  useState();
    const [startedDatetime, setstartedDatetime] =  useState(null);
    const [endDatetime, setendDatetime] =  useState(null);
    const [loading, setloading] =  useState(true);
    const [activeActionSheet, setactiveActionSheet] =  useState(false);
    const [activeActionSheetlabel, setactiveActionSheetlabel] =  useState(null);

    const getcurrentdate = () =>{

        const formatYmd = date => date.toISOString().slice(0, 10);

        let date_ob = new Date();
        
        // current hours
        let hours = date_ob.getHours();
        // current minutes
        let minutes = date_ob.getMinutes();
        // current seconds
        let seconds = date_ob.getSeconds();

        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        setAMPM(ampm)
        var dateTimeNow = formatYmd(new Date()) + " " + hours + ":" + minutes + ":" + seconds

        return dateTimeNow;
    }

    const realtime = () =>{
        setInterval(() => {
            setDisplayTime(getcurrentdate())
        }, 1000)
    }

    const startProcess = async () =>{
        if(lineId !== null){
            setBoolStartProcess(true)
            setBoolEndProcess(false)
            setstartProcessDateTime(getcurrentdate())
            
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
                        DateFrom: getcurrentdate(),
                        DateTo : "1900-01-01 00:00:00"
                    })
                })

                const responseData = await response.json();

            }catch(error){
                alertMessage(error.message);
            }
        }else{
            alertMessageNote("Please Select Production Line");
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
                    DateTo : getcurrentdate()
                })
            })
            setBoolStartProcess(false)
            props.navigation.navigate('ProductionWorkEntryScreen')
            const responseData = await response.json();
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
        setloading(true)
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

               tempvar.DateFrom == "1900-01-01 00:00:00" ? setBoolStartProcess(false) : setBoolStartProcess(true)
               tempvar.DateTo == "1900-01-01 00:00:00" ? setBoolEndProcess(false) : setBoolEndProcess(true)
               setstartedDatetime(tempvar.DateFrom == "1900-01-01 00:00:00" ? null : tempvar.DateFrom)
               setendDatetime(tempvar.DateTo == "1900-01-01 00:00:00" ? null : tempvar.DateTo)
               setQty(tempvar.Qty)
               setTravelSheetID(tempvar.TravelSheetID)
               setloading(false)
            }else{
                alertMessage("No Data Available");
            }
        }catch(error){
            alertMessage(error.message);
        }
    }

    const ProductionScreen = [
        {
            api: {
                url: "api/production-work/production-work-entry/index",
                method: "GET"
            }
        },
        {
            api: {
                url: "api/quality-inspection/outgoing-inspection/get",
                method: "GET"
            }
        }
    ];

    const alertMessage = (message) =>{
        Alert.alert(
            "Note",
            message,
            [
              { 
                  text: "OK", 
                  onPress: () => props.navigation.navigate('ProductionWorkEntryScreen',
                  {
                    url: "api/production-work/production-work-entry/index",
                    method: "GET",
                    title: "Production Work Entry"
                })}
            ]
        );
    }

    const alertMessageNote = (message) =>{
        Alert.alert(
            "Note",
            message,
            [
              { text: "OK"}
            ]
        );
    }

    const actionsheet = () =>{
        setactiveActionSheet(true)
    }

    const closeActionSheet = (prodline, labelTitle) =>{
        setactiveActionSheet(false)
        setLineID(prodline)
        setactiveActionSheetlabel(labelTitle)
    }

    useEffect(() =>{
        getProductLine()
        search(token, travelSheetNumber, domainSetting)
        realtime();
    },[])

    const mainContent = () =>{
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
                        {
                            startedDatetime == null
                            ?
                                (boolStartProcess ? startProcessDateTime + " " + AMPM : DisplayTime + " " + AMPM)
                            :
                                startedDatetime
                        }
                        
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
                        {
                            endDatetime == null ? DisplayTime + " " + AMPM : endDatetime
                        }
                        
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
                        <TouchableOpacity onPress={ () => actionsheet()}>
                            <View style={[
                                styles.backgroundPrimary,
                                styles.justifyCenter,
                                styles.alignCenter,
                                styles.flexRow,
                                styles.border10,
                                styles.pY1,
                                styles.pX2
                            ]}>
                                <Text style={[styles.font30, styles.textWhite, styles.mR1]}>{activeActionSheetlabel !== null ? activeActionSheetlabel : "Select Production Line"}</Text>
                                <Icon name="mouse-pointer" size={30} color={colors.lightColor} />
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
                
                <Actionsheet isOpen={activeActionSheet} onClose={onClose}  hideDragIndicator={true}>
                    <Actionsheet.Content>
                        <Actionsheet.Item>
                            <View>
                                <TouchableOpacity onPress={() => setactiveActionSheet(false)}>
                                    <View style={[
                                        styles.flexRow,
                                        styles.justifySpaceBetween,
                                        styles.alignCenter,
                                        styles.pL5,
                                    ]}>
                                        <Icon name="times" size={40} color={colors.dangerColor} />
                                        <Text style={[styles.font40, styles.mL2, styles.textDanger]}>Cancel</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </Actionsheet.Item>
                        {
                            productionLine != null?
                            productionLine.map((data, index)=>
                                <Actionsheet.Item key={index}>
                                    <View>
                                        <TouchableOpacity onPress={() => closeActionSheet(data.LineID, data.Line)}>
                                            <View style={[
                                                styles.flexRow,
                                                styles.justifySpaceBetween,
                                                styles.alignCenter,
                                                styles.pL5,
                                            ]}>
                                                <Icon name="circle" size={40} color={lineId == data.LineID ? colors.primaryColor : colors.gray200} />
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
                               <>
                                    <Icon 
                                        name={
                                            startedDatetime == null
                                            ?
                                                "hourglass-start"
                                            :
                                                "exclamation-circle"
                                        }
                                        size={70} 
                                        color={colors.lightColor} 
                                    />
                                </>
                                
                                <Text style={[styles.font60, styles.mL2, styles.textWhite]}> 
                                    {
                                        startedDatetime == null
                                        ?
                                            boolStartProcess ? "Process has started" : "START PROCESS"
                                        :
                                            (endDatetime == null ? "Processing..." : "Process Ended")
                                            
                                    }
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View> 
                    <View>
                        <TouchableOpacity 
                            onPress={() => endProcess()}
                            disabled={
                                !boolStartProcess ? true : (boolEndProcess)
                            }
                        >
                            <View style={[
                                !boolStartProcess ? styles.bgGray200 : (boolEndProcess ? styles.bgGray200 :styles.backgroundPrimary),
                                styles.justifyCenter,
                                styles.alignCenter,
                                styles.flexRow,
                                styles.border10,
                                styles.pY100,
                                styles.pX2
                            ]}>
                                <Icon 
                                    name={
                                        boolEndProcess == null
                                        ?
                                            "hourglass-end"
                                        :
                                            "exclamation-circle"
                                    }
                                    size={70} 
                                    color={colors.lightColor} 
                                />
                                <Text style={[styles.font60, styles.mL2, styles.textWhite]}>
                                    {boolEndProcess ? "Process Ended" : "END PROCESS"}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View> 
                </View>
            </NativeBaseProvider>
        )
    }

     return(
        <>
        {
            !loading  
            ?
                mainContent()
            :
                <>
                    <View style={[
                            styles.alignCenter,
                            styles.justifyCenter,
                            styles.flex1
                        ]}>
                        <ActivityIndicator  size="large" color={colors.primaryColor}/>
                    </View>
                </>
        }
        </>
    )
}

export default WorkResultInputScreen;