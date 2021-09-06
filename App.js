/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
} from 'react-native';

import { 
  NavigationContainer 
} from '@react-navigation/native';

import { 
  Dimensions 
} from 'react-native';

import {
  styles,
  colors,
} from "./src/asset/css/BaseStyle"

import {
  createStore, 
  combineReducers, 
  applyMiddleware
} from 'redux';

import {Provider} from 'react-redux';
import ReduxThunk from 'redux-thunk';

// Redux Reducers
import LoginReducer from './src/redux/Login/LoginReducer';

//screen navigation
import ScreensNavigation from "./src/navigator/ScreenNavigation";

const RootReducer = combineReducers({
  Login: LoginReducer
})

const Store = createStore(RootReducer, applyMiddleware(ReduxThunk))

const App = () => {

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  return (
    <>
      <Provider store={Store}>
        <StatusBar style={[{styles.canvaupperBG}]}>
        <SafeAreaView>
          <NavigationContainer>
            {/* navigation screen here */}
            <View style = {[{height:windowHeight}, styles.backgroundWhite]}>
              <ScreensNavigation/>
            </View>
            {/* navigation screen end */}
          </NavigationContainer>
        </SafeAreaView>
      </Provider>
    </>
    
  );
};

export default App;
