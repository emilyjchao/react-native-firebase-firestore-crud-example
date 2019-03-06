import React, {Component} from 'react';
import { Alert, StyleSheet, ScrollView, ActivityIndicator, Image, View, TouchableOpacity, Text, TextInput } from 'react-native';
import { List, ListItem, Button } from 'react-native-elements';
import firebase from '../Firebase';
import styles from './style';
import colors from './colors';


//This file collects the unique device id (DUID) and adds the signed in user’s
// UID to the database under ./Pairing/[DUID]/UID: [UID]. The file confirms
// this pairing when ./userData/[UID]/Profile/hasD is set to true. The page
// displays a confirmation screen with multiple options, but the alert from
// homescreen regarding calibration will trigger on top of this page. This
// is a bug that should be worked out to allow the user to proceed to
// calibration if they choose.
class PairDevice extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Sign In/Up',
    }
  }

  constructor() {
    super();
    this.state = {
      added: null,
      email: null,
      password: null,
      password2: null,
      signIn: true, // state for sign in v. logon
      login: false, // state for logged in user
      deviceUID: null, // unique device id
      sent: false,
    }
    this.sendDUID = this.sendDUID.bind(this);
  }

  componentDidMount() {
    this.unsubAuth = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        console.log("Auth state is logged in Now! Add Tracker");
        this.setState({login: true, email: user.email,  user: user});
        //this.props.navigation.navigate('Home');
        // Change this to be the hasD
        // firebase.database().ref('userData/' + this.state.user.uid + '/Profile/asleep').once('value').then((snapshot) => {
        //  console.log(snapshot.val());
        //  this.setState({added: snapshot.val()})
        // });
        this.unsubHasD = firebase.database().ref('userData/' + this.state.user.uid + '/Profile/hasD').on('value', (snapshot) => {
         console.log(snapshot.val());
         this.setState({added: snapshot.val()})
        });

      } else {
        // User is signed out.
        console.log("Auth state is logged out now! Add tracker");
        this.setState({login: false});
        // ...
      }
    });

  }

  componentWillUnmount() {
    if (this.unsubAuth){
      this.unsubAuth();
    }
    if (this.unsubHasD){
      this.unsubHasD();
    }
  }
  updateTextInput = (text, field) => {
    const state = this.state;
    state[field] = text;
    this.setState(state);
  }

  // send the unique device id to the database under the pairing tab
  sendDUID() {
    //console.log('user: ' + this.state.user.uid);
    if (this.state.deviceUID && this.state.user.uid){
      firebase.database().ref('Pairing/' + this.state.deviceUID).update(
        {'UID': this.state.user.uid}
      ).catch(error => {
        console.log('Failed to add user: ' + error.code + error.message);
      });
      this.setState({sent: true});
      //console.log("Sent to server." + this.state.deviceUID);
    }
  }

  logOut() {
    firebase.auth().signOut().then(()=>{console.log("Signed Out");},
      (error) => { console.log("Sign Out error : " + error.code + error.message);});
  }


  render() {
    //this.props.navigation.push('Home');
    const {navigate} = this.props.navigation;
    let page;

    // show loading after DUID is sent, but confirmation is not received
    let button;
    if (this.state.sent){
      button = (<ActivityIndicator size="large" color={colors.highlight}/> )
    }
    else {
      button = (
        <TouchableOpacity style={styles.buttonNoFlexMarg} onPress={()=>this.sendDUID()}>
          <Text style={styles.buttonNoFlexText}>Submit</Text>
        </TouchableOpacity>
        )
    }

    // after pairing show instructions
    // this is currently overwritten by the alert that pops up from the homescreen (we believe)
    // but homescreen also shows instructions so its not terrible
    if (this.state.added){
      page = (
        <View>
        <Text style={styles.title}>Congrats! Your device is now connected.</Text>
        <Text style={styles.smallTextMarg}>You will receive data in the morning. Please
          calibrate your device with your child now.
        </Text>
        <TouchableOpacity style={styles.buttonNoFlexMarg} onPress={()=> navigate('Calibrate')}>
          <Text style={styles.buttonNoFlexText}>Calibrate</Text>
        </TouchableOpacity>
        <Text style={styles.smallTextMarg}>If your child is not available to sit on the edge of
          the bed for calibrating at this time, return to:
        </Text>
        <TouchableOpacity style={styles.buttonNoFlexMarg} onPress={()=> navigate('Settings')}>
          <Text style={styles.buttonNoFlexText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonNoFlexMarg} onPress={()=> navigate('Home')}>
          <Text style={styles.buttonNoFlexText}>Home Screen</Text>
        </TouchableOpacity>
        <View style={styles.form}>
          <Text style={styles.smallText}>If you would like to add new device instead of your
            already connected one, please click 'continue' below.
          </Text>
          <TouchableOpacity style={styles.buttonNoFlexMarg} onPress={()=>this.setState({added: false})}>
            <Text style={styles.buttonNoFlexText}>Continue</Text>
          </TouchableOpacity>
        </View>
        </View>
      );
    }
    // input area for the unique device id
    else {
      page = (  <View style={styles.form}>
          <Text style={styles.smallText}>Welcome to your new device!</Text>
          <Text style={styles.smallTextMarg}>
            Please first complete the instructions to connect your device to your
            network.
            </Text>
            <Text style={styles.smallTextMarg}>
            Please enter the device unique identification (DUID) string shown on
            packaging and mattress. Then press "Submit". This will set up our server
             to pair your account with your device. There will be no confirmation here.
             Your data should arrive tomorrow morning!
          </Text>
          <TextInput
            placeholder={'DUID'}
            placeholderTextColor={colors.tabText}
            value={this.state.deviceUID}
            onChangeText={(text) => this.updateTextInput(text, 'deviceUID')}
            style={styles.textInput}
          />
          {button}
        </View>);
    }

    return (
      <View style={styles.container}>
        <View style={styles.centerContainer}>
        {page}
        </View>
      </View>
    )
  }

}

export default PairDevice;
