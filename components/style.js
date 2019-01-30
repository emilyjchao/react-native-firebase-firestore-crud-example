import React, { Component } from 'react';
import { StyleSheet } from 'react-native';


const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnContainer: {
    paddingHorizontal: 30,
    paddingVertical: 0,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'transparent',
  },
  container: {
   flex: 1,
   paddingBottom: 22
 },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
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
  button: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 3,
    borderColor: 'black',
    borderWidth: 1,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
  },
  button1: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 3,
    borderColor: 'transparent',
    borderWidth: 1,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 0,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 24,
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 5,
    marginBottom: 0,
    color: 'teal',
  },
  brightText: {
    textAlign: 'center',
    fontSize: 24,
    color: 'steelblue',
    marginTop: 5,
  },
  brightTextLeft: {
    textAlign: 'left',
    fontSize: 24,
    color: 'steelblue',
    alignSelf: 'stretch',
  },
  blackText: {
    textAlign: 'center',
    fontSize: 24,
    color: 'black',
    paddingTop: 0,
    marginTop: 0,
  },
  blueTextSmall: {
    textAlign: 'center',
    fontSize: 22,
    color: 'teal',
  },
  smallText: {
    textAlign: 'center',
  },
  textInput: {
    fontSize: 24,
  },
  triplet: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  icon: {
    width: 10,
    height: 10,
    position: 'absolute',
    right: 15, // Keep some space between your left border and Image
  }
})

export default styles;
