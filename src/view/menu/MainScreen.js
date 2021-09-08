import React,
{
    useState,
    useEffect
} from "react";

import { 
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    FlatList,
    RefreshControl,
    ActivityIndicator
} from "react-native";

import {
    styles,
    colors,
} from "../../asset/css/BaseStyle";

import {
    NativeBaseProvider, usePropsResolution,
} from 'native-base';

import Icon from 'react-native-vector-icons/FontAwesome';
import { fontSize } from "styled-system";

const MainScreen = ({navigation}) =>{

    const testData = [
        {
            id: 1,
            title: "test title",
            toptitle: "test top",
            iconuse: "cube"
        },
    ];

    const ButtonComponent = ({item}) => {
        return(
            <View>
                <TouchableOpacity
                    onPress={() => navigation.navigate("ProductionWorkEntryScreen")}
                >
                    <View 
                        style={[
                            styles.backgroundPrimary,
                            styles.pY2,
                            styles.pX1,
                            styles.mX3,
                            styles.mY1,
                            styles.justifyCenter,
                            styles.alignCenter,
                            styles.border10
                        ]}
                    >
                        <View>
                            <View>
                                <Text style={[styles.textWhite, styles.font20]}>Production Work</Text>
                            </View>
                            <View style={[styles.flexRow, styles.justifyStart, styles.alignCenter]}>
                                <Icon name="cube" size={30} color={colors.lightColor} />
                                <Text style={[styles.textWhite, styles.mL1, styles.font40]}>Production Work Entry</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View
            style={[
                styles.alignCenter
            ]}
        >
            <FlatList 
                // keyExtractor={item => console.log(item)} 
                data={testData} 
                renderItem={ButtonComponent} 
                numColumns={2}
            />
        </View>
    )
}

export default  MainScreen;