import React from "react";

import LoginScreen from "../view/Login/LoginScreen";

import { colors } from "../asset/css/BaseStyle";

import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

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
                    }
                }}
            />
        </Stack.Navigator>
    )
}

const ScreenNavigation = () => {
    return Login();
}

export default ScreenNavigation;