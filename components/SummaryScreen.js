import React, { Component } from 'react';
import { Alert, StyleSheet, ScrollView, ActivityIndicator, Image, View, TouchableOpacity, Text } from 'react-native';
import { List, ListItem, Button, Icon } from 'react-native-elements';
import { VictoryBar, VictoryLine, VictoryLegend, VictoryArea, VictoryChart, VictoryStack, VictoryScatter, VictoryTheme, VictoryAxis, LineSegment, VictoryLabel } from 'victory-native';
import styles from './style';
import colors from './colors';


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
    let weekSleep = [];
    for (i=0; i<this.props.boards.length; i++) {
      weekLabels.push(this.props.boards[i].dayLabel);
      weekSleep.push(this.props.boards[i].sleep.toFixed(1) + " hr");
    }

    //Set up data for offset bar graph
    //Combine data into array in readable format
    let offsetData = [];
    //Store x in dateLabels and dayLabels
    let dateLabels = [];
    let dayLabels = [];
    //Store y in sleeptimes
    let sleeptimes = []
    //Store y0 in bedtimes
    let bedtimes = [];
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
      offsetData.push({"x": weekLabels[i], "y0": new Date(pushNum), "y": pushNum2, "day": this.props.boards[i].day})
    }

    console.log("Offset\n")
    console.log(offsetData)
    console.log("Bedtime\n")
    console.log(bedtimes)
    console.log("Sleeptime\n")
    console.log(sleeptimes)
    console.log("Waketime\n")
    console.log(waketimes)


    let graph;
    // display the graph based on what AB for ABtesting is
    // if (this.props.AB == 0) {
    //   graph = (
    //     <View style={styles.chart}>
    //       <VictoryChart
    //         domainPadding={{ x: 15 }}
    //         //minDomain={{x:0.5}}
    //         maxDomain={{x:7}}
    //         height={300}
    //       >
    //         <VictoryLegend x={125} y={10}
    //           orientation="horizontal"
    //           gutter={20}
    //           data={[
    //             { name: "Sleep", symbol: { fill: "steelblue"} },
    //             { name: "Time in Bed", symbol: { fill: "black"} }
    //           ]}
    //         />
    //         <VictoryBar
    //           data = {this.props.boards}
    //           x="dateLabel" y="sleep"
    //           labels={weekLabels}
    //           barRatio={.75}
    //           style={{
    //             data: { fill: "steelblue"}, labels: { fill: "white" }
    //           }}
    //           labelComponent={<VictoryLabel dy={30}/>}
    //           events={[{
    //             target: "data",
    //             eventHandlers: {
    //             onPressIn: (event, data) => {
    //                this.props.selectDay(data.datum.day);
    //                return [{target: "data",}];
    //             },
    //             // onLongPress: (event, data) => {
    //             //   Alert.alert("you long pressed this day: " + data.datum.day);
    //             //   console.log("ACTIVATED Long press");
    //             // }
    //            }}]}
    //           />
    //         <VictoryScatter
    //           data = {this.props.boards}
    //           x="dateLabel" y="inBed"
    //           events={[{
    //             target: "data",
    //             eventHandlers: {
    //             onPressIn: () => {
    //                Alert.alert('Total time in bed')
    //              }
    //            }}]}
    //         />
    //         <VictoryLine
    //           data = {this.props.boards}
    //           x="dateLabel" y="inBed"
    //
    //           style={{ labels: { textAlign: 'left', marginRight: 30, alignSelf: 'bottom', fontSize: 20} }}
    //           />
    //         <VictoryAxis
    //           label={"Day"}
    //           style={{
    //             axisLabel: { padding: 30, fontSize: 18 },
    //           }}
    //           fixLabelOverlap
    //           />
    //         <VictoryAxis dependentAxis
    //           label="Hours"
    //           domain={[0, 14]}
    //           style={{
    //             axisLabel: { fontSize: 18 },
    //             transform: [{ rotate: '90deg'}]
    //           }}
    //           fixLabelOverlap
    //           />
    //       </VictoryChart>
    //     </View>);
    // }
    if (this.props.AB == 1) {
      graph=(
        <View style={styles.chart}>
        <VictoryChart>
          <VictoryLegend x={125} y={10}
            orientation="horizontal"
            gutter={20}
            data={[
              { name: "Asleep", symbol: { fill: colors.asleepBar } },
              { name: "Awake", symbol: { fill: colors.awakeBar } }
            ]}
            style={{
              text: { stroke: colors.axis}
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
                   this.props.selectDay(data.datum.day);
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
                     this.props.selectDay(data.datum.day);
                     return [{target: "data",}];
                   }
                 }}]}
                />
              <VictoryAxis
                label={"Day"}
                tickValues={dayLabels}
                style={{
                  axisLabel: { padding: 30, fontSize: 18, stroke: colors.axis },
                  ticks: {stroke: colors.axis, size: 7},
                  axis: {stroke: colors.axis},
                  tickLabels: { stroke: colors.axis}
                }}
                // style={{fontSize: 18, axisLabel: { padding: 30, fill: colors.axis },
                //     ticks: {stroke: colors.axis, size: 7},
                //     axis: {stroke: colors.axis},
                //     tickLabels: { fill: colors.axis},
                // }}
                fixLabelOverlap
              />
              <VictoryAxis dependentAxis
                label="Hours"
                domain={[0, 14]}
                style={{
                  axisLabel: { padding: 30, fontSize: 18 },
                  ticks: {stroke: colors.axis, size: 7},
                  axis: {stroke: colors.axis},
                  tickLabels: { fill: colors.axis},
                  transform: [{ rotate: '90deg'}],
                }}
                fixLabelOverlap
              />
            </VictoryStack>
            </VictoryChart>
          </View>);
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
            <VictoryBar
              data = {offsetData}
              labels={weekSleep}
              barRatio={.75}
              style={{
                data: { fill: colors.asleepBar}, labels: { fill: "white" }
              }}
              labelComponent={<VictoryLabel dx={30} dy={5} angle={90}/>}
              events={[{
                target: "data",
                eventHandlers: {
                onPressIn: (event, data) => {
                   this.props.selectDay(data.datum.day);
                   return [{target: "data",}];
                 }
               }}]}
              />
            <VictoryAxis
              label={"Day"}
              style={{
                axisLabel: { padding: 30, fontSize: 18 },
                ticks: {stroke: colors.axis, size: 7},
                axis: {stroke: colors.axis},
                tickLabels: { fill: colors.axis},
              }}
              fixLabelOverlap
              />
            <VictoryAxis dependentAxis
              scale={"time"}
              style={{
                axisLabel: { fontSize: 18 },
                transform: [{ rotate: '90deg'}],
                ticks: {stroke: colors.axis, size: 7},
                axis: {stroke: colors.axis},
                tickLabels: { fill: colors.axis}
              }}
              fixLabelOverlap
              />
          </VictoryChart>
        </View>);
    }

    return(
      <View style={styles.headerWrapper}>
        {this.props.tutorial ?
          <Text style={styles.smallText}>Press the i button to turn
          Tutorial Mode off. {"\n"}
            This is the default, weekly view of your
            child's sleep data. You'll find each night's sleep hours as well as
            the average number of bed exits per night, the average restlessness, and the
            total number of bedwetting incidents from the past week. You can scroll to
            past weeks using the arrows below.
          </Text> : ""
        }
        <View style={styles.triplet}>
        {this.props.moreWeeks(-1) ?
          <Button
            buttonStyle={{ marginTop:  30, backgroundColor: 'transparent' }}
            icon={{ name: 'arrow-back', style: { marginRight: 0, fontSize: 28, color: colors.triplet} }}
            onPress={() => this.props.changeWeek(-1)}
          /> :
          <Button
            buttonStyle={{ marginTop:  30, backgroundColor: 'transparent' }}
            icon={{ name: 'arrow-back', style: { marginRight: 0, fontSize: 28, color: 'transparent'} }}
            onPress={() => this.props.changeWeek(-1)}
          />
        }
        <Text style={styles.tripletText}>{"\n"}Week of {this.props.boards[0].day}</Text>
        {this.props.moreWeeks(1) ?
          <Button
            buttonStyle={{ marginTop: 30, backgroundColor: 'transparent' }}
            icon={{ name: 'arrow-forward', style: { marginRight: 0, fontSize: 28, color: colors.triplet} }}
            onPress={() => this.props.changeWeek(1)}
          /> :
          <Button
            buttonStyle={{ marginTop:  30, backgroundColor: 'transparent' }}
            icon={{ name: 'arrow-back', style: { marginRight: 0, fontSize: 28, color: 'transparent'} }}
            onPress={() => this.props.changeWeek(1)}
          />
        }
        </View> // end of triplets view

        <View>
        <View style={styles.appContainer}>
          <TouchableOpacity
            onPress={() => {Alert.alert('Click a bar to see daily details. \n \n Bars = hours asleep \n Points = hours in bed ')}}
            style={styles.button1}>
            <View style={styles.btnContainer}>
              <Text style={styles.title}>Sleep</Text>
              <Image source={require('./about.png')} style={styles.icon} />
            </View>
          </TouchableOpacity>
        </View>
        {this.props.tutorial ?
          <Text style={styles.smallText}><Text style={{fontWeight: "bold"}}>Each night's time spent in bed is shown by
            the black dotted line, while the blue bars indicate the time asleep.</Text>
            Check out the rest of this page first, but when you come back, you can click on
            one of the blue bars  to see details about that day!
          </Text> : ""}
      {graph}

        {this.props.tutorial ?
          <Text style={styles.smallText}>
            This section shows some averages and aggregates
            for the week. First is the average hours of sleep per night, then the
            total number of bedwets, followed by the average restlessness and average
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
                onPress={() => {Alert.alert('Movement per night on a scale of 0 (low) - 100 (high)')}}
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
                onPress={() => {Alert.alert('Total bed wets this week')}}
                style={styles.button1}>
                <View style={styles.btnContainer}>
                  <Text style={styles.brightText}>total bedwets</Text>
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

export default SummaryDetail;
