import '../../images/logo.png';

import './header.scss';
import template from './header.html';

const HeaderComponent = {
  bindings: {},
  controller,
  template,
};

function controller(
  $rootScope,
  dataService,
  versionService) {
  const vm = this;

  vm.searchInput = null;
  vm.searchResults = null;

  vm.changeVersion = changeVersion;
  vm.search = search;

  // functions

  function changeVersion(version) {
    versionService.setVersion(version);
    $rootScope.$emit('changeVersion');
  }

  function search() {
    if (!vm.searchInput) {
      vm.searchResults = null;
      return;
    }
    dataService.getCity(vm.searchInput).then((data) => {
      vm.searchResults = data.data;
    });
  }
}

export default () => {
  angular
    .module('app')
    .component('wwHeader', HeaderComponent);
};
