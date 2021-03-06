import React from "react";

import {
    View,
    Text
} from "react-native"

import {
    styles,
    colors
} from "../../asset/css/BaseStyle";

const AppStart = () =>{
    return(
        <View 
            style = {
                [
                    styles.flex1,
                    styles.alignCenter,
                    styles.justifyCenter
                ]
            }
        >
            <View>
                <Text
                    style ={
                        [
                            styles.font60,
                            styles.textBold,
                            styles.textWhite,
                            styles.textUppercase
                        ]
                    }
                >
                    
                    Process Management System
                </Text>
            </View>
            <View style={
                [ 
                    styles.justifyCenter, 
                    styles.alignCenter,
                    styles.w90
                ] 
            }>
                <Text style={
                    [
                        styles.textCenter,
                        styles.textWhite,
                        styles.font25
                    ]
                }>
                    © Copyright 2021 | All Rights Reserved | Powered by SEIKO-IT Solutions Inc.
                </Text>
            </View>
        </View>
    )
}

export default AppStart;