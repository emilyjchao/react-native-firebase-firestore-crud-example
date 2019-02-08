import React, { Component } from 'react';
import Colors from '../constants/Colors';
import { Alert, StyleSheet, ScrollView, ActivityIndicator, View, TextInput, Text, Button } from 'react-native';
import { VictoryBar, VictoryLine, VictoryChart, VictoryZoomContainer, VictoryScatter, VictoryTheme, VictoryLabel, VictoryAxis, LineSegment } from 'victory-native';
import styles from './style';

// Create and export Averages screen component
export default class AveragesScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Averages',
    }
  }
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,  // check for whether initial data has been received
    };
   }

   componentDidMount() {
     // Set loading to false
     this.setState({isLoading: false,});
   }


  render() {
    const {navigation} = this.props;
    const sleepAVG = navigation.getParam('sleepAVG', 0);
    const restlessAVG = navigation.getParam('restlessAVG', 0);
    const bedwetsAVG = navigation.getParam('bedwetsAVG', 0);
    const exitsAVG = navigation.getParam('exitsAVG', 0);
    //Check if loading = true
    if(this.state.isLoading){
      return(
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff"/>
        </View>
      )
    }

    return (
      <ScrollView style={styles.container}>
      //Display the averages
      <View>
        //Display instructions
        <Text style={styles.blackText}>{"\n"}Data for 4 Year-Olds</Text>
        <VictoryChart
          domainPadding={80}
          >
          <VictoryLine
            data = {[
              {x: 0, y: 10.2},
              {x: 4, y: 10.2},
            ]}
            style={{
              data: { stroke: "black" }
            }}
          />
          <VictoryLabel text="Total Hours of Sleep" x={245} y={30} textAnchor="end" />
          <VictoryBar
            barRatio={0.8}
            categories={{
              x: ["Your Child", "National Average"]
            }}
            data = {[
              {x: "Your Child", y: parseFloat(sleepAVG)},
              {x: "National Average", y: 10.6},
            ]}
            style={{
              data: { fill: "#c43a31", fill: (d) => d.x === "National Average" ? "darkblue" : "steelblue", }, labels: { fill: "white" }
            }}
            labels={(d) => d.y}
            labelComponent={<VictoryLabel dy={30}/>}
          />
          <VictoryLabel text="Recommended: 10.2" datum={{ x: 1.7, y: 12 }} />
          <VictoryAxis dependentAxis tickFormat={() => ''} />
          <VictoryAxis independentAxis tickFormat={(x) => x} />
        </VictoryChart>
        <VictoryChart
          domainPadding={80}
          >
          <VictoryLabel text="Movement" x={225} y={30} textAnchor="end" />
          <VictoryBar
            barRatio={0.8}
            categories={{
              x: ["Your Child", "National Average"]
            }}
            data = {[
              {x: "Your Child", y: parseFloat(restlessAVG)},
              {x: "National Average", y: 4.6}
            ]}
            style={{
              data: { fill: "#c43a31", fill: (d) => d.x === "National Average" ? "#000000" : "steelblue", }, labels: { fill: "white" }
            }}
            labels={(d) => d.y}
            labelComponent={<VictoryLabel dy={30}/>}
          />
          <VictoryAxis dependentAxis tickFormat={() => ''} />
          <VictoryAxis independentAxis tickFormat={(x) => x} />
        </VictoryChart>
        <VictoryChart
          domainPadding={80}
          >
          <VictoryLabel text="Bedwets Per Night" x={200} y={30} textAnchor="middle"/>
          <VictoryBar
            barRatio={0.8}
            categories={{
              x: ["Your Child", "National Average"]
            }}
            data = {[
              {x: "Your Child", y: parseFloat(bedwetsAVG)},
              {x: "National Average", y: 0.7}
            ]}
            style={{
              data: { fill: (d) => d.x === "National Average" ? "#000000" : "steelblue", }, labels: { fill: "white" }
            }}
            labels={(d) => d.y}
            labelComponent={<VictoryLabel dy={30}/>}
          />
          <VictoryAxis dependentAxis tickFormat={() => ''} />
          <VictoryAxis independentAxis tickFormat={(x) => x} />
        </VictoryChart>
        <VictoryChart
          domainPadding={80}
          >
          <VictoryLabel text="Bed Exits Per Night" x={250} y={30} fontSize={60} textAnchor="end"/>
          <VictoryBar
            barRatio={0.8}
            categories={{
              x: ["Your Child", "National Average"]
            }}
            data = {[
              {x: "Your Child", y: parseFloat(exitsAVG)},
              {x: "National Average", y: 1.2}
            ]}
            style={{
              data: { fill: "#c43a31", fill: (d) => d.x === "National Average" ? "#000000" : "steelblue", }, labels: { fill: "white" }
            }}
            labels={(d) => d.y}
            labelComponent={<VictoryLabel dy={30}/>}
          />
          <VictoryAxis dependentAxis tickFormat={() => ''} />
          <VictoryAxis independentAxis tickFormat={(x) => x} />
        </VictoryChart>
        <Text>{"\n\n"}</Text>
      </View>

      </ScrollView>
    )
  }
}
