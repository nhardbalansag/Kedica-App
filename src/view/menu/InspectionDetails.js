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

    // reject remarks is required if material reject has data vise versa
    //ng QTY is required when ng remarks has data

    const [thicknessFrom, setThicknessFrom] = useState(0)
    const [thicknessTo, setThicknessTo] = useState(0) 
    const [NGQTY, setNGQTY] = useState(null)
    const [ActualThickness, setActualThickness] = useState(0)
    const [NGRemarks, setNGRemarks] = useState(null)
    const [activeActionSheet, setactiveActionSheet] = useState(false)
    const [activeRejectActionSheet, setactiveRejectActionSheet] = useState(false)
    const [OutgoingData, setOutgoingData] = useState(null)
    const [dataRemarks, setdataRemarks] = useState(null)
    const [loading, setloading] =  useState(true);
    const [NGRemarksTitle, setNGRemarksTitle] =  useState(null);
    const [RejectRemarksTitle, setRejectRemarksTitle] =  useState(null);
    const [NGGoodQty, setNGGoodQty] =  useState(null);
    const [kitsampleqty, setkitsampleqty] =  useState(0);
    const [RejectRemarksID, setRejectRemarksID] =  useState(null);
    const [KeepSampleQty, setKeepSampleQty] =  useState(null);

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

    const RejectcloseActionSheet = (remarks, title) =>{
        setactiveRejectActionSheet(false)
        setRejectRemarksID(remarks)
        setRejectRemarksTitle(title)
    }

    const actionsheet = () =>{
        setactiveActionSheet(true)
    }

    const Rejectactionsheet = () =>{
        setactiveRejectActionSheet(true)
    }
    
    const getOutgoingTravelSheetDetails = async (travelsheet) =>{
        setloading(true)
        await fetch(domainSetting + "api/quality-inspection/get-travelsheet-details", {
            method:"POST",
            headers:{
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                TravelSheetNo: travelsheet,
                FactoryID : FactoryID
            })
        }).then(data => {
            if (!data.ok) {
                throw Error(data.status);
            }
            return data.json();
        }).then(responseData => {
            if(responseData[0].status === true && responseData[0].dataContent.IsProcess === 0){
                setOutgoingData([
                    {
                        ID: responseData[0].dataContent.ID,
                        ProductionWorkID: responseData[0].dataContent.ProductionWorkID,
                        TravelSheetNo: responseData[0].dataContent.TravelSheetNo,
                        PlatingLotNo: responseData[0].dataContent.PlatingLotNo,
                        ItemCode: responseData[0].dataContent.ItemCode,
                        ItemName: responseData[0].dataContent.ItemName,
                        LotNo: responseData[0].dataContent.LotNo,
                        Qty: responseData[0].dataContent.Qty,
                        UpdateDate: responseData[0].dataContent.UpdateDate,
                    }
                ])
                setloading(false)
            }else{
                props.navigation.goBack();
                alertMessage("Please scan valid travelsheet.")
            }
        }).catch(error => {
            setloading(false)
            alertMessage(error.message)
        }); 
    }

    const getRemarks = () =>{
        fetch(domainSetting + "api/remarks/get-remarks", {
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
            setdataRemarks(responseData[0].dataContent)
        }).catch(error => {
            alertMessage(error.message)
        }); 
    }

    const validateSave = () =>{

        var NGGoodQty_val = parseFloat(NGGoodQty ? NGGoodQty : 0)
        var NGQTY_val = parseFloat(NGQTY ? NGQTY : 0)

        var qtytotal = parseFloat((NGGoodQty_val !== null ? NGGoodQty_val : 0)) + parseFloat((NGQTY_val !== null ? NGQTY_val : 0))

        if(qtytotal > OutgoingData[0].Qty){
            alertMessage("Invalid Input, Please try again.")
        }else{
            saveInspectionDetails()
        }
    }

     const saveInspectionDetails = async () =>{
        var ngqtydata = NGQTY ? NGQTY : null
        if(((ngqtydata == null && NGRemarks == null) || (ngqtydata > 0 && NGRemarks !== null))){
            // if(FactoryID === 2 && (thicknessFrom == 0 || thicknessTo == 0 || ActualThickness == 0)){
            //     alertMessage("Thickness must not be null")
            // }else{
                // if(isNaN(NGQTY) == false && isNaN(thicknessFrom) == false && isNaN(thicknessTo) == false && isNaN(ActualThickness) == false){
                if(isNaN(NGQTY) == false){
                    var metrialrejectdata = NGGoodQty ? NGGoodQty : null

                    if((metrialrejectdata == null && RejectRemarksID == null) || (metrialrejectdata > 0 && RejectRemarksID !== null)){
                        setloading(true)
                        await fetch(domainSetting + "api/quality-inspection/save", {
                            method:'POST',
                            headers:{
                                'Content-type': 'application/json',
                                'Authorization': 'Bearer ' + token
                            },
                            body: JSON.stringify({
                                ProductionWorkID: OutgoingData[0].ProductionWorkID,
                                // ThicknessFrom: parseFloat(thicknessFrom),
                                // ThicknessTo: parseFloat(thicknessTo),
                                // ActualThickness : parseFloat(ActualThickness),
                                ThicknessFrom: null,
                                ThicknessTo: null,
                                ActualThickness : null,
                                NGQty : parseFloat(NGQTY),
                                NGGoodQty : parseFloat(NGGoodQty),
                                NGRemarksID : NGRemarks,
                                KeepSampleQty : parseFloat(KeepSampleQty),
                                RejectRemarksID : RejectRemarksID
                            })
                        }).then(data => {
                            if (!data.ok) {
                                throw Error(data.status);
                            }
                            return data.json();
                        }).then(responseData => {
                            setloading(false)
                            if(responseData[0].status === true){
                                props.navigation.goBack()
                            }else{
                                alertMessage(responseData[0].message)
                            }
                        }).catch(error => {
                            alertMessage(error.message)
                        }); 
                    }else{
                        NGGoodQty ? alertMessage("Material Reject QTY and Reject Remarks Cannot be empty") : alertMessage("Material Reject QTY must not be null")
                    }
                }else{
                    alertMessage("Please input a valid number")
                }
            // }
        }else{
            NGQTY ? alertMessage("NG Remarks and NG Quantity Cannot be empty") : alertMessage("NG Quantity must not be null")
        }
    }

    useEffect(() =>{
        getRemarks()
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

    const RejectRemarksComponent = () =>{
        return(
            <View>
                <TouchableOpacity onPress={ () => Rejectactionsheet()}>
                    <View style={[ styles.backgroundPrimary, styles.justifyCenter, styles.alignCenter, styles.flexRow, styles.border10, styles.pY1, styles.pX2 ]}>
                        <Text style={[styles.font30, styles.textWhite, styles.mR1]}>{RejectRemarksTitle !== null ? RejectRemarksTitle : "Select Remarks"}</Text>
                        <Icon name="mouse-pointer" size={30} color={colors.lightColor} />
                    </View>
                </TouchableOpacity>
                <Actionsheet isOpen={activeRejectActionSheet} onClose={onClose} hideDragIndicator={true} >
                    <Actionsheet.Content  style={[styles.alignFlexStart]}>
                        <Actionsheet.Item>
                            <View>
                                <TouchableOpacity onPress={() => setactiveRejectActionSheet(false)}>
                                    <View style={[ styles.flexRow, styles.justifySpaceBetween, styles.alignCenter, styles.pL5, ]}>
                                        <Icon name="times" size={40} color={colors.dangerColor} />
                                        <Text style={[styles.font40, styles.mL2, styles.textDanger]}>Cancel</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </Actionsheet.Item>
                        <ScrollView>
                            <Actionsheet.Item>
                                <View>
                                    <TouchableOpacity onPress={() => RejectcloseActionSheet(null, "Select Remarks")}>
                                        <View style={[ styles.flexRow, styles.justifySpaceBetween, styles.alignCenter, styles.pL5, ]}>
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
                                            <TouchableOpacity onPress={() => RejectcloseActionSheet(data.ID, data.NGRemarks)}>
                                                <View style={[ styles.flexRow, styles.justifySpaceBetween, styles.alignCenter, styles.pL5, ]}>
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
            <View style={[styles.w75]}>
                <Input
                    disableFullscreenUI={true}
                    size="2xl"
                    width="100%"
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

    const NGGoodQtyfun = () =>{
        return(
            <View >
                <Input
                    disableFullscreenUI={true}
                    size="2xl"
                    placeholder=" Material Reject QTY "
                    _light={{
                        placeholderTextColor: "blueGray.400",
                    }}
                    _dark={{
                        placeholderTextColor: "blueGray.50",
                    }}
                    keyboardType='numeric'
                    minLength={0}
                    onChangeText={(text) => setNGGoodQty(text)}
                    value={NGGoodQty}
                />
            </View>
        )
    }

    const keepSample = () =>{
        return(
            <View style={[{width:"41%"}]}>
                <Input
                    disableFullscreenUI={true}
                    size="2xl"
                    placeholder=" Keep Sample QTY "
                    _light={{
                        placeholderTextColor: "blueGray.400",
                    }}
                    _dark={{
                        placeholderTextColor: "blueGray.50",
                    }}
                    keyboardType='numeric'
                    minLength={0}
                    onChangeText={(text) => setKeepSampleQty(text)}
                    value={KeepSampleQty}
                />
            </View>
        )
    }

    const rejectRemark = () =>{
        return(
            <View>
                <Input
                    disableFullscreenUI={true}
                    size="2xl"
                    placeholder=" Reject Remarks "
                    _light={{
                        placeholderTextColor: "blueGray.400",
                    }}
                    _dark={{
                        placeholderTextColor: "blueGray.50",
                    }}
                    keyboardType='numeric'
                    minLength={0}
                    onChangeText={(text) => setkitsampleqty(text)}
                    value={kitsampleqty}
                />
            </View>
        )
    }
 
    const ThicknessComponent = () =>{
        return(
            <View style={[styles.flexRow]}>
                <View style={[styles.flexRow , styles.justifyCenter, styles.alignFlexEnd]}>
                    <Text style={[ styles.font30, styles.textBold, styles.mR1 ]}> From : </Text>
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
                    <Text style={[ styles.font30, styles.textBold, styles.mX1 ]}> To : </Text>
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
            <View style={[ styles.flexRow, styles.alignCenter, styles.justifySpaceAround, ]}>
                <View style={[ styles.mY1, styles.alignCenter, styles.justifyCenter, styles.flexRow, ]}>
                    <TouchableOpacity onPress={() => validateSave()} >
                        <View style={[ styles.backgroundPrimary, styles.justifyCenter, styles.alignCenter, styles.border10, styles.pY100, styles.w100, styles.pX9, ]}>
                            <View style={[styles.flexRow ]}>
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
                    <View style={[styles.mX3, styles.mY2]}>
                        <View style={[styles.flexRow, styles.alignFlexEnd, styles.mL1, {marginBottom:10}]}>
                            <Text style={[styles.font30,styles.textBold, styles.mR1, styles.textGray300, styles.w23]}>
                                Travel Sheet No. : 
                            </Text>
                            <Text style={[styles.font40, styles.w80]}>
                                { travelSheetNumber ? travelSheetNumber : "-" }
                            </Text> 
                        </View>
                        <View style={[styles.flexRow, styles.alignFlexEnd, styles.mL1, {marginBottom:10}]}>
                            <Text style={[styles.font30,styles.textBold, styles.mR1, styles.textGray300, styles.w23]}>
                                Product Name : 
                            </Text>
                            <Text style={[styles.font40, styles.w80]}>
                                { OutgoingData !== null ? (OutgoingData[0].ItemCode ? OutgoingData[0].ItemCode + " - " +  OutgoingData[0].ItemName: "-") : "-"  }
                            </Text> 
                        </View>
                        <View style={[styles.flexRow, styles.alignFlexEnd, styles.mL1, {marginBottom:10}]}>
                            <Text style={[styles.font30,styles.textBold, styles.mR1, styles.textGray300, styles.w23]}>
                                Lot No. : 
                            </Text>
                            <Text style={[styles.font40]}>
                                { OutgoingData !== null ? (OutgoingData[0].LotNo ? OutgoingData[0].LotNo : "-") : "-" }
                            </Text>
                        </View> 
                        <View style={[styles.flexRow, styles.alignFlexEnd, styles.mL1, {marginBottom:10}]}>
                            <Text style={[styles.font30,styles.textBold, styles.mR1, styles.textGray300, styles.w23]}>
                                Plating Lot No. : 
                            </Text>
                            <Text style={[styles.font40, styles.w80]}>
                                { OutgoingData !== null ? (OutgoingData[0].PlatingLotNo ? OutgoingData[0].PlatingLotNo : "-") : "-"  }
                            </Text> 
                        </View>
                        <View style={[styles.flexRow, styles.alignFlexEnd, styles.mL1, {marginBottom:10}]}>
                            <Text style={[styles.font30,styles.textBold, styles.mR1, styles.textGray300, styles.w23]}>
                                Output Qty : 
                            </Text>
                            <Text style={[styles.font40, styles.w80]}>
                            { OutgoingData !== null ? (OutgoingData[0].Qty ? OutgoingData[0].Qty : "-") : "-"  }
                            </Text> 
                        </View>
                        {/* {
                            FactoryID === 2
                            ?
                                <View style={[styles.flexRow, styles.alignFlexEnd, styles.mX1]}>
                                    <View style={[styles.flexRow, styles.alignFlexEnd, styles.justifySpaceBetween, {marginBottom:10}, styles.w50, styles.mR1]}>
                                        <Text style={[styles.font30,styles.textBold, styles.mR1, styles.textGray300]}>
                                            Thickness : 
                                        </Text>
                                        {ThicknessComponent()}
                                    </View>
                                    <View style={[styles.flexRow, styles.alignFlexEnd, styles.justifySpaceBetween, {marginBottom:10},styles.w30]}>
                                        <Text style={[styles.font30,styles.textBold, styles.mR1, styles.textGray300]}>
                                            Actual Thickness : 
                                        </Text>
                                        {ActualThicknessComponent()}
                                    </View>
                                </View>
                            :
                                <></>
                        } */}
                        <View style={[styles.flexRow, styles.alignFlexEnd, styles.mX1]}>
                            <View style={[styles.flexRow, styles.alignFlexEnd, styles.w50, styles.mR1]}>
                                <Text style={[styles.font30,styles.textBold, styles.mR2, styles.textGray300, styles.w20]}>
                                    NG Qty : 
                                </Text>
                                {NGQuantityComponent()}
                            </View>
                            <View style={[styles.flexRow, styles.alignFlexEnd, styles.w30]}>
                                <Text style={[styles.font30,styles.textBold, styles.mR1, styles.textGray300, styles.w70]}>
                                    NG Remarks : 
                                </Text>
                                {RemarksComponent()}
                            </View>
                        </View>
                        <View style={[styles.flexRow, styles.alignFlexEnd, styles.mX1, styles.mY1]}>
                            <View style={[styles.flexRow, styles.alignFlexEnd, styles.w50, styles.mR1]}>
                                <Text style={[styles.font30,styles.textBold, styles.mR2, styles.textGray300,styles.w50]}>
                                    Material Reject QTY : 
                                </Text>
                                {NGGoodQtyfun()}
                            </View>
                            <View style={[styles.flexRow, styles.alignFlexEnd, styles.w30]}>
                                <Text style={[styles.font30,styles.textBold, styles.mR1, styles.textGray300, styles.w70]}>
                                    Reject Remarks : 
                                </Text>
                                {RejectRemarksComponent()}
                            </View>
                        </View>
                        <View style={[styles.flexRow, styles.alignFlexEnd, styles.mX1, styles.mY1]}>
                            <View style={[styles.flexRow, styles.alignFlexEnd]}>
                                <Text style={[styles.font30,styles.textBold, styles.mR1, styles.textGray300]}>
                                    Keep Sample QTY : 
                                </Text>
                                {keepSample()}
                            </View>
                        </View>
                        {ButtonSaveCancel()}
                    </View>   
                </ScrollView> 
            }  
            
        </NativeBaseProvider>
    )
}

export default InscpectionDetails;