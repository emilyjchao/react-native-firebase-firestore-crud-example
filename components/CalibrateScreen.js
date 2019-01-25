import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View, TextInput, Text, Button } from 'react-native';
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
      name: [],
      age: [],
      weight: [],
    };
  }
  componentDidMount() {
    //const { navigation } = this.props;
    // Realtime database connection
    this.fetchData();
  }

  //wrapper so that state can be set from onFetchData
  fetchData() {
    firebase.database().ref().on('value', this.onFetchData);
  }

  // process the incoming data
  onFetchData = (snapshot) => {
    // let nights = [];
    // let dates = [];
    // let data = snapshot.val();
    //
    // // get the number of nights
    // nights = Object.keys(data);
    //
    let childName = [];
    let childAge = [];
    let childWeight = [];
    // nights.forEach(function(nightName){
    //
    //   if(nightName == 'Profile') {
    //     //Read in name, age, weight
    //     if (night["name"])  {
    //       childName = Object.keys(night["name"]).map( (key) => { return( night["name"][key])});
    //     }
    //     if (night["age"])  {
    //       childAge  = Object.keys(night["age"]).map( (key) => { return( night["age"][key])});
    //     }
    //     if (night["weight"])  {
    //       childWeight = Object.keys(night["weight"]).map( (key) => { return( night["weight"][key])});
    //     }
    //   }
    // })
    this.setState({
      name: "",
      age: "",
      weight: "",
      isLoading: false, // update so components render
    });
  }

  updateTextInput = (text, field) => {
    const state = this.state
    state[field] = text;
    this.setState(state);
  }

  updateBoard() {
    // this.setState({
    //   isLoading: true,
    // });
    // const { navigation } = this.props;
    // const updateRef = firebase.firestore().collection('boards').doc(this.state.key);
    //
    //
    // updateRef.set({
    //   name: this.state.name,
    //   age: this.state.age,
    //   weight: this.state.weight,
    // }).then((docRef) => {
    //   this.setState({
    //     key: '',
    //     name: '',
    //     age: '',
    //     weight: '',
    //     isLoading: false,
    //   });
    // })
    // .catch((error) => {
    //   console.error("Error adding document: ", error);
    //   this.setState({
    //     isLoading: false,
    //   });
    // });
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
          onPress={() => this.updateBoard()}
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
