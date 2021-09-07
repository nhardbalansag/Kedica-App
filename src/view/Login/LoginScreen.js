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
    ScrollView
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

const LoginScreen = () => {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const getLogin = (username, pass) => {
        var data = {
            username: username,
            password: pass
        }
        console.warn(data)
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
                                    <FormControl.Label _text={{color: 'muted.700', fontSize: 'xl', fontWeight: 600}}>
                                        Username
                                    </FormControl.Label>
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
                                    <FormControl.Label  _text={{color: 'muted.700', fontSize: 'xl', fontWeight: 600}}>
                                        Password
                                    </FormControl.Label>
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
                                            <Text style={[
                                                styles.font40, 
                                                styles.textWhite,
                                                styles.textCenter
                                            ]}>
                                                Login
                                            </Text>
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