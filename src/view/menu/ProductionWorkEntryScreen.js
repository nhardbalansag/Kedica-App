import React,
{
    useState,
    useEffect
} from "react";

import { 
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Switch,
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

import * as LoginAction from "../../redux/Login/LoginAction";
import { useDispatch } from "react-redux";

const ProductionWorkEntryScreen = (props) =>{

    const { isOpen, onOpen, onClose } = useDisclose()
    
    const isFocused = useIsFocused();
    const [isEnable, setIsEnable] = useState(false);
    const [travelSheetNo, setTravelSheetNo] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [activeActionSheet, setactiveActionSheet] =  useState(false);
    const [filterData, setfilterData] =  useState("All");
    const [currentComponent, setcurrentComponent] =  useState("");
    const limiters = [15, 19]

    const [WorkEntry, setWorkEntry] = useState(null);
    const dispatch = useDispatch()
    
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

    const getProductionWorkEntryList = async (tokendata, domainSetting) =>{
        const apiUrl = props.route.params.url;
        const componentTitle = props.route.params.title;
        setcurrentComponent(componentTitle)
        setRefreshing(true);
        try {
            const response = await fetch(domainSetting + apiUrl, {
                method:"GET",
                headers:{
                    'Content-type': 'application/json',
                    'Authorization': 'Bearer ' + tokendata
                }
            })
    
            const responseData = await response.json();
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
                                    responseData[0].dataContent[key].ItemCode + "\n" + responseData[0].dataContent[key].ItemName,
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
                                    responseData[0].dataContent[key].ItemCode + "\n" + responseData[0].dataContent[key].ItemName,
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
                                    responseData[0].dataContent[key].ItemCode + "\n" + responseData[0].dataContent[key].ItemName,
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
                                responseData[0].dataContent[key].ItemCode + "\n" + responseData[0].dataContent[key].ItemName,
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

    const goToWorkResult = async(component, travelsheetno) =>{
        // console.warn(travelsheetno + "  before")
       
        const componentTitle = props.route.params.title;
        var productionWork =  domainSetting + "api/production-work/production-work-entry/search-production-work-table-entry/" + travelsheetno;
        var outgoing =  domainSetting + "api/quality-inspection/get-travelsheet-details/" + travelsheetno;
        setRefreshing(true);
        try {
            const response = await fetch(componentTitle === "Outgoing Inspection" ? outgoing : productionWork, {
                method:'GET',
                headers:{
                    'Content-type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            })

            const responseData = await response.json();
            setTravelSheetNo(null)
            if(travelsheetno.includes("-") && travelsheetno.split("-").length === 3){
                if(travelsheetno.split("-")[0] === "TS"){
                    if(componentTitle === "Outgoing Inspection" && responseData[0].dataContent.IsProcess === 1){
                        alertMessage("Please scan Pending/On-Going Travel Sheet.")
                    }else if(responseData[0].total === 0 && componentTitle === "Production Work Entry"){
                        alertMessage("Please scan Pending/On-Going Travel Sheet.")
                    }else{
                        // console.warn(travelsheetno + "  after")
                        props.navigation.navigate(componentTitle === "Outgoing Inspection" ? "InscpectionDetails": component, 
                            {
                                title: (component === "WorkResultInputScreen" ? "Work Result Input" : (component === "InscpectionDetails" ? "OQC Result Input" : "") ),
                                dataContent: {
                                    number: travelsheetno,
                                }
                            }
                        )
                        setIsEnable(false)
                    }
                }else{
                    alertMessage("Please scan a valid Travel Sheet")
                }
            }else{
                alertMessage("Please scan a valid Travel Sheet")
            }
            setRefreshing(false);
        } catch (error) {
            alertMessage(error.message);
        }
    }

    var pressCount = 0;

    const toggleSwitch = () =>{
        if(pressCount === 1){
            setIsEnable(false)
            pressCount = 0
        }else{
            setIsEnable(true)
            pressCount = 1
        }
    }

    const refreshPage = () =>{
        getProductionWorkEntryList(token, domainSetting)
    }
    
    useEffect(() =>{
        if(isFocused){ 
            getProductionWorkEntryList(token, domainSetting)
           
            if(travelSheetNo !== null && isEnable == false){
                props.route.params.title === "Outgoing Inspection"
                ?
                    goToWorkResult("InscpectionDetails", travelSheetNo)
                :
                    goToWorkResult("WorkResultInputScreen", travelSheetNo)
            }
        }
    },[travelSheetNo, isFocused, filterData])

    const table = {
        tableHead: ['Start Process', 'End Process', 'Travel Sheet No.', 'Product Name', 'Priority No.', 'Age', 'Ship Date'],
    }

    const actionViewComponent = (data, index) =>{
        return(
            <TouchableOpacity 
                onPress={() => setTravelSheetNo(data)}
            >
                <View style={[
                    styles.justifyCenter,
                    styles.alignCenter,
                    styles.flexRow,
                    styles.pY1,
                    styles.pX2
                ]}>
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
                        <View style={[
                            styles.justifyCenter,
                            styles.alignCenter,
                            styles.mT1
                        ]}>
                            <Text style={[
                                styles.font30,
                                styles.textBold,
                                styles.textUppercase
                            ]}>
                                {filterData}
                            </Text>
                        </View>
                }
                <ScrollView horizontal={true} style={[CustomStyle.tableScroll]}>
                    <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                        <Row 
                            data={table.tableHead} 
                            textStyle={CustomStyle.tableText}
                            widthArr={[280, 280, 320, 280, 280, 280, 280]}
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
            <View style={[
                styles.justifyCenter,
                styles.alignCenter,
                styles.mT2,
                styles.mB3
            ]}>
                <TouchableOpacity>
                    <View style={[
                        styles.backgroundPrimary,
                        styles.justifyCenter,
                        styles.alignCenter,
                        styles.flexRow,
                        styles.border10,
                        styles.pY1,
                        styles.pX2
                    ]}>
                        <Icon name="spinner" size={30} color={colors.lightColor} />
                        <Text style={[styles.font30, styles.textWhite, styles.mL1]}>Load More</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
    
    return(
        <NativeBaseProvider>
            <View style={[styles.mT1]}>
                <View style={[
                    styles.flexRow,
                    styles.justifySpaceAround,
                    styles.alignFlexEnd

                ]}>
                    <View style={[
                        styles.w50,
                    ]}>
                        <FormControl>
                            <Text style={[
                                styles.font30,
                            ]}>
                                Travel Sheet No.
                            </Text>
                            <TextInput  
                                disableFullscreenUI={true}
                                style={[
                                    styles.font40,
                                    styles.borderedNoRadius,
                                    styles.textDark,
                                ]}
                                showSoftInputOnFocus={isEnable}
                                autoFocus={true}
                                onChangeText={(text) => !isEnable ? limiters.includes(text.length) ? setTravelSheetNo(text) : "" : setTravelSheetNo(text)}
                                value={travelSheetNo}
                            />
                        </FormControl>
                    </View>
                    <View style={[
                        styles.flexRow,
                        styles.w35,
                        styles.alignFlexEnd,
                        styles.justifySpaceAround
                    ]}>
                        <View style={[
                            styles.flexRow
                        ]}>
                            <Text style={[styles.font30, styles.textDark, styles.mR2]}>Keyboard</Text>
                            <Switch
                                trackColor={{ false: "#767577", true: colors.primaryColor }}
                                thumbColor={isEnable ? colors.canvaupperBG : "#f4f3f4"}
                                onValueChange={() => toggleSwitch()}
                                style={{ transform: [{ scaleX: 2 }, { scaleY: 2 }] }}
                                value={isEnable}
                            />
                        </View>
                        <View>
                            <TouchableOpacity 
                                disabled={!isEnable ? true : false}
                                onPress={() => goToWorkResult("WorkResultInputScreen", travelSheetNo)}
                            >
                                <View style={[
                                    !isEnable ? styles.bgGray200 : styles.backgroundPrimary ,
                                    styles.justifyCenter,
                                    styles.alignCenter,
                                    styles.flexRow,
                                    styles.border10,
                                    styles.pY1,
                                    styles.pX2
                                ]}>
                                    <Icon name="search" size={30} color={colors.lightColor} />
                                    <Text style={[styles.font30, styles.textWhite, styles.mL1]}>Search</Text>
                                </View>
                            </TouchableOpacity>
                            {
                                currentComponent === "Outgoing Inspection" 
                                ? <></> 
                                :
                                <TouchableOpacity 
                                    onPress={() => actionsheet()}
                                >
                                    <View style={[
                                        styles.backgroundLightBlue ,
                                        styles.justifyCenter,
                                        styles.alignCenter,
                                        styles.flexRow,
                                        styles.border10,
                                        styles.pY1,
                                        styles.pX2,
                                        styles.mT1
                                    ]}>
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
                        <View style={[
                            styles.alignCenter,
                            styles.justifyCenter,
                            styles.flex1
                        ]}>
                            <ActivityIndicator  size="large" color={colors.primaryColor}/>
                        </View>
                    </>
                :
                    <>
                        <FlatList 
                            ListHeaderComponent={tableComponent}
                            // ListFooterComponent={loadbutton}
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
                    <ScrollView>
                        {
                            dataFilter != null?
                            dataFilter.map((data, index)=>
                                <Actionsheet.Item key={index}>
                                    <View>
                                        <TouchableOpacity onPress={() => closeActionSheet(data.value)}>
                                            <View style={[
                                                styles.flexRow,
                                                styles.justifySpaceBetween,
                                                styles.alignCenter,
                                                styles.pL5,
                                            ]}>
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