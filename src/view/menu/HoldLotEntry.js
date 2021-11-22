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

const HoldLotEntry = (props, {navigation}) =>{

    const { isOpen, onOpen, onClose } = useDisclose()

    const isFocused = useIsFocused();
    const [pageStart, setpagestart] = useState(0);
    const [pagelength, setpagelength] = useState(5);
    const [searchdata, setSearch] = useState(null);
    const [totaldata, settotaldata] = useState(null);
    const [activeActionSheet, setactiveActionSheet] =  useState(false);
    const [filterData, setfilterData] =  useState("PONo");
    const [filterDataVal, setfilterDataVal] =  useState("Production No.");
    const token = useSelector(state => state.loginCredential.TokenData);
    const domainSetting = useSelector(state => state.loginCredential.domainSetting);

    const [refreshing, setRefreshing] = useState(true);
    const [WorkEntry, setWorkEntry] = useState(null);

    const dataFilter = [
        {filterType: "Production No.", value: "PONo"},
        {filterType: "Lot No.", value: "LotNo"},
        {filterType: "Order No.", value: "JONo"},
        {filterType: "Customer Name", value: "CustomerName"},
        {filterType: "Product Name", value: "ProductName"},
        {filterType: "Quantity", value: "Qty"},
        {filterType: "Entry (Order/Product)", value: "EntryDate"},
        {filterType: "Delivery Date", value: "DeliveryDate"},
        {filterType: "Ship Date", value: "ShipDate"},
        {filterType: "Actual Qty", value: "ActualQty"}
    ]

    const FactoryID = useSelector(state => state.loginCredential.FactoryId);

    const table = {
        tableHead: ['Action', 'Production No', 'Lot No.', 'Order No', 'Customer Name', 'Product Name', 'Qty', 'Unit', 'Entry (Order/Product)', 'Delivery Date', 'Ship Date', 'Actual Qty'],
    }

    const refreshPage = () =>{
        holdlotEntryList()
    }

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
            holdlotEntryList(newpagestart, length)
        }else{
            holdlotEntryList(newpagestart, pagelength)
        }
    }

    const prevpage = () =>{
        var newpagestart = parseInt(pageStart) - parseInt(pagelength); 
        if(newpagestart <= 0){
            newpagestart = 0
        }
        holdlotEntryList(newpagestart, pagelength)
    }

    const holdlotEntryList = (pageStart, pagelength) =>{
        setpagestart(pageStart ? pageStart : 0)
        var search_data = searchdata ? searchdata : ""
        const apiUrl = props.route.params.url;
        setRefreshing(true);
        fetch(domainSetting + apiUrl, {
            method:"POST",
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                FactoryID: FactoryID,
                strColumn: filterData,
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
        if(isFocused){ 
            holdlotEntryList(pageStart, pagelength)
        }
    },[isFocused, filterData])

    const actionViewComponent = (data, index) =>{
       
        return(
            <TouchableOpacity 
                onPress={() => props.navigation.navigate("HoldQtyProcess",
                    {
                        title: "Hold Qty Return/Proceed",
                        dataContent: {
                            number: String(data),
                        },
                    }
                )}
            >
                <View style={[styles.justifyCenter,styles.alignCenter, styles.flexRow, styles.pY1, styles.pX2 ]}>
                    <Icon name="eye" size={25} color={colors.primaryColor} />
                    <Text style={[styles.font25, styles.textPrimary, styles.mL1]}>View</Text>
                </View>
            </TouchableOpacity>
        )
    }

    const holdLotTable = () =>{
        return(
            <NativeBaseProvider>
                <ScrollView horizontal={true} style={[CustomStyle.tableScroll]}>
                    <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                        <Row 
                            data={table.tableHead} 
                            textStyle={CustomStyle.tableText}
                            widthArr={[280, 280, 280, 280, 280, 280, 280, 280, 280, 280, 280, 280]}
                        />
                        {
                            WorkEntry !== null ?
                            WorkEntry.map((rowData, index) => (
                                <TableWrapper key={index} style={[styles.flexRow]}>
                                  {
                                    rowData.map((cellData, cellIndex) => (
                                        <Cell 
                                            key={cellIndex} 
                                            data={cellIndex === 0 ? actionViewComponent(cellData, index) : cellData} 
                                            textStyle={[CustomStyle.tableDataText]}
                                            width={280}
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
                            <TouchableOpacity onPress={() => holdlotEntryList()} >
                                <View style={[ styles.backgroundPrimary,styles.justifyCenter,styles.alignCenter,styles.flexRow,styles.border10,styles.pY1,styles.pX2,styles.mT1]}>
                                    <Icon name="search" size={25} color={colors.lightColor} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
            <FlatList 
                ListHeaderComponent={holdLotTable}
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
                                        <TouchableOpacity onPress={() => closeActionSheet(data.value, data.filterType)}>
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
    )
}

export default HoldLotEntry;