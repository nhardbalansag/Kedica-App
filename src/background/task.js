import BackgroundService from 'react-native-background-actions';

import DeviceInfo from 'react-native-device-info';
import React, { useRef } from 'react';
import BackgroundTimer from 'react-native-background-timer';

const options = {
    taskName: 'Status',
    taskTitle: 'Device Activity Status',
    taskDesc: 'Getting your device activity status information',
    taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
    },
    // color: '#ff00ff',
    linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
    parameters: {
        delay: 1000,
    },
};


const veryIntensiveTask = async (taskDataArguments) => {
    // Example of an infinite loop task
    await new Promise( async (resolve) => {
        starttime()
    });
};

const startTask = async () =>{
    try {
        await BackgroundService.start(veryIntensiveTask, options);
    } catch (error) {
      console.log(error.message)
    }
}

const updateTask = async (data) =>{
    try {
        await BackgroundService.updateNotification({taskDesc: data});
        getDeviceActivity()
    } catch (error) {
      console.log(error.message)
    }
}

const starttime = () =>{
    BackgroundTimer.runBackgroundTimer(() => { 
        getDeviceActivity()
    }, 3000);
}

const getDeviceActivity = () =>{
    DeviceInfo.isLocationEnabled().then((enabled) => {
        // true or false
        console.log("isLocationEnabled =>" + enabled)
    });
    DeviceInfo.getAvailableLocationProviders().then((providers) => {
        // {
        //   gps: true
        //   network: true
        //   passive: true
        // }
        console.log(providers)
    });
    DeviceInfo.isBatteryCharging().then((isCharging) => {
        // true or false
        console.log("isBatteryCharging =>" + isCharging)
    });
    DeviceInfo.isAirplaneMode().then((airplaneModeOn) => {
        // false
        console.log("isAirplaneMode =>" + airplaneModeOn)
    });
    DeviceInfo.getPowerState().then((state) => {
        // {
        //   batteryLevel: 0.759999,
        //   batteryState: 'unplugged',
        //   lowPowerMode: false,
        // }
        console.log(state)
    });
}

const getDeviceInformation = () =>{
    let uniqueId = DeviceInfo.getUniqueId();
}

export const backgroundTaskInit = async() =>{
    console.log("running background")
    startTask()
}


export const updateTaskfunct = async(data) =>{
    console.log(data)
    updateTask(data)
}
