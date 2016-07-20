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
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: 400,
    width: 400,
    // justifyContent: 'flex-end',
    // alignItems: 'center',
  }
});
class FindMe extends Component {
  render() {
    return (
      <View>
        <MapView
          loadingEnabled = {true}
          style = {styles.map}
         />
         <CreateMeetingButton/>
         </View>
    );
  }
}

AppRegistry.registerComponent('FindMe', () => FindMe);
