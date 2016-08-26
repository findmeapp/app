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
import MeetupMap from './components/MeetupMap'
//import RNGMap from 'react-native-gmaps';

class FindMe extends Component {
  render(){
    return(
      <View>
        <MeetupMap />
        <CreateMeetingButton />
      </View>

    )
  }
}

AppRegistry.registerComponent('FindMe', () => FindMe);
