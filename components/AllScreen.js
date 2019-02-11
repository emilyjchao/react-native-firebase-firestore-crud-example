import React, { Component } from 'react';
import { Alert, StyleSheet, ScrollView, Image, ActivityIndicator, View, TouchableOpacity, Text, TextInput } from 'react-native';
import { List, ListItem, Button, Icon } from 'react-native-elements';
import { VictoryBar, VictoryLine, VictoryChart, VictoryZoomContainer, VictoryScatter, VictoryTheme, VictoryLabel, VictoryAxis, LineSegment } from 'victory-native';
import styles from './style';


class AllDetail extends Component {
  constructor () {
    super();
  }

  render () {
    return(
      <ScrollView style={styles.container}>
        <View style={styles.subContainer}>
        {this.props.tutorial ?
          <Text style={styles.smallText}>The All view contains the same metrics
            as the weekly view but shows all collected data. 
          </Text> : ""
        }
        <Text style={styles.blackTextPadding}>{"\n"}Full Data Report</Text>
          <TouchableOpacity
            onPress={() => {Alert.alert('Click a bar to see daily details. \n \n Bars = hours asleep \n Points = hours in bed ')}}            style={styles.button1}>
            <View style={styles.btnContainer}>
              <Text style={styles.title}>Sleep History</Text>
              <Image source={require('./about.png')} style={styles.icon} />
            </View>
          </TouchableOpacity>
          //Display line graph of all sleep time
          <VictoryChart
            //helps so that chart is not cut off on right
            domainPadding={{ x : [30, 30] }}
            containerComponent={
                <VictoryZoomContainer/>
              }
          >
            <VictoryBar
              data = {this.props.boards}
              x="dateLabel" y="sleep"
              barRatio={.75}
              style={{
                data: { fill: "steelblue"}
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
            <VictoryLine
              data = {this.props.boards}
              x="dateLabel" y="inBed"
              style={{ labels: { textAlign: 'left', marginRight: 30} }}
              />
            <VictoryScatter
              data = {this.props.boards}
              x="dateLabel" y="inBed"
              events={[{
                target: "data",
                eventHandlers: {
                onPressIn: () => {
                   Alert.alert('Total time in bed')
                 }
               }}]}
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
                label="Sleep"
                style={{
                  axisLabel: { padding: 35},
                  fontSize: 16,
                  transform: [{ rotate: '90deg'}]
                }}
                fixLabelOverlap
              />
              </VictoryChart>

              <Text>{"\n"}</Text>

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
                      onPress={() => {Alert.alert('Movement per night on a scale of 0 (low) - 10 (high)')}}
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
            </View>
      </ScrollView>)

    }
}

export default AllDetail;
