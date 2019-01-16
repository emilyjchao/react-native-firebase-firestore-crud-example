import React from 'react';
import { StyleSheet, Text, TouchableOpacity, KeyboardAvoidingView, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import BoardScreen from './components/BoardScreen';
import BoardDetailScreen from './components/BoardDetailScreen';
import AddBoardScreen from './components/AddBoardScreen';
import EditBoardScreen from './components/EditBoardScreen';
import SettingsScreen from './components/SettingsScreen'
import {Permissions, Notifications} from 'expo'
//import registerForPushNotificationsAsync from './registerForPushNotificationsAsync';

const RootStack = createStackNavigator(
  {
    Board: BoardScreen,
    BoardDetails: BoardDetailScreen,
    AddBoard: AddBoardScreen,
    EditBoard: EditBoardScreen,
    Settings: SettingsScreen,
  },
  {
    initialRouteName: 'Board',
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
  render() {
    //registerForPushNotificationsAsync();
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

// PUSH_ENDPOINT = 'https://exp.host/--/api/v2/push/send';
//
// async function registerForPushNotificationsAsync() {
//   const { status: existingStatus } = await Permissions.getAsync(
//     Permissions.NOTIFICATIONS
//   );
//   let finalStatus = existingStatus;
//
//   // only ask if permissions have not already been determined, because
//   // iOS won't necessarily prompt the user a second time.
//   if (existingStatus !== 'granted') {
//     // Android remote notification permissions are granted during the app
//     // install, so this will only ask on iOS
//     const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
//     finalStatus = status;
//   }
//
//   // Stop here if the user did not grant permissions
//   if (finalStatus !== 'granted') {
//     return;
//   }
//
//   // Get the token that uniquely identifies this device
//   let token = await Notifications.getExpoPushTokenAsync();
//   console.log(token)
//
//   // POST the token to your backend server from where you can retrieve it to send push notifications.
//   return fetch(PUSH_ENDPOINT, {
//     method: 'POST',
//     headers: {
//       Accept: 'application/json',
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       token: {
//         value: token,
//       },
//       user: {
//         username: 'User1',
//       },
//     }),
//   });
// }
