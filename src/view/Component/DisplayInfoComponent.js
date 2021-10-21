import React,
{
    useState,
    useEffect
} from "react";

import { 
    View,
    Text,
} from "react-native";

import {
    styles,
    colors,
} from "../../asset/css/BaseStyle";

import Icon from 'react-native-vector-icons/FontAwesome';

const DisplayInfo = (props) =>{
    return(
        <View style={[styles.flexRow]}>
            <Text style={[styles.font30]}>{props.title}: </Text>
            <Text style={[styles.font30]}>{props.content}</Text>
        </View>
    )
}

export default DisplayInfo;