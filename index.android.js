/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput
} from 'react-native';
import MapView from 'react-native-maps'
import CreateMeetingButton from './components/CreateMeetingButton'
//import RNGMap from 'react-native-gmaps';
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: 400,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  btn:{
    position:'absolute',
    top:0,
    right:100,

  }
});
class FindMe extends Component {
  render() {
    return (
      <View style ={styles.container}>
                <MapView
                    style={styles.map}
                    region={{
                        latitude: 37.78825,
                        longitude: -122.4324,
                        latitudeDelta: 0.015,
                        longitudeDelta: 0.0121,
                    }}
                    >
                </MapView>
                <CreateMeetingButton styles={styles.btn} />
            </View>
    );
  }
}

AppRegistry.registerComponent('FindMe', () => FindMe);
