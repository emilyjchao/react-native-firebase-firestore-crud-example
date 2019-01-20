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
      day: false,
      picked: 1,
      bedwet: '',
      enter: [],
      exit: []
    };
  }

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
    this.fetchData();

  }

  fetchData = async () => {
    //Get just one night of sleep
    //firebase.database().ref('1/').on('value', function (snapshot) {

    //Get all nights of sleep
    firebase.database().ref().on('value', function (snapshot) {

        console.log(snapshot.val())
    });
  }

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
    this.setState({
      boards: boards.sort((a,b) => { return(a.day - b.day) }),
      isLoading: false,
   });
  }

  render() {
    if(this.state.isLoading){
      return(
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff"/>
        </View>
      )
    }

    const dayDetail = (
      <View>
      <Text style={styles.title}>{this.state.boards[this.state.picked - 1].label}</Text>
      <VictoryChart
        theme={VictoryTheme.material}
        height={130}
        maxDomain={{x:12}}
        >
          <VictoryBar
// Fix this method of getting the specific day
            data={[this.state.boards[this.state.picked-1]]}
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
          <VictoryAxis/>
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
        //<Text style={styles.brightText}>{this.state.boards[this.state.picked - 1].restless}</Text>
        <Text style={styles.title}>Bedwet</Text>
        <Text style={styles.brightText}>{this.state.boards[this.state.picked - 1].bedwet ? "Unfortunately" : "Dry"}</Text>
        <Text style={styles.title}>Exits</Text>
        <Text style={styles.brightText}>{this.state.boards[this.state.picked - 1].exited}</Text>
      </View>);

    const weekDetail = (
      <View>
      <Text style={styles.title}>Time Sleeping</Text>
        <VictoryChart
        // adds grid lines (probably does more too)
        //theme={VictoryTheme.material}
        minDomain={{x:0.5}}
        maxDomain={{x:7}}
        >
          <VictoryBar
            data={this.state.boards}
            x="day" y="sleep"
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
                 this.setState({picked: data.datum.day});
                 console.log(this.state.picked)
                  return [
                    {
                      target: "data",
                    //   mutation: (props) => {
                    //     const fill = props.style && props.style.fill;
                    //     return fill === "black" ? null : { style: { fill: "black" } };
                    //   }
                    }
                  ];
                }
              }}]}
              />
        </VictoryChart>
        <Text style={styles.brightText}>{this.state.boards[this.state.picked - 1].label}</Text>
        <Text style={styles.title}>Restlessness</Text>
        <Text style={styles.brightText}>{this.state.boards[this.state.picked - 1].restless}</Text>
        <Text style={styles.title}>Bedwet</Text>
        <Text style={styles.brightText}>{this.state.boards[this.state.picked - 1].bedwet ? "Unfortunately" : "Dry"}</Text>
        <Text style={styles.title}>Exits</Text>
        // To make a nice simple table:
        // https://stackoverflow.com/questions/44357336/setting-up-a-table-layout-in-react-native
        <Text style={styles.brightText}>{this.state.boards[this.state.picked - 1].exited}</Text>
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
