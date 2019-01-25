import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View, TouchableOpacity, Text } from 'react-native';
import { List, ListItem, Button, Icon } from 'react-native-elements';
import { VictoryBar, VictoryLine, VictoryChart, VictoryTheme, VictoryAxis, LineSegment } from 'victory-native';
import firebase from '../Firebase';

class HomeScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Sleep Report',
      headerRight: (
        <Button
          buttonStyle={{ padding: 0, backgroundColor: 'transparent' }}
          icon={{ name: 'settings', style: { marginRight: 0, fontSize: 28 } }}
          onPress={() => { navigation.push('Settings') }}
        />
      ),
      headerLeft: (
        <Button
          buttonStyle={{ padding: 0, backgroundColor: 'transparent' }}
          icon={{ name: 'add', style: { marginRight: 0, fontSize: 28 } }}
          onPress={() => { navigation.push('AddChild') }}
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
      weekBoards: [],   // the last week of nights
      picked: 0,        // the index in boards of the currently selected night
      dateDic: [],      // dictionary of all the dates --> to speed finding  a specific night's index
      day: false,       // day v. week view --> should  be removed if using separate components
    };
    this.onFetchData = this.onFetchData.bind(this);
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

  // process the incoming data
  onFetchData = (snapshot) => {
    let nightData = [];
    let nights = [];
    let dates = [];
    let data = snapshot.val();

    // get the number of nights
    nights = Object.keys(data);

    nights.forEach(function(nightName) {
      if (nightName != 'Profile' && nightName != 'current_time') {
        //Use to index boards
        dates.push(nightName);

        // initialize arrays for data
        let enters = [];
        let exits = [];
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
        //Split timestamp from restlessness rating
        let restTime = [];  //time in day/hr/min/set
        let restNum = [];   //movement on scale 0-2
        for (i=0; i<restless.length; i++) {
          restlessSplit = restless[i].toString().split(" ")
          restTime.push(new Date(parseInt(restlessSplit[0], 10)));
          restNum.push(parseInt(restlessSplit[1], 10));
        }
        //console.log(restTime);
        //console.log(restNum);


// TODO: more accurate processing of sleep and awake time
        //Time between first enter and  last exit dates
        var first = new Date(enters[0]);
        var lastEx = new Date(exits[exits.length-1]);
        var dif = new Date((lastEx-first));
// TODO: this is minutes --> switch to hours for full data
        var sleep = dif / (60*1000);

        // true false on bed wetting length
        var bedwet = wets.length >= 1;
        //console.log(dates)

        // add these arrays to the array that will be boards
        nightData.push({ "day": nightName, "exited": exits, "enters": enters, "bedwet": wets, "sleep": sleep, "restTime": restTime, "restNum": restNum,});
      }
    })

    //Set up boards for weekly view (take most recent 7 days)
    let weeklyData = []
    if (dates.length <= 7) {
      weeklyData = nightData
    } else {
      weeklyData = [nightData[dates.length-7],
                    nightData[dates.length-6],
                    nightData[dates.length-5],
                    nightData[dates.length-4],
                    nightData[dates.length-3],
                    nightData[dates.length-2],
                    nightData[dates.length-1]];
    }

    this.setState({
      boards: nightData,
      weekBoards: weeklyData,
      dateDic: dates,
      picked: dates.length-7,
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
    //Needed to naviaget to other pages from Home Screen
    const {navigate} = this.props.navigation;

    // Build text to display for bedwetting table
    let bedWetContent;
    if(this.state.boards[this.state.picked].bedwet.length > 0){
      let wetTime = new Date(this.state.boards[this.state.picked].bedwet[0]);
      bedWetContent = "Sadly     " + wetTime.getHours() + ":" + (wetTime.getMinutes()<10?'0':'') + wetTime.getMinutes() ;
    }
    else {
      bedWetContent = "Dry";
    }

    // weekly sleep average
    let weekAVG = 0;
    for ( i = 0; i < this.state.weekBoards.length; i++){
      weekAVG += this.state.weekBoards[i].sleep;
    }
    weekAVG = weekAVG/i;

    //Find weekly bedwetting average
    let weekWets = 0;
    for ( i=0; i<this.state.weekBoards.length; i++) {
      weekWets = weekWets + this.state.weekBoards[i].bedwet.length;
    }
    weekWets = weekWets/(i);

    //Find weekly bed exit Average
    let weekExits = 0;
    for ( i=0; i<this.state.weekBoards.length; i++) {
     weekExits = weekExits + this.state.weekBoards[i].exited.length-1;
    }
    weekExits = weekExits/(i);

    //Find weekly restlessness average
    let avgTRestless = 0;
    let restCounter = 0;
    for ( i=0; i<this.state.weekBoards.length; i++) {
      for (j=0; j<this.state.weekBoards[i].restNum.length; j++) {
        avgTRestless = avgTRestless + this.state.weekBoards[i].restNum[j];
        restCounter++;
      }
    }
    avgTRestless = avgTRestless/(restCounter);

    //Set up labels for restless graph
    let restlessLabel = [];
    for (i=0; i<this.state.boards[this.state.picked].restTime.length; i++) {
      restlessLabel.push(this.state.boards[this.state.picked].restTime[i].getHours() + ':' + this.state.boards[this.state.picked].restTime[i].getMinutes())
    }
    let restlineLabels = [restlessLabel[0], restlessLabel[parseInt((restlessLabel.length-1)/2, 10)], restlessLabel[restlessLabel.length-1]];

    // day View
    // Could become separate component
    const dayDetail = (
      <View>
      <Text style={styles.blackText}>{"\n"}{this.state.dateDic[this.state.picked]}</Text>
      <Text style={styles.title}>Time Sleeping</Text>
      <VictoryChart
        height={130}
        animate={{ duration: 100 }}
        >
          <VictoryBar
            data={[this.state.boards[this.state.picked]]}
            barWidth={20} x="day" y="sleep"
            horizontal={true}
            style={{ data: { fill: "#c43a31" } }}
            events={[{
              target: "data",
              eventHandlers: {
               onPressIn: () => {
                  return [{ target: "data",}];
                }
              }}]}
            />
          <VictoryAxis label="Hours" style={{fontSize: 16, axisLabel: { padding: 30 }}}/>
      </VictoryChart>
      <Text style={styles.title}>Restlessness</Text>
// TODO: use real restlessness data
      <VictoryChart
        height={150}
        animate={{ duration: 100 }} >
        <VictoryAxis label="Time" style={{fontSize: 16, axisLabel: { padding: 10 }}}
          tickFormat={() => ''}
          //Uncomment below to show time labels on x-axis (currently stops line from showing up)
          //tickFormat={restlineLabels}
          fixLabelOverlap
          />
        <VictoryAxis dependentAxis
          tickFormat={["Low", "High"]}
          style={{tickLabels: { padding: 10 }}}
          />
        <VictoryLine
          style={{
            data: { stroke: "#c43a31" },
          }}
          data={this.state.boards[this.state.picked].restNum}
        />
      </VictoryChart>
      <Text style={styles.title}>Bedwet</Text>
      <Text style={styles.brightText}>{bedWetContent}</Text>
      <Text style={styles.title}>{"\n"}Exited Bed</Text>
      <Text style={styles.brightText}>Time{'\t\t'}  Minutes</Text>
      // This code for rendering table is from:
      // https://stackoverflow.com/questions/44357336/setting-up-a-table-layout-in-react-native
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {
          this.state.boards[this.state.picked].exited.map((time, index) => { // This will render a row for each data element.
            if (index != this.state.boards[this.state.picked].exited.length-1){
            var exitTime = new Date(time);
            var enterTime = new Date(this.state.boards[this.state.picked].enters[index + 1]);
            var dif = new Date(enterTime-exitTime);
            var timeOut = dif / (60*1000);

            return (
              <Text key={time} style={styles.brightText}>{exitTime.getHours()}:{(exitTime.getMinutes()<10?'0':'') + exitTime.getMinutes() }{'       '}{Number(timeOut).toFixed(2)}</Text>
            );
            }
          })
        }
        </View>
      </View>);

    const weekDetail = (
      <View>
        <VictoryChart
          minDomain={{x:0.5}}
          maxDomain={{x:8}}
          animate={{ duration: 100 }}
          >
          <VictoryBar
            data = {this.state.weekBoards}
            x="day" y="sleep"
            barRatio={.75}
            style={{
              data: { fill: "#c43a31" }
            }}
            events={[{
              target: "data",
              eventHandlers: {
              onPressIn: (event, data) => {
              // Navigate from click
                 //this.props.navigation.push('Settings');
                 //access the data point
                 this.setState({picked: this.state.dateDic.indexOf(data.datum.day), day: true});
                 return [{target: "data",}];
               }
             }}]}
            />
            <VictoryLine
              data={[
                { x: 0, y: weekAVG },
                { x: this.state.weekBoards.length , y: weekAVG }
              ]}
              labels={["", 'Average \n'+weekAVG.toFixed(2)]}
              style={{ labels: { textAlign: 'left', marginRight: 30} }}
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
        <Text style={styles.brightText}>{"\n"}This Week</Text>
        <Text style={styles.title}>Average Restlessness</Text>
        <Text style={styles.brightText}>{avgTRestless.toFixed(2)}</Text>
        <Text style={styles.title}>Bedwets per Night</Text>
        <Text style={styles.brightText}>{weekWets.toFixed(1)}</Text>
        <Text style={styles.title}>Exits per Night</Text>
        <Text style={styles.brightText}>{weekExits.toFixed(1)}</Text>

        //Navigate to all details page
        <Button
          style={styles.button}
          onPress={() => navigate('AllDetails')}
          title="View Data Details"
          buttonStyle={{ padding: 10, backgroundColor: 'transparent'}}
          color="black"
        />
      </View>);

    const reports = this.state.day ? (dayDetail) : (weekDetail);

    return (
      <ScrollView style={styles.container}>
      <TouchableOpacity
        onPress = {()=> this.setState(prevState => ({day: !prevState.day}))}
        style={styles.button}>
        <Text style={styles.buttonText}>{this.state.day ? "Return to Week" : "Week"}</Text>
        </TouchableOpacity>
          {reports}
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

export default HomeScreen;
