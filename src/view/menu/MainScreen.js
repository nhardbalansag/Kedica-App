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
    NativeBaseProvider, 
    usePropsResolution,
} from 'native-base';

import Icon from 'react-native-vector-icons/FontAwesome';

const MainScreen = ({navigation}) =>{

    const ProductionScreen = [
        {
            title: "Production Work Entry",
            toptitle: "Production Work",
            iconuse: "cube",
            navigationScreen: "ProductionWorkEntryScreen",
            api: {
                url: "api/production-work/production-work-entry/index",
                method: "GET"
            }
        },
        {
            title: "Outgoing Inspection",
            toptitle: "Outgoing Quality Inspection",
            iconuse: "search",
            navigationScreen: "ProductionWorkEntryScreen",
            api: {
                url: "api/quality-inspection/outgoing-inspection/get",
                method: "GET"
            }
        }
    ];

    const ButtonComponent = ({item}) => {
        return(
            <View>
                <TouchableOpacity
                    onPress={() => navigation.navigate(
                        item.navigationScreen,
                        {
                            url: item.api.url,
                            method: item.api.method,
                            title: item.title
                        }
                    )}
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
                                <Text style={[styles.textWhite, styles.font20]}>{item.toptitle}</Text>
                            </View>
                            <View style={[styles.flexRow, styles.justifyStart, styles.alignCenter]}>
                                <Icon name={item.iconuse} size={30} color={colors.lightColor} />
                                <Text style={[styles.textWhite, styles.mL1, styles.font40]}>{item.title}</Text>
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
                data={ProductionScreen} 
                renderItem={ButtonComponent} 
                numColumns={2}
            />
        </View>
    )
}

export default  MainScreen;