import React from 'react';
import { StyleSheet, Text, TouchableOpacity, KeyboardAvoidingView, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import HomeScreen from './components/HomeScreen';
import AllScreen from './components/AllScreen'
import SettingsScreen from './components/SettingsScreen';
import CalibrateScreen from './components/CalibrateScreen';
import TutorialScreen from './components/TutorialScreen';
import AveragesScreen from './components/AveragesScreen';
import DayScreen from './components/DayScreen';
import MonthScreen from './components/MonthScreen';
import SummaryScreen from './components/SummaryScreen';
import SignIn from './components/signIn';
import {Constants, Permissions, Notifications} from 'expo';
//import {styles} from './componenents/style';
import colors from './components/colors';

async function register(){
  const {status: alertPermission} = await Expo.Permissions.askAsync(Expo.Permissions.NOTIFICATIONS);
  console.log(alertPermission)
  if (alertPermission !== 'granted') {
    alert("Please enable notification permissions in settings.");
    return;
  }

  const token = await Expo.Notifications.getExpoPushTokenAsync();
  console.log(alertPermission, token);

}
const RootStack = createStackNavigator(
  {
    Home: HomeScreen,
    Settings: SettingsScreen,
    Calibrate: CalibrateScreen,
    Tutorial: TutorialScreen,
    Averages: AveragesScreen,
    SignIn: SignIn,
  },
  {
    initialRouteName: 'Home',
    navigationOptions: {
      headerStyle: {
        //backgroundColor: '#777777',
        //backgroundColor: '#4C8C7B',
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkB,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
