import React, { Component } from 'react';
import { Alert, StyleSheet, ScrollView, ActivityIndicator, View, TextInput, Text, Button } from 'react-native';
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
    };
  }

  //Check if component mounted
  componentDidMount() {
    const { navigation } = this.props;
    var database = firebase.database();
    this.setState({
      isLoading: false,
    });
  }

  //Write calibrate variable to Firebase
  updateBoard(calibrateBool) {
    this.setState({
      isLoading: true,
    });
    const { navigation } = this.props;
    firebase.database().ref('Profile/').set({
      calibrate: calibrateBool,
    });

    //Send alert that system has been calibrated
    this.setState({
      isLoading: false,
    });
    Alert.alert('System Calibrated')
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
    return (
      <ScrollView style={{backgroundColor: colors.background}}>
      <View style={{backgroundColor: colors.background, marginHorizontal: 5}}>
        //Display instructions
        <Text style={styles.tripletText}>{"\n"}{"\n"}Instructions{"\n"}</Text>
        <Text
          style={styles.brightText}>  Please calibrate the system.
          Once the child is sitting on the edge of the bed, press 'Calibrate'.
          This will set the default threshhold for identifying if the child is in bed.{"\n"}{"\n"}
        </Text>
        //Set calibrate in firebase
        <Button
          style={styles.button}
          large
          onPress={() => this.updateBoard(1)}
          title="Calibrate"
          buttonStyle={{ padding: 10, backgroundColor: 'transparent'}}
          />
      </View>
      </ScrollView>
    );
  }
}

export default CalibrateScreen;
