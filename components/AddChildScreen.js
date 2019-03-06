import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import firebase from '../Firebase';

// This screen doesn't actually do anything right now
// but has been left in case this functionality is added
class AddChildScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Add Child',
    }
  }

  constructor() {
    super();
    //Set up Firestore connection and state variables
    this.ref = firebase.firestore().collection('boards');
    this.state = {
      name: '',
      age: '',
      weight: '',
      isLoading: false,
    };
  }

  //Update text box inputs as user types
  updateTextInput = (text, field) => {
    const state = this.state
    state[field] = text;
    this.setState(state);
  }

  saveBoard() {
    //Save inputted text info to Firestore if document can be found
    this.setState({
      isLoading: true,
    });
    this.ref.add({
      name: this.state.name,
      age: this.state.age,
      weight: this.state.weight,
    }).then((docRef) => {
      this.setState({
        name: '',
        age: '',
        weight: '',
        isLoading: false,
      });
      this.props.navigation.goBack();
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
      this.setState({
        isLoading: false,
      });
    });
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
      //Text input boxes for name, age, and weight
      <ScrollView style={styles.container}>
        <View style={styles.subContainer}>
          <TextInput
              placeholder={'Name'}
              value={this.state.name}
              onChangeText={(text) => this.updateTextInput(text, 'name')}
          />
        </View>
        <View style={styles.subContainer}>
          <TextInput
              multiline={true}
              numberOfLines={4}
              placeholder={'Age'}
              value={this.state.age}
              onChangeText={(text) => this.updateTextInput(text, 'age')}
          />
        </View>
        <View style={styles.subContainer}>
          <TextInput
              placeholder={'Weight'}
              value={this.state.weight}
              onChangeText={(text) => this.updateTextInput(text, 'weight')}
          />
        </View>
        //Save button (saves to Firestore)
        <View style={styles.button}>
          <Button
            large
            leftIcon={{name: 'save'}}
            title='Save'
            onPress={() => this.saveBoard()} />
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

export default AddChildScreen;
