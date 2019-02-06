import React, { Component } from 'react';
import Colors from '../constants/Colors';
import { Alert, StyleSheet, ScrollView, ActivityIndicator, View, TextInput, Text, Button } from 'react-native';
import styles from './style';

// Create and export Averages screen component
class AveragesScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Averages',
    }
  }
  constructor(props) {
    super(props);
    //Needed to navigate to other pages from Averages Screen
    const {navigate} = this.props.navigation;
    this.state = {
      isLoading: true,
    };
   }

  render() {
    //Check if loading = true
    if(this.state.isLoading){
      return(
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff"/>
        </View>
      )
    }
    return (
      //Display the averages
      <View>
        //Display instructions
        <Text style={styles.blackText}>{"\n"}{"\n"}Instructions{"\n"}{"\n"}</Text>
        <Text
          style={styles.smallText}>  Please calibrate the system.
          Once your child is lying on the bed in a sleep position, press 'Calibrate'.
          This will set the default night-time bed weight.{"\n"}{"\n"}
        </Text>

      </View>

    )
}

}

export default AveragesScreen;
