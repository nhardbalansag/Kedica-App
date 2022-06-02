import React,
{
    useState,
    useEffect,
    useRef
} from "react";

import { 
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    FlatList,
    Alert,
    ActivityIndicator,
    RefreshControl,
    TextInput 
} from "react-native";

import DeviceInfo from 'react-native-device-info';

import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';

import { DataTable } from 'react-native-paper';

import {
    styles,
    colors,
} from "../../asset/css/BaseStyle";

import CustomStyle from "../../asset/css/CustomStyle";

import { useIsFocused } from "@react-navigation/native";

import {
    NativeBaseProvider,
    FormControl,
    useDisclose,
    Actionsheet,
} from 'native-base';

import { 
    useSelector
} from "react-redux";

import Icon from 'react-native-vector-icons/FontAwesome';
import { parse } from "react-native-svg";

import DatePicker from 'react-native-datepicker'

const table = {
    dataFilter: [
        {filterType: "Start Process",       value: "StartProcess"},
        {filterType: "End Process",         value: "EndProcess"},
        {filterType: "Travel Sheet No.",    value: "TravelSheetNo"},
        {filterType: "Plating Lot No.",     value: "PlatingLotNo"},
        {filterType: "Product Name",        value: "ItemName"},
        // {filterType: "Lot No.",             value: "LotNo"},
        {filterType: "Priority No.",        value: "PriorityNo"},
        {filterType: "Age",                 value: "Age"}
        // {filterType: "Ship Date",           value: "ShipDate"}
    ],
    data_width: [300, 300, 500, 500, 500, 500, 300],
    tableHead: ['Start Process', 'End Process', 'Travel Sheet No.', 'Plating Lot No.', 'Product Name', 'Priority No.', 'Age'],
}

const getcurrentdate = () =>{
    const formatYmd = date => date.toISOString().slice(0, 10);
    var dateTimeNow = formatYmd(new Date())
    return dateTimeNow;
}

const getTommorowDate = () =>{
    const formatYmd = date => date.toISOString().slice(0, 10);
    var dateTimeTom = formatYmd(new Date(Date.now() + (3600 * 1000 * 24)))
    return dateTimeTom;
}

const ProductionWorkEntryScreen = (props) =>{

    const { isOpen, onOpen, onClose } = useDisclose()
    const textInputRef = useRef();
    
    const isFocused = useIsFocused();
    const [isEnable, setIsEnable] = useState(false);
    const [travelSheetNo, setTravelSheetNo] = useState(null);
    // const [travelSheetNo, setTravelSheetNo] = useState("TS-20220530-027");
    const [pageStart, setpagestart] = useState(0);
    const [pagelength, setpagelength] = useState(5);
    const [totaldata, settotaldata] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [activeActionSheet, setactiveActionSheet] =  useState(false);
    const [activeActionSheetFilterdate, setactiveActionSheetFilterdate] =  useState(false);
    const [filterData, setfilterData] =  useState("All");
    const [filterDate, setfilterDate] =  useState("Today");
    const [currentComponent, setcurrentComponent] =  useState("");
    const [column_state, set_column_state] = useState("StartProcess");
    const [sort_state, set_sort_state] = useState("desc");
    const [lineId, setLineID] =  useState(null);
    const [DateFilter, setDateFilter] =  useState(0);
    const [factoryId, setfactoryId] =  useState(0);

    const [OutGoingDateFrom, setOutGoingDateFrom] =  useState(getcurrentdate());
    const [OutGoingDateTo, setOutGoingDateTo] =  useState(getTommorowDate());
    const limiters = [19]

    const FactoryID = useSelector(state => state.loginCredential.FactoryId);

    const [WorkEntry, setWorkEntry] = useState(null);
    
    const token = useSelector(state => state.loginCredential.TokenData);

    const domainSetting = useSelector(state => state.loginCredential.domainSetting);

    const dataFilter = [
        {filterType: "Ongoing", value: "Ongoing"},
        {filterType: "Pending", value: "Pending"},
        {filterType: "All", value: "All"},
    ]

    const dateFilter = [
        {title: "Today", value: 0},
        {title: "3 days", value: 2},
        {title: "7 days", value: 6},
        {title: "14 days", value: 13},
        {title: "21 days", value: 20},
        {title: "28 days", value: 27},
        {title: "All", value: -1}
    ]

    const actionsheet = () =>{
        setactiveActionSheet(true)
    }

    const closeActionSheet = (filter) =>{
        setactiveActionSheet(false)
        setfilterData(filter)
    }

    const actionsheetDateFilter = () =>{
        setactiveActionSheetFilterdate(true)
    }

    const closeActionSheetFilterdate = (filter, title) =>{
        setactiveActionSheetFilterdate(false)
        setfilterDate(title)
        setDateFilter(filter)
    }

    const nextpage = () =>{
        var newpagestart = parseInt(pageStart) + parseInt(pagelength); 
        if(newpagestart > totaldata){
            var length = newpagestart - totaldata
            newpagestart = newpagestart - length
            getProductionWorkEntryList(newpagestart, length, sort_state, column_state, lineId)
        }else{
            getProductionWorkEntryList(newpagestart, pagelength, sort_state, column_state, lineId)
        }
    }

    const prevpage = () =>{
        var newpagestart = parseInt(pageStart) - parseInt(pagelength); 
        if(newpagestart <= 0){
            newpagestart = 0
        }
        getProductionWorkEntryList(newpagestart, pagelength, sort_state, column_state, lineId)
    }

    const checkLineID = async (data) =>{
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
                var line_db = String(data[i].Line)
                console.log(line_db + " AND " + name)
                if(line_db.includes(name)){
                    setLineID(data[i].LineID)
                    getProductionWorkEntryList(0, 5, sort_state, column_state, data[i].LineID)
                    catchPair = true
                    console.log("Line ID: " + data[i].LineID)
                    console.log("Catch pair: " + line_db + " AND " + name)
                }
            }

            if(!catchPair){
                alertMessage("No Production line Connected to this device Please Setup your device in tablet settings.")
            }
        }
    }

    const getProductLine = () =>{
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
            console.log("getProductLine", responseData[0].dataContent)
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
        }).catch(error => {
            alertMessage(error.message);
        }); 
    }

    const getProductionWorkEntryList = async (PageStart, PageLength, order_status, order_column, lineid) =>{
        console.warn("start line id", lineid)
        lineid > 0 ? setLineID(lineid) : lineid
        setpagestart(PageStart)
        const apiUrl = props.route.params.url;
        const componentTitle = props.route.params.title;
        set_column_state(order_column)
        set_sort_state(order_status)
        setcurrentComponent(componentTitle)
        setRefreshing(true);
        console.warn(
            "request link: " + domainSetting + apiUrl,
            "component title: " + componentTitle,
            JSON.stringify({
                sortColumnName:order_column,
                sortDirection:order_status,
                FactoryID: FactoryID,
                PageStart: PageStart ? PageStart : 0,
                PageLength: PageLength ? PageLength : 5,
                LineID: parseInt(lineid ? lineid : (lineId ? lineId : 0)),
                DateFilter: parseInt(DateFilter ? DateFilter : 0),
                filterData: filterData,
                QueryFilter: -1,
                OutGoingDateFrom: OutGoingDateFrom,
                OutGoingDateTo: OutGoingDateTo
            })
        )
        await fetch(domainSetting + apiUrl, {
            method:"POST",
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                sortColumnName:order_column,
                sortDirection:order_status,
                FactoryID: FactoryID,
                PageStart: PageStart ? PageStart : 0,
                PageLength: PageLength ? PageLength : 5,
                LineID: parseInt(lineid ? lineid : (lineId ? lineId : 0)),
                DateFilter: parseInt(DateFilter ? DateFilter : 0),
                filterData: filterData,
                QueryFilter: -1,
                OutGoingDateFrom: OutGoingDateFrom,
                OutGoingDateTo: OutGoingDateTo
            })
        }).then(data => {
            if (!data.ok) {
                throw Error(data.status);
            }
            return data.json();
        }).then(responseData => {
            console.log("getProductionWorkEntryList", responseData[0].dataContent)
            console.log("total data", responseData[0].total)
            settotaldata(responseData[0].total)
            var datael = [];
            if(!responseData[0].status){
                alertMessage("An Error Occured: No data fetched");
            }else{
                for (const key in responseData[0].dataContent){
                    if(componentTitle !== "Outgoing Inspection"){
                        datael.push(
                            [
                                responseData[0].dataContent[key].StartProcess == "1900-01-01 00:00:00" ? "" : responseData[0].dataContent[key].StartProcess,
                                responseData[0].dataContent[key].EndProcess == "1900-01-01 00:00:00" ? "" : responseData[0].dataContent[key].EndProcess,
                                responseData[0].dataContent[key].TravelSheetNo,
                                responseData[0].dataContent[key].PlatingLotNo,
                                responseData[0].dataContent[key].ItemCode + "\n" + responseData[0].dataContent[key].ItemName,
                                // responseData[0].dataContent[key].LotNo,
                                responseData[0].dataContent[key].Priority,
                                responseData[0].dataContent[key].Age + " Days",
                                // responseData[0].dataContent[key].ShipDate,
                            ]
                        )
                    }else{
                        datael.push(
                            [
                                responseData[0].dataContent[key].StartProcess == "1900-01-01 00:00:00" ? "" : responseData[0].dataContent[key].StartProcess,
                                responseData[0].dataContent[key].EndProcess == "1900-01-01 00:00:00" ? "" : responseData[0].dataContent[key].EndProcess,
                                responseData[0].dataContent[key].TravelSheetNo,
                                responseData[0].dataContent[key].PlatingLotNo,
                                responseData[0].dataContent[key].ItemCode + "\n" + responseData[0].dataContent[key].ItemName,
                                // responseData[0].dataContent[key].LotNo,
                                responseData[0].dataContent[key].Priority,
                                responseData[0].dataContent[key].Age + " Days",
                                // responseData[0].dataContent[key].ShipDate,
                            ]
                        )
                    }
                }
                console.log("return data", datael, filterData)
                setWorkEntry(datael)
            }
            setRefreshing(false);
        }).catch(error => {
            setRefreshing(false);
            alertMessage(error.message);
        });   
    }

    const alertMessage = (message) =>{
        Alert.alert(
            "Note",
            message,
            [
              { text: "OK", onPress: () => setTravelSheetNo(null) }
            ]
        );
    }

    const goToWorkResult = (component, travelsheetno) =>{
        const componentTitle = props.route.params.title;
        var testlineid = lineId
        console.warn("line id: " + testlineid)
        setTravelSheetNo(null)
        props.navigation.navigate(componentTitle === "Outgoing Inspection" ? "InscpectionDetails": component, 
            {
                title: (component === "WorkResultInputScreen" ? "Work Result Input" : (component === "InscpectionDetails" ? "OQC Result Input" : "") ),
                dataContent: {
                    number: travelsheetno,
                    lineID: testlineid,
                }
            }
        )
    }

    const refreshPage = () =>{
        getProductionWorkEntryList(pageStart, pagelength, sort_state, column_state, lineId)
    }
    
    useEffect(() =>{
        
        if(isFocused){
            setpagestart(0)
            setpagelength(5)
            getProductLine();
            if(travelSheetNo !== null){
                props.route.params.title === "Outgoing Inspection" ? goToWorkResult("InscpectionDetails", travelSheetNo) : goToWorkResult("WorkResultInputScreen", travelSheetNo)
            }
        }
        if(textInputRef.current){
            const unsubscribe = props.navigation.addListener('focus', () => {
              textInputRef.current?.focus()
            });
           return unsubscribe;
        }
    },[travelSheetNo, isFocused, filterData, textInputRef, OutGoingDateTo, OutGoingDateFrom, DateFilter])

    const datepickerFrom = () => {
        return(
            <View style={[styles.flexRow]}>
                <View style={[styles.mR1]}>
                    <Text style={[styles.font20]}>From</Text>
                    <DatePicker
                        style={{width: 150}}
                        date={OutGoingDateFrom}
                        mode="date"
                        placeholder="select date"
                        format="YYYY-MM-DD"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                            dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 4,
                                marginLeft: 0
                            },
                            dateInput: {
                                marginLeft: 36,
                            }
                        }}
                        onDateChange={(date) => {setOutGoingDateFrom(date)}}
                    />
                </View>
                <View>
                    <Text style={[styles.font20]}>To</Text>
                    <DatePicker
                        style={{width: 150}}
                        date={OutGoingDateTo}
                        mode="date"
                        placeholder="select date"
                        format="YYYY-MM-DD"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                            dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 4,
                                marginLeft: 0
                            },
                            dateInput: {
                                marginLeft: 36
                            }
                        }}
                        onDateChange={(date) => {setOutGoingDateTo(date)}}
                    />
                </View>
            </View>
        )
    }

    const tableComponent = () =>{
        return(
            <ScrollView horizontal>
                <DataTable style={[styles.mT1]}>
                    <DataTable.Header style={[styles.bgGray200]}>
                        {
                            table.tableHead !== null ?
                                table.tableHead.map((rowData, index) => (
                                    <DataTable.Title style={[styles.justifyCenter, {width: table.data_width[index]}]} key={index} sortDirection={sort_state == "asc" ? "ascending" : "descending"}>
                                        <TouchableOpacity 
                                        onPress={() =>{
                                            set_column_state(table.dataFilter[index].value); 
                                            setpagestart(0);
                                            setpagelength(5);
                                            getProductionWorkEntryList(0, 5, sort_state == "asc" ? "desc": "asc", table.dataFilter[index].value, lineId)
                                        }}>
                                            <Text style={[styles.font25, styles.textWhite]} >{rowData}</Text>
                                        </TouchableOpacity>
                                    </DataTable.Title>
                                ))
                            :<></>
                        }
                    </DataTable.Header>
                        {
                            WorkEntry !== null ?
                                WorkEntry.map((rowData, index) => (
                                    <DataTable.Row>
                                        {
                                            rowData.map((cellData, cellIndex) => (
                                                <DataTable.Cell key={cellIndex} style={[styles.justifyCenter, {width: table.data_width[cellIndex]}]}>
                                                    <TouchableOpacity 
                                                        onPress={() => props.route.params.title === "Outgoing Inspection" ? goToWorkResult("InscpectionDetails", rowData[2]) : goToWorkResult("WorkResultInputScreen", rowData[2])}
                                                    >
                                                        <View style={[styles.justifyCenter,styles.alignCenter, styles.flexRow ]}>
                                                            <Text style={[styles.font25, styles.mL1]}>{cellData ? cellData : "--"}</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                </DataTable.Cell>
                                            ))
                                        }
                                    </DataTable.Row>
                                ))
                            :<></>
                        }
                </DataTable>
            </ScrollView>
        )
    }

    const loadbutton = () =>{
        return(
            <View style={[styles.flexRow, styles.justifySpaceAround,styles.alignCenter]}>
                {
                    totaldata 
                    ?
                        <>
                            <View style={[styles.w30]}>
                                <Text style={[styles.font25]}>Showing {pageStart + 1} to {parseInt(pageStart) + parseInt(pagelength)} of {totaldata} Items</Text>
                            </View>
                            <View style={[styles.w60, styles.flexRow, styles.justifyStart,styles.alignCenter,styles.mT2,styles.mB3]}>
                                <TouchableOpacity disabled={(parseInt(pageStart)) > 0 ? false : true} onPress={() => prevpage()}>
                                    <View style={[(parseInt(pageStart)) > 0 ? styles.backgroundPrimary : styles.bgGray200,styles.justifyCenter,styles.alignCenter,styles.flexRow,styles.border10,styles.pY1,styles.pX2, styles.mR1]}>
                                        {
                                            refreshing
                                            ?
                                                <>
                                                    <ActivityIndicator style={[styles.w10]}  size={20} color={colors.lightColor}/>
                                                    <Text style={[styles.font30, styles.textWhite, styles.mL1]}>Prev</Text>
                                                </>
                                            :
                                            <>
                                                <Icon name="caret-left" size={30} style={[styles.w10]} color={colors.lightColor} />
                                                <Text style={[styles.font30, styles.textWhite, styles.mL1]}>Prev</Text>
                                            </>
                                        }
                                    </View>
                                </TouchableOpacity>
                                
                                <TouchableOpacity disabled={(parseInt(pageStart) + parseInt(pagelength)) >= totaldata ? true : false} onPress={() => nextpage()}>
                                    
                                    <View style={[(parseInt(pageStart) + parseInt(pagelength)) >= totaldata ? styles.bgGray200 : styles.backgroundPrimary,styles.justifyCenter,styles.alignCenter,styles.flexRow,styles.border10,styles.pY1,styles.pX2, styles.mL1]}>
                                    {
                                        refreshing
                                        ?
                                            <>
                                                <Text style={[styles.font30, styles.textWhite, styles.mR1]}>Next</Text>
                                                <ActivityIndicator style={[styles.w10]} size={20} color={colors.lightColor}/>
                                            </>
                                        :
                                        <>
                                            <Text style={[styles.font30, styles.textWhite, styles.mR1]}>Next</Text>
                                            <Icon name="caret-right" style={[styles.w10]} size={30} color={colors.lightColor} />
                                        </>
                                    }
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </>
                    :
                        <>
                            <View style={[styles.w30]}>
                                <Text style={[styles.font25, styles.textCenter]}>{totaldata} Items to show, please Reload</Text>
                            </View>
                        </>
                }
                
            </View>
        )
    }
    
    return(
        <NativeBaseProvider>
            <View style={[styles.mT1]}>
                <View style={[styles.flexRow,styles.justifySpaceAround,styles.alignFlexEnd]}>
                    <View style={[styles.w50]}>
                        <FormControl>
                            <TextInput  
                                ref={textInputRef}
                                disableFullscreenUI={true}
                                style={[styles.font25,styles.borderedNoRadius,styles.textDark]}
                                // showSoftInputOnFocus={false}
                                autoFocus={true}
                                placeholder="Travel Sheet No."
                                placeholderTextColor="#000"
                                onChangeText={(text) => !isEnable ? (text.length === 15 || limiters.includes(text.length)) ? setTravelSheetNo(text) : "" : setTravelSheetNo(text)}
                                value={travelSheetNo}
                            />
                        </FormControl>
                    </View>
                    <View style={[styles.flexRow,styles.w35,styles.alignFlexEnd, styles.justifyFlexEnd]}>
                        <View>
                            {
                                currentComponent === "Outgoing Inspection" 
                                ? 
                                    <View>
                                        {datepickerFrom()}
                                    </View> 
                                :
                                    <View style={[styles.flexRow]}>
                                        <TouchableOpacity onPress={() => actionsheetDateFilter()} >
                                            <View style={[ styles.mR1,styles.backgroundLightBlue,styles.justifyCenter,styles.alignCenter,styles.flexRow,styles.border10,styles.pY1,styles.pX2,styles.mT1]}>
                                                <Icon name="calendar" size={25} color={colors.lightColor} />
                                                <Text style={[styles.font25, styles.textWhite, styles.mL1]}>{filterDate}</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => actionsheet()} >
                                            <View style={[ styles.backgroundLightBlue,styles.justifyCenter,styles.alignCenter,styles.flexRow,styles.border10,styles.pY1,styles.pX2,styles.mT1]}>
                                                <Icon name="filter" size={25} color={colors.lightColor} />
                                                <Text style={[styles.font25, styles.textWhite, styles.mL1]}>{filterData}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                            }
                        </View>
                    </View>
                </View>
            </View>
            {/* {
                 refreshing
                 ?
                     <View style={[styles.justifyCenter, styles.alignCenter, styles.flex1]}>
                         <ActivityIndicator style={[styles.w10]}  size={100} color={colors.primaryColor}/>
                     </View>
                 : */}
                 <FlatList 
                    ListHeaderComponent={tableComponent}
                    ListFooterComponent={loadbutton}
                    numColumns={1}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} size="large" onRefresh={refreshPage} />
                    }
                />
            {/* } */}
            <Actionsheet isOpen={activeActionSheet} onClose={onClose}  hideDragIndicator={true}>
                <Actionsheet.Content style={[styles.alignFlexStart]}>
                    <Actionsheet.Item>
                        <View>
                            <TouchableOpacity onPress={() => setactiveActionSheet(false)}>
                                <View style={[styles.flexRow,styles.justifySpaceBetween,styles.alignCenter,styles.pL5]}>
                                    <Icon name="times" size={40} color={colors.dangerColor} />
                                    <Text style={[styles.font40, styles.mL2, styles.textDanger]}>Cancel</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </Actionsheet.Item>
                    <ScrollView>
                        {
                            dataFilter != null?
                            dataFilter.map((data, index)=>
                                <Actionsheet.Item key={index}>
                                    <View>
                                        <TouchableOpacity onPress={() => closeActionSheet(data.value)}>
                                            <View style={[styles.flexRow,styles.justifySpaceBetween,styles.alignCenter,styles.pL5]}>
                                                <Icon name="circle" size={40} color={filterData == data.value ? colors.primaryColor : colors.gray200} />
                                                <Text style={[styles.font40, styles.mL2]}>{data.filterType}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </Actionsheet.Item>
                            )
                            :
                            <></>
                        }
                    </ScrollView>
                </Actionsheet.Content>
            </Actionsheet>
            <Actionsheet isOpen={activeActionSheetFilterdate} onClose={onClose}  hideDragIndicator={true}>
                <Actionsheet.Content style={[styles.alignFlexStart]}>
                    <Actionsheet.Item>
                        <View>
                            <TouchableOpacity onPress={() => setactiveActionSheetFilterdate(false)}>
                                <View style={[styles.flexRow,styles.justifySpaceBetween,styles.alignCenter,styles.pL5]}>
                                    <Icon name="times" size={40} color={colors.dangerColor} />
                                    <Text style={[styles.font40, styles.mL2, styles.textDanger]}>Cancel</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </Actionsheet.Item>
                    <ScrollView>
                        {
                            dateFilter != null?
                            dateFilter.map((data, index)=>
                                <Actionsheet.Item key={index}>
                                    <View>
                                        <TouchableOpacity onPress={() => closeActionSheetFilterdate(data.value, data.title)}>
                                            <View style={[styles.flexRow,styles.justifySpaceBetween,styles.alignCenter,styles.pL5]}>
                                                <Icon name="circle" size={40} color={filterData == data.value ? colors.primaryColor : colors.gray200} />
                                                <Text style={[styles.font40, styles.mL2]}>{data.title}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </Actionsheet.Item>
                            )
                            :
                            <></>
                        }
                    </ScrollView>
                </Actionsheet.Content>
            </Actionsheet>
        </NativeBaseProvider>
    );
}

export default ProductionWorkEntryScreen;