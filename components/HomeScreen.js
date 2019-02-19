import React, { Component } from 'react';
import { Alert, StyleSheet, ScrollView, ActivityIndicator, Image, View, TouchableOpacity, Text } from 'react-native';
import { List, ListItem, Button } from 'react-native-elements';
import { VictoryBar, VictoryLine, VictoryArea, VictoryChart, VictoryStack, VictoryScatter, VictoryTheme, VictoryAxis, LineSegment, VictoryLabel } from 'victory-native';
import DayDetail from './DayScreen';
import SummaryDetail from './SummaryScreen';
import MonthDetail from './MonthScreen';
import Tutorial from './TutorialScreen';
import Settings from './SettingsScreen';
import Averages from './AveragesScreen';
import AllDetail from './AllScreen';
import firebase from '../Firebase';
import styles from './style';
import colors from './colors';

class HomeScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const {params = {}} = navigation.state;
      return {
        //Draw settings and add child buttons on header of screen
        title: 'Serta Simmons',
        titleStyle: {
	    		fontFamily: 'Futura'
	    	},
        headerRight:  (
          <View style={styles.btnContainer}>
            <Button
              buttonStyle={{ padding: 0, backgroundColor: 'transparent', marginRight: -20}}
              icon={{ name: 'insert-chart', style: { marginRight: 0, fontSize: 28 } }}
               onPress={() => {
                 navigation.navigate('Averages', {
                   sleepAVG: params.sleepAVG,
                   restlessAVG: params.restlessAVG,
                   bedwetsAVG: params.bedwetsAVG,
                   exitsAVG: params.exitsAVG,
                    });
              }}
            />
            <Button
              buttonStyle={{ padding: 0, backgroundColor: 'transparent' }}
              icon={{ name: 'settings', style: { marginRight: 0, fontSize: 28 } }}
              onPress={() => { navigation.push('Settings') }}
            />
          </View>
        ),
        headerLeft: (
          <View style={styles.btnContainer}>
            <Button
              buttonStyle={{ padding: 0, backgroundColor: 'transparent' }}
              icon={{ name: 'info', style: { marginRight: 0, fontSize: 28 } }}
              onPress={() => {
                  params.setTutState();
                  //navigation.push('Tutorial')
               }}
            />
            <Button
            buttonStyle={{ padding: 0, backgroundColor: 'transparent', marginLeft: -20 }}
            icon={{ name: 'view-carousel', style: { marginRight: 0, fontSize: 28 } }}
            onPress={() => {
                params.toggleAB();
                //navigation.push('Tutorial')
             }}
            />
          </View>
        ),
      };
    };

  constructor() {
    super();
    this.ref = firebase.firestore().collection('days');
    this.unsubscribe = null;
    this.state = {
      isLoading: true,  // check for whether initial data has been received
      boards: [],       // full list of all nights data
      displayBoards: [],   // the display of nights on the weekly summary
      monthBoards: [],  //the display of nights on the monthly summary
      picked: 0,        // the index in boards of the currently selected night
      dateDic: [],      // dictionary of all the dates --> to speed finding of a specific night's index
      firstRun: 1,
      day: 2,       // day v. week view --> should  be removed if using separate pages
      tutorial: false,
      ABtest: 1,  // AB testing variable, 1 or 2
    };
    this.onFetchData = this.onFetchData.bind(this);
    this.goToDay = this.goToDay.bind(this);
    this.changeDay = this.changeDay.bind(this);
    this.changeWeek = this.changeWeek.bind(this);
    this.changeMonth = this.changeMonth.bind(this);
    this.moreMonths = this.moreMonths.bind(this);
    this.moreWeeks = this.moreWeeks.bind(this);
    this.moreDays = this.moreDays.bind(this);
    this.toggleTutorial = this.toggleTutorial.bind(this);
    this.toggleABtest = this.toggleABtest.bind(this);

  }

  componentDidMount() {
    // OLD: firestore connection
    //this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
    // Realtime database connection
    this.fetchData();
    // this.props.navigation.setParams({
    //         allBoards: this.state.day,
    //         sleepAVG: this.calcSleepAvg(this.state.boards).toFixed(2),
    //     });
  }


  //wrapper so that state can be set from onFetchData
  fetchData() {
    //Change function to on or once to change data receiving options
    firebase.database().ref().once('value', this.onFetchData);
  }

  // increment or decrement the picked by the amount given in updown
  changeDay(upDown) {
    if((this.state.picked + upDown < this.state.boards.length) && (this.state.picked + upDown >= 0)) {
      this.setState(prevState => ({picked: prevState.picked + upDown} ))
    }
  }
  // Check if more days
  moreDays(upDown) {
    if((this.state.picked + upDown < this.state.boards.length) && (this.state.picked + upDown >= 0)) {
      return 1;
    }
    return 0;
  }

  goToDay(dayString) {
    this.setState({picked: this.state.dateDic.indexOf(dayString), day: true});
  }

  //Convert decimal minutes to min:sec
  minTommss(minutes){
   var min = Math.floor(Math.abs(minutes));
   var sec = Math.floor((Math.abs(minutes) * 60) % 60);
   //return  min + "m " + sec + "s";
   if (isNaN(min)) {
     return "--"
   }
   return min + " m"
  }

  //Convert decimal hours to hr:min
  hrTohhmm(hours){
   var hr = Math.floor(Math.abs(hours));
   var min = Math.floor((Math.abs(hours) * 60) % 60);
   min = min < 10 ? " " + min : min;
   if (isNaN(hr) || isNaN(min)) {
     return "--"
   }
   return  hr + "h " + min + "m";
  }

  //Format time into hh:mm in am and pm
  formatAmPm(date) {
    var hh = date.getHours();
    var m = date.getMinutes();
    if (isNaN(hh) || isNaN(m)) {
      return "-"
    }
    var dd = "AM";
    var h = hh;
    if (h >= 12) {
      h = hh - 12;
      dd = "PM";
    }
    if (h == 0) {
      h = 12;
    }
    h = h < 10 ? " " + h : h;
    m = m < 10 ? "0" + m : m;
    var replacement = h + ":" + m + " " + dd;
    return replacement;
  }

  //Format time into hh in am and pm
  formatAmPmHr(date) {
    var hh = date.getHours();
    if (isNaN(hh)) {
      return "-"
    }
    var dd = "AM";
    var h = hh;
    if (h >= 12) {
      h = hh - 12;
      dd = "PM";
    }
    if (h == 0) {
      h = 12;
    }
    h = h < 10 ? " " + h : h;
    var replacement = h + " " + dd;
    return replacement;
  }

  //Check if more weeks to toggle
  moreWeeks(direction) {
    //Find the index of the first day of the current week in dateDic
    let index = this.state.dateDic.indexOf(this.state.displayBoards[0].day);
    //If go back a week but first day already displayed
    if (direction == -1 && index == 0) {
      //Return 0
      return 0;
    }
    //If go forward a week but last week of data displayed
    else if (direction == 1 && index == this.state.boards.length-7)  {
      //Return 0
      return 0;
    }
    //If can toggle week, return 1
    return 1;
  }
  //Change week view for summary screen
  changeWeek(direction) {
    let newBoards = [];
    //Find the index of the first day of the current week in dateDic
    let index = this.state.dateDic.indexOf(this.state.displayBoards[0].day);

    //If go back a week
    if (direction == -1) {
      //If not more than a week of data before current week
      if (index < 7) {
        //Display the first seven days
        for (i=0; i<7; i++) {
          newBoards.push(this.state.boards[i]);
        }
      }
      //If more than one week before exists
      else {
        //Display the last seven days before the current boards
        for (i=index-7; i<index; i++) {
          newBoards.push(this.state.boards[i]);
        }
      }
    }
    //If go forward a week
    else if (direction == 1) {
      //If not more than a week of data after current week
      if (index > this.state.boards.length-14) {
        //Display most recent 7 days
        for (i=this.state.boards.length-7; i<this.state.boards.length; i++) {
          newBoards.push(this.state.boards[i]);
        }
      }
      //if more than one week after exists
      else {
        //Display next seven days after current day
        for (i=index+7; i<index+14; i++) {
          newBoards.push(this.state.boards[i]);
        }
      }
    }
    //Update displayBoards
    this.setState({displayBoards: newBoards,});
  }

  //Check if more months to step through
  moreMonths(direction) {
    //If go back a month
    if (direction == -1) {
      //Check if first day of month is first day of data
      if (this.state.boards[0].day == this.state.monthBoards[0].day) {
        return 0;
      }
    }
    //If go forward a week
    else if (direction == 1) {
      //Check if current month is last in database
      if (this.state.dateDic[this.state.dateDic.length-1].split("-")[0] == this.state.monthBoards[0].day.split("-")[0]) {
        return 0;
      }
    }
    return 1;
  }
  //Change week view for summary screen
  changeMonth(direction) {
    let newBoards = [];
    //Find the index of the first day of the current week in dateDic
    let index = this.state.dateDic.indexOf(this.state.monthBoards[0].day);
    let monthIndex = -1;

    //If go back a week
    if (direction == -1) {
      //Check if a month exists prior to displayed month
      for (i=index; i>0; i--) {
        //Check when month of current date is different from month in dateDic
        if (this.state.dateDic[i].split("-")[0] != this.state.monthBoards[0].day.split("-")[0]) {
          monthIndex = i;
          i = -1;
        }
      }
      //If previous month found
      if (monthIndex != -1) {
        let splitDate1 = this.state.dateDic[monthIndex].split("-");
        //Loop through dates to find boards that match the previous month
        for (i=0; i<this.state.dateDic.length; i++) {
          let splitDate2 = this.state.dateDic[i].split("-");
          //If they match the month we're looking for, add them to display
          if (splitDate1[0] == splitDate2[0]) {
            newBoards.push(this.state.boards[i]);
          }
        }
      }
      //if no month found
      else {
        //Keep current monthBoards as display
        newBoards = this.state.monthBoards;
      }
    }
    //If go forward a week
    else if (direction == 1) {
      //Check if a month exists after  displayed month
      for (i=index; i<this.state.dateDic.length; i++) {
        //Check when month of current date is different from month in dateDic
        if (this.state.dateDic[i].split("-")[0] != this.state.monthBoards[0].day.split("-")[0]) {
          monthIndex = i;
          i = this.state.dateDic.length+1;
        }
      }
      //If previous month found
      if (monthIndex != -1) {
        let splitDate1 = this.state.dateDic[monthIndex].split("-");
        //Loop through dates to find boards that match the previous month
        for (i=index; i<this.state.dateDic.length; i++) {
          let splitDate2 = this.state.dateDic[i].split("-");
          //If they match the month we're looking for, display
          if (splitDate1[0] == splitDate2[0]) {
            newBoards.push(this.state.boards[i]);
          }
        }
      }
      //if no month found, display current monthBoards
      else {
        newBoards = this.state.monthBoards;
      }
    }
    //Update displayBoards
    this.setState({monthBoards: newBoards,});
  }

  //Calculate sleep average
  calcSleepAvg(currBoards) {
    let sleepAVG = 0;
    let iCount =0;
    for ( i = 0; i < currBoards.length; i++){
      if (currBoards[i].sleep > 0.25) {
        sleepAVG += currBoards[i].sleep;
        iCount++;
      }
    }
    sleepAVG = sleepAVG/iCount;
    if (isNaN(sleepAVG)) {
      return "--";
    }
    return sleepAVG.toFixed(2);
  }

  //Calculate bedwetting sum
  calcBedwetting(currBoards) {
    let sumWets = 0;
    let iCount =0;
    for ( i=0; i<currBoards.length; i++) {
      if (currBoards[i].sleep > 0.25) {
        sumWets = sumWets + currBoards[i].bedwet.length;
        iCount++;
      }
    }
    sumWets = sumWets/(iCount);
    if (isNaN(sumWets)) {
      return "--";
    }
    return sumWets.toFixed(1);
  }

  //Calculate average exits
  calcExits(currBoards) {
    let avgExits = 0;
    let iCount =0;
    for ( i=0; i<currBoards.length; i++) {
      if (currBoards[i].sleep > 0.25) {
        avgExits = avgExits + currBoards[i].exited.length-1;
        iCount++;
      }
    }
    avgExits = avgExits/(iCount);
    if (isNaN(avgExits)) {
      return "--";
    }
    return avgExits.toFixed(1);

  }

  //Calculate restlessness average
  calcRestless(currBoards) {
    let avgTRestless = 0;
    let restCounter = 0;

    //If only one day in currBoards
    if (!Array.isArray(currBoards)) {
      for (j=0; j<currBoards.restNum.length; j++) {
        if (!isNaN(currBoards.restNum[j])) {
          avgTRestless = avgTRestless + currBoards.restNum[j];
          restCounter++;
        }
      }
    //If multiple days in currBoards
    } else {
      for ( i=0; i<currBoards.length; i++) {
        //Only count if data has sleep info for the night
        if (currBoards[i].sleep > 0.25) {
          for (j=0; j<currBoards[i].restNum.length; j++) {
            //Check to make sure that you're not counting fake data
            if (currBoards[i].restNum.length != 2) {
              if (!isNaN(currBoards[i].restNum[j])) {
                avgTRestless = avgTRestless + currBoards[i].restNum[j];
                restCounter++;
              }
            }
          }
        }
      }
    }
    avgTRestless = avgTRestless/(restCounter);
    //normalize restless on scale 0-1
    avgTRestless = avgTRestless/73*100;

    if (isNaN(avgTRestless)) {
      return "--";
    }
    return avgTRestless.toFixed(0);
  }

  toggleTutorial() {
    //console.log('Toggling tutorial state');
    this.setState(prevState => ({tutorial: !prevState.tutorial} ))
  }

  // toggle the ABtest variable to display different graphics
  // change 'MaxABtest' to maximum desired number of views
  toggleABtest() {
    // if max set to 0
    // CHANGE if changing number of views
    const MaxABtest = 2;
    if (this.state.ABtest == MaxABtest) {
      this.setState({ABtest: 1});
      this.props.navigation.setParams({ ABtest: 1 });
    }
    else {
      this.setState(prevState => ({ABtest: prevState.ABtest + 1}));
      // set the parameters for header
      this.props.navigation.setParams({ ABtest: this.state.ABtest + 1 });
    }

  }

  //Set up qualitative descriptions of restlessness
  findRestlessWord(avgTRestless) {
    let restlessDescription = "N/A";
    if (avgTRestless < 50) {
      restlessDescription = "Normal";
    } else if (avgTRestless < 80) {
      restlessDescription = "Moderate";
    } else if (avgTRestless <=100 ){
      restlessDescription = "High";
    }
    return restlessDescription;
  }

  // process the incoming data
  onFetchData = (snapshot) => {
    let nightData = [];
    let nights = [];
    let dates = [];
    let data = snapshot.val();

    // get the number of nights
    nights = Object.keys(data);

    //Find day of week as label
    var weekday = new Array();
    weekday[0] = "Su";
    weekday[1] = "M";
    weekday[2] = "T";
    weekday[3] = "W";
    weekday[4] = "Th";
    weekday[5] = "F";
    weekday[6] = "S";

    //clean non mm-dd-yyyy keys from nights
    let splitDate = "";
    for (i=0; i<nights.length; i++){
      //Check that key is in date format with two '-'
      if (nights[i].split("-").length == 3) {
        splitDate = nights[i].split("-");
        nights[i] = new Date(splitDate[2], splitDate[0] - 1, splitDate[1]);
      }
      else {
        nights.splice(i, 1);
        i--;
      }
    }

    //Sort nights keys
    //Function to sort dates
    var date_sort_asc = function (date1, date2) {
      // Sort in ascending order
      if (date1 > date2) return 1;
      if (date1 < date2) return -1;
      return 0;
    };
    //dates.sort(date_sort_asc);
    nights.sort(date_sort_asc);

    //convert nights keys back to mm-dd-yyyy strings
    for (i=0; i<nights.length; i++){
      nights[i] = (nights[i].getMonth() + 1) + '-' + nights[i].getDate() + '-' +  nights[i].getFullYear();
    }

    //console.log(nights);
    // loop through each night and sort the data into arrays and objects to store in state
    // try to ensure that there are at least zeros for missing nights
    let prevDate = new Date(nights[0].split("-")[2], nights[0].split("-")[0] - 1, nights[0].split("-")[1]);
    //console.log(prevDate);
    //console.log(prevDate.getDay());
    nights.forEach(function(nightName) {
      if (nightName != 'Profile' && nightName != 'current_time') {
        let thisDate = new Date(nightName.split("-")[2], nightName.split("-")[0] - 1, nightName.split("-")[1]);
        // console.log(thisDate);
        // console.log(prevDate);
        // console.log((thisDate - prevDate)/(60*60*1000));
        while (((thisDate.getTime()) - (prevDate.getTime()))/(60*60*1000) > 30) {
          // add a day to prevDate
          //console.log(prevDate);
          prevDate = new Date(prevDate.getTime() + (24*60*60*1000));
          //console.log('missing day');
          // Now store an object of zeros
          let extraNightName= (prevDate.getMonth() + 1) + '-' + prevDate.getDate() + '-' + prevDate.getFullYear();
          dates.push(extraNightName);
          let extradayOfWk = weekday[prevDate.getUTCDay()];
        //  console.log(extraNightName);
          nightData.push({ "day": extraNightName, "dateLabel": extraNightName.slice(0, -5), "exited": [], "enters": [], "bedwet": [], "sleep": 0, "restTime": [prevDate, prevDate], "restNum": [0, 0], "inBed": 0, "dayLabel": extradayOfWk, "awake": 0, "naps": 0, "restlessAvg": 0});
          //console.log(prevDate);
        }

          prevDate = thisDate;
          //Use to index boards
          dates.push(nightName);

          // initialize arrays for data
          let enters;
          let exits;
          let wets = [];
          let restless = [];
          const night = data[nightName];

          //  fill arrays by iterating over each list from firebase
          if (night["enters"])  {
            enters = (Object.keys(night["enters"]).map( (key) => {
              if (night["enters"][key].toString().length < 13) {
                return night["enters"][key]*1000;
              }
              return( night["enters"][key])
            }));
          }
          if (night["exits"])  {
            exits  = (Object.keys(night["exits"]).map( (key) => {
              if (night["exits"][key].toString().length < 13) {
                return night["exits"][key]*1000;
              }
              return( night["exits"][key])
            }));
          }
          if (night["wets"])  {
            wets = (Object.keys(night["wets"]).map( (key) => {
              if (night["wets"][key].toString().length < 13) {
                return night["wets"][key]*1000;
              }
              return( night["wets"][key])
            }));
          }
          if (night["movement"])  {
            restless = Object.keys(night["movement"]).map( (key) => {
              if (night["movement"][key].toString().length < 13) {
                return night["movement"][key]*1000;
              }
              return( night["movement"][key])
            });
          }

          console.log("Wets " + wets);

          //Check that there are enters if other data exists
          if (!enters) {
            //Fill all arrays with 0s
            console.log('No enters')
            enters = [];
            exits = [];
            wets = [];
          }

          // Check that there are exits and if not check if it is from
          // today/yesterday if it is from today then set exit as current
          // time, if it is not then set the exit to right after the enter
          if (!exits) {
            //  console.log('No exits today' + nightName);
            let nightDate;
            // get the actual date from the nightName again
            if (nightName.split("-").length - 1 == 2) {
              splitDate = nightName.split("-");
              nightDate = new Date(splitDate[2], splitDate[0] - 1, splitDate[1]);
            }
            // console.log(nightName);
            let currTime = new Date();

            // see if the enter is from the last 24 hours
            // if enter is from the past night then set exit as now
            // if not then set exit as just one more than the enter
            timeDif = (currTime - nightDate)/(60*60*1000);
            if ( timeDif < 24 ) {
              exits = [currTime];
              console.log("Night without any exits: " + nightName)
            }
            else {
              exits = [enters[0]];
            }
          }
          // console.log('new exits:');
          // console.log(exits);

        // Check the data and fill in missing exits and enters
          // check the number of exits and enters
          if (exits.length > 1){
            //Check that first enter comes before first exit
            if (exits[0] < enters[0]) {
              //Remove first exit if came before first enter
              exits.splice(0, 1);
            }
          }

          // fill in missing exits/enters
          if (exits.length < enters.length) {
            //console.log('Adding exits...');
            for (i=1; i < enters.length; i++){
            //  console.log('Check for consecutive enters');
              // check for consecutive enters
              if (enters[i] < exits[i-1]) {
              //  console.log('adding exit.');
                // put the average of the two consequative enters
                let addedExit = Math.floor((enters[i] + enters[i-1]) / 2);
              //  console.log(addedExit);
                exits.splice(i-1, 0, addedExit);
              //  console.log('added.');
              }
            }
            // if the enters is still longer, drop the final enter
            if (enters.length - exits.length == 1) {
              enters.pop();
            }
            //console.log('enters then exits length: ' + enters.length + exits.length);
          }
          else if (exits.length > enters.length) {
            console.log('Adding enters...');
            for (i=1; i < exits.length; i++){
            //  console.log('Check for consecutive enters');
              // check for consecutive enters
              if (exits[i] < enters[i]) {
              //  console.log('adding exit.');
                // put the average of the two consequative enters
                let addedEnter = Math.floor((exits[i] + exits[i-1]) / 2);
              //  console.log(addedExit);
                enters.splice(i, 0, addedEnter);
              //  console.log('added.');
              }
            }
            // if the enters is still longer, drop the final enter
            if (exits.length - enters.length  == 1) {
              exits.pop();
            }
            //console.log('enters then exits length: ' + enters.length + exits.length);

          }
          else {
            console.log('Equal or empty: ' + exits.length + "..." + enters.length);
          }

          //Splice 0 minute exits-->enters
          for (i=0; i<exits.length-2; i++) {
            //Check if exit is less than a minute in length
            if (new Date((new Date(enters[i+1]).getTime())-(new Date(exits[i]).getTime()))/60000 < 1) {
              //Remove relevant enter/exit
              exits.splice(i, 1);
              enters.splice(i+1, 1);
              i--;
            }
          }

          //Split timestamp from restlessness rating
          let restTime = [];  //time in day/hr/min/set
          let restNum = [];   //movement on scale 0-2

          for (i=0; i<restless.length; i++) {
            restlessSplit = restless[i].toString().split(" ")
            restTime.push(new Date(parseInt(restlessSplit[0], 10)));
            restNum.push(parseInt(restlessSplit[1], 10));
          }
          //To avoid graph errors, fill empty restless and sleep graph with fake data
          if (restNum.length == 0) {
            restNum = [0, 0];
            restTime = [new Date(enters[0]), new Date(exits[exits.length-1])];
          }

          //Fill empty enters and exits with a 0
          if (enters.length == 0) {
            enters = [0];
          }
          if (exits.length == 0) {
            exits = [0];
          }

  // TODO: more accurate processing of sleep and awake time
          //Calculate time between first enter and last exit dates (time in bed)
          console.log(enters[0] + " - " + exits[exits.length-1])
          var enter1 = new Date(enters[0]);
          var exit2 = new Date(exits[exits.length-1]);
          var inBedDiff = new Date((exit2.getTime() - enter1.getTime()));
          //Calculate time in bed
          var inBedTime = 0;
          if (inBedDiff) {
            inBedTime = inBedDiff / (3600000 );
          }

          console.log('InBed: ' + inBedTime);

          //Loop through exits and calculate sleep time (time in bed not counting exits)
          var sleep = 0;
          var totalOutOfBed = 0;
          // amount of time that within exits and enters do not count towards Sleep
          const asleepThresh = .01;
          let asleep = false;
          console.log(enters.length);
          console.log(exits.length);
          for (i=0; i < enters.length; i++){
            var inTime = enters[i];
            var outTime = exits[i];
            var timeIn = (outTime - inTime) / (60*60*1000);
            var enter1Time = new Date(inTime);
            var exit1Time = new Date(outTime);
            console.log(enter1Time.getHours() + " : " + exit1Time.getHours() + " : " + timeIn);
            // if not asleep yet, don't count, check if asleep
            if (timeIn) {
              if (timeIn > asleepThresh) {
                asleep = true;
                sleep += timeIn;
              }
            //Add time in bed between each entrance and exit to sleep
            }
          }
          console.log("Asleep: " + sleep);

  // Todo: incorporate restlessness into judging sleep time


          splitDate= nightName.split("-");
          let dayOfWk = weekday[(new Date(splitDate[2], splitDate[0] - 1, splitDate[1])).getUTCDay()];

          // true false on bed wetting length
          var bedwet = wets.length >= 1;

          //Find avg restlessness per night
          let averageMovement = 0;
          let moveCount = 0;
          for (i=0; i<restNum.length; i++) {
            if (!isNaN(restNum[i])) {
              averageMovement += restNum[i];
              moveCount++;
            }
          }
          if (moveCount > 0) {
            averageMovement = averageMovement/moveCount;
          }

          // add these arrays to the array that will be boards
          //console.log('real: ' + nightName);
          nightData.push({ "day": nightName, "dateLabel": nightName.slice(0, -5), "exited": exits, "enters": enters, "bedwet": wets, "sleep": sleep, "restTime": restTime, "restNum": restNum, "inBed": inBedTime, "dayLabel": dayOfWk, "awake": inBedTime-sleep, "naps": 0, "restlessAvg": averageMovement});


        //} // end of checking if it was within the last 24 hrs
        // else {
        //   // add a day to prevDate
        //   //console.log(prevDate);
        //   prevDate = new Date(prevDate.getTime() + (24*60*60*1000));
        //   console.log('missing day');
        //   // Now store an object of zeros
        //   nightName = (prevDate.getMonth() + 1) + '-' + prevDate.getDate() + '-' + prevDate.getFullYear();
        //   let dayOfWk = weekday[prevDate.getUTCDay()];
        //   console.log(nightName);
        //   nightData.push({ "day": nightName, "exited": [], "enters": [], "bedwet": [], "sleep": 0, "restTime": 0, "restNum": 0, "inBed": 0, "dayLabel": dayOfWk, });
        //   //console.log(prevDate);
        // }

        } // end of if checking its not current time or profile

    }) // end of looping through the nights of data

    //Only set day, week, and month default view once
    let pickData = this.state.picked;
    let displayData = this.state.displayBoards;
    let monthData = this.state.monthBoards;
    if (this.state.firstRun == 1) {
      //Set day, week, month boards
      pickData = dates.length-1;
      displayData = [];
      monthData = [];
      //Set up boards for weekly display view (take most recent numDisplay days)
      let numDisplay = 7;
      //if fewer data days than the user wants to display, only show available data
      if (dates.length <= numDisplay) {
        displayData = nightData
      //else show last numDisplay days
      } else {
        for (i = numDisplay; i>0; i--) {
          displayData.push(nightData[dates.length-i]);
        }
      }

      //Set up boards for monthly display view (take only boards with same month)
      let splitDate1 = 0;
      let count = dates.length-1;
      //find most recent day with data
      while (count >= 0) {
        if (nightData[count].enters.length > 0 && nightData[count].exited.length > 0) {
          splitDate1 = dates[count].split("-");
          count = -1;
        } else {
          count--;
        }
      }
      //add all days to monthData that have same month as most recent day with data
      for (i=0; i<dates.length; i++) {
        let splitDate2 = dates[i].split("-");
        if (splitDate1[0] == splitDate2[0]) {
          monthData.push(nightData[i]);
        }
      }
    } //end setting of displays for first time app is loaded

    //Set state with all of newly processed variables
    this.setState({
      boards: nightData,
      displayBoards: displayData,
      monthBoards: monthData,
      dateDic: dates,
      picked: pickData,
      firstRun: 0,
      isLoading: false, // update so components render
    });

    // set the parameters for going to the averages page
    this.props.navigation.setParams({
      sleepAVG: this.calcSleepAvg(this.state.boards),
      restlessAVG: this.calcRestless(this.state.boards),
      bedwetsAVG: this.calcBedwetting(this.state.boards),
      exitsAVG: this.calcExits(this.state.boards),
      setTutState: this.toggleTutorial,
      toggleAB: this.toggleABtest,
      ABtest: this.state.ABtest,
    });
  }


  render() {
    //Needed to navigate to other pages from Home Screen
    const {navigate} = this.props.navigation;

    //Check there is data loaded
    if(this.state.isLoading){
      return(
        <View style={styles.activity}>
          <ActivityIndicator size="large" color={colors.highlight}/>
        </View>
      )
    }

    let reports;
    if (this.state.day == 1){
      reports = (
        <DayDetail boards={this.state.boards}
          picked={this.state.picked}
          changePicked={this.changeDay}
          restlessDescription={this.findRestlessWord(this.calcRestless(this.state.boards[this.state.picked]))}
          avgRestless={this.calcRestless(this.state.boards[this.state.picked])}
          hrToMin={this.hrTohhmm}
          minToSec={this.minTommss}
          formatTime={this.formatAmPm}
          tutorial={this.state.tutorial}
          moreDays={this.moreDays}/>);
        }
    else if (this.state.day == 2) {
      reports = (
        <SummaryDetail
          boards={this.state.displayBoards}
          sleepAVG={this.calcSleepAvg(this.state.displayBoards)}
          restlessDescription={this.findRestlessWord(this.calcRestless(this.state.displayBoards))}
          avgRestless={this.calcRestless(this.state.displayBoards)}
          sumWets={this.calcBedwetting(this.state.displayBoards)}
          avgExits={this.calcExits(this.state.displayBoards)}
          selectDay={this.goToDay}
          navigation={this.props.navigation}
          hrToMin={this.hrTohhmm}
          ampm={this.formatAmPmHr}
          getHrMin={this.formatAmPm}
          changeWeek={this.changeWeek}
          tutorial={this.state.tutorial}
          moreWeeks={this.moreWeeks}
          AB={this.state.ABtest}
        />);}
    else if (this.state.day == 3) {
      reports =(
        <MonthDetail
          boards={this.state.monthBoards}
          sleepAVG={this.calcSleepAvg(this.state.monthBoards)}
          restlessDescription={this.findRestlessWord(this.calcRestless(this.state.monthBoards))}
          avgRestless={this.calcRestless(this.state.monthBoards)}
          sumWets={this.calcBedwetting(this.state.monthBoards)}
          avgExits={this.calcExits(this.state.monthBoards)}
          selectDay={this.goToDay}
          navigation={this.props.navigation}
          hrToMin={this.hrTohhmm}
          ampm={this.formatAmPmHr}
          getHrMin={this.formatAmPm}
          changeMonth={this.changeMonth}
          tutorial={this.state.tutorial}
          moreMonths={this.moreMonths}
          AB={this.state.ABtest}
        />);}
    else if (this.state.day == 4) {
      reports =(<AllDetail
      boards={this.state.boards}
      sleepAVG={this.calcSleepAvg(this.state.boards)}
      restlessDescription={this.findRestlessWord(this.calcRestless(this.state.boards))}
      avgRestless={this.calcRestless(this.state.boards)}
      sumWets={this.calcBedwetting(this.state.boards)}
      avgExits={this.calcExits(this.state.boards)}
      selectDay={this.goToDay}
      hrToMin={this.hrTohhmm}
      tutorial={this.state.tutorial}
      AB={this.state.ABtest}
    />);}

    return (
      <View style={styles.container}>
      <View style={styles.tripleToggle}>
        <TouchableOpacity
          onPress = {()=> this.setState({day: 1})}
          style={((this.state.day == 1) ? styles.buttonSelected : styles.button)}>
          <Text style={styles.buttonText}>Day</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress = {()=> this.setState({day: 2})}
          style={((this.state.day == 2) ? styles.buttonSelected : styles.button)}>
          <Text style={styles.buttonText}>Week</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress = {()=> this.setState({day: 3})}
          style={((this.state.day == 3) ? styles.buttonSelected : styles.button)}>
          <Text style={styles.buttonText}>Month</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress = {()=> this.setState({day: 4})}
          style={((this.state.day == 4) ? styles.buttonSelected : styles.button)}>
          <Text style={styles.buttonText}>All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.container}>

      {this.state.picked}

      {reports}

      </ScrollView>
      </View>
    );
  }
}

export default HomeScreen;
