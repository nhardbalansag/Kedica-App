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

const InscpectionDetails = (props, {navigation}) =>{

    const [thicknessFrom, setThicknessFrom] = useState(null)
    const [thicknessTo, setThicknessTo] = useState(null) 
    const [NGQTY, setNGQTY] = useState(null)
    const [ActualThickness, setActualThickness] = useState(null)
    const [NGRemarks, setNGRemarks] = useState(null)
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

    const getRemarks = async () =>{
        setloading(true)
        try{
            const response = await fetch(domainSetting + "api/remarks/get-remarks", {
                method:"GET",
                headers:{
                    'Content-type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            })
    
            const responseData = await response.json();

            setdataRemarks(responseData[0].dataContent)
            setloading(false)
           
        }catch(error){
            alertMessage(error.message)
        }
    }

     const saveInspectionDetails = async () =>{
        if((NGQTY > 0 && NGRemarks !== null) || (NGQTY === 0 && NGRemarks === null) || (NGQTY === null && NGRemarks === null)){
            if(FactoryID === 2 && (thicknessFrom == null || thicknessTo == null || ActualThickness == null)){
                alertMessage("Thickness must not be null")
            }else{
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
            }
            
            
        }else{
            alertMessage("NG Remarks and NG Quantity Cannot be empty")
        }
    }

    useEffect(() =>{
        getOutgoingTravelSheetDetails(travelSheetNumber)
        getRemarks()
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

    const RemarksComponent = () =>{
        return(
            <View>
                <TouchableOpacity onPress={ () => actionsheet()}>
                    <View style={[
                        styles.backgroundPrimary,
                        styles.justifyCenter,
                        styles.alignCenter,
                        styles.flexRow,
                        styles.border10,
                        styles.pY1,
                        styles.pX2
                    ]}>
                        <Text style={[styles.font30, styles.textWhite, styles.mR1]}>{NGRemarksTitle !== null ? NGRemarksTitle : "Select Remarks"}</Text>
                        <Icon name="mouse-pointer" size={30} color={colors.lightColor} />
                    </View>
                </TouchableOpacity>
                <Actionsheet isOpen={activeActionSheet} onClose={onClose} hideDragIndicator={true} >
                    <Actionsheet.Content  style={[styles.alignFlexStart]}>
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
                            <Actionsheet.Item>
                                <View>
                                    <TouchableOpacity onPress={() => closeActionSheet(null, "Select Remarks")}>
                                        <View style={[
                                            styles.flexRow,
                                            styles.justifySpaceBetween,
                                            styles.alignCenter,
                                            styles.pL5,
                                        ]}>
                                            <Icon name="circle" size={40} color={NGRemarks == null ? colors.primaryColor : colors.gray200} />
                                            <Text style={[styles.font40, styles.mL2, styles.warningColor]}>None</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </Actionsheet.Item>
                            {
                                dataRemarks != null?
                                dataRemarks.map((data, index)=>
                                    <Actionsheet.Item key={index}>
                                        <View>
                                            <TouchableOpacity onPress={() => closeActionSheet(data.ID, data.NGRemarks)}>
                                                <View style={[
                                                    styles.flexRow,
                                                    styles.justifySpaceBetween,
                                                    styles.alignCenter,
                                                    styles.pL5,
                                                ]}>
                                                    <Icon name="circle" size={40} color={NGRemarks == data.ID ? colors.primaryColor : colors.gray200} />
                                                    <Text style={[styles.font40, styles.mL2]}>{data.NGRemarks}</Text>
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
            </View>
        )
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

    const NGQuantityComponent = () =>{
        return(
            <View>
                <Input
                    disableFullscreenUI={true}
                    size="2xl"
                    placeholder=" Quantity "
                    _light={{
                        placeholderTextColor: "blueGray.400",
                    }}
                    _dark={{
                        placeholderTextColor: "blueGray.50",
                    }}
                    keyboardType='numeric'
                    minLength={0}
                    onChangeText={(text) => setNGQTY(text)}
                    value={NGQTY}
                />
            </View>
        )
    }

    const ThicknessComponent = () =>{
        return(
            <View style={[styles.flexRow]}>
                <View style={[styles.flexRow , styles.justifyCenter, styles.alignFlexEnd]}>
                    <Text style={[
                        styles.font30,
                        styles.textBold,
                        styles.mR1
                    ]}>
                        From :
                    </Text>
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
                <View style={[styles.flexRow , styles.justifyCenter, styles.alignFlexEnd]}>
                    <Text style={[
                        styles.font30,
                        styles.textBold,
                        styles.mX1
                    ]}>
                        To :
                    </Text>
                    <Input
                        disableFullscreenUI={true}
                        size="2xl"
                        placeholder=" To "
                        _light={{
                            placeholderTextColor: "blueGray.400",
                        }}
                        _dark={{
                            placeholderTextColor: "blueGray.50",
                        }}
                        keyboardType={'numeric'}
                        minLength={0}
                        onChangeText={(text) => setThicknessTo(text)}
                        value={thicknessTo}
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
                    <View style={[styles.mX3]}>
                        <View style={[styles.flexRow, styles.alignFlexEnd, styles.justifySpaceBetween, styles.mX1]}>
                            <View style={[styles.flexRow, styles.alignFlexEnd, {marginBottom:10}]}>
                                <Text style={[styles.font30,styles.textBold, styles.mR1, styles.textGray300]}>
                                    Travel Sheet No. : 
                                </Text>
                                <Text style={[styles.font40]}>
                                    { travelSheetNumber ? travelSheetNumber : "-" }
                                </Text> 
                            </View>
                            <View style={[styles.flexRow, styles.alignFlexEnd, styles.mL2, {marginBottom:10}]}>
                                <Text style={[styles.font30,styles.textBold, styles.mR1, styles.textGray300]}>
                                    Item Code : 
                                </Text>
                                <Text style={[styles.font40]}>
                                    { OutgoingData !== null ? (OutgoingData[0].ItemCode ? OutgoingData[0].ItemCode : "-") : "-"  }
                                </Text> 
                            </View>
                        </View>
                        <View style={[styles.flexRow, styles.alignFlexEnd, styles.justifySpaceBetween, styles.mX1]}>
                            <View style={[styles.flexRow, styles.alignFlexEnd, {marginBottom:10}]}>
                                <Text style={[styles.font30,styles.textBold, styles.mR1, styles.textGray300]}>
                                    Lot No. : 
                                </Text>
                                <Text style={[styles.font40]}>
                                    { OutgoingData !== null ? (OutgoingData[0].LotNo ? OutgoingData[0].LotNo : "-") : "-" }
                                </Text>
                            </View> 
                            <View style={[styles.flexRow, styles.alignFlexEnd, {marginBottom:10}]}>
                                <Text style={[styles.font30,styles.textBold, styles.mR1, styles.textGray300]}>
                                    Output Qty : 
                                </Text>
                                <Text style={[styles.font40]}>
                                    { OutgoingData !== null ? (OutgoingData[0].Qty ? OutgoingData[0].Qty : "-") : "-"  }
                                </Text> 
                            </View>
                        </View>
                        {
                            FactoryID === 2
                            ?
                                <View style={[styles.flexRow, styles.alignFlexEnd, styles.justifySpaceBetween, styles.mX1]}>
                                    <View style={[styles.flexRow, styles.alignFlexEnd, styles.justifySpaceBetween, {marginBottom:10}]}>
                                        <Text style={[styles.font30,styles.textBold, styles.mR1, styles.textGray300]}>
                                            Thickness : 
                                        </Text>
                                        {ThicknessComponent()}
                                    </View>
                                    <View style={[styles.flexRow, styles.alignFlexEnd, styles.justifySpaceBetween, {marginBottom:10}]}>
                                        <Text style={[styles.font30,styles.textBold, styles.mR1, styles.textGray300]}>
                                            Actual Thickness : 
                                        </Text>
                                        {ActualThicknessComponent()}
                                    </View>
                                </View>
                            :
                                <></>
                        }
                        <View style={[styles.flexRow, styles.alignFlexEnd, styles.justifySpaceBetween, styles.mX1]}>
                            <View style={[styles.flexRow, styles.alignFlexEnd]}>
                                <Text style={[styles.font30,styles.textBold, styles.mR1, styles.textGray300]}>
                                    NG Qty : 
                                </Text>
                                {NGQuantityComponent()}
                            </View>
                            <View style={[styles.flexRow, styles.alignFlexEnd]}>
                                <Text style={[styles.font30,styles.textBold, styles.mR1, styles.textGray300]}>
                                    NG Remarks : 
                                </Text>
                                {RemarksComponent()}
                            </View>
                        </View>
                        {ButtonSaveCancel()}
                    </View>    
            }  
        </NativeBaseProvider>
    )
}

export default InscpectionDetails;