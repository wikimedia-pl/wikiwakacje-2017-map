import angular from 'angular';

import 'angular-material';
import 'leaflet';
import 'angular-leaflet-directive';

import 'angular-material/angular-material.css';
import 'material-design-icons/iconfont/material-icons.css';
import 'leaflet/dist/leaflet.css';
import './styles/style.scss';

import components from './components';
import services from './services';

angular
  .module('app', ['ngMaterial', 'leaflet-directive'])
  .config(themeConfig);

function themeConfig($mdThemingProvider, $provide) {
  // $mdThemingProvider.generateThemesOnDemand(true);
  // $mdThemingProvider.alwaysWatchTheme(true);
  $provide.value('themeProvider', $mdThemingProvider);
}

components();
services();
