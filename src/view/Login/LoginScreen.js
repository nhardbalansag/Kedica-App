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
    ActivityIndicator ,
} from "react-native";

import {
    styles,
    colors,
} from "../../asset/css/BaseStyle";

import { getHeaderTitle } from '@react-navigation/elements';

import Icon from 'react-native-vector-icons/FontAwesome';

import {
    NativeBaseProvider,
    Text,
    Heading,
    VStack,
    FormControl,
    Input,
    Modal ,
    Center,
    Button
  } from 'native-base';
  
import { 
    useSelector
} from 'react-redux';

import * as LoginAction from "../../redux/Login/LoginAction";
import { useDispatch } from "react-redux";

const LoginScreen = () => {
   
    const domainSetting = useSelector(state => state.loginCredential.domainSetting);

    const [username, setUsername] = useState("admin")
    const [password, setPassword] = useState("12345678")
    const [loadingstate, setloadingstate] = useState(false);
    const [modalVisible, setModalVisible] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [setting, setSetting] = useState("http:/192.168.200.100:1993/")
    // const [setting, setSetting] = useState("http:/172.18.5.9:8002/")

    const handleSizeClick = (newSize) => {
        setSize(newSize)
        setModalVisible(!modalVisible)
    }

    const dispatch = useDispatch()

    const getLogin = async (username, pass, domainSetting) => {
        setloadingstate(true);
        try {
            await dispatch(LoginAction.login(username, pass, domainSetting));
            await dispatch(LoginAction.getUserDetails(username, pass, domainSetting));
            setloadingstate(false);
        } catch (error) {
            alertMessage(error.message);
        }
    }

    const changesetting = async (dataset) => {
        try {
            await dispatch(LoginAction.changeDomain(dataset));
            setShowModal(false)
        } catch (error) {
            alertMessage(error.message);
        }
    }

    const alertMessage = (message) =>{
        Alert.alert(
            "Note",
            message,
            [
                { 
                  text: "OK",
                  onPress: () => setloadingstate(false)
                }
            ]
        );
    }

    const modal = () =>{
        return(
            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <Modal.Content>
                    <ScrollView>
                        <Modal.CloseButton />
                        <Modal.Header>Domain Configuration</Modal.Header>
                        <Modal.Body>
                        <FormControl>
                            <Text style={[styles.font20]}>Domain / IP Address</Text>
                            <Input 
                                disableFullscreenUI={true}
                                style={[
                                    styles.font20,
                                    styles.mB2
                                ]}
                                placeholder="ex: http://192.168.200.100:1993/"
                                value={setting}
                                onChangeText={(text) => setSetting(text)}
                            />
                            <View>
                                <TouchableOpacity onPress={() => changesetting(setting)}>
                                    <View style={[
                                        styles.backgroundPrimary,
                                        styles.justifyCenter,
                                        styles.alignCenter,
                                        styles.flexRow,
                                        styles.border10,
                                        styles.pY1,
                                        styles.pX2
                                    ]}>
                                        <Icon name="plus" size={20} color={colors.lightColor} />
                                        <Text style={[styles.font20, styles.textWhite, styles.mL1]}>Add Domain</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </FormControl>
                        </Modal.Body>
                            <Modal.Footer>
                        </Modal.Footer>
                    </ScrollView>
                </Modal.Content>
            </Modal>
        )
    }

    return(
        <NativeBaseProvider>
            <View style={[styles.mL1, styles.mT1]}>
                <TouchableOpacity
                    onPress={() => setShowModal(true)}
                >
                    <Icon name="gear" size={30} color={colors.darkColor} />
                </TouchableOpacity>
            </View>
            {
                domainSetting == null
                ?
                    <>
                        <View style={[
                            styles.justifyCenter,
                            styles.alignCenter
                        ]}>
                            <Text style={[styles.font20]}>Please set your Domain IP address..</Text>
                        </View>
                    </>
                :
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
                                        disableFullscreenUI={true}
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
                                        disableFullscreenUI={true}
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
                                        onPress={() => getLogin(username, password, domainSetting)} 
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
            }
            {modal()}
        </NativeBaseProvider>
    );
}

export default LoginScreen;