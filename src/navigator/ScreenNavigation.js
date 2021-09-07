import React from "react";

import LoginScreen from "../view/Login/LoginScreen";
import MainScreen from "../view/menu/MainScreen";
import ProductionWorkEntryScreen from "../view/menu/ProductionWorkEntryScreen";

import { styles, colors } from "../asset/css/BaseStyle";

import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { marginBottom } from "styled-system";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const Login = () =>{
    return(
        <Stack.Navigator>
            <Stack.Screen 
                name="LoginScreen" 
                component={LoginScreen} 
                options={{ 
                    title: 'Login',
                    headerTintColor: colors.lightColor,
                    headerStyle: {
                        backgroundColor: colors.canvaupperBG,
                    },
                    headerTitleStyle: {
                        fontSize: 40,
                    },
                }}
            />
        </Stack.Navigator>
    )
}

const Menu = () =>{
    return(
        <Stack.Navigator>
            <Stack.Screen 
                name="MainScreen" 
                component={MainScreen} 
                options={{ 
                    title: 'Main Menu',
                    headerTintColor: colors.lightColor,
                    headerStyle: {
                        backgroundColor: colors.canvaupperBG,
                        height:100
                    },
                    headerTitleStyle: {
                        fontSize: 40,
                    },
                }}
            />
            <Stack.Screen
                name="ProductionWorkEntryScreen" 
                component={ProductionWorkEntryScreen} 
                options={{ 
                    title: 'Production Work Entry',
                    headerTintColor: colors.lightColor,
                    headerStyle: {
                        backgroundColor: colors.canvaupperBG,
                        height:100
                    },
                    headerTitleStyle: {
                        fontSize: 40,
                    },
                }}
            />
        </Stack.Navigator>
    )
}

const ScreenNavigation = () => {
    return Menu();
}

export default ScreenNavigation;