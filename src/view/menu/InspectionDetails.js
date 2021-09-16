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
    Input
} from 'native-base';

import Icon from 'react-native-vector-icons/FontAwesome';

const InscpectionDetails = (props, {navigation}) =>{

    const [thicknessFrom, setThicknessFrom] = useState("")
    const [thicknessTo, setThicknessTo] = useState("")
    const [NGRemarks, setNGRemarks] = useState("")
    const [activeActionSheet, setactiveActionSheet] = useState(false)

    const travelSheetNumber = props.route.params.dataContent.number;

    const { isOpen, onOpen, onClose } = useDisclose()

    const closeActionSheet = (remarks) =>{
        setactiveActionSheet(false)
        setNGRemarks(remarks)
    }

    const actionsheet = () =>{
        setactiveActionSheet(true)
    }

    const inspectionDataDetails = [
        { label: "Travel Sheet No.", data: travelSheetNumber },
        { label: "Item Code", data: "test" },
        { label: "Lot No", data: "test" },
        { label: "Output Qty", data: "test" },
        { label: "Thickness", data: "" },
        { label: "Actual Thickness", data: "test" },
        { label: "NG Qty", data: "test" },
        { label: "NG Remarks", data: "test" },
    ]

    const dataremarks = [
        {id: 1, remarkTitle: "test 1"},
        {id: 2, remarkTitle: "test 2"},
    ]

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
                        <Text style={[styles.font30, styles.textWhite, styles.mR1]}>Select Production Line</Text>
                        <Icon name="mouse-pointer" size={30} color={colors.lightColor} />
                    </View>
                </TouchableOpacity>
                <Actionsheet isOpen={activeActionSheet} onClose={onClose} hideDragIndicator={true} >
                    <Actionsheet.Content>
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
                        {
                            dataremarks != null?
                            dataremarks.map((data, index)=>
                                <Actionsheet.Item key={index}>
                                    <View>
                                        <TouchableOpacity onPress={() => closeActionSheet(data.id)}>
                                            <View style={[
                                                styles.flexRow,
                                                styles.justifySpaceBetween,
                                                styles.alignCenter,
                                                styles.pL5,
                                            ]}>
                                                <Icon name="circle" size={20} color={NGRemarks == data.id ? colors.primaryColor : colors.gray200} />
                                                <Text style={[styles.font40, styles.mL2]}>{data.remarkTitle}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </Actionsheet.Item>
                            )
                            :
                            <></>
                        }
                    </Actionsheet.Content>
                </Actionsheet>
            </View>
        )
    }

    const ActualThicknessComponent = () =>{
        return(
            <View>
                <Input
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
                />
            </View>
        )
    }

    const NGQuantityComponent = () =>{
        return(
            <View>
                <Input
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
                    />
                </View>
            </View>
        )
    }

    const components = ({item}) =>{
        return(
            <NativeBaseProvider>
                <View style={[
                    styles.flexRow,
                    styles.alignFlexEnd,
                    styles.mL2,
                    {marginBottom:10}
                ]}>
                    <Text style={[
                        styles.font30,
                        styles.textBold,
                        styles.mR1,
                        styles.textGray300
                    ]}>
                        {item.label} : 
                    </Text>
                        {
                            item.label == "Thickness" 
                            ? 
                                ThicknessComponent()
                            : 
                                (
                                    item.label == "NG Qty" 
                                    ?
                                        NGQuantityComponent()
                                    :
                                        (
                                            item.label == "Actual Thickness"
                                            ?
                                                ActualThicknessComponent()
                                            :
                                                (
                                                    item.label == "NG Remarks"
                                                    ? 
                                                        RemarksComponent()
                                                    :
                                                        <>
                                                            <Text style={[
                                                                styles.font40
                                                            ]}>    
                                                                {item.data}
                                                            </Text> 
                                                        </>
                                                )
                                        )
                                )
                        }
                </View>
            </NativeBaseProvider>
        )
    }

    const ButtonSaveCancel = () =>{
        return(
            <View style={[
                styles.flex1,
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
                    <TouchableOpacity>
                        <View style={[
                            styles.backgroundPrimary,
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
                    <TouchableOpacity>
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
            <View>
                <FlatList 
                    data={inspectionDataDetails}
                    renderItem={components} 
                    ListFooterComponent={ButtonSaveCancel}
                    numColumns={2}
                />
            </View>
        </NativeBaseProvider>
    )
}

export default InscpectionDetails;