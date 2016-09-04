import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput
} from 'react-native';

import MeetupMap from './MeetupMap'

export default class FindMe extends Component {
  render(){
    return(
      <MeetupMap />
    )
  }
}
