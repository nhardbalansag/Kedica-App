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

    const isFocused = useIsFocused();
    const token = useSelector(state => state.loginCredential.TokenData);
    const domainSetting = useSelector(state => state.loginCredential.domainSetting);

    const [refreshing, setRefreshing] = useState(false);
    const [WorkEntry, setWorkEntry] = useState(null);

    const FactoryID = useSelector(state => state.loginCredential.FactoryId);

    const table = {
        tableHead: ['Action', 'Production No', 'Lot No.', 'Order No', 'Customer Name', 'Product Name', 'Qty', 'Unit', 'Entry (Order/Product)', 'Delivery Date', 'Ship Date', 'Actual Qty'],
    }

    const refreshPage = () =>{
        holdlotEntryList()
    }

    const holdlotEntryList = async () =>{
        const apiUrl = props.route.params.url;
        setRefreshing(true);
        try {
            const response = await fetch(domainSetting + apiUrl + "/" + FactoryID, {
                method:"GET",
                headers:{
                    'Content-type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            })
    
            const responseData = await response.json();
            var datael = [];
            
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
            setRefreshing(false);
        } catch (error) {
            alertMessage(error.message);
        }
    }

    useEffect(() =>{
        if(isFocused){ 
            holdlotEntryList()
        }
    },[isFocused])

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
                <View style={[
                    styles.justifyCenter,
                    styles.alignCenter,
                    styles.flexRow,
                    styles.pY1,
                    styles.pX2
                ]}>
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
                        ListHeaderComponent={holdLotTable}
                        // ListFooterComponent={loadbutton}
                        numColumns={1}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} size="large" onRefresh={refreshPage} />
                        }
                    />
                </>
        }
        </NativeBaseProvider>
    )
}

export default HoldLotEntry;