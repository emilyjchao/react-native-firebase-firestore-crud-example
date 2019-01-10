import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View, Text } from 'react-native';
import { List, ListItem, Button, Icon } from 'react-native-elements';
import { VictoryBar, VictoryChart, VictoryTheme, VictoryAxis } from 'victory-native';
import firebase from '../Firebase';

class BoardScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Board List',
      headerRight: (
        <Button
          buttonStyle={{ padding: 0, backgroundColor: 'transparent' }}
          icon={{ name: 'settings', style: { marginRight: 0, fontSize: 28 } }}
          onPress={() => { navigation.push('AddBoard') }}
        />
      ),
    };
  };
  constructor() {
    super();
    this.ref = firebase.firestore().collection('days');
    this.unsubscribe = null;
    this.state = {
      isLoading: true,
      boards: [],
      day: true,
    };
  }

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }

  onCollectionUpdate = (querySnapshot) => {
    const boards = [];
    querySnapshot.forEach((doc) => {
      const { day, sleep, label } = doc.data();
      boards.push({
        key: doc.id,
        doc, // DocumentSnapshot
        day,
        sleep,
        label,
      });
    });
    this.setState({
      boards,
      isLoading: false,
   });
  }
  render() {
    if(this.state.isLoading){
      return(
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff"/>
        </View>
      )
    }
    const reports = () => {
      return(this.state.day ?
        (<VictoryChart
          theme={VictoryTheme.material}
          height={130}
          maxDomain={{x:12}}
          >
            <VictoryBar data={FakeData.slice(0,1)} barWidth={20} x="day" y="sleep"  horizontal={true} />
            <VictoryAxis/>
          </VictoryChart>)
        :
        (<VictoryChart
          theme={VictoryTheme.material}
          minDomain={{x:0.5}}
          maxDomain={{x:7}}
          >
            <VictoryBar data={FakeData} x="day" y="sleep" />
          </VictoryChart>)
      )}

    return (
      <ScrollView style={styles.container}>
      <VictoryChart
          theme={VictoryTheme.material}
          height={130}
          maxDomain={{x:12}}
          >
            <VictoryBar data={this.state.boards.slice(0,1)} barWidth={20} x="day" y="sleep"  horizontal={true} />
            <VictoryAxis/>
          </VictoryChart>
        <List>
          {
            this.state.boards.map((item, i) => (
              <ListItem
                key={i}
                title={item.label}
                leftIcon={{name: 'book', type: 'font-awesome'}}
                onPress={() => {
                  this.props.navigation.navigate('BoardDetails', {
                    boardkey: `${JSON.stringify(item.key)}`,
                  });
                }}
              />
            ))
          }
        </List>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingBottom: 22
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  activity: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default BoardScreen;
