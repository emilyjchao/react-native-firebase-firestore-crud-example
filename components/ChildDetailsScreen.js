import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import firebase from '../Firebase';


class ChildDetailsScreen extends Component {
  static navigationOptions = {
    title: 'Child Profile',
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
    // let childName = [];
    // let childAge = [];
    // let childWeight = [];
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

  //Updates text boxes as user types
  updateTextInput = (text, field) => {
    const state = this.state
    state[field] = text;
    this.setState(state);
  }

  //Should write data to Firebase, but no connection right now
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
    //Check if state is loading
    if(this.state.isLoading){
      return(
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff"/>
        </View>
      )
    }
    return (
      //Display current name, age, weight
      <ScrollView style={styles.container}>
        <View style={styles.subContainer}>
          <TextInput
              placeholder={"Name: Tommy"}
              value={this.state.name}
              onChangeText={(text) => this.updateTextInput(text, 'name')}
          />
        </View>
        <View style={styles.subContainer}>
          <TextInput
              multiline={true}
              numberOfLines={4}
              placeholder={"Age: 4"}
              value={this.state.age}
              onChangeText={(text) => this.updateTextInput(text, 'age')}
          />
        </View>
        <View style={styles.subContainer}>
          <TextInput
              placeholder={"Weight: 40 lbs"}
              value={this.state.weight}
              onChangeText={(text) => this.updateTextInput(text, 'weight')}
          />
        </View>
        //Update button to save new info
        <View style={styles.button}>
          <Button
            large
            leftIcon={{name: 'update'}}
            title='Update'
            //When button pressed, nothing currently happens in updateBoard()
            onPress={() => this.updateBoard()} />
        </View>
      </ScrollView>
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
  }
})

export default ChildDetailsScreen;
