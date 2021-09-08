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
    Alert 
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

import {
    NativeBaseProvider,
    FormControl,
    Input
} from 'native-base';

import Icon from 'react-native-vector-icons/FontAwesome';

const ProductionWorkEntryScreen = ({navigation}) =>{

    const [isEnable, setIsEnable] = useState(false);

    const [travelSheetNo, setTravelSheetNo] = useState(null);

    const goToWorkResult = (component, travelsheetno) =>{
        if(travelsheetno != null){
            setTravelSheetNo(null)
            setIsEnable(false)
            navigation.navigate(component, 
                {
                    dataContent: {
                      number: travelsheetno,
                    },
                }
            )
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

    useEffect(() =>{
        if(travelSheetNo != null && isEnable == false){
            setTravelSheetNo(null)
            setIsEnable(false)
            goToWorkResult("WorkResultInputScreen", travelSheetNo)
        }
    },[travelSheetNo])

    const table = {
        tableHead: ['Age', 'Priority No.', 'Ship Date', 'Travel Sheet No.', 'Item  Code', 'Item Name', 'Start Date', 'Start Process', 'End Process'],
        tableData: [
            [1, 2, 3, 4, 5, 6, 7, 8, 9],
            [2, 2, 3, 4, 5, 6, 7, 8, 9],
            [3, 2, 3, 4, 5, 6, 7, 8, 9],
            [4, 2, 3, 4, 5, 6, 7, 8, 9],
            [5, 2, 3, 4, 5, 6, 7, 8, 9],
            [6, 2, 3, 4, 5, 6, 7, 8, 9],
            [7, 2, 3, 4, 5, 6, 7, 8, 9],
            [8, 2, 3, 4, 5, 6, 7, 8, 9],
            [9, 2, 3, 4, 5, 6, 7, 8, 9],
            [10, 2, 3, 4, 5, 6, 7, 8, 9],
            [11, 2, 3, 4, 5, 6, 7, 8, 9],
            [12, 2, 3, 4, 5, 6, 7, 8, 9],
            [13, 2, 3, 4, 5, 6, 7, 8, 9],
            [14, 2, 3, 4, 5, 6, 7, 8, 9],
            [15, 2, 3, 4, 5, 6, 7, 8, 9],
            [16, 2, 3, 4, 5, 6, 7, 8, 9],
            [17, 2, 3, 4, 5, 6, 7, 8, 9],
            [18, 2, 3, 4, 5, 6, 7, 8, 9],
            
        ]
    }

    var pressCount = 0;

    const toggleSwitch = () =>{
        if(pressCount == 1){
            setIsEnable(false)
            pressCount = 0; 
        }else{
            setIsEnable(true)
            pressCount = 1
        }
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
                                value={travelSheetNo}
                                onChangeText={(text) => setTravelSheetNo(text)}
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
            <ScrollView style={[CustomStyle.tableScroll]}>
                <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                    <Row 
                        data={table.tableHead} 
                        textStyle={CustomStyle.tableText}
                    />
                    <Rows 
                        data={table.tableData} 
                        textStyle={CustomStyle.tableDataText}
                    />
                </Table>
                <View style={[
                    styles.justifyCenter,
                    styles.alignCenter,
                    styles.mT2
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
            </ScrollView>
        </NativeBaseProvider>
    );
}

export default ProductionWorkEntryScreen;