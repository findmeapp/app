import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View
} from 'react-native'
import update from "react-addons-update"

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

})

export default class Map extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      region: {
        latitude: (props.initialPosition||37.78825),
        longitude: (props.initialPosition||-122.4324),
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      },
      position:null,
      marker:null
      /*position:{
        coords:{
          latitude: (props.initialPosition||37.78825),
          longitude: (props.initialPosition||-122.4324),
        }
      },
      marker:{
        coords:{
          latitude:null,
          longitude:null
        }
      }*/
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this._updateCoords(position)
    },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 10000, maximumAge: 2000}
    )
    this.watchID = navigator.geolocation.watchPosition(
      (position) => {
        this._updateCoords(position)
      }
    )
    this.onRegionChangeComplete = this.onRegionChangeComplete.bind(this)
    this._setWantedLocation = this._setWantedLocation.bind(this)
    this._updateCoords = this._updateCoords.bind(this)

  }
  _updateCoords(pos){
    this.setState((previousState)=>update(previousState,{
      position:{$set:pos.coords}
      })
    )
  }
  _setWantedLocation(e){
    console.log("tapped on map")
    const press = e.nativeEvent ? e.nativeEvent : e
    console.log(press)
    this.setState((previousState)=>update(previousState,{
      marker:{$set:press.coordinate}
      })
    )
  }
  onRegionChangeComplete(e) {
    this.setState((previousState)=>update(previousState,{
      region:{$set:e}
      })
    )
  }
  componentWillUnmount(){
     navigator.geolocation.clearWatch(this.watchID)
  }
  render() {
    console.log(this.state)

    let markers = (
      this.state.position !== null? <MapView.Marker flat={false} title="You are here" coordinate={this.state.position} />:null,
      this.state.marker !== null? <MapView.Marker flat={false} title="You want to go here" coordinate={this.state.marker} />:null
    )
    return (
      <View style ={styles.container}>
                <MapView
                    ref={(ref)=>this.map = ref}
                    style={styles.map}
                    region={this.state.region}
                    onRegionChangeComplete={this.onRegionChangeComplete}
                    loadingEnabled={true}
                    onPress={this._setWantedLocation}
                    >
                    {markers}
                </MapView>

          </View>
    )
  }
}
