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

const HoldLotEntry = () =>{

    const [refreshing, setRefreshing] = useState(false);

     const table = {
        tableHead: ['Source Location/Process', 'Production No', 'Lot No.', 'Order No', 'Customer Name', 'Product Name', 'Qty', 'Unit', 'Entry (Order/Product)', 'Delivery Date', 'Ship Date', 'Actual Qty'],
    }

    const dataPress = (data, index) =>{
        return(
            <TouchableOpacity>
                <Text style={[CustomStyle.tableDataText]}>{data}</Text>
            </TouchableOpacity>
        )
    }
    const data =  [
        ["test", 'test', 'test', 'test', 'test', 'tes', 'test', 'test', 'test', 'test', 'test', 'test'],
        ['test', 'test', 'test', 'test', 'test', 'tes', 'test', 'test', 'test', 'test', 'test', 'test'],
        ['test', 'test', 'test', 'test', 'test', 'tes', 'test', 'test', 'test', 'test', 'test', 'test'],
    ]

    const holdLotTable = () =>{
        return(
            <NativeBaseProvider>
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
                       test
                    </Text>
                </View>
                <ScrollView horizontal={true} style={[CustomStyle.tableScroll]}>
                    <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                        <Row 
                            data={table.tableHead} 
                            textStyle={CustomStyle.tableText}
                            widthArr={[280, 200, 200, 200, 200, 200, 200, 200, 280, 200, 200, 200]}
                        />
                        {
                            data.map((rowData, index) => (
                                <TableWrapper key={index} style={[styles.flexRow]}>
                                  {
                                    rowData.map((cellData, cellIndex) => (
                                        <Cell 
                                            key={cellIndex} 
                                            data={cellIndex === 0 ? dataPress(cellData, index) : cellData} 
                                            textStyle={[CustomStyle.tableDataText]}
                                        />
                                    ))
                                  }
                                </TableWrapper>
                            ))
                        }
                        {/* <Rows 
                            data={data} 
                            textStyle={CustomStyle.tableDataText}
                            widthArr={[280, 200, 200, 200, 200, 200, 200, 200, 280, 200, 200, 200]}
                        /> */}
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
                        ListFooterComponent={loadbutton}
                        numColumns={1}
                        // refreshControl={
                        //     <RefreshControl refreshing={refreshing} size="large" onRefresh={refreshPage} />
                        // }
                    />
                </>
        }
        </NativeBaseProvider>
    )
}

export default HoldLotEntry;