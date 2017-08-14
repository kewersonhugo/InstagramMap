/* global navigator, localStorage */

import React, { Component } from 'react';
import L from 'leaflet';
import Autocomplete from 'react-google-autocomplete';
import ReactModal from 'react-modal';
import SimpleLeafletMap from './SimpleLeafletMap';
import { fetchFriendMediaFromCoordinate, instagramLogin } from '../api/InstagramApi';


class App extends Component {

  constructor() {
    super();
    this.state = {
      showModal: true,
      accessToken: null,
      userPosition: null,
      mediaList: [],
    };

    this.getCoordinatesFromPlace = this.getCoordinatesFromPlace.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  componentWillMount() {
    const COORDS_FORTALEZA = L.latLng(-3.794756, -38.49503600000003);
    const currentGeolocation = this.getCoordinatesFromGeolocation();
    this.setUserPosition(currentGeolocation || COORDS_FORTALEZA);
  }

  setUserPosition(position) {
    console.log(position);
    if (position) {
      this.setState({ userPosition: position }, () => {
        fetchFriendMediaFromCoordinate({
          accessToken: localStorage.getItem('accessToken'),
          latitude: position.lat,
          longitude: position.lng,
        })
        .then((response) => {
          console.log(response);
          this.setState({ mediaList: response });
        })
        .catch(response => console.log(response));
      });
    }
  }

  getCoordinatesFromGeolocation() {
    return navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!position.coords) {
          return;
        }
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        return L.latLng(latitude, longitude);
      },
    );
  }

  getCoordinatesFromPlace(place) {
    if (place.geometry) {
      const latitude = place.geometry.location.lat();
      const longitude = place.geometry.location.lng();
      this.setUserPosition(L.latLng(latitude, longitude));
    }
  }

  handleLogin() {
    instagramLogin()
    .then((accessToken) => {
      this.setState({ showModal: false });
      localStorage.setItem('accessToken', accessToken);
    });
  }

  render() {
    const autocompleteStyle = {
      height: '50px',
      width: '500px',
      maxWidth: '80%',
      position: 'absolute',
      textAlign: 'center',
      fontSize: '18px',
      marginTop: '30px',
      left: '50%',
      transform: 'translate(-50%)',
      zIndex: '500',
      border: '2px solid rgba(0, 0, 0, 0.2)',
      borderRadius: '4px',
      boxShadow: '0 0 5px 0 rgba(0, 0, 0, 0.65)',
    };

    const modalStyle = {
      overlay: {
        zIndex: '1000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      content: {
        position: 'relative',
        width: '100px',
        height: '50px',
      },
    };

    return (
      <div style={{ height: '100%' }}>
        <ReactModal
          isOpen={this.state.showModal}
          contentLabel="Example Modal"
          style={modalStyle}
        >
          <button
            onClick={this.handleLogin}
            style={{
              width: '100%',
              height: '100%',
            }}
          >Login Instagram</button>
        </ReactModal>
        <Autocomplete
          onPlaceSelected={this.getCoordinatesFromPlace}
          types={['geocode', 'establishment']}
          componentRestrictions={{ country: 'BR' }}
          placeholder={'Digite sua localização'}
          style={autocompleteStyle}
        />
        <SimpleLeafletMap
          userPosition={this.state.userPosition}
          zoom={18}
          mediaList={this.state.mediaList}
        />
      </div>
    );
  }
}

export default App;
