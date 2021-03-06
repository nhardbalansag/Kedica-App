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
    Checkbox,
    Input,
    ScrollView
} from 'native-base';

import Icon from 'react-native-vector-icons/FontAwesome';

const HoldQtyProcess = (props, {navigation}) =>{

    const [loading, setloading] =  useState(true);
    const [holdQtyDetails, setholdQtyDetails] =  useState(null);
    const [returnQty, setreturnQty] =  useState(null);
    const [proceedQty, setproceedQty] =  useState(null);
    const [IsStrip, setIsStrip] =  useState(false);
    const [IsReplate, setIsReplate] =  useState(false);

    const detailsId = props.route.params.dataContent.number;
    const token = useSelector(state => state.loginCredential.TokenData);
    const domainSetting = useSelector(state => state.loginCredential.domainSetting);

    const getdetails = async () =>{
        setloading(true)
        await fetch(domainSetting + "api/receiving/get-hold-lot-details/" + detailsId, {
            method:"GET",
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }).then(data => {
            if (!data.ok) {
                throw Error(data.status);
            }
            return data.json();
        }).then(responseData => {
            setholdQtyDetails([
                {
                    OrderEntryID: responseData[0].dataContent[0].OrderEntryID,
                    ProductionWorkID: responseData[0].dataContent[0].ProductionWorkID,
                    HoldLotID: responseData[0].dataContent[0].HoldLotID,
                    SourceName: responseData[0].dataContent[0].SourceName,
                    ItemNo: responseData[0].dataContent[0].ItemNo,
                    ItemDesc: responseData[0].dataContent[0].ItemDesc,
                    LotNo: responseData[0].dataContent[0].LotNo,
                    ReceivedQty: responseData[0].dataContent[0].ReceivedQty,
                    NGRemarks: responseData[0].dataContent[0].NGRemarks,

                    IsStrip: IsStrip,
                    IsReplate: IsReplate,
                }
            ])
            setloading(false)
        }).catch(error => {
            alertMessage(error.message)
        }); 
    }

    const validateSave = () =>{
        var return_qty = returnQty ? returnQty : 0
        var proceedQty_qty = proceedQty ? proceedQty : 0

        var qtytotal = parseInt((return_qty !== null ? return_qty : return_qty)) + parseInt((proceedQty_qty !== null ? proceedQty_qty : 0))
        
        if(qtytotal !== holdQtyDetails[0].ReceivedQty){
            alertMessage("Return QTY and Proceed Qty must be equal to Received QTY")
        }else{
            saveholdLot()
        }
    }
  
    const saveholdLot = () =>{
        fetch(domainSetting + "api/receiving/save-scrap-rework", {
            method:'POST',
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                HoldLotID: holdQtyDetails[0].HoldLotID,
                ProductionWorkID: holdQtyDetails[0].ProductionWorkID,
                LotNo: holdQtyDetails[0].LotNo,
                ReturnQty: returnQty ? returnQty : 0,
                ProceedQty: proceedQty ? proceedQty : 0,
                IsStrip: IsStrip,
                IsReplate: IsReplate
            })
        }).then(data => {
            if (!data.ok) {
                throw Error(data.status);
            }
            return data.json();
        }).then(responseData => {
            if(responseData[0].status === true){
                props.navigation.goBack()
            }else{
                alertMessage(responseData[0].message)
            }
        }).catch(error => {
            alertMessage(error.message);
        }); 
    }

    useEffect(() =>{
        getdetails()
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

    const stripFun = () =>{
        IsStrip ? setIsStrip(false) : setIsStrip(true)
    }

    const replateFun = () =>{
        IsReplate ? setIsReplate(false) : setIsReplate(true)
    }

    const ProceedQtyComponent = () =>{
        return(
            <View>
                <Input
                    disableFullscreenUI={true}
                    size="2xl"
                    placeholder=" 0 "
                    _light={{
                        placeholderTextColor: "blueGray.400",
                    }}
                    _dark={{
                        placeholderTextColor: "blueGray.50",
                    }}
                    keyboardType={'numeric'}
                    minLength={0}
                    onChangeText={(text) => setproceedQty(text)}
                    value={proceedQty}
                />
            </View>
        )
    }
    
    const ReturnQtyComponent = () =>{
        return(
            <View style={[styles.flexRow]}>
                <View style={[styles.flexRow , styles.justifyCenter, styles.alignFlexEnd]}>
                    <Input
                        disableFullscreenUI={true}
                        size="2xl"
                        placeholder=" 0 "
                        _light={{
                            placeholderTextColor: "blueGray.400",
                        }}
                        _dark={{
                            placeholderTextColor: "blueGray.50",
                        }}
                        keyboardType={'numeric'}
                        minLength={0}
                        onChangeText={(text) => setreturnQty(text)}
                        value={returnQty}
                    />
                </View>
            </View>
        )
    }

    const ButtonSaveCancel = () =>{
        return(
            <View style={[styles.flexRow,styles.alignCenter,styles.justifySpaceAround,]}>
                <View style={[styles.mY1,styles.alignCenter,styles.justifyCenter,styles.flexRow,]}>
                    <TouchableOpacity onPress={() => validateSave()}>
                        <View style={[styles.backgroundPrimary,styles.justifyCenter,styles.alignCenter,styles.border10,styles.pY100,styles.w100,styles.pX9,]}>
                            <View style={[styles.flexRow]}>
                                <Icon name={"save"} size={70} color={colors.lightColor}/>
                                <Text style={[styles.font60, styles.mL2, styles.textWhite]}>Save</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View> 
                <View style={[styles.mY1]}>
                    <TouchableOpacity onPress={() => props.navigation.goBack()}>
                        <View style={[styles.bgWarning,styles.justifyCenter,styles.alignCenter,styles.border10,styles.pY100,styles.w100,styles.pX8]}>
                            <View style={[styles.flexRow]}>
                                <Icon name={"times"} size={70} color={colors.lightColor} />
                                <Text style={[styles.font60, styles.mL2, styles.textWhite]}>Cancel</Text>
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
                        <View style={[styles.alignCenter,styles.justifyCenter,styles.flex1]}>
                            <ActivityIndicator  size="large" color={colors.primaryColor}/>
                        </View>
                    </>
                :
                    <ScrollView>
                        <View style={[styles.mX3]}>
                            <View style={[styles.flexRow, styles.alignCenter, styles.justifySpaceAround]}>
                                <View>
                                    <View style={[]}>
                                        <View style={[styles.flexRow]}>
                                            <Text style={[styles.font30,styles.textBold, styles.mR1, styles.textDark]}>
                                                Product Name :
                                            </Text>
                                            <Text style={[styles.font30, styles.mR1, styles.textDark]}>
                                                {holdQtyDetails[0].ItemDesc}
                                            </Text>
                                        </View>
                                        <View style={[styles.flexRow]}>
                                            <Text style={[styles.font30,styles.textBold, styles.mR1, styles.textDark]}>
                                                Lot No :
                                            </Text>
                                            <Text style={[styles.font30, styles.mR1, styles.textDark]}>
                                                {holdQtyDetails[0].LotNo}
                                            </Text>
                                        </View>
                                        <View style={[styles.flexRow]}>
                                            <Text style={[styles.font30,styles.textBold, styles.mR1, styles.textDark]}>
                                                Received Qty :
                                            </Text>
                                            <Text style={[styles.font30, styles.mR1, styles.textDark]}>
                                                {holdQtyDetails[0].ReceivedQty}
                                            </Text>
                                        </View>
                                        <View style={[styles.flexRow]}>
                                            <Text style={[styles.font30,styles.textBold, styles.mR1, styles.textDark]}>
                                                Remarks :
                                            </Text>
                                            <Text style={[styles.font30, styles.mR1, styles.textDark]}>
                                                {holdQtyDetails[0].NGRemarks}
                                            </Text>
                                        </View>
                                    </View>
                            
                                    <View style={[]}>
                                        <View style={[styles.flexRow, styles.alignFlexEnd, {marginBottom:10}]}>
                                            <Text style={[styles.font30,styles.textBold, styles.mR1, styles.textDark]}>
                                                Return Qty :
                                            </Text>
                                            {ReturnQtyComponent()}
                                        </View>
                                        <View style={[styles.flexRow, styles.alignFlexEnd, {marginBottom:10}]}>
                                            <Text style={[styles.font30,styles.textBold, styles.mR1, styles.textDark]}>
                                                Proceed Qty : 
                                            </Text>
                                            {ProceedQtyComponent()}
                                        </View>
                                    </View>
                                </View>
                                <View>
                                    <View style={[]}>
                                        <View style={[styles.flexRow, styles.alignCenter, {marginBottom:10}]}>
                                            <Text style={[styles.font30,styles.textBold, styles.mR1, styles.textDark]}>
                                                Strip? :
                                            </Text>
                                            <Checkbox onChange={() => stripFun()}  value={IsStrip} size="lg" accessibilityLabel="strip" />
                                        </View>
                                        <View style={[styles.flexRow, styles.alignCenter, {marginBottom:10}]}>
                                            <Text style={[styles.font30,styles.textBold, styles.mR1, styles.textDark]}>
                                                Replate? : 
                                            </Text>
                                            <Checkbox onChange={() => replateFun()} value={IsReplate} size="lg" accessibilityLabel="replate" />
                                        </View>
                                    </View>
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