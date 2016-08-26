import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';
//import Button from 'react-native-button';
import Icon from 'react-native-vector-icons/FontAwesome';
import CONSTS from '../constants'
const styles = StyleSheet.create({
  btn:{
    position:'absolute',
    top:0,
    right:100,

  }
});

export default class CreateMeetingButton extends Component {
  constructor(props, context) {
    super(props, context);
  }
  _handlePress() {
    fetch(CONSTS.API_URL+'/meeting',{method:'POST'})
    //.error((error) => alert(JSON.stringify(error)))
    .then((resp)=>JSON.decode(resp))
    .then((resp)=>{
      //now that the meeting is created we must navigate to the maps
      //after the maps, render all the components
      console.log(resp);
    });
  }
  render() {
    return (
      <TouchableOpacity style={styles.btn}>
        <Icon.Button name="plus-circle" onPress={this._handlePress} />
      </TouchableOpacity>
    );
  }
};
