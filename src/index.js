import angular from 'angular';

import 'angular-material';
import 'leaflet';
import 'leaflet.markercluster';
import 'angular-leaflet-directive';

import 'angular-material/angular-material.css';
import 'material-design-icons/iconfont/material-icons.css';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import './styles/style.scss';

import components from './components';
import services from './services';

angular
  .module('app', ['ngMaterial', 'leaflet-directive'])
  .config(themeConfig);

/**
 * Config of material design theme
 *
 * @param {any} $mdThemingProvider
 * @param {any} $provide
 */
function themeConfig($mdThemingProvider, $provide) {
  const tp = $mdThemingProvider;
  tp.theme('default')
    .primaryPalette('blue-grey')
    .accentPalette('red');

  $provide.value('themeProvider', tp);
}

components();
services();
