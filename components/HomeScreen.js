import React, { Component } from 'react';
import { Alert, StyleSheet, ScrollView, ActivityIndicator, Image, View, TouchableOpacity, Text } from 'react-native';
import { List, ListItem, Button, Icon } from 'react-native-elements';
import { VictoryBar, VictoryLine, VictoryArea, VictoryChart, VictoryStack, VictoryScatter, VictoryTheme, VictoryAxis, LineSegment, VictoryLabel } from 'victory-native';
import DayDetail from './DayScreen';
import SummaryDetail from './SummaryScreen';
import AllDetail from './AllScreen';
import firebase from '../Firebase';
import styles from './style';

class HomeScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      //Draw settings and add child buttons on header of screen
      title: 'Sleep Report',
      headerRight:  (<Button
          buttonStyle={{ padding: 0, backgroundColor: 'transparent' }}
          icon={{ name: 'settings', style: { marginRight: 0, fontSize: 28 } }}
          onPress={() => { navigation.push('Settings') }}
        />
      ),
      headerLeft: (
        <Button
          buttonStyle={{ padding: 0, backgroundColor: 'transparent' }}
          icon={{ name: 'info', style: { marginRight: 0, fontSize: 28 } }}
          onPress={() => { navigation.push('Tutorial') }}
        />
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
      displayBoards: [],   // the display of nights on the summary
      picked: 0,        // the index in boards of the currently selected night
      dateDic: [],      // dictionary of all the dates --> to speed finding  a specific night's index
      day: 2,       // day v. week view --> should  be removed if using separate pages
    };
    this.onFetchData = this.onFetchData.bind(this);
    this.goToDay = this.goToDay.bind(this);
    this.changeDay = this.changeDay.bind(this);
  }

  componentDidMount() {
    // OLD: firestore connection
    //this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
    // Realtime database connection
    this.fetchData();
  }


  //wrapper so that state can be set from onFetchData
  fetchData() {
    firebase.database().ref().on('value', this.onFetchData);
  }

  // increment or decrement the picked by the amount given in updown
  changeDay(upDown) {
    if((this.state.picked + upDown < this.state.boards.length) && (this.state.picked + upDown >= 0)) {
      this.setState(prevState => ({picked: prevState.picked + upDown} ))
    }
  }

  goToDay(dayString) {
    this.setState({picked: this.state.dateDic.indexOf(dayString), day: true});
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
      if (nights[i].split("-").length - 1 == 2) {
        splitDate = nights[i].split("-");
        nights[i] = new Date(splitDate[2], splitDate[0] - 1, splitDate[1]);
      }
      else {
        nights.splice(i, 1);
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

    console.log(nights);
    // loop through each night and sort the data into arrays and objects
    // to store in state
    // try to ensure that there are atleast zerosfor missing nights
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
          console.log('missing day');
          // Now store an object of zeros
          let extraNightName= (prevDate.getMonth() + 1) + '-' + prevDate.getDate() + '-' + prevDate.getFullYear();
          let extradayOfWk = weekday[prevDate.getUTCDay()];
          console.log(extraNightName);
          nightData.push({ "day": extraNightName, "exited": [], "enters": [], "bedwet": [], "sleep": 0, "restTime": 0, "restNum": 0, "inBed": 0, "dayLabel": extradayOfWk, });
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
            enters = Object.keys(night["enters"]).map( (key) => { return( night["enters"][key])});
          }
          if (night["exits"])  {
            exits  = Object.keys(night["exits"]).map( (key) => { return( night["exits"][key])});
          }
          if (night["wets"])  {
            wets = Object.keys(night["wets"]).map( (key) => { return( night["wets"][key])});
          }
          if (night["movement"])  {
            restless = Object.keys(night["movement"]).map( (key) => { return( night["movement"][key])});
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
            }
            else {
              exits = [enters[0]];
            }
          }
          // console.log('new exits:');
          // console.log(exits);



          //Check that first enter comes before first exit
          if (exits[0] < enters[0]) {
            //Remove first exit if came before first enter
            exits.splice(0, 1);
          }

          //Split timestamp from restlessness rating
          let restTime = [];  //time in day/hr/min/set
          let restNum = [];   //movement on scale 0-2

          for (i=0; i<restless.length; i++) {
            restlessSplit = restless[i].toString().split(" ")
            restTime.push(new Date(parseInt(restlessSplit[0], 10)));
            restNum.push(parseInt(restlessSplit[1], 10));
          }

  // TODO: more accurate processing of sleep and awake time
          //Calculate time between first enter and last exit dates (time in bed)
          var enter1 = new Date(enters[0]);
          var exit2 = new Date(exits[exits.length-1]);
          var inBedDiff = new Date((exit2-enter1));
          //Calculate time in bed
          var inBedTime = 0;
          if (inBedDiff) {
            inBedTime = inBedDiff / (3600000 );
          }

          //Loop through exits and calculate sleep time (time in bed not counting exits)
          var sleep = 0;
          var totalOutOfBed = 0;
          // amount of time that within exits and enters do not count towards Sleep
          const asleepThresh = .01;
          let asleep = false;
          for (i=0; i<enters.length-1; i++){
            var inTime = new Date(enters[i]);
            var outTime = new Date(exits[i]);
            var timeIn = new Date(outTime-inTime) / (3600000);

            // if not asleep yet, don't count, check if asleep
            if (timeIn) {
              if (timeIn > asleepThresh) {
                asleep = true;
                sleep += timeIn;
              }
            //Add time in bed between each entrance and exit to sleep
            }
          }

  // Todo: incorporate restlessness into judging sleep time


          splitDate= nightName.split("-");
          let dayOfWk = weekday[(new Date(splitDate[2], splitDate[0] - 1, splitDate[1])).getUTCDay()];

          // true false on bed wetting length
          var bedwet = wets.length >= 1;

          // add these arrays to the array that will be boards
          console.log('real: ' + nightName);
          nightData.push({ "day": nightName, "exited": exits, "enters": enters, "bedwet": wets, "sleep": sleep, "restTime": restTime, "restNum": restNum, "inBed": inBedTime, "dayLabel": dayOfWk, });

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




    //Set up boards for display view (take most recent numDisplay days)
    let numDisplay = 7;
    let displayData = []
    //if fewer data days than the user wants to display, only show available data
    if (dates.length <= numDisplay) {
      displayData = nightData
    //else show last numDisplay days
    } else {
      for (i = numDisplay; i>0; i--) {
        displayData.push(nightData[dates.length-i]);
      }
    }
    //Set state with all of newly processed variables
    this.setState({
      boards: nightData,
      displayBoards: displayData,
      dateDic: dates,
      picked: dates.length-1,
      isLoading: false, // update so components render
    });
  }


  render() {
    //Check there is data loaded
    if(this.state.isLoading){
      return(
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff"/>
        </View>
      )
    }
    //Needed to navigate to other pages from Home Screen
    const {navigate} = this.props.navigation;

    //Build text to display for bedwetting table
    let bedWetContent;
    if(this.state.boards[this.state.picked].bedwet.length > 0){
      let wetTime = new Date(this.state.boards[this.state.picked].bedwet[0]);
      bedWetContent = "Wet     " + wetTime.getHours() + ":" + (wetTime.getMinutes()<10?'0':'') + wetTime.getMinutes() ;
    }
    else {
      bedWetContent = "Dry";
    }

    //Weekly sleep average
    let sleepAVG = 0;
    for ( i = 0; i < this.state.displayBoards.length; i++){
      sleepAVG += this.state.displayBoards[i].sleep;
    }
    sleepAVG = sleepAVG/i;

    //Find weekly bedwetting sum and exits average
    let sumWets = 0;
    let avgExits = 0;
    for ( i=0; i<this.state.displayBoards.length; i++) {
      sumWets = sumWets + this.state.displayBoards[i].bedwet.length;
      avgExits = avgExits + this.state.displayBoards[i].exited.length-1;
    }
    sumWets = sumWets/(i);
    avgExits = avgExits/(i);

    //Find weekly restlessness average
    let avgTRestless = 0;
    let restCounter = 0;
    for ( i=0; i<this.state.displayBoards.length; i++) {
      for (j=0; j<this.state.displayBoards[i].restNum.length; j++) {
        avgTRestless = avgTRestless + this.state.displayBoards[i].restNum[j];
        restCounter++;
      }
    }
    avgTRestless = avgTRestless/(restCounter);

    //Set up qualitative descriptions of restlessness
    let restlessDescription = "";
    if (avgTRestless < 1.3) {
      restlessDescription = "Normal";
    } else if (avgTRestless < 1.75) {
      restlessDescription = "Moderate";
    } else {
      restlessDescription = "High";
    }

    //Set up day of week labels
    let weekLabels = [];
    for (i=0; i<this.state.displayBoards.length; i++) {
      weekLabels.push(this.state.displayBoards[i].dayLabel);
    }

    //Set up stack daily view sleep data
    let ySleep = [];
    let in_out = [];
    for (i=0; i<this.state.boards[this.state.picked].enters.length; i++) {
      //Set x and y data arrays
      if (this.state.boards[this.state.picked].exited[i]) {
        //For line graph
        in_out.push("1"); //1 represents in bed
        ySleep.push(new Date(this.state.boards[this.state.picked].enters[i]));
        in_out.push("0");
        ySleep.push(new Date(this.state.boards[this.state.picked].exited[i]));
      }
      if (i+1 < this.state.boards[this.state.picked].enters.length) {
        //For line graph
        in_out.push("0"); //0 represents out of bed
        ySleep.push(new Date(this.state.boards[this.state.picked].exited[i]));
        in_out.push("1");
        ySleep.push(new Date(this.state.boards[this.state.picked].enters[i+1]));
      }
    }

    let reports;
    if (this.state.day == 1){
      reports = (<DayDetail boards={this.state.boards}
      picked={this.state.picked}
      changePicked={this.changeDay}
      restlessDescription={restlessDescription}
      avgRestless={avgTRestless.toFixed(2)}/>);}
    else if (this.state.day == 2) {
      reports = (<SummaryDetail
      boards={this.state.displayBoards}
      sleepAVG={sleepAVG}
      restlessDescription={restlessDescription}
      avgRestless={avgTRestless.toFixed(2)}
      sumWets={sumWets}
      avgExits={avgExits.toFixed(1)}
      selectDay={this.goToDay}
      navigation={this.props.navigation}
    />);}
    else if (this.state.day == 3) {
      reports =
      (<AllDetail
        boards={this.state.boards}
        sleepAVG={sleepAVG.toFixed(2)}
        restlessDescription={restlessDescription}
        avgRestless={avgTRestless.toFixed(2)}
        sumWets={sumWets.toFixed(1)}
        avgExits={avgExits.toFixed(1)}
        selectDay={this.goToDay}
      />);}

    return (
      <ScrollView style={styles.container}>
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
          <Text style={styles.buttonText}>All</Text>
        </TouchableOpacity>
      </View>
      {this.state.picked}

      {reports}

      </ScrollView>
    );
  }
}

export default HomeScreen;
