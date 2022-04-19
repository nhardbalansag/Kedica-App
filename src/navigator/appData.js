import MainScreen from "../view/menu/MainScreen";
import ProductionWorkEntryScreen from "../view/menu/ProductionWorkEntryScreen";
import WorkResultInputScreen from "../view/menu/WorkResultInputScreen";
import InscpectionDetails from "../view/menu/InspectionDetails";
import HoldLotEntry from "../view/menu/HoldLotEntry";
import HoldQtyProcess from "../view/menu/HoldQtyProcess";
import LoginScreen from "../view/Login/LoginScreen";

import { styles, colors } from "../asset/css/BaseStyle";

const menuScreens = [
    {
        name:"MainScreen", 
        component: MainScreen, 
        title: 'Main Menu', 
        header:{
            headerTintColor: colors.lightColor,
            backgroundColor: colors.canvaupperBG,
            height: 100,
            fontSize: 40
        }
    },
    {
        name:"ProductionWorkEntryScreen", 
        component: ProductionWorkEntryScreen, 
        title: 'Production Work Entry', 
        header:{
            headerTintColor: colors.lightColor,
            backgroundColor: colors.canvaupperBG,
            height: 100,
            fontSize: 40
        }
    },
    {
        name:"WorkResultInputScreen", 
        component: WorkResultInputScreen, 
        title: 'Work Result Input', 
        header:{
            headerTintColor: colors.lightColor,
            backgroundColor: colors.canvaupperBG,
            height: 100,
            fontSize: 40
        }
    },
    {
        name:"InscpectionDetails", 
        component: InscpectionDetails, 
        title: 'Inspection Details', 
        header:{
            headerTintColor: colors.lightColor,
            backgroundColor: colors.canvaupperBG,
            height: 100,
            fontSize: 40
        }
    },
    {
        name:"HoldLotEntry", 
        component: HoldLotEntry, 
        title: 'Hold Lot Summary', 
        header:{
            headerTintColor: colors.lightColor,
            backgroundColor: colors.canvaupperBG,
            height: 100,
            fontSize: 40
        }
    },
    {
        name:"HoldQtyProcess", 
        component: HoldQtyProcess, 
        title: 'Hold Qty Return/Proceed', 
        header:{
            headerTintColor: colors.lightColor,
            backgroundColor: colors.canvaupperBG,
            height: 100,
            fontSize: 40
        }
    }
]

const loginScreenData = [
    {
        name:"LoginScreen", 
        component: LoginScreen, 
        title: 'Kedica Login', 
        header:{
            headerTintColor: colors.lightColor,
            backgroundColor: colors.canvaupperBG,
            height: 100,
            fontSize: 40
        }
    },
]

const ProductionScreen = [
    {
        title: "Production Work Entry",
        toptitle: "Production Work",
        iconuse: "cube",
        navigationScreen: "ProductionWorkEntryScreen",
        api: {
            url: "api/production-work/production-work-entry/index",
            method: "GET"
        }
    },
    {
        title: "Outgoing Inspection",
        toptitle: "Outgoing Quality Inspection",
        iconuse: "search",
        navigationScreen: "ProductionWorkEntryScreen",
        api: {
            url: "api/quality-inspection/outgoing-inspection/get",
            method: "POST"
        }
    },
    {
        title: "Hold Lot Summary",
        toptitle: "Receiving",
        iconuse: "pause",
        navigationScreen: "HoldLotEntry",
        api: {
            url: "api/receiving/get-hold-summary-list",
            method: "POST"
        }
    }
];

export {menuScreens, loginScreenData, ProductionScreen}