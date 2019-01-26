import React, { Component } from 'react';
import { Alert, StyleSheet, ScrollView, Image, ActivityIndicator, View, TouchableOpacity, Text, TextInput } from 'react-native';
import { List, ListItem, Button, Icon } from 'react-native-elements';
import { VictoryBar, VictoryLine, VictoryChart, VictoryTheme, VictoryLabel, VictoryAxis, LineSegment } from 'victory-native';
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
          //Time between first enter and  last exit dates
          var first = new Date(enters[0]);
          var lastEx = new Date(exits[exits.length-1]);
          var dif = new Date((lastEx-first));
  // TODO: this is minutes --> switch to hours for full data
          var sleep = dif / (60*1000);

          // true false on bed wetting length
          var bedwet = wets.length >= 1;

          // add these arrays to the array that will be boards
          nightData.push({ "day": nightName, "exited": exits, "enters": enters, "bedwet": wets, "sleep": sleep, "restTime": restTime, "restNum": restNum,});
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

    return (
      //Display visual graphics
      <ScrollView style={styles.container}>
        <View style={styles.subContainer}>
          <Text style={styles.blackText}>{"\n"}Sleep History</Text>
          //Display line graph of all sleep time
          <VictoryChart
            animate={{ duration: 100 }}
            //helps so that chart is not cut off on right
            domainPadding={{ x : [30, 30] }}
          >
          <VictoryLine
            data={[
              { x: 0, y: sleepAVG },
              { x: this.state.boards.length , y: sleepAVG }
            ]}
            labels={["", 'Average \n'+sleepAVG.toFixed(2)]}
            style={{ labels: { textAlign: 'left', marginRight: 30} }}
            />
            <VictoryLine
              style={{
                data: { stroke: "#c43a31" },
                parent: { border: "1px solid #ccc"}
              }}
              data = {this.state.boards}
              x="day" y="sleep"
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
                label="Hours"
                style={{
                  axisLabel: { padding: 30},
                  fontSize: 16,
                  transform: [{ rotate: '90deg'}]
                }}
                fixLabelOverlap
              />
              </VictoryChart>

              //Text display
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
              <Text style={styles.brightText}>{avgTRestless.toFixed(2)}</Text>
              <Text style={styles.title}>Bedwets per Night</Text>
              <Text style={styles.brightText}>{avgTWets.toFixed(1)}</Text>
              <Text style={styles.title}>Exits per Night</Text>
              <Text style={styles.brightText}>{avgTExits.toFixed(1)}{"\n"}</Text>

              <View
                style={{
                  borderBottomColor: 'black',
                  borderBottomWidth: 1,
                }}
              />
              <Text style={styles.blackText}>{"\n"}National Data for 4 Year-Olds</Text>
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
              <VictoryChart
                domainPadding={80}
                animate={{ duration: 100 }}
                >
                <VictoryBar
                  categories={{
                    x: ["Your Child", "National Average"]
                  }}
                  data = {[
                    {x: "Your Child", y: avgTRestless.toFixed(2)},
                    {x: "National Average", y: 0.55}
                  ]}
                  style={{
                    data: { fill: "#c43a31" }
                  }}
                  labels={(d) => d.y}
                />
                <VictoryAxis dependentAxis tickFormat={() => ''} />
                <VictoryAxis independentAxis tickFormat={(x) => x} />
              </VictoryChart>
              <Text style={styles.title}>{"\n"}Bedwets per Night</Text>
              <VictoryChart
                domainPadding={80}
                animate={{ duration: 100 }}
                >
                <VictoryBar
                  categories={{
                    x: ["Your Child", "National Average"]
                  }}
                  data = {[
                    {x: "Your Child", y: avgTWets.toFixed(1)},
                    {x: "National Average", y: 0.7}
                  ]}
                  style={{
                    data: { fill: "#c43a31" }
                  }}
                  labels={(d) => d.y}
                />
                <VictoryAxis dependentAxis tickFormat={() => ''} />
                <VictoryAxis independentAxis tickFormat={(x) => x} />
              </VictoryChart>
              <Text style={styles.title}>{"\n"}Exits per Night</Text>
              <VictoryChart
                domainPadding={80}
                animate={{ duration: 100 }}
                >
                <VictoryBar
                  categories={{
                    x: ["Your Child", "National Average"]
                  }}
                  data = {[
                    {x: "Your Child", y: avgTExits.toFixed(1.2)},
                    {x: "National Average", y: 0.55}
                  ]}
                  style={{
                    data: { fill: "#c43a31" }
                  }}
                  labels={(d) => d.y}
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
    width: 15,
    height: 15,
    position: 'absolute',
    right: 7, // Keep some space between your left border and Image
  }
})

export default AllDetailScreen;
