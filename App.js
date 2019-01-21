import React from 'react';
import { StyleSheet, Text, TouchableOpacity, KeyboardAvoidingView, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import HomeScreen from './components/HomeScreen';
import DayDetailScreen from './components/DayDetailScreen';
import AddChildScreen from './components/AddChildScreen';
import EditBoardScreen from './components/EditBoardScreen';
import SettingsScreen from './components/SettingsScreen'
import {Constants, Permissions, Notifications} from 'expo'

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
    //DayDetails: DayDetailScreen,
    AddChild: AddChildScreen,
    //EditBoard: EditBoardScreen,
    Settings: SettingsScreen,
  },
  {
    initialRouteName: 'Home',
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#777777',
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
