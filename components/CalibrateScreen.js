import React, { Component } from 'react';
import { Alert, StyleSheet, ScrollView, ActivityIndicator, View, TextInput, Text, TouchableOpacity, Button } from 'react-native';
import firebase from '../Firebase';
import colors from './colors';
import styles from './style';

class CalibrateScreen extends Component {
  static navigationOptions = {
    title: 'Calibrate System',
    titleStyle: {
      fontFamily: 'Futura'
    },
  };
  constructor() {
    super();
    this.state = {
      key: '',
      isLoading: true, // standard is loading element
      calibrated: null, // is the device calibrated, retrieve from firebase "[UID]/Profile/calibrated"
      sent: false, // sent request to calibrate
      user: null, // store the signed in user (if there is one), used for writes and pulls
    };
  }

  componentDidMount() {
    const {navigate} = this.props.navigation;

    // subscribe to sign in/out changes
    this.unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        console.log("Auth state is logged in Now! Add Tracker");
        this.setState({ user: user });

        // subscribe to changes of the calibrate variable of the user's profile
        // 0 = not calibrated (written by device), 1 = calibrate (sent from app), 2 = calibrated (sent from device)
        firebase.database().ref('userData/' + this.state.user.uid + '/Profile/calibrate').on('value', (snapshot) => {
          console.log('snapshot' + snapshot);
          //console.log(snapshot.val());

          if (snapshot != undefined) {
            // if calibrated
            if (snapshot.val() == 2) {
              this.setState({calibrated: true});
              Alert.alert(
                'Calibrated',
                'System calibrated',
                [{
                  text: 'Return Home', onPress: () => {
                  navigate('Home'); }
                },
                {
                  text: 'Re-Calibrate'
                }
              ]);
            }
            // if you sent the calibrate and it was written
            else if (snapshot.val() == 1) {
              this.setState({sent: true});
            }
            console.log(snapshot.val());
            this.setState({added: snapshot.val()})
          }
        });

      } else {
        // User is signed out.
        // console.log("Auth state is logged out now! Add tracker");
        //this.setState({login: false});
        // ...
      }
    });

    this.setState({
      isLoading: false,
    });

  }

  // unsubscribe from firebase
  componentWillUnmount(){
    //firebase.auth().off();
    if (this.unsubscribe){
      this.unsubscribe();
    }
  }

  //Write calibrate variable to Firebase
  // calibrateBool should always be 1, but function is flexible
  updateBoard(calibrateBool) {
    // this.setState({
    //   isLoading: true,
    // });
    const { navigation } = this.props;
    firebase.database().ref('userData/' + this.state.user.uid + '/Profile/').update({
      calibrate: calibrateBool,
    });

    //Send alert that system has been calibrated
    this.setState({
      sent: true,
    });

  }

  render() {
    //Check if loading = true
    if(this.state.isLoading){
      return(
        <View style={styles.activity}>
          <ActivityIndicator size="large" color={colors.highlight}/>
        </View>
      )
    }

    // if sent but not confirmed show activity ActivityIndicator
    let button;
    if (this.state.sent && !this.state.calibrated){
      button = (<ActivityIndicator size="large" color={colors.highlight}/> )
    }
    // otherwise show calibrate button
    else if (this.state.user) {
      button = (
        <TouchableOpacity style={styles.buttonNoFlexMarg} onPress={() => this.updateBoard(1)}>
          <Text style={styles.buttonNoFlexText}>Calibrate</Text>
        </TouchableOpacity>
        )
    }
    else {
      button = '';
    }

    return (
      <ScrollView style={{backgroundColor: colors.background}}>
        <View style={{backgroundColor: colors.background, marginHorizontal: 5}}>
          //Display instructions
          <Text style={styles.tripletText}>{"\n"}{"\n"}Instructions{"\n"}</Text>
          <Text
            style={styles.smallTextMarg}>  Please calibrate the system.
            Once the child is sitting on the edge of the bed, press 'Calibrate'.
             Wait with your child sitting on the bed for alert that calibration is finished.
            This will set the default threshhold for identifying if the child is in bed.
          </Text>
          //Set calibrate in firebase
          {button}
        </View>
      </ScrollView>
    );
  }
}

export default CalibrateScreen;
