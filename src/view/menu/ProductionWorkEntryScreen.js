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
        var newpagestart = parseInt(pageStart) + parseInt(pagelength); 
        if(newpagestart > totaldata){
            var length = newpagestart - totaldata
            newpagestart = newpagestart - length
            getProductionWorkEntryList(newpagestart, length)
        }else{
            getProductionWorkEntryList(newpagestart, pagelength)
        }
    }

    const prevpage = () =>{
        var newpagestart = parseInt(pageStart) - parseInt(pagelength); 
        if(newpagestart <= 0){
            newpagestart = 0
        }
        getProductionWorkEntryList(newpagestart, pagelength)
    }

    const getProductionWorkEntryList = (PageStart, PageLength) =>{
        setpagestart(PageStart)
        const apiUrl = props.route.params.url;
        const componentTitle = props.route.params.title;
        setcurrentComponent(componentTitle)
        setRefreshing(true);
        fetch(domainSetting + apiUrl, {
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
        }).then(data => {
            if (!data.ok) {
                throw Error(data.status);
            }
            return data.json();
        }).then(responseData => {
            setRefreshing(false);
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
                <View style={[styles.justifyCenter,styles.alignCenter,styles.flexRow,styles.pX2]}>
                    <Icon name="mouse-pointer" size={25} color={colors.primaryColor} />
                    <Text style={[styles.font25, styles.textPrimary, styles.mL1]}>{data}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    const tableComponent = () =>{
        return(
            <NativeBaseProvider>
                <ScrollView horizontal={true} style={[CustomStyle.tableScroll]}>
                    <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
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
            <View style={[styles.flexRow, styles.justifySpaceAround,styles.alignCenter]}>
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
                                showSoftInputOnFocus={false}
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
                                ? <></> 
                                :
                                <TouchableOpacity onPress={() => actionsheet()} >
                                    <View style={[ styles.backgroundLightBlue,styles.justifyCenter,styles.alignCenter,styles.flexRow,styles.border10,styles.pY1,styles.pX2,styles.mT1]}>
                                        <Icon name="filter" size={25} color={colors.lightColor} />
                                        <Text style={[styles.font25, styles.textWhite, styles.mL1]}>{filterData}</Text>
                                    </View>
                                </TouchableOpacity>
                            }
                            
                        </View>
                    </View>
                </View>
            </View>
            <FlatList 
                ListHeaderComponent={tableComponent}
                ListFooterComponent={loadbutton}
                numColumns={1}
                refreshControl={
                    <RefreshControl refreshing={refreshing} size="large" onRefresh={refreshPage} />
                }
            />
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