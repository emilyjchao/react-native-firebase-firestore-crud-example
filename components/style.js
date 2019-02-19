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
  activity: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background
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
  buttonNoFlex: {
    alignItems: 'center',
    borderRadius: 3,
    borderColor: colors.tabs,
    borderWidth: 1,
    marginHorizontal: 10,
  },
  buttonNoFlexText:{
    textAlign: 'center',
    fontSize: 18,
    //color: '#393E41',
    color: colors.highlight,
    fontFamily: 'Futura',
    paddingHorizontal: 5,
  },
  btnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'transparent',
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
    fontFamily: 'Futura',
  },
  brightText: {
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 0,
    color: colors.descriptions,
    fontWeight: '100',
    fontFamily: 'Futura',
    paddingHorizontal: 3,
  },
  brightTextLeft: {
    textAlign: 'left',
    fontSize: 18,
    alignSelf: 'stretch',
    color: colors.data,
    fontFamily: 'Futura'
  },
  blackText: {
    textAlign: 'center',
    fontSize: 24,
    color: colors.descriptions,
    fontWeight: '100',
    paddingTop: 0,
    marginTop: 0,
    fontFamily: 'Futura'
  },
  blackTextPadding: {
    textAlign: 'center',
    fontSize: 24,
    color: colors.highlight,
    paddingTop: 13,
    paddingBottom: 13,
    marginTop: 0,
    fontFamily: 'Futura'
  },
  blueTextSmall: {
    textAlign: 'center',
    fontSize: 22,
    color: colors.descriptions,
    fontFamily: 'Futura'
  },
  chart: {
    marginBottom: 35,
  },
  container: {
    flex: 1,
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
  // chartData: {
  //   fill: '#39BAB1',
  // },
  // chartLabels: {
  //   labels: { fill: "white" }
  // },
  savebutton: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 3,
    borderColor: 'transparent',
    borderWidth: 1,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
  },
  smallText: {
    textAlign: 'center',
    fontFamily: 'Futura',
    color: colors.descriptions,
  },
  textInput: {
    fontSize: 24,
    fontFamily: 'Futura'
  },
  title: {
    textAlign: 'center',
    fontSize: 30,
    color: colors.data,
    fontWeight: '600',
    marginTop: 5,
    fontFamily: 'Futura'
  },
  triplet: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    height: 60,
  },
  tripletText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 24,
    fontWeight: '100',
    color: colors.triplet,
    paddingTop: 0,
    marginTop: -10,
    fontFamily: 'Futura'
  },
  tripleToggle: {
    flexDirection: 'row'
  },
  tripletButton: {
    marginTop: 6,
    backgroundColor: 'transparent'
  },
  twoColumnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  twoColumnColumn: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
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
