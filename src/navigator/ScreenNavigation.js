import React,
{
    useState,
    useEffect
} from "react";

import {View, Text} from "react-native"

import {menuScreens, loginScreenData} from './appData'

import LoginScreen from "../view/Login/LoginScreen";

import { styles, colors } from "../asset/css/BaseStyle";

import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { marginBottom } from "styled-system";
import Icon from 'react-native-vector-icons/FontAwesome';

import { Popover, Button, Box, Center, NativeBaseProvider } from 'native-base';
import { 
    useSelector
} from 'react-redux';
import { TouchableOpacity } from "react-native-gesture-handler";
import * as LoginAction from "../redux/Login/LoginAction";
import { useDispatch } from "react-redux";

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

    const dispatch = useDispatch()

    const logoutuser = () =>{
        dispatch(LoginAction.logoutUser());
    }

    const alertMessage = (message) =>{
        Alert.alert(
            "Note",
            message,
            [
                { 
                  text: "OK"
                }
            ]
        );
    }

    const modal = () =>{
        return(
            <NativeBaseProvider>
                <Box h="100%" w="100%" justifyContent="center">
                        <Popover
                            trigger={(triggerProps) => {
                                return (
                                    <View style={[styles.mR1]}>
                                        <Button {...triggerProps}>
                                            <View style={[styles.flexRow, styles.mX2, styles.alignCenter]}>
                                                <Text style={[styles.font25,styles.textBold,styles.textWhite, styles.mR1]}>
                                                    {FirstName}
                                                </Text>
                                                <Icon name="caret-down" size={40} color={colors.lightColor}/>
                                            </View>
                                        </Button>
                                    </View>
                                )
                            }}
                        >
                        <Popover.Content accessibilityLabel="Delete Customerd" w="56">
                            <Popover.Arrow />
                            <Popover.CloseButton />
                            <Popover.Header>Logout {FirstName}</Popover.Header>
                            <Popover.Body>
                                Are you sure you want to Logout?
                            </Popover.Body>
                            <Popover.Footer justifyContent="flex-end">
                                <Button.Group space={2}>
                                    <Button colorScheme="coolGray" variant="ghost">
                                    Cancel
                                    </Button>
                                    <Button onPress={() => logoutuser()} colorScheme="danger">
                                        <Text style={[styles.textWhite, styles.textBold]}>Logout</Text>
                                    </Button>
                                </Button.Group>
                            </Popover.Footer>
                        </Popover.Content>
                    </Popover>
                </Box>
            </NativeBaseProvider>
        )
    }
    
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
                                <>{modal()}</>
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