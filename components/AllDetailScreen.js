import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View, TouchableOpacity, Text, TextInput } from 'react-native';
import { List, ListItem, Button, Icon } from 'react-native-elements';
import { VictoryBar, VictoryLine, VictoryChart, VictoryTheme, VictoryAxis, LineSegment } from 'victory-native';
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

      nights.forEach(function(nightName) {
       if (nightName != 'Profile') {
          //Use to index boards
          dates.push(nightName);

          // initialize arrays for data
          let enters = [];
          let exits = [];
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
          nightData.push({ "day": nightName, "exited": exits, "enters": enters, "bedwet": wets, "sleep": sleep, "restless": 0,});
        }
    })

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

    // weekly sleep average
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

    //Find weekly bed exit Average
    let avgTExits = 0;
    for ( i=0; i<this.state.boards.length; i++) {
     avgTExits = avgTExits + this.state.boards[i].exited.length-1;
    }
    avgTExits = avgTExits/(i);

    return (
      <ScrollView style={styles.container}>
        <View style={styles.subContainer}>
          <Text style={styles.blackText}>{"\n"}Sleep History</Text>
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

              <Text style={styles.title}>{"\n"}Average Restlessness</Text>
              <Text style={styles.brightText}>1.54</Text>
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
              <Text style={styles.title}>{"\n"}Restlessness</Text>
              <Text style={styles.brightText}>??</Text>
              <Text style={styles.title}>Bedwets per Night</Text>
              <Text style={styles.brightText}>??</Text>
              <Text style={styles.title}>Exits per Night</Text>
              <Text style={styles.brightText}>??</Text>

          />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
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
  }
})

export default AllDetailScreen;
