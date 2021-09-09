import React,
{
    useState,
    useEffect
} from "react";

import { 
    View,
    KeyboardAvoidingView,
    Image,
    TouchableOpacity,
    FlatList,
    ScrollView,
    Alert,
    ActivityIndicator 
} from "react-native";

import {
    styles,
    colors,
} from "../../asset/css/BaseStyle";

import { getHeaderTitle } from '@react-navigation/elements';

import {
    NativeBaseProvider,
    Text,
    Heading,
    VStack,
    FormControl,
    Input
  } from 'native-base';

import * as LoginAction from "../../redux/Login/LoginAction";
import { useDispatch } from "react-redux";

const LoginScreen = () => {

    const [username, setUsername] = useState("admin")
    const [password, setPassword] = useState("12345678")
    const [loadingstate, setloadingstate] = useState(false);

    const dispatch = useDispatch()

    const getLogin = async (username, pass) => {
        setloadingstate(true);
        try {
            await dispatch(LoginAction.login(username, pass));
            setloadingstate(false);
        } catch (error) {
            alertMessage(error.message);
        }
    }

    const alertMessage = (message) =>{
        Alert.alert(
            "Note",
            message,
            [
              { text: "OK"}
            ]
        );
    }

    return(
        <NativeBaseProvider>
                <KeyboardAvoidingView 
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={[styles.justifyCenter, styles.alignCenter, styles.flex1]}
                > 
                    <View style={[styles.w90]}>
                        <View style={[
                            styles.justifyCenter,
                            styles.alignCenter
                        ]}
                        >
                            <Text 
                                style={[
                                    styles.font40,
                                    styles.textBold
                                ]}
                            >
                                Process Management System
                            </Text>
                        </View>
                        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                            <VStack >
                                <FormControl>
                                    <Text style={[styles.font30]}>Username</Text>
                                    <Input 
                                        style={[
                                            styles.font40,
                                            styles.bordered
                                        ]}
                                        value={username}
                                        onChangeText={(text) => setUsername(text)}
                                    />
                                </FormControl>
                                <FormControl mb={5}>
                                    <Text style={[styles.font30]}>Password</Text>
                                    <Input 
                                        style={[
                                            styles.font40,
                                            styles.bordered
                                        ]}
                                        type="password" 
                                        value={password}
                                        onChangeText={(text) => setPassword(text)}
                                    />
                                </FormControl>
                                
                                <VStack  space={2}>
                                    <TouchableOpacity
                                        onPress={() => getLogin(username, password)} 
                                    >
                                        <View 
                                            style ={[
                                                styles.backgroundLightBlue,
                                                styles.border10,
                                                styles.pY2
                                            ]}
                                        >
                                            
                                            {
                                                loadingstate 
                                                ? 
                                                    <ActivityIndicator style={[{marginLeft:5}]} size="large" color={colors.lightColor}/> 
                                                : 
                                                    <>
                                                        <Text style={[
                                                            styles.font40, 
                                                            styles.textWhite,
                                                            styles.textCenter
                                                        ]}>
                                                            Login
                                                        </Text>
                                                    </>
                                            }
                                        </View>
                                    </TouchableOpacity>
                                </VStack>
                            </VStack>
                        </KeyboardAvoidingView>
                    </View>
                </KeyboardAvoidingView>
            </NativeBaseProvider>
    );
}

export default LoginScreen;