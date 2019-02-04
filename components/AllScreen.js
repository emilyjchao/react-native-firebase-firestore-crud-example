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
        <Text style={styles.blackTextPadding}>{"\n"}Full Data Report</Text>
          <TouchableOpacity
            onPress={() => {Alert.alert('Click on any bar to see daily details. The bars represent the hours your child slept each night, and the black line represents the number of hours your child spent in bed each night.')}}
            style={styles.button1}>
            <View style={styles.btnContainer}>
              <Text style={styles.title}>Sleep History</Text>
              <Image source={require('./about.png')} style={styles.icon} />
            </View>
          </TouchableOpacity>
          //Display line graph of all sleep time
          <VictoryChart
            animate={{ duration: 10 }}
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

              <Text>{"\n"}</Text>
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <View style={{flexDirection: 'column'}}>
                <View style={styles.appContainer}>
                <TouchableOpacity
                  onPress={() => {Alert.alert('This is the average number of hours your child slept this week. Your child should aim to sleep 10 hours a night.')}}
                  style={styles.button1}>
                    <View style={styles.btnContainer}>
                      <Text style={styles.title}>Sleep</Text>
                      <Image source={require('./about.png')} style={styles.icon} />
                    </View>
                  </TouchableOpacity>
                </View>
                <Text style={styles.brightText}>{this.props.hrToMin(this.props.sleepAVG)}{"\n"}</Text>
              </View>

              <View style={{flexDirection: 'column'}}>
                <View style={styles.appContainer}>
                <TouchableOpacity
                  onPress={() => {Alert.alert('Movement is rated on a score of 0 to 2. 0 corresponds to low movement, 1 to moderate movement, and 2 to high movement. Some restlessness is normal.')}}
                  style={styles.button1}>
                    <View style={styles.btnContainer}>
                      <Text style={styles.title}>Movement</Text>
                      <Image source={require('./about.png')} style={styles.icon} />
                    </View>
                  </TouchableOpacity>
                </View>
                <Text style={styles.brightText}>{this.props.restlessDescription}: {this.props.avgRestless}{"\n"}</Text>
              </View>
              </View>

              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <View style={{flexDirection: 'column'}}>
                <View style={styles.appContainer}>
                <TouchableOpacity
                  onPress={() => {Alert.alert('This is the average number of times your child wet the bed per night this week.')}}
                  style={styles.button1}>
                    <View style={styles.btnContainer}>
                      <Text style={styles.title}>Bedwets</Text>
                      <Image source={require('./about.png')} style={styles.icon} />
                    </View>
                  </TouchableOpacity>
                </View>
                <Text style={styles.brightText}>{this.props.sumWets}{"\n"}</Text>
              </View>

              <View style={{flexDirection: 'column'}}>
                <View style={styles.appContainer}>
                <TouchableOpacity
                  onPress={() => {Alert.alert('This is the average number of times your child left the bed per night this week.')}}
                  style={styles.button1}>
                    <View style={styles.btnContainer}>
                      <Text style={styles.title}>Bed Exits</Text>
                      <Image source={require('./about.png')} style={styles.icon} />
                    </View>
                  </TouchableOpacity>
                </View>
                <Text style={styles.brightText}>{this.props.avgExits}{"\n"}</Text>
              </View>
              </View>

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
                animate={{ duration: 5 }}
                >
                <VictoryLabel text="Total Hours of Sleep" x={245} y={30} textAnchor="end" />
                <VictoryBar
                  barRatio={0.8}
                  categories={{
                    x: ["Your Child", "National Average"]
                  }}
                  data = {[
                    {x: "Your Child", y: parseFloat(this.props.sleepAVG)},
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
                animate={{ duration: 5 }}
                >
                <VictoryLabel text="Movement" x={225} y={30} textAnchor="end" />
                <VictoryBar
                  barRatio={0.8}
                  categories={{
                    x: ["Your Child", "National Average"]
                  }}
                  data = {[
                    {x: "Your Child", y: parseFloat(this.props.avgRestless)},
                    {x: "National Average", y: 1.1}
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
                animate={{ duration: 10 }}
                >
                <VictoryLabel text="Bedwets Per Night" x={200} y={30} textAnchor="middle"/>
                <VictoryBar
                  barRatio={0.8}
                  categories={{
                    x: ["Your Child", "National Average"]
                  }}
                  data = {[
                    {x: "Your Child", y: parseFloat(this.props.sumWets)},
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
                animate={{ duration: 10 }}
                >
                <VictoryLabel text="Bed Exits Per Night" x={250} y={30} fontSize={60} textAnchor="end"/>
                <VictoryBar
                  barRatio={0.8}
                  categories={{
                    x: ["Your Child", "National Average"]
                  }}
                  data = {[
                    {x: "Your Child", y: parseFloat(this.props.avgExits)},
                    {x: "National Average", y: 0.63}
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
        <Text>{'\n\n'}</Text>
      </ScrollView>)

    }
}

export default AllDetail;
