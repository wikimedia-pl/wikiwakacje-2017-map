import $ from 'jquery';
import proj4 from 'proj4';

const DataService = (
  $http,
  $q) => {
  let lastCoord = {};

  const overpassApiUrl = 'http://overpass-api.de/api/interpreter';
  const monumentsApiUrl = 'https://tools.wmflabs.org/heritage/api/api.php';
  const puwgProjection = '+proj=tmerc +lat_0=0 +lon_0=19 +k=0.9993 +x_0=500000 +y_0=-5300000 +ellps=GRS80 +units=m +no_defs';

  const service = {
    getArt,
    getCity,
    getMonuments,
    getNature,
    getLastCoord,
  };

  return service;

  // functions

  function getArt(bounds, options) {
    const b = bounds;
    const bbox = [
      b.southWest.lat,
      b.southWest.lng,
      b.northEast.lat,
      b.northEast.lng,
    ].join(',');

    return $http(angular.extend({}, {
      method: 'POST',
      url: overpassApiUrl,
      data: `[out:json][timeout:25];
        (
          node["historic"="wayside_shrine"](${bbox});
          node["historic"="memorial"](${bbox});
          node["historic"="monument"](${bbox});
          node["man_made"="cross"](${bbox});
          node["tourism"="artwork"](${bbox});
        );
      out body; >; out skel qt;`,
    }, options));
  }

  function getCity(name) {
    return $http({
      method: 'GET',
      url: 'http://nominatim.openstreetmap.org/search',
      params: {
        format: 'json',
        countrycodes: 'pl',
        city: name,
        dedupe: 1,
      },
    });
  }

  function getMonuments(bounds, options) {
    const b = bounds;
    const bbox = [
      b.southWest.lng,
      b.southWest.lat,
      b.northEast.lng,
      b.northEast.lat,
    ].join(',');

    return $q((resolve, reject) => {
      $.ajax({
        type: 'GET',
        url: monumentsApiUrl,
        data: {
          action: 'search',
          format: 'json',
          limit: '100',
          //callback: 'jsonCallback',
          srcountry: 'pl',
          bbox,
        },
        async: false,
        //jsonpCallback: 'jsonCallback',
        contentType: 'application/json',
        dataType: 'jsonp',
        success: (data) => {
          resolve(data.monuments ? data.monuments : false);
        },
        error: (data) => {
          reject(data);
        },
      });
    });
  }

  function getNature(coords) {
    lastCoord = coords;
    const coor = proj4('WGS84', puwgProjection, [coords.lng, coords.lat]);

    return $http({
      method: 'GET',
      url: 'gdos.php',
      params: { x: coor[0], y: coor[1] },
    });
  }

  function getLastCoord() {
    return lastCoord;
  }
};

export default () => {
  angular
    .module('app')
    .factory('dataService', DataService);
}
