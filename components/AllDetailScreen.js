import React, { Component } from 'react';
import { Alert, StyleSheet, ScrollView, Image, ActivityIndicator, View, TouchableOpacity, Text, TextInput } from 'react-native';
import { List, ListItem, Button, Icon } from 'react-native-elements';
import { VictoryBar, VictoryLine, VictoryChart, VictoryZoomContainer, VictoryScatter, VictoryTheme, VictoryLabel, VictoryAxis, LineSegment } from 'victory-native';
import firebase from '../Firebase';

class AllDetailScreen extends Component {
  static navigationOptions = {
    title: 'Sleep Record' // Enable app header and use 'Sleep Record' as the label
  }
  constructor(props) {
    super();
    this.ref = firebase.firestore().collection('days');
    this.unsubscribe = null;
    this.state = {
      isLoading: true,  // check for whether initial data has been received
      boards: [],       // full list of all nights data
      dateDic: [],      // dictionary of all the dates --> to speed finding  a specific night's index
    };
    this.onFetchData = this.onFetchData.bind(this);
  }

  componentDidMount() {
    // Realtime database connection
    this.fetchData();
  }

  //wrapper so that state can be set from onFetchData
  fetchData() {
    firebase.database().ref().on('value', this.onFetchData);
  }

  // process the incoming data
  onFetchData = (snapshot) => {
      let nightData = [];
      let nights = [];
      let dates = [];
      let data = snapshot.val();

      // get the number of nights
      nights = Object.keys(data);

      //clean non mm-dd-yyyy keys from nights
      let splitDate = "";
      for (i=0; i<nights.length; i++){
        //Check that key is in date format with two '-'
        if (nights[i].split("-").length - 1 == 2) {
          splitDate= nights[i].split("-");
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
      dates.sort(date_sort_asc);

      //convert nights keys back to mm-dd-yyyy strings
      for (i=0; i<nights.length; i++){
        nights[i] = (nights[i].getMonth() + 1) + '-' + nights[i].getDate() + '-' +  nights[i].getFullYear();
      }

      //Loop through each night
      nights.forEach(function(nightName) {
       if (nightName != 'Profile' && nightName != 'current_time') {
          //Save each date to index boards
          dates.push(nightName);

          // initialize arrays for data
          let enters = [];
          let exits = [];
          let restless = [];
          let wets = [];
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
          //Split timestamp from restlessness rating
          let restTime = [];
          let restNum = [];
          for (i=0; i<restless.length; i++) {
            restlessSplit = restless[i].toString().split(" ")
            restTime.push(parseInt(restlessSplit[0], 10));
            restNum.push(parseInt(restlessSplit[1], 10));
          }

  // TODO: more accurate processing of sleep and awake time
          //Calculate time between first enter and last exit dates (time in bed)
          var exit1 = new Date(enters[0]);
          var exit2 = new Date(exits[exits.length-1]);
          var inBedDiff = new Date((exit2-exit1));
          //Calculate time in bed (from first enter to last exit)
          var inBedTime = 0;
          if (inBedDiff) {
            inBedTime = inBedDiff / (3600000);
          }

          //Loop through exits and calculate sleep time (time in bed accounting for exits)
          var sleep = 0;
          for (i=0; i<enters.length; i++){
            var inTime = new Date(enters[i]);
            var outTime = new Date(exits[i]);
            var timeIn = new Date(outTime-inTime) / (3600000);
            //Add time in bed between each entrance and exit to sleep
            if (timeIn) {
              sleep += timeIn;
            }
          }

          // true false on bed wetting length
          var bedwet = wets.length >= 1;

          // add these arrays to the array that will be boards
          nightData.push({ "day": nightName, "exited": exits, "enters": enters, "bedwet": wets, "sleep": sleep, "restTime": restTime, "restNum": restNum, "inBed": inBedTime,});
        }
    })
    //Set state with processed variables
    this.setState({
      boards: nightData,
      dateDic: dates,
      isLoading: false, // update so components render

    });
  }


  render() {

    // check there is data loaded
    if(this.state.isLoading){
      return(
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff"/>
        </View>
      )
    }

    //Find weekly sleep average
    let sleepAVG = 0;
    for ( i = 0; i < this.state.boards.length; i++){
      sleepAVG += this.state.boards[i].sleep;
    }
    sleepAVG = sleepAVG/i;

    //Find bedwetting average
    let avgTWets = 0;
    for ( i=0; i<this.state.boards.length; i++) {
      avgTWets = avgTWets + this.state.boards[i].bedwet.length;
    }
    avgTWets = avgTWets/(i);

    //Find bed exit average
    let avgTExits = 0;
    for ( i=0; i<this.state.boards.length; i++) {
     avgTExits = avgTExits + this.state.boards[i].exited.length-1;
    }
    avgTExits = avgTExits/(i);

    //Find restlessness average
    let avgTRestless = 0;
    let restCounter = 0;
    for ( i=0; i<this.state.boards.length; i++) {
      for (j=0; j<this.state.boards[i].restNum.length; j++) {
        avgTRestless = avgTRestless + this.state.boards[i].restNum[j];
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

    //Set up bar chart labels
    let dateLabels = [];
    for (i=0; i<this.state.boards.length-1; i++) {
      dateLabels.push("");
    }
    dateLabels.push("Time In \n Bed");

    return (
      //Display visual graphics
      <ScrollView style={styles.container}>
        <View style={styles.subContainer}>
          <Text style={styles.blackText}>{"\n"}Sleep History</Text>
          //Display line graph of all sleep time
          <VictoryChart
            //animate={{ duration: 10 }}
            //helps so that chart is not cut off on right
            domainPadding={{ x : [30, 30] }}
            containerComponent={
                <VictoryZoomContainer/>
              }
          >
            <VictoryBar
              data = {this.state.boards}
              x="day" y="sleep"
              barRatio={.75}
              style={{
                data: { fill: "#c43a31"}
              }}
              />
            <VictoryLine
              data = {this.state.boards}
              x="day" y="inBed"
              labels={dateLabels}
              style={{ labels: { textAlign: 'left', marginRight: 30} }}
              />
              <VictoryScatter
                data = {this.state.boards}
                x="day" y="inBed"
                />
              <VictoryAxis
                label="Day"
                style={{
                  axisLabel: { padding: 30 },
                  fontSize: 16,
                }}
                fixLabelOverlap
              />
              <VictoryAxis dependentAxis
                label="Hours of Sleep"
                style={{
                  axisLabel: { padding: 35},
                  fontSize: 16,
                  transform: [{ rotate: '90deg'}]
                }}
                fixLabelOverlap
              />
              </VictoryChart>
              <View style={styles.appContainer}>
              <TouchableOpacity
                onPress={() => {Alert.alert('This is the average number of hours your child slept this week. Your child should aim to sleep 10 hours a night.')}}
                style={styles.button1}>
                  <View style={styles.btnContainer}>
                    <Text style={styles.title}>Average Hours of Sleep</Text>
                    <Image source={require('./about.png')} style={styles.icon} />
                  </View>
                </TouchableOpacity>
              </View>
              <Text style={styles.brightText}>{sleepAVG.toFixed(2)}</Text>

              <View style={styles.appContainer}>
              <TouchableOpacity
                onPress={() => {Alert.alert('Restlessness is rated on a score of 0 to 2. 0 corresponds to low movement, 1 to moderate movement, and 2 to high movement. Some restlessness is normal.')}}
                style={styles.button1}>
                  <View style={styles.btnContainer}>
                    <Text style={styles.title}>Restlessness</Text>
                    <Image source={require('./about.png')} style={styles.icon} />
                  </View>
                </TouchableOpacity>
              </View>
              <Text style={styles.brightText}>{restlessDescription} - {avgTRestless.toFixed(2)}</Text>

              <View style={styles.appContainer}>
              <TouchableOpacity
                onPress={() => {Alert.alert('This is the average number of times your child wet the bed per night this week.')}}
                style={styles.button1}>
                  <View style={styles.btnContainer}>
                    <Text style={styles.title}>Bedwetting Average</Text>
                    <Image source={require('./about.png')} style={styles.icon} />
                  </View>
                </TouchableOpacity>
              </View>
              <Text style={styles.brightText}>{avgTWets.toFixed(1)}</Text>

              <View style={styles.appContainer}>
              <TouchableOpacity
                onPress={() => {Alert.alert('This is the average number of times your child left the bed per night this week.')}}
                style={styles.button1}>
                  <View style={styles.btnContainer}>
                    <Text style={styles.title}>Exits</Text>
                    <Image source={require('./about.png')} style={styles.icon} />
                  </View>
                </TouchableOpacity>
              </View>
              <Text style={styles.brightText}>{avgTExits.toFixed(1)}{"\n"}</Text>

              <View
                style={{
                  borderBottomColor: 'black',
                  borderBottomWidth: 1,
                }}
              />
              <Text style={styles.blackText}>{"\n"}National Data for 4 Year-Olds</Text>
              sleepAVG.toFixed(2)
              <VictoryChart
                domainPadding={80}
                //animate={{ duration: 10 }}
                >
                <VictoryLabel text="Total Hours of Sleep" x={245} y={30} textAnchor="end" />
                <VictoryBar
                  barRatio={0.8}
                  categories={{
                    x: ["Your Child", "National Average"]
                  }}
                  data = {[
                    {x: "Your Child", y: sleepAVG.toFixed(2)},
                    {x: "National Average", y: 1.4}
                  ]}
                  style={{
                    data: { fill: "#c43a31", fill: (d) => d.x === "National Average" ? "#000000" : "#c43a31", }, labels: { fill: "white" }
                  }}
                  labels={(d) => d.y}
                  labelComponent={<VictoryLabel dy={30}/>}
                />
                <VictoryAxis dependentAxis tickFormat={() => ''} />
                <VictoryAxis independentAxis tickFormat={(x) => x} />
              </VictoryChart>
              <VictoryChart
                domainPadding={80}
                //animate={{ duration: 10 }}
                >
                <VictoryLabel text="Restlessness" x={225} y={30} textAnchor="end" />
                <VictoryBar
                  barRatio={0.8}
                  categories={{
                    x: ["Your Child", "National Average"]
                  }}
                  data = {[
                    {x: "Your Child", y: avgTRestless.toFixed(2)},
                    {x: "National Average", y: 0.55}
                  ]}
                  style={{
                    data: { fill: "#c43a31", fill: (d) => d.x === "National Average" ? "#000000" : "#c43a31", }, labels: { fill: "white" }
                  }}
                  labels={(d) => d.y}
                  labelComponent={<VictoryLabel dy={30}/>}
                />
                <VictoryAxis dependentAxis tickFormat={() => ''} />
                <VictoryAxis independentAxis tickFormat={(x) => x} />
              </VictoryChart>
              <VictoryChart
                domainPadding={80}
                //animate={{ duration: 10 }}
                >
                <VictoryLabel text="Bedwets Per Night" x={200} y={30} textAnchor="middle"/>
                <VictoryBar
                  barRatio={0.8}
                  categories={{
                    x: ["Your Child", "National Average"]
                  }}
                  data = {[
                    {x: "Your Child", y: avgTWets.toFixed(1)},
                    {x: "National Average", y: 0.7}
                  ]}
                  style={{
                    data: { fill: "#c43a31", fill: (d) => d.x === "National Average" ? "#000000" : "#c43a31", }, labels: { fill: "white" }
                  }}
                  labels={(d) => d.y}
                  labelComponent={<VictoryLabel dy={30}/>}
                />
                <VictoryAxis dependentAxis tickFormat={() => ''} />
                <VictoryAxis independentAxis tickFormat={(x) => x} />
              </VictoryChart>
              <VictoryChart
                domainPadding={80}
                //animate={{ duration: 10 }}
                >
                <VictoryLabel text="Bed Exits Per Night" x={250} y={30} fontSize={60} textAnchor="end"/>
                <VictoryBar
                  barRatio={0.8}
                  categories={{
                    x: ["Your Child", "National Average"]
                  }}
                  data = {[
                    {x: "Your Child", y: avgTExits.toFixed(1.2)},
                    {x: "National Average", y: 0.55}
                  ]}
                  style={{
                    data: { fill: "#c43a31", fill: (d) => d.x === "National Average" ? "#000000" : "#c43a31", }, labels: { fill: "white" }
                  }}
                  labels={(d) => d.y}
                  labelComponent={<VictoryLabel dy={30}/>}
                />
                <VictoryAxis dependentAxis tickFormat={() => ''} />
                <VictoryAxis independentAxis tickFormat={(x) => x} />
              </VictoryChart>

          />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnContainer: {
    paddingHorizontal: 30,
    paddingVertical: 0,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'transparent',
  },
  button1: {
    flex: 1,
    borderRadius: 3,
    borderColor: 'transparent',
    borderWidth: 1,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 15,
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
  textInput: {
    fontSize: 24,
  },
  icon: {
    width: 10,
    height: 10,
    position: 'absolute',
    right: 15, // Keep some space between your left border and Image
  }
})

export default AllDetailScreen;
