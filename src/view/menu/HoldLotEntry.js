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

import { 
    Table, 
    TableWrapper, 
    Row, 
    Rows, 
    Col, 
    Cols, 
    Cell 
} from 'react-native-table-component';

import {
    styles,
    colors,
} from "../../asset/css/BaseStyle";

import { DataTable } from 'react-native-paper';

import CustomStyle from "../../asset/css/CustomStyle";

import { APP_URL } from "../../config/AppConfig";

import { useIsFocused } from "@react-navigation/native";

import {
    NativeBaseProvider,
    FormControl,
    Input,
    useDisclose,
    Actionsheet
} from 'native-base';

import { 
    useSelector
} from "react-redux";

import Icon from 'react-native-vector-icons/FontAwesome';

const table = {
    dataFilter: [
        {filterType: "Production No.",          value: "ProductionNo",  strColumnVal: "PONo"},
        {filterType: "Lot No.",                 value: "LotNo",         strColumnVal: "LotNo"},
        {filterType: "Order No.",               value: "OrderNo",       strColumnVal: "JONo"},
        {filterType: "Customer Name",           value: "CustomerName",  strColumnVal: "CustomerName"},
        {filterType: "Product Name",            value: "ProductName",   strColumnVal: "ProductName"},
        {filterType: "Quantity",                value: "Qty",           strColumnVal: "Qty"},
        {filterType: "Unit",                    value: "Unit",          strColumnVal: "EntryDate"},
        {filterType: "Entry (Order/Product)",   value: "EntryDate",     strColumnVal: "PONo"},
        {filterType: "Delivery Date",           value: "DeliveryDate",  strColumnVal: "DeliveryDate"},
        {filterType: "Ship Date",               value: "ShipDate",      strColumnVal: "ShipDate"},
        {filterType: "Actual Qty",              value: "ActualQty",     strColumnVal: "ActualQty"}
    ], 
    data_width: [300, 200, 200, 500, 500, 100, 100, 300, 200, 200, 150],
    tableHead: ['Production Number', 'Lot No.', 'Order No', 'Customer Name', 'Product Name', 'Qty', 'Unit', 'Entry (Order/Product)', 'Delivery Date', 'Ship Date', 'Actual Qty'],
}

const HoldLotEntry = (props, {navigation}) =>{

    const { isOpen, onOpen, onClose } = useDisclose()

    const isFocused = useIsFocused();
    const [pageStart, setpagestart] = useState(0);
    const [pagelength, setpagelength] = useState(5);
    const [searchdata, setSearch] = useState(null);
    const [totaldata, settotaldata] = useState(null);
    const [activeActionSheet, setactiveActionSheet] =  useState(false);
    const [filterData, setfilterData] =  useState(0);
    const [filterDataVal, setfilterDataVal] =  useState("Production No.");
    const token = useSelector(state => state.loginCredential.TokenData);
    const domainSetting = useSelector(state => state.loginCredential.domainSetting);

    const [column_state, set_column_state] = useState("");
    const [sort_state, set_sort_state] = useState("asc");

    const [refreshing, setRefreshing] = useState(true);
    const [WorkEntry, setWorkEntry] = useState(null);

    const FactoryID = useSelector(state => state.loginCredential.FactoryId);

    const actionsheet = () =>{
        setactiveActionSheet(true)
    }

    const closeActionSheet = (filter, filter_title) =>{
        setactiveActionSheet(false)
        setfilterData(filter)
        setfilterDataVal(filter_title)
    }

    const nextpage = () =>{
        var newpagestart = parseInt(pageStart) + parseInt(pagelength); 
        if(newpagestart > totaldata){
            var length = newpagestart - totaldata
            newpagestart = newpagestart - length
            holdlotEntryList(newpagestart, length, sort_state, column_state, "", "")
        }else{
            holdlotEntryList(newpagestart, pagelength, sort_state, column_state, "")
        }
    }

    const prevpage = () =>{
        var newpagestart = parseInt(pageStart) - parseInt(pagelength); 
        if(newpagestart <= 0){
            newpagestart = 0
        }
        holdlotEntryList(newpagestart, pagelength, sort_state, column_state, "", "")
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

    const holdlotEntryList = async (pageStart, pagelength, order_status, order_column, searchData, searchCol) =>{
        
        setpagestart(pageStart ? pageStart : 0)
        set_column_state(order_column)
        set_sort_state(order_status)
        var search_data = searchData ? searchData : ""
        const apiUrl = props.route.params.url;

        console.warn(JSON.stringify({
            FactoryID: FactoryID,
            sortColumnName:searchCol, // for table column sorting
            sortDirection:order_status ? order_status : "",
            strColumn: order_column ? order_column : "",
            strSearch: search_data ? search_data : "",
            PageStart: pageStart ? pageStart : 0,
            PageLength: pagelength ? pagelength : 5
        })    )    
        setRefreshing(true);
        await fetch(domainSetting + apiUrl, {
            method:"POST",
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                FactoryID: FactoryID,
                sortColumnName:searchCol, // for table column sorting
                sortDirection:order_status,
                strColumn: order_column,
                strSearch: search_data,
                PageStart: pageStart ? pageStart : 0,
                PageLength: pagelength ? pagelength : 5
            })            
        }).then(data => {
            if (!data.ok) {
                throw Error(data.status);
            }
            return data.json();
        }).then(responseData => {
            var datael = [];
            setRefreshing(false);
            settotaldata(responseData[0].total)
            if(!responseData[0].status){
                alertMessage("An Error Occured: No data fetched");
            }else{
                for (const key in responseData[0].dataContent){
                    if(responseData[0].dataContent[key].SourceName.toLowerCase() === "outgoing inspection"){
                        datael.push(
                            [
                                responseData[0].dataContent[key].ID,
                                responseData[0].dataContent[key].ProductionNo,
                                responseData[0].dataContent[key].LotNo,
                                responseData[0].dataContent[key].OrderNo,
                                responseData[0].dataContent[key].CustomerName,
                                responseData[0].dataContent[key].ItemDesc,
                                responseData[0].dataContent[key].Qty,
                                responseData[0].dataContent[key].Unit,
                                responseData[0].dataContent[key].Entry,
                                responseData[0].dataContent[key].DeliveryDate,
                                responseData[0].dataContent[key].ShipDate,
                                responseData[0].dataContent[key].ActualQty
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
              { text: "OK", onPress: () => setSearch(null) }
            ]
        );
    }

    useEffect(() =>{
        // if(isFocused){ 
            setpagestart(0);
            setpagelength(5);
            holdlotEntryList(0, 5, sort_state, column_state, "", table.dataFilter[filterData].value)
        // }
    },[ pagelength])

    const actionViewComponent = (data, index, data_id) =>{
        return(
            <TouchableOpacity 
                key={index}
                onPress={() => props.navigation.navigate("HoldQtyProcess",
                    {
                        title: "Hold Qty Return/Proceed",
                        dataContent: {
                            number: String(data_id),
                        },
                    }
                )}
            >
                <View style={[styles.justifyCenter,styles.alignCenter, styles.flexRow ]}>
                    <Text style={[styles.font25, styles.mL1]}>{data ? data : "--"}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    const holdLotTable = () =>{
        return(
            <ScrollView horizontal>
                <DataTable style={[styles.mT1]}>
                    <DataTable.Header style={[styles.bgGray200]}>
                        {
                            table.tableHead !== null ?
                                table.tableHead.map((rowData, index) => (
                                    <DataTable.Title style={[styles.justifyCenter, {width: table.data_width[index]}]} key={index} sortDirection={sort_state == "asc" ? "ascending" : "descending"}>
                                        <TouchableOpacity onPress={() =>{
                                            setfilterData(index); 
                                            setpagestart(0);
                                            setpagelength(5);
                                            holdlotEntryList(0, 5, sort_state == "asc" ? "desc": "asc", table.dataFilter[index].strColumnVal, "", table.dataFilter[index].value)
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
                                <DataTable.Row key={index}>
                                    {
                                        rowData.map((cellData, cellIndex) => (
                                            <DataTable.Cell key={cellIndex} style={[styles.pY1, styles.justifyCenter, {width: table.data_width[cellIndex]}]}>
                                                {cellIndex != 11 ? actionViewComponent(rowData[cellIndex + 1], cellIndex, rowData[0]) : ""}
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

    return(
        <NativeBaseProvider>
            <View>
                <View style={[styles.flexRow,styles.justifySpaceAround,styles.alignFlexEnd]}>
                    <View style={[styles.w50]}>
                        <FormControl>
                            <TextInput  
                                disableFullscreenUI={true}
                                style={[styles.font25,styles.borderedNoRadius,styles.textDark]}
                                value={searchdata}
                                onChangeText={(text) => setSearch(text)}
                            />
                        </FormControl>
                    </View>
                    <View style={[styles.flexRow,styles.w20,styles.alignFlexEnd, styles.justifyFlexEnd]}>
                        <View>
                            <TouchableOpacity onPress={() => actionsheet()} >
                                <View style={[ styles.backgroundLightBlue,styles.justifyCenter,styles.alignCenter,styles.flexRow,styles.border10,styles.pY1,styles.pX2,styles.mT1]}>
                                    <Icon name="filter" size={25} color={colors.lightColor} />
                                    <Text style={[styles.font25, styles.textWhite, styles.mL1]}>{filterDataVal}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[styles.flexRow,styles.w15,styles.alignFlexEnd, styles.justifyFlexEnd]}>
                        <View>
                            <TouchableOpacity onPress={() => holdlotEntryList(0, 5, sort_state, table.dataFilter[filterData].value, searchdata, table.dataFilter[filterData].value)} >
                                <View style={[ styles.backgroundPrimary,styles.justifyCenter,styles.alignCenter,styles.flexRow,styles.border10,styles.pY1,styles.pX2,styles.mT1]}>
                                    <Icon name="search" size={25} color={colors.lightColor} />
                                </View>
                            </TouchableOpacity>
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
                        ListHeaderComponent={holdLotTable}
                        ListFooterComponent={loadbutton}
                        numColumns={1}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} size="large" onRefresh={() => holdlotEntryList(pageStart, pagelength, "asc", "", "", "ProductionNo")} />
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
                            table.dataFilter != null?
                                table.dataFilter.map((data, index)=>
                                    <Actionsheet.Item key={index}>
                                        <View>
                                            <TouchableOpacity onPress={() => closeActionSheet(index, data.filterType)}>
                                                <View style={[styles.flexRow,styles.justifySpaceBetween,styles.alignCenter,styles.pL5]}>
                                                    <Icon name="circle" size={40} color={table.dataFilter[filterData].strColumnVal == data.strColumnVal ? colors.primaryColor : colors.gray200} />
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
    )
}

export default HoldLotEntry;

