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

import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';

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

const ProductionWorkEntryScreen = (props) =>{

    const { isOpen, onOpen, onClose } = useDisclose()
    const textInputRef = useRef();
    
    const isFocused = useIsFocused();
    const [isEnable, setIsEnable] = useState(false);
    const [travelSheetNo, setTravelSheetNo] = useState(null);
    const [pageStart, setpagestart] = useState(0);
    const [pagelength, setpagelength] = useState(5);
    const [totaldata, settotaldata] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [activeActionSheet, setactiveActionSheet] =  useState(false);
    const [filterData, setfilterData] =  useState("All");
    const [currentComponent, setcurrentComponent] =  useState("");
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

    const actionsheet = () =>{
        setactiveActionSheet(true)
    }

    const closeActionSheet = (filter) =>{
        setactiveActionSheet(false)
        setfilterData(filter)
    }

    const nextpage = () =>{
        // if ((parseInt(pageStart) + parseInt(pagelength)) < parseInt(totaldata)) {
        // }
        // else if ((parseInt(pageStart) + parseInt(pagelength)) > parseInt(pagelength)) {
            var newpagestart = parseInt(pageStart) + parseInt(pagelength); 
        // }
        getProductionWorkEntryList(newpagestart, pagelength)
    }

    const prevpage = () =>{
        // if ((parseInt(pageStart) + parseInt(pagelength)) > parseInt(pagelength)) {
        //     // console.warn(parseInt(pageStart))
        // }
        // else if ((parseInt(pageStart) + parseInt(pagelength)) < parseInt(pagelength)) {
            var newpagestart = parseInt(pageStart) - parseInt(pagelength); 
        // }
        getProductionWorkEntryList(newpagestart, pagelength)
    }
    const getProductionWorkEntryList = async (PageStart, PageLength) =>{
        const apiUrl = props.route.params.url;
        const componentTitle = props.route.params.title;
        setcurrentComponent(componentTitle)
        try {
            setRefreshing(true);
            const response = await fetch(domainSetting + apiUrl, {
                method:"POST",
                headers:{
                    'Content-type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({
                    FactoryID: FactoryID,
                    PageStart: PageStart,
                    PageLength: PageLength
                })
            })          
            const responseData = await response.json();
            settotaldata(responseData[0].total)
            var datael = [];
            if(!responseData[0].status){
                alertMessage("An Error Occured: No data fetched");
            }else{
                for (const key in responseData[0].dataContent){
                    if(componentTitle !== "Outgoing Inspection"){
                        if(filterData === "Ongoing" && responseData[0].dataContent[key].StartProcess !== "1900-01-01 00:00:00" && responseData[0].dataContent[key].EndProcess === "1900-01-01 00:00:00"){
                            datael.push(
                                [
                                    responseData[0].dataContent[key].StartProcess == "1900-01-01 00:00:00" ? "" : responseData[0].dataContent[key].StartProcess,
                                    responseData[0].dataContent[key].EndProcess == "1900-01-01 00:00:00" ? "" : responseData[0].dataContent[key].EndProcess,
                                    responseData[0].dataContent[key].TravelSheetNo,
                                    responseData[0].dataContent[key].PlatingLotNo,
                                    responseData[0].dataContent[key].ItemCode + "\n" + responseData[0].dataContent[key].ItemName,
                                    responseData[0].dataContent[key].LotNo,
                                    responseData[0].dataContent[key].Priority,
                                    responseData[0].dataContent[key].Age + " Days",
                                    responseData[0].dataContent[key].ShipDate,
                                ]
                            )
                        }else if(filterData === "Pending" && responseData[0].dataContent[key].StartProcess === "1900-01-01 00:00:00" && responseData[0].dataContent[key].EndProcess === "1900-01-01 00:00:00"){
                            datael.push(
                                [
                                    responseData[0].dataContent[key].StartProcess == "1900-01-01 00:00:00" ? "" : responseData[0].dataContent[key].StartProcess,
                                    responseData[0].dataContent[key].EndProcess == "1900-01-01 00:00:00" ? "" : responseData[0].dataContent[key].EndProcess,
                                    responseData[0].dataContent[key].TravelSheetNo,
                                    responseData[0].dataContent[key].PlatingLotNo,
                                    responseData[0].dataContent[key].ItemCode + "\n" + responseData[0].dataContent[key].ItemName,
                                    responseData[0].dataContent[key].LotNo,
                                    responseData[0].dataContent[key].Priority,
                                    responseData[0].dataContent[key].Age + " Days",
                                    responseData[0].dataContent[key].ShipDate,
                                ]
                            )
                        }else if(filterData === "All"){
                            datael.push(
                                [
                                    responseData[0].dataContent[key].StartProcess == "1900-01-01 00:00:00" ? "" : responseData[0].dataContent[key].StartProcess,
                                    responseData[0].dataContent[key].EndProcess == "1900-01-01 00:00:00" ? "" : responseData[0].dataContent[key].EndProcess,
                                    responseData[0].dataContent[key].TravelSheetNo,
                                    responseData[0].dataContent[key].PlatingLotNo,
                                    responseData[0].dataContent[key].ItemCode + "\n" + responseData[0].dataContent[key].ItemName,
                                    responseData[0].dataContent[key].LotNo,
                                    responseData[0].dataContent[key].Priority,
                                    responseData[0].dataContent[key].Age + " Days",
                                    responseData[0].dataContent[key].ShipDate,
                                ]
                            )
                        }
                    }else{
                        datael.push(
                            [
                                responseData[0].dataContent[key].StartProcess == "1900-01-01 00:00:00" ? "" : responseData[0].dataContent[key].StartProcess,
                                responseData[0].dataContent[key].EndProcess == "1900-01-01 00:00:00" ? "" : responseData[0].dataContent[key].EndProcess,
                                responseData[0].dataContent[key].TravelSheetNo,
                                responseData[0].dataContent[key].PlatingLotNo,
                                responseData[0].dataContent[key].ItemCode + "\n" + responseData[0].dataContent[key].ItemName,
                                responseData[0].dataContent[key].LotNo,
                                responseData[0].dataContent[key].Priority,
                                responseData[0].dataContent[key].Age + " Days",
                                responseData[0].dataContent[key].ShipDate,
                            ]
                        )
                    }
                }
                setWorkEntry(datael)
            }
            setRefreshing(false);
        } catch (error) {
            setRefreshing(false);
            alertMessage(error.message);
        }
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
        setTravelSheetNo(null)
        props.navigation.navigate(componentTitle === "Outgoing Inspection" ? "InscpectionDetails": component, 
            {
                title: (component === "WorkResultInputScreen" ? "Work Result Input" : (component === "InscpectionDetails" ? "OQC Result Input" : "") ),
                dataContent: {
                    number: travelsheetno,
                }
            }
        )
    }

    const refreshPage = () =>{
        getProductionWorkEntryList(pageStart, pagelength)
    }
    
    useEffect(() =>{
        if(isFocused){ 
            getProductionWorkEntryList(pageStart, pagelength)
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
    },[travelSheetNo, isFocused, filterData, textInputRef])

    const table = {
        tableHead: ['Start Process', 'End Process', 'Travel Sheet No.', 'Plating Lot No.', 'Product Name', 'Lot No.', 'Priority No.', 'Age', 'Ship Date'],
    }

    const actionViewComponent = (data, index) =>{
        return(
            <TouchableOpacity style={[styles.pY1]} onPress={() => props.route.params.title === "Outgoing Inspection" ? goToWorkResult("InscpectionDetails", data) : goToWorkResult("WorkResultInputScreen", data)}>
                <View style={[styles.justifyCenter,styles.alignCenter,styles.flexRow,styles.pY1,styles.pX2]}>
                    <Icon name="mouse-pointer" size={25} color={colors.primaryColor} />
                    <Text style={[styles.font25, styles.textPrimary, styles.mL1]}>{data}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    const tableComponent = () =>{
        return(
            <NativeBaseProvider>
                {
                    currentComponent === "Outgoing Inspection"
                    ? <></>
                    :
                        <View style={[styles.justifyCenter,styles.alignCenter,styles.mT1]}>
                            <Text style={[styles.font30,styles.textBold,styles.textUppercase]}>{filterData}</Text>
                        </View>
                }
                <ScrollView horizontal={true} style={[CustomStyle.tableScroll]}>
                    <Table onPress={() => console.warn("hello")} borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                        <Row 
                            data={table.tableHead} 
                            textStyle={CustomStyle.tableText}
                            widthArr={[280, 280, 320, 280, 280, 280, 280, 280, 280]}
                        />
                        {
                            WorkEntry !== null ?
                            WorkEntry.map((rowData, index) => (
                                <TableWrapper key={index} style={[styles.flexRow]}>
                                  {
                                    rowData.map((cellData, cellIndex) => (
                                        <Cell 
                                            key={cellIndex} 
                                            data={cellIndex === 2 ? actionViewComponent(cellData, index) : cellData} 
                                            textStyle={[CustomStyle.tableDataText]}
                                            width={cellIndex === 2 ? 320 : 280}
                                        />
                                    ))
                                  }
                                </TableWrapper>
                            ))
                            :<></>
                        }
                    </Table>
                </ScrollView>
            </NativeBaseProvider>
        )
    }

    const loadbutton = () =>{
        return(
            <View style={[styles.flexRow, styles.justifyCenter,styles.alignCenter,styles.mT2,styles.mB3]}>
                <TouchableOpacity  onPress={() => prevpage()}>
                    <View style={[styles.backgroundPrimary,styles.justifyCenter,styles.alignCenter,styles.flexRow,styles.border10,styles.pY1,styles.pX2, styles.mR1]}>
                        <Icon name="caret-left" size={30} color={colors.lightColor} />
                        <Text style={[styles.font30, styles.textWhite, styles.mL1]}>Prev</Text>
                    </View>
                </TouchableOpacity>
                
                <TouchableOpacity onPress={() => nextpage()}>
                    <View style={[styles.backgroundPrimary,styles.justifyCenter,styles.alignCenter,styles.flexRow,styles.border10,styles.pY1,styles.pX2, styles.mL1]}>
                        <Icon name="caret-right" size={30} color={colors.lightColor} />
                        <Text style={[styles.font30, styles.textWhite, styles.mL1]}>Next</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
    
    return(
        <NativeBaseProvider>
            <View style={[styles.mT1]}>
                <View style={[styles.flexRow,styles.justifySpaceAround,styles.alignFlexEnd]}>
                    <View style={[styles.w50,]}>
                        <FormControl>
                            <Text style={[styles.font30]}>Travel Sheet No.</Text>
                            <TextInput  
                                ref={textInputRef}
                                disableFullscreenUI={true}
                                style={[styles.font40,styles.borderedNoRadius,styles.textDark]}
                                showSoftInputOnFocus={false}
                                autoFocus={true}
                                onChangeText={(text) => !isEnable ? (text.length === 15 || limiters.includes(text.length)) ? setTravelSheetNo(text) : "" : setTravelSheetNo(text)}
                                value={travelSheetNo}
                            />
                        </FormControl>
                    </View>
                    <View style={[styles.flexRow,styles.w35,styles.alignFlexEnd,styles.justifySpaceAround]}>
                        <View>
                            {
                                currentComponent === "Outgoing Inspection" 
                                ? <></> 
                                :
                                <TouchableOpacity onPress={() => actionsheet()} >
                                    <View style={[ styles.backgroundLightBlue,styles.justifyCenter,styles.alignCenter,styles.flexRow,styles.border10,styles.pY1,styles.pX2,styles.mT1]}>
                                        <Icon name="filter" size={30} color={colors.lightColor} />
                                        <Text style={[styles.font30, styles.textWhite, styles.mL1]}>Filter</Text>
                                    </View>
                                </TouchableOpacity>
                            }
                            
                        </View>
                    </View>
                </View>
            </View>
            {
                refreshing
                ?
                    <>
                        <View style={[styles.alignCenter,styles.justifyCenter,styles.flex1]}>
                            <ActivityIndicator  size="large" color={colors.primaryColor}/>
                        </View>
                    </>
                :
                    <>
                        <FlatList 
                            ListHeaderComponent={tableComponent}
                            ListFooterComponent={loadbutton}
                            numColumns={1}
                            refreshControl={
                                <RefreshControl refreshing={refreshing} size="large" onRefresh={refreshPage} />
                            }
                        />
                    </>
            }
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
        </NativeBaseProvider>
    );
}

export default ProductionWorkEntryScreen;