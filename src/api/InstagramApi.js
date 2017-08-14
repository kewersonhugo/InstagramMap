/* global window, localStorage */
import $ from 'jquery';
import _ from 'lodash';

const jsonpRequest = ({ url }) => new Promise(
    (resolve, reject) => {
      $.ajax({
        type: 'GET',
        url,
        dataType: 'jsonp',
        success: (response) => {
          response.data !== 'null' ? resolve(response.data) : reject(response);
        },
        error: (response) => {
          reject(response);
        },
      });
    },
  );

const searchLocationByCoordinate = ({ latitude, longitude, accessToken }) => jsonpRequest({
  url: `https://api.instagram.com/v1/locations/search?lat=${latitude}&lng=${longitude}&access_token=${accessToken}`,
});

const getRecentMediaFromLocation = ({ locationId, accessToken }) => jsonpRequest({
  url: `https://api.instagram.com/v1/locations/${locationId}/media/recent?access_token=${accessToken}`,
});

const getYourListOfFollowing = ({ accessToken }) => jsonpRequest({
  url: `https://api.instagram.com/v1/users/self/follows?access_token=${accessToken}`,
});

export const searchMediaByCoordinate = ({ latitude, longitude, accessToken }) => jsonpRequest({
  url: `https://api.instagram.com/v1/media/search?lat=${latitude}&lng=${longitude}&access_token=${accessToken}`,
});

export const getRecentMediaFromUser = ({ userId, accessToken }) => jsonpRequest({
  url: `https://api.instagram.com/v1/users/${userId}/media/recent/?access_token=${accessToken}`,
});

export const fetchFriendMediaFromCoordinate = ({ accessToken, latitude, longitude }) =>
 searchLocationByCoordinate({ accessToken, latitude, longitude })
  .then(locations => Promise.all(
    locations.map(location => getRecentMediaFromLocation({ accessToken, locationId: location.id })),
  ))
  .then(medias => Promise.all([medias, getYourListOfFollowing({ accessToken })]))
  .then(([medias, friends]) => {
    const filteredMedias = _.concat(...medias.filter(media => media && media.length > 0));
    return filteredMedias.filter(media => _.some(friends, { id: media.user.id }));
  });


const authenticateInstagram = ({ instagramClientId, instagramRedirectUri }, callback) => {
  const windowDimension = {
    popupWidth: 700,
    popupHeight: 500,
  };
  const popup = window.open('localhost', '', `width=${windowDimension.popupWidth},height=${windowDimension.popupHeight}`);
  popup.onload = () => {
    popup.open(`https://instagram.com/oauth/authorize/?client_id=${instagramClientId}&redirect_uri=${instagramRedirectUri}&response_type=token`, '_self');
    const interval = setInterval(() => {
      try {
        if (popup.location.hash.length) {
          const accessToken = popup.location.hash.slice(14);
          popup.close();
          if (typeof callback === 'function') callback(accessToken);
          clearInterval(interval);
        }
      } catch (err) {
        console.error(err);
      }
    }, 500);
  };
};

export const instagramLogin = () => new Promise(
  (resolve) => {
    authenticateInstagram({
      instagramClientId: '865208af03e24b4e9e5c5b055fea8325',
      instagramRedirectUri: 'http://localhost:3000/login/callback',
    },
      resolve,
    );
  },
);
