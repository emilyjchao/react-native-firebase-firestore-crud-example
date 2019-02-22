import React from 'react'
import { Text, ScrollView, StyleSheet, Switch,
  View, AppRegistry, Component, Image, Alert } from 'react-native'
import Colors from '../constants/Colors';
import { Button } from 'react-native-elements';
import SettingsList from 'react-native-settings-list';
import firebase from '../Firebase';
import colors from './colors';
import styles from './style';


// Create and export Settings screen component
export default class SettingsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Settings',
      titleStyle: {
        fontFamily: 'Futura'
      },
    }
  }
  constructor(props) {
    super(props);
    this.ref = firebase.firestore().collection('settings').doc('userSettings');
    this.state = {
      //These booleans all say whether their respective notification is toggled on or off
      pooling: false,
      notification: true,
      bedwetting: false,
      restless: false,
      outofbed: false,
      asleep: false,
      user: null,
    };

    //These help change the toggles from on to off and vice versa
    this.onPoolingChange = this.onPoolingChange.bind(this);
    this.onNotificationChange = this.onNotificationChange.bind(this);
    this.onBedwettingChange = this.onBedwettingChange.bind(this);
    this.onRestlessChange = this.onRestlessChange.bind(this);
    this.onOutOfBedChange = this.onOutOfBedChange.bind(this);
    this.onAsleepChange = this.onAsleepChange.bind(this);

    //This pulls the toggle settings from the Firestore database
    this.ref.get().then((doc) => {
      if (doc.exists) {
        //console.log(doc.data())
        this.setState({
          pooling: doc.data().pooling,
          notification: doc.data().notification,
          bedwetting: doc.data().bedwetting,
          restless: doc.data().restless,
          outofbed: doc.data().outofbed,
          asleep: doc.data().asleep,
        });
        //console.log(this.state)

      //If can't access Firestore, we write the default toggles
      } else {
        // doc.data() will be undefined in this case
        this.setState({
          pooling: false,
          notification: true,
          bedwetting: false,
          restless: false,
          outofbed: false,
          asleep: false,
        });
        console.log("No such document!");
      }
      }).catch(function (error) {
        this.setState({
          pooling: false,
          notification: true,
          bedwetting: false,
          restless: false,
          outofbed: false,
          asleep: false,
        });
        console.log("Error getting document:", error);
      });
   }

  // Handle change of switch state
  handleSwitch = (option) => {
    this.setState({
      [option]: !this.state[option]
    })
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        // console.log("Auth state is logged in Now!");
        this.setState({user: user});
      } else {
        // User is signed out --> reroute to sign in
        // console.log("Auth state is logged out now!");
        this.setState({user: null});
        this.props.navigation.push('SignIn');
      }
    });
  }

  //This saves the current settings to Firestore
  saveSettings() {
    this.ref.update({
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

  logOut() {
    firebase.auth().signOut().then(()=>{console.log("Signed Out");},
      (error) => { console.log("Sign Out error : " + error.code + error.message);});
  }

  render() {
    //Needed to naviaget to other pages from Settings Screen
    const {navigate} = this.props.navigation;

    return (
      //Display the settings item list
      <ScrollView style={styles.container}>
      <View style={{backgroundColor:colors.background,flex:1}}>
        <View style={{flex:1, marginTop:50}}>
          <SettingsList>
          <SettingsList.Header headerText='Profile' headerStyle={{color:colors.highlight, fontFamily: "Futura"}}/>
            <SettingsList.Item
              icon={
                <View style={{height:30,marginLeft:10,alignSelf:'center'}}>
                  <Image style={{alignSelf:'center',height:30, width:30}} source={require('./images/user.png')}/>
                </View>
              }
              itemWidth={50}
              title={this.state.user ? this.state.user.email : 'Parent 1'}
              titleStyle={{color: colors.descriptions, fontFamily: "Futura"}}
              backgroundColor={colors.background}
              onPress={() => Alert.alert('Will Show Account Information')}
            />
            <SettingsList.Item
              hasNavArrow={false}
              switchState={this.state.pooling}
              switchOnValueChange={this.onPoolingChange}
              hasSwitch={true}
              titleStyle={{color: colors.descriptions, fontFamily: "Futura"}}
              backgroundColor={colors.background}
              title='National Data Pooling'/>
            <SettingsList.Item
              title='Privacy Agreement'
              titleStyle={{color: colors.descriptions, fontFamily: "Futura"}}
              backgroundColor={colors.background}
              onPress={() => Alert.alert('Will Show Terms and Conditions of Use')}/>
            <SettingsList.Header headerText='Notifications and Alerts' headerStyle={{color:colors.highlight, marginTop:50, fontFamily: "Futura"}}/>
            <SettingsList.Item
              titleInfo='Details'
              hasNavArrow={false}
              titleStyle={{color: colors.descriptions, fontFamily: "Futura"}}
              title='Child 1'
              backgroundColor={colors.background}
              onPress={() => Alert.alert('Will Show Child Profile Information')}/>
            <SettingsList.Item
              title="Add Child"
              hasNavArrow={true}
              titleStyle={{color: colors.descriptions, fontFamily: "Futura"}}
              backgroundColor={colors.background}
              onPress={() => Alert.alert('Will Allow User to Add Child to Account')}
              />
            <SettingsList.Item
              title='Calibrate Tracker'
              backgroundColor={colors.background}
              titleStyle={{color: colors.descriptions, fontFamily: "Futura"}}
              onPress={() => navigate('Calibrate')}/>
            <SettingsList.Item
              hasNavArrow={false}
              titleStyle={{color: colors.descriptions, fontFamily: "Futura"}}
              switchState={this.state.notification}
              switchOnValueChange={this.onNotificationChange}
              hasSwitch={true}
              backgroundColor={colors.background}
              title='Enable Push Notifications'/>
              <SettingsList.Item
                hasNavArrow={false}
                titleStyle={{color: colors.descriptions, fontFamily: "Futura"}}
                switchState={this.state.bedwetting}
                switchOnValueChange={this.onBedwettingChange}
                hasSwitch={true}
                backgroundColor={colors.background}
                title='Bedwetting Alarm'/>
              <SettingsList.Item
                hasNavArrow={false}
                switchState={this.state.restless}
                titleStyle={{color: colors.descriptions, fontFamily: "Futura"}}
                switchOnValueChange={this.onRestlessChange}
                hasSwitch={true}
                backgroundColor={colors.background}
                title='Restlessness Alarm'/>
              <SettingsList.Item
                hasNavArrow={false}
                switchState={this.state.outofbed}
                switchOnValueChange={this.onOutOfBedChange}
                hasSwitch={true}
                titleStyle={{color: colors.descriptions, fontFamily: "Futura"}}
                backgroundColor={colors.background}
                title='Out of Bed Alarm'/>
              <SettingsList.Item
                hasNavArrow={false}
                backgroundColor={colors.background}
                switchState={this.state.asleep}
                titleStyle={{color: colors.descriptions, fontFamily: "Futura"}}
                switchOnValueChange={this.onAsleepChange}
                hasSwitch={true}
                title='Fell Asleep Alert'/>
          </SettingsList>
        </View>
      </View>
      //Save button (must be pressed to update settings in Firebase)
      <View style={styles.savebutton}>
        <Button
          small
          backgroundColor={colors.background}
          leftIcon={{name: 'save'}}
          onPress={() => this.saveSettings()}
          title='Save Settings'
        />
        {this.state.user ? <Button
          small
          leftIcon={{name: 'power'}}
          backgroundColor={'transparent'}
          onPress={() => this.logOut()}
          title="Log Out"
        /> : ''}
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
