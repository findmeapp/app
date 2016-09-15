import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View
} from 'react-native'
import ProgressBar from 'ProgressBarAndroid'
import update from "react-addons-update"
import haversine from 'haversine'
import MapView from 'react-native-maps'
import CreateMeetingButton from './map/CreateMeetingButton'
import pick from 'lodash/pick'
import BackgroundGeolocation from 'react-native-mauron85-background-geolocation';
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
  centering: { alignItems: 'center', justifyContent: 'center', padding: 8, }
})
/* TODO:
 - update region of map if gps latlng are 20% of zoomLevel away from the 4 corners of the region the map is on
 - function binding in constructor
 - handle background location tracker
 - add on press CreateMeetingBUtton
          - destruct forground geolocation tracker
          - enable background location tracker
*/
export default class Map extends Component {
  constructor(props, context) {
    super(props, context)
    /* initial state */
    this.state = {
      gotGps:false,
      region: null,
      position:null,
      marker:null,
      locations: [],
      isTracking:false,
      isSelectingMeetup:true,
      selectedMeetupDestination:false
    }

    /* Function binding (todo: redo all methods below to es6.... es6 autobinds)*/
    this.onRegionChangeComplete = this.onRegionChangeComplete.bind(this)
    this._setWantedLocation = this._setWantedLocation.bind(this)

  }
  /**
  * Puts the current position in state
  * and checks whether the map region
  * should be updated : (location is faulty
  * or the user diactivated and reactivated
  * in another location
  */
  _handleLocationUpdates(pos) {
    let updatable = {
      gotGps:{$set:true},
      position:{$set:pos}
    }
    if(!this.state.isTracking)
    //it's the first time we have the gps we must update the map region
      Object.assign(updatable,{region:{$set:{
        latitude: pos.latitude,
        longitude: pos.longitude,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      }}})

    //TODO: update the region:
    // get all corners of the maps
    // test distance with each corner with some margin
    // update if distance exceeds longitudeDelta and / or latitudeDelta
    // http://stackoverflow.com/questions/36685372/how-to-zoom-in-out-in-react-native-map
    // comparing longitude and latitudes http://stackoverflow.com/questions/15965166/what-is-the-maximum-length-of-latitude-and-longitude

    this.setState((previousState)=>update(previousState,updatable))

  }
  toggleTracking = () => {
    if (this.state.isTracking) {
      this.stopBackgroundTracking();
    } else {
      this.startBackgroundTracking();
    }
  }
  startBackgroundTracking = () => {
    if (this.state.isTracking) { return; }

    BackgroundGeolocation.isLocationEnabled((enabled) => {
      if (enabled) {
        BackgroundGeolocation.start(
          () => {
            // service started successfully
            // you should adjust your app UI for example change switch element to indicate
            // that service is running
            console.log('[DEBUG] BackgroundGeolocation started successfully');
            this.setState({ isTracking: true, gotGps:true });
          },
          (error) => {
            // Tracking has not started because of error
            // you should adjust your app UI for example change switch element to indicate
            // that service is not running
            if (error.code === 2) {
              BackgroundGeolocation.showAppSettings();
            } else {
              console.log('[ERROR] Start failed: ' + error.message);
            }
            this.setState({ isTracking: false });
          }
        );
      } else {
        // Location services are disabled
        BackgroundGeolocation.showLocationSettings();
      }
    });
  }

  stopBackgroundTracking = () => {
    if (!this.state.isTracking) { return; }

    BackgroundGeolocation.stop();
    this.setState({ isTracking: false });
  }
  /**
  * Destructor
  */
  componentWillUnmount(){
     navigator.geolocation.clearWatch(this.watchID)
  }
  componentWillMount = () => {
    //start foreground tracking
    //this._initForgroundTracking()
    //configure background tracking
    function logError (msg) {
      console.log(`[ERROR] getLocations: ${msg}`);
    }
    function handleHistoricLocations (locations) {
      let region = {};
      const now = Date.now();
      const latitudeDelta = 0.01;
      const longitudeDelta = 0.01;
      const sameDayDiffInMillis = 24 * 3600 * 1000;
      const currentLocations = this.state.locations.slice(0);
      let locationsCount = currentLocations.length;

      locations.forEach((location, idx) => {
        if ((now - location.time) <= sameDayDiffInMillis) {
          region = Object.assign({}, location, { latitudeDelta, longitudeDelta });
          const histLocation = Object.assign({}, location, { key: locationsCount++ });
          console.log('[DEBUG] historic location', JSON.stringify(histLocation));
          currentLocations.push(histLocation);
        }
      });
      if (currentLocations.length > 0) {
        this.setState({ locations: currentLocations, region });
      }
    }

    BackgroundGeolocation.getLocations(handleHistoricLocations.bind(this), logError);
    BackgroundGeolocation.configure({
      desiredAccuracy: 10,
      stationaryRadius: 50,
      distanceFilter: 50,
      debug: false,
      locationProvider: BackgroundGeolocation.provider.ANDROID_DISTANCE_FILTER_PROVIDER,
      interval: 30000,
      fastestInterval: 5000,
      stopOnStillActivity: true,
      stopOnTerminate: true,
      url: 'http://localhost:8080/locations',
      syncThreshold: 50,
      maxLocations: 200,
      httpHeaders: {
        'X-FOO': 'bar'
      }
    });
    BackgroundGeolocation.on('location',this._handleLocationUpdates.bind(this))

    this.startBackgroundTracking();
    //this.toggleTracking()
  }


  /**
  * Puts the current position in state
  * and checks whether the map region
  * should be updated : (location is faulty
  * or the user diactivated and reactivated
  * in another location
  */
  // _updateForgroundCurrentPosition = (pos) =>{
  //
  //   let updatable = {
  //     gotGps:{$set:true},
  //     position:{$set:pos}
  //   }
  //   if(!this.state.gotGps)
  //   //it's the first time we have the gps we must update the map region
  //     Object.assign(updatable,{region:{$set:{
  //       latitude: pos.coords.latitude,
  //       longitude: pos.coords.longitude,
  //       latitudeDelta: 0.05,
  //       longitudeDelta: 0.05,
  //     }}})
  //
  //   //TODO: update the region:
  //   // get all corners of the maps
  //   // test distance with each corner with some margin
  //   // update if distance exceeds longitudeDelta and / or latitudeDelta
  //   // http://stackoverflow.com/questions/36685372/how-to-zoom-in-out-in-react-native-map
  //   // comparing longitude and latitudes http://stackoverflow.com/questions/15965166/what-is-the-maximum-length-of-latitude-and-longitude
  //
  //   this.setState((previousState)=>update(previousState,updatable))
  // }
  _setWantedLocation(e){
    const press = e.nativeEvent ? e.nativeEvent : e
    this.setState({
        marker:press.coordinate,
        selectedMeetupDestination:true
      })
  }
  onRegionChangeComplete(e) {
    this.setState((previousState)=>update(previousState,{
      region:{$set:e}
      })
    )
  }

  // posToLatlng = (pos) =>{
  //   return pick(pos.coords,["longitude","latitude"])
  // }

  // /**
  //  * Start foreground tracking
  //  */
  // _initForgroundTracking = () => {
  //   /*
  //    * Todo refactor using https://www.npmjs.com/package/react-native-mauron85-background-geolocation
  //    * it runs in background and updates a certain website
  //    */
  //
  //   navigator.geolocation.getCurrentPosition(
  //     (position) => {
  //       this._updateForgroundCurrentPosition(position)
  //
  //   },
  //     (error) => alert(JSON.stringify(error)),
  //     {enableHighAccuracy: true, timeout: 20000, maximumAge: 2000}
  //   )
  //   this.watchID = navigator.geolocation.watchPosition(
  //     (position) => {
  //       this._updateForgroundCurrentPosition(position)
  //     }
  //   )
  // }
  /** Render functions **/
  renderLoading = () => {
    return (
     <View style={styles.container}>
       <ProgressBar />
       <Text style={styles.instructions}>
         Receiving GPS information...
       </Text>
     </View>
   );
  }
  renderMap = () => {
    let markers = (
      //this.state.gotGps ? <MapView.Marker title="You are here" coordinate={this.posToLatlng(this.state.position)} />:null,
      this.state.selectedMeetupDestination ? <MapView.Marker title="You want to go here" coordinate={this.state.marker} />:null
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
  /**
   * Render the map component
   */
  render() {
    console.log(this.state);
    if(this.state.gotGps == false){
      return this.renderLoading()
    }
    else{
      return this.renderMap()
    }
  }
}
