import './map.scss';
import template from './map.html';

const MapComponent = {
  bindings: {
    loading: '=',
    cards: '=',
    highlight: '=',
  },
  controller,
  template,
};

function controller(
  $scope,
  $http,
  $location,
  $rootScope,
  $timeout,
  dataService,
  leafletData,
  mapService,
  versionService) {
  const vm = this;

  vm.bounds = '';
  vm.center = mapService.center;
  vm.dragSearch = true;
  vm.events = {};
  vm.icon = mapService.icons.normal;
  vm.layers = mapService.layers;
  vm.markers = {};

  vm.changeVersion = changeVersion;

  vm.$onInit = () => {
    vm.events = {
      map: {
        enable: ['dragend', 'zoomend', 'click'],
        logic: 'emit',
      },
    };
    $timeout(() => {
      leafletData.getMap().then((map) => {
        map.invalidateSize();
      });
      getObjects();
    });

    $scope.$on('leafletDirectiveMap.dragend', () => {
      if (vm.loading.dragSearch) { getObjects(); }
    });

    $scope.$on('leafletDirectiveMap.zoomend', () => {
      if (vm.loading.dragSearch) { getObjects(); }
    });

    $scope.$on('leafletDirectiveMap.click', (event, args) => {
      if (versionService.getVersion() === 'nature') {
        const coords = args.leafletEvent.latlng;
        $timeout(() => { getNature(coords); });
      }
    });

    $scope.$on('leafletDirectiveMarker.click', (event, args) => {
      vm.highlight = args.modelName;
    });

    $scope.$on('centerUrlHash', (event, centerHash) => {
      $location.search({ c: centerHash });
    });

    const changeVersionListener = $rootScope.$on('changeVersion', (event, version) => changeVersion(version));
    $scope.$on('$destroy', () => changeVersionListener());
  };

  // functions

  function changeVersion(version) {
    vm.cards = [];
    vm.markers = {};
    versionService.setVersion(version);

    leafletData.getMap().then((map) => {
      version === 'nature' ?
        map.addLayer(mapService.tiles.gdos) :
        map.removeLayer(mapService.tiles.gdos);
    });
    $timeout(() => { getObjects(); });
  }

  function getObjects() {
    const version = versionService.version;
    $timeout(() => {
      if (version === 'monuments') {
        getMonuments();
      } else if (version === 'art') {
        getArt();
      }
    }, 100);
  }

  function getNature(coords) {
    if (vm.center.zoom < 12 || !vm.center) {
      vm.loading.active = false;
      vm.cards = [];
      vm.markers = {};
      vm.highlight = '';
      return;
    }

    vm.loading.active = true;
    dataService.getNature(coords).then((data) => {
      data = data.data.map(element => ({
        name: element.info.name || element.info.obiekt,
        id: element.info.kodinspire,
        type: element.layer,
      }));

      vm.cards = data;
      vm.loading.active = false;
      vm.highlight = '';
    });
  }

  function getArt() {
    if (vm.center.zoom < 12 || !vm.bounds) {
      vm.loading.active = false;
      vm.cards = [];
      vm.markers = {};
      vm.highlight = '';
      return;
    }

    if (mapService.forceMapState) {
      mapService.forceMapState = false;
      return;
    }

    vm.loading.active = true;
    dataService.getArt(vm.bounds).then((data) => {
      vm.loading.active = false;
      vm.cards = data.data.elements;
      vm.markers = {};
      vm.highlight = '';

      for(const element of data.data.elements) {
        vm.markers[element.id] = {
          lat: element.lat,
          lng: element.lon,
          icon: vm.icon,
        }
      }
    }, (data) => {
      vm.loading.active = false;
      vm.cards = [];
      // error
    });
  }

  function getMonuments() {
    if (vm.center.zoom < 12 || !vm.bounds) {
      vm.loading.active = false;
      vm.cards = [];
      vm.markers = {};
      vm.highlight = '';
      return;
    }

    if (mapService.forceMapState) {
      mapService.forceMapState = false;
      return;
    }

    vm.loading.active = true;
    dataService.getMonuments(vm.bounds).then((data) => {
      vm.loading.active = false;
      vm.cards = data;
      vm.markers = {};
      vm.highlight = '';

      for (const element of data) {
        vm.markers[element.id] = {
          lat: element.lat,
          lng: element.lon,
          icon: vm.icon,
        };
      }
    }, (data) => {
      vm.loading.active = false;
      vm.cards = [];
      // error
    });
  }
}

export default () => {
  angular
    .module('app')
    .component('wwMap', MapComponent);
};
