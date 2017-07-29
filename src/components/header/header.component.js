import './header.scss';
import template from './header.html';

const HeaderComponent = {
  bindings: {},
  controller,
  template,
};

function controller(
  $scope,
  $timeout,
  leafletData,
  mapService,
  versionService) {
  const vm = this;

  vm.version = versionService.getVersion;
  vm.changeVersion = changeVersion;

  // functions

  function changeVersion(version) {
    console.log('a');
    versionService.setVersion(version);

    leafletData.getMap().then((map) => {
      version === 'nature' ?
        map.addLayer(mapService.tiles.gdos) :
        map.removeLayer(mapService.tiles.gdos);
    });
    // $timeout(() => { getObjects(); });
  }
}

export default () => {
  angular
    .module('app')
    .component('wwHeader', HeaderComponent);
};
