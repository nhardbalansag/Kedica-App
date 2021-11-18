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
    Modal,
    ScrollView
} from 'native-base';

import DeviceInfo from 'react-native-device-info';

import Icon from 'react-native-vector-icons/FontAwesome';

const WorkResultInputScreen = (props) =>{

    const domainSetting = useSelector(state => state.loginCredential.domainSetting);
    const { isOpen, onOpen, onClose } = useDisclose()

    const travelSheetNumber = props.route.params.dataContent.number;

    const traveldata = useSelector(state => state.loginCredential.travelSheet);

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
    const [prodlineButton, setprodlineButton] =  useState(false);
    const [plating, setPlating] =  useState(null);
    const [lotnumber, setlotnumber] =  useState(null);

    const FactoryID = useSelector(state => state.loginCredential.FactoryId);

    const getcurrentdate = () =>{

        const formatYmd = date => date.toISOString().slice(0, 10);

        let date_ob = new Date();
        
        // current hours
        let hours = date_ob.getHours();
        // current minutes
        let minutes = date_ob.getMinutes();
        // current seconds
        let seconds = date_ob.getSeconds();

        // var ampm = hours >= 12 ? 'PM' : 'AM';
        // hours = hours % 12;
        // hours = hours ? hours : 12; // the hour '0' should be '12'
        // minutes = minutes < 10 ? '0' + minutes : minutes;
        // seconds = seconds < 10 ? '0' + seconds : seconds;
        // setAMPM(ampm)
        var dateTimeNow = formatYmd(new Date()) + " " + hours + ":" + minutes + ":" + seconds

        return dateTimeNow;
    }

    const realtime = () =>{
        setInterval(() => {
            setDisplayTime(getcurrentdate())
        }, 1000)
    }

    const startProcess = () =>{
        if(lineId !== null){
            setBoolStartProcess(true)
            setBoolEndProcess(false)
            setstartProcessDateTime(getcurrentdate())
            
            try{
                fetch(domainSetting + "api/production-work/production-work-entry/save-production", {
                    method:'POST',
                    headers:{
                        'Content-type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({
                        TravelSheetID: TravelSheetID,
                        LineID: lineId,
                        DateFrom: getcurrentdate(),
                        FactoryID: FactoryID,
                        DateTo : "1900-01-01 00:00:00"
                    })
                })
                navigate()
            }catch(error){
                alertMessage(error.message);
            }
        }else{
            alertMessageNote("Please Select Production Line");
        }
    }
    
    const endProcess = () =>{
        try{
            fetch(domainSetting + "api/production-work/production-work-entry/update-production-work-date-to", {
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
            navigate()
        }catch(error){
            alertMessage(error.message);
        }
    }

    const cancelProduction = () =>{
        try{
            fetch(domainSetting + "api/production-work/production-work-entry/cancel-production", {
                method:'POST',
                headers:{
                    'Content-type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({
                    TravelSheetID: TravelSheetID,
                })
            })
            navigate()
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
            
            var datael = [];
            for (const key in responseData[0].dataContent){
                if(FactoryID === responseData[0].dataContent[key].LineFactoryID){
                    datael.push(
                        {
                            LineID: responseData[0].dataContent[key].LineID,
                            Line: responseData[0].dataContent[key].Line
                        }
                    )
                }
            }
            checkLineID(datael)
        }catch(error){
            alertMessage(error.message);
        }
    }

    const search = async (tokendata, domainSetting) =>{

        const travelSheetNumber = props.route.params.dataContent.number;

        if(travelSheetNumber.includes("-") && (travelSheetNumber.split("-").length === 3 || travelSheetNumber.split("-").length === 4) && travelSheetNumber.split("-")[0] === "TS"){
            try{
                const response = await fetch(domainSetting + "api/production-work/production-work-entry/search-travelsheet-details", {
                    method:'POST',
                    headers:{
                        'Content-type': 'application/json',
                        'Authorization': 'Bearer ' + tokendata
                    },
                    body: JSON.stringify({
                        TravelSheetNo: travelSheetNumber,
                        FactoryID : FactoryID
                    })
                })
                
                const responseData = await response.json();

                if(responseData[0].total > 0 && ((responseData[0].dataContent[0].DateTo === '1900-01-01 00:00:00' && responseData[0].dataContent[0].DateFrom === '1900-01-01 00:00:00') || (responseData[0].dataContent[0].DateTo === '1900-01-01 00:00:00' && responseData[0].dataContent[0].DateFrom !== '1900-01-01 00:00:00'))){
                    var tempvar = {
                        ID:             responseData[0].dataContent[0].ID,
                        TravelSheetID:  responseData[0].dataContent[0].TravelSheetID,
                        TravelSheetNo:  responseData[0].dataContent[0].TravelSheetNo,
                        ItemCode:       responseData[0].dataContent[0].ItemCode,
                        ItemName:       responseData[0].dataContent[0].ItemName,
                        Qty:            responseData[0].dataContent[0].Qty,
                        Line:           responseData[0].dataContent[0].Line,
                        LotNo:          responseData[0].dataContent[0].LotNo,
                        PlatingLotNo:   responseData[0].dataContent[0].PlatingLotNo,
                        DateFrom:       responseData[0].dataContent[0].DateFrom,
                        DateTo:         responseData[0].dataContent[0].DateTo
                   }
    
                   tempvar.DateFrom == "1900-01-01 00:00:00" ? setBoolStartProcess(false) : setBoolStartProcess(true)
                   tempvar.DateTo == "1900-01-01 00:00:00" ? setBoolEndProcess(false) : setBoolEndProcess(true)
                   setstartedDatetime(tempvar.DateFrom == "1900-01-01 00:00:00" ? null : tempvar.DateFrom)
                   setendDatetime(tempvar.DateTo == "1900-01-01 00:00:00" ? null : tempvar.DateTo)
                   setQty(tempvar.Qty)
                   setTravelSheetID(tempvar.TravelSheetID)
                   setlotnumber(tempvar.LotNo)
                   
                   if(tempvar.Line !== ""){
                        setactiveActionSheetlabel(tempvar.Line)
                        setPlating(tempvar.PlatingLotNo)
                        setprodlineButton(true)
                   }else{
                        getProductLine()
                   }
                   setloading(false)
                }else{
                    alertMessage("Please Scan Pending or Ongoing Travel Sheet");
                }
                
            }catch(error){
                alertMessage(error.message);
            }
        }else{
            alertMessage("Please scan a valid Travel Sheet")
        }
    }
    const navigate = () =>{
        props.navigation.navigate('ProductionWorkEntryScreen',
            {
                url: "api/production-work/production-work-entry/index",
                method: "GET",
                title: "Production Work Entry"
            }
        )
        setloading(false)
    }
    const alertMessage = (message) =>{
        Alert.alert(
            "Note",
            message,
            [
              { 
                  text: "OK", 
                  onPress: () => navigate()}
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

    const checkLineID = async (data) =>{
        var name = await DeviceInfo.getDeviceName()
        var temp = name.split(" ")
        var number = null;
        var displayTitle = ""
        var main_display = ""
        for(let i = 0; i < temp.length; i++){
            if(temp[i].includes('-')){
                var splitnumber = temp[i].split('-')
                number = splitnumber[0]
            }else{
                displayTitle = displayTitle + (temp[i] + " ")
            }
        }

        main_display = displayTitle + (number !== null ? number : "")

        if(data != null){
            let catchPair = false
            for(let i = 0; i < data.length; i++){
                setactiveActionSheetlabel(main_display)
                setProductionLine(data)
                if(data[i].Line === main_display){
                    setLineID(data[i].LineID)
                    catchPair = true
                }
            }
            if(!catchPair){
                alertMessageNote("No Production line Connected to this device Please Setup your device in tablet settings.")
            }
        }
    }

    const closeActionSheet = (prodline, labelTitle) =>{
        setactiveActionSheet(false)
        setLineID(prodline)
        setactiveActionSheetlabel(labelTitle)
    }

    useEffect(() =>{
        realtime();
        search(token, domainSetting)
    },[])

    const mainContent = () =>(
        <NativeBaseProvider>
            <View style={[styles.flexRow,styles.alignCenter,styles.mL2]}>
                <Text style={[styles.font30,styles.textBold,styles.mR1]}>Travel Sheet No. :</Text>
                <Text style={[styles.font40]}>{travelSheetNumber}</Text>
            </View>
            <View style={[styles.flexRow, styles.alignCenter ,styles.mL2]}>
                <View style={[styles.flexRow]}>
                    <View style={[styles.flexRow,styles.alignCenter, styles.w50]}>
                        <Text style={[styles.font30,styles.textBold,styles.mR1]}>Material Lot No. :</Text>
                        <Text style={[styles.font40]}>{lotnumber == null ? "--" : lotnumber}</Text>
                    </View>
                </View>
                <View style={[styles.flexRow,styles.alignCenter]}>
                    <Text style={[styles.font30,styles.textBold,styles.mR1]}>Plating Lot No. :</Text>
                    <Text style={[styles.font40]}>{plating == null ? "--" : plating}</Text>
                </View>
            </View>
            <View style={[styles.flexRow,styles.alignCenter,styles.mL2]}>
                <View style={[styles.flexRow, styles.alignCenter, styles.w50]}>
                    <Text style={[styles.font30,styles.textBold,styles.mR1]}>From(Datetime) :</Text>
                    <Text style={[styles.font40]}>
                        {
                            startedDatetime == null
                                ?
                                    (boolStartProcess ? startProcessDateTime : DisplayTime)
                                :
                                    startedDatetime
                        }
                    </Text>
                </View>
                <View style={[styles.flexRow, styles.alignCenter]}>
                    <Text style={[styles.font30, styles.textBold, styles.mR1]}>To(Datetime) :</Text>
                    <Text style={[styles.font40]}>{endDatetime == null ? DisplayTime : endDatetime}</Text> 
                </View>
            </View>
            <View style={[styles.flexRow,styles.alignCenter,styles.mL2, styles.mB2]}>
                <View style={[styles.flexRow, styles.alignCenter, styles.w50]}>
                    <Text style={[styles.font30,styles.textBold,styles.mR1]}>Prod. Line :</Text>
                    <View>
                        <TouchableOpacity disabled={prodlineButton} onPress={() => actionsheet(true)}>
                            <View style={[!prodlineButton ? styles.backgroundPrimary : styles.bgGray200,styles.justifyCenter,styles.alignCenter,styles.flexRow,styles.border10,styles.pY1,styles.pX2]}>
                                <Text style={[styles.font30, styles.textWhite, styles.mR1]}>{activeActionSheetlabel !== null ? activeActionSheetlabel : "Select Production Line"}</Text>
                                <Icon name="mouse-pointer" size={30} color={colors.lightColor} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={[styles.flexRow, styles.alignCenter]}>
                    <Text style={[styles.font30, styles.textBold, styles.mR1]}>Total Qty :</Text>
                    <Text style={[styles.font40]}>{Qty}</Text>
                </View>
            </View>
            <Actionsheet isOpen={activeActionSheet} onClose={onClose} hideDragIndicator={true}>
                <Actionsheet.Content style={[styles.alignFlexStart]}>
                    <Actionsheet.Item>
                        <View>
                            <TouchableOpacity onPress={() => setactiveActionSheet(false)}>
                                <View style={[styles.flexRow,styles.justifySpaceBetween,styles.alignCenter,styles.pL5]}>
                                    <Icon name="times" size={40} color={colors.dangerColor} />
                                    <Text style={[styles.font40, styles.mL2, styles.textDanger]}>{productionLine == null ? "No production line connected to this device Please Setup your device name in tablet settings." : "Cancel"}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </Actionsheet.Item>
                    <ScrollView>
                        {productionLine != null ?
                            productionLine.map((data, index) => <Actionsheet.Item key={index}>
                                <View>
                                    <TouchableOpacity onPress={() => closeActionSheet(data.LineID, data.Line)}>
                                        <View style={[styles.flexRow,styles.justifySpaceBetween,styles.alignCenter,styles.pL5]}>
                                            <Icon name="circle" size={40} color={lineId == data.LineID ? colors.primaryColor : colors.gray200} />
                                            <Text style={[styles.font40, styles.mL2]}>{data.Line}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </Actionsheet.Item>
                            )
                            :
                            <></>}
                    </ScrollView>
                </Actionsheet.Content>
            </Actionsheet>

            <View style={[styles.flexRow,styles.alignCenter,styles.justifySpaceAround,styles.w100,styles.pB5]}>
                <View style={[styles.w30]}>
                    <TouchableOpacity
                        disabled={boolStartProcess}
                        onPress={() => startProcess()}
                    >
                        <View style={[boolStartProcess ? styles.bgGray200 : styles.bgSuccess,styles.justifyCenter,styles.alignCenter,styles.flexRow,styles.border10,styles.pY100,styles.pX2]}>
                            <>
                                <Icon name={startedDatetime == null ? "hourglass-start" : "exclamation-circle"} size={70} color={colors.lightColor} />
                            </>
                            <Text style={[styles.font60, styles.mL2, styles.textWhite, styles.textCenter]}>
                                {startedDatetime == null ? boolStartProcess ? "Started" : "Start" : (endDatetime == null ? "Ongoing" : "Ended")}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={[styles.w30]}>
                    <TouchableOpacity
                        onPress={() => endProcess()}
                        disabled={!boolStartProcess ? true : (boolEndProcess)}
                    >
                        <View style={[
                            !boolStartProcess ? styles.bgGray200 : (boolEndProcess ? styles.bgGray200 : styles.backgroundPrimary),
                            styles.justifyCenter,
                            styles.alignCenter,
                            styles.flexRow,
                            styles.border10,
                            styles.pY100,
                            styles.pX2
                        ]}>
                            <Icon name={boolEndProcess == null ? "hourglass-end" : "exclamation-circle"} size={70} color={colors.lightColor} />
                            <Text style={[styles.font60, styles.mL2, styles.textWhite, styles.textCenter]}>
                                {boolEndProcess ? "Ended" : "End"}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={[styles.w30]}>
                    <TouchableOpacity onPress={() => cancelProduction()}>
                        <View style={[styles.bgWarning,styles.justifyCenter,styles.alignCenter,styles.flexRow,styles.border10,styles.pY100,styles.pX2]}>
                            <Icon name="times" size={70} color={colors.lightColor} />
                            <Text style={[styles.font60, styles.mL2, styles.textWhite, styles.textCenter]}> Cancel </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </NativeBaseProvider>
    )

     return(
        <NativeBaseProvider>
            <ScrollView>
            {
                !loading  
                ?
                    mainContent()
                :
                    <>
                        <View style={[styles.alignCenter,styles.justifyCenter,styles.flex1]}>
                            <ActivityIndicator  size="large" color={colors.primaryColor}/>
                        </View>
                    </>
            }
            </ScrollView>
        </NativeBaseProvider>
    )
}

export default WorkResultInputScreen;