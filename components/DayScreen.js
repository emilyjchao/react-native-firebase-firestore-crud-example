import React, { Component } from 'react';
import { Alert, StyleSheet, ScrollView, ActivityIndicator, Image, View, TouchableOpacity, Text } from 'react-native';
import { List, ListItem, Button, Icon } from 'react-native-elements';
import { VictoryBar, VictoryLine, VictoryArea, VictoryChart, VictoryStack, VictoryScatter, VictoryTheme, VictoryAxis, LineSegment, VictoryLabel } from 'victory-native';
import styles from './style';


 class DayDetail extends Component {
   constructor(props) {
     super();
   }

   render () {
     //Set up stack daily view sleep data
     let ySleep = [];
     let in_out = [];
     for (i=0; i<this.props.boards[this.props.picked].enters.length; i++) {
       //Set x and y data arrays
       if (this.props.boards[this.props.picked].exited[i]) {
         //For line graph
         in_out.push("1"); //1 represents in bed
         ySleep.push(new Date(this.props.boards[this.props.picked].enters[i]));
         in_out.push("0");
         ySleep.push(new Date(this.props.boards[this.props.picked].exited[i]));
       }
       if (i+1 < this.props.boards[this.props.picked].enters.length) {
         //For line graph
         in_out.push("0"); //0 represents out of bed
         ySleep.push(new Date(this.props.boards[this.props.picked].exited[i]));
         in_out.push("1");
         ySleep.push(new Date(this.props.boards[this.props.picked].enters[i+1]));
       }
     }
     //Build text to display for bedwetting table
     let bedWetContent;
     if(this.props.boards[this.props.picked].bedwet.length > 0){
       let wetTime = new Date(this.props.boards[this.props.picked].bedwet[0]);
       bedWetContent = "Wet     " + wetTime.getHours() + ":" + (wetTime.getMinutes()<10?'0':'') + wetTime.getMinutes() ;
     }
     else {
       bedWetContent = "Dry";
     }

    return(<View>
    <View style={styles.triplet}>
      <Button
        buttonStyle={{ marginTop:  30, backgroundColor: 'transparent' }}
        icon={{ name: 'arrow-back', style: { marginRight: 0, fontSize: 28, color: 'black'} }}
        onPress={() => this.props.changePicked(-1)}
      />
      <Text style={styles.blackText}>{"\n"}{this.props.boards[this.props.picked].day}</Text>
      <Button
        buttonStyle={{ marginTop: 30, backgroundColor: 'transparent' }}
        icon={{ name: 'arrow-forward', style: { marginRight: 0, fontSize: 28, color: 'black'} }}
        onPress={() => this.props.changePicked(1)}
      />
    </View>
    <Text style={styles.title}>Time Asleep: {(this.props.boards[this.props.picked].sleep).toFixed(2)} hours</Text>
    //Chart of daily sleep length
    <VictoryChart
      height={130}
      scale={{ x: "time" }}
      //animate={{ duration: 10 }}
      >
      <VictoryArea
        data={ySleep, in_out}
        interpolation="step"
        style={{
          data: { stroke: "steelblue", fill: "steelblue" },
        }}
        />
      <VictoryAxis label="Time" style={{fontSize: 16, axisLabel: { padding: 30 }}}/>
      <VictoryAxis dependentAxis
        style={{
          axisLabel: { padding: 10},
          fontSize: 16,
          transform: [{ rotate: '90deg'}]
        }}
        tickFormat={() => ''}
        />
    </VictoryChart>
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
    //Line graph of restlessness
    <VictoryChart
      height={150}
      domainPadding={{ x : [20, 20] }}
      scale={{ x: "time" }}
      //animate={{ duration: 10 }}
      >
      <VictoryLine
        interpolation="natural"
        style={{
          data: { stroke: "steelblue" },
        }}
        data = {this.props.boards[this.props.picked].restTime, this.props.boards[this.props.picked].restNum}
        />
      <VictoryAxis
        label={"Time"}
        //tickFormat={restlessXLabel}
        fixLabelOverlap
        />
      <VictoryAxis dependentAxis
        label="Low     High"
        style={{
          axisLabel: { padding: 10},
          fontSize: 16,
          transform: [{ rotate: '90deg'}]
        }}
        tickFormat={() => ''}
        />
    </VictoryChart>

    <View style={styles.appContainer}>
    <TouchableOpacity
      onPress={() => {Alert.alert('The Bedwet section shows the time of a bedwetting incident if there was one.')}}
      style={styles.button1}>
        <View style={styles.btnContainer}>
          <Text style={styles.title}>Bedwet</Text>
          <Image source={require('./about.png')} style={styles.icon} />
        </View>
      </TouchableOpacity>
    </View>
    <Text style={styles.brightText}>{bedWetContent}</Text>

    //Table for bed exits
    <View style={styles.appContainer}>
    <TouchableOpacity
      onPress={() => {Alert.alert('The Bed Exit section displays the time and duration of each time your child exited the bed.')}}
      style={styles.button1}>
        <View style={styles.btnContainer}>
          <Text style={styles.title}>Bed Exits</Text>
          <Image source={require('./about.png')} style={styles.icon} />
        </View>
      </TouchableOpacity>
    </View>
    <Text style={styles.brightText}>Time{'\t\t'}  Minutes</Text>
    // This code for rendering table is from:
    // https://stackoverflow.com/questions/44357336/setting-up-a-table-layout-in-react-native
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {
        this.props.boards[this.props.picked].exited.map((time, index) => { // This will render a row for each data element.
          if (index != this.props.boards[this.props.picked].exited.length-1){
          var exitTime = new Date(time);
          var enterTime = new Date(this.props.boards[this.props.picked].enters[index + 1]);
          var dif = new Date(enterTime-exitTime);
          var timeOut = dif / (60000);

          return (
              <Text key={time} style={styles.brightTextLeft}>
                {'                  '}{exitTime.getHours()}:{(exitTime.getMinutes()<10?'0':'') + exitTime.getMinutes() }{'           '}{Number(timeOut).toFixed(1)}
              </Text>
          );
          }
        })
      }
      </View>
    </View>);

  }
}

export default DayDetail;
