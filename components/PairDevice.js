import React, {Component} from 'react';
import { Alert, StyleSheet, ScrollView, ActivityIndicator, Image, View, TouchableOpacity, Text, TextInput } from 'react-native';
import { List, ListItem, Button } from 'react-native-elements';
import firebase from '../Firebase';
import styles from './style';
import colors from './colors';

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
    }
    this.sendDUID = this.sendDUID.bind(this);
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
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
        firebase.database().ref('userData/' + this.state.user.uid + '/Profile/hasD').on('value', (snapshot) => {
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

  updateTextInput = (text, field) => {
    const state = this.state;
    state[field] = text;
    this.setState(state);
  }

  // from : https://stackoverflow.com/questions/43676695/email-validation-react-native-returning-the-result-as-invalid-for-all-the-e
  emailValidate = (text) => {
    // console.log(text);
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
    if (reg.test(text) === false) {
      // console.log("Email is Not Correct");
      return false;
    }
    else {
      // console.log("Email is Correct");
      return true;
    }
  }


  sendDUID() {
    //console.log('user: ' + this.state.user.uid);
    if (this.state.deviceUID && this.state.user.uid){
      firebase.database().ref('Pairing/' + this.state.deviceUID).update(
        {'UID': this.state.user.uid}
      ).catch(error => {
        console.log('Failed to add user: ' + error.code + error.message);
      });
      //console.log("Sent to server." + this.state.deviceUID);
    }
  }

  logOut() {
    firebase.auth().signOut().then(()=>{console.log("Signed Out");},
      (error) => { console.log("Sign Out error : " + error.code + error.message);});
  }


// Messing with user protected data and writing to the database
  // moveToUser() {
  //   // if no user return nothing and do nothing
  //   if( !this.state.user ) {
  //     return();
  //   }
  //   // move first night of data to a key under uid
  //   // firebase.database().ref('userData/' + this.state.user.uid + '/' + this.state.boards[0].).set
  //
  // }




  render() {
    //this.props.navigation.push('Home');
    const {navigate} = this.props.navigation;
    let page;
    if (this.state.added){
      page = (
        <View>
        <Text style={styles.title}>Congrats! Your device is now connected.</Text>
        <Text style={styles.smallText}>You will receive data in the morning. Go to:</Text>
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
    else {
      page = (  <View style={styles.form}>
          <Text style={styles.smallText}>Welcome to your new device!</Text>
          <Text style={styles.smallText}>
            Please first complete the instructions to connect your device to your
            network. Power on device, it will create a wifi network. Join the wifi
            network and you will be redirected to enter the name and password for
            your wifi. This will ensure the device is connected to the internet.
            </Text>
            <Text style={styles.smallText}>
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
          <TouchableOpacity style={styles.buttonNoFlexMarg} onPress={()=>this.sendDUID()}>
            <Text style={styles.buttonNoFlexText}>Submit</Text>
          </TouchableOpacity>
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
