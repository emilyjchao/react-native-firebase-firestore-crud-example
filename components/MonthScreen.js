import React, { Component } from 'react';
import { Alert, StyleSheet, ScrollView, ActivityIndicator, Image, View, TouchableOpacity, Text } from 'react-native';
import { List, ListItem, Button, Icon } from 'react-native-elements';
import { VictoryBar, VictoryLine, VictoryArea, VictoryChart, VictoryStack, VictoryScatter, VictoryTheme, VictoryAxis, LineSegment, VictoryLabel } from 'victory-native';
import styles from './style';


class MonthDetail extends Component {
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
      {this.props.tutorial ?
        <Text style={styles.smallText}>The monthly view contains the same metrics
          as the weekly view but is organized per month.
        </Text> : ""
      }
      <View style={styles.triplet}>
        {this.props.moreMonths(-1) ?
          <Button
            buttonStyle={{ marginTop:  30, backgroundColor: 'transparent' }}
            icon={{ name: 'arrow-back', style: { marginRight: 0, fontSize: 28, color: 'black'} }}
            onPress={() => this.props.changeMonth(-1)}
          /> :
          <Button
            buttonStyle={{ marginTop:  30, backgroundColor: 'transparent' }}
            icon={{ name: 'arrow-back', style: { marginRight: 0, fontSize: 28, color: 'transparent'} }}
            onPress={() => this.props.changeMonth(-1)}
          />
        }
        <Text style={styles.blackText}>{"\n"}{this.props.boards[0].day.split("-")[0]}{"-"}{this.props.boards[0].day.split("-")[2]}</Text>
        {this.props.moreMonths(1) ?
          <Button
            buttonStyle={{ marginTop: 30, backgroundColor: 'transparent' }}
            icon={{ name: 'arrow-forward', style: { marginRight: 0, fontSize: 28, color: 'black'} }}
            onPress={() => this.props.changeMonth(1)}
          /> :
          <Button
            buttonStyle={{ marginTop: 30, backgroundColor: 'transparent' }}
            icon={{ name: 'arrow-forward', style: { marginRight: 0, fontSize: 28, color: 'transparent'} }}
            onPress={() => this.props.changeMonth(1)}
          />
        }
      </View>

      <View>
        <View style={styles.appContainer}>
          <TouchableOpacity
            onPress={() => {Alert.alert('Click a bar to see daily details. \n \n Bars = hours asleep \n Points = hours in bed ')}}            style={styles.button1}>
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
          >
          <VictoryBar
            data = {this.props.boards}
            x="dateLabel" y="sleep"
            //labels={weekLabels}
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
            label="Sleep"
            style={{
              axisLabel: { fontSize: 18 },
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


        </View> // whole view after arrows tripleToggle
      </View>
    );
    }
  }

export default MonthDetail;
