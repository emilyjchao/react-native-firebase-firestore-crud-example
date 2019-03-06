//All app files must be imported below
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, KeyboardAvoidingView, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import HomeScreen from './components/HomeScreen';
import AllScreen from './components/AllScreen'
import SettingsScreen from './components/SettingsScreen';
import CalibrateScreen from './components/CalibrateScreen';
import AveragesScreen from './components/AveragesScreen';
import DayScreen from './components/DayScreen';
import MonthScreen from './components/MonthScreen';
import WeekScreen from './components/WeekScreen';
import SignIn from './components/SignIn';
import PairDevice from './components/PairDevice';

import colors from './components/colors';
import {Constants, Permissions, Notifications} from 'expo';

//Function to register notification permissions
async function register(){
  const {status: alertPermission} = await Expo.Permissions.askAsync(Expo.Permissions.NOTIFICATIONS);
  console.log(alertPermission)
  if (alertPermission !== 'granted') {
    alert("Please enable notification permissions in settings.");
    return;
  }

  //Prints notification token (device specific) or unknown
  const token = await Expo.Notifications.getExpoPushTokenAsync();
  console.log(alertPermission, token);

}

//Create app root navigation stack
const RootStack = createStackNavigator(
  {
    Home: HomeScreen,
    Settings: SettingsScreen,
    Calibrate: CalibrateScreen,
    Averages: AveragesScreen,
    SignIn: SignIn,
    Pair: PairDevice,
  },
  {
    initialRouteName: 'Home',
    navigationOptions: {
      headerStyle: {
        backgroundColor: colors.medB,
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerBackTitle: null,
    },
  },
);

//Set up App, including notification listener
export default class App extends React.Component {
  componentWillMount() {
    register();
    this.listener = Expo.Notifications.addListener(this.listen)
  }
  componentWillUnmount(){
    this.listener && Expo.Notifications.removeListener(this.listen)
  }
  listen = ({origin, data}) => {
    console.log("Some notification", origin, data);
  }
  render() {
    return <RootStack />;
  }
}
