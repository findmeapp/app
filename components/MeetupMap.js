import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

import MapView from 'react-native-maps'

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

});

export default class Map extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      pos: {
        latitude: (props.initialPosition||37.78825),
        longitude: (props.initialPosition||-122.4324)
      }
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        let initialPosition = JSON.stringify(position);
        this.setState({pos:position.coords});
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 1000, maximumAge: 1000}
    );
    this.watchID = navigator.geolocation.watchPosition(
      (position) => {
        let lastPosition = JSON.stringify(position);
        console.log(lastPosition);
        this.setState({pos:position.coords});
      }
    );

  }

  componentWillUnmount(){
     navigator.geolocation.clearWatch(this.watchID);
  }
  render() {
    console.log(this.state);
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
                    <MapView.Marker title="You are here" coordinate={this.state.pos} />
                </MapView>

          </View>
    );
  }
}
