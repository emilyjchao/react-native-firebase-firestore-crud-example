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
      isLoading: true,
      boards: [],
      weekBoards: [],
      picked: 0,
      dateDic: [],
      day: false,
    };
    this.onFetchData = this.onFetchData.bind(this);
  }

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
    this.fetchData();
  }

  //fetchData = async () => {
  fetchData() {
    firebase.database().ref().on('value', this.onFetchData);
  }

  onFetchData = (snapshot) => {
      let nightData = [];
      //console.log(snapshot.val());
      //console.log("IN onFetchData");
      let nights = [];
      let dates = [];
      let data = snapshot.val();

      // get the number of nights
      nights = Object.keys(data);
      //console.log(nights)
      nights.forEach(function(nightName) {
      //Use to index boards
      dates.push(nightName);

      let enters = [];
      let exits = [];
      let wets = [];
      const night = data[nightName];

      if (night["enters"])  {
        enters = Object.keys(night["enters"]).map( (key) => { return( night["enters"][key])});
      }
      if (night["exits"])  {
        exits  = Object.keys(night["exits"]).map( (key) => { return( night["exits"][key])});
      }
      if (night["wets"])  {
        wets = Object.keys(night["wets"]).map( (key) => { return( night["wets"][key])});
      }

      //Time between first enter and  last exit dates
      var first = new Date(enters[0]);
      var lastEx = new Date(exits[exits.length-1]);
      var dif = new Date((lastEx-first));
      var sleep = dif / (60*1000);

      // true false on bed wetting length
      var bedwet = wets.length >= 1;
      //console.log(dates)

      nightData.push({ "day": nightName, "label": (nightName), "exited": exits, "enters": enters, "bedwet": wets, "sleep": sleep, "restless": 0,});

    })

    //Set up boards for weekly view
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
      isLoading: false,

    });
    console.log("dateDic: " + this.state.dateDic);
  }


// OLD
// gets fake data from firestore on firebase
  onCollectionUpdate = (querySnapshot) => {
    let boards = [];
    //add the records to array
    querySnapshot.forEach((doc) => {
      const { day, sleep, label, bedwet, restless, exited } = doc.data();
      boards.push({
        key: doc.id,
        doc, // DocumentSnapshot
        day,
        sleep,
        label,
        bedwet,
        restless,
        exited,
      });
    });
    //store boards in state

// uncomment for Looks like prototype
// This is for the firestore data
  //console.log('Firestore \n'+boards);
   //  this.setState({
   //    boards: boards.sort((a,b) => { return(a.day - b.day) }),
   //    isLoading: false,
   // });

  }

  render() {
    if(this.state.isLoading){
      return(
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff"/>
        </View>
      )
    }

    let bedWetContent;
    if(this.state.boards[this.state.picked].bedwet.length > 0){
      let wetTime = new Date(this.state.boards[this.state.picked].bedwet[0]);
      bedWetContent = "Sadly  -  " + wetTime.getHours() + ":" + wetTime.getMinutes();
    }
    else {
      bedWetContent = "Dry";
    }

    let weekAVG = 0;
    for ( i = 0; i < this.state.boards.length; i++){
      weekAVG += this.state.boards[i].sleep;
      //console.log(this.state.boards[i].sleep);
    }
    weekAVG = weekAVG/i;
    //console.log(weekAVG);

    const dayDetail = (
      <View>
      // <Text style={styles.title}>{this.state.boards[this.state.picked].label}</Text>
      <Text style={styles.title}>Time Sleeping</Text>
      <VictoryChart
        theme={VictoryTheme.material}
        height={130}
        maxDomain={{x:12}}
        animate={{ duration: 2000 }}

        >
          <VictoryBar
// Fix this method of getting the specific day
            data={[{day: this.state.picked, "sleep": 8.5}]}
            barWidth={20} x="day" y="sleep"
            horizontal={true}
            style={{ data: { fill: "#c43a31" } }}
            events={[{
              target: "data",
              eventHandlers: {
               onPressIn: () => {
                  return [
                    {
                      target: "data",
                      // mutation: (props) => {
                      //   const fill = props.style && props.style.fill;
                      //   return fill === "black" ? null : { style: { fill: "black" } };
                      // }
                    }
                  ];
                }
              }}]}
            />
          <VictoryAxis label="Hours" style={{fontSize: 16, axisLabel: { padding: 30 }}}/>
          {/*<VictoryBar
// Fix this method of getting the specific day
            data={[this.state.boards[this.state.picked]]}
            barWidth={20} x="day" y="sleep"
            horizontal={true}
            style={{ data: { fill: "#c43a31" } }}
            events={[{
              target: "data",
              eventHandlers: {
               onPressIn: () => {
                  return [
                    {
                      target: "data",
                      // mutation: (props) => {
                      //   const fill = props.style && props.style.fill;
                      //   return fill === "black" ? null : { style: { fill: "black" } };
                      // }
                    }
                  ];
                }
              }}]}
            />
          <VictoryAxis/>*/}
        </VictoryChart>
        <Text style={styles.title}>Restlessness</Text>
        <VictoryChart
          theme={VictoryTheme.material}
          height={130}>
          <VictoryLine
            data={[
              { x: 1, y: 2 },
              { x: 2, y: 3 },
              { x: 3, y: 5 },
              { x: 4, y: 4 },
              { x: 5, y: 7 }
            ]}/>
          <VictoryAxis/>
        </VictoryChart>
        {/*<Text style={styles.brightText}>{this.state.boards[this.state.picked].restless}</Text>*/}
        <Text style={styles.title}>Bedwet</Text>
        <Text style={styles.brightText}>{bedWetContent}</Text>
        <Text style={styles.title}>Exited Bed</Text>
        <Text style={styles.brightText}>Time{'\t\t'}Length</Text>
        // To make a nice simple table:
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
                  <Text key={time} style={styles.brightText}>{exitTime.getHours()}:{exitTime.getMinutes()}{'  -  '}{Number(timeOut).toFixed(2)}</Text>
                );
                }
              })
            }
        </View>
      </View>);

    const weekDetail = (
      <View>
      <Text style={styles.title}>Time Sleeping</Text>

        <VictoryChart
        // adds grid lines (probably does more too)
        //theme={VictoryTheme.material}
        minDomain={{x:0.5}}
        maxDomain={{x:7}}
        animate={{ duration: 500 }}
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
                 //console.log(this.state.dateDic.indexOf(data.datum.day))
                 this.setState({picked: this.state.dateDic.indexOf(data.datum.day), day: true});

                 return [
                  {
                    target: "data",
                    //  mutation: (props) => {
                    //    const fill = props.style && props.style.fill;
                    //    return fill === "black" ? null : { style: { fill: "black" } };
                    // }
                  }
                ];
              }
            }}]}
            />
            <VictoryLine
              data={[
                { x: 0, y: weekAVG },
                { x: this.state.boards.length + 1, y: weekAVG }
              ]}
              labels={["", `Average \n`+weekAVG.toFixed(2)]}
              />
              <VictoryAxis
                label="Day"
                style={{
                  axisLabel: { padding: 30 },
                  fontSize: 16,
                }}
              />
              <VictoryAxis dependentAxis
                label="Hours"
                style={{
                  axisLabel: { padding: 30},
                  fontSize: 16,
                  transform: [{ rotate: '90deg'}]
                }}
              />
        </VictoryChart>
        <Text style={styles.brightText}>This Week</Text>
        <Text style={styles.title}>Restlessness Average</Text>
        {/*<Text style={styles.brightText}>{this.state.boards[this.state.picked].restless}</Text>*/}
        <Text style={styles.brightText}>1.54</Text>
        <Text style={styles.title}>Bedwets</Text>
        <Text style={styles.brightText}>3</Text>
        <Text style={styles.title}>Exits per Night</Text>
        <Text style={styles.brightText}>6</Text>
        {/*<Text style={styles.brightText}>Time{'\t\t'}Length</Text>
        // To make a nice simple table:
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
                <Text key={time} style={styles.brightText}>{exitTime.getHours()}:{exitTime.getMinutes()}{'  -  '}{Number(timeOut).toFixed(2)}</Text>
              );
              }
              })
            }
        </View>*/}
      </View>);

    const reports = this.state.day ? (dayDetail) : (weekDetail);

    return (
      <ScrollView style={styles.container}>
      <TouchableOpacity
        onPress = {()=> this.setState(prevState => ({day: !prevState.day}))}
        style={styles.button}>
        <Text style={styles.buttonText}>{this.state.day ? "Day" : "Week"}</Text>
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
  textInput: {
    fontSize: 24,
  }
})

export default HomeScreen;
