import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import colors from './colors';


const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  btnContainer: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'transparent',
    marginHorizontal: 0,
  },
  chart: {
    marginBottom: 35,
  },
  container: {
    flex: 1,
    paddingBottom: 22,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.header,
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
    borderColor: colors.tabs,
    borderWidth: 1,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
  },
  buttonSelected: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 3,
    borderColor: colors.tabSel,
    borderWidth: 1,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    //backgroundColor: '#F4E8C1',
    backgroundColor: colors.tabSel,
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
    //color: '#393E41',
    color: colors.tabText,
  },
  brightText: {
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 0,
    //color: '#44D197',
    color: colors.descriptions,
  },
  brightTextLeft: {
    textAlign: 'left',
    fontSize: 18,
    alignSelf: 'stretch',
    color: colors.data,
  },
  blackText: {
    textAlign: 'center',
    fontSize: 24,
    color: colors.descriptions,
    paddingTop: 0,
    marginTop: 0,
  },
  blackTextPadding: {
    textAlign: 'center',
    fontSize: 24,
    color: colors.highlight,
    paddingTop: 13,
    paddingBottom: 13,
    marginTop: 0,
  },
  blueTextSmall: {
    textAlign: 'center',
    fontSize: 22,
    color: colors.descriptions,
  },
  // chartData: {
  //   fill: '#39BAB1',
  // },
  // chartLabels: {
  //   labels: { fill: "white" }
  // },
  smallText: {
    textAlign: 'center',
  },
  textInput: {
    fontSize: 24,
  },
  title: {
    textAlign: 'center',
    fontSize: 30,
    color: colors.data,
    marginTop: 5,
  },
  triplet: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tripletText: {
    textAlign: 'center',
    fontSize: 24,
    color: colors.triplet,
    paddingTop: 0,
    marginTop: 0,
  },
  tripleToggle: {
    flexDirection: 'row'
  },
  twoColumnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  twoColumnColumn: {
    flexDirection: 'column',
    justifyContent: 'center'
  },
  icon: {
    width: 10,
    height: 10,
    tintColor: 'white',
    position: 'relative',
    right: -2, // Keep some space between your left border and Image
  },
  headerWrapper: {
    marginBottom: 50,
  },
})

export default styles;
