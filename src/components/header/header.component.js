import './header.scss';
import template from './header.html';

const HeaderComponent = {
  bindings: {},
  controller,
  template,
};

function controller(
  $rootScope,
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
    $rootScope.$emit('changeVersion', version);
  }
}

export default () => {
  angular
    .module('app')
    .component('wwHeader', HeaderComponent);
};
