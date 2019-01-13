import React from 'react'
import { Text, ScrollView, StyleSheet, Switch,
  View, AppRegistry, Component, Image, Alert } from 'react-native'
import Colors from '../constants/Colors';
import { Button } from 'react-native-elements';
import SettingsList from 'react-native-settings-list';
import firebase from '../Firebase';


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
    this.ref = firebase.firestore().collection('settings');

    this.onPoolingChange = this.onPoolingChange.bind(this);
    this.onNotificationChange = this.onNotificationChange.bind(this);
    this.onBedwettingChange = this.onBedwettingChange.bind(this);
    this.onRestlessChange = this.onRestlessChange.bind(this);
    this.onOutOfBedChange = this.onOutOfBedChange.bind(this);
    this.onAsleepChange = this.onAsleepChange.bind(this);

    this.state = {
      pooling: false,
      notification: true,
      bedwetting: false,
      restless: false,
      outofbed: false,
      asleep: false,
      loggedIn: false
      };
  }

  // Handle change of switch state
  handleSwitch = (option) => {
    this.setState({
      [option]: !this.state[option]
    })
  }


  saveSettings() {
    this.ref.add({
      pooling: this.state.pooling,
      notification: this.state.notification,
      bedwetting: this.state.bedwetting,
      restless: this.state.restless,
      outofbed: this.state.outofbed,
      asleep: this.state.asleep,

    })
    .catch((error) => {
      console.error("Error saving settings: ", error);
    });
  }

  render() {
    if(this.state.isLoading){
      return(
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff"/>
        </View>
      )
    }
    var bgColor = '#DCE3F4';
    return (
      <ScrollView style={styles.container}>
      <View style={{backgroundColor:'#EFEFF4',flex:1}}>
        <View style={{flex:1, marginTop:50}}>
          <SettingsList>
          <SettingsList.Header headerText='Profile' headerStyle={{color:'black'}}/>
            <SettingsList.Item
              icon={
                <View style={{height:30,marginLeft:10,alignSelf:'center'}}>
                  <Image style={{alignSelf:'center',height:30, width:30}} source={require('./images/user.png')}/>
                </View>
              }
              itemWidth={50}
              title='Parent 1'
              onPress={() => Alert.alert('See Account Information')}
            />
            <SettingsList.Item
              hasNavArrow={false}
              switchState={this.state.pooling}
              switchOnValueChange={this.onPoolingChange}
              hasSwitch={true}
              title='Community Data Pooling'/>
            <SettingsList.Item
              title='Privacy Agreement'
              backgroundColor='#D1D1D1'
              onPress={() => Alert.alert('See Terms and Conditions of Use')}/>
            <SettingsList.Header headerText='Notifications and Alerts' headerStyle={{color:'black', marginTop:50}}/>
            <SettingsList.Item titleInfo='Bedroom 1' hasNavArrow={false} title='Child 1'/>
            <SettingsList.Item
              hasNavArrow={false}
              switchState={this.state.notification}
              switchOnValueChange={this.onNotificationChange}
              hasSwitch={true}
              title='Enable Push Notifications'/>
              <SettingsList.Item
                hasNavArrow={false}
                switchState={this.state.bedwetting}
                switchOnValueChange={this.onBedwettingChange}
                hasSwitch={true}
                title='Bedwetting Alarm'/>
              <SettingsList.Item
                hasNavArrow={false}
                switchState={this.state.restless}
                switchOnValueChange={this.onRestlessChange}
                hasSwitch={true}
                title='Restlessness Alarm'/>
              <SettingsList.Item
                hasNavArrow={false}
                switchState={this.state.outofbed}
                switchOnValueChange={this.onOutOfBedChange}
                hasSwitch={true}
                title='Out of Bed Alarm'/>
              <SettingsList.Item
                hasNavArrow={false}
                switchState={this.state.asleep}
                switchOnValueChange={this.onAsleepChange}
                hasSwitch={true}
                title='Fell Asleep Alert'/>
          </SettingsList>
        </View>
      </View>
      <View style={styles.button}>
        <Button
          small
          leftIcon={{name: 'save'}}
          title='Save Settings'
          onPress={() => this.saveSettings()} />
      </View>
      </ScrollView>
    )
  }
  toggleAuthView() {
    this.setState({toggleAuthView: !this.state.toggleAuthView});
  }
  onPoolingChange(value){
    this.setState({pooling: value});
  }
  onNotificationChange(value){
    this.setState({notification: value});
  }
  onBedwettingChange(value){
    this.setState({bedwetting: value});
  }
  onRestlessChange(value){
    this.setState({restless: value});
  }
  onOutOfBedChange(value){
    this.setState({outofbed: value});
  }
  onAsleepChange(value){
    this.setState({asleep: value});
  }
}
