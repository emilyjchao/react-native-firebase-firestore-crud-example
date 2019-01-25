import React, { Component } from 'react';
import { Alert, StyleSheet, ScrollView, ActivityIndicator, View, TextInput, Text, Button } from 'react-native';
import firebase from '../Firebase';


class CalibrateScreen extends Component {
  static navigationOptions = {
    title: 'Calibrate System',
  };
  constructor() {
    super();
    this.state = {
      key: '',
      isLoading: true,
    };
  }
  componentDidMount() {
    const { navigation } = this.props;
    var database = firebase.database();
    this.setState({
      isLoading: false,
    });
  }

  updateBoard(calibrateBool) {
    this.setState({
      isLoading: true,
    });
    const { navigation } = this.props;
    firebase.database().ref('Profile/').set({
      calibrate: calibrateBool,
    });

    //Write to Firebase here

    this.setState({
      isLoading: false,
    });
    Alert.alert('System Calibrated')
  }

  render() {
    if(this.state.isLoading){
      return(
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff"/>
        </View>
      )
    }
    return (
      <View>
        <Text style={styles.blackText}>{"\n"}Instructions{"\n"}</Text>
        <Text style={styles.smallText}>Please calibrate the system.
        Once your child is lying on the bed in a sleep position, press 'Calibrate'.
        This will set the default night-time bed weight.{"\n"}{"\n"}</Text>
        //Set calibrate in firebase
        <Button
          style={styles.button}
          large
          onPress={() => this.updateBoard(1)}
          title="Calibrate"
          buttonStyle={{ padding: 10, backgroundColor: 'transparent'}}
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  subContainer: {
    flex: 1,
    marginBottom: 20,
    padding: 5,
    borderBottomWidth: 2,
    borderBottomColor: '#CCCCCC',
  },
  activity: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    marginTop: 15,
    color: 'indigo',
  },
  brightText: {
    textAlign: 'center',
    fontSize: 24,
    color: 'firebrick',
  },
  blackText: {
    textAlign: 'center',
    fontSize: 24,
    color: 'black',
  },
  smallText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'black',
  },
  button: {
    flex: 1,
    borderRadius: 3,
    borderColor: 'black',
    borderWidth: 1,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 15,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 24,
  }
})

export default CalibrateScreen;
