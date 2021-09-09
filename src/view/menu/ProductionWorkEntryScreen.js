import React,
{
    useState,
    useEffect
} from "react";

import { 
    View,
    Text,
    ScrollView,
    KeyboardAvoidingView,
    Image,
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

import {
    NativeBaseProvider,
    FormControl,
    Input
} from 'native-base';

import { 
    useSelector
} from "react-redux";

import { useDispatch } from "react-redux";

import * as ProductionWork from "../../redux/ProductionWork/ProductionWorkEntryAction";

import Icon from 'react-native-vector-icons/FontAwesome';

const ProductionWorkEntryScreen = ({navigation}) =>{

    const [isEnable, setIsEnable] = useState(false);
    const [travelSheetNo, setTravelSheetNo] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const [WorkEntry, setWorkEntry] = useState();
   
    const token = useSelector(state => state.loginCredential.TokenData);

    const getProductionWorkEntryList = async (tokendata) =>{
        setRefreshing(true);
        try {
            const response = await fetch(APP_URL + "api/ProductionWork/ProductionWorkEntry/getlist", {
                method:'GET',
                headers:{
                    'Content-type': 'application/json',
                    'Authorization': 'Bearer ' + tokendata
                }
            })
    
            const responseData = await response.json();

            setProductionWorkEntryStatus(responseData[0].status)
            setProductionWorkEntryMessage(responseData[0].message)
            setProductionWorkEntryTotal(responseData[0].total)

            var datael = [];

            for (const key in responseData[0].dataContent){
                datael.push(
                    [
                        responseData[0].dataContent[key].Age,
                        responseData[0].dataContent[key].PriorityNo,
                        responseData[0].dataContent[key].ShipDate,
                        responseData[0].dataContent[key].TravelSheetNo,
                        responseData[0].dataContent[key].ItemCode,
                        responseData[0].dataContent[key].ItemName,
                        responseData[0].dataContent[key].StartDate,
                        responseData[0].dataContent[key].StartProcess == "1900-01-01 00:00:00" ? "" : responseData[0].dataContent[key].StartProcess,
                        responseData[0].dataContent[key].EndProcess == "1900-01-01 00:00:00" ? "" : responseData[0].dataContent[key].EndProcess
                    ]
                )
            }

            setWorkEntry(datael)

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
              { text: "OK"}
            ]
        );
    }

    const goToWorkResult = (component, travelsheetno) =>{
        if(travelsheetno != null ){
            navigation.navigate(component, 
                {
                    dataContent: {
                      number: travelsheetno,
                    },
                }
            )
            setTravelSheetNo(null)
            setIsEnable(false)
        }else{
            AlertNull()
        }
    }

    const AlertNull = () =>{
        Alert.alert(
            "Note",
            "Travel Sheet number is Empty",
            [
              { text: "OK"}
            ]
        );
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
        getProductionWorkEntryList(token)
    }
    
    useEffect(() =>{
        getProductionWorkEntryList(token)
        if(travelSheetNo != null && isEnable == false){
            goToWorkResult("WorkResultInputScreen", travelSheetNo)
            setTravelSheetNo(null)
            setIsEnable(false)
        }
    },[travelSheetNo])

    const table = {
        tableHead: ['Age', 'Priority No.', 'Ship Date', 'Travel Sheet No.', 'Item  Code', 'Item Name', 'Start Date', 'Start Process', 'End Process'],
    }

    const tableComponent = () =>{
        return(
            <NativeBaseProvider>
                <ScrollView style={[CustomStyle.tableScroll]}>
                    <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                        <Row 
                            data={table.tableHead} 
                            textStyle={CustomStyle.tableText}
                        />
                        <Rows 
                            data={WorkEntry} 
                            textStyle={CustomStyle.tableDataText}
                        />
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
                    styles.justifySpaceAround
                ]}>
                    <View style={[
                        styles.w50
                    ]}>
                        <FormControl>
                            <Text style={[
                                styles.font30,
                            ]}>
                                Travel Sheet No.
                            </Text>
                            <Input 
                                style={[
                                    styles.font40,
                                    styles.bordered,
                                    styles.textDark
                                ]}
                                showSoftInputOnFocus={isEnable}
                                autoFocus={true}
                                onChangeText={(text) => setTravelSheetNo(text)}
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
                        <View>
                            <TouchableOpacity onPress={() => goToWorkResult("WorkResultInputScreen", travelSheetNo)}>
                                <View style={[
                                    styles.backgroundPrimary,
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
                        </View>
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
                            ListFooterComponent={loadbutton}
                            numColumns={1}
                            refreshControl={
                                <RefreshControl refreshing={refreshing} size="large" onRefresh={refreshPage} />
                            }
                        />
                    </>
            }
        </NativeBaseProvider>
    );
}

export default ProductionWorkEntryScreen;