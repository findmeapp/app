import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import update from "react-addons-update";

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
      region: {
        latitude: (props.initialPosition||37.78825),
        longitude: (props.initialPosition||-122.4324),
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      },
      position:{
        coords:{
          latitude: (props.initialPosition||37.78825),
          longitude: (props.initialPosition||-122.4324),
        }
      }
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this._updateCoords(position);
    },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 1000, maximumAge: 1000}
    );
    this.watchID = navigator.geolocation.watchPosition(
      (position) => {
        let lastPosition = JSON.stringify(position);
        console.log(lastPosition);
        this._updateCoords(position);
      }
    );
    this.onRegionChange = this.onRegionChange.bind(this);
  }
  _updateCoords(pos){
    this.setState((previousState)=>update(previousState,{
      region:{
        latitude:{$set:pos.coords.latitude},
        longitude:{$set:pos.coords.longitude}
      },
      position:{$set:pos}
      })
    );
  }
  onRegionChange(e) {
    console.log(e);
    this.setState({ region:e });
  }
  componentWillUnmount(){
     navigator.geolocation.clearWatch(this.watchID);
  }
  render() {
    //console.log(this.state);
    return (
      <View style ={styles.container}>
                <MapView
                    ref="map"
                    style={styles.map}
                    region={this.state.region}
                    onRegionChange={this.onRegionChange}

                    >
                    <MapView.Marker flat={false} title="You are here" coordinate={this.state.position.coords} />
                </MapView>

          </View>
    );
  }
}
