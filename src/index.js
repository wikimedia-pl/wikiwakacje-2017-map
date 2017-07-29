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
  $mdThemingProvider.generateThemesOnDemand(true);
  $mdThemingProvider.alwaysWatchTheme(true);
  $provide.value('themeProvider', $mdThemingProvider);
}

const MainComponent = {
  bindings: {},
  controller,
  template: () => template,
};

function controller(
  $scope,
  $mdTheming,
  $timeout,
  dataService,
  versionService) {
  const vm = this;

  vm.cards = [];
  vm.highlight = '';
  vm.loading = {};

  initialize();

  // functions

  function initialize() {
    vm.loading = {
      active: false,
      map: true,
      dragSearch: true,
    };

    versionService.setVersion('monuments');
    $timeout(() => { vm.loading.map = false; }, 2000);
  }
}

const template = `<md-toolbar class="md-hue-2">
      <div class="md-toolbar-tools">
        <md-button class="md-icon-button" aria-label="Settings" ng-disabled="true">
          <md-icon>menu</md-icon>
        </md-button>
        <h2>
          <a href="http://wikiwakacje.pl">Wikiwakacje</a>
        </h2>
        <span flex></span>
      </div>
    </md-toolbar>
    <div class="ww-container" layout="row">
      <ww-sidebar flex="40"
                  cards="$ctrl.cards"
                  loading="$ctrl.loading"
                  highlight="$ctrl.highlight"></ww-sidebar>
      <ww-map flex layout="column"
              ng-if="!$ctrl.loading.map"
              cards="$ctrl.cards"
              loading="$ctrl.loading"
              highlight="$ctrl.highlight"></ww-map>
      <div flex ng-if="$ctrl.loading.map">Loading map...</div>
    </div>`;

angular
  .module('app')
  .component('appMain', MainComponent);

components();
services();
