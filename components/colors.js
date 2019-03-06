import React, { Component } from 'react';

// This file stores all the colors used, the Serta Simmons Colors
// Should be updated to the official hex values as these were pulled using
// digital color meter (mac) on the website
const darkB = '#0c2245';
const medB = '#0e4587';
const lightB = '#59aae0';
const highlight = '#fecd09';

let colors = {
  background: darkB,
  asleepBar: lightB,
  awakeBar: highlight,
  napBar: 'white',
  data: lightB,
  descriptions: 'white',
  axis: 'white',
  header: medB,
  triplet: highlight,
  tabs: lightB,
  tabSel: highlight,
  tabText: lightB,
  tabSelText: darkB,
  natAvg: medB,
  darkB: '#0c2245',
  medB: '#0e4587',
  lightB: '#59aae0',
  highlight: '#fecd09',
}


//old colors
// const darkB = '#4C8C7B';
// const medB = 'teal';
// const lightB = '#39BAB1';
// const highlight = #fecd09;
// const backgroundDark = '#B1CCC5';


export function changeTheme(dark) {
  console.log('changing theme...');
  if (dark === true){
    console.log('dark...!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    colors = {
      background: darkB,
      asleepBar: lightB,
      awakeBar: highlight,
      data: lightB,
      descriptions: 'white',
      axis: 'white',
      header: medB,
      triplet: highlight,
      tabs: lightB,
      tabSel: highlight,
      tabText: lightB,
      tabSelText: darkB,
      darkB: '#0c2245',
      medB: '#0e4587',
      lightB: '#59aae0',
      highlight: '#fecd09',
    }
  }
  else if (dark === false){
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    colors = {
      background: 'white',
      asleepBar: 'white',
      awakeBar: highlight,
      data: lightB,
      descriptions: 'white',
      axis: 'white',
      header: medB,
      triplet: highlight,
      tabs: lightB,
      tabSel: highlight,
      tabText: lightB,
      tabSelText: darkB,
      darkB: '#0c2245',
      medB: '#0e4587',
      lightB: '#59aae0',
      highlight: '#fecd09',
    }
  }
};

export default colors;
