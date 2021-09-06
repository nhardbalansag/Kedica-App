import React,
{
    useState,
    useEffect
} from "react";

import { 
    View,
    ScrollView,
    KeyboardAvoidingView
} from "react-native";

import {
    styles,
    colors,
} from "../../asset/css/BaseStyle";

import {
    NativeBaseProvider,
    Box,
    Text,
    Heading,
    VStack,
    FormControl,
    Input,
    Link,
    Button,
    Icon,
    IconButton,
    HStack,
    Divider
  } from 'native-base';

const LoginScreen = () => {

    const [username, setUsername] = useState("admin")
    const [password, setPassword] = useState("12345678")

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
                    <Heading size="lg" color='primary.500'>
                        Kedica Login
                    </Heading>
                    <Heading color="muted.400" size="xs">
                        Sign in to continue!
                    </Heading>
                    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                        <VStack space={2} mt={5}>
                            <FormControl>
                                <FormControl.Label _text={{color: 'muted.700', fontSize: 'sm', fontWeight: 600}}>
                                    Username
                                </FormControl.Label>
                                <Input 
                                    value={username}
                                    onChangeText={(text) => setUsername(text)}
                                />
                            </FormControl>
                            <FormControl mb={5}>
                                <FormControl.Label  _text={{color: 'muted.700', fontSize: 'sm', fontWeight: 600}}>
                                    Password
                                </FormControl.Label>
                                <Input 
                                    type="password" 
                                    value={password}
                                    onChangeText={(text) => setPassword(text)}
                                />
                            </FormControl>
                            
                            <VStack  space={2}>
                                <Button 
                                    onPress={() => getLogin(username, password)}
                                    colorScheme="cyan" _text={{color: 'white' }}
                                >
                                    Login
                                </Button>
                            </VStack>
                        </VStack>
                    </KeyboardAvoidingView>
                </View>
            </KeyboardAvoidingView>
        </NativeBaseProvider>
    );
}

export default LoginScreen;