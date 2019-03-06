import React, { Component } from 'react';
import { Alert, StyleSheet, ScrollView, ActivityIndicator, Image, View, TouchableOpacity, Text } from 'react-native';
import { List, ListItem, Button, Icon } from 'react-native-elements';
import { VictoryBar, VictoryLine, VictoryLegend, VictoryArea, VictoryChart, VictoryStack, VictoryScatter, VictoryTheme, VictoryAxis, LineSegment, VictoryLabel, VictoryCandlestick } from 'victory-native';
import styles from './style';
import colors from './colors';

//Renders visualization for week page
class WeekDetail extends Component {
  static navigationOptions = ({ navigation }) => {}

  constructor(){
    super();
    this.state = {
      picked: 0, // Holds index of day shown in summary button on top of sleep graphics
                    //Use to view the details of clicked day
    }
  }

  render() {

    const {navigate} = this.props.navigation;
    //Set up graph labels
    //weekLabels holds day of week labels (dayLabel from HomeScreen)
    let weekLabels = [];
    //weekSleep holds "" if sleep=0 or "hh" if sleep>0
    let weekSleep = [];
    for (i=0; i<this.props.boards.length; i++) {
      weekLabels.push(this.props.boards[i].dayLabel);
      if (this.props.boards[i].sleep.toFixed(0) == 0) {
        weekSleep.push("");
      } else {
        weekSleep.push(this.props.boards[i].sleep.toFixed(1) + " h");
      }
    }

    //Set up data for offset bar graph
    //offsetData holds data in array in readable format for floating bar graph
    let offsetData = [];
    //Store x in dateLabels and dayLabels
    let dateLabels = [];
    let dayLabels = [];
    //Store y in sleeptimes
    let sleeptimes = []
    //Store y0 in bedtimes
    let bedtimes = [];
    //Store waketimes for testing
    let waketimes = [];
    const interval = 1000 * 60 * 60 * 24; // 24 hours in milliseconds
    for (i=0; i<this.props.boards.length; i++) {
      //Set up x data
      splitDate = this.props.boards[i].dateLabel;
      dateLabels.push(splitDate);
      dayLabels.push(this.props.boards[i].dayLabel);

      //Push 13 digit timestamps or undefined data
      //Convert timestamp to only include hrs/min/sec (day is Jan 1, 1970)
      let pushNum = this.props.boards[i].enters[0] % interval;
      if (isNaN(pushNum)){
        pushNum = 0;
      }
      //Calling new Date(bedtime[i]) gives 1/1/1970 and hr:mm:ss:ms of bedtime
      bedtimes.push(new Date(pushNum));

      //Convert sleep times in hr to ms
      let pushNum2 = this.props.boards[i].sleep * 1000 * 60 * 60;
      if (isNaN(pushNum2)){
        pushNum2 = 0;
      }
      //Store sleep times in ms
      sleeptimes.push(new Date(pushNum2));

      //Store waketimes for testing
      waketimes.push(new Date (pushNum + pushNum2))

      //Store data in offsetData
      offsetData.push({"x": weekLabels[i], "y0": pushNum, "y": pushNum+pushNum2, "day": this.props.boards[i].day})
    }

    let graph;
    let button;

    if (this.props.AB == 1) {
      graph=(
        <View style={styles.chart}>
        <VictoryChart domainPadding={10}>
          <VictoryLegend x={65} y={10}
            orientation="horizontal"
            gutter={20}
            data={[
              { name: "Asleep", symbol: { fill: colors.asleepBar, fontFamily: "Futura"}, labels: {fill: colors.asleepBar}},
              { name: "Awake", symbol: { fill: colors.awakeBar, fontFamily: "Futura" }, labels: {fill: colors.awakeBar}},
              { name: "Napping", symbol: { fill: colors.napBar, fontFamily: "Futura" }, labels: {fill: colors.napBar}}
            ]}
            style={{
              fill: colors.axis
            }}
          />
          <VictoryStack
            domainPadding={{ x: 5 }}
            maxDomain={{x:7}}
            height={300}
          >
            <VictoryBar
              data = {this.props.boards}
              x="dayLabel" y="sleep"
              barRatio={.75}
              style={{
                data: { fill: colors.asleepBar}
              }}
              events={[{
                target: "data",
                eventHandlers: {
                onPressIn: (event, data) => {
                   //this.props.selectDay(data.datum.day);
                   this.setState({picked: data.index});
                   return [{target: "data",}];
                 }
               }}]}
              />
              <VictoryBar
                data = {this.props.boards}
                x="dayLabel" y="awake"
                barRatio={.75}
                style={{
                  data: { fill: colors.awakeBar}
                }}
                events={[{
                  target: "data",
                  eventHandlers: {
                  onPressIn: (event, data) => {
                     //this.props.selectDay(data.datum.day);
                     this.setState({picked: data.index});
                     return [{target: "data",}];
                   }
                 }}]}
                />
              <VictoryBar
                data = {this.props.boards}
                x="dayLabel" y="naps"
                barRatio={.75}
                style={{
                  data: { fill: colors.napBar}
                }}
                events={[{
                  target: "data",
                  eventHandlers: {
                  onPressIn: (event, data) => {
                     //this.props.selectDay(data.datum.day);
                     this.setState({picked: data.index});
                     return [{target: "data",}];
                   }
                 }}]}
                />
            </VictoryStack>
            <VictoryAxis
              //label={"Day"}
              tickValues={dayLabels}
              style={{
                axisLabel: { padding: 30, fontSize: 18, fill: colors.axis, fontFamily: 'Futura' },
                ticks: {stroke: colors.axis, size: 7},
                axis: {stroke: colors.axis},
                tickLabels: { fill: colors.axis, fontFamily: "Futura"}
              }}
              fixLabelOverlap
            />
            <VictoryAxis dependentAxis
              label="Hours"
              domain={[0, 14]}
              style={{
                axisLabel: { fontSize: 18, fill: colors.axis, fontFamily: "Futura" },
                transform: [{ rotate: '90deg'}],
                ticks: {stroke: colors.axis, size: 7},
                axis: {stroke: colors.axis},
                tickLabels: { fill: colors.axis, fontFamily: "Futura"}
              }}
              fixLabelOverlap
            />
            </VictoryChart>
          </View>);
        button = (
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <TouchableOpacity style={styles.buttonNoFlex} onPress={()=>this.props.selectDay(this.props.boards[this.state.picked].day)}>
              <Text style={styles.buttonNoFlexText}>{this.props.boards[this.state.picked].dateLabel}{': '}{this.props.boards[this.state.picked].sleep.toFixed(1)} h</Text>
            </TouchableOpacity>
          </View>
        );
    }
    else if (this.props.AB == 2) {
      graph = (
        <View style={styles.chart}>
          <VictoryChart
            domainPadding={{ x: 15 }}
            //minDomain={{x:0.5}}
            maxDomain={{x:7}}
            height={300}
          >
            <VictoryAxis
              //label={"Day"}
              style={{
                axisLabel: { padding: 30, fontSize: 18, fill: colors.axis, fontFamily: 'Futura' },
                ticks: {stroke: colors.axis, size: 7},
                axis: {stroke: colors.axis},
                tickLabels: { fill: colors.axis, fontFamily: 'Futura'},
              }}
              fixLabelOverlap
              />
            <VictoryAxis dependentAxis
              scale={"time"}
              style={{
                axisLabel: { fontSize: 18, fontFamily: 'Futura' },
                ticks: {stroke: colors.axis, size: 7},
                axis: {stroke: colors.axis},
                tickLabels: { fill: colors.axis, fontFamily: 'Futura', angle: 270, textAnchor: 'middle'},
                transform: [{ rotate: '90deg'}],
              }}
              tickFormat={(x) => this.props.ampm(new Date(x))}
              fixLabelOverlap
              />
            <VictoryBar
              data = {offsetData}
              labels={weekSleep}
              barRatio={.75}
              style={{
                data: { fill: colors.asleepBar}, labels: { fill: colors.highlight }
              }}
              labelComponent={<VictoryLabel dx={-30} dy={5} angle={270}/>}
              events={[{
                target: "data",
                eventHandlers: {
                onPressIn: (event, data) => {
                   //this.props.selectDay(data.datum.day);
                   this.setState({picked: data.index});
                   return [{target: "data",}];
                 }
               }}]}
              />
          </VictoryChart>
        </View>);
        if (this.props.boards[this.state.picked].sleep.toFixed(0) != 0) {
          button = (
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <TouchableOpacity style={styles.buttonNoFlex} onPress={()=>this.props.selectDay(this.props.boards[this.state.picked].day)}>
                <Text style={styles.buttonNoFlexText}>{this.props.boards[this.state.picked].dateLabel}{': '}
                {this.props.getHrMin(new Date(this.props.boards[this.state.picked].enters[0]))}
                {' - '}{this.props.getHrMin(new Date(this.props.boards[this.state.picked].exited[this.props.boards[this.state.picked].exited.length-1]))}</Text>
              </TouchableOpacity>
            </View>
          );
        } else {
          button = (
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <TouchableOpacity style={styles.buttonNoFlex} onPress={()=>this.props.selectDay(this.props.boards[this.state.picked].day)}>
                <Text style={styles.buttonNoFlexText}>{this.props.boards[this.state.picked].dateLabel}{': '}{'--'}</Text>
              </TouchableOpacity>
            </View>
          );
        }
    }

    return(
      <View style={styles.headerWrapper}>
        {this.props.tutorial ?
          <View><Text style={styles.smallText}>Press the i button to turn
          Tutorial Mode off.
          </Text>
          <Text style={styles.smallTextMarg}>
            This is the default, weekly view of your
            child's sleep data. You'll find each night's sleep hours as well as
            the average number of bed exits per night, the average restlessness, and the
            average number of bedwets per night. You can scroll to
            past weeks using the arrows below.
          </Text></View> : ""
        }
        <View style={styles.triplet}>
        {this.props.moreWeeks(-1) ?
          <Button
            buttonStyle={styles.tripletButton}
            icon={{ name: 'arrow-back', style: { marginRight: 0, fontSize: 28, color: colors.triplet} }}
            onPress={() => {this.setState({picked: 0}); this.props.changeWeek(-1);}}
          /> :
          <Button
            buttonStyle={styles.tripletButton}
            icon={{ name: 'arrow-back', style: { marginRight: 0, fontSize: 28, color: 'transparent'} }}
            onPress={() => {}}
          />
        }
        <Text style={styles.tripletText}>Week of {this.props.boards[0].day}</Text>
        {this.props.moreWeeks(1) ?
          <Button
            buttonStyle={styles.tripletButton}
            icon={{ name: 'arrow-forward', style: { marginRight: 0, fontSize: 28, color: colors.triplet} }}
            onPress={() => {this.setState({picked: 0}); this.props.changeWeek(1);}}
          /> :
          <Button
            buttonStyle={styles.tripletButton}
            icon={{ name: 'arrow-back', style: { marginRight: 0, fontSize: 28, color: 'transparent'} }}
            onPress={() => {}}
          />
        }
        </View> // end of triplets view

        <View>
        <View style={styles.appContainer}>
          <TouchableOpacity
            onPress={() => {Alert.alert('Click a bar to see daily details.')}}
            style={styles.button1}>
            <View style={styles.btnContainer}>
              <Text style={styles.title}>Sleep</Text>
              <Image source={require('./about.png')} style={styles.icon} />
            </View>
          </TouchableOpacity>
        </View>
        {this.props.tutorial ?
          <Text style={styles.smallTextMarg}>
            Check out the rest of this page first, but when you come back, you can click on
            one of the bars to see details about that day! Click on the details button below
            to see the daily view.
          </Text> : ""}


      {button}
      {graph}

        {this.props.tutorial ?
          <Text style={styles.smallTextMarg}>
            This section shows some averages and aggregates
            for the week. First is the average hours of sleep per night, then the
            average number of bedwets per night, followed by the average restlessness and average
            number of exits per night in the bottow row.
          </Text> : ""
        }
        <View style={styles.twoColumnContainer}>
          <View style={styles.twoColumnColumn}>
            <View style={styles.appContainer}>
              <Text style={styles.title}>{this.props.hrToMin(this.props.sleepAVG)}</Text>
              <TouchableOpacity
                onPress={() => {Alert.alert('Average hours of sleep this week')}}
                style={styles.button1}>
                <View style={styles.btnContainer}>
                  <Text style={styles.brightText}>sleep per night</Text>
                  <Image source={require('./about.png')} style={styles.icon} />
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.appContainer}>
              <Text style={styles.title}>{this.props.restlessDescription}: {this.props.avgRestless}</Text>
              <TouchableOpacity
                onPress={() => {Alert.alert('Average movement per night on a scale of 0 (low) - 100 (high)')}}
                style={styles.button1}>
                <View style={styles.btnContainer}>
                  <Text style={styles.brightText}>movement score</Text>
                  <Image source={require('./about.png')} style={styles.icon} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.twoColumnColumn}>
            <View style={styles.appContainer}>
              <Text style={styles.title}>{this.props.sumWets}</Text>
              <TouchableOpacity
                onPress={() => {Alert.alert('Average bed wets per night this week')}}
                style={styles.button1}>
                <View style={styles.btnContainer}>
                  <Text style={styles.brightText}>bedwets per night</Text>
                  <Image source={require('./about.png')} style={styles.icon} />
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.appContainer}>
              <Text style={styles.title}>{this.props.avgExits}</Text>
              <TouchableOpacity
                onPress={() => {Alert.alert('Average bed exits per night this week')}}
                style={styles.button1}>
                <View style={styles.btnContainer}>
                  <Text style={styles.brightText}>exits per night</Text>
                  <Image source={require('./about.png')} style={styles.icon} />
                </View>
              </TouchableOpacity>
          </View>
          </View>
        </View> // averages sections end
        </View> // whole view after arrows tripleToggle
      </View>
    );
    }
  }

export default WeekDetail;
