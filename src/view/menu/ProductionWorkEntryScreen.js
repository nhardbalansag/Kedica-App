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
    TouchableOpacity
} from "react-native";

import {
    styles,
    colors,
} from "../../asset/css/BaseStyle";

import {
    NativeBaseProvider,
    FormControl,
    Input
} from 'native-base';

import Icon from 'react-native-vector-icons/FontAwesome';

const ProductionWorkEntryScreen = ({navigation}) =>{
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
                                    styles.bordered
                                ]}
                            />
                        </FormControl>
                    </View>
                    <View style={[
                        styles.flexRow,
                        styles.w35,
                        styles.alignFlexEnd,
                        styles.justifySpaceBetween
                    ]}>
                        <View>
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
                                    <Icon name="search" size={30} color={colors.lightColor} />
                                    <Text style={[styles.font30, styles.textWhite, styles.mL1]}>Search</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity>
                                <View style={[
                                    styles.bgDark,
                                    styles.justifyCenter,
                                    styles.alignCenter,
                                    styles.flexRow,
                                    styles.border10,
                                    styles.pY1,
                                    styles.pX2
                                ]}>
                                    <Icon name="list" size={30} color={colors.lightColor} />
                                    <Text style={[styles.font30, styles.textWhite, styles.mL1]}>Menu</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </NativeBaseProvider>
    );
}

export default ProductionWorkEntryScreen;