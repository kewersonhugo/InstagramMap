import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

class SimpleLeafletMap extends PureComponent {
  render() {
    const style = {
      width: '100vw',
      height: '100vh',
    };

    const userPosition = this.props.userPosition;
    const zoom = this.props.zoom;
    const userIcon = L.icon({
      iconUrl: '../images/pin.png',
      iconSize: [50, 50],
    });

    return (
      <Map
        center={userPosition}
        zoom={zoom}
        style={style}
      >
        <TileLayer url="http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png" />

        <Marker position={userPosition} icon={userIcon} zIndexOffset={100} />

        {this.props.mediaList.map(media => (
          <Marker
            key={media.id}
            position={{
              lat: media.location.latitude,
              lng: media.location.longitude,
            }}
            icon={L.icon({
              iconUrl: media.images.thumbnail.url,
              iconSize: [50, 50],
            })}
          >
            <Popup>
              <div style={{
                width: '200px',
                height: '200px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              >
                <h3>{media.user.full_name}</h3>
                <img
                  src={media.user.profile_picture}
                  alt={'User Profile'}
                  style={{
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    border: '2px solid rgba(0,0,0,0.2)',
                  }}
                />
              </div>
            </Popup>
          </Marker>
        ))}
      </Map>
    );
  }
}

SimpleLeafletMap.defaultProps = {
  zoom: 13,
  mediaList: [],
};

SimpleLeafletMap.propTypes = {
  userPosition: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
  zoom: PropTypes.number,
  mediaList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      location: PropTypes.shape({
        latitude: PropTypes.number.isRequired,
        longitude: PropTypes.number.isRequired,
      }),
    }),
  ),
};

export default SimpleLeafletMap;
