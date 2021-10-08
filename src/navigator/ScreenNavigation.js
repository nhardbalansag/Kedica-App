import React from "react";

import {View, Text} from "react-native"

import {menuScreens, loginScreenData} from './appData'

import LoginScreen from "../view/Login/LoginScreen";

import { styles, colors } from "../asset/css/BaseStyle";

import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { marginBottom } from "styled-system";
import Icon from 'react-native-vector-icons/FontAwesome';

import { 
    useSelector
} from 'react-redux';
import { TouchableOpacity } from "react-native-gesture-handler";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const Login = () =>{
    return(
        <Stack.Navigator>
            {
                loginScreenData.map((screenData, index) =>
                    <Stack.Screen 
                        key={index}
                        name={screenData.name}
                        component={screenData.component}
                        options={{ 
                            title: screenData.title,
                            headerTintColor: screenData.header.headerTintColor,
                            headerStyle: {
                                backgroundColor: screenData.header.backgroundColor,
                                height:screenData.header.height
                            },
                            headerTitleStyle: {
                                fontSize: screenData.header.fontSize,
                            },
                        }}
                    />
                )
            }
        </Stack.Navigator>
    )
}

const Menu = (FirstName) =>{

    return(
        <Stack.Navigator>
            {
                menuScreens.map((screenData, index) => 
                    <Stack.Screen 
                        key={index}
                        name={screenData.name}
                        component={screenData.component} 
                        options={({ navigation, route }) => ({ 
                            title: index === 0 ? screenData.title :  false,
                            headerTintColor: screenData.header.headerTintColor,
                            headerStyle: {
                                backgroundColor: screenData.header.backgroundColor,
                                height:screenData.header.height
                            },
                            headerTitleStyle: {
                                fontSize: screenData.header.fontSize,
                            },
                            headerLeft: () => (
                                index !== 0 
                                ?
                                <View style={[
                                    styles.justifyCenter,
                                    styles.alignCenter,
                                    styles.flexRow
                                ]}>
                                    <TouchableOpacity 
                                        style={[
                                            styles.pX2,
                                        ]}
                                        onPress={() => navigation.goBack()}
                                    >
                                        <Icon name="arrow-left" size={40} color={colors.lightColor}/>
                                    </TouchableOpacity>
                                    <Text style={[
                                            styles.font40,
                                            styles.textBold,
                                            styles.textWhite,
                                            styles.mX2
                                        ]}
                                        >
                                            {route.params.title}
                                    </Text>
                                </View>
                                :
                                    <></>
                            ),
                            headerRight: () => (
                                <View>
                                    <Text style={[styles.font25,styles.textBold,styles.textWhite, styles.mX2]}>
                                           {FirstName}
                                    </Text>
                                </View>
                              ),
                        })}
                    />
                )
            }
        </Stack.Navigator>
    )
}

const ScreenNavigation = () => {

    const tokenresponse = useSelector(state => state.loginCredential.TokenData);
    const FirstName = useSelector(state => state.loginCredential.FirstName);

    if(tokenresponse !== null && tokenresponse !== undefined){
        return Menu(FirstName);
    }else{
        return Login();
    }
}

export default ScreenNavigation;