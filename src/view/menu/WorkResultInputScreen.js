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
    ActivityIndicator,
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
    ScrollView,
    Input
} from 'native-base';

import DeviceInfo from 'react-native-device-info';

import Icon from 'react-native-vector-icons/FontAwesome';

const WorkResultInputScreen = (props) =>{

    const domainSetting = useSelector(state => state.loginCredential.domainSetting);
    const { isOpen, onOpen, onClose } = useDisclose()

    const travelSheetNumber = props.route.params.dataContent.number;
    const propslineId = props.route.params.dataContent.lineID;

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
    const [ActualQty, setActualQtyQty] =  useState(0);
    const [AMPM, setAMPM] =  useState();
    const [startedDatetime, setstartedDatetime] =  useState(null);
    const [endDatetime, setendDatetime] =  useState(null);
    const [loading, setloading] =  useState(true);
    const [activeActionSheet, setactiveActionSheet] =  useState(false);
    const [activeActionSheetlabel, setactiveActionSheetlabel] =  useState(null);
    const [prodlineButton, setprodlineButton] =  useState(false);
    const [actualqtyState, setactualqtyState] =  useState(false);
    const [plating, setPlating] =  useState(null);
    const [Prevplating, setPrevPlating] =  useState(null);
    const [decBtn, setDecBtn] =  useState(true);
    const [incBtn, setIncBtn] =  useState(true);
    const [sequenceNo, setSequenceNo] =  useState(null);
    const [basesequenceNo, setbaseSequenceNo] =  useState(null);
    const [lotnumber, setlotnumber] =  useState(null);
    const [get_actualQTY, set_actualQTY] = useState(null)
    const [get_actualQTY_display, set_actualQTY_display] = useState(null)

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

    const startProcess =  () =>{
        var actualqty = get_actualQTY ? get_actualQTY : 0
        // navigate()
        if(lineId !== null){
            var sequence_partial = parseInt(sequenceNo);
            var baseseq = parseInt(basesequenceNo)
            if(parseFloat(actualqty) < 0){
                alertMessageNote("Actual Quantity must not less than 0.");
            }
            /* this else statement is for validating the insertion of inputs for sequence number that is less than the previous sequence */
            // else if(sequence_partial <= baseseq){
            //     alertMessageNote("Plating Lot sequence must not less than or equal to " + Prevplating);
            //     setSequenceNo(String(baseseq + 1))
            //     setDecBtn(true)
            // }
            else if(isNaN(sequence_partial) && plating){
                alertMessageNote("Plating lot sequence must be a valid number.");
            }else{
                setBoolStartProcess(true)
                setBoolEndProcess(false)
                setstartProcessDateTime(getcurrentdate())
                console.warn(
                    "Start Process",
                    JSON.stringify({
                        TravelSheetID: TravelSheetID,
                        LineID: lineId,
                        DateFrom: getcurrentdate(),
                        FactoryID: FactoryID,
                        InputSequence: sequenceNo,
                        ActualQty:parseFloat(actualqty),
                        DateTo : "1900-01-01 00:00:00"
                    })
                )
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
                        InputSequence: sequenceNo ? sequenceNo : 0,
                        ActualQty:parseFloat(actualqty),
                        DateTo : "1900-01-01 00:00:00"
                    })
                }).then(data => {
                    if (!data.ok) {
                        throw Error(data.status);
                    }
                    return data.json();
                }).then(responseData => {
                    console.warn("return before validation: " + responseData[0])
                    if(responseData[0].message === "EXIST"){
                        console.log("current plating: " + plating)
                        alertMessageNote("Plating Sequence is already in process!! Try again..");
                        console.warn("exist")
                    }else{
                        setPlating(responseData[0].message)
                        console.warn("success")
                    }
                    console.warn("return After validation", responseData[0])
                }).catch(error => {
                    alertMessageNote(error.message);
                }); 
            }
            
        }else if(lineId === null){
            alertMessageNote("Please Select Production Line");
        }
    }
    
    const endProcess = () =>{
        var actualqty = get_actualQTY ? get_actualQTY : 0
        fetch(domainSetting + "api/production-work/production-work-entry/update-production-work-date-to", {
            method:'POST',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                TravelSheetID: TravelSheetID,
                ActualQty:parseFloat(actualqty),
                DateTo : getcurrentdate()
            })
        }).then(data => {
            if (!data.ok) {
                throw Error(data.status);
            }
            return data.json();
        }).then(responseData => {
            setBoolStartProcess(false)
            navigate()
        }).catch(error => {
            alertMessage(error.message);
        }); 
    }

    const cancelProduction = () =>{
        var actualqty = get_actualQTY ? get_actualQTY : 0
        console.log("cancel => " + actualqty)
        navigate()
        fetch(domainSetting + "api/production-work/production-work-entry/cancel-production", {
            method:'POST',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                TravelSheetID: TravelSheetID,
                ActualQty:parseFloat(actualqty)
            })
        }).then(data => {
            if (!data.ok) {
                throw Error(data.status);
            }
            return data.json();
        }).then(responseData => {
            
        }).catch(error => {
            alertMessage(error.message);
        }); 
    }

    const getProductLine = (labelTitle) =>{
        fetch(domainSetting + "api/production-work/production-work-entry/linel-list/get/" + factoryId, {
            method:'GET',
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
            checkLineID(datael, labelTitle)
            console.warn(datael)
        }).catch(error => {
            alertMessage(error.message);
        }); 
    }

    const search = async (tokendata, domainSetting, propslineId, labelTitle = null) =>{
        console.warn(JSON.stringify({
            TravelSheetNo: travelSheetNumber,
            FactoryID : FactoryID,
            LineID : propslineId,
        }))
        console.warn("action sheet title: " + labelTitle)
        const travelSheetNumber = props.route.params.dataContent.number;
       
        if(travelSheetNumber.includes("-") && (travelSheetNumber.split("-").length === 3 || travelSheetNumber.split("-").length === 4) && travelSheetNumber.split("-")[0] === "TS"){
            await fetch(domainSetting + "api/production-work/production-work-entry/search-travelsheet-details", {
                method:'POST',
                headers:{
                    'Content-type': 'application/json',
                    'Authorization': 'Bearer ' + tokendata
                },
                body: JSON.stringify({
                    TravelSheetNo: travelSheetNumber,
                    FactoryID : FactoryID,
                    LineID : propslineId,
                })
            }).then(data => {
                if (!data.ok) {
                    throw Error(data.status);
                }
                return data.json();
            }).then(responseData => {
                if(responseData[0].total > 0 && ((responseData[0].dataContent[0].DateTo === '1900-01-01 00:00:00' && responseData[0].dataContent[0].DateFrom === '1900-01-01 00:00:00') || (responseData[0].dataContent[0].DateTo === '1900-01-01 00:00:00' && responseData[0].dataContent[0].DateFrom !== '1900-01-01 00:00:00'))){
                    var tempvar = {
                        ID:             responseData[0].dataContent[0].ID,
                        TravelSheetID:  responseData[0].dataContent[0].TravelSheetID,
                        TravelSheetNo:  responseData[0].dataContent[0].TravelSheetNo,
                        ItemCode:       responseData[0].dataContent[0].ItemCode,
                        ItemName:       responseData[0].dataContent[0].ItemName,
                        Qty:            responseData[0].dataContent[0].Qty,
                        ActualQty:      responseData[0].dataContent[0].ActualQty,
                        Line:           responseData[0].dataContent[0].Line,
                        LotNo:          responseData[0].dataContent[0].LotNo,
                        PlatingLotNo:   responseData[0].dataContent[0].PlatingLotNo,
                        DateFrom:       responseData[0].dataContent[0].DateFrom,
                        DateTo:         responseData[0].dataContent[0].DateTo
                    }
                    console.warn(responseData[0].PlatingContent[0])

                    tempvar.DateFrom == "1900-01-01 00:00:00" ? setBoolStartProcess(false) : setBoolStartProcess(true)
                    tempvar.DateTo == "1900-01-01 00:00:00" ? setBoolEndProcess(false) : setBoolEndProcess(true)
                    setstartedDatetime(tempvar.DateFrom == "1900-01-01 00:00:00" ? null : tempvar.DateFrom)
                    setendDatetime(tempvar.DateTo == "1900-01-01 00:00:00" ? null : tempvar.DateTo)
                    setQty(tempvar.Qty)
                    setTravelSheetID(tempvar.TravelSheetID)
                    setlotnumber(tempvar.LotNo)
                    
                    if(responseData[0].PlatingContent.length > 0){
                        setPrevPlating(responseData[0].PlatingContent[0].PlatingLotNo)
                        var seq = parseInt(responseData[0].PlatingContent[0].PlatingLotNo.split('-')[2]) + 1
                        setSequenceNo(seq)
                        setbaseSequenceNo(parseInt(responseData[0].PlatingContent[0].PlatingLotNo.split('-')[2]))
                    }else{
                        setPrevPlating(null)
                        setSequenceNo(null)
                        setbaseSequenceNo(null)
                    }

                    if(tempvar.Qty > 0){
                        setactualqtyState(true)
                        setActualQtyQty(tempvar.ActualQty)
                    }
                    set_actualQTY(tempvar.ActualQty)
                    set_actualQTY_display(tempvar.ActualQty)
                    
                    if(tempvar.Line !== ""){
                        setactiveActionSheetlabel(tempvar.Line)
                        setPlating(tempvar.PlatingLotNo)
                        setprodlineButton(true)
                    }else{
                        getProductLine(labelTitle)
                    }
                    setloading(false)
                }else{
                    alertMessage("Please Scan Pending or Ongoing Travel Sheet " + travelSheetNumber);
                }   
            }).catch(error => {
                alertMessage(error.message);
            }); 
        }else{
            alertMessage("Please scan a valid Travel Sheet - " + travelSheetNumber)
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

    const checkLineID = async (data, label = null) =>{
        var name = await DeviceInfo.getDeviceName()
        console.log("device name: " + name)
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
                setactiveActionSheetlabel(label ? label : main_display)
                setProductionLine(data)
                var line_db = String(data[i].Line)
                var line_dip = String(main_display)
                // if(line_dip.charAt(line_dip.length - 1) === " "){
                //     line_dip = line_dip.slice(0, -1)
                // }
                // if(line_db.includes(line_dip)){
                //     setLineID(data[i].LineID)
                //     catchPair = true
                // }

                if(line_db.includes(name)){
                    setLineID(data[i].LineID)
                    catchPair = true
                    console.log("Line ID: " + data[i].LineID)
                }
            }
            if(!catchPair){
                alertMessageNote("No Production line Connected to this device Please Setup your device in tablet settings.")
            }
        }
    }

    const incrementOPlatingSequence = () => {
        // sequenceNo, setSequenceNo
        var tempCtr = parseInt(sequenceNo) + 1
        var tempCtrDisplay = parseInt(sequenceNo)
        var baseSequence = parseInt(basesequenceNo)
        setSequenceNo(sequenceNo => (parseInt(tempCtr)))
        
        if((tempCtr - 1) > baseSequence){
            setDecBtn(false)
        }
    }

    const decrementOPlatingSequence = () => {
        // sequenceNo, setSequenceNo
        console.log(sequenceNo)

        var tempCtr = parseInt(sequenceNo) - 1
        var baseSequence = parseInt(basesequenceNo)
        setSequenceNo(sequenceNo => (parseInt(tempCtr)))
        console.log(tempCtr, baseSequence)
        if(tempCtr > baseSequence){
            setDecBtn(false)
            setSequenceNo(sequenceNo => (parseInt(tempCtr)))
            if((tempCtr - 1) <= baseSequence){
                setDecBtn(true)
            }
        }else if((tempCtr - 1) <= baseSequence){
            setDecBtn(true)
        }
    }

    const closeActionSheet = (prodline, labelTitle) =>{
        setactiveActionSheet(false)
        setLineID(prodline)
        search(token, domainSetting, prodline, labelTitle)
        console.warn("close Sheet", token, domainSetting, prodline)
    }

    const platingLotSequence = (data) =>{
       
        var futureSequence = parseInt(sequenceNo)

        if(isNaN(parseInt(data))){
            setSequenceNo(0)
        }else if(futureSequence === 0 && parseInt(data) > futureSequence ){
            var input = parseInt(data)
            setSequenceNo(input)
            if(input > futureSequence){
                setDecBtn(false)
            }else{
                setDecBtn(true)
            }
            setSequenceNo(String(input))
        }else if(parseInt(data) > 0){
            var input = parseInt(data)
            futureSequence = String(input)
            setSequenceNo(String(futureSequence))
            if(parseInt(futureSequence) > parseInt(basesequenceNo)){
                setDecBtn(false)
            }else{
                setDecBtn(true)
            }
        }
    }

    useEffect(() =>{
        realtime();
        search(token, domainSetting, propslineId)
    },[])

    const mainContent = () =>(
        <NativeBaseProvider>
            <View style={[styles.flexRow,styles.alignCenter,styles.mL2]}>
                <View style={[styles.flexRow,styles.alignCenter, styles.w50]}>
                    <Text style={[styles.font30,styles.textBold,styles.mR1]}>Travel Sheet No. :</Text>
                    <Text style={[styles.font40]}>{travelSheetNumber}</Text>
                </View>
                {
                    plating
                    ?
                        <></>
                    :
                        <>
                            <View style={[styles.flexRow,styles.alignCenter]}>
                                <Text style={[styles.font30,styles.textBold,styles.mR1]}>Prev. Plate No. :</Text>
                                <Text style={[styles.font40, styles.mX1, styles.textDanger]}>{Prevplating == null ? "--" : Prevplating}</Text>
                            </View>
                        </>
                }
                
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
                    <View style={[styles.flexRow, styles.alignCenter]}>
                        {
                            plating
                            ?
                                <><Text style={[styles.font40]}>{plating == null ? "--" : plating}</Text></>
                            :
                                <>
                                    <Text style={[styles.font40]}>{Prevplating == null ? "--" : (Prevplating.split('-')[0] +"-"+Prevplating.split('-')[1] + "-")}</Text>
                                    {
                                        Prevplating
                                        ?
                                            <>
                                                <View style={[styles.w15]}>
                                                    <Input
                                                        disableFullscreenUI={true}
                                                        size="2xl"
                                                        keyboardType={'numeric'}
                                                        minLength={0}
                                                        // onChangeText={(text) => setSequenceNo(text)}
                                                        onChangeText={(text) => platingLotSequence(text)}
                                                        value={String(sequenceNo)}
                                                        style={[styles.textDanger, styles.textBold, styles.font30]}
                                                    /> 
                                                </View>  
                                                <View style={[styles.mL1]}>
                                                    <TouchableOpacity  onPress={() => incrementOPlatingSequence()}>
                                                        <View style={[incBtn ? styles.backgroundPrimary : styles.bgGray200,styles.justifyCenter,styles.alignCenter,styles.flexRow,styles.border10,styles.pX1, styles.mR1]}>
                                                            <Icon name="caret-up" size={50} color={colors.lightColor} />
                                                        </View>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity disabled={decBtn ? true : false} onPress={() => decrementOPlatingSequence()}>
                                                        <View style={[!decBtn ? styles.backgroundPrimary : styles.bgGray200,styles.justifyCenter,styles.alignCenter,styles.flexRow,styles.border10,styles.pX1, styles.mR1]}>
                                                            <Icon name="caret-down" size={50} color={colors.lightColor} />
                                                        </View>
                                                    </TouchableOpacity> 
                                                </View>
                                            </>
                                        :
                                            <></>
                                    }
                                </>
                        }
                        {/* <Text style={[styles.font40]}>{plating == null ? "--" : plating}</Text> */}
                    </View>
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
                        <TouchableOpacity disabled={prodlineButton} onPress={() => setactiveActionSheet(true)}>
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
            <View style={[styles.flexRow,styles.alignCenter,styles.mL2, styles.mB2]}>
                <View style={[styles.flexRow, styles.alignCenter]}>
                    <Text style={[styles.font30, styles.textBold, styles.mR1]}>Actual Qty :</Text>
                    <Input
                        disableFullscreenUI={true}
                        size="2xl"
                        _light={{
                            placeholderTextColor: "blueGray.400",
                        }}
                        _dark={{
                            placeholderTextColor: "blueGray.50",
                        }}
                        keyboardType={'numeric'}
                        minLength={0}
                        onChangeText={(text) => set_actualQTY(text)}
                        value={String(get_actualQTY)}
                    />      
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
                        <View style={[styles.alignCenter,styles.justifyCenter, styles.flex2]}>
                            <ActivityIndicator size="large" color={colors.primaryColor}/>
                            <Text style={[styles.font30, styles.textLightBlue]}>Loading..</Text>
                        </View>
                    </>
            }
            </ScrollView>
            
        </NativeBaseProvider>
    )
}

export default WorkResultInputScreen;