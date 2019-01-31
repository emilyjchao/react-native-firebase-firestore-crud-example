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
          <Text style={styles.blackText}>{"\n"}Sleep History</Text>
          //Display line graph of all sleep time
          <VictoryChart
            //animate={{ duration: 10 }}
            //helps so that chart is not cut off on right
            domainPadding={{ x : [30, 30] }}
            containerComponent={
                <VictoryZoomContainer/>
              }
          >
            <VictoryBar
              data = {this.props.boards}
              x="day" y="sleep"
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
              x="day" y="inBed"
              //labels={dateLabels}
              style={{ labels: { textAlign: 'left', marginRight: 30} }}
              />
              <VictoryScatter
                data = {this.props.boards}
                x="day" y="inBed"
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
              <Text style={styles.brightText}>{this.props.restlessDescription} - {this.props.avgRestless}</Text>

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
              <Text style={styles.brightText}>{this.props.avgExits}{"\n"}</Text>

              <View
                style={{
                  borderBottomColor: 'black',
                  borderBottomWidth: 1,
                }}
              />
              <Text style={styles.blackText}>{"\n"}National Data for 4 Year-Olds</Text>
              this.props.sleepAVG
              <VictoryChart
                domainPadding={80}
                //animate={{ duration: 10 }}
                >
                <VictoryLabel text="Total Hours of Sleep" x={245} y={30} textAnchor="end" />
                <VictoryBar
                  barRatio={0.8}
                  categories={{
                    x: ["Your Child", "National Average"]
                  }}
                  data = {[
                    {x: "Your Child", y: this.props.sleepAVG},
                    {x: "National Average", y: 10}
                  ]}
                  style={{
                    data: { fill: "#c43a31", fill: (d) => d.x === "National Average" ? "#000000" : "#c43a31", }, labels: { fill: "white" }
                  }}
                  labels={(d) => d.y}
                  labelComponent={<VictoryLabel dy={30}/>}
                />
                <VictoryAxis dependentAxis tickFormat={() => ''} />
                <VictoryAxis independentAxis tickFormat={(x) => x} />
              </VictoryChart>
              <VictoryChart
                domainPadding={80}
                //animate={{ duration: 10 }}
                >
                <VictoryLabel text="Restlessness" x={225} y={30} textAnchor="end" />
                <VictoryBar
                  barRatio={0.8}
                  categories={{
                    x: ["Your Child", "National Average"]
                  }}
                  data = {[
                    {x: "Your Child", y: this.props.avgRestless},
                    {x: "National Average", y: 0.98}
                  ]}
                  style={{
                    data: { fill: "#c43a31", fill: (d) => d.x === "National Average" ? "#000000" : "#c43a31", }, labels: { fill: "white" }
                  }}
                  labels={(d) => d.y}
                  labelComponent={<VictoryLabel dy={30}/>}
                />
                <VictoryAxis dependentAxis tickFormat={() => ''} />
                <VictoryAxis independentAxis tickFormat={(x) => x} />
              </VictoryChart>
              <VictoryChart
                domainPadding={80}
                //animate={{ duration: 10 }}
                >
                <VictoryLabel text="Bedwets Per Night" x={200} y={30} textAnchor="middle"/>
                <VictoryBar
                  barRatio={0.8}
                  categories={{
                    x: ["Your Child", "National Average"]
                  }}
                  data = {[
                    {x: "Your Child", y: this.props.sumWets},
                    {x: "National Average", y: 0.7}
                  ]}
                  style={{
                    data: { fill: "#c43a31", fill: (d) => d.x === "National Average" ? "#000000" : "#c43a31", }, labels: { fill: "white" }
                  }}
                  labels={(d) => d.y}
                  labelComponent={<VictoryLabel dy={30}/>}
                />
                <VictoryAxis dependentAxis tickFormat={() => ''} />
                <VictoryAxis independentAxis tickFormat={(x) => x} />
              </VictoryChart>
              <VictoryChart
                domainPadding={80}
                //animate={{ duration: 10 }}
                >
                <VictoryLabel text="Bed Exits Per Night" x={250} y={30} fontSize={60} textAnchor="end"/>
                <VictoryBar
                  barRatio={0.8}
                  categories={{
                    x: ["Your Child", "National Average"]
                  }}
                  data = {[
                    {x: "Your Child", y: this.props.avgExits},
                    {x: "National Average", y: 0.55}
                  ]}
                  style={{
                    data: { fill: "#c43a31", fill: (d) => d.x === "National Average" ? "#000000" : "#c43a31", }, labels: { fill: "white" }
                  }}
                  labels={(d) => d.y}
                  labelComponent={<VictoryLabel dy={30}/>}
                />
                <VictoryAxis dependentAxis tickFormat={() => ''} />
                <VictoryAxis independentAxis tickFormat={(x) => x} />
              </VictoryChart>

          />
        </View>
      </ScrollView>)

    }
}

export default AllDetail;
