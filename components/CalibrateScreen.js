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
      isLoading: true,
      calibrated: null,
      sent: false,
      user: null,
    };
  }

  componentDidMount() {
    const {navigate} = this.props.navigation;
    this.unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        console.log("Auth state is logged in Now! Add Tracker");
        this.setState({ user: user });
        //this.props.navigation.navigate('Home');
        // Change this to be the hasD
        // firebase.database().ref('userData/' + this.state.user.uid + '/Profile/asleep').once('value').then((snapshot) => {
        //  console.log(snapshot.val());
        //  this.setState({added: snapshot.val()})
        // });
        firebase.database().ref('userData/' + this.state.user.uid + '/Profile/calibrate').on('value', (snapshot) => {
          console.log('snapshot' + snapshot);
          //console.log(snapshot.val());
          if (snapshot != undefined) {
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


  componentWillUnmount(){
    //firebase.auth().off();
    if (this.unsubscribe){
      this.unsubscribe();
    }
  }
  // componentWillUnmount(){
  //   //firebase.auth().off();
  //   if (this.state.user){
  //     firebase.database().ref('userData/' + this.state.user.uid + '/Profile/calibrate').off();
  //   }
  //
  // }

  //Check if component mounted
  // componentDidMount() {
  //   const { navigation } = this.props;
  //   var database = firebase.database();
  //   this.setState({
  //     isLoading: false,
  //   });
  // }

  //Write calibrate variable to Firebase
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
