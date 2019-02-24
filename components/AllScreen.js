import React, { Component } from 'react';
import { Alert, StyleSheet, ScrollView, Image, ActivityIndicator, View, TouchableOpacity, Text, TextInput } from 'react-native';
import { List, ListItem, Button, Icon } from 'react-native-elements';
import { VictoryBar, VictoryLine, VictoryChart, VictoryLegend, VictoryStack, VictoryZoomContainer, VictoryScatter, VictoryTheme, VictoryLabel, VictoryAxis, LineSegment } from 'victory-native';
import styles from './style';
import colors from './colors';



class AllDetail extends Component {
  constructor () {
    super();
    this.state = {
      picked: 0, // view the details of clicked day
    }
  }
  render () {

    let graph;
    // display the graph based on what AB for ABtesting is
      graph = (
        <View style={styles.chart}>
        <VictoryChart>
        <VictoryLegend x={65} y={10}
          orientation="horizontal"
          gutter={20}
          data={[
            { name: "Asleep", symbol: { fill: colors.asleepBar, fontFamily: "Futura"}, labels: {fill: colors.asleepBar}},
            { name: "Awake", symbol: { fill: colors.awakeBar, fontFamily: "Futura" }, labels: {fill: colors.awakeBar}},
            { name: "Napping", symbol: { fill: colors.napBar, fontFamily: "Futura" }, labels: {fill: colors.napBar}}
          ]}
        />
        <VictoryAxis
          style={{
            axisLabel: { padding: 30, fontSize: 18, fill: colors.axis, fontFamily: "Futura" },
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
            axis: {stroke: colors.axis},
            tickLabels: {fill: colors.axis, fontFamily: "Futura"},
            axisLabel: { fontSize: 18, fill: colors.axis, fontFamily: "Futura" },
            transform: [{ rotate: '90deg'}]
          }}
        fixLabelOverlap
        />
        <VictoryStack
          //helps so that chart is not cut off on right
          domainPadding={{ x : [30, 30] }}
          containerComponent={
            <VictoryZoomContainer/>
          }
          >
          <VictoryBar
            data = {this.props.boards}
            x="dateLabel" y="sleep"
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
            x="dateLabel" y="awake"
            style={{ labels: { textAlign: 'left', marginRight: 30}, data: { fill: colors.awakeBar} }}
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
            x="dateLabel" y="naps"
            style={{ labels: { textAlign: 'left', marginRight: 30}, data: { fill: colors.napBar} }}
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
          </VictoryChart>
          </View>
      );
    return(
      <View style={styles.headerWrapper}>
      <ScrollView style={styles.container}>
        <View style={styles.subContainer}>
        {this.props.tutorial ?
          <Text style={styles.smallText}>Press the i button to turn
          Tutorial Mode off. {"\n"} The All view contains the same metrics
            as the weekly view but shows all collected data.
          </Text> : ""
        }
        <Text style={styles.blackTextPadding}>Full Data Report</Text>
        <View style={styles.appContainer}>
        <TouchableOpacity
          onPress={() => {Alert.alert('Click a bar to see daily details.')}}
          style={styles.button1}>
          <View style={styles.btnContainer}>
            <Text style={styles.title}>Sleep</Text>
          </View>
        </TouchableOpacity>
        </View>

          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <TouchableOpacity style={styles.buttonNoFlex} onPress={()=>this.props.selectDay(this.props.boards[this.state.picked].day)}>
              <Text style={styles.buttonNoFlexText}>{this.props.boards[this.state.picked].dateLabel}{': '}{this.props.boards[this.state.picked].sleep.toFixed(2)}hr</Text>
            </TouchableOpacity>
          </View>
          //Display line graph of all sleep time
          {graph}

          //Line graph of Restless
          <Text style={styles.titleNoMargin}>Movement</Text>
          <View style={styles.chart}>
          <VictoryChart
            height={150}
            domainPadding={{ x : [20, 20] }, { y : [10, 10] }}
            maxDomain={{y: 100}}
            >
            <VictoryLine
              interpolation="natural"
              style={{
                data: { stroke: colors.awakeBar },
              }}
              data = {this.props.boards}
              x="dateLabel" y="restlessAvg"
              />
            <VictoryAxis
              style={{fontSize: 16, axisLabel: { padding: 35, fill: colors.axis},
                  ticks: {stroke: colors.axis, size: 7},
                  axis: {stroke: colors.axis},
                  tickLabels: { fill: colors.axis},
                }}
              fixLabelOverlap
              />
            <VictoryAxis dependentAxis
              style={{
                axisLabel: { padding: 10, fill: colors.axis},
                tickLabels: { fill: colors.axis},
                ticks: {stroke: colors.axis},
                fontSize: 16,
                axis: {stroke: colors.axis},
                transform: [{ rotate: '90deg'}]
              }}
              fixLabelOverlap
              />
          </VictoryChart>
          </View>

          //Line graph of Bedwets
          <Text style={styles.titleNoMargin}>Bedwets</Text>
          <View style={styles.chart}>
          <VictoryChart
            height={150}
            domainPadding={{ x : [20, 20] }, { y : [10, 10] }}
            >
            <VictoryLine
              interpolation="natural"
              style={{
                data: { stroke: colors.awakeBar },
              }}
              data = {this.props.boards}
              x="dateLabel" y="bedwet.length"
              />
            <VictoryAxis
              style={{fontSize: 16, axisLabel: { padding: 35, fill: colors.axis},
                  ticks: {stroke: colors.axis, size: 7},
                  axis: {stroke: colors.axis},
                  tickLabels: { fill: colors.axis},
                }}
              fixLabelOverlap
              />
            <VictoryAxis dependentAxis
              style={{
                axisLabel: { padding: 10, fill: colors.axis},
                tickLabels: { fill: colors.axis},
                ticks: {stroke: colors.axis},
                fontSize: 16,
                axis: {stroke: colors.axis},
                transform: [{ rotate: '90deg'}]
              }}
              tickValues={[2, 4]}
              fixLabelOverlap
              />
          </VictoryChart>
          </View>

          //Line graph of Exits
          <Text style={styles.titleNoMargin}>Bed Exits</Text>
          <View style={styles.chart}>
          <VictoryChart
            height={150}
            domainPadding={{ x : [20, 20] }, { y : [10, 10] }}
            clipPadding={{ top: 0, bottom: 0, left: 0, right: 0}}
            >
            <VictoryLine
              interpolation="natural"
              style={{
                data: { stroke: colors.awakeBar },
              }}
              data = {this.props.boards}
              x="dateLabel" y="exited.length"
              />
            <VictoryAxis
              style={{fontSize: 16, axisLabel: { padding: 35, fill: colors.axis},
                  ticks: {stroke: colors.axis, size: 7},
                  axis: {stroke: colors.axis},
                  tickLabels: { fill: colors.axis}
                }}
              fixLabelOverlap
              />
            <VictoryAxis dependentAxis
              style={{
                axisLabel: { padding: 10, fill: colors.axis},
                tickLabels: { fill: colors.axis},
                ticks: {stroke: colors.axis},
                fontSize: 16,
                axis: {stroke: colors.axis},
                transform: [{ rotate: '90deg'}]
              }}
              fixLabelOverlap
              />
          </VictoryChart>
          </View>

          <View style={styles.twoColumnContainer}>
            <View style={styles.twoColumnColumn}>
              <View style={styles.appContainer}>
                <Text style={styles.title}>{this.props.hrToMin(this.props.sleepAVG)}</Text>
                <TouchableOpacity
                  onPress={() => {Alert.alert('Average hours of sleep')}}
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
                    <Text style={styles.brightText}>movement average</Text>
                    <Image source={require('./about.png')} style={styles.icon} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.twoColumnColumn}>
              <View style={styles.appContainer}>
                <Text style={styles.title}>{this.props.sumWets}</Text>
                <TouchableOpacity
                  onPress={() => {Alert.alert('Average bed wets per night')}}
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
                  onPress={() => {Alert.alert('Average bed exits per night')}}
                  style={styles.button1}>
                  <View style={styles.btnContainer}>
                    <Text style={styles.brightText}>exits per night</Text>
                    <Image source={require('./about.png')} style={styles.icon} />
                  </View>
                </TouchableOpacity>
            </View>
            </View>
          </View> // averages sections end
        </View>
      </ScrollView>
    </View>)

    }
}

export default AllDetail;
