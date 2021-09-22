import React,
{
    useState,
    useEffect
} from "react";

import { 
    useSelector
} from 'react-redux';

import { 
    View,
    Text,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    TextInput,
    FlatList
} from "react-native";

import {
    styles,
    colors,
} from "../../asset/css/BaseStyle";

import {
    NativeBaseProvider,
    Actionsheet,
    useDisclose,
    Modal,
    Input,
    ScrollView
} from 'native-base';

import Icon from 'react-native-vector-icons/FontAwesome';

const HoldQtyProcess = (props, {navigation}) =>{

    const [thicknessFrom, setThicknessFrom] = useState(0)
    const [thicknessTo, setThicknessTo] = useState(0) 
    const [NGQTY, setNGQTY] = useState(0)
    const [ActualThickness, setActualThickness] = useState(0)
    const [NGRemarks, setNGRemarks] = useState(0)
    const [activeActionSheet, setactiveActionSheet] = useState(false)
    const [OutgoingData, setOutgoingData] = useState(null)
    const [dataRemarks, setdataRemarks] = useState(null)
    const [loading, setloading] =  useState(true);
    const [NGRemarksTitle, setNGRemarksTitle] =  useState(null);

    const travelSheetNumber = props.route.params.dataContent.number;
    const token = useSelector(state => state.loginCredential.TokenData);
    const domainSetting = useSelector(state => state.loginCredential.domainSetting);
    const FactoryID = useSelector(state => state.loginCredential.FactoryId);

    const { isOpen, onOpen, onClose } = useDisclose()

    const closeActionSheet = (remarks, title) =>{
        setactiveActionSheet(false)
        setNGRemarks(remarks)
        setNGRemarksTitle(title)
    }

    const actionsheet = () =>{
        setactiveActionSheet(true)
    }

    const getOutgoingTravelSheetDetails = async (travelsheet) =>{
        setloading(true)
        try{
            const response = await fetch(domainSetting + "api/quality-inspection/get-travelsheet-details/" + travelsheet, {
                method:"GET",
                headers:{
                    'Content-type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            })
    
            const responseData = await response.json();

            setOutgoingData([
                {
                    ID: responseData[0].dataContent.ID,
                    ProductionWorkID: responseData[0].dataContent.ProductionWorkID,
                    TravelSheetNo: responseData[0].dataContent.TravelSheetNo,
                    ItemCode: responseData[0].dataContent.ItemCode,
                    LotNo: responseData[0].dataContent.LotNo,
                    Qty: responseData[0].dataContent.Qty,
                    UpdateDate: responseData[0].dataContent.UpdateDate,
                }
            ])
            setloading(false)
        }catch(error){
            alertMessage(error.message)
        }
    }

     const saveInspectionDetails = async () =>{
        if((NGQTY !== 0 && NGRemarks !== null) || (NGQTY === 0 && NGRemarks === null)){
            if(FactoryID === 2 && (thicknessFrom == 0 || thicknessTo == 0 || ActualThickness == 0)){
                alertMessage("Thickness must not be null")
            }else{
                if(isNaN(NGQTY) == false && isNaN(thicknessFrom) == false && isNaN(thicknessTo) == false && isNaN(ActualThickness) == false){
                    setloading(true)
                    try{
                        const response = await fetch(domainSetting + "api/quality-inspection/save", {
                            method:'POST',
                            headers:{
                                'Content-type': 'application/json',
                                'Authorization': 'Bearer ' + token
                            },
                            body: JSON.stringify({
                                ProductionWorkID: OutgoingData[0].ProductionWorkID,
                                ThicknessFrom: thicknessFrom,
                                ThicknessTo: thicknessTo,
                                ActualThickness : ActualThickness,
                                NGQty : NGQTY,
                                NGRemarksID : NGRemarks
                            })
                        })
                        const responseData = await response.json();
                        setloading(false)
                        if(responseData[0].status === true){
                            props.navigation.goBack()
                        }else{
                            alertMessage(responseData[0].message)
                        }
                    }catch(error){
                        alertMessage(error.message)
                    }
                }else{
                    alertMessage("Please input a valid number")
                }
            }
        }else{
            alertMessage("NG Remarks and NG Quantity Cannot be empty")
        }
    }

    useEffect(() =>{
        getOutgoingTravelSheetDetails(travelSheetNumber)
    },[])

    const alertMessage = (message) =>{
        Alert.alert(
            "Note",
            message,
            [
              { text: "OK"}
            ]
        );
    }

    const ActualThicknessComponent = () =>{
        return(
            <View>
                <Input
                    disableFullscreenUI={true}
                    size="2xl"
                    placeholder=" Actual Thickness "
                    _light={{
                        placeholderTextColor: "blueGray.400",
                    }}
                    _dark={{
                        placeholderTextColor: "blueGray.50",
                    }}
                    keyboardType={'numeric'}
                    minLength={0}
                    onChangeText={(text) => setActualThickness(text)}
                    value={ActualThickness}
                />
            </View>
        )
    }

    const ThicknessComponent = () =>{
        return(
            <View style={[styles.flexRow]}>
                <View style={[styles.flexRow , styles.justifyCenter, styles.alignFlexEnd]}>
                    <Input
                        disableFullscreenUI={true}
                        size="2xl"
                        placeholder=" From "
                        _light={{
                            placeholderTextColor: "blueGray.400",
                        }}
                        _dark={{
                            placeholderTextColor: "blueGray.50",
                        }}
                        keyboardType={'numeric'}
                        minLength={0}
                        onChangeText={(text) => setThicknessFrom(text)}
                        value={thicknessFrom}
                    />
                </View>
            </View>
        )
    }

    const ButtonSaveCancel = () =>{
        return(
            <View style={[
                styles.flexRow,
                styles.alignCenter,
                styles.justifySpaceAround,
            ]}>
                <View style={[
                    styles.mY1,
                    styles.alignCenter,
                    styles.justifyCenter,
                    styles.flexRow,
                ]}>
                    <TouchableOpacity 
                        onPress={() => saveInspectionDetails()}
                        disabled ={thicknessFrom !== 0 ? (thicknessTo !== 0 ? (ActualThickness !== 0 ? false : true): true) : true}
                    >
                        <View style={[
                            thicknessFrom !== 0 ? (thicknessTo !== 0 ? (ActualThickness !== 0 ? styles.backgroundPrimary : styles.bgGray200): styles.bgGray200) : styles.bgGray200,
                            styles.justifyCenter,
                            styles.alignCenter,
                            styles.border10,
                            styles.pY100,
                            styles.w100,
                            styles.pX9,
                        ]}>
                            <View style={[
                                styles.flexRow
                            ]}>
                                <Icon 
                                    name={"save"}
                                    size={70} 
                                    color={colors.lightColor} 
                                />
                                
                                <Text style={[styles.font60, styles.mL2, styles.textWhite]}> 
                                    Save
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View> 
                <View style={[
                    styles.mY1
                ]}>
                    <TouchableOpacity onPress={() => props.navigation.goBack()}>
                        <View style={[
                            styles.bgWarning,
                            styles.justifyCenter,
                            styles.alignCenter,
                            styles.border10,
                            styles.pY100,
                            styles.w100,
                            styles.pX8
                        ]}>
                            <View style={[
                                styles.flexRow
                            ]}>
                                <Icon 
                                    name={"times"}
                                    size={70} 
                                    color={colors.lightColor} 
                                />
                                <Text style={[styles.font60, styles.mL2, styles.textWhite]}>
                                    Cancel
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View> 
            </View>
        )
    }

    return(
        <NativeBaseProvider>
            {
                loading 
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
                    <ScrollView>
                        <View style={[styles.mX3]}>
                            <View style={[]}>
                                <Text style={[styles.font30,styles.textBold, styles.mR1, styles.textGray300]}>
                                    Product Name : 
                                </Text>
                                <Text style={[styles.font30,styles.textBold, styles.mR1, styles.textGray300]}>
                                    Lot No : 
                                </Text>
                                <Text style={[styles.font30,styles.textBold, styles.mR1, styles.textGray300]}>
                                    Received Qty : 
                                </Text>
                                <Text style={[styles.font30,styles.textBold, styles.mR1, styles.textGray300]}>
                                    Remarks : 
                                </Text>     
                            </View>
                        
                            <View style={[]}>
                                <View style={[styles.flexRow, styles.alignFlexEnd, {marginBottom:10}]}>
                                    <Text style={[styles.font30,styles.textBold, styles.mR1, styles.textGray300]}>
                                        Return Qty : 
                                    </Text>
                                    {ThicknessComponent()}
                                </View>
                                <View style={[styles.flexRow, styles.alignFlexEnd, {marginBottom:10}]}>
                                    <Text style={[styles.font30,styles.textBold, styles.mR1, styles.textGray300]}>
                                        Proceed Qty : 
                                    </Text>
                                    {ActualThicknessComponent()}
                                </View>
                            </View>
                            {ButtonSaveCancel()}
                        </View>    
                    </ScrollView>
            }  
        </NativeBaseProvider>
    )
}

export default HoldQtyProcess;