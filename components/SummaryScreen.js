import React, { Component } from 'react';
import { Alert, StyleSheet, ScrollView, ActivityIndicator, Image, View, TouchableOpacity, Text } from 'react-native';
import { List, ListItem, Button, Icon } from 'react-native-elements';
import { VictoryBar, VictoryLine, VictoryArea, VictoryChart, VictoryStack, VictoryScatter, VictoryTheme, VictoryAxis, LineSegment, VictoryLabel } from 'victory-native';
import styles from './style';


class SummaryDetail extends Component {
  static navigationOptions = ({ navigation }) => {}

  constructor(){
    super();
  }

  render() {

    const {navigate} = this.props.navigation;
    //Set up graph labels
    //Set up day of week labels
    let weekLabels = [];
    for (i=0; i<this.props.boards.length; i++) {
      weekLabels.push(this.props.boards[i].dayLabel);
    }
    //Set up date mm/dd labels
    let dateLabels = [];
    for (i=0; i<this.props.boards.length; i++) {
      splitDate = this.props.boards[i].day.split("-");
      dateLabels.push(splitDate[0] + '/' + splitDate[1]);
    }


    return(
      <View>
        <View style={styles.appContainer}>
          <Text>{"\n"}</Text>
          <TouchableOpacity
            onPress={() => {Alert.alert('Click on any bar to see daily details. The bars represent the hours your child slept each night, and the black line represents the number of hours your child spent in bed each night.')}}
            style={styles.button1}>
            <View style={styles.btnContainer}>
              <Text style={styles.title}>Sleep History</Text>
              <Image source={require('./about.png')} style={styles.icon} />
            </View>
          </TouchableOpacity>
        </View>
        <VictoryChart
          domainPadding={{ x: 15 }}
          //minDomain={{x:0.5}}
          //maxDomain={{x:8}}
          //animate={{ duration: 10 }}
          >
          <VictoryScatter
            data = {this.props.boards}
            x="dateLabel" y="inBed"
            />
          <VictoryBar
            data = {this.props.boards}
            x="dateLabel" y="sleep"
            labels={weekLabels}
            barRatio={.75}
            style={{
              data: { fill: "steelblue"}, labels: { fill: "white" }
            }}
            labelComponent={<VictoryLabel dy={30}/>}
            events={[{
              target: "data",
              eventHandlers: {
              onPressIn: (event, data) => {
                 this.props.selectDay(data.datum.day);
                 return [{target: "data",}];
               }
             }}]}
            />
          <VictoryLine
            data = {this.props.boards}
            x="dateLabel" y="inBed"
            style={{ labels: { textAlign: 'left', marginRight: 30, alignSelf: 'bottom', fontSize: 20} }}
            />
          <VictoryAxis
            label={"Day"}
            style={{
              axisLabel: { padding: 30, fontSize: 18 },
            }}
            fixLabelOverlap
            />
          <VictoryAxis dependentAxis
            label="Hours of Sleep"
            style={{
              axisLabel: { fontSize: 18 },
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
        <Text style={styles.brightText}>{this.props.sleepAVG}</Text>

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
        <Text style={styles.brightText}>{this.props.restlessDescription} : {this.props.avgRestless}</Text>

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
        <Text style={styles.brightText}>{this.props.sumWets}</Text>

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
        <Text style={styles.brightText}>{this.props.avgExits}{'\n'}</Text>

      </View>);
    }
  }

export default SummaryDetail;
