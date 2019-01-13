// ./screens/SettingsScreen.js

// Import React and necessary UI modules
import React from 'react'
import { Text, ScrollView, StyleSheet, Switch, View } from 'react-native'
// Import color constants
import Colors from '../constants/Colors';
import {
  AppRegistry,
  Component,
  Image,
  Alert
} from 'react-native';
import SettingsList from 'react-native-settings-list';

const styles = StyleSheet.create({
  imageStyle:{
    marginLeft:15,
    alignSelf:'center',
    height:30,
    width:30
  },
  titleInfoStyle:{
    fontSize:16,
    color: '#8e8e93'
  }
});

// Create and export Settings screen component
export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings' // Enable app header and use 'Settings' as the label
  }
  constructor() {
    super();
    this.onValueChange = this.onValueChange.bind(this);
    this.state = {switchValue: false, loggedIn: false};
  }

  // Handle change of switch state
  handleSwitch = (option) => {
    this.setState({
      [option]: !this.state[option]
    })
  }

  render() {
    var bgColor = '#DCE3F4';
    return (
      <ScrollView style={styles.container}>
      <View style={{backgroundColor:'#EFEFF4',flex:1}}>
        <View style={{flex:1, marginTop:50}}>
          <SettingsList>
          <SettingsList.Header headerText='First Grouping' headerStyle={{color:'black'}}/>
            <SettingsList.Item
              icon={
                <View style={{height:30,marginLeft:10,alignSelf:'center'}}>
                  <Image style={{alignSelf:'center',height:30, width:30}} source={require('./images/about.png')}/>
                </View>
              }
              itemWidth={50}
              title='Icon Example'
              onPress={() => Alert.alert('Icon Example Pressed')}
            />
            <SettingsList.Item
              hasNavArrow={false}
              switchState={this.state.switchValue}
              switchOnValueChange={this.onValueChange}
              hasSwitch={true}
              title='Switch Example'/>
            <SettingsList.Item
              title='Different Colors Example'
              backgroundColor='#D1D1D1'
              onPress={() => Alert.alert('Different Colors Example Pressed')}/>
            <SettingsList.Header headerText='Different Grouping' headerStyle={{color:'black', marginTop:50}}/>
            <SettingsList.Item titleInfo='Some Information' hasNavArrow={false} title='Information Example'/>
            <SettingsList.Item title='Settings 1'/>
            <SettingsList.Item title='Settings 2'/>
          </SettingsList>
        </View>
      </View>
      </ScrollView>
    )
  }
  toggleAuthView() {
    this.setState({toggleAuthView: !this.state.toggleAuthView});
  }
  onValueChange(value){
    this.setState({switchValue: value});
  }
}
