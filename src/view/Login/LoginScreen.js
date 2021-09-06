import React from "react";

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
    return(
        <NativeBaseProvider>
            <Box
                safeArea
                flex={1}
                p={2}
                w="90%"
                mx='auto'
                my='auto'
                justifyContent='center'
            >
                <Heading size="lg" color='primary.500'>
                    Kedica Login
                </Heading>
                <Heading color="muted.400" size="xs">
                    Sign in to continue!
                </Heading>

                <VStack space={2} mt={5}>
                    <FormControl>
                    <FormControl.Label _text={{color: 'muted.700', fontSize: 'sm', fontWeight: 600}}>
                        Username
                    </FormControl.Label>
                    <Input />
                    </FormControl>
                    <FormControl mb={5}>
                        <FormControl.Label  _text={{color: 'muted.700', fontSize: 'sm', fontWeight: 600}}>
                            Password
                        </FormControl.Label>
                        <Input type="password" />
                    </FormControl>
                    <VStack  space={2}>
                        <Button colorScheme="cyan" _text={{color: 'white' }}>
                            Login
                        </Button>
                    </VStack>
                </VStack>
            </Box>
        </NativeBaseProvider>
    );
}

export default LoginScreen;