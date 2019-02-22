import React, {Component} from 'react';
import { Alert, StyleSheet, ScrollView, ActivityIndicator, Image, View, TouchableOpacity, Text, TextInput } from 'react-native';
import { List, ListItem, Button } from 'react-native-elements';
import firebase from '../Firebase';
import styles from './style';
import colors from './colors';

class SignIn extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Sign In/Up',
    }
  }

  constructor() {
    super();
    this.state = {
      email: null,
      password: null,
      password2: null,
      signIn: true, // state for sign in v. logon
      login: false, // state for logged in user
    }
    this.signIn = this.signIn.bind(this);
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        console.log("Auth state is logged in Now!");
        this.setState({login: true, email: user.email});
        //this.props.navigation.navigate('Home');
      } else {
        // User is signed out.
        console.log("Auth state is logged out now!");
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


  signUp() {

    if (this.state.password == this.state.password2 && this.emailValidate(this.state.email)){
      console.log("passwords matched and email is valid.");
      // call the firebase sign in action
      firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("ERROR adding user:" + error.code);
        console.log(error.message);
      });
    }
    else {
      console.log("Passwords do not match or email is invalid.");
    }
  }

  signIn() {
    if(this.emailValidate(this.state.email) && (this.state.password != null)) {
      firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("ERROR adding user:" + error.code);
        console.log(error.message);
      });
      console.log("Sign in successful!");
    }
    //this.props.navigation.push('Home');
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
    let inUpOut; // buttons for sign in and up or for logout and back
    let form; // input for signing in or up
    if (this.state.login) {
       inUpOut = (
        <View>
          <TouchableOpacity style={styles.buttonNoFlex} onPress={()=>this.logOut()}>
            <Text style={styles.buttonNoFlexText}>Log Out</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonNoFlex} onPress={()=>this.props.navigation.navigate('Home')}>
            <Text style={styles.buttonNoFlexText}>Home Screen</Text>
          </TouchableOpacity>
        </View>);
    }
    else {
      inUpOut = (
        <View style={styles.tripleToggle}>
          <TouchableOpacity
            onPress = {()=> this.setState({signIn: true})}
            style={(this.state.signIn ? styles.buttonSelected : styles.button)}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress = {()=> this.setState({signIn: false})}
            style={(this.state.signIn ? styles.button : styles.buttonSelected)}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>);

      form = (this.state.signIn ? (
        <View>
          <TextInput
            placeholder={'Email'}
            value={this.state.email}
            onChangeText={(text) => this.updateTextInput(text, 'email')}
          />
          <TextInput
            placeholder={'Password'}
            secureTextEntry={true}
            value={this.state.password}
            onChangeText={(text) => this.updateTextInput(text, 'password')}
          />
          <TouchableOpacity style={styles.buttonNoFlex} onPress={()=>this.signIn()}>
            <Text style={styles.buttonNoFlexText}>Sign In</Text>
          </TouchableOpacity>
        </View>)
        :
        (
          <View>
            <TextInput
              placeholder={'Email'}
              value={this.state.email}
              onChangeText={(text) => this.updateTextInput(text, 'email')}
            />
            <TextInput
              placeholder={'Password'}
              secureTextEntry={true}
              value={this.state.password}
              onChangeText={(text) => this.updateTextInput(text, 'password')}
            />
            <Text>Please re-enter your password:</Text>
            <TextInput
              placeholder={'Password'}
              secureTextEntry={true}
              value={this.state.password2}
              onChangeText={(text) => this.updateTextInput(text, 'password2')}
            />
            <TouchableOpacity style={styles.buttonNoFlex} onPress={()=>this.signUp()}>
              <Text style={styles.buttonNoFlexText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
      ));
    }

    return (
      <View style={styles.appContainer}>
        <Text>Hello!</Text>
        <Text>Welcome to the Serta Simmons children's smart mattress testing app.
          Please sign in if you have an account or sign up if you are joining.
        </Text>
        {inUpOut}
        {form}
      </View>
    )
  }

}

export default SignIn;
