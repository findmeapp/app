import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View
} from 'react-native'
import ProgressBarAndroid from 'ProgressBarAndroid'
import update from "react-addons-update"
import haversine from 'haversine'
import MapView from 'react-native-maps'
import CreateMeetingButton from './map/CreateMeetingButton'
import pick from 'lodash/pick'

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
    /* initial state */
    this.state = {
      gotGps:false,
      region: null,
      position:null,
      marker:null
    }

    /* Function binding (todo: redo all methods below to es6.... es6 autobinds)*/
    this.onRegionChangeComplete = this.onRegionChangeComplete.bind(this)
    this._setWantedLocation = this._setWantedLocation.bind(this)
    //this._updateCurrentPosition = this._updateCurrentPosition.bind(this)
  }
  /**
  * Destructor
  */
  componentWillUnmount(){
     navigator.geolocation.clearWatch(this.watchID)
  }
  /**
  * Puts the current position in state
  * and checks whether the map region
  * should be updated : (location is faulty
  * or the user diactivated and reactivated
  * in another location
  */
  _updateCurrentPosition = (pos) =>{

    let updatable = {
      gotGps:{$set:true},
      position:{$set:pos}
    }
    if(!this.state.gotGps)//if it's the first time we have the gps we must update the map region
      Object.assign(updatable,{region:{$set:{
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}})
    /*
    //to update the region:
    // get all corners of the maps
    // test distance with each corner with some margin
    // update if distance exceeds longitudeDelta and / or latitudeDelta
    // http://stackoverflow.com/questions/36685372/how-to-zoom-in-out-in-react-native-map
    // comparing longitude and latitudes http://stackoverflow.com/questions/15965166/what-is-the-maximum-length-of-latitude-and-longitude

    console.log(JSON.stringify(this.state.region));
    console.log(JSON.stringify(pos));
    let pos1 = pick(this.state.region,["longitude","latitude"])
    let currentLatLng = pick(pos.coords,["longitude","latitude"])


    let d = haversine(pos1,currentLatLng,{unit:"km"}) || 0
    console.log(d);
    //if distance is greater than 5km we readjust the region
    if(d>10){
        Object.assign(updatable,{
        region:{
          longitude:{$set:currentLatLng.longitude},
          latitude:{$set:currentLatLng.latitude}
        }
      })
    }*/
    this.setState((previousState)=>update(previousState,updatable))
  }
  _setWantedLocation(e){
    const press = e.nativeEvent ? e.nativeEvent : e
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

  posToLatlng = (pos) =>{
    return pick(pos.coords,["longitude","latitude"])
  }
  renderLoading = () => {
    return (
     <View style={styles.container}>
       <ProgressBarAndroid />
       <Text style={styles.instructions}>
         Receiving GPS information...
       </Text>
     </View>
   );
  }
  initTracking = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this._updateCurrentPosition(position)

    },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 2000}
    )
    this.watchID = navigator.geolocation.watchPosition(
      (position) => {
        this._updateCurrentPosition(position)
      }
    )
  }
  renderMap = () => {
    let markers = (
      //this.state.gotGps ? <MapView.Marker title="You are here" coordinate={this.posToLatlng(this.state.position)} />:null,
      this.state.marker !== null? <MapView.Marker title="You want to go here" coordinate={this.state.marker} />:null
    )
    return (
      <View style ={styles.container}>
        <MapView
          ref={(ref)=>this._map = ref}
          style={styles.map}
          region={this.state.region}
          onRegionChangeComplete={this.onRegionChangeComplete}
          loadingEnabled={true}
          onPress={this._setWantedLocation}
          showsUserLocation
          showsPointsOfInterest
          >
          {markers}
        </MapView>
        <Text>
          {JSON.stringify(this.state.position)}
        </Text>
        { this.state.marker !== null ? <CreateMeetingButton location={this.state.marker} /> : null }
      </View>
    )
  }
  render() {
    if(this.state.gotGps == false){
      this.initTracking()
      return this.renderLoading()
    }
    else{
      return this.renderMap()
    }
  }
}
