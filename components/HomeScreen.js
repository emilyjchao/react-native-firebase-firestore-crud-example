import React, { Component } from 'react';
import { Alert, StyleSheet, ScrollView, ActivityIndicator, Image, View, TouchableOpacity, Text } from 'react-native';
import { List, ListItem, Button, Icon } from 'react-native-elements';
import { VictoryBar, VictoryLine, VictoryArea, VictoryChart, VictoryStack, VictoryScatter, VictoryTheme, VictoryAxis, LineSegment, VictoryLabel } from 'victory-native';
import firebase from '../Firebase';

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

        //Find day of week as label
        var weekday = new Array();
        weekday[0] = "Su";
        weekday[1] = "M";
        weekday[2] = "T";
        weekday[3] = "W";
        weekday[4] = "Th";
        weekday[5] = "F";
        weekday[6] = "S";
        splitDate= nightName.split("-");
        let dayOfWk = weekday[(new Date(splitDate[2], splitDate[0] - 1, splitDate[1])).getUTCDay()];

        // true false on bed wetting length
        var bedwet = wets.length >= 1;

        // add these arrays to the array that will be boards
        nightData.push({ "day": nightName, "exited": exits, "enters": enters, "bedwet": wets, "sleep": sleep, "restTime": restTime, "restNum": restNum, "inBed": inBedTime, "dayLabel": dayOfWk, });
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
    //Set state with all of newly processed variables
    this.setState({
      boards: nightData,
      weekBoards: weeklyData,
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
    for (i=0; i<this.state.weekBoards.length; i++) {
      weekLabels.push(this.state.weekBoards[i].dayLabel);
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

    // day View
    // Could become separate component
    const dayDetail = (
      <View>
      <Text style={styles.blackText}>{"\n"}{this.state.dateDic[this.state.picked]}</Text>
      <Text style={styles.title}>Time Asleep: {(this.state.boards[this.state.picked].sleep).toFixed(2)} hours</Text>
      //Chart of daily sleep length
      <VictoryChart
        height={130}
        scale={{ x: "time" }}
        //animate={{ duration: 10 }}
        >
        <VictoryArea
          data={ySleep, in_out}
          interpolation="step"
          style={{
            data: { stroke: "#c43a31", fill: "#c43a31" },
          }}
          />
        <VictoryAxis label="Time" style={{fontSize: 16, axisLabel: { padding: 30 }}}/>
        <VictoryAxis dependentAxis
          style={{
            axisLabel: { padding: 10},
            fontSize: 16,
            transform: [{ rotate: '90deg'}]
          }}
          tickFormat={() => ''}
          />
      </VictoryChart>
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
      //Line graph of restlessness
      <VictoryChart
        height={150}
        domainPadding={{ x : [20, 20] }}
        scale={{ x: "time" }}
        //animate={{ duration: 10 }}
        >
        <VictoryLine
          interpolation="natural"
          style={{
            data: { stroke: "#c43a31" },
          }}
          data = {this.state.boards[this.state.picked].restTime, this.state.boards[this.state.picked].restNum}
          />
        <VictoryAxis
          label={"Time"}
          //tickFormat={restlessXLabel}
          fixLabelOverlap
          />
        <VictoryAxis dependentAxis
          label="Low     High"
          style={{
            axisLabel: { padding: 10},
            fontSize: 16,
            transform: [{ rotate: '90deg'}]
          }}
          tickFormat={() => ''}
          />
      </VictoryChart>

      <View style={styles.appContainer}>
      <TouchableOpacity
        onPress={() => {Alert.alert('The Bedwet section shows the time of a bedwetting incident if there was one.')}}
        style={styles.button1}>
          <View style={styles.btnContainer}>
            <Text style={styles.title}>Bedwet</Text>
            <Image source={require('./about.png')} style={styles.icon} />
          </View>
        </TouchableOpacity>
      </View>
      <Text style={styles.brightText}>{bedWetContent}</Text>

      //Table for bed exits
      <View style={styles.appContainer}>
      <TouchableOpacity
        onPress={() => {Alert.alert('The Bed Exit section displays the time and duration of each time your child exited the bed.')}}
        style={styles.button1}>
          <View style={styles.btnContainer}>
            <Text style={styles.title}>Bed Exits</Text>
            <Image source={require('./about.png')} style={styles.icon} />
          </View>
        </TouchableOpacity>
      </View>
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
            var timeOut = dif / (3600000);

            return (
                <Text key={time} style={styles.brightTextLeft}>
                  {'                  '}{exitTime.getHours()}:{(exitTime.getMinutes()<10?'0':'') + exitTime.getMinutes() }{'           '}{Number(timeOut).toFixed(2)}
                </Text>
            );
            }
          })
        }
        </View>
      </View>);

    //Week detail (could be component)
    const weekDetail = (
      // Use this to draw average sleep line
      // <VictoryLine
      //   data={[
      //     { x: 0, y: weekAVG },
      //     { x: this.state.weekBoards.length, y: weekAVG }
      //   ]}
      //   labels={["", 'Average \n'+weekAVG.toFixed(2)]}
      //   style={{ labels: { textAlign: 'left', marginRight: 30, fontSize: 14, fontWeight: 'bold'} }}
      //   />

      <View>
        <View style={styles.appContainer}>
          <TouchableOpacity
            onPress={() => {Alert.alert('Click on any bar to see daily details.')}}
            style={styles.button1}>
            <View style={styles.btnContainer}>
              <Text style={styles.title}>Sleep History</Text>
              <Image source={require('./about.png')} style={styles.icon} />
            </View>
          </TouchableOpacity>
        </View>
        <VictoryChart
          minDomain={{x:0.5}}
          maxDomain={{x:8}}
          //animate={{ duration: 10 }}
          >
          <VictoryScatter
            data = {this.state.weekBoards}
            x="day" y="inBed"
            />
          <VictoryBar
            data = {this.state.weekBoards}
            x="day" y="sleep"
            labels={weekLabels}
            barRatio={.75}
            style={{
              data: { fill: "#c43a31"}, labels: { fill: "white" }
            }}
            labelComponent={<VictoryLabel dy={30}/>}
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
            data = {this.state.weekBoards}
            x="day" y="inBed"
            labels={["", "", "", "", "", "","Time in Bed"]}
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
        <Text style={styles.brightText}>{weekAVG.toFixed(2)}</Text>

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
        <Text style={styles.brightText}>{weekWets.toFixed(1)}</Text>

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
        <Text style={styles.brightText}>{weekExits.toFixed(1)}{'\n'}</Text>

        //Navigate to all details page
        <TouchableOpacity
          onPress={() => {navigate('AllDetails')}}
          style={styles.button1}>
            <View style={styles.btnContainer}>
              <Text style={styles.blueTextSmall}>View Full Data History</Text>
            </View>
          </TouchableOpacity>
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
    alignItems: 'center',
    borderRadius: 3,
    borderColor: 'black',
    borderWidth: 1,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 15,
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
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    marginTop: 15,
    marginBottom: 0,
    color: 'indigo',
  },
  brightText: {
    textAlign: 'center',
    fontSize: 24,
    color: 'firebrick',
  },
  brightTextLeft: {
    textAlign: 'left',
    fontSize: 24,
    color: 'firebrick',
    alignSelf: 'stretch',
  },
  blackText: {
    textAlign: 'center',
    fontSize: 24,
    color: 'black',
  },
  blueTextSmall: {
    textAlign: 'center',
    fontSize: 22,
    color: 'blue',
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

export default HomeScreen;
