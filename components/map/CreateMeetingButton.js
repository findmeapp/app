// some inspiration
// http://blog.diatomenterprises.com/react-native-maps/
 // https://medium.com/@lennyboyatzis/run-rabbit-run-path-tracking-with-react-native-and-the-geolocation-api-299227a9e241#.vfn0ibhjm
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';
//import Button from 'react-native-button';
import Icon from 'react-native-vector-icons/FontAwesome';
import CONSTS from '../../constants'
const styles = StyleSheet.create({
  btn:{
    position:'absolute',
    top:0,
    right:100,

  }
});

export default class CreateMeetingButton extends Component {
  static propTypes = {
    location:React.PropTypes.object.isRequired,
  }
  constructor(props, context) {
    super(props, context);
    //this._handlePress = this._handlePress.bind(this)
  }
  _handlePress = () => {

    fetch(CONSTS.API_URL+'/meetup',{
      method:'POST',
      body:JSON.stringify({
        user:1,
        people:[0,2],
        location:this.props.location
      })
    })
    .then((res)=>res.json())
    .then((resp)=>{
      //now that the meeting is created we must navigate to the maps
      //after the maps, render all the components
      console.log(JSON.stringify(resp));
    })
    .catch((resp)=>{
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
