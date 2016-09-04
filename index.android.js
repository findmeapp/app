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
import App from './components/App'
import MapView from 'react-native-maps'

class FindMe extends Component {
  render(){
    return(
      <App />
    )
  }
}

AppRegistry.registerComponent('FindMe', () => FindMe);
