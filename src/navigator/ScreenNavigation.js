import React from "react";

import LoginScreen from "../view/Login/LoginScreen";
import MainScreen from "../view/menu/MainScreen";
import ProductionWorkEntryScreen from "../view/menu/ProductionWorkEntryScreen";
import WorkResultInputScreen from "../view/menu/WorkResultInputScreen";

import { styles, colors } from "../asset/css/BaseStyle";

import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { marginBottom } from "styled-system";

import { 
    useSelector
} from 'react-redux';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const Login = () =>{
    return(
        <Stack.Navigator>
            <Stack.Screen 
                name="LoginScreen" 
                component={LoginScreen} 
                options={{ 
                    title: 'Kedica Login',
                    headerTintColor: colors.lightColor,
                    headerStyle: {
                        backgroundColor: colors.canvaupperBG,
                        height: 100,
                    },
                    headerTitleStyle: {
                        fontSize: 40,
                    },
                }}
            />
        </Stack.Navigator>
    )
}

const menuScreens = [
    {
        name:"MainScreen", 
        component: MainScreen, 
        title: 'Main Menu', 
        header:{
            headerTintColor: colors.lightColor,
            backgroundColor: colors.canvaupperBG,
            height: 100,
            fontSize: 40
        }
    },
    {
        name:"ProductionWorkEntryScreen", 
        component: ProductionWorkEntryScreen, 
        title: 'Production Work Entry', 
        header:{
            headerTintColor: colors.lightColor,
            backgroundColor: colors.canvaupperBG,
            height: 100,
            fontSize: 40
        }
    },
    {
        name:"WorkResultInputScreen", 
        component: WorkResultInputScreen, 
        title: 'Work Result Input', 
        header:{
            headerTintColor: colors.lightColor,
            backgroundColor: colors.canvaupperBG,
            height: 100,
            fontSize: 40
        }
    }
]

const Menu = () =>{
    return(
        <Stack.Navigator>
            {
                menuScreens.map((screenData, index) => 
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

const ScreenNavigation = () => {

    const tokenresponse = useSelector(state => state.loginCredential.TokenData);

    if(tokenresponse !== null && tokenresponse !== undefined){
        return Menu();
    }else{
        return Login();
    }
}

export default ScreenNavigation;