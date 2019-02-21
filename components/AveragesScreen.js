import React, { Component } from 'react';
import Colors from '../constants/Colors';
import { Alert, StyleSheet, ScrollView, ActivityIndicator, View, TextInput, Text, Button } from 'react-native';
import { VictoryBar, VictoryLine, VictoryChart, VictoryZoomContainer, VictoryScatter, VictoryTheme, VictoryLabel, VictoryAxis, LineSegment } from 'victory-native';
import styles from './style';
import colors from './colors';

// Create and export Averages screen component
export default class AveragesScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Averages',
      titleStyle: {
        fontFamily: 'Futura'
      },
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
          <ActivityIndicator size="large" color={colors.asleepBar}/>
        </View>
      )
    }

    return (
      <ScrollView style={styles.container}>
      //Display the averages
      <View style={styles.headerWrapper}>
        //Display instructions
        <Text style={styles.blackText}>{"\n"}Data for 4 Year-Olds</Text>
        <VictoryChart
          domainPadding={80}
          >
          <VictoryLine
            data = {[
              {x: 0, y: 11.5},
              {x: 4, y: 11.5},
            ]}
            style={{
              data: { stroke: colors.highlight }
            }}
          />
          <VictoryLabel
            x={245} y={30}
            text="Hours of Sleep"
            textAnchor="end"
            style={{ fill: colors.descriptions, fontFamily: "Futura" }}
            />
          <VictoryBar
            barRatio={0.8}
            categories={{
              x: ["Your Child", "National Average"]
            }}
            data = {[
              {x: "Your Child", y: parseFloat(sleepAVG)},
              {x: "National Average", y: 11.7},
            ]}
            style={{
              data: { fill: colors.asleepBar, fill: (d) => d.x === "National Average" ? colors.natAvg : colors.asleepBar, }, labels: { fill: colors.highlight, fontFamily: "Futura" }
            }}
            labels={(d) => d.y}
            labelComponent={<VictoryLabel dy={30}/>}
          />
          <VictoryLabel text="Recommended: 11.5" datum={{ x: 1.7, y: 13.5 }}
            style={{fill: colors.highlight, fontFamily: "Futura"}}/>
          <VictoryAxis dependentAxis tickFormat={() => ''}
            style={{fontSize: 16, axisLabel: { padding: 35, fill: colors.axis, fontFamily: "Futura" },
                axis: {stroke: colors.axis},
                tickLabels: { fill: colors.axis, fontFamily: "Futura"}
              }}/>
          <VictoryAxis independentAxis tickFormat={(x) => x}
            style={{fontSize: 16, axisLabel: { padding: 35, fill: colors.highlight },
              axis: {stroke: colors.axis, fontFamily: "Futura"},
              tickLabels: { fill: colors.axis, fontFamily: "Futura"}
            }}/>
        </VictoryChart>
        <VictoryChart
          domainPadding={80}
          >
          <VictoryLabel text="Movement" x={225} y={30}
            style={{ fill: colors.axis, fontFamily: "Futura" }} textAnchor="end" />
          <VictoryBar
            barRatio={0.8}
            categories={{
              x: ["Your Child", "National Average"]
            }}
            data = {[
              {x: "Your Child", y: parseFloat(restlessAVG)},
              {x: "National Average", y: 13}
            ]}
            style={{
              data: { fill: colors.asleepBar, fill: (d) => d.x === "National Average" ? colors.natAvg : colors.asleepBar, }, labels: { fill: colors.highlight, fontFamily: "Futura" }
            }}
            labels={(d) => d.y}
            labelComponent={<VictoryLabel dy={30}/>}
          />
          <VictoryAxis dependentAxis tickFormat={() => ''}
            style={{fontSize: 16, axisLabel: { padding: 35, fill: colors.axis, fontFamily: "Futura" },
              axis: {stroke: colors.axis},
              tickLabels: { fill: colors.axis, fontFamily: "Futura"}
            }} />
          <VictoryAxis independentAxis tickFormat={(x) => x}
            style={{fontSize: 16, axisLabel: { padding: 35, fill: colors.highlight },
              axis: {stroke: colors.axis, fontFamily: "Futura"},
              tickLabels: { fill: colors.axis, fontFamily: "Futura"}
            }}/>
        </VictoryChart>
        <VictoryChart
          domainPadding={80}
          >
          <VictoryLabel text="Bedwets Per Night" x={200} y={30}
            style={{ fill: colors.axis, fontFamily: "Futura" }} textAnchor="middle"/>
          <VictoryBar
            barRatio={0.8}
            categories={{
              x: ["Your Child", "National Average"]
            }}
            data = {[
              {x: "Your Child", y: parseFloat(bedwetsAVG)},
              {x: "National Average", y: 0.3}
            ]}
            style={{
              data: { fill: (d) => d.x === "National Average" ? colors.natAvg : colors.asleepBar, }, labels: { fill: colors.highlight, fontFamily: "Futura" }
            }}
            labels={(d) => d.y}
            labelComponent={<VictoryLabel dy={30}/>}
          />
          <VictoryAxis dependentAxis tickFormat={() => ''}
            style={{fontSize: 16, axisLabel: { padding: 35, fill: colors.axis, fontFamily: "Futura" },
              axis: {stroke: colors.axis},
              tickLabels: { fill: colors.axis, fontFamily: "Futura"}
            }}/>
          <VictoryAxis independentAxis tickFormat={(x) => x}
            style={{fontSize: 16, axisLabel: { padding: 35, fill: colors.highlight, fontFamily: "Futura" },
              axis: {stroke: colors.axis},
              tickLabels: { fill: colors.axis, fontFamily: "Futura"}
            }}/>
        </VictoryChart>
        <VictoryChart
          domainPadding={80}
          >
          <VictoryLabel text="Bed Exits Per Night" x={250} y={30}
            style={{ fill: colors.axis, fontFamily: "Futura" }} fontSize={60} textAnchor="end"/>
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
              data: { fill: colors.asleepBar, fill: (d) => d.x === "National Average" ? colors.natAvg : colors.asleepBar, }, labels: { fill: colors.highlight, fontFamily: "Futura" }
            }}
            labels={(d) => d.y}
            labelComponent={<VictoryLabel dy={30}/>}
          />
          <VictoryAxis dependentAxis tickFormat={() => ''}
            style={{fontSize: 16, axisLabel: { padding: 35, fill: colors.axis, fontFamily: "Futura" },
              axis: {stroke: colors.axis},
              tickLabels: { fill: colors.axis, fontFamily: "Futura"}
            }}/>
          <VictoryAxis independentAxis tickFormat={(x) => x}
            style={{fontSize: 16, axisLabel: { padding: 35, fill: colors.highlight, fontFamily: "Futura" },
              axis: {stroke: colors.axis},
              tickLabels: { fill: colors.axis, fontFamily: "Futura"}
            }}/>
        </VictoryChart>
      </View>
      </ScrollView>
    )
  }
}
