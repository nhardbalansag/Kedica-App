import React from "react";

import { 
    View,
    Text,
} from "react-native";

import {
    styles,
    colors,
} from "../../asset/css/BaseStyle";

const LoginScreen = () => {
    return(
        <View style={[styles.backgroundWhite]}>
            <Text>
                this is a login screen
            </Text>
        </View>
    );
}

export default LoginScreen;